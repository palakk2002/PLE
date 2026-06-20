import { verifyAccessToken } from '../config/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Verifies JWT and attaches req.user
 * Optionally pass allowedRoles to restrict access
 */
export const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        throw new ApiError(401, 'Authentication required. No token provided.');
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded; // { id, role, email }
        next();
    } catch (err) {
        throw new ApiError(401, 'Invalid or expired token.');
    }
});

/**
 * Optional auth — attaches req.user if token present, does not block if absent
 */
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            req.user = verifyAccessToken(token);
        } catch {
            // ignore invalid token for optional auth
        }
    }
    next();
};
