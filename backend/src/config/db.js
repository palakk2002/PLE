import mongoose from 'mongoose';
import https from 'https';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Admin from '../models/Admin.model.js';

let mongoServer;

const getPublicIP = () => {
  return new Promise((resolve) => {
    https.get('https://api.ipify.org?format=json', { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.ip);
        } catch {
          resolve('122.179.90.35'); // fallback
        }
      });
    }).on('error', () => {
      resolve('122.179.90.35'); // fallback
    });
  });
};

const autoSeedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: 'admin@admin.com' });
    if (!existing) {
      await Admin.create({
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: 'admin123',
        role: 'superadmin',
        isActive: true,
      });
      console.log('✅ DATABASE AUTO-SEED SUCCESS: Admin account created (admin@admin.com / admin123)');
    } else {
      console.log('ℹ️ DATABASE AUTO-SEED: Admin account already exists.');
    }
  } catch (err) {
    console.error('⚠️ DATABASE AUTO-SEED FAILED:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeedAdmin();
  } catch (error) {
    const publicIP = await getPublicIP();
    console.error(`
  }
};

export default connectDB;
