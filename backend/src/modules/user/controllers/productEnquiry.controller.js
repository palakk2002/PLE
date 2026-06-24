import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductEnquiry from '../../../models/ProductEnquiry.model.js';
import Product from '../../../models/Product.model.js';
import Notification from '../../../models/Notification.model.js';

// @desc    Create a new product enquiry
// @route   POST /api/user/enquiries
// @access  Private
export const createEnquiry = asyncHandler(async (req, res) => {
    const { productId, subject, question, priority, attachment } = req.body;

    if (!productId || !subject || !question) {
        throw new ApiError(400, 'Product ID, subject, and question are required.');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Product not found.');
    }

    const newEnquiry = await ProductEnquiry.create({
        userId: req.user.id || req.user._id,
        productId,
        vendorId: product.vendorId || null,
        subject,
        question,
        priority: priority || 'Medium',
        attachment: attachment || null
    });

    // Notify the vendor or admin
    const targetUserId = product.vendorId ? product.vendorId : null;
    const notifyRole = product.vendorId ? 'vendor' : 'admin';
    
    const notificationPayload = {
        recipientType: notifyRole,
        type: 'system',
        title: 'New Product Enquiry',
        message: `A customer has enquired about your product: ${product.name}`,
        data: {
            relatedId: newEnquiry._id.toString(),
            onModel: 'ProductEnquiry'
        }
    };
    if (targetUserId) notificationPayload.recipientId = targetUserId;
    
    await Notification.create(notificationPayload);

    res.status(201).json(new ApiResponse(201, newEnquiry, 'Product enquiry submitted successfully.'));
});

// @desc    Get user's product enquiries
// @route   GET /api/user/enquiries
// @access  Private
export const getMyEnquiries = asyncHandler(async (req, res) => {
    const enquiries = await ProductEnquiry.find({ userId: req.user.id || req.user._id })
        .populate('productId', 'name image slug')
        .sort({ createdAt: -1 });

    const formattedEnquiries = enquiries.map(enq => ({
        id: enq.enquiryId,
        _id: enq._id,
        productId: enq.productId?._id,
        productName: enq.productId?.name || 'Unknown Product',
        productImage: enq.productId?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
        subject: enq.subject,
        question: enq.question,
        priority: enq.priority,
        attachment: enq.attachment,
        status: enq.status,
        createdAt: enq.createdAt,
        sellerResponse: enq.sellerResponse,
        timeline: enq.timeline
    }));

    res.status(200).json(new ApiResponse(200, formattedEnquiries, 'User enquiries fetched successfully.'));
});
