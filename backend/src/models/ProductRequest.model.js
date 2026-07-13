import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String
    }
}, { _id: false });

const sellerResponseSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sellerResponses.sellerType'
    },
    sellerType: {
        type: String,
        enum: ['Vendor', 'ManagedVendorUser', 'Admin'],
        required: true,
        default: 'Vendor'
    },
    responseType: {
        type: String,
        enum: ['Can Supply', 'Need Info'],
        default: 'Can Supply'
    },
    offeredPrice: {
        type: Number
    },
    deliveryTimeline: {
        type: Number // in days
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'auditLog.performerType'
    },
    performerType: {
        type: String,
        enum: ['User', 'Vendor', 'ManagedVendorUser', 'Admin'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    reason: {
        type: String
    }
}, { _id: false });

const productRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestType: {
        type: String,
        enum: ['GENERAL', 'SHOP_SPECIFIC'],
        default: 'GENERAL',
        index: true
    },
    targetEntityType: {
        type: String,
        enum: ['Vendor', 'ManagedShop'],
        required: function() { return this.requestType === 'SHOP_SPECIFIC'; }
    },
    targetEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function() { return this.requestType === 'SHOP_SPECIFIC'; },
        refPath: 'targetEntityType',
        index: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    expectedBudget: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Seller Responded', 'Accepted', 'Rejected', 'Product Added', 'Completed', 'Cancelled'],
        default: 'Submitted',
        index: true
    },
    timeline: [timelineSchema],
    sellerResponses: [sellerResponseSchema],
    auditLog: [auditLogSchema]
}, { timestamps: true });

// Compounding index for user and dates
productRequestSchema.index({ userId: 1, createdAt: -1 });

// Ensure timeline and auditLog has the initial state upon creation
productRequestSchema.pre('save', function (next) {
    if (this.isNew) {
        if (this.timeline.length === 0) {
            this.timeline.push({
                status: 'Submitted',
                comment: 'Your product request has been successfully submitted.'
            });
        }
        if (this.auditLog.length === 0) {
            this.auditLog.push({
                action: 'Created',
                performedBy: this.userId,
                performerType: 'User',
                reason: 'Initial submission of product request.'
            });
        }
    }
    next();
});

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);

export default ProductRequest;
