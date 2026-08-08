import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendEmail } from './email.service.js';
import ApiError from '../utils/ApiError.js';

// Models
import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';
import Vendor from '../models/Vendor.model.js';
import ManagedVendorUser from '../models/ManagedVendorUser.model.js';
import DeliveryBoy from '../models/DeliveryBoy.model.js';

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Get the mongoose model based on role/type
 */
export const getModelByRole = (role) => {
    switch (role) {
        case 'admin':
        case 'superadmin':
            return Admin;
        case 'vendor':
            return Vendor;
        case 'managed_vendor':
            return ManagedVendorUser;
        case 'delivery':
            return DeliveryBoy;
        case 'customer':
        case 'b2bAdmin':
        case 'b2bEmployee':
            return User;
        default:
            return null;
    }
};

/**
 * Sign restricted pre-authentication token
 */
export const signPreAuthToken = (payload) => {
    return jwt.sign(
        { id: payload.id, role: payload.role, email: payload.email, type: '2fa_pending' },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
    );
};

/**
 * Generate cryptographically secure OTP and save to DB
 */
export const send2FAOtp = async (user, role) => {
    const email = user.email || user.username; // For managed vendor
    if (!email) {
        throw new ApiError(400, 'User has no registered email to receive OTP.');
    }

    // Cooldown check
    if (user.twoFactorOtpExpiry) {
        const remainingSeconds = Math.ceil((user.twoFactorOtpExpiry.getTime() - Date.now() - (5 - 1) * 60 * 1000) / 1000);
        // If they requested within 30 seconds, reject
        const timeElapsed = 300 - remainingSeconds;
        if (timeElapsed < RESEND_COOLDOWN_SECONDS) {
            throw new ApiError(429, `Please wait ${RESEND_COOLDOWN_SECONDS - timeElapsed} seconds before requesting a new OTP.`);
        }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    user.twoFactorOtp = otp;
    user.twoFactorOtpExpiry = expiry;
    user.twoFactorAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
        await sendEmail({
            to: email,
            subject: 'Your Two-Factor Authentication (2FA) Code',
            text: `Your 2FA verification code is ${otp}. It will expire in 5 minutes.`,
            html: `<p>Your Two-Factor Authentication (2FA) verification code is <strong>${otp}</strong>.</p><p>It will expire in 5 minutes.</p>`,
        });
    } catch (err) {
        console.warn(`[2FA OTP] Email delivery failed for ${email}: ${err.message}`);
    }

    // Console log for non-prod environments
    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n==========================================`);
        console.log(`[2FA OTP] for ${email} (${role}): ${otp}`);
        console.log(`==========================================\n`);
    }

    return otp;
};

/**
 * Verify 2FA OTP and clear database fields if successful
 */
export const verify2FAOtp = async (user, otp) => {
    if (!user.twoFactorOtp || !user.twoFactorOtpExpiry) {
        throw new ApiError(400, 'No 2FA session found. Please login again.');
    }

    if (Date.now() > user.twoFactorOtpExpiry.getTime()) {
        throw new ApiError(400, '2FA code has expired. Please request a new one.');
    }

    if (user.twoFactorAttempts >= MAX_ATTEMPTS) {
        throw new ApiError(400, 'Too many incorrect attempts. Please request a new OTP.');
    }

    // Developer bypass for non-prod
    const isDevBypass = process.env.NODE_ENV !== 'production' && otp === '123456';

    if (user.twoFactorOtp !== String(otp).trim() && !isDevBypass) {
        user.twoFactorAttempts += 1;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(400, `Invalid 2FA code. ${MAX_ATTEMPTS - user.twoFactorAttempts} attempts remaining.`);
    }

    // Success: clear 2FA OTP state
    user.twoFactorOtp = undefined;
    user.twoFactorOtpExpiry = undefined;
    user.twoFactorAttempts = 0;
    await user.save({ validateBeforeSave: false });

    return true;
};
