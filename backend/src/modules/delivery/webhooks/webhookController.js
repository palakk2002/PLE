import { processDeliveryWebhook } from './webhookProcessor.js';

export async function handleDeliveryWebhook(req, res) {
    const providerName = req.params.provider || 'shiprocket';
    try {
        const rawBody = req.rawBody || req.body;
        const result = await processDeliveryWebhook(providerName, rawBody, req.headers);
        // Fast 200 response to delivery provider
        return res.status(200).json({
            success: true,
            message: 'Webhook received and processed',
            data: result
        });
    } catch (err) {
        console.error(`[WebhookController] Error processing ${providerName} webhook:`, err.message);
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: err.message || 'Webhook processing failed'
        });
    }
}

export default { handleDeliveryWebhook };
