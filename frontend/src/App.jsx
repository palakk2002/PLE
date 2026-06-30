import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

import CartDrawer from "./shared/components/Cart/CartDrawer";
import ProtectedRoute from "./shared/components/Auth/ProtectedRoute";
import ErrorBoundary from "./shared/components/ErrorBoundary/ErrorBoundary";
import AdminProtectedRoute from "./modules/Admin/components/AdminProtectedRoute";
import AdminLayout from "./modules/Admin/components/Layout/AdminLayout";
import RouteWrapper from "./shared/components/RouteWrapper";
import ScrollToTop from "./shared/components/ScrollToTop";
import AppBootstrap from "./shared/components/AppBootstrap";
import OfflineDetector from "./shared/components/OfflineDetector";
import AppSuspenseLoader from "./shared/components/AppSuspenseLoader";

// Lazy Loaded Pages
// Admin Pages
const AdminLogin = lazy(() => import("./modules/Admin/pages/Login"));
const Dashboard = lazy(() => import("./modules/Admin/pages/Dashboard"));
const Products = lazy(() => import("./modules/Admin/pages/Products"));
const ProductForm = lazy(() => import("./modules/Admin/pages/ProductForm"));
const AdminOrders = lazy(() => import("./modules/Admin/pages/Orders"));
const OrderDetail = lazy(() => import("./modules/Admin/pages/OrderDetail"));
const ReturnRequests = lazy(() => import("./modules/Admin/pages/ReturnRequests"));
const ReturnRequestDetail = lazy(() => import("./modules/Admin/pages/ReturnRequestDetail"));
const Categories = lazy(() => import("./modules/Admin/pages/Categories"));
const Brands = lazy(() => import("./modules/Admin/pages/Brands"));
const Customers = lazy(() => import("./modules/Admin/pages/Customers"));
const Campaigns = lazy(() => import("./modules/Admin/pages/Campaigns"));
const Banners = lazy(() => import("./modules/Admin/pages/Banners"));
const Reviews = lazy(() => import("./modules/Admin/pages/Reviews"));
const Analytics = lazy(() => import("./modules/Admin/pages/Analytics"));
const Content = lazy(() => import("./modules/Admin/pages/Content"));
const Settings = lazy(() => import("./modules/Admin/pages/Settings"));
const More = lazy(() => import("./modules/Admin/pages/More"));
const PromoCodes = lazy(() => import("./modules/Admin/pages/PromoCodes"));
const AllOrders = lazy(() => import("./modules/Admin/pages/orders/AllOrders"));
const OrderTracking = lazy(() => import("./modules/Admin/pages/orders/OrderTracking"));
const Invoice = lazy(() => import("./modules/Admin/pages/orders/Invoice"));
const ManageProducts = lazy(() => import("./modules/Admin/pages/products/ManageProducts"));
const TaxPricing = lazy(() => import("./modules/Admin/pages/products/TaxPricing"));
const ProductRatings = lazy(() => import("./modules/Admin/pages/products/ProductRatings"));
const ManageCategories = lazy(() => import("./modules/Admin/pages/categories/ManageCategories"));
const CategoryOrder = lazy(() => import("./modules/Admin/pages/categories/CategoryOrder"));
const ManageBrands = lazy(() => import("./modules/Admin/pages/brands/ManageBrands"));
const ViewCustomers = lazy(() => import("./modules/Admin/pages/customers/ViewCustomers"));
const CustomerAddresses = lazy(() => import("./modules/Admin/pages/customers/Addresses"));
const Transactions = lazy(() => import("./modules/Admin/pages/customers/Transactions"));
const CustomerDetailPage = lazy(() => import("./modules/Admin/pages/customers/CustomerDetailPage"));
const DeliveryBoys = lazy(() => import("./modules/Admin/pages/delivery/DeliveryBoys"));
const CashCollection = lazy(() => import("./modules/Admin/pages/delivery/CashCollection"));
const AssignDelivery = lazy(() => import("./modules/Admin/pages/delivery/AssignDelivery"));
const Vendors = lazy(() => import("./modules/Admin/pages/Vendors"));
const ManageVendors = lazy(() => import("./modules/Admin/pages/vendors/ManageVendors"));
const PendingApprovals = lazy(() => import("./modules/Admin/pages/vendors/PendingApprovals"));
const VendorDetail = lazy(() => import("./modules/Admin/pages/vendors/VendorDetail"));
const CommissionRates = lazy(() => import("./modules/Admin/pages/vendors/CommissionRates"));
const AdminVendorAnalytics = lazy(() => import("./modules/Admin/pages/vendors/VendorAnalytics"));
const B2BUsersDashboard = lazy(() => import("./modules/Admin/pages/b2b-users/B2BUsersDashboard"));
const ManageB2BUsers = lazy(() => import("./modules/Admin/pages/b2b-users/ManageB2BUsers"));
const PendingB2BApprovals = lazy(() => import("./modules/Admin/pages/b2b-users/PendingB2BApprovals"));
const B2BAnalytics = lazy(() => import("./modules/Admin/pages/b2b-users/B2BAnalytics"));
const B2BMarketplace = lazy(() => import("./modules/Admin/pages/b2b/B2BMarketplace"));
const BusinessUsers = lazy(() => import("./modules/Admin/pages/b2b/BusinessUsers"));
const B2BProducts = lazy(() => import("./modules/Admin/pages/b2b/B2BProducts"));
const B2BOrders = lazy(() => import("./modules/Admin/pages/b2b/B2BOrders"));
const B2BSettings = lazy(() => import("./modules/Admin/pages/b2b/B2BSettings"));
const CompanyManagement = lazy(() => import("./modules/Admin/pages/b2b/CompanyManagement"));
const AdminB2BEnquiries = lazy(() => import("./modules/Admin/pages/b2b-enquiries/AdminB2BEnquiries"));
const AdminRFQDetail = lazy(() => import("./modules/Admin/pages/b2b-enquiries/AdminRFQDetail"));
const AdminSellerResponses = lazy(() => import("./modules/Admin/pages/b2b-enquiries/AdminSellerResponses"));
const AdminRFQDisputes = lazy(() => import("./modules/Admin/pages/b2b-enquiries/AdminRFQDisputes"));
const AdminRFQSpamMonitor = lazy(() => import("./modules/Admin/pages/b2b-enquiries/AdminRFQSpamMonitor"));
const RefurbishedMarketplace = lazy(() => import("./modules/Admin/pages/refurbished/RefurbishedMarketplace"));
const RefurbishedDashboard = lazy(() => import("./modules/Admin/pages/refurbished/RefurbishedDashboard"));
const ProductApprovals = lazy(() => import("./modules/Admin/pages/refurbished/ProductApprovals"));
const FraudModeration = lazy(() => import("./modules/Admin/pages/refurbished/FraudModeration"));
const ComplaintsReturns = lazy(() => import("./modules/Admin/pages/refurbished/ComplaintsReturns"));
const RefurbishedCategories = lazy(() => import("./modules/Admin/pages/refurbished/RefurbishedCategories"));
const HomeSliders = lazy(() => import("./modules/Admin/pages/offers/HomeSliders"));
const FestivalOffers = lazy(() => import("./modules/Admin/pages/offers/FestivalOffers"));
const PushNotifications = lazy(() => import("./modules/Admin/pages/notifications/PushNotifications"));
const CustomMessages = lazy(() => import("./modules/Admin/pages/notifications/CustomMessages"));
const AllNotifications = lazy(() => import("./modules/Admin/pages/notifications/AllNotifications"));
const LiveChat = lazy(() => import("./modules/Admin/pages/support/LiveChat"));
const TicketTypes = lazy(() => import("./modules/Admin/pages/support/TicketTypes"));
const Tickets = lazy(() => import("./modules/Admin/pages/support/Tickets"));
const SalesReport = lazy(() => import("./modules/Admin/pages/reports/SalesReport"));
const InventoryReport = lazy(() => import("./modules/Admin/pages/reports/InventoryReport"));
const RevenueOverview = lazy(() => import("./modules/Admin/pages/finance/RevenueOverview"));
const ProfitLoss = lazy(() => import("./modules/Admin/pages/finance/ProfitLoss"));
const OrderTrends = lazy(() => import("./modules/Admin/pages/finance/OrderTrends"));
const PaymentBreakdown = lazy(() => import("./modules/Admin/pages/finance/PaymentBreakdown"));
const TaxReports = lazy(() => import("./modules/Admin/pages/finance/TaxReports"));
const RefundReports = lazy(() => import("./modules/Admin/pages/finance/RefundReports"));
const GeneralSettings = lazy(() => import("./modules/Admin/pages/settings/GeneralSettings"));
const PaymentShippingSettings = lazy(() => import("./modules/Admin/pages/settings/PaymentShippingSettings"));
const OrdersCustomersSettings = lazy(() => import("./modules/Admin/pages/settings/OrdersCustomersSettings"));
const ProductsInventorySettings = lazy(() => import("./modules/Admin/pages/settings/ProductsInventorySettings"));
const ContentFeaturesSettings = lazy(() => import("./modules/Admin/pages/settings/ContentFeaturesSettings"));
const NotificationsSEOSettings = lazy(() => import("./modules/Admin/pages/settings/NotificationsSEOSettings"));
const PrivacyPolicy = lazy(() => import("./modules/Admin/pages/policies/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./modules/Admin/pages/policies/RefundPolicy"));
const TermsConditions = lazy(() => import("./modules/Admin/pages/policies/TermsConditions"));
const PushConfig = lazy(() => import("./modules/Admin/pages/firebase/PushConfig"));
const Authentication = lazy(() => import("./modules/Admin/pages/firebase/Authentication"));
const AdminDeliveryManager = lazy(() => import("./modules/Admin/pages/AdminDeliveryManager"));

