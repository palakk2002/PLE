import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import ProductEnquiry from '../../../models/ProductEnquiry.model.js';
import Notification from '../../../models/Notification.model.js';

// @desc    Get vendor's product enquiries
// @route   GET /api/vendor/enquiries
// @access  Private
export const getVendorEnquiries = asyncHandler(async (req, res) => {
    const enquiries = await ProductEnquiry.find({ vendorId: req.user.id })
        .populate('userId', 'name email role')
        .populate('productId', 'name image slug')
        .sort({ createdAt: -1 });

    const formattedEnquiries = enquiries.map(enq => ({
        id: enq.enquiryId,
        _id: enq._id,
        productId: enq.productId?._id,
        productName: enq.productId?.name,
        productImage: enq.productId?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
        subject: enq.subject,
        question: enq.question,
        priority: enq.priority,
        attachment: enq.attachment,
        userId: enq.userId?._id,
        userName: enq.userId?.name || 'Customer',
        userEmail: enq.userId?.email || 'N/A',
        status: enq.status,
        createdAt: enq.createdAt,
        sellerResponse: enq.sellerResponse,
        timeline: enq.timeline
    }));

    res.status(200).json(new ApiResponse(200, formattedEnquiries, 'Vendor enquiries fetched successfully.'));
});

// @desc    Reply to a product enquiry
// @route   PUT /api/vendor/enquiries/:id/reply
// @access  Private
// export const replyToEnquiry = asyncHandler(async (req, res) => {
export const replyToEnquiry = asyncHandler(async (req, res) => {
    const { status, responseText } = req.body;
    
    if (!status && !responseText) {
        throw new ApiError(400, 'Please provide status or response text.');
    }

    const enquiry = await ProductEnquiry.findOne({ enquiryId: req.params.id, vendorId: req.user.id });
    if (!enquiry) {
        throw new ApiError(404, 'Enquiry not found or unauthorized.');
    }

    if (status) enquiry.status = status;
    if (responseText) enquiry.sellerResponse = responseText;

    const note = responseText 
        ? `Seller responded: "${responseText.substring(0, 40)}${responseText.length > 40 ? '...' : ''}"`
        : `Enquiry status updated to ${status}.`;

    enquiry.timeline.push({
        status: status || enquiry.status,
        note
    });

    await enquiry.save();

    // Notify user
    await Notification.create({
        recipientId: enquiry.userId,
        recipientType: 'user',
        type: 'system',
        title: 'Product Enquiry Update',
        message: `There is an update on your enquiry regarding ${enquiry.subject}.`,
        data: {
            relatedId: enquiry._id.toString(),
            onModel: 'ProductEnquiry'
        }
    });

    res.status(200).json(new ApiResponse(200, enquiry, 'Enquiry updated successfully.'));
});
