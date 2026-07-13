import { useState, useEffect, useMemo } from "react";
import { 
  FiSearch, 
  FiShoppingBag, 
  FiFileText, 
  FiUploadCloud, 
  FiClock, 
  FiChevronRight,
  FiEdit3
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import B2BRequestQuoteModal from "./B2BRequestQuoteModal";
import ProductCard from "../../../../shared/components/ProductCard";
import AnimatedBanner from "../Mobile/AnimatedBanner";
import NewArrivalsSection from "../Mobile/NewArrivalsSection";
import DailyDealsSection from "../Mobile/DailyDealsSection";
import RecommendedSection from "../Mobile/RecommendedSection";
import FeaturedVendorsSection from "../Mobile/FeaturedVendorsSection";
import BrandLogosScroll from "../Mobile/BrandLogosScroll";
import MobileCategoryGrid from "../Mobile/MobileCategoryGrid";
import OfferCarousel from "../../../offers/components/OfferCarousel";
import { useCategoryStore } from "../../../../shared/store/categoryStore";
import { categories as fallbackCategories } from "../../../../data/categories";
import { useThemeStore } from "../../../../shared/store/themeStore";

const B2BHome = ({
  computedBrands,
  computedVendors,
  computedNewArrivals,
  computedMostPopular,
  computedDailyDeals,
  computedRefurbished,
  computedFlashSale,
  computedTrending,
  offers,
  promoBanners,
  setSelectedHomeOffer
}) => {
  const navigate = useNavigate();
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");

  const { theme } = useThemeStore();
  const { categories: allCategories, initialize: initCategories, getRootCategories } = useCategoryStore();

  useEffect(() => {
    initCategories();
  }, [initCategories]);

  const displayCategories = useMemo(() => {
    const roots = getRootCategories().filter((cat) => cat.isActive !== false);
    if (!roots.length) return fallbackCategories;

    return roots.map((cat) => {
      const fallbackCat = fallbackCategories.find(
        (fc) =>
          String(fc.id ?? "").trim() === String(cat.id ?? "").trim() ||
          fc.name?.toLowerCase() === cat.name?.toLowerCase()
      );
      return {
        ...(fallbackCat || {}),
        ...cat,
        image: cat.image || fallbackCat?.image || "",
      };
    });
  }, [allCategories, getRootCategories]);

  const categoryTabs = [
    { name: "All", count: 0 },
    { name: "Men's", count: 0 },
    { name: "Women's", count: 0 },
    { name: "Books", count: 0 },
    { name: "Kids", count: 0 }
  ];

  const brands = [
    { name: "Armani Exchange", logo: "A|X", subtitle: "Armani Exchange" },
    { name: "Chanel", logo: "CHANEL", subtitle: "Chanel" },
    { name: "Charles & Keith", logo: "CHARLES & KEITH", subtitle: "Charles & Keith" },
    { name: "Chloe", logo: "Chloé", subtitle: "Chloe" }
  ];



  const handleUploadBOQ = () => {
    toast.success("BOQ Upload dialog opened. Choose your procurement list.");
  };

  return (
    <div className="w-full min-h-screen bg-black text-white dark:bg-black dark:text-white light:bg-gray-50 light:text-gray-900 transition-colors duration-300 pb-24">
      {/* CSS injection for light/dark custom styles */}
      <style>{`
        .light\\:bg-gray-50:not(.dark *) {
          background-color: #f9fafb !important;
        }
        .light\\:text-gray-900:not(.dark *) {
          color: #111827 !important;
        }
        .light\\:bg-white:not(.dark *) {
          background-color: #ffffff !important;
        }
        .light\\:border-gray-200:not(.dark *) {
          border-color: #e5e7eb !important;
        }
        .light\\:text-gray-500:not(.dark *) {
          color: #6b7280 !important;
        }
        .light\\:text-gray-600:not(.dark *) {
          color: #4b5563 !important;
        }
        .light\\:text-gray-800:not(.dark *) {
          color: #1f2937 !important;
        }
        .light\\:bg-gray-100:not(.dark *) {
          background-color: #f3f4f6 !important;
        }
      `}</style>

      {/* Main Container */}
      <div className="px-4 py-3 space-y-4">

        {/* Red Background Top Section wrapper */}
        <div 
          className="px-4 pt-3 pb-4 space-y-4 -mx-4 -mt-3 transition-colors duration-300"
          style={{
            background: theme === "dark" 
              ? "linear-gradient(to bottom, #1A0A0A 0%, #140808 30%, #0D0D0D 100%)" 
              : "linear-gradient(135deg, #9B1C1C 0%, #7B0A0A 50%, #4C0505 100%)"
          }}
        >
          {/* Third Row: Slim Navigation Capsule Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => navigate('/home')}
              className="w-[108px] h-[44px] flex-shrink-0 flex flex-col items-center justify-center bg-white text-[#AE020B] rounded-md shadow-sm text-center"
            >
              <span className="block text-[8px] opacity-75 font-normal text-zinc-550 leading-tight">BRANDS BY PLE</span>
              <span className="text-[10px] font-extrabold leading-tight">Official Store</span>
            </button>
            
            <button 
              onClick={() => document.getElementById('featured-vendors-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-[108px] h-[44px] flex-shrink-0 flex flex-col items-center justify-center border border-white/20 bg-white/10 text-white rounded-md text-center"
            >
              <span className="block text-[8px] opacity-75 font-normal leading-tight">OTHER SHOPS</span>
              <span className="text-[10px] font-semibold leading-tight">Marketplace</span>
            </button>

            <button 
              onClick={() => navigate('/categories')}
              className="w-[108px] h-[44px] flex-shrink-0 flex flex-col items-center justify-center border border-white/20 bg-white/10 text-white font-semibold text-[10px] uppercase rounded-md"
            >
              CATEGORIES
            </button>

            <button 
              onClick={() => navigate('/offers')}
              className="w-[108px] h-[44px] flex-shrink-0 flex flex-col items-center justify-center border border-white/20 bg-white/10 text-white font-semibold text-[10px] uppercase rounded-md"
            >
              OFFER
            </button>

            <button 
              onClick={() => navigate('/offers')}
              className="w-[108px] h-[44px] flex-shrink-0 flex flex-col items-center justify-center border border-white/20 bg-white/10 text-yellow-300 font-extrabold text-[10px] uppercase rounded-md"
            >
              <span className="flex items-center justify-center gap-0.5">DIWALI <span className="text-[9px]">★</span> SALE</span>
            </button>
          </div>

          {/* Fourth Row: Single Integrated Search Bar with Left Logo & Right Search Icon */}
          <div className="relative flex items-center w-full bg-white rounded-full border border-white/20 pl-4 pr-10 py-3 shadow-sm">
            <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
              <div className="w-5 h-5 rounded-full bg-[#AE020B] flex items-center justify-center text-white text-[9px] font-black">
                PLE
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Search for products, brands, categories..." 
              className="flex-grow pl-3 bg-transparent text-sm text-gray-900 focus:outline-none placeholder-gray-400"
            />
            <FiSearch className="absolute right-4 text-gray-400 text-lg" />
          </div>

          {/* Fifth Row: Category Quick Nav Bar (Circles/Icons) */}
          <div className="flex items-center justify-around py-2 border-b border-white/10">
            {categoryTabs.map((tab) => (
              <button 
                key={tab.name}
                onClick={() => setActiveCategoryTab(tab.name)}
                className="flex flex-col items-center gap-1.5 focus:outline-none relative"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  activeCategoryTab === tab.name 
                    ? "border-white bg-white text-[#AE020B] shadow-md" 
                    : "border-white/20 bg-white/10 text-white/90 hover:bg-white/20"
                }`}>
                  {tab.name === "All" && <FiShoppingBag className="text-lg" />}
                  {tab.name === "Men's" && <span className="text-lg font-bold">M</span>}
                  {tab.name === "Women's" && <span className="text-lg font-bold">W</span>}
                  {tab.name === "Books" && <span className="text-lg font-bold">B</span>}
                  {tab.name === "Kids" && <span className="text-lg font-bold">K</span>}
                </div>
                <span className={`text-[11px] font-semibold ${
                  activeCategoryTab === tab.name ? "text-white font-extrabold" : "text-white/70"
                }`}>
                  {tab.name}
                </span>
                {activeCategoryTab === tab.name && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sixth Row: Main Hero Banner ("BUSINESS PROCUREMENT") */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#200204] via-[#0E0102] to-black border border-zinc-800/50 p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF3E46]">
              BUSINESS PROCUREMENT
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Smart Sourcing.<br />Reliable Supply.
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm font-medium mt-1 leading-relaxed">
              GST-compliant sourcing, bulk quotes and business purchasing made easy.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button 
              onClick={() => setIsRfqOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#AE020B] hover:bg-[#8B0208] text-white font-extrabold text-xs uppercase rounded-lg transition-all shadow-md active:scale-95"
            >
              <FiFileText className="text-sm" />
              Request Quote
            </button>
            <button 
              onClick={handleUploadBOQ}
              className="flex items-center gap-2 px-4 py-2.5 border border-zinc-700 bg-zinc-950/80 hover:bg-zinc-900 text-white font-extrabold text-xs uppercase rounded-lg transition-all active:scale-95"
            >
              <FiUploadCloud className="text-sm" />
              Upload BOQ
            </button>
          </div>
        </div>

        {/* Seventh Row: Services Grid (4 Cards) */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setIsRfqOpen(true)}
            className="flex items-start gap-3 p-3 bg-zinc-950 light:bg-white border border-zinc-900 light:border-gray-200 rounded-xl cursor-pointer hover:border-zinc-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-red-950/50 light:bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <FiFileText className="text-lg" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white light:text-gray-900">Request Quote</h4>
              <p className="text-[10px] text-zinc-500 light:text-gray-500 mt-0.5 leading-tight">Get best quotes for your needs</p>
            </div>
          </div>

          <div 
            onClick={handleUploadBOQ}
            className="flex items-start gap-3 p-3 bg-zinc-950 light:bg-white border border-zinc-900 light:border-gray-200 rounded-xl cursor-pointer hover:border-zinc-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-950/50 light:bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <FiUploadCloud className="text-lg" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white light:text-gray-900">Upload BOQ</h4>
              <p className="text-[10px] text-zinc-500 light:text-gray-500 mt-0.5 leading-tight">Upload your list for bulk pricing</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-zinc-950 light:bg-white border border-zinc-900 light:border-gray-200 rounded-xl cursor-pointer hover:border-zinc-800 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-green-950/50 light:bg-green-50 flex items-center justify-center text-green-500 shrink-0">
              <FiClock className="text-lg" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white light:text-gray-900">Track Orders</h4>
              <p className="text-[10px] text-zinc-500 light:text-gray-500 mt-0.5 leading-tight">Real-time status of your orders</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-zinc-950 light:bg-white border border-zinc-900 light:border-gray-200 rounded-xl cursor-pointer hover:border-zinc-800 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-950/50 light:bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white light:text-gray-900">GST Invoices</h4>
              <p className="text-[10px] text-zinc-500 light:text-gray-500 mt-0.5 leading-tight">100% GST compliant invoicing</p>
            </div>
          </div>
        </div>

        {/* Eighth Row: TOP BRANDS BY PLE */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white light:text-gray-900 tracking-wide uppercase">
              TOP BRANDS BY PLE
            </h3>
            <button className="text-xs font-bold text-[#AE020B] flex items-center gap-0.5 hover:underline">
              View All <FiChevronRight className="mt-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {brands.map((brand) => (
              <div 
                key={brand.name}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-full aspect-square bg-zinc-950 light:bg-white border border-zinc-900 light:border-gray-200 rounded-lg flex items-center justify-center p-2 hover:border-zinc-800 transition-colors">
                  <span className="text-xs font-black tracking-widest text-white light:text-gray-900 text-center uppercase">
                    {brand.logo}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 light:text-gray-500 text-center truncate w-full">
                  {brand.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ninth Row: POPULAR CATEGORIES */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white light:text-gray-900 tracking-wide uppercase">
              POPULAR CATEGORIES
            </h3>
            <button className="text-xs font-bold text-[#AE020B] flex items-center gap-0.5 hover:underline">
              View All <FiChevronRight className="mt-0.5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            {displayCategories.map((cat) => {
              return (
                <Link
                  key={cat.id}
                  to={`/home?category=${cat.id}`}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-full border border-red-900/60 light:border-red-200 bg-zinc-950 light:bg-white flex items-center justify-center p-1.5 overflow-hidden hover:border-red-650 transition-colors">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64x64?text=Cat";
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 light:text-gray-500 text-center truncate w-20">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Restored Original Home Page Sections for B2B */}
        
        {/* Brand Logos Scroll */}
        {computedBrands && <BrandLogosScroll brands={computedBrands} />}

        {/* Offer Carousel Section */}
        {offers && (
          <div className="px-4 py-2">
            <OfferCarousel offers={offers} onOfferClick={setSelectedHomeOffer} />
          </div>
        )}



        {/* Featured Vendors Section */}
        {computedVendors && (
          <div id="featured-vendors-section">
            <FeaturedVendorsSection vendors={computedVendors} />
          </div>
        )}

        {/* Animated Promo Banner */}
        {promoBanners && <AnimatedBanner banners={promoBanners} />}

        {/* New Arrivals */}
        {computedNewArrivals && <NewArrivalsSection products={computedNewArrivals} />}

        {/* Most Popular */}
        {computedMostPopular && (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                <span>Most </span>
                <span className="text-[#AE020B] dark:text-[#AE020B]">Popular</span>
              </h2>
              <Link
                to="/search"
                className="text-sm text-primary-600 dark:text-[#AE020B] font-semibold text-zinc-400">
                See All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {computedMostPopular.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={index === 5 ? "xl:hidden" : ""}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Deals */}
        {computedDailyDeals && <DailyDealsSection products={computedDailyDeals} />}

        {/* Refurbished & Renewed Deals */}
        {computedRefurbished && computedRefurbished.length > 0 && (
          <div className="px-4 py-6 bg-gradient-to-br from-cyan-50/20 to-blue-50/20 dark:from-cyan-950/10 dark:to-blue-950/10 border-t border-b border-zinc-900 light:border-gray-100 my-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="bg-gradient-to-r from-red-600 to-[#7B0A0A] text-transparent bg-clip-text">Refurbished & Renewed Deals</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Certified products in like-new condition with full warranty</p>
              </div>
              <Link
                to="/refurbished-categories"
                className="text-sm text-[#7B0A0A] dark:text-[#FF4D4D] font-bold hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {computedRefurbished.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <ProductCard product={product} showCondition={true} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Flash Sale */}
        {computedFlashSale && computedFlashSale.length > 0 && (
          <div className="px-4 py-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-transparent dark:to-transparent dark:bg-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Flash Sale
                </h2>
                <p className="text-xs text-gray-650 dark:text-[#888888]">Limited time offers</p>
              </div>
              <Link
                to="/flash-sale"
                className="text-sm text-primary-600 dark:text-[#7B0A0A] font-semibold text-zinc-400">
                See All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {computedFlashSale.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={index === 5 ? "xl:hidden" : ""}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <ProductCard product={product} isFlashSale={true} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Items */}
        {computedTrending && (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trending Now</h2>
              <Link
                to="/search"
                className="text-sm text-primary-600 dark:text-[#7B0A0A] font-semibold text-zinc-400">
                See All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {computedTrending.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={index === 5 ? "hidden xl:block 2xl:hidden" : ""}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Request Product Button - Hidden as requested by client */}
      {/* 
      <button 
        onClick={() => setIsRfqOpen(true)}
        className="fixed right-4 bottom-20 z-50 flex items-center gap-1.5 px-4 py-2.5 bg-[#AE020B] hover:bg-[#8B0208] text-white font-extrabold text-xs uppercase rounded-full shadow-2xl active:scale-95 transition-all"
      >
        <FiEdit3 className="text-sm shrink-0" />
        <span>Request Product</span>
      </button>
      */}

      {/* General B2B Request Quote Modal */}
      <B2BRequestQuoteModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        product={null}
      />
    </div>
  );
};

export default B2BHome;
