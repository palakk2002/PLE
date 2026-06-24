import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import LoyaltyTransaction from '../../../models/LoyaltyTransaction.model.js';
import { User } from '../../../models/User.model.js';

// @desc    Get loyalty program stats
// @route   GET /api/admin/loyalty/stats
// @access  Private/Admin
export const getLoyaltyStats = asyncHandler(async (req, res) => {
    // Aggregate points issued
    const earnedResult = await LoyaltyTransaction.aggregate([
        { $match: { type: 'earn' } },
        { $group: { _id: null, totalEarned: { $sum: '$points' } } }
    ]);
    const totalIssued = earnedResult.length > 0 ? earnedResult[0].totalEarned : 0;

    // Aggregate points redeemed
    const redeemedResult = await LoyaltyTransaction.aggregate([
        { $match: { type: 'redeem' } },
        { $group: { _id: null, totalRedeemed: { $sum: '$points' } } }
    ]);
    const totalRedeemed = redeemedResult.length > 0 ? redeemedResult[0].totalRedeemed : 0;

    // Count active members (users with > 0 balance)
    const activeMembers = await User.countDocuments({ loyaltyPointsBalance: { $gt: 0 } });

    // Aggregate outstanding points liability
    const outstandingResult = await User.aggregate([
        { $group: { _id: null, totalOutstanding: { $sum: '$loyaltyPointsBalance' } } }
    ]);
    const outstandingPoints = outstandingResult.length > 0 ? outstandingResult[0].totalOutstanding : 0;

    res.status(200).json(new ApiResponse(200, {
        totalIssued,
        totalRedeemed,
        activeMembers,
        outstandingPoints
    }, 'Loyalty stats fetched successfully.'));
});

// @desc    Get loyalty transaction history
// @route   GET /api/admin/loyalty/transactions
// @access  Private/Admin
export const getLoyaltyTransactions = asyncHandler(async (req, res) => {
    const transactions = await LoyaltyTransaction.find()
        .populate('userId', 'name email')
        .populate('orderId', 'orderId') // Assuming 'orderId' has string field 'orderId'
        .sort({ createdAt: -1 })
        .limit(100); // Last 100 transactions

    const formattedTransactions = transactions.map(t => ({
        _id: t._id,
        date: t.createdAt,
        user: t.userId,
        orderRef: t.orderId ? (t.orderId.orderId || t.orderId._id) : 'N/A',
        earnedPoints: t.type === 'earn' ? t.points : 0,
        redeemedPoints: t.type === 'redeem' ? t.points : 0,
        balance: t.balanceAfterTransaction,
        description: t.description
    }));

    res.status(200).json(new ApiResponse(200, formattedTransactions, 'Transactions fetched successfully.'));
});
