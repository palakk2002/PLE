import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const vendorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, index: true },
        password: { type: String, required: true, select: false },
        phone: { type: String },
        storeName: { type: String, required: true },
        storeLogo: { type: String },
        storeDescription: { type: String },
        status: {
            type: String,
            enum: ['pending', 'approved', 'suspended', 'rejected'],
            default: 'pending',
            index: true,
        },
        suspensionReason: { type: String },
        commissionRate: { type: Number, default: 10, min: 0, max: 100 },
        isVerified: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        totalSales: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        shippingEnabled: { type: Boolean, default: true },
        freeShippingThreshold: { type: Number, default: 100, min: 0 },
        defaultShippingRate: { type: Number, default: 5, min: 0 },
        shippingMethods: {
            type: [{ type: String, enum: ['standard', 'express', 'overnight'] }],
            default: ['standard'],
        },
        handlingTime: { type: Number, default: 1, min: 0 },
        processingTime: { type: Number, default: 1, min: 0 },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        bankDetails: {
            accountName: { type: String, select: false },
            accountNumber: { type: String, select: false },
            bankName: { type: String, select: false },
            ifscCode: { type: String, select: false },
        },
        documents: {
            gst: String,
            pan: String,
            aadhar: String,
            businessLicense: String,
        },
        b2bSettings: {
            autoResponse: { type: Boolean, default: false },
            autoResponseMessage: { type: String, default: "Thank you for submitting a Request For Quotation. We will review your product requirement list and submit a custom wholesale quotation shortly." },
            defaultPaymentTerms: { type: String, default: "Net 30 days" },
            defaultShippingTerms: { type: String, default: "FOB Origin" },
            minimumOrderValue: { type: Number, default: 50000 },
            defaultQuoteValidity: { type: Number, default: 15 },
            notifyOnNewEnquiry: { type: Boolean, default: true },
            notifyOnQuoteResponse: { type: Boolean, default: true },
            notifyOnEnquiryExpiring: { type: Boolean, default: true },
        },
        otp: { type: String, select: false },
        otpExpiry: { type: Date, select: false },
        resetOtp: { type: String, select: false },
        resetOtpExpiry: { type: Date, select: false },
        resetOtpVerified: { type: Boolean, default: false, select: false },
        refreshTokenHash: { type: String, select: false },
        refreshTokenExpiresAt: { type: Date, select: false },
        joinDate: { type: Date, default: Date.now },
        // FCM Tokens
        fcmTokens: {
            type: [String],
            default: []
        },
        fcmTokenMobile: {
            type: [String],
            default: []
        },
        // Business Verification & Type Management fields
        businessType: {
            type: String,
            enum: ['Home Business', 'Small Business', 'MSME', 'Startup', 'Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Other'],
            default: 'Other'
        },
        gstRegistered: { type: Boolean, default: false },
        businessName: { type: String },
        tradeName: { type: String },
        gstNumber: { type: String },
        panNumber: { type: String },
        gstCertificate: { type: String },
        msmeCertificate: { type: String },
        ownerName: { type: String },
        businessAddress: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        identityProof: { type: String },
        verificationStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Unsubmitted'],
            default: 'Pending'
        },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        verifiedAt: { type: Date },
        verificationRemark: { type: String }
    },
    { timestamps: true }
);

vendorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

vendorSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Vendor = mongoose.model('Vendor', vendorSchema);
export { Vendor };
export default Vendor;
