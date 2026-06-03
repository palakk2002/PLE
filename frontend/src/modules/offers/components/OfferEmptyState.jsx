import React from "react";
import { FiPercent } from "react-icons/fi";

export const OfferEmptyState = ({ title = "No Offers Found", message = "Get started by creating a new promotional offer." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1A1310] border border-white/[0.06] rounded-2xl">
      <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-4 text-[#C07A3D]">
        <FiPercent className="text-3xl" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#8E7768] max-w-sm">{message}</p>
    </div>
  );
};

export default OfferEmptyState;
