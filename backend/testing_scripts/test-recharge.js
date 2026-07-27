import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const testRazorpay = async () => {
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Key Secret length:', process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0);

    try {
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        console.log('Creating test order...');
        const rzpOrder = await razorpayInstance.orders.create({
            amount: 500 * 100, // 500 INR in paise
            currency: 'INR',
            receipt: `recharge_test_${Date.now()}`
        });

        console.log('✅ Success! Razorpay order created:', rzpOrder);
    } catch (err) {
        console.error('❌ Razorpay order creation failed:', err);
    }
};

testRazorpay();
