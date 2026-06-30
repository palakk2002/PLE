import Settings from '../models/Settings.model.js';
import User from '../models/User.model.js';
import LoyaltyTransaction from '../models/LoyaltyTransaction.model.js';
import ApiError from '../utils/ApiError.js';

export const getLoyaltyConfig = async () => {
    const setting = await Settings.findOne({ key: 'loyalty' });
    const defaults = {
        enabled: true,
        purchaseToPointsRatio: 5,     // 5 Loyalty Points per unit spent ratio
        purchaseAmountUnit: 100,      // e.g. per ₹100 spent
        redemptionRatio: 0.2,         // 5 points = ₹1 Discount (1 point = ₹0.20)
        maxRedemptionPercent: 50,     // Max 50% discount from loyalty points
        minRedeemPoints: 50,          // Minimum points to redeem
        pointExpiry: null,
    };
    if (setting) {
        return { ...defaults, ...setting.value };
    }
    return defaults;
};

export const calculateEarnablePoints = async (orderAmount) => {
    const config = await getLoyaltyConfig();
    if (!config.enabled) return 0;
    
    // Purchase amount ratio calculation: e.g. ₹100 Purchase = 5 Points
    const multiplier = orderAmount / config.purchaseAmountUnit;
    const earned = Math.floor(multiplier * config.purchaseToPointsRatio);
    return Math.max(0, earned);
};

export const earnPoints = async (userId, orderId, amount, session = null) => {
    const user = await User.findById(userId).session(session);
    if (!user || user.role !== 'customer') return 0; // B2C users only

    const config = await getLoyaltyConfig();
    if (!config.enabled) return 0;

    const pointsToEarn = await calculateEarnablePoints(amount);
    if (pointsToEarn <= 0) return 0;

    // Check for duplicate credit
    const existingTransaction = await LoyaltyTransaction.findOne({
        userId,
        orderId,
        type: 'earn'
    }).session(session);

    if (existingTransaction) return 0; // Already credited

    user.loyaltyPointsBalance += pointsToEarn;
    user.lifetimeEarned += pointsToEarn;
    await user.save({ session });

    await LoyaltyTransaction.create([{
        userId,
        orderId,
        points: pointsToEarn,
        type: 'earn',
        description: `Points earned on purchase of Rs.${amount.toFixed(2)}`,
        balanceAfterTransaction: user.loyaltyPointsBalance
    }], { session });

    return pointsToEarn;
};

export const redeemPoints = async (userId, orderId, pointsToRedeem, session = null) => {
    if (pointsToRedeem <= 0) return 0;

    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, 'User not found.');

    if (user.loyaltyPointsBalance < pointsToRedeem) {
        throw new ApiError(400, `Insufficient loyalty points balance. Available: ${user.loyaltyPointsBalance}`);
    }

    const config = await getLoyaltyConfig();
    if (!config.enabled) throw new ApiError(400, 'Loyalty program is currently disabled.');

    if (pointsToRedeem < config.minRedeemPoints) {
        throw new ApiError(400, `Minimum redemption amount is ${config.minRedeemPoints} points.`);
    }

    const discountAmount = parseFloat((pointsToRedeem * config.redemptionRatio).toFixed(2));

    user.loyaltyPointsBalance = Math.max(0, user.loyaltyPointsBalance - pointsToRedeem);
    user.lifetimeRedeemed += pointsToRedeem;
    await user.save({ session });

    await LoyaltyTransaction.create([{
        userId,
        orderId,
        points: pointsToRedeem,
        type: 'redeem',
        description: `Redeemed points at checkout for Rs.${discountAmount} discount`,
        balanceAfterTransaction: user.loyaltyPointsBalance
    }], { session });

    return discountAmount;
};

export const reverseEarnedPoints = async (userId, orderId, session = null) => {
    const user = await User.findById(userId).session(session);
    if (!user) return;

    const earnTransaction = await LoyaltyTransaction.findOne({
        userId,
        orderId,
        type: 'earn'
    }).session(session);

    if (!earnTransaction) return;

    // Create refund adjustment / debit transaction
    const pointsToReverse = earnTransaction.points;
    user.loyaltyPointsBalance = Math.max(0, user.loyaltyPointsBalance - pointsToReverse);
    user.lifetimeEarned = Math.max(0, user.lifetimeEarned - pointsToReverse);
    await user.save({ session });

    await LoyaltyTransaction.create([{
        userId,
        orderId,
        points: pointsToReverse,
        type: 'refund_adjustment',
        description: `Reversal of earned points due to order cancellation/refund`,
        balanceAfterTransaction: user.loyaltyPointsBalance
    }], { session });
};

export const restoreRedeemedPoints = async (userId, orderId, session = null) => {
    const user = await User.findById(userId).session(session);
    if (!user) return;

    const redeemTransaction = await LoyaltyTransaction.findOne({
        userId,
        orderId,
        type: 'redeem'
    }).session(session);

    if (!redeemTransaction) return;

    const pointsToRestore = redeemTransaction.points;
    user.loyaltyPointsBalance += pointsToRestore;
    user.lifetimeRedeemed = Math.max(0, user.lifetimeRedeemed - pointsToRestore);
    await user.save({ session });

    await LoyaltyTransaction.create([{
        userId,
        orderId,
        points: pointsToRestore,
        type: 'reversal',
        description: `Restored redeemed points due to order cancellation/refund`,
        balanceAfterTransaction: user.loyaltyPointsBalance
    }], { session });
};

export const adminCreditPoints = async (userId, points, adminId, reason, session = null) => {
    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, 'User not found');

    user.loyaltyPointsBalance += points;
    user.lifetimeEarned += points;
    await user.save({ session });

    await LoyaltyTransaction.create([{
        userId,
        points,
        type: 'admin_credit',
        description: reason || `Admin Credit`,
        balanceAfterTransaction: user.loyaltyPointsBalance
    }], { session });

    return user.loyaltyPointsBalance;
};

export const adminDebitPoints = async (userId, points, adminId, reason, session = null) => {
    const user = await User.findById(userId).session(session);
    if (!user) throw new ApiError(404, 'User not found');

    if (user.loyaltyPointsBalance < points) {
        throw new ApiError(400, `User only has ${user.loyaltyPointsBalance} points.`);
    }

    user.loyaltyPointsBalance = Math.max(0, user.loyaltyPointsBalance - points);
    user.lifetimeRedeemed += points;
    await user.save({ session });

    await LoyaltyTransaction.create([{
        userId,
        points,
        type: 'admin_debit',
        description: reason || `Admin Debit`,
        balanceAfterTransaction: user.loyaltyPointsBalance
    }], { session });

    return user.loyaltyPointsBalance;
};
