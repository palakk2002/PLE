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
            enum: ['earn', 'redeem'],
            required: true
        },
        description: {
            type: String,
            required: true
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
