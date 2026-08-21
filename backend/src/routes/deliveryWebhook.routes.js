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

router.get('/webhook/:provider', (req, res) => res.status(200).json({ success: true, message: 'Webhook endpoint is active' }));
router.get('/webhook', (req, res) => res.status(200).json({ success: true, message: 'Webhook endpoint is active' }));
router.head('/webhook/:provider', (req, res) => res.status(200).end());
router.head('/webhook', (req, res) => res.status(200).end());

router.post('/webhook/:provider', captureRawBody, handleDeliveryWebhook);
router.post('/webhook', captureRawBody, handleDeliveryWebhook);

export default router;
