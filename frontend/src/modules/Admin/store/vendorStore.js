import { create } from "zustand";
import {
  getAllVendors,
  getVendorById,
  updateVendorStatus as updateVendorStatusApi,
  updateCommissionRate as updateCommissionRateApi,
} from "../services/adminService";

const normalizeVendor = (vendor) => {
  if (!vendor || typeof vendor !== "object") return vendor;
  const id = String(vendor.id || vendor._id || "");
  return {
    ...vendor,
    id,
    _id: String(vendor._id || id),
  };
};

export const useVendorStore = create((set, get) => ({
  vendors: [],
  selectedVendor: null,
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const vendors = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await getAllVendors({ page, limit: 200 });
        const payload = response?.data ?? response;
        const pageVendors = Array.isArray(payload?.vendors)
          ? payload.vendors.map(normalizeVendor)
          : [];

        vendors.push(...pageVendors);
        totalPages = Math.max(Number(payload?.pages) || 1, 1);
        page += 1;
      } while (page <= totalPages);

      // Load pending vendors registered locally from localStorage
      const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
      const mergedVendors = [...vendors];

      console.log("useVendorStore.initialize (API SUCCESS PATH):", {
        backendVendors: vendors,
        localStorageVendors: pendingLocal
      });

      pendingLocal.forEach(p => {
        const isDuplicate = mergedVendors.some(v => 
          String(v.id || v._id) === String(p.id || p._id) || 
          (v.email && p.email && String(v.email).trim().toLowerCase() === String(p.email).trim().toLowerCase())
        );
        if (!isDuplicate) {
          mergedVendors.push(normalizeVendor(p));
        }
      });

      console.log("useVendorStore.initialize merged (API SUCCESS PATH):", mergedVendors);

      set({ vendors: mergedVendors, isLoading: false });
      return mergedVendors;
    } catch {
      console.warn("Admin getAllVendors API call failed, loading default mock vendors:");
      
      const defaultMockVendors = [
        {
          id: "vnd_mock_001",
          _id: "vnd_mock_001",
          name: "Rajesh Sharma",
          storeName: "Rajesh Fashion Hub",
          storeDescription: "Your premium partner in high fashion and wholesale garments.",
          email: "rajesh@fashionhub.com",
          phone: "+91 98765 43210",
          status: "approved",
          joinDate: "2025-10-12T00:00:00.000Z",
          commissionRate: 0.1,
        },
        {
          id: "vnd_mock_002",
          _id: "vnd_mock_002",
          name: "Amit Gupta",
          storeName: "Gupta Saree Sadan",
          storeDescription: "Traditional Indian bridal wear and wholesale sarees.",
          email: "amit@gupta.com",
          phone: "+91 99112 23344",
          status: "pending",
          joinDate: "2026-05-20T00:00:00.000Z",
          commissionRate: 0.12,
        },
        {
          id: "vnd_mock_003",
          _id: "vnd_mock_003",
          name: "Vikram Hegde",
          storeName: "Apex Electronics Retail",
          storeDescription: "Consolidated electronics and laptop accessories.",
          email: "info@apex.in",
          phone: "+91 80223 34455",
          status: "approved",
          joinDate: "2025-07-15T00:00:00.000Z",
          commissionRate: 0.08,
        }
      ];

      const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
      const merged = [...defaultMockVendors];

      console.log("useVendorStore.initialize (API FALLBACK PATH):", {
        mockVendors: defaultMockVendors,
        localStorageVendors: pendingLocal
      });

      pendingLocal.forEach(p => {
        const isDuplicate = merged.some(v => 
          String(v.id || v._id) === String(p.id || p._id) || 
          (v.email && p.email && String(v.email).trim().toLowerCase() === String(p.email).trim().toLowerCase())
        );
        if (!isDuplicate) {
          merged.push(normalizeVendor(p));
        }
      });

      console.log("useVendorStore.initialize merged (API FALLBACK PATH):", merged);

      set({ vendors: merged, isLoading: false });
      return merged;
    }
  },

  getAllVendors: () => get().vendors,

  getVendor: async (id) => {
    const existing = get().vendors.find(
      (v) => String(v.id || v._id) === String(id)
    );
    if (existing) {
      set({ selectedVendor: existing });
      return existing;
    }

    try {
      const response = await getVendorById(id);
      const vendor = normalizeVendor(response?.data ?? response);
      if (!vendor) return null;
      set((state) => ({
        selectedVendor: vendor,
        vendors: state.vendors.some(
          (v) => String(v.id || v._id) === String(vendor.id)
        )
          ? state.vendors.map((v) =>
            String(v.id || v._id) === String(vendor.id) ? vendor : v
          )
          : [...state.vendors, vendor],
      }));
      return vendor;
    } catch {
      return null;
    }
  },

  updateVendorStatus: async (id, status, reason = "") => {
    try {
      const response = await updateVendorStatusApi(id, status, reason);
      const vendor = normalizeVendor(response?.data ?? response);
      if (!vendor) return false;
      
      // Update in localStorage if it was local mock
      const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
      if (pendingLocal.some(v => String(v.id) === String(id))) {
        const updated = pendingLocal.map(v => String(v.id) === String(id) ? { ...v, status } : v);
        localStorage.setItem('mock-pending-vendors', JSON.stringify(updated));
      }

      set((state) => ({
        vendors: state.vendors.map((v) =>
          String(v.id || v._id) === String(id) ? { ...v, ...vendor } : v
        ),
        selectedVendor:
          state.selectedVendor &&
          String(state.selectedVendor.id || state.selectedVendor._id) ===
          String(id)
            ? { ...state.selectedVendor, ...vendor }
            : state.selectedVendor,
      }));
      return true;
    } catch {
      console.warn("updateVendorStatus API failed, updating vendor status locally:", id, status);
      
      // Update locally in localStorage
      const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
      const updatedLocal = pendingLocal.map(v => String(v.id) === String(id) ? { ...v, status } : v);
      localStorage.setItem('mock-pending-vendors', JSON.stringify(updatedLocal));

      // Update in state
      set((state) => ({
        vendors: state.vendors.map((v) =>
          String(v.id || v._id) === String(id) ? { ...v, status } : v
        ),
        selectedVendor:
          state.selectedVendor &&
          String(state.selectedVendor.id || state.selectedVendor._id) ===
          String(id)
            ? { ...state.selectedVendor, status }
            : state.selectedVendor,
      }));
      return true;
    }
  },

  updateCommissionRate: async (id, commissionRate) => {
    try {
      const response = await updateCommissionRateApi(id, commissionRate);
      const vendor = normalizeVendor(response?.data ?? response);
      if (!vendor) return false;
      
      // Update in localStorage if it was local mock
      const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
      if (pendingLocal.some(v => String(v.id) === String(id))) {
        const updated = pendingLocal.map(v => String(v.id) === String(id) ? { ...v, commissionRate } : v);
        localStorage.setItem('mock-pending-vendors', JSON.stringify(updated));
      }

      set((state) => ({
        vendors: state.vendors.map((v) =>
          String(v.id || v._id) === String(id) ? { ...v, ...vendor } : v
        ),
        selectedVendor:
          state.selectedVendor &&
          String(state.selectedVendor.id || state.selectedVendor._id) ===
          String(id)
            ? { ...state.selectedVendor, ...vendor }
            : state.selectedVendor,
      }));
      return true;
    } catch {
      console.warn("updateCommissionRate API failed, updating locally:");
      
      // Update locally in localStorage
      const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
      const updatedLocal = pendingLocal.map(v => String(v.id) === String(id) ? { ...v, commissionRate } : v);
      localStorage.setItem('mock-pending-vendors', JSON.stringify(updatedLocal));

      set((state) => ({
        vendors: state.vendors.map((v) =>
          String(v.id || v._id) === String(id) ? { ...v, commissionRate } : v
        ),
        selectedVendor:
          state.selectedVendor &&
          String(state.selectedVendor.id || state.selectedVendor._id) ===
          String(id)
            ? { ...state.selectedVendor, commissionRate }
            : state.selectedVendor,
      }));
      return true;
    }
  },
}));
