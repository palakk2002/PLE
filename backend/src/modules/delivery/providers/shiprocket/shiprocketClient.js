import axios from 'axios';
import { ProviderTokenStore } from '../../../../models/ProviderTokenStore.model.js';
import { ProviderError } from '../../IDeliveryProvider.js';

const SHIPROCKET_BASE_URL = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export class ShiprocketClient {
    constructor() {
        this.baseUrl = SHIPROCKET_BASE_URL;
    }

    async getToken() {
        const stored = await ProviderTokenStore.findOne({ providerName: 'shiprocket' });
        if (stored && stored.accessToken && stored.expiresAt > new Date(Date.now() + 5 * 60 * 1000)) {
            return stored.accessToken;
        }
        return await this.refreshToken();
    }

    async refreshToken() {
        const email = process.env.SHIPROCKET_EMAIL;
        const password = process.env.SHIPROCKET_PASSWORD;

        if (!email || !password) {
            throw new ProviderError(
                'MISSING_CREDENTIALS',
                'SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables are required'
            );
        }

        try {
            const response = await axios.post(`${this.baseUrl}/auth/login`, {
                email,
                password,
            });

            if (!response.data || !response.data.token) {
                throw new ProviderError('AUTH_FAILED', 'Failed to acquire authentication token from Shiprocket');
            }

            const token = response.data.token;
            // Shiprocket token valid for 10 days; refresh safe window 9 days
            const expiresAt = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);

            await ProviderTokenStore.findOneAndUpdate(
                { providerName: 'shiprocket' },
                { accessToken: token, expiresAt, updatedAt: new Date() },
                { upsert: true, new: true }
            );

            return token;
        } catch (err) {
            if (err instanceof ProviderError) throw err;
            throw new ProviderError('AUTH_ERROR', err.response?.data?.message || err.message, err.response?.data);
        }
    }

    async request(method, endpoint, data = null, params = null) {
        let token = await this.getToken();

        const makeCall = async (authToken) => {
            return await axios({
                method,
                url: `${this.baseUrl}${endpoint}`,
                data,
                params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });
        };

        try {
            const res = await makeCall(token);
            return res.data;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Force token refresh once
                token = await this.refreshToken();
                try {
                    const retryRes = await makeCall(token);
                    return retryRes.data;
                } catch (retryErr) {
                    throw new ProviderError(
                        'UNAUTHORIZED',
                        retryErr.response?.data?.message || retryErr.message,
                        retryErr.response?.data
                    );
                }
            }

            throw new ProviderError(
                'API_ERROR',
                err.response?.data?.message || err.message,
                err.response?.data
            );
        }
    }
}

export const shiprocketClient = new ShiprocketClient();
export default shiprocketClient;
