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

    let visibilityFilter = {};

    if (isIndependentVendor) {
        // Can view general requests OR direct requests for this vendor ID
        visibilityFilter = {
            $or: [
                { requestType: 'GENERAL' },
                { requestType: 'SHOP_SPECIFIC', targetEntityType: 'Vendor', targetEntityId: req.user._id || req.user.id }
            ]
        };
    } else if (isManagedVendor) {
        // Can view general requests OR direct requests for their shop ID
        if (!req.user.shopId) {
            throw new ApiError(400, 'Managed vendor is not assigned to a shop.');
        }
        visibilityFilter = {
            $or: [
                { requestType: 'GENERAL' },
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
            filter.status = { $in: ['Submitted', 'Under Review'] };
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
    }

    // Add response
    request.sellerResponses.push({
        sellerId,
        sellerType: isIndependentVendor ? 'Vendor' : 'ManagedVendorUser',
        responseType,
        offeredPrice: responseType === 'Can Supply' ? Number(offeredPrice) : undefined,
        deliveryTimeline: responseType === 'Can Supply' ? Number(deliveryTimeline) : undefined,
        message,
        date: new Date()
    });

    const previousStatus = request.status;
    request.status = 'Seller Responded';

    // Add to timeline
    request.timeline.push({
        status: 'Seller Responded',
        comment: message || `Vendor submitted a response: ${responseType}`
    });

    // Add to audit log
    request.auditLog.push({
        action: 'Responded',
        performedBy: sellerId,
        performerType: isIndependentVendor ? 'Vendor' : 'ManagedVendorUser',
        reason: `Transitioned from ${previousStatus} to Seller Responded.`
    });

    await request.save();

    // Notify the user (customer)
    await Notification.create({
        recipientId: request.userId,
        recipientType: 'user',
        type: 'system',
        title: 'Vendor Responded to Request',
        message: `A vendor has responded to your product request "${request.productName}": "${responseType}".`,
        data: {
            relatedId: request._id.toString(),
            onModel: 'ProductRequest'
        }
    });

    res.status(200).json(
        new ApiResponse(200, request, 'Response submitted successfully')
    );
});
