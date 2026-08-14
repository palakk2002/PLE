import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    location: { type: String },
    activity: { type: String },
    raw: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const webhookLogSchema = new mongoose.Schema({
    receivedAt: { type: Date, default: Date.now },
    eventId: { type: String },
    payload: { type: mongoose.Schema.Types.Mixed },
    processed: { type: Boolean, default: true }
}, { _id: false });

const deliveryShipmentSchema = new mongoose.Schema({
    orderId: { type: String, required: true, index: true },
    orderMongoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
    providerName: { type: String, required: true, default: 'shiprocket' },
    externalShipmentId: { type: String, index: true },
    shiprocketOrderId: { type: String },
    awbCode: { type: String, index: true },
    courierCompanyId: { type: Number },
    courierName: { type: String },
    status: {
        type: String,
        enum: ['pending', 'created', 'manifested', 'pickup_scheduled', 'pickup_queued', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'rto_initiated', 'rto_delivered', 'failed'],
        default: 'pending'
    },
    rawProviderStatus: { type: String },
    trackingUrl: { type: String },
    labelUrl: { type: String },
    manifestUrl: { type: String },
    pickupLocation: { type: String },
    quote: {
        price: Number,
        currency: { type: String, default: 'INR' },
        breakdown: mongoose.Schema.Types.Mixed,
        estimatedDays: Number
    },
    timeline: [timelineEventSchema],
    etaTimestamp: { type: Date },
    webhookLogs: [webhookLogSchema],
    idempotencyKey: { type: String, unique: true, sparse: true },
    failureReason: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const DeliveryShipment = mongoose.models.DeliveryShipment || mongoose.model('DeliveryShipment', deliveryShipmentSchema);
export { DeliveryShipment };
export default DeliveryShipment;
