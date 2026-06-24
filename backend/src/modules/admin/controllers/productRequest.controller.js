import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductRequest from '../../../models/ProductRequest.model.js';
import Notification from '../../../models/Notification.model.js';

// @desc    Get all product requests (for admin)
// @route   GET /api/admin/product-requests
// @access  Private (Admin)
export const getAllProductRequests = asyncHandler(async (req, res) => {
    const requests = await ProductRequest.find({})
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });

    // Format for admin dashboard matching frontend needs
    const formattedRequests = requests.map(req => ({
        id: req.requestId,
        _id: req._id,
        productName: req.productName,
        category: req.category,
        quantity: req.quantity,
        expectedBudget: req.expectedBudget,
        description: req.description,
        image: req.image,
        status: req.status,
        date: req.createdAt,
        userId: req.userId,
        timeline: req.timeline,
        sellerResponses: req.sellerResponses
    }));

    res.status(200).json(
        new ApiResponse(200, formattedRequests, 'Product requests fetched successfully')
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

    request.status = status;
    
    // Add to timeline
    request.timeline.push({
        status,
        comment: comment || `Status updated to ${status} by Administrator.`
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
    const request = await ProductRequest.findOneAndDelete({ requestId: req.params.id });

    if (!request) {
        throw new ApiError(404, 'Product request not found');
    }

    res.status(200).json(
        new ApiResponse(200, null, 'Product request deleted successfully')
    );
});
