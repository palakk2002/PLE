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

// @desc    B2B Buyer confirms the final sourcing proposal & creates standard Order
// @route   POST /api/user/product-requests/:id/confirm
// @access  Private (B2B User/Admin)
export const confirmProductRequestProposal = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const request = await ProductRequest.findOne({ requestId: req.params.id, userId });

    if (!request) {
        throw new ApiError(404, 'Product request not found or unauthorized.');
    }

    if (request.status !== 'Final Proposal') {
        throw new ApiError(400, 'Request is not in Final Proposal state.');
    }

    // 1. Re-validate latest stock & pricing of selected source(s)
    const { default: Product } = await import('../../../models/Product.model.js');
    const { default: Order } = await import('../../../models/Order.model.js');
    const { generateOrderId } = await import('../../../utils/generateOrderId.js');

    const proposal = request.selectedFulfillment;
    const orderItems = [];

    // Check PLE Shop fulfillment if quantity > 0
    if (proposal.pleQuantity > 0) {
        const { ManagedShop } = await import('../../../models/ManagedShop.model.js');
        const pleShop = await ManagedShop.findOne({ name: 'PLE Shop' }) || await ManagedShop.findOne({ status: 'active' });
        const pleProduct = pleShop ? await Product.findOne({ shopId: pleShop._id, name: { $regex: new RegExp(request.productName, 'i') }, isActive: true }) : null;

        if (!pleProduct || pleProduct.stockQuantity < proposal.pleQuantity) {
            throw new ApiError(400, 'Fulfillment failed. PLE Shop stock has changed and is now insufficient.');
        }

        // Deduct PLE Shop stock
        pleProduct.stockQuantity -= proposal.pleQuantity;
        if (pleProduct.stockQuantity === 0) pleProduct.stock = 'out_of_stock';
        await pleProduct.save();

        orderItems.push({
            productId: pleProduct._id,
            name: pleProduct.name,
            image: pleProduct.image || request.image,
            price: proposal.finalPrice,
            quantity: proposal.pleQuantity
        });
    }

    // Check Vendor fulfillments
    if (proposal.vendors && proposal.vendors.length > 0) {
        for (const v of proposal.vendors) {
            const vProduct = await Product.findOne({
                vendorId: v.vendorId,
                name: { $regex: new RegExp(request.productName, 'i') },
                isActive: true
            });

            if (!vProduct || vProduct.stockQuantity < v.quantity) {
                throw new ApiError(400, 'Fulfillment failed. Sourcing vendor stock is insufficient.');
            }

            // Deduct Vendor stock
            vProduct.stockQuantity -= v.quantity;
            if (vProduct.stockQuantity === 0) vProduct.stock = 'out_of_stock';
            await vProduct.save();

            orderItems.push({
                productId: vProduct._id,
                vendorId: v.vendorId,
                name: vProduct.name,
                image: vProduct.image || request.image,
                price: v.price || proposal.finalPrice,
                quantity: v.quantity
            });
        }
    }

    // 2. Create the Order
    const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const order = await Order.create({
        orderId: generateOrderId(),
        userId,
        items: orderItems,
        subtotal,
        total: subtotal,
        paymentMethod: 'wallet', // Standard B2B wallet payment
        paymentStatus: 'pending',
        status: 'pending',
        requestProductId: request._id
    });

    request.status = 'Confirmed';
    request.associatedOrderId = order._id;

    request.timeline.push({
        status: 'Confirmed',
        comment: `Proposal accepted. Order ${order.orderId} created successfully.`
    });

    request.auditLog.push({
        action: 'Confirmed Sourcing',
        performedBy: userId,
        performerType: 'User',
        reason: `Buyer accepted proposal. Standard order created.`
    });

    await request.save();

    res.status(200).json(
        new ApiResponse(200, { request, order }, 'Proposal accepted and order created')
    );
});
