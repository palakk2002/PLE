import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import RFQ from '../../../models/RFQ.model.js';
import Product from '../../../models/Product.model.js';
import { createNotification } from '../../../services/notification.service.js';

// GET /api/vendor/rfq
export const getVendorRFQs = asyncHandler(async (req, res) => {
    const rfqs = await RFQ.find({ sellerId: req.vendor.id })
        .populate('productId', 'name image price')
        .populate('buyerId', 'name companyName email')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, rfqs, 'Vendor RFQs fetched successfully.'));
});

// POST /api/vendor/rfq/:id/quote
export const vendorSendQuote = asyncHandler(async (req, res) => {
    const { price, quantity, deliveryTimeline, notes } = req.body;
    const rfq = await RFQ.findOne({ _id: req.params.id, sellerId: req.vendor.id });

    if (!rfq) {
        throw new ApiError(404, 'RFQ not found.');
    }

    if (['Accepted', 'Rejected', 'Converted To Order'].includes(rfq.status)) {
        throw new ApiError(400, 'Cannot quote on an completed RFQ.');
    }

    rfq.status = 'Quoted';
    rfq.timeline.push({
        senderType: 'seller',
        senderId: req.vendor.id,
        price,
        quantity,
        deliveryTimeline,
        notes
    });

    await rfq.save();

    // Notify Buyer
    await createNotification({
        recipientId: rfq.buyerId,
        recipientType: 'user',
        title: 'New Quote Received',
        message: `Vendor submitted a quote of Rs. ${price} for RFQ ${rfq.rfqId}.`,
        type: 'system',
        data: {
            rfqId: rfq.rfqId,
            id: String(rfq._id)
        }
    });

    res.status(200).json(new ApiResponse(200, rfq, 'Quote submitted successfully.'));
});

// POST /api/vendor/rfq/:id/reject
export const vendorRejectRFQ = asyncHandler(async (req, res) => {
    const rfq = await RFQ.findOne({ _id: req.params.id, sellerId: req.vendor.id });

    if (!rfq) {
        throw new ApiError(404, 'RFQ not found.');
    }

    if (['Accepted', 'Rejected', 'Converted To Order'].includes(rfq.status)) {
        throw new ApiError(400, 'Cannot reject completed RFQ.');
    }

    rfq.status = 'Rejected';
    rfq.timeline.push({
        senderType: 'seller',
        senderId: req.vendor.id,
        notes: req.body.notes || 'Vendor rejected the RFQ request.'
    });

    await rfq.save();

    // Notify Buyer
    await createNotification({
        recipientId: rfq.buyerId,
        recipientType: 'user',
        title: 'RFQ Rejected',
        message: `Your RFQ ${rfq.rfqId} has been rejected by the vendor.`,
        type: 'system',
        data: {
            rfqId: rfq.rfqId,
            id: String(rfq._id)
        }
    });

    res.status(200).json(new ApiResponse(200, rfq, 'RFQ rejected successfully.'));
});
