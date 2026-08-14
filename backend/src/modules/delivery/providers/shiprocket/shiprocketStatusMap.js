export const SHIPROCKET_STATUS_MAP = {
    // Booking / Pickup stage
    'NEW': 'pending',
    'ORDER DELAYED': 'processing',
    'AWB ASSIGNED': 'processing',
    'LABEL GENERATED': 'processing',
    'PICKUP SCHEDULED': 'processing',
    'PICKUP QUEUED': 'processing',
    'PICKUP GENERATED': 'processing',
    'OUT FOR PICKUP': 'processing',
    'PICKUP RESCHEDULED': 'processing',
    'PICKED UP': 'shipped',

    // In-transit / Shipping stage
    'SHIPPED': 'shipped',
    'IN TRANSIT': 'shipped',
    'OUT FOR DELIVERY': 'shipped',

    // Delivered
    'DELIVERED': 'delivered',

    // Exceptions / RTO / Cancelled
    'CANCELLED': 'cancelled',
    'CANCELLATION REQUESTED': 'processing',
    'UNDELIVERED': 'shipped', // Remains shipped, issue logged in timeline
    'RTO INITIATED': 'shipped',
    'RTO DELIVERED': 'returned',
    'LOST': 'cancelled',
    'DAMAGED': 'cancelled',
};

export function mapShiprocketStatusToCanonical(providerStatus) {
    if (!providerStatus) return null;
    const normalized = String(providerStatus).toUpperCase().trim();
    return SHIPROCKET_STATUS_MAP[normalized] || null;
}
