import deliveryProviderRegistry from './deliveryProviderRegistry.js';
import { DeliveryShipment } from '../../models/DeliveryShipment.model.js';
import { Order } from '../../models/Order.model.js';

export async function createShipment(context) {
    const provider = deliveryProviderRegistry.getProvider(context.preferredProvider);
    const result = await provider.createShipment(context);

    // Save or update DeliveryShipment record
    const shipmentDoc = await DeliveryShipment.findOneAndUpdate(
        { orderId: String(context.orderId) },
        {
            orderId: String(context.orderId),
            orderMongoId: context.orderMongoId || null,
            providerName: provider.name,
            externalShipmentId: result.externalShipmentId,
            shiprocketOrderId: result.shiprocketOrderId,
            awbCode: result.awbCode,
            courierCompanyId: result.courierCompanyId,
            courierName: result.courierName,
            status: result.rawStatus === 'NEW' ? 'created' : 'pending',
            rawProviderStatus: result.rawStatus,
            trackingUrl: result.trackingUrl,
            pickupLocation: result.pickupLocation,
            timeline: [
                {
                    status: result.rawStatus || 'CREATED',
                    activity: 'Shipment created via deliveryManager',
                    timestamp: new Date(),
                    raw: result.rawResponse
                }
            ]
        },
        { upsert: true, new: true }
    );

    // Link tracking information back to Order document if order exists
    if (context.orderMongoId || context.orderId) {
        const orderQuery = context.orderMongoId
            ? { _id: context.orderMongoId }
            : { orderId: String(context.orderId) };

        await Order.updateOne(orderQuery, {
            $set: {
                trackingNumber: result.awbCode || result.externalShipmentId,
                shippedAt: new Date(),
                status: result.canonicalStatus || 'shipped'
            }
        });
    }

    return { shipment: shipmentDoc, result };
}

export async function cancelShipment(context) {
    const provider = deliveryProviderRegistry.getProvider(context.preferredProvider);
    const result = await provider.cancelShipment(context);

    if (context.orderId) {
        await DeliveryShipment.updateOne(
            { orderId: String(context.orderId) },
            {
                $set: { status: 'cancelled', rawProviderStatus: 'CANCELLED' },
                $push: {
                    timeline: {
                        status: 'CANCELLED',
                        activity: 'Shipment cancelled',
                        timestamp: new Date()
                    }
                }
            }
        );
    }

    return result;
}

export async function getTrackingInfo(context) {
    const provider = deliveryProviderRegistry.getProvider(context.preferredProvider);
    return await provider.getTrackingInfo(context);
}

export async function getETA(context) {
    const provider = deliveryProviderRegistry.getProvider(context.preferredProvider);
    return await provider.getETA(context);
}

export async function getQuote(context) {
    const provider = deliveryProviderRegistry.getProvider(context.preferredProvider);
    return await provider.getQuote(context);
}

export const deliveryManager = {
    createShipment,
    cancelShipment,
    getTrackingInfo,
    getETA,
    getQuote
};

export default deliveryManager;