// Admin Loyalty Program Pages
const AdminLoyaltyDashboard = lazy(() => import("./modules/Admin/pages/loyalty/Dashboard"));
const AdminLoyaltyRules = lazy(() => import("./modules/Admin/pages/loyalty/Rules"));
const AdminLoyaltyUsers = lazy(() => import("./modules/Admin/pages/loyalty/Users"));

// Product Requests System Pages
const UserProductRequestForm = lazy(() => import("./modules/UserApp/pages/ProductRequestForm"));
const UserProductRequestHistory = lazy(() => import("./modules/UserApp/pages/ProductRequestHistory"));
const UserProductRequestDetail = lazy(() => import("./modules/UserApp/pages/ProductRequestDetail"));
const VendorProductRequests = lazy(() => import("./modules/Vendor/pages/ProductRequests"));
const AdminProductRequestsDashboard = lazy(() => import("./modules/Admin/pages/ProductRequestsDashboard"));

// Product Enquiries System Pages
const VendorProductEnquiries = lazy(() => import("./modules/Vendor/pages/ProductEnquiries"));
const AdminProductEnquiries = lazy(() => import("./modules/Admin/pages/AdminProductEnquiries"));


// Offers & Promotion Management System Pages
const OfferDashboard = lazy(() => import("./modules/offers/pages/OfferDashboard"));
const OfferList = lazy(() => import("./modules/offers/pages/OfferList"));
const CreateOffer = lazy(() => import("./modules/offers/pages/CreateOffer"));
const EditOffer = lazy(() => import("./modules/offers/pages/EditOffer"));
const OfferDetails = lazy(() => import("./modules/offers/pages/OfferDetails"));

