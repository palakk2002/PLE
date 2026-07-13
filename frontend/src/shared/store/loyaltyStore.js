import { create } from "zustand";
import api from "../utils/api";

export const useLoyaltyStore = create((set, get) => ({
  availablePoints: 0,
  lifetimeEarned: 0,
  lifetimeRedeemed: 0,
  b2cLifetimeEarned: 0,
  b2bLifetimeEarned: 0,
  conversionRatio: 5,
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
          b2cLifetimeEarned: res.data.b2cLifetimeEarned || 0,
          b2bLifetimeEarned: res.data.b2bLifetimeEarned || 0,
          conversionRatio: res.data.conversionRatio || 5,
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

  fetchConfig: async (userRole = 'customer') => {
    try {
      const res = await api.get("/loyalty/config");
      if (res && res.data) {
        const isB2B = userRole === 'b2bAdmin' || userRole === 'b2bEmployee';
        const rules = {
          enabled: isB2B ? (res.data.b2bEnabled ?? res.data.enabled) : res.data.enabled,
          purchaseToPointsRatio: isB2B ? (res.data.b2bPurchaseToPointsRatio ?? res.data.purchaseToPointsRatio) : res.data.purchaseToPointsRatio,
          purchaseAmountUnit: isB2B ? (res.data.b2bPurchaseAmountUnit ?? res.data.purchaseAmountUnit) : res.data.purchaseAmountUnit,
          redemptionRatio: isB2B ? (res.data.b2bRedemptionRatio ?? res.data.redemptionRatio) : res.data.redemptionRatio,
          minRedeemPoints: isB2B ? (res.data.b2bMinRedeemPoints ?? res.data.minRedeemPoints) : res.data.minRedeemPoints,
          maxRedemptionPercent: isB2B ? (res.data.b2bMaxRedemptionPercent ?? res.data.maxRedemptionPercent) : res.data.maxRedemptionPercent,
        };
        set({ rules });
      }
    } catch (err) {
      console.error("Failed to fetch loyalty config", err);
    }
  }
}));
