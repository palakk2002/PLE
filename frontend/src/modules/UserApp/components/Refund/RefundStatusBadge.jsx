import React from "react";
import { FiCreditCard, FiFolder } from "react-icons/fi";

const RefundStatusBadge = ({ destination }) => {
  const isWallet = destination === "Wallet";

  return (
    <div className="flex items-center gap-2 mt-1 bg-gray-50 dark:bg-white/5 border border-gray-150 dark:border-white/5 rounded-xl px-3 py-2 w-full">
      {isWallet ? (
        <FiFolder className="text-[#7B0A0A] text-sm flex-shrink-0" />
      ) : (
        <FiCreditCard className="text-gray-500 dark:text-gray-400 text-sm flex-shrink-0" />
      )}
      <div className="min-w-0">
        <span className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase tracking-wider font-semibold">
          Refund Destination
        </span>
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
          {isWallet ? "Wallet" : "Original Payment Method"}
        </span>
      </div>
    </div>
  );
};

export default RefundStatusBadge;
