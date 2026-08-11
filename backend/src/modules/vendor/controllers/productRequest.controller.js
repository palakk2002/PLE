import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductRequest from '../../../models/ProductRequest.model.js';
import Notification from '../../../models/Notification.model.js';

// @desc    Get product requests visible to the vendor
// @route   GET /api/vendor/product-requests
// @access  Private (Vendor / Managed Vendor)
export const getVendorProductRequests = asyncHandler(async (req, res) => {
    const { type, status, page = 1, limit = 10 } = req.query;

    const isIndependentVendor = req.user.role === 'vendor';
    const isManagedVendor = req.user.role === 'managed_vendor';
    const sellerId = req.user._id || req.user.id;

    let visibilityFilter = {};

    if (isIndependentVendor) {
        // Must be explicitly assigned in assignedVendors OR be target of shop_specific
        visibilityFilter = {
            $or: [
                { 'assignedVendors.vendorId': sellerId },
                { requestType: 'SHOP_SPECIFIC', targetEntityType: 'Vendor', targetEntityId: sellerId }
            ]
        };
    } else if (isManagedVendor) {
        if (!req.user.shopId) {
            throw new ApiError(400, 'Managed vendor is not assigned to a shop.');
        }
        visibilityFilter = {
            $or: [
                { 'assignedVendors.vendorId': req.user.shopId },
                { requestType: 'SHOP_SPECIFIC', targetEntityType: 'ManagedShop', targetEntityId: req.user.shopId }
            ]
        };
    } else {
        throw new ApiError(403, 'Unauthorized access.');
    }

    const filter = { ...visibilityFilter };

    // Apply status filter
    if (status) {
        if (status === 'Pending') {
            filter.status = { $in: ['Submitted', 'Under Review', 'Vendor Sourcing'] };
        } else {
            filter.status = status;
        }
    }

    // Apply type filter (All, General, Direct)
    if (type === 'General') {
        filter.requestType = 'GENERAL';
    } else if (type === 'Direct') {
        filter.requestType = 'SHOP_SPECIFIC';
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await ProductRequest.countDocuments(filter);
    const requests = await ProductRequest.find(filter)
        .populate('userId', 'name email')
        .populate({
            path: 'targetEntityId',
            select: 'storeName storeLogo rating address name logo location'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    res.status(200).json(
        new ApiResponse(200, {
            requests,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        }, 'Product requests fetched successfully')
    );
});

// @desc    Respond to a product request
// @route   PUT /api/vendor/product-requests/:id/respond
// @access  Private (Vendor / Managed Vendor)
export const respondToProductRequest = asyncHandler(async (req, res) => {
    const { responseType, offeredPrice, deliveryTimeline, message } = req.body;

    if (!responseType || !message) {
        throw new ApiError(400, 'Please provide responseType and message.');
    }

    const request = await ProductRequest.findOne({ requestId: req.params.id });

    if (!request) {
        throw new ApiError(404, 'Product request not found.');
    }

    const isIndependentVendor = req.user.role === 'vendor';
    const isManagedVendor = req.user.role === 'managed_vendor';
    const sellerId = req.user._id || req.user.id;

    // Validate ownership/authorization
    if (request.requestType === 'SHOP_SPECIFIC') {
        if (request.targetEntityType === 'Vendor') {
            if (!isIndependentVendor || String(request.targetEntityId) !== String(sellerId)) {
                throw new ApiError(403, 'Unauthorized. This request was directed to another seller.');
            }
        } else if (request.targetEntityType === 'ManagedShop') {
            if (!isManagedVendor || String(request.targetEntityId) !== String(req.user.shopId)) {
                throw new ApiError(403, 'Unauthorized. This request was directed to another shop.');
            }
        }
    } else {
        // For general sourcing, make sure they are in assignedVendors list
        const isAssigned = request.assignedVendors.some(v => String(v.vendorId) === String(sellerId));
        if (!isAssigned) {
            throw new ApiError(403, 'Unauthorized. You are not assigned to bid on this request.');
        }
    }

    // 2. Validate current stock of vendor's product before accepting response
    const { default: Product } = await import('../../../models/Product.model.js');
    const vendorProduct = await Product.findOne({
        vendorId: sellerId,
        name: { $regex: new RegExp(request.productName, 'i') },
        isActive: true
    });

    let finalResponseType = responseType;
    if (responseType === 'Can Supply') {
        if (!vendorProduct || vendorProduct.stockQuantity <= 0 || vendorProduct.stock === 'out_of_stock') {
            finalResponseType = 'Cannot Supply';
        } else if (vendorProduct.stockQuantity < request.quantity) {
            // Partial stock is acceptable but let's log/inform
        }
    }

    // Add to legacy sellerResponses array for B2B user view
    request.sellerResponses.push({
        sellerId,
        sellerType: isIndependentVendor ? 'Vendor' : 'ManagedVendorUser',
        responseType: finalResponseType,
        offeredPrice: finalResponseType === 'Can Supply' ? Number(offeredPrice) : undefined,
        deliveryTimeline: finalResponseType === 'Can Supply' ? Number(deliveryTimeline) : undefined,
        message: finalResponseType === 'Cannot Supply' ? 'Unavailable / Insufficient stock' : message,
        date: new Date()
    });

    // Update assignment tracking subdocument
    const assignmentIdx = request.assignedVendors.findIndex(v => String(v.vendorId) === String(sellerId));
    if (assignmentIdx !== -1) {
        request.assignedVendors[assignmentIdx].status = finalResponseType === 'Can Supply' ? 'RESPONDED' : 'UNAVAILABLE';
        request.assignedVendors[assignmentIdx].offeredPrice = offeredPrice;
        request.assignedVendors[assignmentIdx].availableQuantity = vendorProduct ? vendorProduct.stockQuantity : 0;
        request.assignedVendors[assignmentIdx].deliveryTimeline = deliveryTimeline;
        request.assignedVendors[assignmentIdx].message = message;
        request.assignedVendors[assignmentIdx].respondedAt = new Date();
    }

    const previousStatus = request.status;
    
    // If vendor cannot supply, fallback request status back to Admin Review/Vendor Sourcing
    if (finalResponseType === 'Cannot Supply') {
        request.status = 'Admin Review';
    } else {
        request.status = 'Seller Responded';
    }

    // Add to timeline
    request.timeline.push({
        status: request.status,
        comment: message || `Vendor submitted a response: ${finalResponseType}`
    });

    // Add to audit log
    request.auditLog.push({
        action: 'Responded',
        performedBy: sellerId,
        performerType: isIndependentVendor ? 'Vendor' : 'ManagedVendorUser',
        reason: `Vendor responded: ${finalResponseType}. Request status transitioned from ${previousStatus} to ${request.status}.`
    });

    await request.save();

    // Notify Super Admin
    await Notification.create({
        recipientType: 'admin',
        type: 'system',
        title: 'Vendor Sourcing Response',
        message: `Vendor ${req.user.name} responded to sourcing request "${request.productName}" with: ${finalResponseType}.`,
        data: {
            relatedId: request._id.toString(),
            onModel: 'ProductRequest'
        }
    });

    res.status(200).json(
        new ApiResponse(200, request, 'Response submitted successfully')
    );
});
