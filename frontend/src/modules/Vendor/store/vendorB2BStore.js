// Zustand store for B2B Enquiry / RFQ Management
// All actions work on local mock data — no backend API calls.
import { create } from "zustand";
import {
  mockEnquiries,
  defaultB2BSettings,
  mockAnalytics,
} from "../data/b2bEnquiryMockData";

export const useVendorB2BStore = create((set, get) => ({
  // State
  enquiries: [...mockEnquiries],
  settings: { ...defaultB2BSettings },
  analytics: { ...mockAnalytics },
  isLoading: false,

  // ── Enquiries ──────────────────────────────────────────

  fetchEnquiries: () => {
    set({ isLoading: true });
    // Simulate async
    setTimeout(() => {
      set({ enquiries: [...mockEnquiries], isLoading: false });
    }, 300);
  },

  getEnquiryById: (id) => {
    return get().enquiries.find((e) => e.id === id) || null;
  },

  updateEnquiryStatus: (id, status) => {
    set((state) => ({
      enquiries: state.enquiries.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              timeline: [
                ...e.timeline,
                {
                  action: `Status changed to ${status}`,
                  timestamp: new Date().toISOString(),
                  by: "Seller",
                },
              ],
            }
          : e
      ),
    }));
  },

  // ── Quotes ─────────────────────────────────────────────

  createQuote: (enquiryId, quoteData) => {
    const quoteId = `QT-${Date.now()}`;
    const newQuote = {
      id: quoteId,
      enquiryId,
      ...quoteData,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      enquiries: state.enquiries.map((e) =>
        e.id === enquiryId
          ? {
              ...e,
              status: "quoted",
              quotes: [...e.quotes, newQuote],
              timeline: [
                ...e.timeline,
                {
                  action: "Quote submitted",
                  timestamp: new Date().toISOString(),
                  by: "Seller",
                },
              ],
            }
          : e
      ),
    }));

    return quoteId;
  },

  updateQuote: (enquiryId, quoteId, data) => {
    set((state) => ({
      enquiries: state.enquiries.map((e) =>
        e.id === enquiryId
          ? {
              ...e,
              quotes: e.quotes.map((q) =>
                q.id === quoteId ? { ...q, ...data } : q
              ),
            }
          : e
      ),
    }));
  },

  // ── Settings ───────────────────────────────────────────

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  // ── Analytics (read-only mock) ─────────────────────────

  getAnalytics: () => {
    return get().analytics;
  },
}));
