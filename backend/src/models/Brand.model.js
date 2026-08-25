import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        logo: { type: String },
        description: { type: String },
        website: { type: String, trim: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved',
            index: true,
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            index: true,
        },
        requestedByShop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ManagedShop',
        },
        rejectionReason: { type: String },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        reviewedAt: { type: Date },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
export { Brand };
export default Brand;
