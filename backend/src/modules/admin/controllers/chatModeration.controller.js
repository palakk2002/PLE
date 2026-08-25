import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ChatViolation from '../../../models/ChatViolation.model.js';

/**
 * GET /api/admin/chat-moderation/violations
 * Returns paginated list of chat violations for admin review.
 * No actual message content is exposed.
 */
export const getChatViolations = asyncHandler(async (req, res) => {
    const page     = Math.max(1, parseInt(req.query.page  || '1', 10));
    const limit    = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip     = (page - 1) * limit;

    // Optional filters
    const filter = {};
    if (req.query.category)   filter.category   = req.query.category;
    if (req.query.action)     filter.action      = req.query.action;
    if (req.query.senderType) filter.senderType  = req.query.senderType;
    if (req.query.direction)  filter.direction   = req.query.direction;
    if (req.query.vendorId)   filter.vendorId    = req.query.vendorId;

    // Date range filter
    if (req.query.from || req.query.to) {
        filter.createdAt = {};
        if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
        if (req.query.to)   filter.createdAt.$lte = new Date(req.query.to);
    }

    const [violations, total] = await Promise.all([
        ChatViolation.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('vendorId', 'storeName name')
            .lean(),
        ChatViolation.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, {
        violations,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    }, 'Chat violations fetched.'));
});

/**
 * GET /api/admin/chat-moderation/stats
 * Returns aggregated violation stats for the admin dashboard.
 */
export const getChatViolationStats = asyncHandler(async (req, res) => {
    const [categoryBreakdown, actionBreakdown, recentCount] = await Promise.all([
        ChatViolation.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        ChatViolation.aggregate([
            { $group: { _id: '$action', count: { $sum: 1 } } },
        ]),
        ChatViolation.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
    ]);

    const totalViolations = await ChatViolation.countDocuments();

    res.status(200).json(new ApiResponse(200, {
        totalViolations,
        last24Hours: recentCount,
        byCategory: categoryBreakdown,
        byAction: actionBreakdown,
    }, 'Chat moderation stats fetched.'));
});
