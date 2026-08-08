import crypto from 'crypto';
import PendingProfileUpdate from '../models/PendingProfileUpdate.model.js';
import { sendEmail } from './email.service.js';
import ApiError from '../utils/ApiError.js';

const OTP_COOLDOWN_SECONDS = 30;
const MAX_RESENDS = 5;
const MAX_ATTEMPTS = 5;
const OTP_EXPIRY_MINUTES = 5;

/**
 * Generates a new cryptographically secure 6-digit OTP and creates or updates a pending profile update.
 */
export const initiateProfileUpdateOTP = async ({ userId, userModel, role, email, pendingData }) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Delete existing pending updates for this user to avoid stale requests
    await PendingProfileUpdate.deleteMany({ userId, userModel });

    const pendingUpdate = await PendingProfileUpdate.create({
        userId,
        userModel,
        role,
        pendingData,
        otp,
        otpExpiry,
        attempts: 0,
        resendCount: 0,
        lastResendTime: new Date()
    });

    // Send email
    try {
        await sendEmail({
            to: email,
            subject: 'Verify your profile update',
            text: `Your verification OTP for updating your profile is ${otp}. It expires in 5 minutes.`,
            html: `<p>Your verification OTP for updating your profile is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
        });
    } catch (err) {
        console.warn(`[Profile OTP] Email delivery failed for ${email}: ${err.message}`);
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n==========================================`);
        console.log(`[PROFILE_UPDATE OTP] for ${email}: ${otp}`);
        console.log(`==========================================\n`);
    }

    return pendingUpdate._id;
};

/**
 * Resends OTP for a pending profile update with cooldown and rate limit checks.
 */
export const resendProfileUpdateOTP = async (pendingUpdateId, email) => {
    const pendingUpdate = await PendingProfileUpdate.findById(pendingUpdateId);
    if (!pendingUpdate) {
        throw new ApiError(404, 'Verification request not found or expired.');
    }

    const secondsSinceLastResend = Math.floor((Date.now() - new Date(pendingUpdate.lastResendTime).getTime()) / 1000);
    if (secondsSinceLastResend < OTP_COOLDOWN_SECONDS) {
        throw new ApiError(429, `Please wait ${OTP_COOLDOWN_SECONDS - secondsSinceLastResend} seconds before requesting a new OTP.`);
    }

    if (pendingUpdate.resendCount >= MAX_RESENDS) {
        throw new ApiError(429, 'Maximum OTP resend limit exceeded. Please start over.');
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    pendingUpdate.otp = otp;
    pendingUpdate.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    pendingUpdate.resendCount += 1;
    pendingUpdate.lastResendTime = new Date();
    await pendingUpdate.save();

    try {
        await sendEmail({
            to: email,
            subject: 'Verify your profile update (Resend)',
            text: `Your new verification OTP for updating your profile is ${otp}. It expires in 5 minutes.`,
            html: `<p>Your new verification OTP for updating your profile is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
        });
    } catch (err) {
        console.warn(`[Profile OTP Resend] Email delivery failed for ${email}: ${err.message}`);
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`\n==========================================`);
        console.log(`[PROFILE_UPDATE OTP RESEND] for ${email}: ${otp}`);
        console.log(`==========================================\n`);
    }

    return true;
};

/**
 * Verifies the OTP and returns the pending data if successful.
 */
export const verifyProfileUpdateOTP = async (pendingUpdateId, otp) => {
    const pendingUpdate = await PendingProfileUpdate.findById(pendingUpdateId);
    if (!pendingUpdate) {
        throw new ApiError(404, 'Verification request not found or expired.');
    }

    if (new Date() > pendingUpdate.otpExpiry) {
        await PendingProfileUpdate.findByIdAndDelete(pendingUpdateId);
        throw new ApiError(400, 'OTP has expired. Please initiate update again.');
    }

    if (pendingUpdate.attempts >= MAX_ATTEMPTS) {
        await PendingProfileUpdate.findByIdAndDelete(pendingUpdateId);
        throw new ApiError(400, 'Maximum verification attempts exceeded. Please request a new OTP.');
    }

    if (pendingUpdate.otp !== String(otp).trim()) {
        pendingUpdate.attempts += 1;
        await pendingUpdate.save();
        throw new ApiError(400, `Invalid OTP. ${MAX_ATTEMPTS - pendingUpdate.attempts} attempts remaining.`);
    }

    const data = pendingUpdate.pendingData;
    await PendingProfileUpdate.findByIdAndDelete(pendingUpdateId);
    return data;
};
