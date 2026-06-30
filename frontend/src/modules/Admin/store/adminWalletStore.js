import { create } from 'zustand';
import api from '../../../shared/utils/api';

export const useAdminWalletStore = create((set) => ({
  stats: {
    totalWalletBalance: 0,
    totalCredits: 0,
    totalDebits: 0,
    pendingRefunds: 0,
    completedRefunds: 0
  },
  users: [],
  selectedUserWallet: null,
  selectedUserTransactions: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  },
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/admin/wallet/dashboard');
      const data = response?.data?.data || response?.data || {};
      set({ stats: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch admin wallet statistics', 
        isLoading: false 
      });
      return { success: false, error };
    }
  },

  searchUsers: async (search = '', page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const query = `search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
      const response = await api.get(`/admin/wallet/users?${query}`);
      const data = response?.data?.data || response?.data || {};
      set({ 
        users: data.users || [], 
        pagination: data.pagination || { total: 0, page, limit, pages: 1 },
        isLoading: false 
      });
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to search users', 
        isLoading: false 
      });
      return { success: false, error };
    }
  },

  fetchUserWallet: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/admin/wallet/users/${userId}`);
      const data = response?.data?.data || response?.data || {};
      set({ selectedUserWallet: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch user wallet', 
        isLoading: false 
      });
      return { success: false, error };
    }
  },

  fetchUserTransactions: async (userId, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/admin/wallet/users/${userId}/transactions?page=${page}&limit=${limit}`);
      const data = response?.data?.data || response?.data || {};
      set({ 
        selectedUserTransactions: data.transactions || [], 
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

  creditUserWallet: async (userId, amount, reason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/admin/wallet/users/${userId}/credit`, { amount, reason });
      set({ isLoading: false });
      return { success: true, data: response?.data?.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to credit user wallet', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  debitUserWallet: async (userId, amount, reason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/admin/wallet/users/${userId}/debit`, { amount, reason });
      set({ isLoading: false });
      return { success: true, data: response?.data?.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to debit user wallet', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  toggleFreezeWallet: async (userId, shouldFreeze) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = shouldFreeze ? 'freeze' : 'unfreeze';
      const response = await api.post(`/admin/wallet/users/${userId}/${endpoint}`);
      set({ isLoading: false });
      return { success: true, data: response?.data?.data };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update freeze status', 
        isLoading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  }
}));
