import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { adminLogin as apiLogin } from '../services/adminService';
import api from '../../../shared/utils/api';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Admin login — calls real backend
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await apiLogin(email, password);
          const { accessToken, refreshToken, admin } = response.data;

          // Store token under 'adminToken' key (used by adminService interceptor)
          sessionStorage.setItem('adminToken', accessToken);
          sessionStorage.setItem('adminRefreshToken', refreshToken);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');

          set({
            admin,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, admin };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Admin logout
      logout: () => {
        const refreshToken = sessionStorage.getItem('adminRefreshToken') || localStorage.getItem('adminRefreshToken');
        if (refreshToken) {
          api.post('/admin/auth/logout', { refreshToken }).catch(() => {});
        }

        set({ admin: null, token: null, refreshToken: null, isAuthenticated: false });
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminRefreshToken');
      },

      // Initialize admin auth state from localStorage
      initialize: () => {
        const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
        if (token) {
          const storedState = JSON.parse(
            sessionStorage.getItem('admin-auth-storage') || 
            localStorage.getItem('admin-auth-storage') || 
            '{}'
          );
          const refreshToken = sessionStorage.getItem('adminRefreshToken') || localStorage.getItem('adminRefreshToken');
          if (storedState.state?.admin) {
            set({
              admin: storedState.state.admin,
              token,
              refreshToken: refreshToken || null,
              isAuthenticated: true,
              isLoading: false, // Reset stale disk loading states
            });
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }), // Exclude loading UI state from persistence
    }
  )
);
