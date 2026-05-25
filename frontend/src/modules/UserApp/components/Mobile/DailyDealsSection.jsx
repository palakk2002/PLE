import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiClock, FiZap } from "react-icons/fi";
import ProductCard from "../../../../shared/components/ProductCard";
import { getDailyDeals } from "../../data/catalogData";

const DailyDealsSection = ({ products = null }) => {
  const fallback = getDailyDeals().slice(0, 5);
  const dailyDeals = Array.isArray(products) && products.length > 0
    ? products.slice(0, 5)
    : fallback;
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Countdown timer - resets daily
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value) => {
    return value.toString().padStart(2, "0");
  };

  if (dailyDeals.length === 0) {
    return null;
  }

  return (
    <div className="relative my-4 rounded-2xl overflow-hidden shadow-xl border-2 border-red-200 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 dark:border-dark-accent/20 dark:bg-gradient-to-br dark:from-[#1E1512] dark:via-[#1A1310] dark:to-[#120D0B] dark:shadow-[0_0_40px_rgba(192,122,61,0.12)]">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-dark-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white dark:bg-dark-accent/10 rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative px-3 py-5">
        {/* Header with Badge */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 dark:bg-dark-accent/20 backdrop-blur-sm rounded-full p-2 md:p-3 dark:text-dark-accent dark:shadow-[0_0_15px_rgba(192,122,61,0.3)]">
                <FiZap className="text-white dark:text-dark-accent text-lg md:text-2xl" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-extrabold text-white dark:text-gradient drop-shadow-lg dark:drop-shadow-none uppercase tracking-tight">
                  Daily Deals
                </h2>
                <p className="text-xs md:text-sm text-white/90 dark:text-[#C8B3A3] font-medium">
                  Limited time offers - Up to 70% OFF
                </p>
              </div>
            </div>
            <Link
              to="/daily-deals"
              className="bg-white/20 dark:bg-dark-accent/10 dark:text-dark-accent dark:border dark:border-dark-accent/20 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-white/30 dark:hover:bg-dark-accent/20 transition-all">
              See All
            </Link>
          </div>

          {/* Prominent Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1A1310] rounded-xl p-4 shadow-2xl border-2 border-white/50 dark:border-dark-accent/25">
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-700 dark:text-[#C8B3A3]/80 mb-2 ml-11">
                Deal ends in
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 dark:from-[#C07A3D] dark:to-[#9A5420] rounded-md p-1.5 shadow-md dark:shadow-[0_0_10px_rgba(192,122,61,0.2)] transform translate-y-[2px]">
                  <FiClock className="text-white text-base" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 dark:from-[#C07A3D] dark:to-[#9A5420] text-white rounded-lg px-2.5 py-1.5 min-w-[2.8rem] text-center shadow-lg dark:shadow-[0_4px_12px_rgba(192,122,61,0.25)] border border-white/20 dark:border-dark-accent/30">
                    <div className="text-base font-extrabold leading-tight">
                      {formatTime(timeLeft.hours)}
                    </div>
                    <div className="text-[8px] opacity-90 font-medium uppercase">Hrs</div>
                  </div>
                  <span className="text-red-500 dark:text-dark-accent font-bold text-lg">:</span>
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 dark:from-[#C07A3D] dark:to-[#9A5420] text-white rounded-lg px-2.5 py-1.5 min-w-[2.8rem] text-center shadow-lg dark:shadow-[0_4px_12px_rgba(192,122,61,0.25)] border border-white/20 dark:border-dark-accent/30">
                    <div className="text-base font-extrabold leading-tight">
                      {formatTime(timeLeft.minutes)}
                    </div>
                    <div className="text-[8px] opacity-90 font-medium uppercase">Min</div>
                  </div>
                  <span className="text-red-500 dark:text-dark-accent font-bold text-lg">:</span>
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 dark:from-[#C07A3D] dark:to-[#9A5420] text-white rounded-lg px-2.5 py-1.5 min-w-[2.8rem] text-center shadow-lg dark:shadow-[0_4px_12px_rgba(192,122,61,0.25)] border border-white/20 dark:border-dark-accent/30 animate-pulse">
                    <div className="text-base font-extrabold leading-tight">
                      {formatTime(timeLeft.seconds)}
                    </div>
                    <div className="text-[8px] opacity-90 font-medium uppercase">Sec</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {dailyDeals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full">
              <ProductCard product={product} isFlashSale={true} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyDealsSection;
