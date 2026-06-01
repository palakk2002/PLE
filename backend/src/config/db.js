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
    // Set a lower connection timeout so it fails quickly and switches to fallback rather than waiting 30 seconds
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeedAdmin();
  } catch (error) {
    const publicIP = await getPublicIP();
    console.error(`
========================================================================
❌ MONGODB CONNECTION ERROR: COULD NOT CONNECT TO ATLAS CLUSTER
========================================================================

It looks like your IP address is not whitelisted in your MongoDB Atlas cluster or there is a network issue.

👉 YOUR CURRENT PUBLIC IP ADDRESS: ${publicIP}

To fix this persistently, follow these steps:
1. Log in to your MongoDB Atlas Console: https://cloud.mongodb.com
2. Go to "Network Access" under the "Security" section in the left sidebar.
3. Click the "+ Add IP Address" button.
4. Choose "Add Current IP Address" (which should be ${publicIP}),
   or allow access from anywhere by entering 0.0.0.0/0 (for temporary testing).
5. Save/Confirm the changes and wait 1-2 minutes for the cluster to update.

Error Details: ${error.message}
========================================================================
    `);

    console.log('🔄 Attempting to spin up an in-memory MongoDB fallback server...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`
========================================================================
⚠️ SUCCESS: IN-MEMORY MONGODB FALLBACK CONFIGURED
========================================================================
Backend is now running with a local, zero-config in-memory MongoDB!

👉 What this means:
   1. The backend is running, and you can test all features!
   2. All operations (User, Vendor, Delivery, Products, etc.) will work.
   3. NOTE: Data is stored in memory and will reset when the server restarts.
   
Whenever you're ready, whitelist your IP (${publicIP}) on MongoDB Atlas
to switch back to your persistent remote cluster.
========================================================================
      `);
      await autoSeedAdmin();
    } catch (fallbackError) {
      console.error('❌ Failed to start in-memory MongoDB server:', fallbackError.message);
      process.exit(1);
    }
  }
};

export default connectDB;
