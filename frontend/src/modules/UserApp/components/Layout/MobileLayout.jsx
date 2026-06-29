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

  const pathname = location.pathname.toLowerCase();

  // Hide header and bottom nav on login, register, and verification pages
  const isAuthPage = pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/verification';

  const isCheckoutPage = pathname === '/checkout';
  const isOrderConfirmationPage = pathname.startsWith('/order-confirmation');
  const isTrackOrderPage = pathname.startsWith('/track-order');
  const isLocationSelectorOpen = useUIStore((state) => state.isLocationSelectorOpen);

  const isProfileOptionPage = 
    pathname === '/profile' ||
    pathname === '/orders' ||
    pathname.startsWith('/orders/') ||
    pathname === '/returns' ||
    pathname.startsWith('/returns/') ||
    pathname === '/wishlist' ||
    pathname === '/addresses' ||
    pathname === '/notifications' ||
    pathname === '/wallet' ||
    pathname === '/settings' ||
    pathname === '/help-support' ||
    pathname === '/support-tickets' ||
    pathname.startsWith('/support-chat/') ||
    pathname.startsWith('/product-requests') ||
    pathname.startsWith('/product-request/') ||
    pathname.startsWith('/rfq/') ||
    pathname === '/privacy-policy' ||
    pathname === '/terms-and-conditions' ||
    pathname === '/user-agreement' ||
    pathname === '/return-policy' ||
    pathname === '/about-us';
  
  // Respect the showBottomNav prop and hide on auth pages or when location selector is open
  const shouldShowBottomNav = showBottomNav && !isAuthPage && !isLocationSelectorOpen;
  // Hide header on categories, search, wishlist, profile, returns, order confirmation, track order, and auth pages
  const shouldShowHeader = !isAuthPage &&
    pathname !== '/categories' &&
    pathname !== '/search' &&
    !isProfileOptionPage &&
    !isCheckoutPage &&
    !isOrderConfirmationPage &&
    !isTrackOrderPage;

  // Ensure body scroll is restored when component mounts
  useEffect(() => {
    document.body.style.overflowY = '';
    return () => {
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <>
      {!isAuthPage && !isCheckoutPage && !isProfileOptionPage && !isOrderConfirmationPage && !isTrackOrderPage && <DesktopHeader />}
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
            bottom: pathname.startsWith('/product/') ? "calc(6.5rem + 10px)" : "calc(4rem + 10px)",
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


