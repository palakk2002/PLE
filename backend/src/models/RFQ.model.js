import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    senderType: { type: String, enum: ['buyer', 'seller'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: Number },
    quantity: { type: Number },
    deliveryTimeline: { type: String }, // e.g. "5 days", "2026-06-20"
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const rfqSchema = new mongoose.Schema(
    {
        rfqId: { type: String, required: true, unique: true, index: true },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', index: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
        customProductName: { type: String },
        quantity: { type: Number, required: true },
        targetPrice: { type: Number, required: true },
        requirementDetails: { type: String },
        expectedDeliveryDate: { type: Date },
        attachment: { type: String }, // optional document URL
        status: {
            type: String,
            enum: ['Pending', 'Quoted', 'Negotiating', 'Accepted', 'Rejected', 'Converted To Order'],
            default: 'Pending',
            index: true
        },
        timeline: [timelineSchema]
    },
    { timestamps: true }
);

const RFQ = mongoose.model('RFQ', rfqSchema);
export default RFQ;
export { RFQ };
