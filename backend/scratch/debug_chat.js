import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Import models
    const VendorChatThread = mongoose.model('VendorChatThread', new mongoose.Schema({}, { strict: false }));
    const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const users = await User.find({}).limit(5).lean();
    console.log('Users (first 5):', users.map(u => ({ id: u._id, email: u.email, role: u.role })));

    const vendors = await Vendor.find({}).limit(5).lean();
    console.log('Vendors (first 5):', vendors.map(v => ({ id: v._id, storeName: v.storeName, name: v.name })));

    const threads = await VendorChatThread.find({}).limit(10).lean();
    console.log('Chat threads (first 10):', threads);

    // Let's check indexes on VendorChatThread
    const indexes = await mongoose.connection.db.collection('vendorchatthreads').indexes();
    console.log('Indexes on VendorChatThread:', JSON.stringify(indexes, null, 2));

    await mongoose.disconnect();
}

run().catch(console.error);
