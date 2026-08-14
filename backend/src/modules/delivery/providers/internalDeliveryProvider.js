export class InternalDeliveryProvider {
    constructor() {
        this.name = 'internal';
    }

    async createShipment(context) {
        return {
            providerName: this.name,
            externalShipmentId: `INT-${context.orderId}`,
            awbCode: `INT-AWB-${context.orderId}`,
            trackingUrl: null,
            rawStatus: 'ASSIGNED',
            canonicalStatus: 'processing'
        };
    }

    async cancelShipment(context) {
        return { cancelled: true };
    }

    async getTrackingInfo(context) {
        return {
            providerStatus: 'IN_TRANSIT',
            canonicalStatus: 'shipped',
            events: []
        };
    }

    async getETA(context) {
        return { etd: null, canonicalStatus: 'shipped' };
    }

    async getQuote(context) {
        return { providerName: this.name, price: 0, currency: 'INR' };
    }

    mapStatus(providerStatus) {
        return providerStatus || 'processing';
    }

    verifyWebhookSignature() {
        return true;
    }

    parseWebhookPayload(rawBody) {
        return { orderId: null, rawPayload: rawBody };
    }
}

export const internalDeliveryProvider = new InternalDeliveryProvider();
export default internalDeliveryProvider;
