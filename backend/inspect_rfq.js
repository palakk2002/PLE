import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import RFQ from './src/models/RFQ.model.js';

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const rfq = await RFQ.findOne({ rfqId: 'RFQ-20260808-5403' });
        console.log('RFQ Data:', JSON.stringify(rfq, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
