import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const DEFAULT_RULES = {
  pointsPerOrder: 50,
  pointsPerAmountSpent: 0.05, // 5% of order amount earned in points
  redemptionRatio: 0.1, // 1 point = ₹0.10
};

const DEFAULT_HISTORY = [];

const DEFAULT_USERS = [];

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      availablePoints: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      pendingPoints: 0,
      rules: DEFAULT_RULES,
      history: DEFAULT_HISTORY,
      users: DEFAULT_USERS,

      earnPoints: (amount, orderId) => {
        const rules = get().rules;
        const pointsToEarn = Math.round(amount * rules.pointsPerAmountSpent) + rules.pointsPerOrder;
        
        const newHistoryItem = {
          date: new Date().toISOString(),
          orderRef: orderId,
          earnedPoints: pointsToEarn,
          redeemedPoints: 0,
          balance: get().availablePoints + pointsToEarn,
        };

        set((state) => ({
          availablePoints: state.availablePoints + pointsToEarn,
          totalEarned: state.totalEarned + pointsToEarn,
          history: [newHistoryItem, ...state.history],
          users: state.users.map((u) =>
            u.id === "buyer_mock_12345"
              ? {
                  ...u,
                  currentPoints: u.currentPoints + pointsToEarn,
                  earnedPoints: u.earnedPoints + pointsToEarn,
                }
              : u
          ),
        }));

        return pointsToEarn;
      },

      redeemPoints: (points, orderId) => {
        if (points <= 0) return;
        
        const newHistoryItem = {
          date: new Date().toISOString(),
          orderRef: orderId,
          earnedPoints: 0,
          redeemedPoints: points,
          balance: Math.max(0, get().availablePoints - points),
        };

        set((state) => ({
          availablePoints: Math.max(0, state.availablePoints - points),
          totalRedeemed: state.totalRedeemed + points,
          history: [newHistoryItem, ...state.history],
          users: state.users.map((u) =>
            u.id === "buyer_mock_12345"
              ? {
                  ...u,
                  currentPoints: Math.max(0, u.currentPoints - points),
                  redeemedPoints: u.redeemedPoints + points,
                }
              : u
          ),
        }));
      },

      updateRules: (newRules) => {
        set((state) => ({
          rules: {
            ...state.rules,
            ...newRules,
          },
        }));
      },

      updateUserPoints: (userId, pointsDiff, type = "adjust") => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id === userId) {
              const currentPoints = Math.max(0, type === "set" ? pointsDiff : u.currentPoints + pointsDiff);
              const earnedPoints = type === "set" ? Math.max(currentPoints, u.earnedPoints) : (pointsDiff > 0 ? u.earnedPoints + pointsDiff : u.earnedPoints);
              const redeemedPoints = type === "set" ? u.redeemedPoints : (pointsDiff < 0 ? u.redeemedPoints + Math.abs(pointsDiff) : u.redeemedPoints);
              return {
                ...u,
                currentPoints,
                earnedPoints,
                redeemedPoints,
              };
            }
            return u;
          });

          // Sync Sarkar Raj with active availablePoints
          const sarkarRaj = updatedUsers.find((u) => u.id === "buyer_mock_12345");
          
          return {
            users: updatedUsers,
            availablePoints: sarkarRaj ? sarkarRaj.currentPoints : state.availablePoints,
            totalEarned: sarkarRaj ? sarkarRaj.earnedPoints : state.totalEarned,
            totalRedeemed: sarkarRaj ? sarkarRaj.redeemedPoints : state.totalRedeemed,
          };
        });
      },

      resetLoyalty: () => {
        set({
          availablePoints: 0,
          totalEarned: 0,
          totalRedeemed: 0,
          pendingPoints: 0,
          rules: DEFAULT_RULES,
          history: DEFAULT_HISTORY,
          users: DEFAULT_USERS,
        });
      },
    }),
    {
      name: "loyalty-storage-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
