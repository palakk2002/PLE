// Zustand store for B2B Enquiry / RFQ Management connected to backend
import { create } from "zustand";
import api from "../../../shared/utils/api";
import { mockEnquiries, defaultB2BSettings, mockAnalytics } from "../data/b2bEnquiryMockData";

const mapRfqToEnquiry = (rfq) => {
  const latestSellerOffer = rfq.timeline && [...rfq.timeline].reverse().find(t => t.senderType === 'seller');
  const quotes = (rfq.timeline || [])
    .filter(t => t.senderType === 'seller')
    .map((t, idx) => ({
      id: `QT-${idx}-${rfq._id}`,
      totalValue: t.price * t.quantity,
      status: 'submitted',
      notes: t.notes,
      createdAt: t.timestamp || new Date().toISOString(),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
    }));

  return {
    id: rfq._id,
    _id: rfq._id,
    enquiryNumber: rfq.rfqId,
    rfqId: rfq.rfqId,
    createdAt: rfq.createdAt,
    status: rfq.status.toLowerCase(), // e.g. 'pending', 'quoted', 'negotiating', 'accepted', 'rejected'
    priority: rfq.quantity > 500 ? 'high' : rfq.quantity > 100 ? 'medium' : 'low',
    message: rfq.requirementDetails || 'No buyer message provided.',
    totalEstimatedValue: rfq.targetPrice * rfq.quantity,
    buyer: {
      name: rfq.buyerId?.name || 'Business Buyer',
      company: rfq.buyerId?.companyName || 'Apex General Enterprises',
      email: rfq.buyerId?.email || 'buyer@apex.in',
      phone: rfq.buyerId?.phone || '9876543210',
      address: rfq.buyerId?.businessAddress || 'BKC, Mumbai'
    },
    products: [
      {
        name: rfq.productId?.name || 'Product',
        sku: rfq.productId?._id || 'PROD-1',
        qty: rfq.quantity,
        unit: rfq.productId?.unit || 'pcs',
        targetPrice: rfq.targetPrice,
      }
    ],
    timeline: (rfq.timeline || []).map(t => ({
      action: t.senderType === 'buyer' ? `Buyer counter offer: ₹${t.price}` : `Seller quote: ₹${t.price}`,
      timestamp: t.timestamp || new Date().toISOString(),
      by: t.senderType === 'buyer' ? 'Buyer' : 'Seller',
      notes: t.notes
    })),
    quotes,
    originalRfq: rfq
  };
};

export const useVendorB2BStore = create((set, get) => ({
  // State
  enquiries: [...mockEnquiries],
  settings: { ...defaultB2BSettings },
  analytics: { ...mockAnalytics },
  isLoading: false,

  // Enquiries
  fetchEnquiries: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/vendor/rfq');
      const payload = res?.data ?? res;
      const mapped = Array.isArray(payload) ? payload.map(mapRfqToEnquiry) : [];
      const merged = [...mapped, ...mockEnquiries.filter(me => !mapped.some(q => q.enquiryNumber === me.enquiryNumber))];
      set({ enquiries: merged });
    } catch (error) {
      console.error('Error fetching vendor RFQs:', error);
      set({ enquiries: [...mockEnquiries] });
    } finally {
      set({ isLoading: false });
    }
  },

  getEnquiryById: (id) => {
    return get().enquiries.find((e) => e.id === id) || null;
  },

  updateEnquiryStatus: async (id, status) => {
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(id);
    if (isMongoId && status === 'rejected') {
      try {
        await api.post(`/vendor/rfq/${id}/reject`, { notes: 'Vendor rejected the RFQ request.' });
        get().fetchEnquiries();
      } catch (error) {
        console.error('Error rejecting RFQ:', error);
      }
    } else {
      // Local fallback for mock
      set((state) => ({
        enquiries: state.enquiries.map((e) =>
          e.id === id ? { ...e, status: status } : e
        )
      }));
    }
  },

  // Quotes
  createQuote: async (enquiryId, quoteData) => {
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(enquiryId);
    try {
      const firstItem = quoteData.items[0];
      if (isMongoId) {
        await api.post(`/vendor/rfq/${enquiryId}/quote`, {
          price: firstItem.offeredPrice,
          quantity: firstItem.qty,
          deliveryTimeline: `${firstItem.deliveryDays} days`,
          notes: quoteData.notes
        });
      } else {
        // Local fallback for mock
        const quoteId = `QT-${Date.now()}`;
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === enquiryId
              ? {
                  ...e,
                  status: "quoted",
                  quotes: [...e.quotes, { id: quoteId, enquiryId, ...quoteData, status: "submitted", createdAt: new Date().toISOString() }]
                }
              : e
          )
        }));
        return quoteId;
      }
      get().fetchEnquiries();
      return `QT-${Date.now()}`;
    } catch (error) {
      console.error('Error submitting quote:', error);
      throw error;
    }
  },

  updateQuote: (enquiryId, quoteId, data) => {
    // Local no-op
  },

  // Settings
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  getAnalytics: () => {
    return get().analytics;
  },
}));
