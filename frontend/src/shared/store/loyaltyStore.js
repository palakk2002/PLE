import { create } from "zustand";
import api from "../utils/api";

export const useLoyaltyStore = create((set, get) => ({
  availablePoints: 0,
  lifetimeEarned: 0,
  lifetimeRedeemed: 0,
  discountValue: 0,
  nextMilestone: 500,
  
  rules: {
    enabled: true,
    purchaseToPointsRatio: 5,
    purchaseAmountUnit: 100,
    redemptionRatio: 0.2,
    minRedeemPoints: 50,
    maxRedemptionPercent: 50
  },
  
  history: [],
  isLoading: false,

  fetchBalance: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/user/loyalty/balance");
      if (res && res.data) {
        set({
          availablePoints: res.data.availablePoints || 0,
          lifetimeEarned: res.data.lifetimeEarned || 0,
          lifetimeRedeemed: res.data.lifetimeRedeemed || 0,
          discountValue: res.data.discountValue || 0,
          nextMilestone: res.data.nextMilestone || 500,
        });
      }
    } catch (err) {
      console.error("Failed to fetch loyalty balance", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistory: async (page = 1, limit = 20) => {
    try {
      set({ isLoading: true });
      const res = await api.get(`/user/loyalty/history?page=${page}&limit=${limit}`);
      if (res && res.data) {
        set({ history: res.data.transactions || [] });
        return res.data;
      }
    } catch (err) {
      console.error("Failed to fetch loyalty history", err);
    } finally {
      set({ isLoading: false });
    }
    return null;
  },

  fetchConfig: async () => {
    try {
      const res = await api.get("/loyalty/config");
      if (res && res.data) {
        set({ rules: res.data });
      }
    } catch (err) {
      console.error("Failed to fetch loyalty config", err);
    }
  }
}));
