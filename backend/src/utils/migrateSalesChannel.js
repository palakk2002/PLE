import Product from '../models/Product.model.js';

export const migrateSalesChannel = async () => {
    try {
        console.log('[Migration] Checking for products needing salesChannel migration...');
        
        // Find products where salesChannel is not yet set
        const count = await Product.countDocuments({ salesChannel: { $exists: false } });
        if (count === 0) {
            console.log('[Migration] All products already have a salesChannel. Migration skipped.');
            return;
        }

        console.log(`[Migration] Found ${count} products to migrate.`);

        // Migrate B2B enabled products to 'BOTH'
        const b2bResult = await Product.updateMany(
            { salesChannel: { $exists: false }, b2bEnabled: true },
            { $set: { salesChannel: 'BOTH' } }
        );
        console.log(`[Migration] Migrated ${b2bResult.modifiedCount} B2B products to BOTH.`);

        // Migrate remaining products to 'B2C'
        const b2cResult = await Product.updateMany(
            { salesChannel: { $exists: false } },
            { $set: { salesChannel: 'B2C' } }
        );
        console.log(`[Migration] Migrated ${b2cResult.modifiedCount} B2C products to B2C.`);

        console.log('[Migration] Sales Channel migration completed successfully.');
    } catch (error) {
        console.error('[Migration] Error running Sales Channel migration:', error);
    }
};

export default migrateSalesChannel;
