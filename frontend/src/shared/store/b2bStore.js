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

const DEFAULT_STOCK_REQUESTS = [
  {
    id: 'SR-7821',
    date: '24 May 2026',
    productId: 2,
    productName: 'Premium Basmati Rice',
    requiredQuantity: 500,
    unit: 'Kg',
    status: 'Seller Responded',
    businessName: 'Apex General Enterprises',
    expectedDeliveryDate: '2026-06-15',
    budgetRange: '₹50,000 - ₹75,000',
    notes: 'Need bulk order for upcoming festival season.',
  },
  {
    id: 'SR-7822',
    date: '25 May 2026',
    productId: 5,
    productName: 'Organic Olive Oil',
    requiredQuantity: 200,
    unit: 'Litre',
    status: 'Pending',
    businessName: 'Apex General Enterprises',
    expectedDeliveryDate: '2026-06-20',
    budgetRange: '₹30,000 - ₹50,000',
    notes: 'Premium quality required for retail chain.',
  },
];

export const useB2bStore = create(
  persist(
    (set, get) => ({
      userRole: 'customer', // 'customer' or 'business_buyer'
      businessProfile: DEFAULT_BUSINESS_PROFILE,
      quotations: DEFAULT_QUOTATIONS,
      stockRequests: DEFAULT_STOCK_REQUESTS,

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

      addStockRequest: (newRequest) =>
        set((state) => ({
          stockRequests: [
            {
              id: `SR-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              status: 'Pending',
              ...newRequest,
            },
            ...state.stockRequests,
          ],
        })),

      updateStockRequestStatus: (requestId, newStatus) =>
        set((state) => ({
          stockRequests: state.stockRequests.map((req) =>
            req.id === requestId ? { ...req, status: newStatus } : req
          ),
        })),

      resetB2b: () => set({
        userRole: 'customer',
        businessProfile: DEFAULT_BUSINESS_PROFILE,
        quotations: DEFAULT_QUOTATIONS,
        stockRequests: DEFAULT_STOCK_REQUESTS,
      }),
    }),
    {
      name: 'b2b-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
