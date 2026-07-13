import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import LoyaltyTransaction from '../../../models/LoyaltyTransaction.model.js';
import { User } from '../../../models/User.model.js';
import * as loyaltyService from '../../../services/loyalty.service.js';
import Settings from '../../../models/Settings.model.js';

// @desc    Get loyalty program stats
// @route   GET /api/admin/loyalty/stats
// @access  Private/Admin
export const getLoyaltyStats = asyncHandler(async (req, res) => {
    // Aggregate points issued
    const earnedResult = await LoyaltyTransaction.aggregate([
        { $match: { type: { $in: ['earn', 'admin_credit', 'bonus', 'campaign_reward'] } } },
        { $group: { _id: null, totalEarned: { $sum: '$points' } } }
    ]);
    const totalIssued = earnedResult.length > 0 ? earnedResult[0].totalEarned : 0;

    // Aggregate points redeemed
    const redeemedResult = await LoyaltyTransaction.aggregate([
        { $match: { type: { $in: ['redeem', 'admin_debit'] } } },
        { $group: { _id: null, totalRedeemed: { $sum: '$points' } } }
    ]);
    const totalRedeemed = redeemedResult.length > 0 ? redeemedResult[0].totalRedeemed : 0;

    // Count active members (users with > 0 balance)
    const activeMembers = await User.countDocuments({ loyaltyPointsBalance: { $gt: 0 }, role: { $in: ['customer', 'b2bAdmin', 'b2bEmployee'] } });

    // Aggregate outstanding points liability
    const outstandingResult = await User.aggregate([
        { $match: { role: { $in: ['customer', 'b2bAdmin', 'b2bEmployee'] } } },
        { $group: { _id: null, totalOutstanding: { $sum: '$loyaltyPointsBalance' } } }
    ]);
    const outstandingPoints = outstandingResult.length > 0 ? outstandingResult[0].totalOutstanding : 0;

    // Aggregate total discount given
    const ordersResult = await LoyaltyTransaction.aggregate([
        { $match: { type: 'redeem' } }
    ]);
    const config = await loyaltyService.getLoyaltyConfig();
    const totalDiscountGiven = parseFloat((totalRedeemed * config.redemptionRatio).toFixed(2));

    const totalTransactions = await LoyaltyTransaction.countDocuments();

    res.status(200).json(new ApiResponse(200, {
        totalIssued,
        totalRedeemed,
        activeMembers,
        outstandingPoints,
        totalDiscountGiven,
        totalTransactions
    }, 'Loyalty stats fetched successfully.'));
});

// @desc    Get loyalty transaction history
// @route   GET /api/admin/loyalty/transactions
// @access  Private/Admin
export const getLoyaltyTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const transactions = await LoyaltyTransaction.find()
        .populate('userId', 'name email')
        .populate('orderId', 'orderId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const formattedTransactions = transactions.map(t => ({
        _id: t._id,
        date: t.createdAt,
        user: t.userId,
        orderRef: t.orderId ? (t.orderId.orderId || t.orderId._id) : 'N/A',
        earnedPoints: ['earn', 'reversal', 'admin_credit', 'bonus', 'campaign_reward'].includes(t.type) ? t.points : 0,
        redeemedPoints: ['redeem', 'admin_debit', 'refund_adjustment'].includes(t.type) ? t.points : 0,
        balance: t.balanceAfterTransaction,
        description: t.description
    }));

    res.status(200).json(new ApiResponse(200, formattedTransactions, 'Transactions fetched successfully.'));
});

// @desc    Get loyalty B2C users list with pagination/search
// @route   GET /api/admin/loyalty/users
// @access  Private/Admin
export const getLoyaltyUsers = asyncHandler(async (req, res) => {
    const { search = '', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { role: { $in: ['customer', 'b2bAdmin', 'b2bEmployee'] } };
    if (search) {
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('name email loyaltyPointsBalance lifetimeEarned lifetimeRedeemed')
            .skip(skip)
            .limit(Number(limit)),
        User.countDocuments(filter)
    ]);

    const formatted = users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        currentPoints: u.loyaltyPointsBalance || 0,
        earnedPoints: u.lifetimeEarned || 0,
        redeemedPoints: u.lifetimeRedeemed || 0
    }));

    res.status(200).json(new ApiResponse(200, { users: formatted, total }, 'Loyalty users fetched.'));
});

