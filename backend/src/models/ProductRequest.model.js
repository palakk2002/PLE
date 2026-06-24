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
        ref: 'Vendor'
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
        enum: ['Submitted', 'Under Review', 'Seller Responded', 'Accepted', 'Rejected', 'Product Added'],
        default: 'Submitted'
    },
    timeline: [timelineSchema],
    sellerResponses: [sellerResponseSchema]
}, { timestamps: true });

// Ensure timeline has the initial state upon creation
productRequestSchema.pre('save', function (next) {
    if (this.isNew && this.timeline.length === 0) {
        this.timeline.push({
            status: 'Submitted',
            comment: 'Your product request has been successfully submitted.'
        });
    }
    next();
});

const ProductRequest = mongoose.model('ProductRequest', productRequestSchema);

export default ProductRequest;
