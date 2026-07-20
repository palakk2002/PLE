// API Configuration
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getApiUrl();
export const AUTH_REDIRECT_LOCK_KEY = import.meta.env.VITE_AUTH_REDIRECT_LOCK_KEY || 'auth-redirect-lock';
export const AUTH_REDIRECT_LOCK_MS = Number(import.meta.env.VITE_AUTH_REDIRECT_LOCK_MS || 1500);

// App Constants
export const APP_NAME = 'Appzeto multi vendor E-commerce';
export const APP_DESCRIPTION = 'Multi Vendor E-commerce Platform';

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 0.8,
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