// Landing Page CMS Pages
const LandingPageCMSLayout = lazy(() => import("./modules/Admin/pages/landing-page/LandingPageCMSLayout"));
const LandingPageDashboard = lazy(() => import("./modules/Admin/pages/landing-page/LandingPageDashboard"));
const HeroEditor = lazy(() => import("./modules/Admin/pages/landing-page/HeroEditor"));
const ServicesEditor = lazy(() => import("./modules/Admin/pages/landing-page/ServicesEditor"));
const FeaturesEditor = lazy(() => import("./modules/Admin/pages/landing-page/FeaturesEditor"));
const ComparisonEditor = lazy(() => import("./modules/Admin/pages/landing-page/ComparisonEditor"));
const StatsEditor = lazy(() => import("./modules/Admin/pages/landing-page/StatsEditor"));
const TestimonialsEditor = lazy(() => import("./modules/Admin/pages/landing-page/TestimonialsEditor"));
const ProductShowcaseEditor = lazy(() => import("./modules/Admin/pages/landing-page/ProductShowcaseEditor"));
const PricingEditor = lazy(() => import("./modules/Admin/pages/landing-page/PricingEditor"));
const FAQEditor = lazy(() => import("./modules/Admin/pages/landing-page/FAQEditor"));
const GalleryEditor = lazy(() => import("./modules/Admin/pages/landing-page/GalleryEditor"));
const ContactEditor = lazy(() => import("./modules/Admin/pages/landing-page/ContactEditor"));
const FooterEditor = lazy(() => import("./modules/Admin/pages/landing-page/FooterEditor"));
const SEOSettingsEditor = lazy(() => import("./modules/Admin/pages/landing-page/SEOSettingsEditor"));
const BlogEditor = lazy(() => import("./modules/Admin/pages/landing-page/BlogEditor"));
const AdLandingPagesEditor = lazy(() => import("./modules/Admin/pages/landing-page/AdLandingPagesEditor"));

// About Page CMS Pages
const AboutPageDashboard = lazy(() => import("./modules/Admin/pages/about-page/AboutPageDashboard"));
const AboutHeroEditor = lazy(() => import("./modules/Admin/pages/about-page/HeroEditor"));
const AboutCompanyEditor = lazy(() => import("./modules/Admin/pages/about-page/CompanyEditor"));
const AboutWhatWeDoEditor = lazy(() => import("./modules/Admin/pages/about-page/WhatWeDoEditor"));
const AboutVisionMissionEditor = lazy(() => import("./modules/Admin/pages/about-page/VisionMissionEditor"));
const AboutOurEdgeEditor = lazy(() => import("./modules/Admin/pages/about-page/OurEdgeEditor"));

// Portfolio Page CMS Pages
const PortfolioPageDashboard = lazy(() => import("./modules/Admin/pages/portfolio-page/PortfolioPageDashboard"));

// Core Mobile/UserApp Pages (Statically Imported for Quick Opening)
import MobileHome from "./modules/UserApp/pages/Home";
import MobileProductDetail from "./modules/UserApp/pages/ProductDetail";
import MobileCategories from "./modules/UserApp/pages/categories";
import MobileSearch from "./modules/UserApp/pages/Search";

// Secondary Mobile/UserApp Pages (Lazy Loaded)
const MobileSeller = lazy(() => import("./modules/UserApp/pages/Seller"));
const MobileCategory = lazy(() => import("./modules/UserApp/pages/Category"));
const MobileBrand = lazy(() => import("./modules/UserApp/pages/Brand"));
const MobileCheckout = lazy(() => import("./modules/UserApp/pages/Checkout"));
const MobileLogin = lazy(() => import("./modules/UserApp/pages/Login"));
const MobileHelpSupport = lazy(() => import("./modules/UserApp/pages/HelpSupport"));
const MySupportTickets = lazy(() => import("./modules/UserApp/pages/MySupportTickets"));
const SupportChat = lazy(() => import("./modules/UserApp/pages/SupportChat"));
const MobileRegister = lazy(() => import("./modules/UserApp/pages/Register"));
const MobileVerification = lazy(() => import("./modules/UserApp/pages/Verification"));
const MobileForgotPassword = lazy(() => import("./modules/UserApp/pages/ForgotPassword"));
const MobileResetPassword = lazy(() => import("./modules/UserApp/pages/ResetPassword"));
const MobileProfile = lazy(() => import("./modules/UserApp/pages/Profile"));
const MobileSettings = lazy(() => import("./modules/UserApp/pages/Settings"));
const MobileWallet = lazy(() => import("./modules/UserApp/pages/Wallet"));
const UserNotifications = lazy(() => import("./modules/UserApp/pages/Notifications"));
const MobileOrders = lazy(() => import("./modules/UserApp/pages/Orders"));
const MobileOrderDetail = lazy(() => import("./modules/UserApp/pages/OrderDetail"));
const MobileRFQDetail = lazy(() => import("./modules/UserApp/pages/RFQDetail"));
const MobileAddresses = lazy(() => import("./modules/UserApp/pages/Addresses"));
const MobileWishlist = lazy(() => import("./modules/UserApp/pages/Wishlist"));
const MobileOffers = lazy(() => import("./modules/UserApp/pages/Offers"));
const FestivalLandingPage = lazy(() => import("./modules/UserApp/pages/FestivalLandingPage"));
const MobileDailyDeals = lazy(() => import("./modules/UserApp/pages/DailyDeals"));
const MobileFlashSale = lazy(() => import("./modules/UserApp/pages/FlashSale"));
const MobileNewArrivals = lazy(() => import("./modules/UserApp/pages/NewArrivals"));
const MobileCampaignSale = lazy(() => import("./modules/UserApp/pages/CampaignSale"));
const MobileTrackOrder = lazy(() => import("./modules/UserApp/pages/TrackOrder"));
const MobileOrderConfirmation = lazy(() => import("./modules/UserApp/pages/OrderConfirmation"));
const ComingSoon = lazy(() => import("./modules/UserApp/pages/ComingSoon"));
const PortalSelection = lazy(() => import("./modules/UserApp/pages/PortalSelection"));
const UserPrivacyPolicy = lazy(() => import("./modules/UserApp/pages/PrivacyPolicy"));
const UserTermsConditions = lazy(() => import("./modules/UserApp/pages/TermsConditions"));
const UserAgreement = lazy(() => import("./modules/UserApp/pages/UserAgreement"));
const UserReturnPolicy = lazy(() => import("./modules/UserApp/pages/ReturnPolicy"));
const AboutUs = lazy(() => import("./modules/UserApp/pages/AboutUs"));
const Returns = lazy(() => import("./modules/UserApp/pages/Returns"));
const ReturnRequestForm = lazy(() => import("./modules/UserApp/pages/ReturnRequestForm"));
const ReturnDetail = lazy(() => import("./modules/UserApp/pages/ReturnDetail"));

