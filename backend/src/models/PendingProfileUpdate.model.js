import mongoose from 'mongoose';

const pendingProfileUpdateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'userModel'
        },
        userModel: {
            type: String,
            required: true,
            enum: ['User', 'Vendor', 'ManagedVendorUser', 'DeliveryBoy']
        },
        role: {
            type: String,
            required: true
        },
        pendingData: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        otpExpiry: {
            type: Date,
            required: true
        },
        attempts: {
            type: Number,
            default: 0
        },
        resendCount: {
            type: Number,
            default: 0
        },
        lastResendTime: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Expire records after 15 minutes automatically using MongoDB TTL index
pendingProfileUpdateSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const PendingProfileUpdate = mongoose.model('PendingProfileUpdate', pendingProfileUpdateSchema);
export default PendingProfileUpdate;
export { PendingProfileUpdate };
