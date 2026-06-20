import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, AUTH_REDIRECT_LOCK_KEY, AUTH_REDIRECT_LOCK_MS } from './constants';
import { products as mockProductsList } from '../../data/products';


const AUTH_SCOPES = {
  admin: {
    prefix: '/admin',
    accessKey: 'adminToken',
    refreshKey: 'adminRefreshToken',
    persistKey: 'admin-auth-storage',
    loginPath: '/admin/login',
    areaPrefix: '/admin',
  },
  vendor: {
    prefix: '/vendor',
    accessKey: 'vendor-token',
    refreshKey: 'vendor-refresh-token',
    persistKey: 'vendor-auth-storage',
    loginPath: '/vendor/login',
    areaPrefix: '/vendor',
  },
  delivery: {
    prefix: '/delivery',
    accessKey: 'delivery-token',
    refreshKey: 'delivery-refresh-token',
    persistKey: 'delivery-auth-storage',
    loginPath: '/delivery/login',
    areaPrefix: '/delivery',
  },
  b2bAdmin: {
    prefix: '/b2b-user',
    accessKey: 'b2bAdminToken',
    refreshKey: 'b2bAdminRefreshToken', // Not implemented yet, but keeping for structure
    persistKey: 'b2badmin-auth-storage', // Need to match exactly what is in b2bAdminStore.js
    loginPath: '/login',
    areaPrefix: '/b2b-dashboard',
  },
  user: {
    prefix: '/user',
    accessKey: 'token',
    refreshKey: 'refresh-token',
    persistKey: 'auth-storage',
    loginPath: '/login',
    areaPrefix: '/',
  },
};

const EXCLUDED_AUTH_SUFFIXES = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/verify-reset-otp',
  '/auth/reset-password',
  '/auth/refresh',
  '/auth/logout',
];

const refreshInFlight = {
  admin: null,
  vendor: null,
  delivery: null,
  user: null,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStorageItem = (key) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(key) !== null) {
    localStorage.setItem(key, value);
  } else {
    sessionStorage.setItem(key, value);
  }
};

const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

const redirectTo = (path) => {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  const currentPath = window.location.pathname;
  const lockUntil = Number(sessionStorage.getItem(AUTH_REDIRECT_LOCK_KEY) || 0);

  if (currentPath === path) return;
  if (now < lockUntil) return;

  sessionStorage.setItem(AUTH_REDIRECT_LOCK_KEY, String(now + AUTH_REDIRECT_LOCK_MS));
  window.location.href = path;
};

const getScopeFromUrl = (url = '') => {
  if (url.startsWith('/admin')) return 'admin';
  if (url.startsWith('/vendor')) return 'vendor';
  if (url.startsWith('/delivery')) return 'delivery';
  if (url.startsWith('/b2b-user')) return 'b2bAdmin';
  return 'user';
};

const getScopeFromPath = (path = window.location.pathname) => {
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/vendor')) return 'vendor';
  if (path.startsWith('/delivery')) return 'delivery';
  if (path.startsWith('/b2b-dashboard')) return 'b2bAdmin';
  return 'user';
};

const isExcludedAuthRequest = (scope, url = '') => {
  const { prefix } = AUTH_SCOPES[scope];
  return EXCLUDED_AUTH_SUFFIXES.some((suffix) => url.startsWith(`${prefix}${suffix}`));
};

const clearScopeAuth = async (scope) => {
  const config = AUTH_SCOPES[scope];
  removeStorageItem(config.accessKey);
  removeStorageItem(config.refreshKey);
  removeStorageItem(config.persistKey);
  
  try {
    if (scope === 'b2bAdmin') {
      const { useB2BAdminStore } = await import('../../modules/B2BAdmin/store/b2bAdminStore');
      if (useB2BAdminStore && useB2BAdminStore.getState) {
        useB2BAdminStore.getState().logout();
      }
    } else if (scope === 'user') {
      const { useAuthStore } = await import('../store/authStore');
      if (useAuthStore && useAuthStore.getState) {
        useAuthStore.getState().logout();
      }
    } else if (scope === 'admin') {
      const { useAdminAuthStore } = await import('../../modules/Admin/store/adminStore');
      if (useAdminAuthStore && useAdminAuthStore.getState) {
        useAdminAuthStore.getState().logout();
      }
    } else if (scope === 'vendor') {
      const { useVendorAuthStore } = await import('../../modules/Vendor/store/vendorAuthStore');
      if (useVendorAuthStore && useVendorAuthStore.getState) {
        useVendorAuthStore.getState().logout();
      }
    } else if (scope === 'delivery') {
      const { useDeliveryAuthStore } = await import('../../modules/Delivery/store/deliveryStore');
      if (useDeliveryAuthStore && useDeliveryAuthStore.getState) {
        useDeliveryAuthStore.getState().logout();
      }
    }
  } catch (err) {
    console.error(`Failed to dynamically import and logout store for scope: ${scope}`, err);
  }
};

