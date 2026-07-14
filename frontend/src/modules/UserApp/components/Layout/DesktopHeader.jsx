import { Link, useNavigate } from "react-router-dom";
import { useCartStore, useUIStore } from "../../../../shared/store/useStore";
import { useWishlistStore } from "../../../../shared/store/wishlistStore";
import { useAuthStore } from "../../../../shared/store/authStore";
import appLogoBlack from "../../../../assets/PLELOGOBLACK-removebg-preview (1).png";
import appLogoWhite from "../../../../assets/PLEwhite-removebg-preview (3).png";

import SearchBar from "../../../../shared/components/SearchBar";
import { FiHeart, FiShoppingBag, FiUser, FiLogOut, FiGrid, FiBell, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import Sidebar from '../../../../shared/components/Sidebar';
import { HiOutlineUserCircle } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
// isSidebarOpen state moved inside component
import { motion, AnimatePresence } from "framer-motion";
import { useUserNotificationStore } from "../../store/userNotificationStore";
import { useThemeStore } from "../../../../shared/store/themeStore"; // needed for conditional logo

import { useCampaignStore } from "../../../../shared/store/campaignStore";

const DesktopHeader = () => {
    const { theme, toggleTheme } = useThemeStore();
    const appLogo = {
        src: (theme === "dark" ? appLogoBlack : appLogoWhite),
        alt: "PLE Logo",
    };
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const itemCount = useCartStore((state) => state.getItemCount());
    const wishlistCount = useWishlistStore((state) => state.getItemCount());
    const unreadCount = useUserNotificationStore((state) => state.unreadCount);
    const ensureHydrated = useUserNotificationStore((state) => state.ensureHydrated);
    const toggleCart = useUIStore((state) => state.toggleCart);

    const { campaigns, initialize } = useCampaignStore();
    useEffect(() => {
        initialize();
    }, [initialize]);

    const activeFestivalCampaign = campaigns.find(c => {
        if (c.type !== 'festival' || !c.isActive) return false;
        const now = new Date();
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        return start <= now && end >= now;
    });

    const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        ensureHydrated();
    }, [ensureHydrated, isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate("/");
    };

    return (
        <header className="hidden md:block sticky top-0 z-[999] bg-[#ffffff] dark:!bg-black shadow-sm border-b border-gray-100 dark:!border-black">
            <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between gap-4 lg:gap-8">
                {/* Logo */}
                <Link to="/home" className="flex-shrink-0 flex items-center gap-2">
                    {appLogo.src ? (
                        <div className="relative">
                            <img
                                src={appLogo.src}
                                alt={appLogo.alt}
                                className="h-14 w-auto object-contain"
                                style={{ mixBlendMode: theme === "dark" ? "screen" : "multiply" }}
                            />
                            {theme !== "dark" && (
                                <span 
                                    className="absolute text-[5px] font-normal text-[#7B0A0A]" 
                                    style={{ right: '4.5px', bottom: '17px' }}
                                >
                                    TM
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-[#7B0A0A]">PLE</span>
                    )}
                </Link>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="hidden md:block p-2 text-gray-600 dark:text-gray-300 hover:text-[#7B0A0A] dark:hover:text-[#FF4D4D] transition-colors"
                  aria-label="Menu"
                >
                  <FiMenu className="text-2xl" />
                </button>

                {/* Navigation Links */}
                <nav className="hidden xl:flex items-center gap-6">
                    <Link to="/home" className="text-gray-600 dark:text-gray-300 hover:text-[#7B0A0A] dark:hover:text-[#FF4D4D] font-medium text-sm lg:text-base">Home</Link>
                    <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-[#7B0A0A] dark:hover:text-[#FF4D4D] font-medium text-sm lg:text-base flex items-center gap-1">
                        <FiGrid /> Categories
                    </Link>
                    <Link to="/offers" className="text-gray-600 dark:text-gray-300 hover:text-[#7B0A0A] dark:hover:text-[#FF4D4D] font-medium text-sm lg:text-base">Offers</Link>
                    {activeFestivalCampaign && (
                        <Link to="/festival-campaign" className="text-red-600 dark:text-red-400 hover:text-red-700 font-bold text-sm lg:text-base transition-all animate-pulse flex items-center gap-1">
                            ✨ {activeFestivalCampaign.name}
                        </Link>
                    )}
                    <Link to="/refurbished-categories" className="text-gray-600 dark:text-gray-300 hover:text-[#7B0A0A] dark:hover:text-[#FF4D4D] font-medium text-sm lg:text-base">Refurbished</Link>
                </nav>

                {/* Search Bar */}
                <div className="flex-1 max-w-[200px] sm:max-w-[300px] md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <SearchBar />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5">
                    {/* Cart */}
                    <button
                        onClick={toggleCart}
                        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#7B0A0A] dark:hover:text-[#FF4D4D] transition-colors"
                    >
                        <FiShoppingBag className="text-2xl" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7B0A0A] text-white text-xs font-bold flex items-center justify-center">
                                {itemCount > 9 ? "9+" : itemCount}
                            </span>
                        )}
                    </button>
                    {/* Hamburger Menu */}


                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="relative p-2 text-gray-600 dark:text-[#C8B3A3] hover:text-[#7B0A0A] dark:hover:text-[#D18B4A] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#2A1F1A] focus:outline-none"
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
                                <FiMoon className="text-2xl" />
                            ) : (
                                <FiSun className="text-2xl text-yellow-500 animate-pulse" />
                            )}
                        </motion.div>
                    </button>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div ref={userMenuRef} className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1 lg:p-1.5 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-neutral-800"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <HiOutlineUserCircle className="text-gray-600 dark:text-gray-300 text-3xl" />
                                )}
                                <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user?.name || "User"}</span>
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 bg-white dark:bg-black rounded-xl shadow-xl border border-gray-200 dark:border-neutral-800 p-2 z-[60] min-w-[200px]"
                                    >
                                        <div className="px-3 py-2 border-b border-gray-200 dark:border-neutral-800 mb-2">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-lg transition-colors text-left w-full"
                                        >
                                            <FiUser className="text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Profile</span>
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-lg transition-colors text-left w-full"
                                        >
                                            <FiShoppingBag className="text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Orders</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-left w-full text-red-600 mt-1"
                                        >
                                            <FiLogOut className="text-red-500 dark:text-red-400" />
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 py-2.5 bg-[#7B0A0A] text-white rounded-lg font-medium hover:bg-[#AE020B] transition-colors shadow-sm shadow-red-200">
                            Login
                        </Link>
                    )}
                </div>
                {/* Sidebar */}
                <Sidebar
                  isOpen={isSidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  user={user}
                  onLogout={handleLogout}
                />
            </div>
        </header>
    );
};

export default DesktopHeader;
