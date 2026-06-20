import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 100000, // Very high limit for testing
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

// Strict limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 5 : 10000, // Very high limit for testing
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
});

// OTP resend limiter
export const otpLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: process.env.NODE_ENV === 'production' ? 3 : 1000, // High limit for testing
    message: { success: false, message: 'Too many OTP requests, please wait a minute.' },
});