const shouldAttemptRefresh = (error, scope) => {
  if (error?.response?.status !== 401) return false;
  if (!scope || !AUTH_SCOPES[scope]) return false;

  const refreshToken = getStorageItem(AUTH_SCOPES[scope].refreshKey);
  if (!refreshToken) return false;

  const originalRequest = error.config || {};
  if (originalRequest._retry) return false;

  const url = originalRequest.url || '';
  if (isExcludedAuthRequest(scope, url)) return false;

  return true;
};

const runRefresh = async (scope) => {
  if (refreshInFlight[scope]) {
    return refreshInFlight[scope];
  }

  const config = AUTH_SCOPES[scope];
  const currentRefreshToken = getStorageItem(config.refreshKey);
  if (!currentRefreshToken) {
    throw new Error('No refresh token available.');
  }

  refreshInFlight[scope] = axios
    .post(`${API_BASE_URL}${config.prefix}/auth/refresh`, {
      refreshToken: currentRefreshToken,
    })
    .then((response) => {
      const payload = response?.data?.data || response?.data || {};
      const nextAccessToken = payload?.accessToken;
      const nextRefreshToken = payload?.refreshToken;
      if (!nextAccessToken || !nextRefreshToken) {
        throw new Error('Invalid refresh response from server.');
      }

      setStorageItem(config.accessKey, nextAccessToken);
      setStorageItem(config.refreshKey, nextRefreshToken);

      return nextAccessToken;
    })
    .finally(() => {
      refreshInFlight[scope] = null;
    });

  return refreshInFlight[scope];
};

const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const isCacheableUrl = (url = '') => {
  if (url.includes('/categories') || url.includes('/admin/categories')) {
    return true;
  }
  if (url.includes('/products') && !url.includes('/products/refurb_')) {
    return true;
  }
  return false;
};

const getCacheKey = (config) => {
  const url = config.url || '';
  const params = config.params ? JSON.stringify(config.params) : '';
  const scope = getScopeFromUrl(url);
  return `${scope}:${url}:${params}`;
};

const clearCacheByUrlMatch = (url = '') => {
  const lowerUrl = url.toLowerCase();
  for (const key of memoryCache.keys()) {
    if (lowerUrl.includes('/products') && key.includes('/products')) {
      memoryCache.delete(key);
    } else if (lowerUrl.includes('/categories') && key.includes('/categories')) {
      memoryCache.delete(key);
    }
  }
};

api.interceptors.request.use(
  (config) => {
    const scope = getScopeFromUrl(config.url || '');
    const token = getStorageItem(AUTH_SCOPES[scope].accessKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // In-memory caching logic
    const method = config.method?.toLowerCase() || '';
    if (method === 'get' && isCacheableUrl(config.url)) {
      const cacheKey = getCacheKey(config);
      const cached = memoryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        config.adapter = () => {
          return Promise.resolve({
            data: cached.data,
            headers: config.headers,
            config,
            request: null,
            status: 200,
            statusText: 'OK',
          });
        };
      }
    } else if (method !== 'get') {
      // Invalidate related cache entries on mutation
      clearCacheByUrlMatch(config.url || '');
    }

    // Invalidate full cache on logout requests
    if (config.url?.includes('/logout') || config.url?.includes('/auth/logout')) {
      memoryCache.clear();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const getFilteredMockCircularProducts = (params = {}) => {
  let list = mockProductsList.filter(p => p.condition && p.condition !== 'brand_new');
  
  if (params.category) {
    const catId = String(params.category).trim();
    list = list.filter(p => String(p.categoryId).trim() === catId);
  }
  
  if (params.brand) {
    const brandId = String(params.brand).trim();
    list = list.filter(p => String(p.brandId).trim() === brandId);
  }
  
  if (params.vendor) {
    const vendorId = String(params.vendor).trim();
    list = list.filter(p => String(p.vendorId).trim() === vendorId);
  }

  if (params.condition) {
    const condition = String(params.condition).trim();
    if (condition !== 'all' && condition !== 'brand_new') {
      list = list.filter(p => String(p.condition).trim() === condition);
    } else if (condition === 'brand_new') {
      return [];
    }
  }
  
  if (params.q) {
    const q = String(params.q).trim().toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );
  }
  
  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    if (!isNaN(min)) {
      list = list.filter(p => p.price >= min);
    }
  }
  
  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    if (!isNaN(max)) {
      list = list.filter(p => p.price <= max);
    }
  }
  
  return list;
};

