import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  FiShoppingBag,
  FiSun,
  FiMoon,
  FiChevronDown,
  FiUser,
  FiSearch,
  FiMenu,
} from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore, useUIStore } from "../../../../shared/store/useStore";
import { useAuthStore } from "../../../../shared/store/authStore";
import { useThemeStore } from "../../../../shared/store/themeStore";
import appLogoBlack from "../../../../assets/PLEblack.png";
import appLogoWhite from "../../../../assets/PLEwhite.png";

import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SearchBar from "../../../../shared/components/SearchBar";
import MobileCategoryIcons from "../Mobile/MobileCategoryIcons";
import Sidebar from "../../../../shared/components/Sidebar";
import { useBusinessBuyer } from "../../hooks/useBusinessBuyer";
import { B2BBusinessBadge } from "../B2B/B2BBusinessBadge";

// Category gradient mapping - Very subtle pastel colors
const categoryGradients = {
  1: "from-pink-50 via-rose-50 to-pink-100", // Clothing - Pinkish
  2: "from-amber-50 via-amber-100 to-yellow-50", // Footwear - Brownish
  3: "from-orange-50 via-orange-100 to-orange-50", // Bags - Orangeish
  4: "from-green-50 via-emerald-50 to-teal-50", // Jewelry - Greenish
  5: "from-purple-50 via-purple-100 to-indigo-50", // Accessories - Purple
  6: "from-blue-50 via-cyan-50 to-teal-50", // Athletic
};