// Delivery Routes (Lazy Loaded)
const DeliveryLogin = lazy(() => import("./modules/Delivery/pages/Login"));
const DeliveryRegister = lazy(() => import("./modules/Delivery/pages/Register"));
const DeliveryForgotPassword = lazy(() => import("./modules/Delivery/pages/ForgotPassword"));
const DeliveryResetPassword = lazy(() => import("./modules/Delivery/pages/ResetPassword"));
const DeliveryProtectedRoute = lazy(() => import("./modules/Delivery/components/DeliveryProtectedRoute"));
const DeliveryLayout = lazy(() => import("./modules/Delivery/components/Layout/DeliveryLayout"));
const DeliveryDashboard = lazy(() => import("./modules/Delivery/pages/Dashboard"));
const DeliveryOrders = lazy(() => import("./modules/Delivery/pages/Orders"));
const DeliveryOrderDetail = lazy(() => import("./modules/Delivery/pages/OrderDetail"));
const DeliveryProfile = lazy(() => import("./modules/Delivery/pages/Profile"));
const DeliveryNotifications = lazy(() => import("./modules/Delivery/pages/Notifications"));
const ReturnPickups = lazy(() => import("./modules/Delivery/pages/ReturnPickups"));
const DeliverySupport = lazy(() => import("./modules/Delivery/pages/DeliverySupport"));

// Vendor Routes (Lazy Loaded)
const VendorLogin = lazy(() => import("./modules/Vendor/pages/Login"));
const VendorRegister = lazy(() => import("./modules/Vendor/pages/Register"));
const VendorVerification = lazy(() => import("./modules/Vendor/pages/Verification"));
const VendorForgotPassword = lazy(() => import("./modules/Vendor/pages/ForgotPassword"));
const VendorResetPassword = lazy(() => import("./modules/Vendor/pages/ResetPassword"));
const VendorProtectedRoute = lazy(() => import("./modules/Vendor/components/VendorProtectedRoute"));
const VendorLayout = lazy(() => import("./modules/Vendor/components/Layout/VendorLayout"));
const VendorDashboard = lazy(() => import("./modules/Vendor/pages/Dashboard"));
const VendorProducts = lazy(() => import("./modules/Vendor/pages/Products"));
const VendorManageProducts = lazy(() => import("./modules/Vendor/pages/products/ManageProducts"));
const VendorAddProduct = lazy(() => import("./modules/Vendor/pages/products/AddProduct"));
const VendorProductForm = lazy(() => import("./modules/Vendor/pages/products/ProductForm"));
const VendorOrders = lazy(() => import("./modules/Vendor/pages/Orders"));
const VendorAllOrders = lazy(() => import("./modules/Vendor/pages/orders/AllOrders"));
const VendorOrderTracking = lazy(() => import("./modules/Vendor/pages/orders/OrderTracking"));
const VendorOrderDetail = lazy(() => import("./modules/Vendor/pages/orders/OrderDetail"));
const VendorAnalytics = lazy(() => import("./modules/Vendor/pages/Analytics"));
const VendorEarnings = lazy(() => import("./modules/Vendor/pages/Earnings"));
const VendorSettings = lazy(() => import("./modules/Vendor/pages/Settings"));
const VendorProfileSettings = lazy(() => import("./modules/Vendor/pages/settings/ProfileSettings"));
const VendorStockManagement = lazy(() => import("./modules/Vendor/pages/StockManagement"));
const VendorWalletHistory = lazy(() => import("./modules/Vendor/pages/WalletHistory"));
const VendorChat = lazy(() => import("./modules/Vendor/pages/Chat"));
const VendorReturnRequests = lazy(() => import("./modules/Vendor/pages/ReturnRequests"));
const VendorReturnRequestDetail = lazy(() => import("./modules/Vendor/pages/returns/ReturnRequestDetail"));
const VendorProductReviews = lazy(() => import("./modules/Vendor/pages/ProductReviews"));
const VendorShippingManagement = lazy(() => import("./modules/Vendor/pages/ShippingManagement"));
const VendorCustomers = lazy(() => import("./modules/Vendor/pages/Customers"));
const VendorCustomerDetail = lazy(() => import("./modules/Vendor/pages/CustomerDetail"));
const VendorInventoryReports = lazy(() => import("./modules/Vendor/pages/InventoryReports"));
const VendorPerformanceMetrics = lazy(() => import("./modules/Vendor/pages/PerformanceMetrics"));
const VendorDocuments = lazy(() => import("./modules/Vendor/pages/Documents"));
const VendorNotifications = lazy(() => import("./modules/Vendor/pages/Notifications"));
const VendorSupportTickets = lazy(() => import("./modules/Vendor/pages/SupportTickets"));
const VendorSupportEscalations = lazy(() => import("./modules/Vendor/pages/SupportEscalations"));
const VendorPickupLocations = lazy(() => import("./modules/Vendor/pages/PickupLocations"));
const VendorReports = lazy(() => import("./modules/Vendor/pages/Reports"));
const VendorLanguageSettings = lazy(() => import("./modules/Vendor/pages/LanguageSettings"));
const VendorB2BEnquiries = lazy(() => import("./modules/Vendor/pages/b2b/B2BEnquiries"));
const VendorB2BEnquiryDetail = lazy(() => import("./modules/Vendor/pages/b2b/B2BEnquiryDetail"));
const VendorB2BCreateQuote = lazy(() => import("./modules/Vendor/pages/b2b/B2BCreateQuote"));
const VendorB2BQuoteDetail = lazy(() => import("./modules/Vendor/pages/b2b/B2BQuoteDetail"));
const VendorB2BOrders = lazy(() => import("./modules/Vendor/pages/b2b/VendorB2BOrders"));
const VendorB2BAnalytics = lazy(() => import("./modules/Vendor/pages/b2b/B2BAnalytics"));
const VendorB2BSettings = lazy(() => import("./modules/Vendor/pages/b2b/B2BSettings"));
const VendorDirectRFQs = lazy(() => import("./modules/Vendor/pages/b2b/VendorDirectRFQs"));
const VendorDirectRFQDetail = lazy(() => import("./modules/Vendor/pages/b2b/VendorDirectRFQDetail"));
const VendorDeliverySettings = lazy(() => import("./modules/Vendor/pages/VendorDeliverySettings"));
const VendorFestivalCampaigns = lazy(() => import("./modules/Vendor/pages/FestivalCampaigns"));

