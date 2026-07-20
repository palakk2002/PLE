import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

/**
 * Wrapper component that forces remounting when location changes
 * This ensures React Router properly updates components on navigation
 */
const RouteWrapper = ({ children }) => {
  const location = useLocation();
  const [catalogTick, setCatalogTick] = useState(0);

  useEffect(() => {
    const onCatalogUpdate = () => setCatalogTick((prev) => prev + 1);
    window.addEventListener('catalog-cache-updated', onCatalogUpdate);
    return () => {
      window.removeEventListener('catalog-cache-updated', onCatalogUpdate);
    };
  }, []);

  useEffect(() => {
    // 1. Instant scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Microtask delay scroll reset to handle async renders/animations
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Track valid history to support safe back navigation
  useEffect(() => {
    const currentPath = location.pathname.toLowerCase();
    const isAuthOrPortal = 
      currentPath === '/' ||
      currentPath === '/login' ||
      currentPath === '/register' ||
      currentPath === '/verification' ||
      currentPath === '/portal' ||
      currentPath.startsWith('/portal/') ||
      currentPath.startsWith('/b2b/login') ||
      currentPath.startsWith('/b2b/register');

    if (!isAuthOrPortal) {
      const prev = sessionStorage.getItem('currentPath');
      // Only set previous path if it's a valid application page (non-auth, non-portal)
      if (prev && prev !== location.pathname) {
        sessionStorage.setItem('prevPath', prev);
      }
      sessionStorage.setItem('currentPath', location.pathname);
    }
  }, [location.pathname]);
  
  // Return children with location key to force remount on route change
  // For home page, we don't want search parameter changes to force a remount (this breaks tab animations)
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const key = isHomePage 
    ? location.pathname
    : `${location.pathname}${location.search}`;

  return <div key={key} style={{ width: '100%', height: '100%' }}>{children}</div>;
};

export default RouteWrapper;

