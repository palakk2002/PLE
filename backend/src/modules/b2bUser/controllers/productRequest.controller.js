import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductRequest from '../../../models/ProductRequest.model.js';
import Notification from '../../../models/Notification.model.js';
// Custom helper since we need REQ- format
const generateRequestId = () => {
    return `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @desc    Create a new product request
// @route   POST /api/user/b2b/product-requests
// @access  Private (B2B User/Admin)
export const createProductRequest = asyncHandler(async (req, res) => {
    const { productName, category, quantity, expectedBudget, description, image } = req.body;

    if (!productName || !category || !quantity || !expectedBudget) {
        throw new ApiError(400, 'Please provide all required fields');
    }

    const userId = req.user.id || req.user._id;

    const request = await ProductRequest.create({
        requestId: generateRequestId(),
        userId,
        productName,
        category,
        quantity,
        expectedBudget,
        description,
        image
    });

    // Notify Super Admin
    await Notification.create({
        recipientType: 'admin',
        type: 'system',
        title: 'New Product Request',
        message: `A new product request for "${productName}" has been submitted by ${req.user.name}.`,
        data: {
            relatedId: request._id.toString(),
            onModel: 'ProductRequest'
        }
    });

    res.status(201).json(
        new ApiResponse(201, request, 'Product request submitted successfully')
    );
});

// @desc    Get all product requests for the logged-in user
// @route   GET /api/user/b2b/product-requests
// @access  Private (B2B User/Admin)
export const getUserProductRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const requests = await ProductRequest.find({ userId })
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, requests, 'Product requests fetched successfully')
    );
});

// @desc    Get a specific product request by Request ID (e.g. REQ-123456)
// @route   GET /api/user/b2b/product-requests/:id
// @access  Private (B2B User/Admin)
export const getProductRequestById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const request = await ProductRequest.findOne({ 
        requestId: req.params.id, 
        userId 
    });

    if (!request) {
        throw new ApiError(404, 'Product request not found');
    }

    res.status(200).json(
        new ApiResponse(200, request, 'Product request fetched successfully')
    );
});
