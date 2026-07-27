import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
    await connectDB();
    const users = await User.find({}).limit(10).lean();
    console.log('--- Found Users ---');
    users.forEach(u => console.log(`ID: ${u._id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`));
    await mongoose.connection.close();
};

run().catch(console.error);
