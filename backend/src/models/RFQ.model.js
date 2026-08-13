import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    senderType: { type: String, enum: ['buyer', 'seller', 'admin'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: Number },
    quantity: { type: Number },
    deliveryTimeline: { type: String }, // e.g. "5 days", "2026-06-20"
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const quotationMessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ['Vendor', 'SuperAdmin'], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const quotationSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveryTime: { type: String, required: true },
    warranty: { type: String },
    taxDetails: { type: String },
    additionalNotes: { type: String },
    attachments: [{ type: String }],
    status: { type: String, enum: ['Submitted', 'Negotiating', 'Selected', 'Rejected'], default: 'Submitted' },
    messages: [quotationMessageSchema],
    createdAt: { type: Date, default: Date.now }
});

const negotiationMessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ['B2BAdmin', 'Employee', 'b2bAdmin', 'b2bEmployee', 'SuperAdmin'], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    isInternalNote: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const approvalHistorySchema = new mongoose.Schema({
    status: { type: String, required: true },
    action: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId },
    updaterType: { type: String, enum: ['SuperAdmin', 'B2BAdmin', 'Employee', 'b2bAdmin', 'b2bEmployee', 'System'], required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const rfqSchema = new mongoose.Schema(
    {
        rfqId: { type: String, required: true, unique: true, index: true },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'B2BCompany', required: true, index: true },
        companyName: { type: String, required: true },
        createdByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
        createdByEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
        assignedVendorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', index: true }],
        
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // For backwards compatibility
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', index: true }, // For backwards compatibility
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
        customProductName: { type: String },
        quantity: { type: Number, required: true },
        targetPrice: { type: Number, required: true },
        requirementDetails: { type: String },
        qualityStandards: { type: String },
        termsConditions: { type: String },
        expectedDeliveryDate: { type: Date },
        attachment: { type: String }, // optional general document URL
        priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
        category: { type: String }, // e.g. "Electronics"
        
        status: {
            type: String,
            enum: [
                'Draft',
                'Submitted',
                'Pending',
                'Under Review',
                'Approved',
                'Sent To Vendors',
                'Quotations Received',
                'Vendor Evaluation',
                'Vendor Negotiation',
                'Vendor Selected',
                'Awaiting B2B Approval',
                'Purchase Order Generated',
                'Completed',
                'Rejected'
            ],
            default: 'Draft',
            index: true
        },
        
        quotations: [quotationSchema],
        negotiationMessages: [negotiationMessageSchema],
        approvalHistory: [approvalHistorySchema],
        timeline: [timelineSchema] // For backwards compatibility
    },
    { timestamps: true }
);

const RFQ = mongoose.models.RFQ || mongoose.model('RFQ', rfqSchema);
export default RFQ;
export { RFQ };
