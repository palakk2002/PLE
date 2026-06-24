import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import Wallet from '../../../models/Wallet.model.js';
import WalletTransaction from '../../../models/WalletTransaction.model.js';
import User from '../../../models/User.model.js';

// GET /api/user/wallet
export const getWallet = asyncHandler(async (req, res) => {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
        wallet = await Wallet.create({ userId: req.user.id, balance: 0 });
    }

    const transactions = await WalletTransaction.find({ walletId: wallet._id })
        .sort({ createdAt: -1 })
        .limit(50); // Get latest 50 transactions

    res.status(200).json(new ApiResponse(200, {
        balance: wallet.balance,
        currency: wallet.currency,
        transactions
    }, 'Wallet fetched successfully.'));
});

// POST /api/user/wallet/add
export const addFunds = asyncHandler(async (req, res) => {
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, 'Invalid amount to add.');
    }

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
        wallet = await Wallet.create({ userId: req.user.id, balance: 0 });
    }

    // Update balance
    wallet.balance += Number(amount);
    await wallet.save();

    // Create transaction record
    const transaction = await WalletTransaction.create({
        walletId: wallet._id,
        userId: req.user.id,
        amount: Number(amount),
        type: 'credit',
        description: `Added funds via ${paymentMethod || 'Online Payment'}`,
        status: 'completed'
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

    let senderWallet = await Wallet.findOne({ userId: req.user.id });
    if (!senderWallet || senderWallet.balance < amount) {
        throw new ApiError(400, 'Insufficient wallet balance.');
    }

    let recipientWallet = await Wallet.findOne({ userId: recipient._id });
    if (!recipientWallet) {
        recipientWallet = await Wallet.create({ userId: recipient._id, balance: 0 });
    }

    // Debit Sender
    senderWallet.balance -= Number(amount);
    await senderWallet.save();

    // Credit Recipient
    recipientWallet.balance += Number(amount);
    await recipientWallet.save();

    // Create Sender Transaction (Debit)
    const debitTx = await WalletTransaction.create({
        walletId: senderWallet._id,
        userId: req.user.id,
        amount: Number(amount),
        type: 'debit',
        description: `Transferred to ${recipient.name || recipientEmailOrPhone}`,
        status: 'completed'
    });

    // Create Recipient Transaction (Credit)
    await WalletTransaction.create({
        walletId: recipientWallet._id,
        userId: recipient._id,
        amount: Number(amount),
        type: 'credit',
        description: `Received from ${req.user.name || 'User'}`,
        status: 'completed'
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

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.balance < amount) {
        throw new ApiError(400, 'Insufficient wallet balance for withdrawal.');
    }

    // Deduct immediately, mark as pending
    wallet.balance -= Number(amount);
    await wallet.save();

    const transaction = await WalletTransaction.create({
        walletId: wallet._id,
        userId: req.user.id,
        amount: Number(amount),
        type: 'debit',
        description: `Withdrawal request to ${bankDetails.bankName || 'Bank'}`,
        status: 'pending',
        bankDetails: bankDetails
    });

    res.status(200).json(new ApiResponse(200, {
        balance: wallet.balance,
        transaction
    }, 'Withdrawal request submitted successfully.'));
});
