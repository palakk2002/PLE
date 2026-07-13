import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import Vendor from '../../../models/Vendor.model.js';
import ManagedVendorUser from '../../../models/ManagedVendorUser.model.js';
import Admin from '../../../models/Admin.model.js';
import { generateTokens } from '../../../utils/generateToken.js';
import { sendOTP } from '../../../services/otp.service.js';
import { createNotification } from '../../../services/notification.service.js';
import { sendEmail } from '../../../services/email.service.js';
import {
    clearRefreshSession,
    decodeRefreshTokenOrThrow,
    persistRefreshSession,
    rotateRefreshSession,
} from '../../../services/refreshToken.service.js';

// POST /api/vendor/auth/register
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone, storeName, storeDescription, address } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const existing = await Vendor.findOne({ email: normalizedEmail });
    if (existing) throw new ApiError(409, 'Email already registered.');

    const vendor = await Vendor.create({
        name: String(name || '').trim(),
        email: normalizedEmail,
        password,
        phone: String(phone || '').trim(),
        storeName: String(storeName || '').trim(),
        storeDescription: String(storeDescription || '').trim(),
        address,
        status: 'pending'
    });
    await sendOTP(vendor, 'vendor_verification');

    // Notify all active admins about a new vendor registration request.
    const admins = await Admin.find({ isActive: true }).select('_id');
    await Promise.all(
        admins.map((admin) =>
            createNotification({
                recipientId: admin._id,
                recipientType: 'admin',
                title: 'New Vendor Registration',
                message: `${vendor.storeName || vendor.name} has registered and is awaiting review.`,
                type: 'system',
                data: {
                    vendorId: String(vendor._id),
                    vendorEmail: vendor.email,
                    status: vendor.status,
                },
            })
        )
    );

    res.status(201).json(new ApiResponse(201, { email: vendor.email }, 'Registration submitted. Please verify your email and await admin approval.'));
});

// POST /api/vendor/auth/verify-otp
export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const vendor = await Vendor.findOne({ email }).select('+otp +otpExpiry');
    if (!vendor) throw new ApiError(404, 'Vendor not found.');
    
    const isDemoOtp = 
        /^(.)\1{5}$/.test(otp) || // e.g. "111111", "222222", etc.
        otp === '123456' || 
        (Number(otp) >= 1 && Number(otp) <= 10);
    if (!isDemoOtp) {
        if (vendor.otp !== otp) throw new ApiError(400, 'Invalid OTP.');
        if (vendor.otpExpiry < Date.now()) throw new ApiError(400, 'OTP has expired.');
    }

    vendor.isVerified = true;
    vendor.otp = undefined;
    vendor.otpExpiry = undefined;
    await vendor.save();

    res.status(200).json(new ApiResponse(200, null, 'Email verified. Awaiting admin approval.'));
});

// POST /api/vendor/auth/resend-otp
export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, 'Email is required.');

    const vendor = await Vendor.findOne({ email });
    if (!vendor) throw new ApiError(404, 'Vendor not found.');
    if (vendor.isVerified) throw new ApiError(400, 'Email is already verified.');

    await sendOTP(vendor, 'vendor_verification');
    res.status(200).json(new ApiResponse(200, null, 'OTP resent successfully. Please check your email.'));
});

