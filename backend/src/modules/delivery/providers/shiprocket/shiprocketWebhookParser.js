import crypto from 'crypto';

export function verifyShiprocketWebhookSignature(rawBody, headers) {
    const expectedToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    if (!expectedToken) {
        // If token not configured in env, log warning and accept (or enforce header presence)
        return true;
    }

    const headerToken = headers['x-api-key'] || headers['x-shiprocket-token'] || headers['x-shiprocket-signature'] || headers['authorization'];
    if (!headerToken) return false;

    const incoming = String(headerToken).trim();
    const expected = String(expectedToken).trim();

    try {
        const bufA = Buffer.from(incoming);
        const bufB = Buffer.from(expected);
        if (bufA.length === bufB.length) {
            return crypto.timingSafeEqual(bufA, bufB);
        }
        return incoming === expected;
    } catch {
        return incoming === expected;
    }
}

export function parseShiprocketWebhookPayload(rawBody, headers) {
    let payload = rawBody;
    if (typeof rawBody === 'string' || Buffer.isBuffer(rawBody)) {
        try {
            payload = JSON.parse(rawBody.toString('utf-8'));
        } catch {
            payload = {};
        }
    }

    const orderId = payload.order_id || payload.channel_order_id || payload.custom_order_id;
    const externalShipmentId = payload.shipment_id ? String(payload.shipment_id) : null;
    const awbCode = payload.awb || payload.awb_code || payload.courier_awb;
    const currentStatus = payload.current_status || payload.status;
    const courierName = payload.courier_name;
    const etd = payload.etd;

    return {
        orderId: orderId ? String(orderId) : null,
        externalShipmentId,
        awbCode: awbCode ? String(awbCode) : null,
        providerStatus: currentStatus ? String(currentStatus) : null,
        courierName: courierName || null,
        etd: etd ? new Date(etd) : null,
        location: payload.current_timestamp_location || payload.location || '',
        activity: payload.scans || payload.activity || '',
        rawPayload: payload
    };
}
