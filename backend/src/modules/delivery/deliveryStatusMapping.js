import { mapShiprocketStatusToCanonical } from './providers/shiprocket/shiprocketStatusMap.js';

export function normalizeProviderStatus(providerName, rawStatus) {
    const provider = String(providerName || '').toLowerCase();
    if (provider === 'shiprocket') {
        return mapShiprocketStatusToCanonical(rawStatus);
    }
    return rawStatus || null;
}
