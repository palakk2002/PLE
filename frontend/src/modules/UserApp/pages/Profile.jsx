import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
  FiCamera,
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiLogOut,
  FiChevronRight,
  FiBell,
  FiBriefcase,
  FiTrendingUp,
  FiFileText,
  FiHelpCircle,
  FiTag,
  FiStar,
  FiMessageSquare,
  FiHeart,
} from "react-icons/fi";

// Offers System Imports
import { useOffers } from "../../offers/hooks/useOffers";
import OfferCard from "../../offers/components/OfferCard";
import OfferModal from "../../offers/components/OfferModal";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/Layout/MobileLayout";
import { useAuthStore } from "../../../shared/store/authStore";
import { isValidEmail, isValidPhone } from "../../../shared/utils/helpers";
import toast from "react-hot-toast";
import PageTransition from "../../../shared/components/PageTransition";
import PasswordStrengthMeter from "../components/Mobile/PasswordStrengthMeter";
import { useUserNotificationStore } from "../store/userNotificationStore";
import { useWishlistStore } from "../../../shared/store/wishlistStore";
import { useBusinessBuyer } from "../hooks/useBusinessBuyer";
import { B2BBusinessBadge } from "../components/B2B/B2BBusinessBadge";
import { B2BBusinessDashboard } from "../components/B2B/B2BBusinessDashboard";
import { B2BMyEnquiries } from "../components/B2B/B2BMyEnquiries";

