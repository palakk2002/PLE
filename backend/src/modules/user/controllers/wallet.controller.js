import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import User from '../../../models/User.model.js';
import * as walletService from '../../../services/wallet.service.js';

// GET /api/user/wallet
export const getWallet = asyncHandler(async (req, res) => {
    const summary = await walletService.getWalletSummary(req.user.id);
    const { transactions } = await walletService.getTransactionHistory(req.user.id, { page: 1, limit: 50 });

    res.status(200).json(new ApiResponse(200, {
        balance: summary.balance,
        totalCredit: summary.totalCredit,
        totalDebit: summary.totalDebit,
        isFrozen: summary.isFrozen,
        currency: summary.currency,
        transactions
    }, 'Wallet fetched successfully.'));
});

// GET /api/user/wallet/summary
export const getWalletSummary = asyncHandler(async (req, res) => {
    const summary = await walletService.getWalletSummary(req.user.id);
    res.status(200).json(new ApiResponse(200, summary, 'Wallet summary fetched successfully.'));
});

// GET /api/user/wallet/transactions
export const getWalletTransactions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;

    const data = await walletService.getTransactionHistory(req.user.id, { page, limit, category });
    res.status(200).json(new ApiResponse(200, data, 'Wallet transaction history fetched successfully.'));
});

// POST /api/user/wallet/add
export const addFunds = asyncHandler(async (req, res) => {
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, 'Invalid amount to add.');
    }

    const { wallet, transaction } = await walletService.creditWallet({
        userId: req.user.id,
        amount,
        category: 'recharge',
        description: `Added funds via ${paymentMethod || 'Online Payment'}`
    });

    res.status(200).json(new ApiResponse(200, {
        balance: wallet.balance,
        transaction
    }, 'Funds added successfully.'));
});

// POST /api/user/wallet/transfer
export const transferFunds = asyncHandler(async (req, res) => {
    const { recipientEmailOrPhone, amount } = req.body;

    if (!amount || amount <= 0) {
        throw new ApiError(400, 'Invalid amount to transfer.');
    }

    // Find recipient
    const recipient = await User.findOne({
        $or: [
            { email: recipientEmailOrPhone.toLowerCase() },
            { phone: recipientEmailOrPhone }
        ]
    });

    if (!recipient) {
        throw new ApiError(404, 'Recipient not found.');
    }

    if (String(recipient._id) === String(req.user.id)) {
        throw new ApiError(400, 'Cannot transfer funds to yourself.');
    }

    // Perform debit & credit in transaction inside walletService
    const { wallet: senderWallet, transaction: debitTx } = await walletService.debitWallet({
        userId: req.user.id,
        amount,
        category: 'transfer_out',
        description: `Transferred to ${recipient.name || recipientEmailOrPhone}`
    });

    await walletService.creditWallet({
        userId: recipient._id,
        amount,
        category: 'transfer_in',
        description: `Received from ${req.user.name || 'User'}`
    });

    res.status(200).json(new ApiResponse(200, {
        balance: senderWallet.balance,
        transaction: debitTx
    }, 'Funds transferred successfully.'));
});

// POST /api/user/wallet/withdraw
export const withdrawFunds = asyncHandler(async (req, res) => {
    const { amount, bankDetails } = req.body;

    if (!amount || amount <= 0) {
        throw new ApiError(400, 'Invalid withdrawal amount.');
    }

    if (!bankDetails || !bankDetails.accountNumber || !bankDetails.ifscCode) {
        throw new ApiError(400, 'Valid bank details are required.');
    }

    const { wallet, transaction } = await walletService.debitWallet({
        userId: req.user.id,
        amount,
        category: 'withdrawal',
        description: `Withdrawal request to ${bankDetails.bankName || 'Bank'}`
    });

    // Note: The transaction schema already has bankDetails support. Update status if required.
    transaction.bankDetails = bankDetails;
    transaction.status = 'pending';
    await transaction.save();

    res.status(200).json(new ApiResponse(200, {
        balance: wallet.balance,
        transaction
    }, 'Withdrawal request submitted successfully.'));
});
