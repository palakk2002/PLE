import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductRequest from '../../../models/ProductRequest.model.js';
import Notification from '../../../models/Notification.model.js';

// @desc    Get all product requests (for admin)
// @route   GET /api/admin/product-requests
// @access  Private (Admin)
export const getAllProductRequests = asyncHandler(async (req, res) => {
    const { 
        type, 
        status, 
        sellerType, 
        sellerId, 
        category, 
        search, 
        startDate, 
        endDate, 
        page = 1, 
        limit = 10 
    } = req.query;

    const filter = {};

    // 1. Request Type Filter
    if (type === 'General') {
        filter.requestType = 'GENERAL';
    } else if (type === 'Shop') {
        filter.requestType = 'SHOP_SPECIFIC';
    }

    // 2. Status Filter
    if (status) {
        if (status === 'Pending') {
            filter.status = { $in: ['Submitted', 'Under Review'] };
        } else {
            filter.status = status;
        }
    }

    // 3. Seller Type Filter
    if (sellerType) {
        filter.targetEntityType = sellerType;
    }

    // 4. Seller ID Filter
    if (sellerId) {
        filter.targetEntityId = sellerId;
    }

    // 5. Category Filter
    if (category) {
        filter.category = category;
    }

    // 6. Search Filter
    if (search) {
        filter.$or = [
            { productName: { $regex: search, $options: 'i' } },
            { requestId: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // 7. Date Range Filter
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
            filter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            filter.createdAt.$lte = new Date(endDate);
        }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await ProductRequest.countDocuments(filter);
    const requests = await ProductRequest.find(filter)
        .populate('userId', 'name email role')
        .populate({
            path: 'targetEntityId',
            select: 'storeName storeLogo rating address name logo location'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    // Format for admin dashboard matching frontend needs
    const formattedRequests = requests.map(reqItem => ({
        id: reqItem.requestId,
        _id: reqItem._id,
        productName: reqItem.productName,
        category: reqItem.category,
        quantity: reqItem.quantity,
        expectedBudget: reqItem.expectedBudget,
        description: reqItem.description,
        image: reqItem.image,
        status: reqItem.status,
        date: reqItem.createdAt,
        userId: reqItem.userId,
        timeline: reqItem.timeline,
        sellerResponses: reqItem.sellerResponses,
        requestType: reqItem.requestType,
        targetEntityType: reqItem.targetEntityType,
        targetEntityId: reqItem.targetEntityId,
        auditLog: reqItem.auditLog
    }));

    res.status(200).json(
        new ApiResponse(200, {
            requests: formattedRequests,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        }, 'Product requests fetched successfully')
    );
});

// @desc    Update product request status
// @route   PUT /api/admin/product-requests/:id/status
// @access  Private (Admin)
export const updateProductRequestStatus = asyncHandler(async (req, res) => {
    const { status, comment } = req.body;
    
    if (!status) {
        throw new ApiError(400, 'Please provide status');
    }

    const request = await ProductRequest.findOne({ requestId: req.params.id });

    if (!request) {
        throw new ApiError(404, 'Product request not found');
    }

    const previousStatus = request.status;
    request.status = status;
    
    // Add to timeline
    request.timeline.push({
        status,
        comment: comment || `Status updated to ${status} by Administrator.`
    });

    // Add to audit log
    request.auditLog.push({
        action: `Updated Status to ${status}`,
        performedBy: req.user._id || req.user.id,
        performerType: 'Admin',
        reason: comment || `Status transition from ${previousStatus} to ${status}.`
    });

    await request.save();

    // Notify the user
    await Notification.create({
        recipientId: request.userId,
        recipientType: 'user',
        type: 'system',
        title: 'Product Request Updated',
        message: `Your product request "${request.productName}" status has been updated to ${status}.`,
        data: {
            relatedId: request._id.toString(),
            onModel: 'ProductRequest'
        }
    });

    res.status(200).json(
        new ApiResponse(200, request, 'Product request status updated')
    );
});

// @desc    Delete product request
// @route   DELETE /api/admin/product-requests/:id
// @access  Private (Admin)
export const deleteProductRequest = asyncHandler(async (req, res) => {
    const request = await ProductRequest.findOne({ requestId: req.params.id });

    if (!request) {
        throw new ApiError(404, 'Product request not found');
    }

    // Add to audit log before delete (or we can just delete)
    await ProductRequest.deleteOne({ _id: request._id });

    res.status(200).json(
        new ApiResponse(200, null, 'Product request deleted successfully')
    );
});