const MobileProfile = () => {
  const navigate = useNavigate();
  const { isBusiness, setUserRole } = useBusinessBuyer();
  const {
    user,
    updateProfile,
    uploadProfileAvatar,
    changePassword,
    logout,
    isLoading,
  } = useAuthStore();
  const avatarInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("menu"); // 'menu', 'personal', 'password'
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const unreadNotificationCount = useUserNotificationStore(
    (state) => state.unreadCount,
  );
  const wishlistCount = useWishlistStore((state) => state.getItemCount());
  const ensureNotificationHydrated = useUserNotificationStore(
    (state) => state.ensureHydrated,
  );

  // Offers Tab State
  const [selectedOfferSubTab, setSelectedOfferSubTab] = useState("active");
  const [selectedProfileOffer, setSelectedProfileOffer] = useState(null);
  const { offers } = useOffers();
  const profileOffers = Array.isArray(offers) ? offers : [];

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const filteredProfileOffers = useMemo(() => {
    return profileOffers.filter((offer) => {
      if (!offer) return false;
      if (selectedOfferSubTab === "active") {
        return offer.isActive && offer.status === "Active";
      } else if (selectedOfferSubTab === "expired") {
        return offer.status === "Expired";
      } else if (selectedOfferSubTab === "upcoming") {
        return offer.status === "Scheduled";
      }
      return true;
    });
  }, [profileOffers, selectedOfferSubTab]);

  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    reset: resetPersonal,
    formState: { errors: personalErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      age: user?.age || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const newPassword = watch("newPassword");

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop && activeTab === "menu") {
      setActiveTab("personal");
    }
  }, [isDesktop, activeTab]);

  useEffect(() => {
    resetPersonal({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      age: user?.age || "",
    });
  }, [user, resetPersonal]);

  useEffect(() => {
    ensureNotificationHydrated();
  }, [ensureNotificationHydrated]);

  const onPersonalSubmit = async (data) => {
    try {
      await updateProfile({
        name: data?.name,
        phone: data?.phone,
        gender: data?.gender,
        age: data?.age,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("Password changed successfully!");
      resetPassword();
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
    toast.success("Logged out successfully");
  };

  const handleDeleteAccount = async () => {
    try {
      toast.success("Account deleted successfully!");
      setShowDeleteConfirm(false);
      handleLogout();
    } catch (e) {
      toast.error("Failed to delete account");
    }
  };

  const handleAvatarPick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ].includes(file.type);
    if (!isValidType) {
      toast.error("Only JPEG, PNG, WEBP and GIF images are allowed.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5MB or less.");
      event.target.value = "";
      return;
    }

    try {
      await uploadProfileAvatar(file);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to upload profile picture");
    } finally {
      event.target.value = "";
    }
  };

  const menuOptions = [
    {
      id: "personal",
      label: "Personal Information",
      icon: FiUser,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    ...(isBusiness
      ? [
          {
            id: "enquiries",
            label: "My Enquiries",
            icon: FiFileText,
            color: "text-primary-600",
            bg: "bg-primary-50",
          },
        ]
      : []),
    {
      id: "orders",
      label: "My Orders",
      icon: FiPackage,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "/orders",
    },
    {
      id: "addresses",
      label: "My Addresses",
      icon: FiMapPin,
      color: "text-green-600",
      bg: "bg-green-50",
      link: "/addresses",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: FiBell,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      link: "/notifications",
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null,
    },
    {
      id: "wishlist",
      label: "My Wishlist",
      icon: FiHeart,
      color: "text-red-500",
      bg: "bg-red-50",
      link: "/wishlist",
      badge: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      id: "offers",
      label: "My Offers",
      icon: FiTag,
      color: "text-[#C07A3D]",
      bg: "bg-[#C07A3D]/10",
    },
    {
      id: "password",
      label: "Change Password",
      icon: FiLock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: FiHelpCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/help-support",
    },
    {
      id: "feedback",
      label: "Give Feedback",
      icon: FiMessageSquare,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  const legalOptions = [
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: FiFileText,
      color: "text-[#7B0A0A]",
      bg: "bg-red-50",
      link: "/privacy-policy",
    },
    {
      id: "terms",
      label: "Terms & Conditions",
      icon: FiFileText,
      color: "text-[#7B0A0A]",
      bg: "bg-red-50",
      link: "/terms-and-conditions",
    },
    {
      id: "agreement",
      label: "User Agreement",
      icon: FiFileText,
      color: "text-[#7B0A0A]",
      bg: "bg-red-50",
      link: "/user-agreement",
    },
    {
      id: "return",
      label: "Return Policy",
      icon: FiFileText,
      color: "text-[#7B0A0A]",
      bg: "bg-red-50",
      link: "/return-policy",
    },
  ];

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full pb-24 lg:pb-12 max-w-7xl mx-auto min-h-screen bg-gray-50">
          {/* Desktop Header */}
          <div className="hidden lg:block px-4 py-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
              >
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500 mt-1">
                  Manage your personal information and security settings
                </p>
              </div>
            </div>
          </div>

          <div className="lg:hidden px-4 py-4 bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  activeTab === "menu" ? navigate(-1) : setActiveTab("menu")
                }
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {activeTab === "menu"
                  ? "My Account"
                  : activeTab === "personal"
                    ? "Personal Info"
                    : activeTab === "password"
                      ? "Security"
                      : activeTab === "offers"
                        ? "My Offers"
                        : activeTab === "feedback"
                          ? "Give Feedback"
                          : "My Account"}
              </h1>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:px-4">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm sticky top-24">
                <div className="p-2 space-y-1">
                  {menuOptions.map((option) => {
                    const isActive = activeTab === option.id;
                    const baseStyle = `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left font-medium text-sm`;
                    const activeStyle = option.id === "offers"
                      ? "bg-[#C07A3D]/10 text-[#C07A3D]"
                      : "bg-primary-50 text-primary-700";
                    const inactiveStyle = "text-gray-600 hover:bg-gray-50";
                    const className = `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`;

                    const content = (
                      <div className="flex items-center gap-3">
                        <option.icon className="text-lg" />
                        <span>{option.label}</span>
                      </div>
                    );

                    const rightElement = option.badge ? (
                      <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {option.badge > 99 ? "99+" : option.badge}
                      </span>
                    ) : null;

                    if (option.link) {
                      return (
                        <Link key={option.id} to={option.link} className={className}>
                          {content}
                          {rightElement}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setActiveTab(option.id)}
                        className={className}
                      >
                        {content}
                        {rightElement}
                      </button>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Legal & Policies
                    </p>
                    {legalOptions.map((option) => (
                      <Link
                        key={option.id}
                        to={option.link}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left font-semibold text-gray-600 hover:bg-gray-50 text-sm"
                      >
                        <option.icon className="text-base text-gray-400" />
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-4 py-4 lg:p-0 lg:col-span-9">
              {/* Dashboard Menu (Mobile Only) */}
              {!isDesktop && activeTab === "menu" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="lg:hidden space-y-6"
                >
                  {/* User Profile Summary Card */}
                  <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full gradient-green flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user?.name || "User"}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-800 mb-1">
                      {user?.name}
                    </h2>
                    <p className="text-gray-500 text-sm mb-2 font-medium">
                      {user?.email}
                    </p>

                    {/* B2B Business Account Badge */}
                    <B2BBusinessBadge className="mb-4" />

                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => setActiveTab("personal")}
                        className="flex-1 py-3 rounded-xl bg-primary-50 text-primary-600 font-bold text-sm border border-primary-100"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  {/* B2B Business Dashboard Panel */}
                  <B2BBusinessDashboard />

                  {/* Menu Options */}
                  <div className="space-y-3">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Account Settings
                    </p>
                    <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-50 shadow-sm border border-gray-100">
                      {menuOptions.map((option) =>
                        option.link ? (
                          <Link
                            key={option.id}
                            to={option.link}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-xl ${option.bg} ${option.color} flex items-center justify-center`}
                              >
                                <option.icon className="text-lg" />
                              </div>
                              <span className="font-bold text-gray-700 text-sm">
                                {option.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {option.badge ? (
                                <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                  {option.badge > 99 ? "99+" : option.badge}
                                </span>
                              ) : null}
                              <FiChevronRight className="text-gray-400" />
                            </div>
                          </Link>
                        ) : (
                          <button
                            key={option.id}
                            onClick={() => setActiveTab(option.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-xl ${option.bg} ${option.color} flex items-center justify-center`}
                              >
                                <option.icon className="text-lg" />
                              </div>
                              <span className="font-bold text-gray-700 text-sm">
                                {option.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {option.badge ? (
                                <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                  {option.badge > 99 ? "99+" : option.badge}
                                </span>
                              ) : null}
                              <FiChevronRight className="text-gray-400" />
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Legal & Policies Options */}
                  <div className="space-y-3">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Legal & Policies
                    </p>
                    <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-50 shadow-sm border border-gray-100">
                      {legalOptions.map((option) => (
                        <Link
                          key={option.id}
                          to={option.link}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl ${option.bg} ${option.color} flex items-center justify-center`}
                            >
                              <option.icon className="text-lg" />
                            </div>
                            <span className="font-bold text-gray-700 text-sm">
                              {option.label}
                            </span>
                          </div>
                          <FiChevronRight className="text-gray-400" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* B2B / B2C Toggle Option */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const nextRole = isBusiness
                          ? "customer"
                          : "business_buyer";
                        setUserRole(nextRole);
                        toast.success(
                          `Switched to ${nextRole === "business_buyer" ? "Business (B2B)" : "Individual (B2C)"} mode!`,
                        );
                      }}
                      className="w-full flex items-center justify-center gap-3 p-4 glass-card rounded-2xl text-primary-600 font-bold text-sm shadow-sm border border-primary-50 hover:bg-primary-50 transition-colors bg-white mb-3"
                    >
                      <FiBriefcase className="text-lg animate-bounce" />
                      <span>
                        Switch to{" "}
                        {isBusiness ? "Individual (B2C)" : "Business (B2B)"}{" "}
                        Mode
                      </span>
                    </button>
                  </div>

                  {/* Logout Option */}
                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 p-4 glass-card rounded-2xl text-red-600 font-bold text-sm shadow-sm border border-red-50 hover:bg-red-50 transition-colors bg-white"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 lg:p-8"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full gradient-green flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user?.name || "User"}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          user?.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAvatarPick}
                        disabled={isLoading}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <FiCamera className="text-sm" />
                      </button>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Profile Picture
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG or GIF. Max size 5MB
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmitPersonal(onPersonalSubmit)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          {...registerPersonal("name", {
                            required: "Name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                            personalErrors.name
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-base`}
                          placeholder="Your full name"
                        />
                      </div>
                      <AnimatePresence>
                        {personalErrors.name && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-1 text-sm text-red-600"
                          >
                            {personalErrors.name.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          {...registerPersonal("email", {
                            required: "Email is required",
                            validate: (value) =>
                              isValidEmail(value) ||
                              "Please enter a valid email",
                          })}
                          readOnly
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                            personalErrors.email
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-base bg-gray-50 text-gray-500 cursor-not-allowed`}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed from profile settings.
                      </p>
                      <AnimatePresence>
                        {personalErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-1 text-sm text-red-600"
                          >
                            {personalErrors.email.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          {...registerPersonal("phone", {
                            validate: (value) =>
                              !value ||
                              isValidPhone(value) ||
                              "Please enter a valid phone number",
                          })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                            personalErrors.phone
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-base`}
                          placeholder="1234567890"
                        />
                      </div>
                      <AnimatePresence>
                        {personalErrors.phone && (
                          <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-1 text-sm text-red-600"
                          >
                            {personalErrors.phone.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          {...registerPersonal("gender")}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary-500 transition-colors text-base bg-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          placeholder="Age"
                          {...registerPersonal("age", {
                            min: { value: 1, message: "Invalid age" },
                            max: { value: 120, message: "Invalid age" },
                          })}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            personalErrors.age
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-base`}
                        />
                        <AnimatePresence>
                          {personalErrors.age && (
                            <motion.p
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="mt-1 text-sm text-red-600"
                            >
                              {personalErrors.age.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gradient-green text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-glow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>

                  {/* Business Profile Details Section */}
                  {(isBusiness || user?.companyName) && (
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <FiBriefcase className="text-primary-600 text-xl" />
                        <h3 className="font-extrabold text-gray-800 text-base">Business Profile Details</h3>
                        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          (user?.verificationStatus || 'Pending Verification') === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : (user?.verificationStatus || 'Pending Verification') === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          {user?.verificationStatus || 'Pending Verification'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 text-sm">
                        <div>
                          <span className="text-gray-400 block font-medium text-xs">Company Name</span>
                          <span className="font-bold text-gray-800">{user?.companyName || 'Not Set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium text-xs">Business Type</span>
                          <span className="font-bold text-gray-800">{user?.businessType || 'Not Set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium text-xs">GST Number</span>
                          <span className="font-bold text-gray-800 font-mono">{user?.gstNumber || 'Not Set'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium text-xs">Years In Business</span>
                          <span className="font-bold text-gray-800">{user?.yearsInBusiness || '0'} Years</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-400 block font-medium text-xs">Business Address</span>
                          <span className="font-bold text-gray-800">
                            {user?.businessAddress ? `${user.businessAddress}, ${user.city || ''}, ${user.state || ''} - ${user.pincode || ''}` : 'Not Set'}
                          </span>
                        </div>
                        {user?.gstCertificate && (
                          <div className="md:col-span-2 mt-2">
                            <span className="text-gray-400 block font-medium text-xs mb-1.5">Submitted GST Certificate</span>
                            <a
                              href={user.gstCertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 bg-white border border-gray-200 px-3 py-2 rounded-xl transition-all shadow-sm hover:shadow"
                            >
                              <FiFileText className="text-primary-500 text-sm" />
                              <span>View Certificate Document</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-red-100">
                    <h3 className="text-red-650 font-extrabold text-base mb-2">Danger Zone</h3>
                    <div className="border border-red-200 bg-red-50/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">Delete Account</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Permanently delete your PLE customer account and erase all registered profiling information.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm self-start sm:self-center"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* My Enquiries Tab */}
              {isBusiness && activeTab === "enquiries" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 lg:p-8"
                >
                  <B2BMyEnquiries />
                </motion.div>
              )}

              {/* Change Password Tab */}
              {activeTab === "password" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 lg:p-8"
                >
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Change Password
                  </h2>

                  <form
                    onSubmit={handleSubmitPassword(onPasswordSubmit)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          {...registerPassword("currentPassword", {
                            required: "Current password is required",
                          })}
                          className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
                            passwordErrors.currentPassword
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-sm sm:text-base`}
                          placeholder="Current Password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          {...registerPassword("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                          className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
                            passwordErrors.newPassword
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-sm sm:text-base`}
                          placeholder="New Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {passwordErrors.newPassword.message}
                        </motion.p>
                      )}
                      <PasswordStrengthMeter password={newPassword} />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...registerPassword("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === newPassword || "Passwords do not match",
                          })}
                          className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${
                            passwordErrors.confirmPassword
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-primary-500"
                          } focus:outline-none transition-colors text-sm sm:text-base`}
                          placeholder="Confirm Password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full gradient-green text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-glow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave />
                      {isLoading ? "Changing Password..." : "Change Password"}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* My Offers Tab */}
              {activeTab === "offers" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 lg:p-8 space-y-6 bg-white border border-gray-200"
                >
                  <h2 className="text-lg font-bold text-gray-800">
                    My Offers & Coupons
                  </h2>

                  <div className="flex bg-gray-100 rounded-xl p-1">
                    {["active", "expired", "upcoming"].map((subTab) => (
                      <button
                        key={subTab}
                        type="button"
                        onClick={() => setSelectedOfferSubTab(subTab)}
                        className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                          selectedOfferSubTab === subTab
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500"
                        }`}
                      >
                        {subTab} Offers
                      </button>
                    ))}
                  </div>

                  {filteredProfileOffers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProfileOffers.map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          onViewDetails={setSelectedProfileOffer}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                      <p className="text-sm text-gray-500">No {selectedOfferSubTab} offers available.</p>
                    </div>
                  )}

                  <OfferModal
                    isOpen={!!selectedProfileOffer}
                    onClose={() => setSelectedProfileOffer(null)}
                    offer={selectedProfileOffer}
                  />
                </motion.div>
              )}

              {/* Give Feedback Tab */}
              {activeTab === "feedback" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 lg:p-8 space-y-6 bg-white border border-gray-200 shadow-sm"
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Give Feedback
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      We value your feedback. Please share your rating and comments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        How would you rate your experience?
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-125"
                          >
                            <FiStar
                              className={`w-8 h-8 ${
                                star <= feedbackRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              } transition-colors duration-200`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Write your comments (optional)
                      </label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us what we can improve, or what you liked..."
                        rows={5}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 transition-colors text-base"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        toast.success("Thank you for your valuable feedback!");
                        setFeedbackText("");
                        setFeedbackRating(5);
                        setActiveTab("personal");
                      }}
                      className="w-full gradient-green text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-glow-green transition-all duration-300"
                    >
                      <FiSave />
                      Submit Feedback
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-gray-150 space-y-4"
              >
                <div className="text-center space-y-2">
                  <span className="text-4xl">⚠️</span>
                  <h3 className="text-lg font-bold text-gray-905">Delete Account Permanently?</h3>
                  <p className="text-xs text-gray-500">
                    Are you absolutely sure you want to delete your PLE account? This action is permanent and cannot be undone. You will lose access to all your order history, active offers, and billing data.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Confirm by typing your account password</label>
                    <input
                      type="password"
                      placeholder="Enter account password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      disabled={!deletePassword.trim()}
                      onClick={handleDeleteAccount}
                      className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-750 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-colors"
                    >
                      Permanently Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                      }}
                      className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileProfile;
