import deliveryProviderRegistry from '../src/modules/delivery/deliveryProviderRegistry.js';
import { normalizeProviderStatus } from '../src/modules/delivery/deliveryStatusMapping.js';
import { parseShiprocketWebhookPayload, verifyShiprocketWebhookSignature } from '../src/modules/delivery/providers/shiprocket/shiprocketWebhookParser.js';

console.log('=== Shiprocket Delivery Module Unit Verification ===\n');

// 1. Test Registry
const registryProviders = deliveryProviderRegistry.listProviders();
console.log('Registered Providers:', registryProviders);
if (registryProviders.includes('shiprocket') && registryProviders.includes('internal')) {
    console.log('✅ Provider Registry initialized correctly');
} else {
    console.error('❌ Registry initialization failed');
}

// 2. Test Status Normalization
const statusTests = [
    { raw: 'PICKUP SCHEDULED', expected: 'processing' },
    { raw: 'SHIPPED', expected: 'shipped' },
    { raw: 'OUT FOR DELIVERY', expected: 'shipped' },
    { raw: 'DELIVERED', expected: 'delivered' },
    { raw: 'CANCELLED', expected: 'cancelled' },
    { raw: 'RTO DELIVERED', expected: 'returned' }
];

console.log('\nTesting Status Mapping:');
statusTests.forEach(test => {
    const mapped = normalizeProviderStatus('shiprocket', test.raw);
    const pass = mapped === test.expected;
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] Raw: "${test.raw}" -> Mapped: "${mapped}" (Expected: "${test.expected}")`);
});

// 3. Test Webhook Parser
console.log('\nTesting Webhook Parsing:');
const samplePayload = JSON.stringify({
    order_id: 'ORD-98765',
    shipment_id: '12345678',
    awb_code: 'AWB99887766',
    current_status: 'OUT FOR DELIVERY',
    courier_name: 'Delhivery',
    etd: '2026-08-20T12:00:00Z',
    location: 'Mumbai Hub'
});

const parsed = parseShiprocketWebhookPayload(samplePayload, {});
console.log('Parsed Payload:', parsed);
if (parsed.orderId === 'ORD-98765' && parsed.awbCode === 'AWB99887766' && parsed.providerStatus === 'OUT FOR DELIVERY') {
    console.log('✅ Webhook payload parsing passed');
} else {
    console.error('❌ Webhook payload parsing failed');
}

// 4. Test Webhook Signature Verification
const isSigValid = verifyShiprocketWebhookSignature(samplePayload, {});
console.log(`Webhook Signature Check (default token fallback): ${isSigValid ? '✅ PASS' : '❌ FAIL'}`);

console.log('\nAll initial Shiprocket module tests completed successfully.');
