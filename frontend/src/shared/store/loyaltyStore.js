import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const DEFAULT_RULES = {
  pointsPerOrder: 50,
  pointsPerAmountSpent: 0.05, // 5% of order amount earned in points
  redemptionRatio: 0.1, // 1 point = ₹0.10
};

const DEFAULT_HISTORY = [
  {
    date: "2026-05-15T10:30:00.000Z",
    orderRef: "ORD-893274",
    earnedPoints: 150,
    redeemedPoints: 0,
    balance: 150,
  },
  {
    date: "2026-05-20T14:45:00.000Z",
    orderRef: "ORD-894101",
    earnedPoints: 300,
    redeemedPoints: 100,
    balance: 350,
  },
  {
    date: "2026-06-01T09:15:00.000Z",
    orderRef: "ORD-895629",
    earnedPoints: 500,
    redeemedPoints: 400,
    balance: 450,
  },
];

const DEFAULT_USERS = [
  {
    id: "buyer_mock_12345",
    name: "Sarkar Raj",
    email: "sarkarraj0766@gmail.com",
    currentPoints: 450,
    earnedPoints: 950,
    redeemedPoints: 500,
  },
  {
    id: "user_2",
    name: "Ananya Sharma",
    email: "ananya@example.com",
    currentPoints: 1200,
    earnedPoints: 1800,
    redeemedPoints: 600,
  },
  {
    id: "user_3",
    name: "Rohan Gupta",
    email: "rohan@example.com",
    currentPoints: 0,
    earnedPoints: 500,
    redeemedPoints: 500,
  },
  {
    id: "user_4",
    name: "Priya Nair",
    email: "priya@example.com",
    currentPoints: 750,
    earnedPoints: 1000,
    redeemedPoints: 250,
  },
];

export const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      availablePoints: 450,
      totalEarned: 950,
      totalRedeemed: 500,
      pendingPoints: 120,
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
          availablePoints: 450,
          totalEarned: 950,
          totalRedeemed: 500,
          pendingPoints: 120,
          rules: DEFAULT_RULES,
          history: DEFAULT_HISTORY,
          users: DEFAULT_USERS,
        });
      },
    }),
    {
      name: "loyalty-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
