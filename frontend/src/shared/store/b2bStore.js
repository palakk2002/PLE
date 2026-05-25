import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const DEFAULT_BUSINESS_PROFILE = {
  companyName: 'Apex General Enterprises',
  gstNumber: '27AAPCG9838F1Z1',
  businessAddress: '404 Business Hub, BKC, Mumbai, MH - 400051',
  creditLimit: 500000,
  creditUsed: 125000,
  creditTerms: 'NET 30 Days',
  businessEmail: 'procurement@apexenterprises.in',
  businessPhone: '9876543210',
};

const DEFAULT_QUOTATIONS = [
  {
    id: 'RFQ-8932',
    date: '23 May 2026',
    productId: 1,
    productName: 'Fresh Alphonso Mangoes (Premium)',
    quantity: 150,
    unit: 'Dozen',
    status: 'Approved',
    targetPrice: 400,
    quotedPrice: 420,
    notes: 'Require wooden crate packaging.',
  },
  {
    id: 'RFQ-8910',
    date: '21 May 2026',
    productId: 3,
    productName: 'Organic Bananas',
    quantity: 300,
    unit: 'Kg',
    status: 'Pending',
    targetPrice: 25,
    quotedPrice: null,
    notes: 'Delivery needed by end of next week.',
  },
];

export const useB2bStore = create(
  persist(
    (set, get) => ({
      userRole: 'customer', // 'customer' or 'business_buyer'
      businessProfile: DEFAULT_BUSINESS_PROFILE,
      quotations: DEFAULT_QUOTATIONS,

      setUserRole: (role) => set({ userRole: role }),

      isBusinessBuyer: () => get().userRole === 'business_buyer',

      updateBusinessProfile: (updatedData) =>
        set((state) => ({
          businessProfile: { ...state.businessProfile, ...updatedData },
        })),

      addQuotation: (newQuote) =>
        set((state) => ({
          quotations: [
            {
              id: `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              status: 'Pending',
              ...newQuote,
            },
            ...state.quotations,
          ],
        })),
        
      resetB2b: () => set({
        userRole: 'customer',
        businessProfile: DEFAULT_BUSINESS_PROFILE,
        quotations: DEFAULT_QUOTATIONS,
      }),
    }),
    {
      name: 'b2b-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
