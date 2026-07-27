import { create } from 'zustand';
import api from '../utils/api';

export const useWalletStore = create((set, get) => ({
  balance: 0,
  totalCredit: 0,
  totalDebit: 0,
  isFrozen: false,
  currency: 'INR',
  transactions: [],
  settings: {
    minRecharge: 100,
    maxRecharge: 50000,
    maxBalance: 100000,
    cashbackPercent: 0,
    refundPolicy: ''
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  },
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/wallet');
      const data = response?.data?.data || response?.data || {};
      set({ 
        balance: data.balance || 0,
        totalCredit: data.totalCredit || 0,
        totalDebit: data.totalDebit || 0,
        isFrozen: !!data.isFrozen,
        currency: data.currency || 'INR',
        isLoading: false 
      });
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch wallet', 
        isLoading: false 
      });
      return { success: false, error };
    }
  },

  fetchTransactions: async (page = 1, limit = 10, category = 'all') => {
    set({ isLoading: true, error: null });
    try {
      const categoryParam = category && category !== 'all' ? `&category=${category}` : '';
      const response = await api.get(`/wallet/history?page=${page}&limit=${limit}${categoryParam}`);
      const data = response?.data?.data || response?.data || {};
      set({
        transactions: data.transactions || [],
        pagination: data.pagination || { total: 0, page, limit, pages: 1 },
        isLoading: false
      });
      return { success: true, data };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch transactions',
        isLoading: false
      });
      return { success: false, error };
    }
  },

  fetchWalletSettings: async () => {
    try {
      const response = await api.get('/wallet/settings');
      const data = response?.data?.data || response?.data;
      set({ settings: data });
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  updateWalletSettings: async (settingsData) => {
    set({ isLoading: true });
    try {
      const response = await api.put('/wallet/settings', settingsData);
      const data = response?.data?.data || response?.data;
      set({ settings: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || 'Failed to update settings' });
      return { success: false, error };
    }
  },

  rechargeWallet: async (amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/wallet/recharge', { amount });
      const data = response?.data?.data || response?.data;
      set({ isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to initiate recharge', 
        isLoading: false 
      });
      return { success: false, error };
    }
  },

  verifyRechargePayment: async (paymentDetails) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/wallet/verify-payment', paymentDetails);
      const data = response?.data?.data || response?.data;
      set({ isLoading: false });
      await get().fetchWallet();
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to verify payment', 
        isLoading: false 
      });
      return { success: false, error };
    }
  }
}));
