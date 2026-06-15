import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { FiEdit3 } from 'react-icons/fi';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import DesktopFooter from './DesktopFooter';
import MobileBottomNav from './MobileBottomNav';
import MobileCartBar from './MobileCartBar';
import CartDrawer from '../../../../shared/components/Cart/CartDrawer';
import useMobileHeaderHeight from '../../hooks/useMobileHeaderHeight';
import { useUIStore } from '../../../../shared/store/useStore';

const MobileLayout = ({ children, showBottomNav = true, showCartBar = true }) => {
  const location = useLocation();
  const headerHeight = useMobileHeaderHeight();

  // Hide header and bottom nav on login, register, and verification pages
  const isAuthPage = location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/verification';

  const isCheckoutPage = location.pathname === '/checkout';
  const isReturnsPage = location.pathname === '/returns';
  const isLocationSelectorOpen = useUIStore((state) => state.isLocationSelectorOpen);
  
  // Respect the showBottomNav prop and hide on auth pages or when location selector is open
  const shouldShowBottomNav = showBottomNav && !isAuthPage && !isLocationSelectorOpen;
  // Hide header on categories, search, wishlist, profile, returns, and auth pages
  const shouldShowHeader = !isAuthPage &&
    location.pathname !== '/categories' &&
    location.pathname !== '/search' &&
    location.pathname !== '/wishlist' &&
    location.pathname !== '/profile' &&
    location.pathname !== '/orders' &&
    !isReturnsPage &&
    !isCheckoutPage;

  // Ensure body scroll is restored when component mounts
  useEffect(() => {
    document.body.style.overflowY = '';
    return () => {
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <>
      {!isAuthPage && !isCheckoutPage && !isReturnsPage && <DesktopHeader />}
      {shouldShowHeader && <MobileHeader />}
      <main
        className={`min-h-screen w-full overflow-x-hidden md:container md:mx-auto md:px-12 lg:px-24 xl:px-40 ${shouldShowBottomNav ? 'pb-20' : ''} ${showCartBar ? 'pb-24' : ''}`}
        style={{ paddingTop: shouldShowHeader ? `${headerHeight}px` : '0px' }}
      >
        {children}
      </main>
      {!isAuthPage && !isCheckoutPage && <DesktopFooter />}
      {shouldShowBottomNav && <MobileBottomNav />}
      <CartDrawer />

      {!isAuthPage && !isCheckoutPage && createPortal(
        <Link
          to="/product-request/new"
          className="fixed right-4 z-[9998] safe-area-bottom px-5 py-3 rounded-full text-white shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-[0.95] transition-all duration-300 group font-bold text-xs"
          style={{ 
            bottom: location.pathname.startsWith('/product/') ? "calc(6.5rem + 10px)" : "calc(4rem + 10px)",
            background: "linear-gradient(135deg, #9B1C1C 0%, #7B0A0A 50%, #4C0505 100%)"
          }}
          title="Can't find a product? Request it!"
        >
          <FiEdit3 className="text-sm shrink-0" />
          <span>Request Product</span>
        </Link>,
        document.body
      )}
    </>
  );
};

export default MobileLayout;


