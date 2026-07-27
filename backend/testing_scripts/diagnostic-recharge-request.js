import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.model.js';
import { signAccessToken } from '../src/config/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runDiagnostic = async () => {
    await connectDB();

    // Find any user
    const user = await User.findOne({ role: 'b2bAdmin' });
    if (!user) {
        console.error('❌ No B2B Admin user found to authenticate!');
        await mongoose.connection.close();
        return;
    }

    console.log(`Authenticating as: ${user.email} (${user.role})`);
    const token = signAccessToken({
        id: user._id.toString(),
        role: user.role,
        email: user.email
    });

    const requestData = JSON.stringify({ amount: 500 });

    const reqOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/wallet/recharge',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Length': Buffer.byteLength(requestData)
        }
    };

    console.log('Sending request to http://localhost:5000/api/wallet/recharge ...');

    const req = http.request(reqOptions, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log('Headers:', res.headers);
            console.log('Body:', body);
            mongoose.connection.close();
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Request failed: ${e.message}`);
        mongoose.connection.close();
    });

    req.write(requestData);
    req.end();
};

runDiagnostic().catch(err => {
    console.error(err);
    process.exit(1);
});