// POST /api/vendor/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const vendor = await Vendor.findOne({ email: normalizedEmail }).select('+resetOtp +resetOtpExpiry +resetOtpVerified');

    // Keep response generic to avoid account enumeration.
    if (!vendor) {
        return res.status(200).json(
            new ApiResponse(200, null, 'If the email exists, a reset OTP has been sent.')
        );
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    vendor.resetOtp = otp;
    vendor.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    vendor.resetOtpVerified = false;
    await vendor.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            to: vendor.email,
            subject: 'Vendor password reset OTP',
            text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your password reset OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        });
    } catch (err) {
        console.warn(`[Vendor Forgot Password] Email send failed for ${vendor.email}: ${err.message}`);
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[Vendor Forgot Password] Reset OTP generated for ${vendor.email}`);
        }
    }

    return res.status(200).json(
        new ApiResponse(200, null, 'If the email exists, a reset OTP has been sent.')
    );
});

// POST /api/vendor/auth/verify-reset-otp
export const verifyResetOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const vendor = await Vendor.findOne({ email: normalizedEmail }).select('+resetOtp +resetOtpExpiry +resetOtpVerified');
    if (!vendor) throw new ApiError(404, 'Vendor not found.');
    if (!vendor.resetOtp || !vendor.resetOtpExpiry) throw new ApiError(400, 'No reset OTP requested.');
    if (vendor.resetOtpExpiry < new Date()) throw new ApiError(400, 'Reset OTP has expired.');
    if (vendor.resetOtp !== String(otp)) throw new ApiError(400, 'Invalid reset OTP.');

    vendor.resetOtpVerified = true;
    await vendor.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, null, 'Reset OTP verified.'));
});

// POST /api/vendor/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const vendor = await Vendor.findOne({ email: normalizedEmail }).select('+password +resetOtp +resetOtpExpiry +resetOtpVerified');
    if (!vendor) throw new ApiError(404, 'Vendor not found.');
    if (!vendor.resetOtpVerified) throw new ApiError(400, 'Please verify reset OTP first.');
    if (!vendor.resetOtp || !vendor.resetOtpExpiry) throw new ApiError(400, 'No reset OTP requested.');
    if (vendor.resetOtpExpiry < new Date()) throw new ApiError(400, 'Reset OTP has expired.');

    vendor.password = password;
    vendor.resetOtp = undefined;
    vendor.resetOtpExpiry = undefined;
    vendor.resetOtpVerified = false;
    vendor.refreshTokenHash = undefined;
    vendor.refreshTokenExpiresAt = undefined;
    await vendor.save();

    return res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please login.'));
});

// POST /api/vendor/auth/login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const isEmail = String(email).includes('@');
    let vendor = null;
    let isManaged = false;

    if (isEmail) {
        vendor = await Vendor.findOne({ email: String(email).toLowerCase() }).select('+password');
    }

    if (!vendor) {
        vendor = await ManagedVendorUser.findOne({ username: String(email).toLowerCase() }).select('+password').populate('shopId');
        if (vendor) {
            isManaged = true;
        }
    }

    if (!vendor) throw new ApiError(401, 'Invalid credentials.');

    if (isManaged) {
        if (vendor.status !== 'active') {
            throw new ApiError(403, 'Your account is deactivated. Contact admin.');
        }
        if (!vendor.shopId || vendor.shopId.status !== 'active') {
            throw new ApiError(403, 'Your shop is disabled or does not exist.');
        }
    } else {
        if (!vendor.isVerified) throw new ApiError(403, 'Please verify your email first.');
        if (vendor.status === 'pending') throw new ApiError(403, 'Your account is pending admin approval.');
        if (vendor.status === 'suspended') throw new ApiError(403, `Your account has been suspended. Reason: ${vendor.suspensionReason || 'Contact support.'}`);
        if (vendor.status === 'rejected') throw new ApiError(403, 'Your vendor application was rejected.');
    }

    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials.');

    const tokenPayload = isManaged
        ? { id: vendor._id, role: 'managed_vendor', email: vendor.username, shopId: vendor.shopId._id }
        : { id: vendor._id, role: 'vendor', email: vendor.email };

    const { accessToken, refreshToken } = generateTokens(tokenPayload);
    await persistRefreshSession(vendor, refreshToken);

    const resUser = isManaged
        ? { id: vendor._id, name: vendor.name, username: vendor.username, role: 'managed_vendor', shopId: vendor.shopId._id, storeName: vendor.shopId.name, storeLogo: vendor.shopId.logo }
        : { id: vendor._id, name: vendor.name, storeName: vendor.storeName, email: vendor.email, storeLogo: vendor.storeLogo, role: 'vendor' };

    res.status(200).json(new ApiResponse(200, { accessToken, refreshToken, vendor: resUser }, 'Login successful.'));
});

// POST /api/vendor/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const decoded = decodeRefreshTokenOrThrow(refreshToken);
    
    let vendor = null;
    let isManaged = false;

    if (decoded.role === 'managed_vendor') {
        vendor = await ManagedVendorUser.findById(decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt status').populate('shopId');
        isManaged = true;
    } else {
        vendor = await Vendor.findById(decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt status isVerified suspensionReason');
    }

    if (!vendor) throw new ApiError(401, 'Invalid refresh token.');

    if (isManaged) {
        if (vendor.status !== 'active') throw new ApiError(403, 'Your account is inactive.');
        if (!vendor.shopId || vendor.shopId.status !== 'active') throw new ApiError(403, 'Your shop is disabled.');
    } else {
        if (!vendor.isVerified) throw new ApiError(403, 'Please verify your email first.');
        if (vendor.status === 'pending') throw new ApiError(403, 'Your account is pending admin approval.');
        if (vendor.status === 'suspended') throw new ApiError(403, `Your account has been suspended. Reason: ${vendor.suspensionReason || 'Contact support.'}`);
        if (vendor.status === 'rejected') throw new ApiError(403, 'Your vendor application was rejected.');
    }

    const tokenPayload = isManaged
        ? { id: vendor._id, role: 'managed_vendor', email: vendor.username, shopId: vendor.shopId._id }
        : { id: vendor._id, role: 'vendor', email: vendor.email };

    const tokens = await rotateRefreshSession(
        vendor,
        tokenPayload,
        refreshToken
    );

    return res.status(200).json(new ApiResponse(200, tokens, 'Session refreshed successfully.'));
});

// POST /api/vendor/auth/logout
export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        try {
            const decoded = decodeRefreshTokenOrThrow(refreshToken);
            let vendor = null;
            if (decoded.role === 'managed_vendor') {
                vendor = await ManagedVendorUser.findById(decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt');
            } else {
                vendor = await Vendor.findById(decoded.id).select('+refreshTokenHash +refreshTokenExpiresAt');
            }
            if (vendor?.refreshTokenHash) {
                await clearRefreshSession(vendor);
            }
        } catch {
            // Keep logout idempotent.
        }
    }

    return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
});

// GET /api/vendor/auth/profile
export const getProfile = asyncHandler(async (req, res) => {
    if (req.user.role === 'managed_vendor') {
        const vendor = await ManagedVendorUser.findById(req.user.id).select('-password').populate('shopId');
        if (!vendor) throw new ApiError(404, 'Vendor not found.');
        return res.status(200).json(new ApiResponse(200, vendor, 'Profile fetched.'));
    }
    const vendor = await Vendor.findById(req.user.id).select('-password -otp -otpExpiry');
    if (!vendor) throw new ApiError(404, 'Vendor not found.');
    res.status(200).json(new ApiResponse(200, vendor, 'Profile fetched.'));
});

// PUT /api/vendor/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
    if (req.user.role === 'managed_vendor') {
        const allowed = ['name', 'phone'];
        const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
        const vendor = await ManagedVendorUser.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password').populate('shopId');
        return res.status(200).json(new ApiResponse(200, vendor, 'Profile updated.'));
    }
    const allowed = [
        'name',
        'phone',
        'storeName',
        'storeDescription',
        'storeLogo',
        'address',
        'shippingEnabled',
        'freeShippingThreshold',
        'defaultShippingRate',
        'shippingMethods',
        'handlingTime',
        'processingTime',
    ];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const vendor = await Vendor.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password -otp -otpExpiry');
    res.status(200).json(new ApiResponse(200, vendor, 'Profile updated.'));
});

// PUT /api/vendor/auth/bank-details
export const updateBankDetails = asyncHandler(async (req, res) => {
    const { accountName, accountNumber, bankName, ifscCode } = req.body;
    if (!accountName && !accountNumber && !bankName && !ifscCode) {
        throw new ApiError(400, 'At least one bank detail field is required.');
    }

    const updates = {};
    if (accountName) updates['bankDetails.accountName'] = accountName;
    if (accountNumber) updates['bankDetails.accountNumber'] = accountNumber;
    if (bankName) updates['bankDetails.bankName'] = bankName;
    if (ifscCode) updates['bankDetails.ifscCode'] = ifscCode;

    const vendor = await Vendor.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry');

    res.status(200).json(new ApiResponse(200, vendor, 'Bank details updated.'));
});
