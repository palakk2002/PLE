import { useAuthStore } from '../store/authStore';
import { useB2BAdminStore } from '../../modules/B2BAdmin/store/b2bAdminStore';
import { useB2bStore } from '../store/b2bStore';
import { unregisterFCMToken } from '../../services/pushNotificationService';
import api from './api';

const USER_STORAGE_KEYS = [
  'token',
  'refresh-token',
  'auth-storage',
  'b2bAdminToken',
  'b2bAdminRefreshToken',
  'b2badmin-auth-storage',
  'b2b-storage',
  'cart-storage',
  'wishlist-storage',
  'address-storage',
  'fcm_token_web',
  'post_login_redirect',
  'post_login_action',
  'currentPath',
  'prevPath',
  'splash-shown',
];

/**
 * Universal logout helper for all UserApp / B2B portals.
 * Clears all auth & session state and performs a clean redirection to the Portal Selection page.
 *
 * @param {string} redirectUrl - Destination after logout (defaults to root portal selection '/')
 */
export const performUserLogout = (redirectUrl = '/') => {
  if (typeof window === 'undefined') return;

  // 1. Notify backend if refresh token exists (fire and forget)
  try {
    const refreshToken =
      localStorage.getItem('refresh-token') ||
      sessionStorage.getItem('refresh-token');
    if (refreshToken) {
      api.post('/user/auth/logout', { refreshToken }).catch(() => {});
    }
  } catch (e) {}

  // 2. Unregister push notifications
  try {
    unregisterFCMToken();
  } catch (e) {}

  // 3. Clear all storage keys across localStorage & sessionStorage
  USER_STORAGE_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    try {
      sessionStorage.removeItem(key);
    } catch (e) {}
  });

  // 4. Reset all zustand state stores
  try {
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      pendingEmail: null,
      rememberMe: false,
      isLoading: false,
    });
  } catch (e) {}

  try {
    useB2BAdminStore.setState({
      isAuthenticated: false,
      dashboardStats: null,
      employees: [],
      companyProfile: null,
      adminProfile: null,
      error: null,
      notifications: [],
      unreadNotificationsCount: 0,
      notificationsPage: 1,
      notificationsHasMore: true,
      isLoading: false,
    });
  } catch (e) {}

  try {
    useB2bStore.getState().resetB2b();
  } catch (e) {}

  // 5. Hard redirect to Portal Selection page to clear all React lifecycle, caches, and route guards
  window.location.href = redirectUrl;
};
