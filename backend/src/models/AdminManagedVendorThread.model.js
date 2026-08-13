import mongoose from 'mongoose';

const adminManagedVendorThreadSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
            index: true,
        },
        managedVendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ManagedVendorUser',
            required: true,
            index: true,
        },
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ManagedShop',
            default: null,
            index: true,
        },
        lastMessage: { type: String, default: '' },
        lastSenderType: {
            type: String,
            enum: ['admin', 'managed_vendor'],
            default: 'managed_vendor',
        },
        lastActivity: { type: Date, default: Date.now, index: true },
        unreadCountAdmin: { type: Number, default: 0, min: 0 },
        unreadCountVendor: { type: Number, default: 0, min: 0 },
        status: {
            type: String,
            enum: ['active', 'archived', 'resolved'],
            default: 'active',
            index: true,
        },
    },
    { timestamps: true }
);

adminManagedVendorThreadSchema.index({ adminId: 1, managedVendorId: 1 }, { unique: true });

const AdminManagedVendorThread = mongoose.models.AdminManagedVendorThread || mongoose.model('AdminManagedVendorThread', adminManagedVendorThreadSchema);
export { AdminManagedVendorThread };
export default AdminManagedVendorThread;
