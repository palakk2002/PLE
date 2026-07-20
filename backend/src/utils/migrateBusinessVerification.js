import Vendor from '../models/Vendor.model.js';

export const migrateBusinessVerification = async () => {
    try {
        console.log('[Migration] Checking for vendors needing business verification fields...');
        
        // Find vendors where businessType is not set
        const count = await Vendor.countDocuments({ businessType: { $exists: false } });
        if (count === 0) {
            console.log('[Migration] All vendors already have business fields. Migration skipped.');
            return;
        }

        console.log(`[Migration] Found ${count} vendors to migrate.`);

        const result = await Vendor.updateMany(
            { businessType: { $exists: false } },
            { 
                $set: { 
                    businessType: 'Other',
                    gstRegistered: false,
                    verificationStatus: 'Approved'
                } 
            }
        );
        console.log(`[Migration] Migrated ${result.modifiedCount} vendors to Business Type = Other, GST Registered = false, Verification Status = Approved.`);
    } catch (error) {
        console.error('[Migration] Error running business verification migration:', error);
    }
};

export default migrateBusinessVerification;
