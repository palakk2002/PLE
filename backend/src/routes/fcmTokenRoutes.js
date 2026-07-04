import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import User from '../models/User.model.js';
import { sendPushNotification } from '../services/firebaseAdmin.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// Save FCM Token
router.post('/save', authenticate, asyncHandler(async (req, res) => {
    const { token, platform = 'web' } = req.body;
    const userId = req.user?.id;
    if (!token) {
        throw new ApiError(400, 'FCM Token is required');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (platform === 'web') {
        if (!user.fcmTokens) user.fcmTokens = [];
        if (!user.fcmTokens.includes(token)) {
            user.fcmTokens.push(token);
            if (user.fcmTokens.length > 10) {
                user.fcmTokens = user.fcmTokens.slice(-10);
            }
        }
    } else if (platform === 'app') {
        if (!user.fcmTokenMobile) user.fcmTokenMobile = [];
        if (!user.fcmTokenMobile.includes(token)) {
            user.fcmTokenMobile.push(token);
            if (user.fcmTokenMobile.length > 10) {
                user.fcmTokenMobile = user.fcmTokenMobile.slice(-10);
            }
        }
    }

    await user.save();
    return res.status(200).json(new ApiResponse(200, null, 'FCM token saved successfully'));
}));

// Remove FCM Token
router.delete('/remove', authenticate, asyncHandler(async (req, res) => {
    const { token, platform = 'web' } = req.body;
    const userId = req.user?.id;
    if (!token) {
        throw new ApiError(400, 'FCM Token is required');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (platform === 'web' && user.fcmTokens) {
        user.fcmTokens = user.fcmTokens.filter(t => t !== token);
    } else if (platform === 'app' && user.fcmTokenMobile) {
        user.fcmTokenMobile = user.fcmTokenMobile.filter(t => t !== token);
    }

    await user.save();
    return res.status(200).json(new ApiResponse(200, null, 'FCM token removed successfully'));
}));

// Test FCM push notification
router.post('/test', authenticate, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const tokens = [...(user.fcmTokens || []), ...(user.fcmTokenMobile || [])];
    const uniqueTokens = [...new Set(tokens)];

    if (uniqueTokens.length === 0) {
        throw new ApiError(400, 'No FCM tokens registered for this user');
    }

    const payload = {
        title: 'Test Push Notification',
        body: 'If you see this, Firebase Push Notifications are working! 🎉',
        data: {
            type: 'test',
            link: '/'
        }
    };

    const response = await sendPushNotification(uniqueTokens, payload);
    return res.status(200).json(new ApiResponse(200, response, 'Test push notification triggered'));
}));

export default router;