// B2B Admin Dashboard Routes (Lazy Loaded)
const B2BDashboardLayout = lazy(() => import("./modules/B2BAdmin/components/Layout/B2BDashboardLayout"));
const B2BDashboardOverview = lazy(() => import("./modules/B2BAdmin/pages/DashboardOverview"));
const B2BEmployeeManagement = lazy(() => import("./modules/B2BAdmin/pages/EmployeeManagement"));
const B2BCompanyProfile = lazy(() => import("./modules/B2BAdmin/pages/CompanyProfile"));
const B2BAdminProfile = lazy(() => import("./modules/B2BAdmin/pages/AdminProfile"));
const B2BEmployeeProfile = lazy(() => import("./modules/B2BAdmin/pages/EmployeeProfile"));
const B2BActivityLogs = lazy(() => import("./modules/B2BAdmin/pages/ActivityLogs"));
const B2BNotifications = lazy(() => import("./modules/B2BAdmin/pages/Notifications"));
const B2BDashboardSettings = lazy(() => import("./modules/B2BAdmin/pages/Settings"));
const B2BRFQs = lazy(() => import("./modules/B2BAdmin/pages/RFQs"));
const B2BCreateRFQ = lazy(() => import("./modules/B2BAdmin/pages/CreateRFQ"));
const B2BRFQDetail = lazy(() => import("./modules/B2BAdmin/pages/RFQDetail"));
const B2BQuotations = lazy(() => import("./modules/B2BAdmin/pages/Quotations"));
const B2BRFQDiscussions = lazy(() => import("./modules/B2BAdmin/pages/RFQDiscussions"));
const B2BPurchaseOrders = lazy(() => import("./modules/B2BAdmin/pages/PurchaseOrders"));
import B2BProtectedRoute from "./modules/B2BAdmin/components/B2BProtectedRoute";

import { useB2BAdminStore } from "./modules/B2BAdmin/store/b2bAdminStore";

const B2BIndexRoute = () => {
  const { adminProfile } = useB2BAdminStore();
  const isEmployee = adminProfile?.isEmployee || adminProfile?.role === 'b2bEmployee';
  if (isEmployee) {
    return <Navigate to="/b2b-dashboard/rfqs" replace />;
  }
  return <Navigate to="/b2b-dashboard/overview" replace />;
};

