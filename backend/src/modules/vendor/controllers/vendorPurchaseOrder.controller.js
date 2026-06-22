import asyncHandler from '../../../utils/asyncHandler.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import { PurchaseOrder } from '../../../models/PurchaseOrder.model.js';

// GET /api/vendor/b2b/purchase-orders
export const getVendorPurchaseOrders = asyncHandler(async (req, res) => {
    const vendorId = req.user.id; // JWT carries { id, role, email } — id IS the vendor's _id
    if (!vendorId) {
        throw new ApiError(400, 'Vendor profile not found.');
    }

    const pos = await PurchaseOrder.find({ vendorId })
        .populate('rfqId', 'rfqId')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, pos, 'Purchase Orders fetched successfully.'));
});

// GET /api/vendor/b2b/purchase-orders/:id
export const getVendorPurchaseOrderById = asyncHandler(async (req, res) => {
    const vendorId = req.user.id;
    if (!vendorId) {
        throw new ApiError(400, 'Vendor profile not found.');
    }

    const po = await PurchaseOrder.findOne({ _id: req.params.id, vendorId })
        .populate('rfqId', 'rfqId');

    if (!po) {
        throw new ApiError(404, 'Purchase Order not found.');
    }

    res.status(200).json(new ApiResponse(200, po, 'Purchase Order fetched successfully.'));
});
