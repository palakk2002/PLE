import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useCategoryStore } from "../../../../shared/store/categoryStore";
import { categories as fallbackCategories } from "../../../../data/categories";
import LucideIcon from "../../../../shared/components/LucideIcon";

const normalizeId = (value) => String(value ?? "").trim();

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

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const activeQueryId = queryParams.get("category");

  // "All" is active if path is home or root and no category query param
  const isAllActive = (location.pathname === "/" || location.pathname === "/home") && !activeQueryId;

  return (
    <div className="bg-[#7B0A0A] md:bg-transparent dark:bg-[#0D0D0D] md:dark:bg-transparent py-1 px-4 select-none relative z-10 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4 items-center">
        {/* "All" Category */}
        <Link
          to="/home"
          className="flex flex-col items-center gap-1 min-w-[48px] relative pb-1 cursor-pointer flex-shrink-0"
        >
          <LucideIcon
            name="ShoppingBag"
            size={18}
            className={`transition-colors duration-200 ${
              isAllActive 
                ? "text-white dark:text-white md:text-primary-600 md:dark:text-white" 
                : "text-white/70 dark:text-white/60 md:text-gray-500 md:dark:text-gray-400"
            }`}
          />
          <span className={`text-[10px] font-bold text-center transition-colors duration-200 ${
            isAllActive 
              ? "text-white dark:text-white md:text-primary-600 md:dark:text-white" 
              : "text-white/70 dark:text-white/60 md:text-gray-500 md:dark:text-gray-400"
          }`}>
            All
          </span>
          {isAllActive && (
            <motion.div
              layoutId="quickNavUnderline"
              className="absolute bottom-0 left-1.5 right-1.5 h-[2.5px] bg-white dark:bg-red-500 md:bg-primary-600 md:dark:bg-red-500"
              transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
            />
          )}
        </Link>

        {/* Dynamic Categories */}
        {displayCategories.map((category) => {
          const isActive = activeQueryId === String(category.id);
          const iconColorClass = isActive 
            ? "text-white dark:text-white md:text-primary-600 md:dark:text-white" 
            : "text-white/70 dark:text-white/60 md:text-gray-500 md:dark:text-gray-400";

          return (
            <Link
              key={category.id}
              to={`/home?category=${category.id}`}
              className="flex flex-col items-center gap-1 min-w-[48px] relative pb-1 cursor-pointer flex-shrink-0"
            >
              <LucideIcon
                name={category.icon}
                size={18}
                className={`transition-colors duration-200 ${iconColorClass}`}
              />
              <span className={`text-[10px] font-bold text-center transition-colors duration-200 ${
                isActive 
                  ? "text-white dark:text-white md:text-primary-600 md:dark:text-white" 
                  : "text-white/70 dark:text-white/60 md:text-gray-500 md:dark:text-gray-400"
              }`}>
                {category.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="quickNavUnderline"
                  className="absolute bottom-0 left-1.5 right-1.5 h-[2.5px] bg-white dark:bg-red-500 md:bg-primary-600 md:dark:bg-red-500"
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
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
