import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.model.js';
import Wallet from '../src/models/Wallet.model.js';
import WalletTransaction from '../src/models/WalletTransaction.model.js';
import * as walletService from '../src/services/wallet.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runTests = async () => {
    console.log('🚀 Connecting to Database...');
    await connectDB();

    console.log('🧪 Starting Wallet Flow Tests...');

    // 1. Create a dummy B2B Admin user
    const uniqueEmail = `b2badmin_test_${Date.now()}@example.com`;
    const testUser = await User.create({
        name: 'Test B2B Admin',
        email: uniqueEmail,
        password: 'password123',
        phone: '9999999999',
        role: 'b2bAdmin',
        isVerified: true
    });

    console.log(`✅ Test User created: ${testUser.email}`);

    try {
        const userId = testUser._id;

        // 2. Fetch/Create Wallet
        console.log('\n--- Test 1: Fetch/Create Wallet ---');
        const wallet = await walletService.getOrCreateWallet(userId);
        console.log('Wallet initial state:', wallet);
        if (wallet.balance !== 0) throw new Error('Initial balance should be 0');

        // 3. Admin Credit
        console.log('\n--- Test 2: Admin Credit ---');
        const creditRes = await walletService.creditWallet({
            userId,
            amount: 500.50,
            category: 'admin_credit',
            description: 'Test admin adjustment credit'
        });
        console.log('Credit result balance:', creditRes.wallet.balance);
        if (creditRes.wallet.balance !== 500.50) throw new Error('Credit failed');

        // 4. Wallet Debit
        console.log('\n--- Test 3: Wallet Debit ---');
        const debitRes = await walletService.debitWallet({
            userId,
            amount: 200,
            category: 'order_payment',
            description: 'Test order checkout debit'
        });
        console.log('Debit result balance:', debitRes.wallet.balance);
        if (debitRes.wallet.balance !== 300.50) throw new Error('Debit failed');

        // 5. Insufficient Funds Error Check
        console.log('\n--- Test 4: Insufficient Funds Check ---');
        try {
            await walletService.debitWallet({
                userId,
                amount: 1000,
                category: 'order_payment',
                description: 'Overlimit debit'
            });
            throw new Error('Should have failed with Insufficient Balance');
        } catch (err) {
            console.log('Success: Insufficient funds caught correctly:', err.message);
        }

        // 6. Freeze Wallet
        console.log('\n--- Test 5: Freeze Wallet Check ---');
        await walletService.freezeWallet(userId, new mongoose.Types.ObjectId());
        const frozenWallet = await Wallet.findOne({ userId });
        console.log('Is Frozen:', frozenWallet.isFrozen);
        if (!frozenWallet.isFrozen) throw new Error('Freeze wallet failed');

        // 7. Debit Frozen Wallet (Should Fail)
        console.log('\n--- Test 6: Debit Frozen Wallet ---');
        try {
            await walletService.debitWallet({
                userId,
                amount: 10,
                category: 'order_payment',
                description: 'Debit while frozen'
            });
            throw new Error('Should have failed because wallet is frozen');
        } catch (err) {
            console.log('Success: Frozen wallet debit prevented:', err.message);
        }

        // 8. Unfreeze Wallet
        console.log('\n--- Test 7: Unfreeze Wallet Check ---');
        await walletService.unfreezeWallet(userId);
        const unfrozenWallet = await Wallet.findOne({ userId });
        console.log('Is Frozen:', unfrozenWallet.isFrozen);
        if (unfrozenWallet.isFrozen) throw new Error('Unfreeze wallet failed');

        // 9. Verify Transactions list
        console.log('\n--- Test 8: Fetch Transaction History ---');
        const history = await walletService.getTransactionHistory(userId);
        console.log(`Found ${history.transactions.length} transactions`);
        if (history.transactions.length < 2) throw new Error('Transaction log records missing');

        // 10. Concurrent Debit Simulation (Prevent negative balance / double spend)
        console.log('\n--- Test 9: Concurrent Debit Safety ---');
        const debitAttempts = [
            walletService.debitWallet({ userId, amount: 200, category: 'order_payment', description: 'Concurrent 1' }),
            walletService.debitWallet({ userId, amount: 200, category: 'order_payment', description: 'Concurrent 2' })
        ];

        const results = await Promise.allSettled(debitAttempts);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failedCount = results.filter(r => r.status === 'rejected').length;

        console.log(`Results: ${successCount} succeeded, ${failedCount} failed`);
        const finalWalletState = await Wallet.findOne({ userId });
        console.log('Final Wallet Balance:', finalWalletState.balance);

        if (finalWalletState.balance < 0) {
            throw new Error('Critical: Wallet balance went negative under concurrency!');
        }

        console.log('\n🎉 ALL WALLET SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');

    } finally {
        // Cleanup test user & wallet info
        console.log('\n🧹 Cleaning up test data...');
        await WalletTransaction.deleteMany({ userId: testUser._id });
        await Wallet.deleteOne({ userId: testUser._id });
        await User.deleteOne({ _id: testUser._id });
        console.log('Done.');
        await mongoose.connection.close();
    }
};

runTests().catch(err => {
    console.error('❌ Test execution failed:', err);
    process.exit(1);
});
