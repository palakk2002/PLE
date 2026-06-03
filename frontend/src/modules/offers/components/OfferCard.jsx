import React, { useState } from "react";
import { FiCopy, FiCheck, FiInfo } from "react-icons/fi";
import toast from "react-hot-toast";

export const OfferCard = ({ offer, onViewDetails }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!offer.couponCode) return;

    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getOfferIcon = (type) => {
    if (type.includes("Bank")) return "🏦";
    if (type.includes("Cashback")) return "🎁";
    if (type.includes("Free Shipping")) return "🚚";
    return "🏷️";
  };

  return (
    <div className="relative bg-white dark:bg-[#1A1310] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getOfferIcon(offer.offerType)}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C07A3D] bg-[#C07A3D]/10 px-2 py-0.5 rounded-full">
              {offer.offerType}
            </span>
          </div>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(offer)}
              className="text-[#8E7768] hover:text-[#C07A3D] p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
            >
              <FiInfo className="text-sm" />
            </button>
          )}
        </div>

        <h4 className="text-sm font-extrabold text-gray-800 dark:text-white leading-snug">{offer.title}</h4>
        <p className="text-xs text-gray-500 dark:text-[#8E7768] mt-1 leading-normal">{offer.subtitle}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-gray-100 dark:border-white/[0.06]">
        {offer.couponCode ? (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-white/[0.02] p-2 rounded-xl border border-gray-100 dark:border-white/[0.04]">
            <code className="text-xs font-mono font-bold text-gray-700 dark:text-white">{offer.couponCode}</code>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] font-bold text-[#C07A3D] hover:bg-[#C07A3D]/10 px-2 py-1 rounded-lg transition-all"
            >
              {copied ? (
                <>
                  <FiCheck className="text-green-500" />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <FiCopy />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-[10px] text-gray-400 dark:text-[#8E7768] font-semibold italic">
            * Discount applied automatically
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
