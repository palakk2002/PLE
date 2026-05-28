import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useCategoryStore } from "../../../../shared/store/categoryStore";
import { categories as fallbackCategories } from "../../../../data/categories";

const normalizeId = (value) => String(value ?? "").trim();

// Map category names to emojis to match the screenshot illustrations style
const categoryEmojis = {
  Clothing: "👕",
  Footwear: "👟",
  Bags: "👜",
  Jewelry: "💍",
  Accessories: "🕶️",
  Athletic: "🏃",
};

const MobileCategoryQuickNav = () => {
  const { categories, initialize, getRootCategories } = useCategoryStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const displayCategories = useMemo(() => {
    const roots = getRootCategories().filter((cat) => cat.isActive !== false);
    const mappedRoots = roots.map((cat) => {
      const fallbackCat = fallbackCategories.find(
        (fc) =>
          normalizeId(fc.id) === normalizeId(cat.id) ||
          fc.name?.toLowerCase() === cat.name?.toLowerCase()
      );
      return {
        ...(fallbackCat || {}),
        ...cat,
      };
    });
    return mappedRoots.length > 0 ? mappedRoots : fallbackCategories;
  }, [categories, getRootCategories]);

  // "All" is active if path is home or root
  const isAllActive = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="bg-[#E8D5FF] md:bg-transparent dark:bg-[#0D0D0D] md:dark:bg-transparent py-2 px-4 select-none relative z-10 overflow-hidden">
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4 items-center">
        {/* "All" Category */}
        <Link
          to="/home"
          className="flex flex-col items-center gap-1 min-w-[56px] relative pb-1.5 cursor-pointer flex-shrink-0"
        >
          <span className="text-xl select-none">🛍️</span>
          <span className={`text-[11px] font-bold text-center transition-colors duration-200 ${
            isAllActive 
              ? "text-black dark:text-white" 
              : "text-gray-600 dark:text-gray-400"
          }`}>
            All
          </span>
          {isAllActive && (
            <motion.div
              layoutId="quickNavUnderline"
              className="absolute bottom-0 left-2 right-2 h-[3px] bg-black dark:bg-[#7B0A0A] rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>

        {/* Dynamic Categories */}
        {displayCategories.map((category) => {
          const isActive = 
            location.pathname === `/category/${category.id}` ||
            location.pathname === `/app/category/${category.id}`;
          const emoji = categoryEmojis[category.name] || "📦";

          return (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center gap-1 min-w-[56px] relative pb-1.5 cursor-pointer flex-shrink-0"
            >
              <span className="text-xl select-none">{emoji}</span>
              <span className={`text-[11px] font-bold text-center transition-colors duration-200 ${
                isActive 
                  ? "text-black dark:text-white" 
                  : "text-gray-600 dark:text-gray-400"
              }`}>
                {category.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="quickNavUnderline"
                  className="absolute bottom-0 left-2 right-2 h-[3px] bg-black dark:bg-[#7B0A0A] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategoryQuickNav;
