import User from '../models/User.model.js';
import { sendPushNotification } from '../services/firebaseAdmin.js';

/**
 * Send push notification to a specific user
 * @param {string} userId - User model ID
 * @param {Object} payload - Notification payload { title, body, data }
 * @param {boolean} includeMobile - Whether to send to mobile devices too
 */
export async function sendNotificationToUser(userId, payload, includeMobile = true) {
    try {
        if (!userId) return;
        const user = await User.findById(userId);
        if (!user) {
            console.warn(`[FCM Helper] User not found for ID: ${userId}`);
            return;
        }

        let tokens = [];
        if (user.fcmTokens && user.fcmTokens.length > 0) {
            tokens = [...tokens, ...user.fcmTokens];
        }
        if (includeMobile && user.fcmTokenMobile && user.fcmTokenMobile.length > 0) {
            tokens = [...tokens, ...user.fcmTokenMobile];
        }

        const uniqueTokens = [...new Set(tokens)];
        if (uniqueTokens.length === 0) {
            console.log(`[FCM Helper] No FCM tokens found for user: ${userId}`);
            return;
        }

        await sendPushNotification(uniqueTokens, payload);
    } catch (error) {
        console.error(`[FCM Helper] Failed to send notification to user ${userId}:`, error);
        // Swallowed to prevent critical path failure
    }
}
