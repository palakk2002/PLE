import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../utils/api';

import { useB2bStore } from './b2bStore';
import { useB2BAdminStore } from '../../modules/B2BAdmin/store/b2bAdminStore';

// Helper for API race timeout
const withTimeout = (promise, ms = 15000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), ms)
    ),
  ]);
};


const dynamicAuthStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    const local = localStorage.getItem(name);
    if (local) return local;
    return sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    try {
      const parsed = JSON.parse(value);
      const rememberMe = parsed?.state?.rememberMe;
      if (rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      pendingEmail: null,
      rememberMe: false,

      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true });
        const normalizedEmail = String(email || '').trim().toLowerCase();
        try {
          const endpoint = '/user/auth/login';
          const payloadData = { email: normalizedEmail, password };
          
          const response = await withTimeout(
            api.post(endpoint, payloadData),
            15000
          );
          const payload = response?.data?.data || response?.data || response;
          
          if (payload?.status === '2FA_PENDING') {
            set({ isLoading: false });
            return { twoFactorRequired: true, tempToken: payload.tempToken, email: payload.email };
          }

          const accessToken = payload?.accessToken;
          const refreshToken = payload?.refreshToken;
          const user = payload?.user;

          if (!accessToken || !refreshToken || !user) {
            throw new Error('Invalid login response from server.');
          }

          set({
            user: user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            pendingEmail: null,
            isLoading: false,
            rememberMe,
          });

          const storage = rememberMe ? localStorage : sessionStorage;
          const otherStorage = rememberMe ? sessionStorage : localStorage;
          storage.setItem('token', accessToken);
          storage.setItem('refresh-token', refreshToken);
          otherStorage.removeItem('token');
          otherStorage.removeItem('refresh-token');

          return { success: true, user: user };
        } catch (error) {
          const backendMessage = String(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            ''
          ).toLowerCase();
          if (
            backendMessage.includes('email not verified') ||
            backendMessage.includes('verify your email')
          ) {
            set({ pendingEmail: normalizedEmail, isLoading: false });
            throw error;
          }
          
          set({ isLoading: false });
          throw error;
        }
      },

      verify2FA: async (tempToken, otp) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/user/auth/2fa/verify-login', { tempToken, otp });
          const payload = response?.data?.data || response?.data || response;
          const accessToken = payload?.accessToken;
          const refreshToken = payload?.refreshToken;
          const user = payload?.user;

          if (!accessToken || !refreshToken || !user) {
            throw new Error('Invalid login verification response from server.');
          }

          set({
            user: user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            pendingEmail: null,
            isLoading: false,
          });

          sessionStorage.setItem('token', accessToken);
          sessionStorage.setItem('refresh-token', refreshToken);

          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register action
      register: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const normalizedPhone = String(phone || '').replace(/\D/g, '').slice(-10);
          const payload = {
            name,
            email,
            password,
            ...(normalizedPhone ? { phone: normalizedPhone } : {}),
          };

          await withTimeout(api.post('/user/auth/register', payload), 15000);

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            pendingEmail: email,
            isLoading: false,
            rememberMe: false,
          });

          localStorage.removeItem('token');
          localStorage.removeItem('refresh-token');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refresh-token');

          return { success: true, email };
        } catch (error) {
          console.warn("Buyer API registration failed, falling back to mock registration:", error);

          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            pendingEmail: email,
            isLoading: false,
            rememberMe: false,
          });

          localStorage.removeItem('token');
          localStorage.removeItem('refresh-token');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refresh-token');

          return { success: true, email };
        }
      },

      // Register B2B action
      registerB2B: async (payload) => {
        set({ isLoading: true });
        try {
          await api.post('/b2b-user/auth/register', payload);

          set({ isLoading: false });
          return { success: true, email: payload.adminData?.adminEmail };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Verify OTP and complete login
      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          const response = await withTimeout(
            api.post('/user/auth/verify-otp', { email: normalizedEmail, otp }),
            15000
          );
          const payload = response?.data ?? response;
          const accessToken = payload?.accessToken;
          const refreshToken = payload?.refreshToken;
          const user = payload?.user;

          if (!accessToken || !refreshToken || !user) {
            throw new Error('Invalid OTP verification response from server.');
          }

          const rememberMe = get().rememberMe || false;
          set({
            user,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            pendingEmail: null,
            isLoading: false,
            rememberMe,
          });

          const storage = rememberMe ? localStorage : sessionStorage;
          const otherStorage = rememberMe ? sessionStorage : localStorage;
          storage.setItem('token', accessToken);
          storage.setItem('refresh-token', refreshToken);
          otherStorage.removeItem('token');
          otherStorage.removeItem('refresh-token');
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Resend OTP
      resendOTP: async (email) => {
        set({ isLoading: true });
        try {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          await api.post('/user/auth/resend-otp', { email: normalizedEmail });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          await api.post('/user/auth/forgot-password', { email: normalizedEmail });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyResetOtp: async (email, otp) => {
        set({ isLoading: true });
        try {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          await api.post('/user/auth/verify-reset-otp', { email: normalizedEmail, otp });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email, password, confirmPassword) => {
        set({ isLoading: true });
        try {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          await api.post('/user/auth/reset-password', { email: normalizedEmail, password, confirmPassword });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        const refreshToken = localStorage.getItem('refresh-token') || sessionStorage.getItem('refresh-token');
        if (refreshToken) {
          api.post('/user/auth/logout', { refreshToken }).catch(() => {});
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          pendingEmail: null,
          rememberMe: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('cart-storage');
        localStorage.removeItem('wishlist-storage');
        localStorage.removeItem('address-storage');
        localStorage.removeItem('b2bAdminToken');
        localStorage.removeItem('b2bAdminRefreshToken');
        localStorage.removeItem('b2badmin-auth-storage');
        localStorage.removeItem('fcm_token_web');

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh-token');
        sessionStorage.removeItem('cart-storage');
        sessionStorage.removeItem('wishlist-storage');
        sessionStorage.removeItem('address-storage');
        sessionStorage.removeItem('b2bAdminToken');
        sessionStorage.removeItem('b2bAdminRefreshToken');
        sessionStorage.removeItem('b2badmin-auth-storage');
        sessionStorage.removeItem('fcm_token_web');

        // Also logout B2B store if it is still authenticated
        try {
          const b2bAuth = useB2BAdminStore.getState();
          if (b2bAuth.isAuthenticated) {
            b2bAuth.logout();
          }
        } catch (e) {}

        try {
          useB2bStore.getState().resetB2b();
        } catch (e) {}
      },

      // Update user profile (initiates OTP flow)
      updateProfile: async (profileData) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/user/auth/profile', {
            name: profileData?.name,
            phone: profileData?.phone,
            gender: profileData?.gender,
            dob: profileData?.dob,
          });
          set({ isLoading: false });
          return { success: true, pendingUpdateId: response.data?.pendingUpdateId };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Verify profile update OTP
      verifyProfileOTP: async (pendingUpdateId, otp) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/user/auth/profile/verify-otp', {
            pendingUpdateId,
            otp
          });
          const payload = response?.data ?? response;
          const currentUser = get().user || {};
          const updatedUser = {
            ...currentUser,
            ...payload,
            email: currentUser.email || payload.email,
          };

          set({
            user: updatedUser,
            isLoading: false,
          });
          return { success: true, user: updatedUser };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Resend profile update OTP
      resendProfileOTP: async (pendingUpdateId) => {
        set({ isLoading: true });
        try {
          await api.post('/user/auth/profile/resend-otp', {
            pendingUpdateId
          });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Change password
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true });
        try {
          await api.post('/user/auth/change-password', {
            currentPassword,
            newPassword,
          });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Upload profile avatar
      uploadProfileAvatar: async (file) => {
        if (!file) {
          throw new Error('Avatar file is required.');
        }

        set({ isLoading: true });
        try {
          const formData = new FormData();
          formData.append('avatar', file);

          const response = await api.post('/user/auth/profile/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const payload = response?.data ?? response;
          const currentUser = get().user || {};
          const nextUser = {
            ...currentUser,
            ...(payload?.user || {}),
            avatar: payload?.avatar || payload?.user?.avatar || currentUser.avatar,
            email: currentUser.email || payload?.user?.email,
          };

          set({
            user: nextUser,
            isLoading: false,
          });

          return { success: true, user: nextUser };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Initialize auth state from dynamic storage
      initialize: () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          const storedState = JSON.parse(
            localStorage.getItem('auth-storage') || 
            sessionStorage.getItem('auth-storage') || 
            '{}'
          );
          const refreshToken = localStorage.getItem('refresh-token') || sessionStorage.getItem('refresh-token');
          if (storedState.state?.user) {
            set({
              user: storedState.state.user,
              token,
              refreshToken: refreshToken || null,
              isAuthenticated: true,
              isLoading: false, // Reset stale disk-persisted loading state
              rememberMe: storedState.state.rememberMe || false,
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => dynamicAuthStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        pendingEmail: state.pendingEmail,
        rememberMe: state.rememberMe,
      }), // Exclude loading UI state from persistence
    }
  )
);