api.interceptors.response.use(
  (response) => {
    const url = response.config?.url || '';
    
    // Intercept GET /products
    if (url.endsWith('/products') || url.includes('/products?')) {
      const params = response.config?.params || {};
      const mockItems = getFilteredMockCircularProducts(params);
      
      if (response.data) {
        if (response.data.products && Array.isArray(response.data.products)) {
          const merged = [...response.data.products, ...mockItems];
          const unique = merged.filter((item, index, self) => 
            index === self.findIndex((t) => String(t.id) === String(item.id))
          );
          response.data.products = unique;
          if (typeof response.data.total === 'number') {
            response.data.total = unique.length;
          }
        } else if (response.data.data && response.data.data.products && Array.isArray(response.data.data.products)) {
          const merged = [...response.data.data.products, ...mockItems];
          const unique = merged.filter((item, index, self) => 
            index === self.findIndex((t) => String(t.id) === String(item.id))
          );
          response.data.data.products = unique;
          if (typeof response.data.data.total === 'number') {
            response.data.data.total = unique.length;
          }
        }
      }
    }
    
    // Intercept GET /vendors/:vendorId/products
    const vendorProductsMatch = url.match(/\/vendors\/([^/]+)\/products/);
    if (vendorProductsMatch) {
      const vendorId = vendorProductsMatch[1];
      const params = response.config?.params || {};
      const mockItems = getFilteredMockCircularProducts({ ...params, vendor: vendorId });
      
      if (response.data) {
        if (response.data.products && Array.isArray(response.data.products)) {
          const merged = [...response.data.products, ...mockItems];
          const unique = merged.filter((item, index, self) => 
            index === self.findIndex((t) => String(t.id) === String(item.id))
          );
          response.data.products = unique;
          if (typeof response.data.total === 'number') {
            response.data.total = unique.length;
          }
        } else if (response.data.data && response.data.data.products && Array.isArray(response.data.data.products)) {
          const merged = [...response.data.data.products, ...mockItems];
          const unique = merged.filter((item, index, self) => 
            index === self.findIndex((t) => String(t.id) === String(item.id))
          );
          response.data.data.products = unique;
          if (typeof response.data.data.total === 'number') {
            response.data.data.total = unique.length;
          }
        }
      }
    }
    
    const method = response.config?.method?.toLowerCase() || '';
    if (method === 'get' && isCacheableUrl(url) && response.status === 200) {
      const cacheKey = getCacheKey(response.config);
      memoryCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }

    return response.data;
  },
  async (error) => {
    const originalRequest = error.config || {};
    const url = originalRequest.url || '';
    
    // Intercept details request for mock circular products
    if (url.includes('/products/refurb_')) {
      const mockId = url.split('/').pop();
      const matched = mockProductsList.find(p => String(p.id) === String(mockId));
      if (matched) {
        return {
          success: true,
          data: matched
        };
      }
    }

    const scope = getScopeFromUrl(originalRequest.url || '');
    const currentPath = window.location.pathname;
    const pathScope = getScopeFromPath(currentPath);

    // Catch mock session calls immediately to bypass standard error toasts, redirects, and logouts
    const activeToken = scope && AUTH_SCOPES[scope] ? getStorageItem(AUTH_SCOPES[scope].accessKey) : null;
    if (activeToken && activeToken.startsWith('mock.')) {
      if (!originalRequest.url.includes('/vendors/all')) { console.warn("Mock session active, intercepting network failure for:", originalRequest.url); }
      const url = originalRequest.url || '';
      
      if (url.includes('/vendor/auth/profile')) {
        return {
          id: "vendor_mock_12345",
          _id: "vendor_mock_12345",
          name: "Fashion Hub Admin",
          storeName: "Fashion Hub",
          status: "approved",
          isVerified: true,
          joinDate: new Date().toISOString(),
          phone: "+91 98765 43210",
          email: "fashionhub@example.com",
          address: {
            street: "123 Elegance Boulevard, Sector 4",
            city: "New Delhi",
            state: "Delhi",
            zipCode: "110001",
            country: "India",
          }
        };
      }
      if (url.includes('/vendor/orders')) {
        return {
          orders: [],
          total: 0,
          page: 1,
          pages: 1
        };
      }
      if (url.includes('/vendor/earnings')) {
        return {
          summary: {
            totalEarnings: 154300,
            pendingEarnings: 24500,
            paidEarnings: 129800,
            totalCommission: 15430,
            totalOrders: 42
          },
          commissions: []
        };
      }
      if (url.includes('/vendor/products')) {
        return {
          products: [],
          total: 0,
          page: 1,
          pages: 1
        };
      }
      if (url.includes('/uploads/image')) {
        let uploadUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60"; // Default fallback
        if (originalRequest.data instanceof FormData) {
          const file = originalRequest.data.get('image') || originalRequest.data.get('file');
          if (file && (file instanceof File || file instanceof Blob)) {
            try {
              uploadUrl = URL.createObjectURL(file);
              console.log("Mock session - dynamically created local object URL for uploaded image:", uploadUrl);
            } catch (err) {
              console.warn("Failed to create Object URL for mock image upload:", err);
            }
          }
        }
        return {
          statusCode: 201,
          success: true,
          message: "Image uploaded successfully",
          data: {
            url: uploadUrl,
            publicId: `mock_fallback_${Date.now()}`
          }
        };
      }
      if (url.includes('/categories') || url.includes('/admin/categories')) {
        if (!originalRequest.method || originalRequest.method.toLowerCase() === 'get') {
          return {
            statusCode: 200,
            success: true,
            message: "Categories fetched.",
            data: [
              { _id: "cat_mock_1", id: "cat_mock_1", name: "Fashion & Apparel", description: "Clothing, shoes, bags, and fashion accessories.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", parentId: null, isActive: true, order: 1 },
              { _id: "cat_mock_2", id: "cat_mock_2", name: "Electronics & Gadgets", description: "Smartphones, laptops, smart home devices, and gear.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", parentId: null, isActive: true, order: 2 },
              { _id: "cat_mock_3", id: "cat_mock_3", name: "Home & Kitchen", description: "Furniture, decor, kitchenware, and appliances.", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400", parentId: null, isActive: true, order: 3 },
              { _id: "cat_mock_4", id: "cat_mock_4", name: "Men's Clothing", description: "Jackets, t-shirts, jeans, and formal wear for men.", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400", parentId: "cat_mock_1", isActive: true, order: 1 },
              { _id: "cat_mock_5", id: "cat_mock_5", name: "Women's Clothing", description: "Dresses, tops, skirts, and ethnic wear for women.", image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400", parentId: "cat_mock_1", isActive: true, order: 2 }
            ]
          };
        }
        let body = {};
        try {
          body = originalRequest.data ? (typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : originalRequest.data) : {};
        } catch {
          body = {};
        }
        return {
          statusCode: 201,
          success: true,
          message: "Category saved successfully",
          data: {
            _id: body._id || `cat_mock_${Date.now()}`,
            id: body.id || `cat_mock_${Date.now()}`,
            name: body.name || "Mock Category",
            description: body.description || "",
            image: body.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
            parentId: body.parentId || null,
            isActive: body.isActive !== undefined ? body.isActive : true,
            order: Number(body.order) || 0
          }
        };
      }
      if (url.includes('/notifications')) {
        return {
          statusCode: 200,
          success: true,
          message: "Notifications fetched",
          data: {
            notifications: [
              { _id: "not_mock_1", id: "not_mock_1", title: "New Vendor Registration", message: "Ankit Fashion Hub has registered and is awaiting review.", isRead: false, createdAt: new Date().toISOString() },
              { _id: "not_mock_2", id: "not_mock_2", title: "Product Stock Warning", message: "Product 'White Watch' is low in stock.", isRead: true, createdAt: new Date().toISOString() }
            ],
            total: 2,
            page: 1,
            pages: 1
          }
        };
      }
      return { success: true, data: {} };
    }

    if (shouldAttemptRefresh(error, scope)) {
      try {
        const nextAccessToken = await runRefresh(scope);
        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return api(originalRequest);
      } catch {
        // fallback to existing session-expired handling below
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    toast.error(message);

    if (error.response?.status === 401) {
      const activeScope = pathScope;
      await clearScopeAuth(scope);
      if (scope !== activeScope) {
        return Promise.reject(error);
      }

      const routeConfig = AUTH_SCOPES[scope];
      if (scope === 'user') {
        const isAuthPage =
          currentPath === '/login' ||
          currentPath === '/register' ||
          currentPath === '/verification' ||
          currentPath === '/forgot-password' ||
          currentPath === '/reset-password';
        if (!isAuthPage) {
          redirectTo(routeConfig.loginPath);
        }
      } else if (currentPath.startsWith(routeConfig.areaPrefix) && currentPath !== routeConfig.loginPath) {
        toast.error('Session expired. Please login again.');
        redirectTo(routeConfig.loginPath);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