const MobileHeader = () => {
  const { isBusiness } = useBusinessBuyer();
  const { theme, toggleTheme } = useThemeStore();
  const appLogo = {
    src: (theme === "dark" ? appLogoBlack : appLogoWhite),
    alt: "PLE Logo",
  };

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const [positionsReady, setPositionsReady] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [animationPositions, setAnimationPositions] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [isTopRowVisible, setIsTopRowVisible] = useState(true);
  const [topRowHeight, setTopRowHeight] = useState(70);
  const lastScrollYRef = useRef(0);
  const topRowRef = useRef(null);
  const userMenuRef = useRef(null);
  const logoRef = useRef(null);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useUIStore((state) => state.toggleCart);
  const cartAnimationTrigger = useUIStore(
    (state) => state.cartAnimationTrigger
  );
  const { user, isAuthenticated, logout } = useAuthStore();

  // Get current category from URL (supports both /category/:id and legacy /app/category/:id)
  const getCurrentCategoryId = () => {
    const match = location.pathname.match(/\/(?:app\/)?category\/([^/]+)/);
    return match ? String(match[1]) : null;
  };

  const currentCategoryId = getCurrentCategoryId();

  // Get current page from location
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/home") return "home";
    if (path.startsWith("/product/")) return "product";
    if (path.startsWith("/category/")) return "category";
    if (path === "/search") return "search";
    if (path === "/wishlist") return "wishlist";
    if (path === "/profile") return "profile";
    if (path === "/orders") return "orders";
    if (path.startsWith("/orders/")) return "orderDetail";
    if (path === "/checkout") return "checkout";
    if (path === "/offers") return "offers";
    if (path === "/daily-deals") return "dailyDeals";
    if (path === "/flash-sale") return "flashSale";
    if (path.startsWith("/seller/")) return "vendor";
    return "default";
  };

  const currentPage = getCurrentPage();

  // Memoize gradient background style to prevent unnecessary re-renders
  const headerBackground = useMemo(() => {
    if (theme === "dark") {
      if (currentCategoryId) {
        const darkCategoryGradients = {
          1: "linear-gradient(to bottom, #1A0A0A 0%, #110606 50%, #0D0D0D 100%)", // Pinkish dark
          2: "linear-gradient(to bottom, #1A0D0A 0%, #110806 50%, #0D0D0D 100%)", // Amber dark
          3: "linear-gradient(to bottom, #1A0E0A 0%, #110906 50%, #0D0D0D 100%)", // Orange dark
          4: "linear-gradient(to bottom, #0A1A0E 0%, #06110A 50%, #0D0D0D 100%)", // Greenish dark
          5: "linear-gradient(to bottom, #120A1A 0%, #0C0611 50%, #0D0D0D 100%)", // Purple dark
          6: "linear-gradient(to bottom, #0A0E1A 0%, #060911 50%, #0D0D0D 100%)", // Blue dark
        };
        return darkCategoryGradients[currentCategoryId] || "linear-gradient(to bottom, #1A0A0A 0%, #0D0D0D 100%)";
      }

      const pageDarkGradients = {
        home: "linear-gradient(to bottom, #1A0A0A 0%, #140808 30%, #0D0D0D 100%)", // Home red-black
        product: "linear-gradient(to bottom, #1A0A0A 0%, #0D0D0D 100%)",
        search: "linear-gradient(to bottom, #1A0A0A 0%, #110606 50%, #0D0D0D 100%)",
        wishlist: "linear-gradient(to bottom, #200808 0%, #160404 50%, #0D0D0D 100%)",
        profile: "linear-gradient(to bottom, #0A1A0E 0%, #060B09 50%, #0D0D0D 100%)",
        orders: "linear-gradient(to bottom, #0A0E1A 0%, #060911 50%, #0D0D0D 100%)",
        orderDetail: "linear-gradient(to bottom, #0A0E1A 0%, #060911 50%, #0D0D0D 100%)",
        checkout: "linear-gradient(to bottom, #0A1A0E 0%, #060B09 50%, #0D0D0D 100%)",
        offers: "linear-gradient(to bottom, #1A0A0A 0%, #110606 50%, #0D0D0D 100%)",
        dailyDeals: "linear-gradient(to bottom, #1A1200 0%, #110C00 50%, #0D0D0D 100%)",
        flashSale: "linear-gradient(to bottom, #200808 0%, #160404 50%, #0D0D0D 100%)",
        vendor: "linear-gradient(to bottom, #120A1A 0%, #0C0611 50%, #0D0D0D 100%)",
        default: "linear-gradient(to bottom, #1A0A0A 0%, #0D0D0D 100%)",
      };
      return pageDarkGradients[currentPage] || pageDarkGradients.default;
    }

    // Category pages - keep existing category-specific gradients
    if (currentCategoryId) {
      const gradientMap = {
        1: "linear-gradient(to bottom, rgb(252, 231, 243) 0%, rgb(255, 240, 245) 50%, rgb(255, 255, 255) 100%)", // Pink - moderate
        2: "linear-gradient(to bottom, rgb(254, 243, 199) 0%, rgb(255, 248, 220) 50%, rgb(255, 255, 255) 100%)", // Brown/Amber - moderate
        3: "linear-gradient(to bottom, rgb(255, 237, 213) 0%, rgb(255, 245, 230) 50%, rgb(255, 255, 255) 100%)", // Orange - moderate
        4: "linear-gradient(to bottom, rgb(209, 250, 229) 0%, rgb(236, 253, 245) 50%, rgb(255, 255, 255) 100%)", // Green - moderate
        5: "linear-gradient(to bottom, rgb(243, 232, 255) 0%, rgb(250, 245, 255) 50%, rgb(255, 255, 255) 100%)", // Purple - moderate
        6: "linear-gradient(to bottom, rgb(219, 234, 254) 0%, rgb(239, 246, 255) 50%, rgb(255, 255, 255) 100%)", // Blue - moderate
      };
      return (
        gradientMap[currentCategoryId] ||
        "linear-gradient(to bottom, #EDE9FE 0%, #F5F3FF 50%, #FFFFFF 100%)"
      );
    }

    // Page-specific gradients
    const pageGradients = {
      home: "linear-gradient(to bottom, #E8D5FF 0%, #E8D5FF 100%)", // Lavender background
      product:
        "linear-gradient(to bottom, rgb(237, 233, 254) 0%, rgb(245, 243, 255) 50%, rgb(255, 255, 255) 100%)", // Light purple
      search:
        "linear-gradient(to bottom, rgb(249, 115, 22) 0%, rgb(251, 146, 60) 30%, rgb(255, 237, 213) 60%, rgb(255, 255, 255) 100%)", // Orange gradient
      wishlist:
        "linear-gradient(to bottom, rgb(239, 68, 68) 0%, rgb(248, 113, 113) 30%, rgb(254, 226, 226) 60%, rgb(255, 255, 255) 100%)", // Red/pink gradient
      profile:
        "linear-gradient(to bottom, rgb(16, 185, 129) 0%, rgb(52, 211, 153) 30%, rgb(209, 250, 229) 60%, rgb(255, 255, 255) 100%)", // Green gradient
      orders:
        "linear-gradient(to bottom, rgb(59, 130, 246) 0%, rgb(96, 165, 250) 30%, rgb(219, 234, 254) 60%, rgb(255, 255, 255) 100%)", // Blue gradient
      orderDetail:
        "linear-gradient(to bottom, rgb(59, 130, 246) 0%, rgb(96, 165, 250) 30%, rgb(219, 234, 254) 60%, rgb(255, 255, 255) 100%)", // Blue gradient
      checkout:
        "linear-gradient(to bottom, rgb(16, 185, 129) 0%, rgb(52, 211, 153) 30%, rgb(209, 250, 229) 60%, rgb(255, 255, 255) 100%)", // Green gradient
      offers: "linear-gradient(to bottom, #E8D5FF 0%, #E8D5FF 100%)", // Lavender background
      dailyDeals:
        "linear-gradient(to bottom, rgb(234, 179, 8) 0%, rgb(250, 204, 21) 30%, rgb(254, 243, 199) 60%, rgb(255, 255, 255) 100%)", // Yellow gradient
      flashSale:
        "linear-gradient(to bottom, rgb(239, 68, 68) 0%, rgb(248, 113, 113) 30%, rgb(254, 226, 226) 60%, rgb(255, 255, 255) 100%)", // Red gradient
      vendor:
        "linear-gradient(to bottom, rgb(124, 58, 237) 0%, rgb(167, 139, 250) 30%, rgb(237, 233, 254) 60%, rgb(255, 255, 255) 100%)", // Purple gradient
      default:
        "linear-gradient(to bottom, rgb(237, 233, 254) 0%, rgb(245, 243, 255) 50%, rgb(255, 255, 255) 100%)", // Light purple default
    };

    return pageGradients[currentPage] || pageGradients.default;
  }, [currentCategoryId, currentPage, location.pathname, theme]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Measure top row height
  useEffect(() => {
    const measureTopRow = () => {
      if (topRowRef.current) {
        const height = topRowRef.current.offsetHeight;
        setTopRowHeight(height);
      }
    };

    measureTopRow();
    window.addEventListener("resize", measureTopRow);
    return () => window.removeEventListener("resize", measureTopRow);
  }, []);

  // Handle scroll to hide/show top row with smooth throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;

          // Show top row when at top or scrolling up
          if (currentScrollY < 10) {
            setIsTopRowVisible(true);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show top row
            setIsTopRowVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down and past threshold - hide top row
            setIsTopRowVisible(false);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate animation positions after component mounts
  useEffect(() => {
    const calculatePositions = () => {
      if (logoRef.current && cartRef.current) {
        const logoRect = logoRef.current.getBoundingClientRect();
        const cartRect = cartRef.current.getBoundingClientRect();

        const positions = {
          startX: logoRect.left + logoRect.width / 2,
          startY: logoRect.top + logoRect.height / 2,
          endX: cartRect.left + cartRect.width / 2,
          endY: cartRect.top + cartRect.height / 2,
        };

        // Only set positions if they're valid and animation hasn't played yet
        if (
          positions.startX > 0 &&
          positions.endX > 0 &&
          positions.startY > 0 &&
          positions.endY > 0 &&
          !hasPlayed
        ) {
          setAnimationPositions(positions);
          setPositionsReady(true);
          // Start animation once positions are ready
          setShowCartAnimation(true);
          setHasPlayed(true);
        }
      }
    };

    // Calculate positions after delays to ensure elements are rendered
    const timer1 = setTimeout(calculatePositions, 100);
    const timer2 = setTimeout(calculatePositions, 500);
    const timer3 = setTimeout(calculatePositions, 1000);

    // Recalculate on resize
    window.addEventListener("resize", calculatePositions);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", calculatePositions);
    };
  }, [hasPlayed]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  // Animation content - straight line movement only, starting from behind logo
  const shouldShowAnimation =
    showCartAnimation &&
    positionsReady &&
    animationPositions.startX > 0 &&
    animationPositions.endX > 0;

  const animationContent = shouldShowAnimation ? (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        left: 0,
        top: 0,
        zIndex: 10000, // Above navbar but will be behind logo due to stacking context
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      initial={{
        x: animationPositions.startX - 24,
        y: animationPositions.startY - 24,
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        x: animationPositions.endX - 24,
        y: animationPositions.endY - 24,
        scale: [0.8, 1, 1.05, 0.95],
        opacity: [0, 1, 1, 0.8, 0],
      }}
      transition={{
        duration: 4,
        ease: [0.25, 0.1, 0.25, 1],
        times: [0, 0.1, 0.7, 0.9, 1],
        type: "tween",
      }}
      onAnimationComplete={() => {
        setShowCartAnimation(false);
      }}>
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/083a2680-e854-4006-a50b-674276be82cd/oQMRcuZUkS.lottie"
          autoplay
          loop={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </motion.div>
  ) : null;

  const headerContent = (
    <motion.header
      key="mobile-header" // Stable key to prevent re-mounting
      className="fixed top-0 left-0 right-0 z-[9999] shadow-none overflow-visible md:hidden"
      style={{
        background: headerBackground,
        transition: "background 0.5s ease-in-out",
      }}
      initial={false}
      animate={{
        y: isTopRowVisible ? 0 : -(topRowHeight + 12),
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}>
      <div className="px-4 py-3 overflow-visible">
        {/* First Row: Location & Actions */}
        <motion.div
          ref={topRowRef}
          className="flex items-center justify-between gap-3 mb-2"
          initial={false}
          animate={{
            opacity: isTopRowVisible ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
            mass: 0.6,
          }}
          style={{
            pointerEvents: isTopRowVisible ? "auto" : "none",
          }}>
          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-white/30 dark:hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-800 dark:text-[#FFFFFF] flex items-center justify-center flex-shrink-0"
            title="Menu">
            <FiMenu className="text-2xl" />
          </button>

          {/* Static Location Time and Address */}
          <div className="flex items-center gap-2 flex-shrink-0 overflow-visible relative z-[10001] max-w-[60%]">
            <div className="flex flex-col text-left">
              <span className="font-black text-[#111827] dark:text-[#FFFFFF] text-base leading-tight flex items-center gap-1 uppercase tracking-tight select-none">
                ⚡ 10 minutes
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-[#AAAAAA] flex items-center gap-0.5 truncate cursor-pointer mt-0.5">
                Police Quarters, Belgaum
                <FiChevronDown className="text-xs text-gray-500 mt-0.5 flex-shrink-0" />
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 text-gray-700 dark:text-[#AAAAAA] focus:outline-none"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <motion.div
                key={theme}
                initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.6, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {theme === "light" ? (
                  <FiMoon className="text-xl text-gray-700" />
                ) : (
                  <FiSun className="text-xl text-yellow-500" />
                )}
              </motion.div>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-[#AAAAAA] flex items-center justify-center"
              title="Profile"
            >
              <FiUser className="text-xl" />
            </button>

            {/* Cart Button */}
            <motion.button
              ref={cartRef}
              data-cart-icon
              onClick={toggleCart}
              className="relative p-2 hover:bg-white/50 rounded-full transition-all duration-300"
              animate={
                cartAnimationTrigger > 0
                  ? {
                    scale: [1, 1.2, 1],
                  }
                  : {}
              }
              transition={{ duration: 0.5, ease: "easeOut" }}>
              <FiShoppingBag className="text-xl text-gray-700 dark:text-[#AAAAAA]" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: "#ffc101" }}>
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Second Row: 3 Premium Navigation Capsule Tabs (Zepto-style) */}
        <div className="flex items-center justify-between gap-2.5 mt-2 w-full relative z-[10006]">
          {[
            {
              label: "ple",
              path: "/home",
              active:
                location.pathname === "/" ||
                location.pathname === "/home" ||
                location.pathname.startsWith("/product/") ||
                location.pathname.startsWith("/brand/") ||
                location.pathname.startsWith("/seller/"),
              style: {
                activeLight: "bg-white border border-[#7C3AED] text-[#7C3AED] font-extrabold text-sm tracking-tight lowercase shadow-sm",
                activeDark: "bg-[#7B0A0A] border border-[#7B0A0A] text-white font-extrabold text-sm tracking-tight lowercase shadow-sm",
                inactiveLight: "bg-white border border-gray-200 text-gray-400 font-semibold text-sm tracking-tight lowercase",
                inactiveDark: "bg-[#1A1A1A] border border-[#7B0A0A] text-white font-semibold text-sm tracking-tight lowercase",
              }
            },
            {
              label: "Categories",
              path: "/categories",
              active: location.pathname === "/categories" || location.pathname.startsWith("/category/"),
              style: {
                activeLight: "bg-white border border-[#2563EB] text-[#2563EB] font-bold text-xs tracking-tight shadow-sm",
                activeDark: "bg-[#7B0A0A] border border-[#7B0A0A] text-white font-bold text-xs tracking-tight shadow-sm",
                inactiveLight: "bg-white border border-gray-200 text-gray-400 font-semibold text-xs tracking-tight",
                inactiveDark: "bg-[#1A1A1A] border border-[#7B0A0A] text-white font-semibold text-xs tracking-tight",
              }
            },
            {
              label: "Offer",
              path: "/offers",
              active: location.pathname === "/offers",
              style: {
                activeLight: "bg-[#FCD34D] border border-[#FBBF24] text-[#064E3B] font-serif font-black text-xs uppercase tracking-wider shadow-sm",
                activeDark: "bg-[#7B0A0A] border border-[#7B0A0A] text-white font-black text-xs uppercase tracking-wider shadow-sm",
                inactiveLight: "bg-white border border-gray-200 text-gray-400 font-semibold text-xs uppercase tracking-wider",
                inactiveDark: "bg-[#1A1A1A] border border-[#7B0A0A] text-white font-semibold text-xs uppercase tracking-wider",
              }
            },
          ].map((tab) => {
            return (
              <Link
                key={tab.label}
                to={tab.path}
                className={`flex-1 text-center py-2 px-3 rounded-full transition-all duration-300 cursor-pointer select-none
                  ${theme === "dark" 
                    ? (tab.active ? tab.style.activeDark : tab.style.inactiveDark) 
                    : (tab.active ? tab.style.activeLight : tab.style.inactiveLight)
                  }
                  ${tab.active ? "opacity-100 scale-100" : "opacity-75 hover:opacity-100 scale-100"}
                `}
                style={{
                  willChange: "transform",
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Third Row: Single Integrated Search & Offers Bar (Zepto-style) */}
        <div className="flex items-center justify-between w-full bg-white dark:bg-[#1A1A1A] rounded-full border border-gray-200 dark:border-white/5 pl-4 pr-3.5 py-2 mt-2 relative z-[10007] shadow-sm select-none">
          {/* Left Side: Search trigger */}
          <div
            onClick={() => navigate("/search")}
            className="flex-grow flex items-center gap-2 cursor-pointer min-w-0"
          >
            <FiSearch className="text-gray-400 text-base flex-shrink-0" />
            <span className="text-xs text-gray-400 font-semibold truncate">
              Search for "Earphones"
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-3 flex-shrink-0" />

          {/* Right Side: Get Offers Action */}
          <div 
            onClick={() => navigate("/offers")}
            className="flex-shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-xl select-none">🎁</span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                Get
              </span>
              <span className="text-[10px] font-black text-[#7C3AED] dark:text-[#7B0A0A] tracking-tight">
                Offers
              </span>
            </div>
          </div>
        </div>


      </div>
    </motion.header>
  );

  // Use portal to render outside of transformed containers (like PageTransition)
  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(headerContent, document.body)}
      {typeof document !== "undefined" &&
        createPortal(animationContent, document.body)}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default MobileHeader;