// Inner component that has access to useLocation
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteWrapper>
            <PortalSelection />
          </RouteWrapper>
        }
      />
      <Route
        path="/home"
        element={
          <RouteWrapper>
            <MobileHome />
          </RouteWrapper>
        }
      />
      <Route
        path="/product/:id"
        element={
          <RouteWrapper>
            <MobileProductDetail />
          </RouteWrapper>
        }
      />
      <Route
        path="/seller/:id"
        element={
          <RouteWrapper>
            <MobileSeller />
          </RouteWrapper>
        }
      />
      <Route
        path="/category/:id"
        element={
          <RouteWrapper>
            <MobileCategory />
          </RouteWrapper>
        }
      />
      <Route
        path="/brand/:id"
        element={
          <RouteWrapper>
            <MobileBrand />
          </RouteWrapper>
        }
      />
      <Route
        path="/categories"
        element={
          <RouteWrapper>
            <MobileCategories />
          </RouteWrapper>
        }
      />
      <Route
        path="/search"
        element={
          <RouteWrapper>
            <MobileSearch />
          </RouteWrapper>
        }
      />
      <Route
        path="/checkout"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileCheckout />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />

      <Route
        path="/login"
        element={
          <RouteWrapper>
            <MobileLogin />
          </RouteWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <RouteWrapper>
            <MobileRegister />
          </RouteWrapper>
        }
      />
      <Route
        path="/verification"
        element={
          <RouteWrapper>
            <MobileVerification />
          </RouteWrapper>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <RouteWrapper>
            <MobileForgotPassword />
          </RouteWrapper>
        }
      />
      <Route
        path="/reset-password"
        element={
          <RouteWrapper>
            <MobileResetPassword />
          </RouteWrapper>
        }
      />
      <Route
        path="/wishlist"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileWishlist />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/offers"
        element={
          <RouteWrapper>
            <MobileOffers />
          </RouteWrapper>
        }
      />
      <Route
        path="/festival-campaign"
        element={
          <RouteWrapper>
            <FestivalLandingPage />
          </RouteWrapper>
        }
      />
      <Route
        path="/daily-deals"
        element={
          <RouteWrapper>
            <MobileDailyDeals />
          </RouteWrapper>
        }
      />
      <Route
        path="/flash-sale"
        element={
          <RouteWrapper>
            <MobileFlashSale />
          </RouteWrapper>
        }
      />
      <Route
        path="/new-arrivals"
        element={
          <RouteWrapper>
            <MobileNewArrivals />
          </RouteWrapper>
        }
      />
      <Route
        path="/sale/:slug"
        element={
          <RouteWrapper>
            <MobileCampaignSale />
          </RouteWrapper>
        }
      />
      <Route
        path="/order-confirmation/:orderId"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileOrderConfirmation />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileOrderDetail />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/rfq/:id"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileRFQDetail />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/track-order/:orderId"
        element={
          <RouteWrapper>
            <MobileTrackOrder />
          </RouteWrapper>
        }
      />
      <Route
        path="/profile"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileProfile />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/settings"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileSettings />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/wallet"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileWallet />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/help-support"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileHelpSupport />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/support-tickets"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MySupportTickets />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/support-chat/:id"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <SupportChat />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <RouteWrapper>
            <UserPrivacyPolicy />
          </RouteWrapper>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <RouteWrapper>
            <UserTermsConditions />
          </RouteWrapper>
        }
      />
      <Route
        path="/user-agreement"
        element={
          <RouteWrapper>
            <UserAgreement />
          </RouteWrapper>
        }
      />
      <Route
        path="/return-policy"
        element={
          <RouteWrapper>
            <UserReturnPolicy />
          </RouteWrapper>
        }
      />
      <Route
        path="/about-us"
        element={
          <RouteWrapper>
            <AboutUs />
          </RouteWrapper>
        }
      />
      <Route
        path="/notifications"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <UserNotifications />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/orders"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileOrders />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/addresses"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <MobileAddresses />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/returns"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <Returns />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/returns/request/:orderId"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <ReturnRequestForm />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/returns/:id"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <ReturnDetail />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/product-request/new"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <UserProductRequestForm />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/product-requests"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <UserProductRequestHistory />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />
      <Route
        path="/product-requests/:id"
        element={
          <RouteWrapper>
            <ProtectedRoute>
              <UserProductRequestDetail />
            </ProtectedRoute>
          </RouteWrapper>
        }
      />

      {/* B2B Admin Dashboard Routes */}
      <Route path="/b2b-dashboard" element={
        <B2BProtectedRoute>
          <B2BDashboardLayout />
        </B2BProtectedRoute>
      }>
        <Route index element={<B2BIndexRoute />} />
        <Route path="overview" element={<B2BDashboardOverview />} />
        <Route path="employees" element={<B2BEmployeeManagement />} />
        <Route path="employees/:id" element={<B2BEmployeeProfile />} />
        <Route path="rfqs" element={<B2BRFQs />} />
        <Route path="rfqs/new" element={<B2BCreateRFQ />} />
        <Route path="rfqs/:id" element={<B2BRFQDetail />} />
        <Route path="direct-rfqs/:id" element={<B2BRFQDetail />} />
        <Route path="quotations" element={<B2BQuotations />} />
        <Route path="discussions" element={<B2BRFQDiscussions />} />
        <Route path="purchase-orders" element={<B2BPurchaseOrders />} />
        <Route path="company-profile" element={<B2BCompanyProfile />} />
        <Route path="admin-profile" element={<B2BAdminProfile />} />
        <Route path="activity-logs" element={<B2BActivityLogs />} />
        <Route path="notifications" element={<B2BNotifications />} />
        <Route path="settings" element={<B2BDashboardSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="products/manage-products" element={<ManageProducts />} />
        <Route path="products/tax-pricing" element={<TaxPricing />} />
        <Route path="products/product-ratings" element={<ProductRatings />} />
        <Route path="more" element={<More />} />
        <Route path="categories" element={<Categories />} />
        <Route
          path="categories/manage-categories"
          element={<ManageCategories />}
        />
        <Route path="categories/category-order" element={<CategoryOrder />} />
        <Route path="brands" element={<Brands />} />
        <Route path="brands/manage-brands" element={<ManageBrands />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="orders/:id/invoice" element={<Invoice />} />
        <Route path="orders/all-orders" element={<AllOrders />} />
        <Route path="orders/order-tracking" element={<OrderTracking />} />
        <Route path="return-requests" element={<ReturnRequests />} />
        <Route path="return-requests/:id" element={<ReturnRequestDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/view-customers" element={<ViewCustomers />} />
        <Route path="customers/addresses" element={<CustomerAddresses />} />
        <Route path="customers/transactions" element={<Transactions />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />

        <Route path="delivery" element={<DeliveryBoys />} />
        <Route path="delivery/delivery-boys" element={<DeliveryBoys />} />
        <Route path="delivery/cash-collection" element={<CashCollection />} />
        <Route path="delivery/assign-delivery" element={<AssignDelivery />} />
        <Route path="delivery-control" element={<AdminDeliveryManager />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="vendors/manage-vendors" element={<ManageVendors />} />
        <Route
          path="vendors/pending-approvals"
          element={<PendingApprovals />}
        />
        <Route path="vendors/commission-rates" element={<CommissionRates />} />
        <Route
          path="vendors/vendor-analytics"
          element={<AdminVendorAnalytics />}
        />
        <Route path="vendors/:id" element={<VendorDetail />} />

        {/* B2B Users Routes */}
        <Route path="b2b-users" element={<B2BUsersDashboard />} />
        <Route path="b2b-users/manage" element={<ManageB2BUsers />} />
        <Route path="b2b-users/pending" element={<PendingB2BApprovals />} />
        <Route path="b2b-users/analytics" element={<B2BAnalytics />} />

        {/* B2B Marketplace Routes */}
        <Route path="b2b" element={<B2BMarketplace />} />
        <Route path="b2b/business-users" element={<BusinessUsers />} />
        <Route path="b2b/b2b-products" element={<B2BProducts />} />
        <Route path="b2b/b2b-orders" element={<B2BOrders />} />
        <Route path="b2b/b2b-settings" element={<B2BSettings />} />
        <Route path="b2b/companies" element={<CompanyManagement />} />

        {/* Admin B2B Enquiry/RFQ Routes */}
        <Route path="b2b-enquiries" element={<AdminB2BEnquiries />} />
        <Route path="b2b-enquiries/all" element={<AdminB2BEnquiries />} />
        <Route path="b2b-enquiries/:id" element={<AdminRFQDetail />} />
        <Route path="b2b-enquiries/seller-responses" element={<AdminSellerResponses />} />
        <Route path="b2b-enquiries/disputes" element={<AdminRFQDisputes />} />
        <Route path="b2b-enquiries/spam" element={<AdminRFQSpamMonitor />} />

        {/* Refurbished Marketplace Routes */}
        <Route path="refurbished" element={<RefurbishedMarketplace />} />
        <Route path="refurbished/dashboard" element={<RefurbishedDashboard />} />
        <Route path="refurbished/approvals" element={<ProductApprovals />} />
        <Route path="refurbished/moderation" element={<FraudModeration />} />
        <Route path="refurbished/complaints" element={<ComplaintsReturns />} />
        <Route path="refurbished/categories" element={<RefurbishedCategories />} />

        <Route path="offers" element={<HomeSliders />} />
        <Route path="offers/home-sliders" element={<HomeSliders />} />
        <Route path="offers/festival-offers" element={<FestivalOffers />} />

        {/* Offers & Promotion Management System (Admin) */}
        <Route path="offers-management" element={<Navigate to="dashboard" replace />} />
        <Route path="offers-management/dashboard" element={<OfferDashboard />} />
        <Route path="offers-management/list" element={<OfferList />} />
        <Route path="offers-management/create" element={<CreateOffer />} />
        <Route path="offers-management/edit/:id" element={<EditOffer />} />
        <Route path="offers-management/details/:id" element={<OfferDetails />} />

        <Route path="promocodes" element={<PromoCodes />} />
        <Route path="notifications" element={<AllNotifications />} />
        <Route
          path="notifications/push-notifications"
          element={<PushNotifications />}
        />
        <Route
          path="notifications/custom-messages"
          element={<CustomMessages />}
        />
        <Route path="support" element={<Tickets />} />
        <Route path="support/live-chat" element={<LiveChat />} />
        <Route path="support/ticket-types" element={<TicketTypes />} />
        <Route path="support/tickets" element={<Tickets />} />
        <Route path="reports" element={<SalesReport />} />
        <Route path="reports/sales-report" element={<SalesReport />} />
        <Route path="reports/inventory-report" element={<InventoryReport />} />
        <Route path="finance" element={<RevenueOverview />} />
        <Route path="finance/revenue-overview" element={<RevenueOverview />} />
        <Route path="finance/profit-loss" element={<ProfitLoss />} />
        <Route path="finance/order-trends" element={<OrderTrends />} />
        <Route
          path="finance/payment-breakdown"
          element={<PaymentBreakdown />}
        />
        <Route path="finance/tax-reports" element={<TaxReports />} />
        <Route path="finance/refund-reports" element={<RefundReports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route
          path="settings"
          element={<Navigate to="/admin/settings/general" replace />}
        />
        <Route path="settings/general" element={<Settings />} />
        <Route path="settings/payment-shipping" element={<Settings />} />
        <Route path="settings/orders-customers" element={<Settings />} />
        <Route path="settings/products-inventory" element={<Settings />} />
        <Route path="settings/content-features" element={<Settings />} />
        <Route path="settings/notifications-seo" element={<Settings />} />
        <Route path="policies" element={<PrivacyPolicy />} />
        <Route path="policies/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="policies/refund-policy" element={<RefundPolicy />} />
        <Route path="policies/terms-conditions" element={<TermsConditions />} />
        <Route path="firebase" element={<PushConfig />} />
        <Route path="firebase/push-config" element={<PushConfig />} />
        <Route path="firebase/authentication" element={<Authentication />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="banners" element={<Banners />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="content" element={<Content />} />
        <Route path="product-requests" element={<AdminProductRequestsDashboard />} />
        <Route path="product-enquiries" element={<AdminProductEnquiries />} />

        {/* Loyalty Program Admin Routes */}
        <Route path="loyalty" element={<Navigate to="dashboard" replace />} />
        <Route path="loyalty/dashboard" element={<AdminLoyaltyDashboard />} />
        <Route path="loyalty/rules" element={<AdminLoyaltyRules />} />
        <Route path="loyalty/users" element={<AdminLoyaltyUsers />} />

        {/* Landing Page CMS Routes */}
        <Route path="landing-page" element={<LandingPageCMSLayout />}>
          <Route index element={<LandingPageDashboard />} />
          <Route path="hero" element={<HeroEditor />} />
          <Route path="services" element={<ServicesEditor />} />
          <Route path="features" element={<FeaturesEditor />} />
          <Route path="comparison" element={<ComparisonEditor />} />
          <Route path="stats" element={<StatsEditor />} />
          <Route path="testimonials" element={<TestimonialsEditor />} />
          <Route path="products" element={<ProductShowcaseEditor />} />
          <Route path="pricing" element={<PricingEditor />} />
          <Route path="faq" element={<FAQEditor />} />
          <Route path="gallery" element={<GalleryEditor />} />
          <Route path="contact" element={<ContactEditor />} />
          <Route path="footer" element={<FooterEditor />} />
          <Route path="seo" element={<SEOSettingsEditor />} />
          <Route path="blogs" element={<BlogEditor />} />
          <Route path="ad-landing-pages" element={<AdLandingPagesEditor />} />
        </Route>

        {/* About Page CMS Routes */}
        <Route path="about-page/*" element={<AboutPageDashboard />} />

        {/* Portfolio Page CMS Routes */}
        <Route path="portfolio-page/*" element={<PortfolioPageDashboard />} />
      </Route>
      {/* Delivery Routes */}
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/delivery/register" element={<DeliveryRegister />} />
      <Route
        path="/delivery/forgot-password"
        element={<DeliveryForgotPassword />}
      />
      <Route
        path="/delivery/reset-password"
        element={<DeliveryResetPassword />}
      />
      <Route
        path="/delivery"
        element={
          <DeliveryProtectedRoute>
            <DeliveryLayout />
          </DeliveryProtectedRoute>
        }>
        <Route index element={<Navigate to="/delivery/dashboard" replace />} />
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="orders/:id" element={<DeliveryOrderDetail />} />
        <Route path="notifications" element={<DeliveryNotifications />} />
        <Route path="profile" element={<DeliveryProfile />} />
        <Route path="pickups" element={<ReturnPickups />} />
        <Route path="support" element={<DeliverySupport />} />
      </Route>
      {/* Vendor Routes */}
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/register" element={<VendorRegister />} />
      <Route path="/vendor/verification" element={<VendorVerification />} />
      <Route
        path="/vendor/forgot-password"
        element={<VendorForgotPassword />}
      />
      <Route path="/vendor/reset-password" element={<VendorResetPassword />} />
      <Route
        path="/vendor"
        element={
          <VendorProtectedRoute>
            <VendorLayout />
          </VendorProtectedRoute>
        }>
        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route
          path="products/manage-products"
          element={<VendorManageProducts />}
        />
        <Route path="products/add-product" element={<VendorAddProduct />} />
        <Route path="products/:id" element={<VendorProductForm />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="orders/all-orders" element={<VendorAllOrders />} />
        <Route path="orders/order-tracking" element={<VendorOrderTracking />} />
        <Route path="orders/:id" element={<VendorOrderDetail />} />
        <Route path="analytics" element={<VendorAnalytics />} />
        <Route path="reports" element={<VendorReports />} />
        <Route path="earnings" element={<VendorEarnings />} />
        <Route path="earnings/overview" element={<VendorEarnings />} />
        <Route
          path="earnings/commission-history"
          element={<VendorEarnings />}
        />
        <Route
          path="earnings/settlement-history"
          element={<VendorEarnings />}
        />
        <Route path="stock-management" element={<VendorStockManagement />} />
        <Route path="wallet-history" element={<VendorWalletHistory />} />
        <Route path="chat" element={<VendorChat />} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="return-requests" element={<VendorReturnRequests />} />
        <Route
          path="return-requests/:id"
          element={<VendorReturnRequestDetail />}
        />
        <Route path="product-reviews" element={<VendorProductReviews />} />
        <Route
          path="shipping-management"
          element={<VendorShippingManagement />}
        />
        <Route path="pickup-locations" element={<VendorPickupLocations />} />
        <Route path="customers/:id" element={<VendorCustomerDetail />} />
        <Route path="customers" element={<VendorCustomers />} />
        <Route path="support-tickets" element={<VendorSupportTickets />} />
        <Route path="support-escalations" element={<VendorSupportEscalations />} />
        <Route path="inventory-reports" element={<VendorInventoryReports />} />
        <Route
          path="performance-metrics"
          element={<VendorPerformanceMetrics />}
        />
        <Route path="documents" element={<VendorDocuments />} />
        <Route path="language-settings" element={<VendorLanguageSettings />} />
        <Route path="settings" element={<VendorSettings />} />
        <Route path="settings/store" element={<VendorSettings />} />
        <Route path="settings/payment" element={<VendorSettings />} />
        <Route path="settings/payment-settings" element={<VendorSettings />} />
        <Route path="settings/shipping" element={<VendorSettings />} />
        <Route path="settings/shipping-settings" element={<VendorSettings />} />
        {/* B2B Enquiry Routes */}
        <Route path="b2b-enquiries" element={<VendorB2BEnquiries />} />
        <Route path="b2b-enquiries/all" element={<VendorB2BEnquiries />} />
        <Route path="b2b-enquiries/:id" element={<VendorB2BEnquiryDetail />} />
        <Route path="b2b-enquiries/:id/create-quote" element={<VendorB2BCreateQuote />} />
        <Route path="b2b-enquiries/:id/quote/:quoteId" element={<VendorB2BQuoteDetail />} />
        <Route path="b2b-enquiries/orders" element={<VendorB2BOrders />} />
        <Route path="b2b-enquiries/analytics" element={<VendorB2BAnalytics />} />
        <Route path="b2b-enquiries/settings" element={<VendorB2BSettings />} />
        {/* Direct RFQ Routes */}
        <Route path="direct-rfqs" element={<VendorDirectRFQs />} />
        <Route path="direct-rfqs/:id" element={<VendorDirectRFQDetail />} />
        {/* Offers & Promotion Management System (Seller) */}
        <Route path="my-offers" element={<Navigate to="dashboard" replace />} />
        <Route path="my-offers/dashboard" element={<OfferDashboard />} />
        <Route path="my-offers/list" element={<OfferList />} />
        <Route path="my-offers/create" element={<CreateOffer />} />
        <Route path="my-offers/edit/:id" element={<EditOffer />} />
        <Route path="my-offers/details/:id" element={<OfferDetails />} />

        <Route path="delivery-settings" element={<VendorDeliverySettings />} />
        <Route path="festival-campaigns" element={<VendorFestivalCampaigns />} />
        <Route path="product-requests" element={<VendorProductRequests />} />
        <Route path="product-enquiries" element={<VendorProductEnquiries />} />
        <Route path="profile" element={<VendorProfileSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Helper component to limit active toast notifications to exactly 1
const ToastLimitHandler = () => {
  const { toasts } = useToasterStore();

  useEffect(() => {
    // Only allow 1 visible toast at a time
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= 1)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <OfflineDetector>
          <AppBootstrap />
          <ScrollToTop />
          <Suspense fallback={<AppSuspenseLoader />}>
            <AppRoutes />
          </Suspense>
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#212121",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#388E3C",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#FF6161",
                  secondary: "#fff",
                },
              },
            }}
          />
          <ToastLimitHandler />
        </OfflineDetector>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
