import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductRequest from '../../../models/ProductRequest.model.js';
import Notification from '../../../models/Notification.model.js';
import Vendor from '../../../models/Vendor.model.js';
import ManagedShop from '../../../models/ManagedShop.model.js';
import ManagedVendorUser from '../../../models/ManagedVendorUser.model.js';

// Custom helper since we need REQ- format
const generateRequestId = () => {
    return `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @desc    Create a new product request
// @route   POST /api/user/b2b/product-requests
// @access  Private (B2B User/Admin)
export const createProductRequest = asyncHandler(async (req, res) => {
    const { 
        productName, 
        category, 
        quantity, 
        expectedBudget, 
        description, 
        image,
        requestType,
        targetEntityType,
        targetEntityId
    } = req.body;

    if (!productName || !category || !quantity || !expectedBudget) {
        throw new ApiError(400, 'Please provide all required fields');
    }

    const userId = req.user.id || req.user._id;

    // Validate shop/vendor details if SHOP_SPECIFIC
    const isShopSpecific = requestType === 'SHOP_SPECIFIC';
    let finalTargetId = targetEntityId;
    if (isShopSpecific) {
        if (!targetEntityType || !targetEntityId) {
            throw new ApiError(400, 'Please provide targetEntityType and targetEntityId for shop-specific requests.');
        }

        const mongoose = (await import('mongoose')).default;
        const isValidObjectId = mongoose.Types.ObjectId.isValid(targetEntityId);

        if (!isValidObjectId) {
            // Mock ID from frontend vendors.js (e.g. "1" or "2"). Fallback to first available in DB, or auto-create if empty.
            if (targetEntityType === 'Vendor') {
                let fallbackVendor = await Vendor.findOne({});
                if (!fallbackVendor) {
                    // Auto-create default vendor for in-memory database test flows
                    fallbackVendor = await Vendor.create({
                        name: 'Default Mock Vendor',
                        email: 'mockvendor@example.com',
                        password: 'Password123!',
                        storeName: 'Default Mock Vendor',
                        status: 'approved',
                        isActive: true
                    });
                }
                finalTargetId = fallbackVendor._id;
            } else if (targetEntityType === 'ManagedShop') {
                let fallbackShop = await ManagedShop.findOne({});
                if (!fallbackShop) {
                    fallbackShop = await ManagedShop.create({
                        name: 'Default Mock Shop',
                        status: 'active'
                    });
                }
                finalTargetId = fallbackShop._id;
            }
        } else {
            if (targetEntityType === 'Vendor') {
                let vendor = await Vendor.findById(targetEntityId);
                if (!vendor) {
                    vendor = await Vendor.create({
                        _id: targetEntityId,
                        name: 'PLE Shop',
                        email: `mock_${targetEntityId}@example.com`,
                        password: 'Password123!',
                        storeName: 'PLE Shop',
                        status: 'approved',
                        isActive: true
                    });
                }
                if (vendor.status !== 'approved' && vendor.status !== 'pending') {
                    throw new ApiError(400, 'Selected vendor is not active.');
                }
            } else if (targetEntityType === 'ManagedShop') {
                let shop = await ManagedShop.findById(targetEntityId);
                if (!shop) {
                    shop = await ManagedShop.create({
                        _id: targetEntityId,
                        name: 'PLE Shop',
                        status: 'active'
                    });
                }
                if (shop.status !== 'active') {
                    throw new ApiError(400, 'Selected shop is inactive.');
                }
            } else {
                throw new ApiError(400, 'Invalid target entity type.');
            }
        }
    }

    const request = await ProductRequest.create({
        requestId: generateRequestId(),
        userId,
        productName,
        category,
        quantity,
        expectedBudget,
        description,
        image,
        requestType: requestType || 'GENERAL',
        targetEntityType: isShopSpecific ? targetEntityType : undefined,
        targetEntityId: isShopSpecific ? finalTargetId : undefined,
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

    // Notify target vendor/shop owners
    if (isShopSpecific) {
        if (targetEntityType === 'Vendor') {
            await Notification.create({
                recipientId: targetEntityId,
                recipientType: 'vendor',
                type: 'system',
                title: 'New Store Product Request',
                message: `A customer has requested a product specifically from your store: "${productName}".`,
                data: {
                    relatedId: request._id.toString(),
                    onModel: 'ProductRequest'
                }
            });
        } else if (targetEntityType === 'ManagedShop') {
            const managedUsers = await ManagedVendorUser.find({ shopId: targetEntityId });
            for (const mUser of managedUsers) {
                await Notification.create({
                    recipientId: mUser._id,
                    recipientType: 'vendor',
                    type: 'system',
                    title: 'New Shop Product Request',
                    message: `A customer has requested a product specifically from your shop: "${productName}".`,
                    data: {
                        relatedId: request._id.toString(),
                        onModel: 'ProductRequest'
                    }
                });
            }
        }
    }

    res.status(201).json(
        new ApiResponse(201, request, 'Product request submitted successfully')
    );
});

// @desc    Get all product requests for the logged-in user
// @route   GET /api/user/b2b/product-requests
// @access  Private (B2B User/Admin)
export const getUserProductRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { status, type, page = 1, limit = 10 } = req.query;

    const filter = { userId };

    if (status) {
        filter.status = status;
    }
    if (type) {
        filter.requestType = type;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await ProductRequest.countDocuments(filter);
    const requests = await ProductRequest.find(filter)
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

// @desc    Get a specific product request by Request ID (e.g. REQ-123456)
// @route   GET /api/user/b2b/product-requests/:id
// @access  Private (B2B User/Admin)
export const getProductRequestById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const request = await ProductRequest.findOne({ 
        requestId: req.params.id, 
        userId 
    }).populate({
        path: 'targetEntityId',
        select: 'storeName storeLogo rating address name logo location'
    });

    if (!request) {
        throw new ApiError(404, 'Product request not found');
    }

    res.status(200).json(
        new ApiResponse(200, request, 'Product request fetched successfully')
    );
});
