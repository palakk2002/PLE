import './src/loadEnv.js';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import ManagedShop from './src/models/ManagedShop.model.js';
import ManagedVendorUser from './src/models/ManagedVendorUser.model.js';
import Admin from './src/models/Admin.model.js';
import { generateTokens } from './src/utils/generateToken.js';

async function testBackend() {
    try {
        console.log("Connecting to database...");
        await connectDB();

        console.log("Locating or creating an admin account...");
        let admin = await Admin.findOne({ isActive: true });
        if (!admin) {
            admin = await Admin.create({
                name: "Test Admin",
                email: "admin@test.com",
                password: "password123",
                role: "admin",
                isActive: true
            });
            console.log("Created test admin: admin@test.com");
        } else {
            console.log(`Found existing admin: ${admin.email}`);
        }

        // Clean up previous test shop/users to avoid duplicates
        console.log("Cleaning up previous test data...");
        await ManagedVendorUser.deleteMany({ username: "rahul" });
        await ManagedShop.deleteMany({ name: "Anita Mega Mart" });

        console.log("Creating test Managed Shop 'Anita Mega Mart'...");
        const shop = await ManagedShop.create({
            name: "Anita Mega Mart",
            logo: "https://via.placeholder.com/150",
            address: "123 Mart Street",
            phone: "9876543210",
            gst: "27AAAAA1111A1Z1",
            warehouse: "Mumbai Warehouse",
            status: "active",
            description: "Managed Superstore"
        });
        console.log(`Shop created: ${shop.name} (ID: ${shop._id})`);

        console.log("Creating test Managed Vendor User 'rahul'...");
        const vendorUser = await ManagedVendorUser.create({
            name: "Rahul Kumar",
            phone: "9999999999",
            username: "rahul",
            password: "password123",
            role: "managed_vendor",
            shopId: shop._id,
            createdBy: admin._id,
            status: "active"
        });
        console.log(`Vendor user created: ${vendorUser.username} (ID: ${vendorUser._id})`);

        console.log("Verifying password comparison...");
        const isMatch = await vendorUser.comparePassword("password123");
        console.log(`Password match verified: ${isMatch}`);

        console.log("Generating JWT tokens...");
        const tokens = generateTokens({
            id: vendorUser._id,
            role: 'managed_vendor',
            email: vendorUser.username,
            shopId: shop._id
        });
        console.log("Tokens generated successfully:", tokens);

        console.log("SUCCESS: All backend structures tested successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Test failed with error:", err);
        process.exit(1);
    }
}

testBackend();
