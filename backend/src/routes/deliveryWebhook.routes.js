import express from 'express';
import { handleDeliveryWebhook } from '../modules/delivery/webhooks/webhookController.js';

const router = express.Router();

// Capture raw body for signature validation
const captureRawBody = (req, res, next) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        req.rawBody = data;
        try {
            req.body = data ? JSON.parse(data) : {};
        } catch {
            req.body = {};
        }
        next();
    });
};

router.post('/webhook/:provider', captureRawBody, handleDeliveryWebhook);
router.post('/webhook', captureRawBody, handleDeliveryWebhook);

export default router;
