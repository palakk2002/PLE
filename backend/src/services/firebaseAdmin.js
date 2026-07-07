import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let app;
try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
        console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT environment variable is not defined.');
    } else {
        const serviceAccount = JSON.parse(serviceAccountJson);
        const apps = getApps();
        if (apps.length === 0) {
            app = initializeApp({
                credential: cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized successfully.');
        } else {
            app = apps[0];
        }
    }
} catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
}

/**
 * Send push notification to multiple tokens
 * @param {Array<string>} tokens - Array of FCM registration tokens
 * @param {Object} payload - Notification payload { title, body, data }
 */
export async function sendPushNotification(tokens, payload) {
    if (!tokens || tokens.length === 0) {
        return { successCount: 0, failureCount: 0 };
    }
    try {
        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            tokens: tokens,
        };

        const messaging = getMessaging(app);
        const response = await messaging.sendEachForMulticast(message);
        console.log(`[FCM] Successfully sent: ${response.successCount} messages. Failed: ${response.failureCount} messages.`);
        return response;
    } catch (error) {
        console.error('[FCM] Error sending push notification:', error);
        throw error;
    }
}

