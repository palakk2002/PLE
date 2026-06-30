import { create } from 'zustand';
import api from '../utils/api';

export const useWalletStore = create((set) => ({
  balance: 0,
  totalCredit: 0,
  totalDebit: 0,
  isFrozen: false,
  currency: 'INR',
  transactions: [],
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
      const response = await api.get('/user/wallet');
      const data = response?.data?.data || response?.data || {};
      set({ 
        balance: data.balance || 0,
        totalCredit: data.totalCredit || 0,
        totalDebit: data.totalDebit || 0,
        isFrozen: !!data.isFrozen,
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

  fetchWalletSummary: async () => {
    try {
      const response = await api.get('/user/wallet/summary');
      const data = response?.data?.data || response?.data || {};
      set({
        balance: data.balance || 0,
        totalCredit: data.totalCredit || 0,
        totalDebit: data.totalDebit || 0,
        isFrozen: !!data.isFrozen,
        currency: data.currency || 'INR'
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  },

  fetchTransactions: async (page = 1, limit = 10, category = 'all') => {
    set({ isLoading: true, error: null });
    try {
      const categoryParam = category && category !== 'all' ? `&category=${category}` : '';
      const response = await api.get(`/user/wallet/transactions?page=${page}&limit=${limit}${categoryParam}`);
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

  addFunds: async (amount, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/user/wallet/add', { amount, paymentMethod });
      const data = response?.data?.data || response?.data;
      set((state) => ({
        balance: data.balance,
        totalCredit: parseFloat((state.totalCredit + amount).toFixed(2)),
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
        totalDebit: parseFloat((state.totalDebit + amount).toFixed(2)),
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
        totalDebit: parseFloat((state.totalDebit + amount).toFixed(2)),
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
