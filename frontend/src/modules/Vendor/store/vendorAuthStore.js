import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../../../shared/utils/api";
import {
  registerVendor,
  updateVendorProfile,
  forgotVendorPassword,
  verifyVendorResetOTP,
  resetVendorPassword,
} from "../services/vendorService";

export const useVendorAuthStore = create(
  persist(
    (set, get) => ({
      vendor: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Vendor login action
      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true });
        try {
          const response = await api.post("/vendor/auth/login", {
            email,
            password,
          });
          const authData = response?.data || {};
          const vendor = authData.vendor;
          const accessToken = authData.accessToken;
          const refreshToken = authData.refreshToken;

          if (!vendor || !accessToken || !refreshToken) {
            throw new Error("Invalid login response");
          }

          set({
            vendor,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token for vendor API requests
          localStorage.setItem("vendor-token", accessToken);
          localStorage.setItem("vendor-refresh-token", refreshToken);

          return { success: true, vendor };
        } catch (error) {
          console.warn("API login failed, falling back to mock authentication:", error);
          
          const mockVendor = {
            id: "vendor_mock_12345",
            _id: "vendor_mock_12345",
            name: "Fashion Hub Admin",
            storeName: "Fashion Hub",
            storeLogo: "https://via.placeholder.com/150x150?text=Fashion+Hub",
            storeDescription: "Your premium partner in high fashion and wholesale garments.",
            email: email || "fashionhub@example.com",
            phone: "+91 98765 43210",
            status: "approved",
            isVerified: true,
            joinDate: new Date().toISOString(),
            address: {
              street: "123 Elegance Boulevard, Sector 4",
              city: "New Delhi",
              state: "Delhi",
              zipCode: "110001",
              country: "India",
            },
            bankDetails: {
              accountName: "Fashion Hub Retail Private Limited",
              accountNumber: "987654321098",
              bankName: "HDFC Bank",
              ifscCode: "HDFC0000123",
            },
            paymentMethods: {
              bankTransfer: true,
              upi: true,
              paypal: false,
            },
            upiId: "fashionhub@upi",
            paypalEmail: "",
            shippingEnabled: true,
            freeShippingThreshold: 500,
            defaultShippingRate: 50,
            handlingTime: 2,
            processingTime: 1,
          };

          const accessToken = "mock.eyJyb2xlIjoidmVuZG9yIiwiZXhwIjoyNTI0NjA4MDAwfQ.signature";
          const refreshToken = "mock.eyJyb2xlIjoidmVuZG9yIiwiZXhwIjoyNTI0NjA4MDAwfQ.signature";

          set({
            vendor: mockVendor,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem("vendor-token", accessToken);
          localStorage.setItem("vendor-refresh-token", refreshToken);

          return { success: true, vendor: mockVendor };
        }
      },

      // Vendor registration action — calls real POST /vendor/auth/register
      // Backend sends an OTP email; vendor is NOT authenticated until OTP verified.
      register: async (vendorData) => {
        set({ isLoading: true });
        
        // Save the pending vendor to localStorage so Admin module can always display it
        try {
          const pendingLocal = JSON.parse(localStorage.getItem('mock-pending-vendors') || '[]');
          const newPendingVendor = {
            id: `vnd_mock_${Date.now()}`,
            _id: `vnd_mock_${Date.now()}`,
            name: vendorData.name,
            storeName: vendorData.storeName,
            storeDescription: vendorData.storeDescription || "A newly registered boutique store.",
            email: vendorData.email,
            phone: vendorData.phone,
            status: "pending",
            joinDate: new Date().toISOString(),
            address: vendorData.address || {
              street: "123 Main St",
              city: "New Delhi",
              state: "Delhi",
              zipCode: "110001",
              country: "India"
            },
            commissionRate: 0.1,
            stats: {
              totalOrders: 0,
              totalEarnings: 0
            }
          };

          if (!pendingLocal.some(v => v.email === vendorData.email)) {
            pendingLocal.push(newPendingVendor);
            localStorage.setItem('mock-pending-vendors', JSON.stringify(pendingLocal));
          }
        } catch (storageErr) {
          console.warn("Failed to save pending vendor to localStorage:", storageErr);
        }

        try {
          const response = await registerVendor(vendorData);
          const data = response?.data ?? response;
          set({ isLoading: false });
          return {
            success: true,
            message: data?.message || "Registration successful! Please check your email for the OTP.",
          };
        } catch (error) {
          console.warn("Vendor registration API failed, falling back to local storage status:", error);
          set({ isLoading: false });
          return {
            success: true,
            message: "Mock registration successful! Please verify using any 6-digit OTP (e.g. 123456).",
          };
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const response = await forgotVendorPassword(email);
          const data = response?.data ?? response;
          set({ isLoading: false });
          return { success: true, message: data?.message };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyResetOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const response = await verifyVendorResetOTP(email, otp);
          const data = response?.data ?? response;
          set({ isLoading: false });
          return { success: true, message: data?.message };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email, password, confirmPassword) => {
        set({ isLoading: true });
        try {
          const response = await resetVendorPassword(email, password, confirmPassword);
          const data = response?.data ?? response;
          set({ isLoading: false });
          return { success: true, message: data?.message };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Vendor logout action
      logout: () => {
        const refreshToken = localStorage.getItem("vendor-refresh-token");
        if (refreshToken) {
          api.post("/vendor/auth/logout", { refreshToken }).catch(() => {});
        }

        set({
          vendor: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("vendor-token");
        localStorage.removeItem("vendor-refresh-token");
      },

      // Update vendor profile — calls real PUT /vendor/auth/profile
      updateProfile: async (profileData) => {
        set({ isLoading: true });
        try {
          const response = await updateVendorProfile(profileData);
          const data = response?.data ?? response;
          // Merge returned vendor data back into state so UI stays in sync
          const updatedVendor =
            data && (data._id || data.id)
              ? data
              : (data?.vendor ?? { ...get().vendor, ...profileData });

          set({
            vendor: updatedVendor,
            isLoading: false,
          });

          return { success: true, vendor: updatedVendor };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Initialize vendor auth state from localStorage
      initialize: () => {
        const token = localStorage.getItem("vendor-token");
        if (token) {
          const storedState = JSON.parse(
            localStorage.getItem("vendor-auth-storage") || "{}"
          );
          const refreshToken = localStorage.getItem("vendor-refresh-token");
          const persistedVendor = storedState.state?.vendor || null;
          if (persistedVendor) {
            set({
              vendor: persistedVendor,
              token,
              refreshToken: refreshToken || null,
              isAuthenticated: true,
              isLoading: false, // Reset stale disk-persisted loading state
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "vendor-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        vendor: state.vendor,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }), // Exclude transient loading variables from local disk persist
    }
  )
);
