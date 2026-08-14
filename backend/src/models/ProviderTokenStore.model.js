import mongoose from 'mongoose';

const providerTokenStoreSchema = new mongoose.Schema({
    providerName: { type: String, required: true, unique: true, index: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ProviderTokenStore = mongoose.models.ProviderTokenStore || mongoose.model('ProviderTokenStore', providerTokenStoreSchema);
export { ProviderTokenStore };
export default ProviderTokenStore;
