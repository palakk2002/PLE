import mongoose from 'mongoose';

const managedShopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        logo: { type: String }, // Shop logo URL
        address: { type: String, trim: true },
        phone: { type: String, trim: true },
        gst: { type: String, trim: true },
        warehouse: { type: String, trim: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        description: { type: String, trim: true }
    },
    { timestamps: true }
);

const ManagedShop = mongoose.model('ManagedShop', managedShopSchema);
export { ManagedShop };
export default ManagedShop;
