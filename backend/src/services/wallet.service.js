import Wallet from '../models/Wallet.model.js';
import WalletTransaction from '../models/WalletTransaction.model.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Get or create a wallet for a user
 */
export const getOrCreateWallet = async (userId, session = null) => {
    let wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) {
        wallet = await Wallet.create([{ userId, balance: 0, totalCredit: 0, totalDebit: 0, isFrozen: false }], { session });
        wallet = wallet[0];
    }
    return wallet;
};

/**
 * Credit funds to a user's wallet with session safety and optional idempotency
 */
export const creditWallet = async ({
    userId,
    amount,
    category,
    description,
    orderId = null,
    returnRequestId = null,
    idempotencyKey = null,
    session = null
}) => {
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new ApiError(400, 'Invalid amount for wallet credit.');
    }

    const localSession = session || (await mongoose.startSession());
    let isLocalTransaction = !session;

    try {
        if (isLocalTransaction) {
            localSession.startTransaction();
        }

        // 1. Check idempotency first if key provided
        if (idempotencyKey) {
            const existingTx = await WalletTransaction.findOne({ idempotencyKey }).session(localSession);
            if (existingTx) {
                // If transaction already processed, return existing wallet info to avoid double credits
                const wallet = await getOrCreateWallet(userId, localSession);
                if (isLocalTransaction) await localSession.commitTransaction();
                return { wallet, transaction: existingTx, alreadyProcessed: true };
            }
        }

        // 2. Fetch/Create wallet
        const wallet = await getOrCreateWallet(userId, localSession);

        // 3. Update wallet totals and balance
        wallet.balance = parseFloat((wallet.balance + parsedAmount).toFixed(2));
        wallet.totalCredit = parseFloat((wallet.totalCredit + parsedAmount).toFixed(2));
        await wallet.save({ session: localSession });

        // 4. Record Transaction
        const [transaction] = await WalletTransaction.create([{
            walletId: wallet._id,
            userId,
            amount: parsedAmount,
            type: 'credit',
            transactionCategory: category,
            balanceAfterTransaction: wallet.balance,
            orderId,
            returnRequestId,
            idempotencyKey,
            description,
            status: 'completed'
        }], { session: localSession });

        if (isLocalTransaction) {
            await localSession.commitTransaction();
        }

        return { wallet, transaction, alreadyProcessed: false };

    } catch (error) {
        if (isLocalTransaction) {
            await localSession.abortTransaction();
        }
        throw error;
    } finally {
        if (isLocalTransaction) {
            await localSession.endSession();
        }
    }
};

/**
 * Debit funds from a user's wallet with session safety
 */
export const debitWallet = async ({
    userId,
    amount,
    category,
    description,
    orderId = null,
    session = null
}) => {
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new ApiError(400, 'Invalid amount for wallet debit.');
    }

    const localSession = session || (await mongoose.startSession());
    let isLocalTransaction = !session;

    try {
        if (isLocalTransaction) {
            localSession.startTransaction();
        }

        const wallet = await getOrCreateWallet(userId, localSession);

        if (wallet.isFrozen) {
            throw new ApiError(400, 'Wallet is frozen. Cannot perform debit transactions.');
        }

        if (wallet.balance < parsedAmount) {
            throw new ApiError(400, 'Insufficient wallet balance.');
        }

        // Update totals
        wallet.balance = parseFloat((wallet.balance - parsedAmount).toFixed(2));
        wallet.totalDebit = parseFloat((wallet.totalDebit + parsedAmount).toFixed(2));
        await wallet.save({ session: localSession });

        // Create Debit Transaction
        const [transaction] = await WalletTransaction.create([{
            walletId: wallet._id,
            userId,
            amount: parsedAmount,
            type: 'debit',
            transactionCategory: category,
            balanceAfterTransaction: wallet.balance,
            orderId,
            description,
            status: 'completed'
        }], { session: localSession });

        if (isLocalTransaction) {
            await localSession.commitTransaction();
        }

        return { wallet, transaction };

    } catch (error) {
        if (isLocalTransaction) {
            await localSession.abortTransaction();
        }
        throw error;
    } finally {
        if (isLocalTransaction) {
            await localSession.endSession();
        }
    }
};

/**
 * Fetch wallet and latest transactions with filters and pagination
 */
export const getWalletSummary = async (userId) => {
    const wallet = await getOrCreateWallet(userId);
    return {
        balance: wallet.balance,
        totalCredit: wallet.totalCredit,
        totalDebit: wallet.totalDebit,
        isFrozen: wallet.isFrozen,
        currency: wallet.currency
    };
};

export const getTransactionHistory = async (userId, { page = 1, limit = 10, category = null } = {}) => {
    const query = { userId };
    if (category && category !== 'all') {
        if (category === 'refunds') {
            query.transactionCategory = 'refund';
        } else {
            query.transactionCategory = category;
        }
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        WalletTransaction.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        WalletTransaction.countDocuments(query)
    ]);

    return {
        transactions: transactions.map(tx => ({
            ...tx,
            id: tx._id
        })),
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Freeze a user's wallet
 */
export const freezeWallet = async (userId, adminId) => {
    const wallet = await getOrCreateWallet(userId);
    wallet.isFrozen = true;
    wallet.frozenAt = new Date();
    wallet.frozenBy = adminId;
    await wallet.save();
    return wallet;
};

/**
 * Unfreeze a user's wallet
 */
export const unfreezeWallet = async (userId) => {
    const wallet = await getOrCreateWallet(userId);
    wallet.isFrozen = false;
    wallet.frozenAt = undefined;
    wallet.frozenBy = undefined;
    await wallet.save();
    return wallet;
};
