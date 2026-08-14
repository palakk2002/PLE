/**
 * @interface IDeliveryProvider
 * Contract for delivery providers (Shiprocket, Internal, Porter, Noop, etc.)
 */
export const DELIVERY_PROVIDER_INTERFACE = {
    name: String,

    // Core shipment operations
    createShipment: async (context) => {},
    cancelShipment: async (context) => {},
    getTrackingInfo: async (context) => {},
    getETA: async (context) => {},
    getQuote: async (context) => {},

    // Status normalization
    mapStatus: (providerStatus) => {},

    // Webhook validation & parsing
    verifyWebhookSignature: (rawBody, headers) => {},
    parseWebhookPayload: (rawBody, headers) => {},
};

export class ProviderError extends Error {
    constructor(code, message, details = null) {
        super(message);
        this.name = 'ProviderError';
        this.code = code;
        this.details = details;
    }
}
