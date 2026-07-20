import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().trim().required(),
    storeName: Joi.string().trim().min(2).max(100).required(),
    storeDescription: Joi.string().trim().max(500).allow('').optional(),
    businessType: Joi.string().valid('Home Business', 'Small Business', 'MSME', 'Startup', 'Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Other').optional(),
    gstRegistered: Joi.any().optional(),
    businessName: Joi.string().trim().allow('').optional(),
    tradeName: Joi.string().trim().allow('').optional(),
    gstNumber: Joi.string().trim().allow('').optional(),
    panNumber: Joi.string().trim().allow('').optional(),
    ownerName: Joi.string().trim().allow('').optional(),
    businessAddress: Joi.string().trim().allow('').optional(),
    city: Joi.string().trim().allow('').optional(),
    state: Joi.string().trim().allow('').optional(),
    pincode: Joi.string().trim().allow('').optional(),
    address: Joi.any().optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().pattern(/^\d{6}$/).required(),
});

export const resendOtpSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

export const logoutSchema = Joi.object({
    refreshToken: Joi.string().allow('').optional(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
});

export const verifyResetOtpSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().pattern(/^\d{6}$/).required(),
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match password.',
    }),
});
