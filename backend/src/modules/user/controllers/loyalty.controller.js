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

    const isB2B = user.role === 'b2bAdmin' || user.role === 'b2bEmployee';
    const config = await loyaltyService.getLoyaltyConfig();
    const redemptionRatio = isB2B ? (1 / (config.b2bPointsToRupeeRatio ?? 5)) : (config.redemptionRatio ?? 0.2);
    const pointsToRupeeRatio = isB2B ? (config.b2bPointsToRupeeRatio ?? 5) : (config.pointsToRupeeRatio ?? 5);
    const discountValue = parseFloat((user.loyaltyPointsBalance * redemptionRatio).toFixed(2));

    // Simple next milestone recommendation: multiples of 500
    const currentPoints = user.loyaltyPointsBalance || 0;
    const nextMilestone = Math.ceil((currentPoints + 1) / 500) * 500;

    res.status(200).json(new ApiResponse(200, {
        availablePoints: currentPoints,
        lifetimeEarned: user.lifetimeEarned || 0,
        lifetimeRedeemed: user.lifetimeRedeemed || 0,
        b2cLifetimeEarned: user.b2cLifetimeEarned || 0,
        b2bLifetimeEarned: user.b2bLifetimeEarned || 0,
        discountValue,
        nextMilestone,
        conversionRatio: pointsToRupeeRatio
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

    const isB2B = user.role === 'b2bAdmin' || user.role === 'b2bEmployee';
    const config = await loyaltyService.getLoyaltyConfig();
    const enabled = isB2B ? config.b2bEnabled : config.enabled;
    const minRedeemPoints = isB2B ? (config.b2bMinRedeemPoints ?? 50) : (config.minRedeemPoints ?? 50);
    const redemptionRatio = isB2B ? (1 / (config.b2bPointsToRupeeRatio ?? 5)) : (config.redemptionRatio ?? 0.2);
    const maxRedemptionPercent = isB2B ? (config.b2bMaxRedemptionPercent ?? 50) : (config.maxRedemptionPercent ?? 50);

    if (!enabled) {
        throw new ApiError(400, 'Loyalty points system is currently disabled.');
    }

    if (points > user.loyaltyPointsBalance) {
        throw new ApiError(400, `Insufficient points. You only have ${user.loyaltyPointsBalance} points.`);
    }

    if (points < minRedeemPoints) {
        throw new ApiError(400, `Minimum redemption is ${minRedeemPoints} points.`);
    }

    const discount = parseFloat((points * redemptionRatio).toFixed(2));
    const maxDiscount = (cartSubtotal * maxRedemptionPercent) / 100;

    if (discount > maxDiscount) {
        throw new ApiError(400, `Maximum loyalty discount allowed is ₹${maxDiscount} (${maxRedemptionPercent}% of subtotal).`);
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
    const isB2B = req.user && (req.user.role === 'b2bAdmin' || req.user.role === 'b2bEmployee');
    res.status(200).json(new ApiResponse(200, {
        enabled: isB2B ? config.b2bEnabled : config.enabled,
        purchaseToPointsRatio: isB2B ? config.b2bPurchaseToPointsRatio : config.purchaseToPointsRatio,
        purchaseAmountUnit: isB2B ? config.b2bPurchaseAmountUnit : config.purchaseAmountUnit,
        redemptionRatio: isB2B ? (1 / (config.b2bPointsToRupeeRatio ?? 5)) : config.redemptionRatio,
        minRedeemPoints: isB2B ? config.b2bMinRedeemPoints : config.minRedeemPoints,
        maxRedemptionPercent: isB2B ? config.b2bMaxRedemptionPercent : config.maxRedemptionPercent
    }, 'Loyalty config fetched.'));
});
