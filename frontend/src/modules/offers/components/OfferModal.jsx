import React from "react";
import { FiX, FiCalendar, FiUser, FiInfo, FiTag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const OfferModal = ({ isOpen, onClose, offer }) => {
  if (!isOpen || !offer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white dark:bg-[#1A1310] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/[0.06] z-10"
        >
          {/* Header Image / Pattern */}
          <div className="relative h-40 bg-gradient-to-r from-[#120D0B] to-[#2A1F1A]">
            {offer.bannerImage ? (
              <img
                src={offer.bannerImage}
                alt={offer.title}
                className="w-full h-full object-cover opacity-75"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🏷️
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all"
            >
              <FiX className="text-lg" />
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#C07A3D] px-2.5 py-1 rounded-full">
                {offer.offerType}
              </span>
              <h3 className="text-lg font-black text-white mt-2 drop-shadow-md leading-tight">{offer.title}</h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{offer.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gray-50 dark:bg-white/[0.02] rounded-xl text-[#C07A3D]">
                  <FiCalendar className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Validity</p>
                  <p className="text-xs text-gray-700 dark:text-gray-200 font-medium">
                    {offer.startDate} to {offer.endDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gray-50 dark:bg-white/[0.02] rounded-xl text-[#C07A3D]">
                  <FiUser className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Created By</p>
                  <p className="text-xs text-gray-700 dark:text-gray-200 font-medium truncate max-w-[150px]">
                    {offer.createdBy} ({offer.creatorType})
                  </p>
                </div>
              </div>
            </div>

            {offer.couponCode && (
              <div className="bg-[#C07A3D]/5 border border-[#C07A3D]/20 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiTag className="text-[#C07A3D]" />
                  <div>
                    <p className="text-[10px] text-[#C07A3D] font-black uppercase tracking-wider">Use Coupon Code</p>
                    <code className="text-sm font-mono font-bold text-gray-800 dark:text-white">{offer.couponCode}</code>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(offer.couponCode);
                    toast.success("Coupon code copied!");
                  }}
                  className="bg-[#C07A3D] hover:bg-[#C07A3D]/90 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
                >
                  Copy
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100 dark:border-white/[0.06]">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FiInfo className="text-sm" />
                Terms & Conditions
              </h4>
              <p className="text-xs text-gray-500 dark:text-[#8E7768] leading-relaxed">
                {offer.termsAndConditions || "Standard eCommerce promo terms apply. This offer is non-transferable."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OfferModal;
