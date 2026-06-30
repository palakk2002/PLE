import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  totalCredit: {
    type: Number,
    default: 0
  },
  totalDebit: {
    type: Number,
    default: 0
  },
  isFrozen: {
    type: Boolean,
    default: false
  },
  frozenAt: {
    type: Date
  },
  frozenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
}, { timestamps: true });

export default mongoose.model('Wallet', walletSchema);
