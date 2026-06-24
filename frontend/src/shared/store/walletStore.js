import { create } from 'zustand';
import api from '../utils/api';

export const useWalletStore = create((set) => ({
  balance: 0,
  currency: 'INR',
  transactions: [],
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/user/wallet');
      const data = response?.data?.data || response?.data || {};
      set({ 
        balance: data.balance || 0,
        currency: data.currency || 'INR',
        transactions: data.transactions || [],
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

  addFunds: async (amount, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/user/wallet/add', { amount, paymentMethod });
      const data = response?.data?.data || response?.data;
      set((state) => ({
        balance: data.balance,
        transactions: [data.transaction, ...state.transactions],
        isLoading: false
      }));
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add funds', 
        isLoading: false 
      });
      return { success: false, error };
    }
  },

  transferFunds: async (recipientEmailOrPhone, amount) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/user/wallet/transfer', { recipientEmailOrPhone, amount });
      const data = response?.data?.data || response?.data;
      set((state) => ({
        balance: data.balance,
        transactions: [data.transaction, ...state.transactions],
        isLoading: false
      }));
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to transfer funds', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  withdrawFunds: async (amount, bankDetails) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/user/wallet/withdraw', { amount, bankDetails });
      const data = response?.data?.data || response?.data;
      set((state) => ({
        balance: data.balance,
        transactions: [data.transaction, ...state.transactions],
        isLoading: false
      }));
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to withdraw funds', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  }
}));