// @desc    Get details of specific user loyalty state
// @route   GET /api/admin/loyalty/users/:userId
// @access  Private/Admin
export const getUserLoyalty = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).select('name email loyaltyPointsBalance lifetimeEarned lifetimeRedeemed');
    if (!user) throw new ApiError(404, 'User not found');

    res.status(200).json(new ApiResponse(200, {
        id: user._id,
        name: user.name,
        email: user.email,
        currentPoints: user.loyaltyPointsBalance || 0,
        earnedPoints: user.lifetimeEarned || 0,
        redeemedPoints: user.lifetimeRedeemed || 0
    }, 'User details fetched.'));
});

// @desc    Credit points manually to user
// @route   POST /api/admin/loyalty/users/:userId/credit
// @access  Private/Admin
export const creditUserPoints = asyncHandler(async (req, res) => {
    const { points, reason } = req.body;
    if (!points || points <= 0) throw new ApiError(400, 'Invalid points value');

    const balance = await loyaltyService.adminCreditPoints(req.params.userId, Number(points), req.user.id, reason);
    res.status(200).json(new ApiResponse(200, { balance }, `Successfully credited ${points} points.`));
});

// @desc    Debit points manually from user
// @route   POST /api/admin/loyalty/users/:userId/debit
// @access  Private/Admin
export const debitUserPoints = asyncHandler(async (req, res) => {
    const { points, reason } = req.body;
    if (!points || points <= 0) throw new ApiError(400, 'Invalid points value');

    const balance = await loyaltyService.adminDebitPoints(req.params.userId, Number(points), req.user.id, reason);
    res.status(200).json(new ApiResponse(200, { balance }, `Successfully debited ${points} points.`));
});

// @desc    Reset points manually
// @route   POST /api/admin/loyalty/users/:userId/reset
// @access  Private/Admin
export const resetUserPoints = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) throw new ApiError(404, 'User not found');

    const points = user.loyaltyPointsBalance;
    if (points > 0) {
        await loyaltyService.adminDebitPoints(user._id, points, req.user.id, 'Reset balance');
    }
    res.status(200).json(new ApiResponse(200, { balance: 0 }, 'Points reset successfully.'));
});

// @desc    Get configuration
// @route   GET /api/admin/loyalty/config
// @access  Private/Admin
export const getLoyaltyConfig = asyncHandler(async (req, res) => {
    const config = await loyaltyService.getLoyaltyConfig();
    res.status(200).json(new ApiResponse(200, config, 'Loyalty config fetched.'));
});

// @desc    Update configuration
// @route   PUT /api/admin/loyalty/config
// @access  Private/Admin
export const updateLoyaltyConfig = asyncHandler(async (req, res) => {
    const config = req.body;
    let setting = await Settings.findOne({ key: 'loyalty' });
    if (setting) {
        setting.value = { ...setting.value, ...config };
        await setting.save();
    } else {
        setting = await Settings.create({ key: 'loyalty', value: config });
    }
    res.status(200).json(new ApiResponse(200, setting.value, 'Loyalty config updated.'));
});

// @desc    Get specific user loyalty history
// @route   GET /api/admin/loyalty/users/:userId/history
// @access  Private/Admin
export const getUserLoyaltyHistory = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const transactions = await LoyaltyTransaction.find({ userId })
        .populate('orderId', 'orderId')
        .sort({ createdAt: -1 });

    const formatted = transactions.map(t => ({
        _id: t._id,
        date: t.createdAt,
        orderId: t.orderId ? t.orderId.orderId : null,
        type: t.type,
        earnedPoints: ['earn', 'reversal', 'admin_credit', 'bonus', 'campaign_reward'].includes(t.type) ? t.points : 0,
        redeemedPoints: ['redeem', 'admin_debit', 'refund_adjustment'].includes(t.type) ? t.points : 0,
        balance: t.balanceAfterTransaction,
        description: t.description
    }));

    res.status(200).json(new ApiResponse(200, formatted, 'User loyalty history fetched.'));
});

