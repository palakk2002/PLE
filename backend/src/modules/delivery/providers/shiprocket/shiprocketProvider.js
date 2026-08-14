import shiprocketClient from './shiprocketClient.js';
import { mapShiprocketStatusToCanonical } from './shiprocketStatusMap.js';
import { verifyShiprocketWebhookSignature, parseShiprocketWebhookPayload } from './shiprocketWebhookParser.js';
import { ProviderError } from '../../IDeliveryProvider.js';

export class ShiprocketDeliveryProvider {
    constructor() {
        this.name = 'shiprocket';
    }

    /**
     * Create an order + shipment in Shiprocket
     * @param {Object} context Order & item payload context
     */
    async createShipment(context) {
        const {
            orderId,
            orderDate = new Date(),
            pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
            billingAddress,
            shippingAddress,
            orderItems = [],
            paymentMethod = 'Prepaid',
            subtotal = 0,
            weight = 0.5,
            length = 10,
            breadth = 10,
            height = 10
        } = context;

        const dateStr = new Date(orderDate).toISOString().slice(0, 19).replace('T', ' ');

        const formattedItems = orderItems.map((item, idx) => ({
            name: item.name || `Item ${idx + 1}`,
            sku: item.sku || item.productId || `SKU-${idx + 1}`,
            units: item.quantity || 1,
            selling_price: item.price || 0,
            discount: item.discount || 0,
            tax: item.tax || 0,
            hsn: item.hsn || ''
        }));

        const isCod = String(paymentMethod).toLowerCase() === 'cod';

        const payload = {
            order_id: String(orderId),
            order_date: dateStr,
            pickup_location: pickupLocation,
            billing_customer_name: billingAddress?.name || 'Customer',
            billing_last_name: '',
            billing_address: billingAddress?.address || 'Street address',
            billing_city: billingAddress?.city || 'City',
            billing_pincode: billingAddress?.zipCode || billingAddress?.pincode || '110001',
            billing_state: billingAddress?.state || 'State',
            billing_country: billingAddress?.country || 'India',
            billing_email: billingAddress?.email || 'customer@example.com',
            billing_phone: billingAddress?.phone || '9999999999',
            shipping_is_billing: true,
            order_items: formattedItems,
            payment_method: isCod ? 'COD' : 'Prepaid',
            sub_total: subtotal,
            length,
            breadth,
            height,
            weight
        };

        try {
            // Step 1: Create Custom Order in Shiprocket
            const createRes = await shiprocketClient.request('POST', '/orders/create/adhoc', payload);

            if (!createRes || !createRes.order_id) {
                throw new ProviderError('CREATE_FAILED', 'Shiprocket order creation returned invalid response', createRes);
            }

            const shiprocketOrderId = createRes.order_id;
            const shipmentId = createRes.shipment_id;

            // Step 2: Generate AWB for the shipment if courier auto-assign is requested or default
            let awbCode = null;
            let courierName = null;
            let courierCompanyId = null;

            if (shipmentId) {
                try {
                    const awbRes = await shiprocketClient.request('POST', '/courier/assign/awb', {
                        shipment_id: shipmentId
                    });
                    if (awbRes && awbRes.response && awbRes.response.data) {
                        awbCode = awbRes.response.data.awb_code;
                        courierName = awbRes.response.data.courier_name;
                        courierCompanyId = awbRes.response.data.courier_company_id;
                    }
                } catch (awbErr) {
                    // AWB generation can be deferred to pickup scheduling step if needed
                    console.warn(`[ShiprocketProvider] AWB assignment warning for order ${orderId}: ${awbErr.message}`);
                }
            }

            return {
                providerName: this.name,
                externalShipmentId: shipmentId ? String(shipmentId) : null,
                shiprocketOrderId: String(shiprocketOrderId),
                awbCode: awbCode ? String(awbCode) : null,
                courierCompanyId,
                courierName,
                pickupLocation,
                trackingUrl: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null,
                rawStatus: 'NEW',
                canonicalStatus: 'processing',
                rawResponse: createRes
            };
        } catch (err) {
            if (err instanceof ProviderError) throw err;
            throw new ProviderError('SHIPMENT_CREATION_FAILED', err.message, err);
        }
    }

    /**
     * Cancel an existing shipment
     */
    async cancelShipment(context) {
        const { orderIds = [], shiprocketOrderId } = context;
        const idsToCancel = shiprocketOrderId ? [shiprocketOrderId] : orderIds;

        if (!idsToCancel.length) {
            return { cancelled: false, reason: 'No order IDs supplied' };
        }

        try {
            const res = await shiprocketClient.request('POST', '/orders/cancel', {
                ids: idsToCancel
            });
            return {
                cancelled: true,
                rawResponse: res
            };
        } catch (err) {
            throw new ProviderError('CANCEL_FAILED', err.message, err);
        }
    }

    /**
     * Fetch real-time tracking details by AWB Code
     */
    async getTrackingInfo(context) {
        const { awbCode, shipmentId } = context;

        if (!awbCode && !shipmentId) {
            throw new ProviderError('INVALID_ARGUMENTS', 'awbCode or shipmentId required for tracking');
        }

        try {
            const endpoint = awbCode
                ? `/courier/track/awb/${awbCode}`
                : `/courier/track/shipment/${shipmentId}`;

            const trackingRes = await shiprocketClient.request('GET', endpoint);

            const trackingData = trackingRes?.tracking_data || {};
            const currentStatus = trackingData.current_status || 'NEW';
            const scans = trackingData.shipment_track_activities || [];

            return {
                providerStatus: currentStatus,
                canonicalStatus: this.mapStatus(currentStatus),
                location: trackingData.current_timestamp_location || '',
                etd: trackingData.etd ? new Date(trackingData.etd) : null,
                events: scans.map(s => ({
                    status: s.activity,
                    location: s.location,
                    timestamp: new Date(s.date),
                    raw: s
                })),
                rawResponse: trackingRes
            };
        } catch (err) {
            throw new ProviderError('TRACKING_FAILED', err.message, err);
        }
    }

    async getETA(context) {
        const info = await this.getTrackingInfo(context);
        return {
            etd: info.etd,
            canonicalStatus: info.canonicalStatus
        };
    }

    async getQuote(context) {
        const { pickupPincode, deliveryPincode, weight = 0.5, cod = 0 } = context;
        try {
            const res = await shiprocketClient.request('GET', '/courier/serviceability/', null, {
                pickup_postcode: pickupPincode,
                delivery_postcode: deliveryPincode,
                weight,
                cod
            });
            return {
                providerName: this.name,
                recommendedCourier: res.data?.recommended_courier_company_id,
                availableCouriers: res.data?.available_courier_companies || [],
                rawResponse: res
            };
        } catch (err) {
            throw new ProviderError('QUOTE_FAILED', err.message, err);
        }
    }

    mapStatus(providerStatus) {
        return mapShiprocketStatusToCanonical(providerStatus);
    }

    verifyWebhookSignature(rawBody, headers) {
        return verifyShiprocketWebhookSignature(rawBody, headers);
    }

    parseWebhookPayload(rawBody, headers) {
        return parseShiprocketWebhookPayload(rawBody, headers);
    }
}

export const shiprocketProvider = new ShiprocketDeliveryProvider();
export default shiprocketProvider;
