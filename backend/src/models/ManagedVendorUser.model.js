import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const managedVendorUserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        username: { type: String, required: true, unique: true, lowercase: true, index: true, trim: true },
        password: { type: String, required: true, select: false },
        role: { type: String, default: 'managed_vendor' },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManagedShop', required: true, index: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        refreshTokenHash: { type: String, select: false },
        refreshTokenExpiresAt: { type: Date, select: false }
    },
    { timestamps: true }
);

// Hash password before saving
managedVendorUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
managedVendorUserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const ManagedVendorUser = mongoose.model('ManagedVendorUser', managedVendorUserSchema);
export { ManagedVendorUser };
export default ManagedVendorUser;
