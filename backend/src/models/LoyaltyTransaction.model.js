import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            index: true
        },
        points: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ['earn', 'redeem', 'refund_adjustment', 'admin_credit', 'admin_debit', 'bonus', 'campaign_reward', 'reversal'],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        orderType: {
            type: String,
            enum: ['B2C', 'B2B'],
            default: 'B2C'
        },
        balanceAfterTransaction: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const LoyaltyTransaction = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
export { LoyaltyTransaction };
export default LoyaltyTransaction;
