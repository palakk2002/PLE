import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import RFQ from '../../../models/RFQ.model.js';

// GET /api/admin/rfq
export const getAdminRFQs = asyncHandler(async (req, res) => {
    const rfqs = await RFQ.find()
        .populate('productId', 'name image price')
        .populate('buyerId', 'name companyName email')
        .populate('sellerId', 'storeName name')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, rfqs, 'All RFQs fetched successfully.'));
});

// GET /api/admin/rfq/:id
export const getAdminRFQDetail = asyncHandler(async (req, res) => {
    const rfq = await RFQ.findById(req.params.id)
        .populate('productId', 'name image price unit stockQuantity')
        .populate('buyerId', 'name companyName email phone')
        .populate('sellerId', 'storeName name email');

    if (!rfq) {
        throw new ApiError(404, 'RFQ not found.');
    }

    res.status(200).json(new ApiResponse(200, rfq, 'RFQ details fetched successfully.'));
});

// GET /api/admin/rfq/stats
export const getRFQStats = asyncHandler(async (req, res) => {
    const stats = await RFQ.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const statMap = {
        Total: 0,
        Pending: 0,
        Quoted: 0,
        Negotiating: 0,
        Accepted: 0,
        Rejected: 0,
        ConvertedToOrder: 0
    };

    let total = 0;
    stats.forEach(s => {
        total += s.count;
        if (s._id === 'Pending') statMap.Pending = s.count;
        else if (s._id === 'Quoted') statMap.Quoted = s.count;
        else if (s._id === 'Negotiating') statMap.Negotiating = s.count;
        else if (s._id === 'Accepted') statMap.Accepted = s.count;
        else if (s._id === 'Rejected') statMap.Rejected = s.count;
        else if (s._id === 'Converted To Order') statMap.ConvertedToOrder = s.count;
    });
    statMap.Total = total;

    res.status(200).json(new ApiResponse(200, statMap, 'RFQ stats fetched successfully.'));
});
