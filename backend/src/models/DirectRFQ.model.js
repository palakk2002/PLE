import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ['Employee', 'Vendor'], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    priceOffer: { type: Number }, // If message includes a price offer
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const directRfqSchema = new mongoose.Schema({
    directRfqId: { type: String, required: true, unique: true, index: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'B2BCompany', required: true, index: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
    
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    customProductName: { type: String },
    category: { type: String },
    
    quantity: { type: Number, required: true },
    targetPrice: { type: Number, required: true },
    requirementDetails: { type: String },
    expectedDeliveryDate: { type: Date },
    attachment: { type: String },
    
    status: {
        type: String,
        enum: [
            'Pending Vendor',
            'Negotiating',
            'Vendor Accepted',
            'Pending Admin Approval', // When Employee locks it and sends to B2B Admin
            'PO Generated',
            'Rejected'
        ],
        default: 'Pending Vendor',
        index: true
    },
    
    finalAgreedPrice: { type: Number }, // Set when agreement is reached
    
    messages: [messageSchema]
}, { timestamps: true });

const DirectRFQ = mongoose.models.DirectRFQ || mongoose.model('DirectRFQ', directRfqSchema);
export default DirectRFQ;
export { DirectRFQ };
