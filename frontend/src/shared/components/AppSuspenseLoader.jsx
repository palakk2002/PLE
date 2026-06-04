import React from "react";
import { motion } from "framer-motion";

const AppSuspenseLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200000] flex flex-col items-center justify-center bg-white dark:bg-[#0D0D0D] select-none"
    >
      {/* Brand Indicator Container */}
      <div className="flex flex-col items-center gap-4">
        {/* Animated Custom Ring Spinner */}
        <div className="relative w-12 h-12">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-100 dark:border-neutral-800"></div>
          {/* Outer active rotating arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-t-[#AE020B] border-r-[#AE020B] border-transparent"
          ></motion.div>
        </div>
        
        {/* Subtle loading text */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-neutral-500 animate-pulse">
          Loading App
        </span>
      </div>
    </motion.div>
  );
};

export default AppSuspenseLoader;
