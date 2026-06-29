import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  walletId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Wallet', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['credit', 'debit'], 
    required: true 
  },
  transactionCategory: {
    type: String,
    enum: ['refund', 'order_payment', 'cashback', 'admin_credit', 'admin_debit', 'recharge', 'referral_reward', 'transfer_in', 'transfer_out', 'withdrawal'],
    required: true,
    default: 'recharge'
  },
  amount: { 
    type: Number, 
    required: true 
  },
  balanceAfterTransaction: {
    type: Number,
    required: true,
    default: 0
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  returnRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReturnRequest'
  },
  idempotencyKey: {
    type: String,
    sparse: true
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  },
  // Used for withdrawals
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String
  }
}, { timestamps: true });

transactionSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
transactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('WalletTransaction', transactionSchema);
