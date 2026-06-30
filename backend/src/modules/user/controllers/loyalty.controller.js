import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import User from '../../../models/User.model.js';
import LoyaltyTransaction from '../../../models/LoyaltyTransaction.model.js';
import * as loyaltyService from '../../../services/loyalty.service.js';

// @desc    Get current user loyalty balance & status
// @route   GET /api/user/loyalty/balance
// @access  Private
export const getBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found.');

    const config = await loyaltyService.getLoyaltyConfig();
    const discountValue = parseFloat((user.loyaltyPointsBalance * config.redemptionRatio).toFixed(2));

    // Simple next milestone recommendation: multiples of 500
    const currentPoints = user.loyaltyPointsBalance || 0;
    const nextMilestone = Math.ceil((currentPoints + 1) / 500) * 500;

    res.status(200).json(new ApiResponse(200, {
        availablePoints: currentPoints,
        lifetimeEarned: user.lifetimeEarned || 0,
        lifetimeRedeemed: user.lifetimeRedeemed || 0,
        discountValue,
        nextMilestone
    }, 'Loyalty balance fetched successfully.'));
});

// @desc    Get user loyalty transaction history
// @route   GET /api/user/loyalty/history
// @access  Private
export const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        LoyaltyTransaction.find({ userId })
            .populate('orderId', 'orderId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        LoyaltyTransaction.countDocuments({ userId })
    ]);

    const formatted = transactions.map(t => ({
        _id: t._id,
        date: t.createdAt,
        orderId: t.orderId ? t.orderId.orderId : null,
        orderRef: t.orderId ? t.orderId._id : null,
        type: t.type,
        earnedPoints: ['earn', 'reversal', 'admin_credit', 'bonus', 'campaign_reward'].includes(t.type) ? t.points : 0,
        redeemedPoints: ['redeem', 'admin_debit', 'refund_adjustment'].includes(t.type) ? t.points : 0,
        balance: t.balanceAfterTransaction,
        description: t.description
    }));

    res.status(200).json(new ApiResponse(200, {
        transactions: formatted,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
    }, 'Loyalty history fetched successfully.'));
});

// @desc    Validate checkout loyalty points redemption
// @route   POST /api/user/loyalty/validate-redemption
// @access  Private
export const validateRedemption = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { points, cartSubtotal } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found.');

    const config = await loyaltyService.getLoyaltyConfig();
    if (!config.enabled) {
        throw new ApiError(400, 'Loyalty points system is currently disabled.');
    }

    if (points > user.loyaltyPointsBalance) {
        throw new ApiError(400, `Insufficient points. You only have ${user.loyaltyPointsBalance} points.`);
    }

    if (points < config.minRedeemPoints) {
        throw new ApiError(400, `Minimum redemption is ${config.minRedeemPoints} points.`);
    }

    const discount = parseFloat((points * config.redemptionRatio).toFixed(2));
    const maxDiscount = (cartSubtotal * config.maxRedemptionPercent) / 100;

    if (discount > maxDiscount) {
        throw new ApiError(400, `Maximum loyalty discount allowed is ₹${maxDiscount} (50% of subtotal).`);
    }

    res.status(200).json(new ApiResponse(200, {
        valid: true,
        points,
        discount
    }, 'Redemption points validated.'));
});

// @desc    Get public loyalty configuration ratios
// @route   GET /api/user/loyalty/config
// @access  Public
export const getConfig = asyncHandler(async (req, res) => {
    const config = await loyaltyService.getLoyaltyConfig();
    res.status(200).json(new ApiResponse(200, {
        enabled: config.enabled,
        purchaseToPointsRatio: config.purchaseToPointsRatio,
        purchaseAmountUnit: config.purchaseAmountUnit,
        redemptionRatio: config.redemptionRatio,
        minRedeemPoints: config.minRedeemPoints,
        maxRedemptionPercent: config.maxRedemptionPercent
    }, 'Loyalty config fetched.'));
});
