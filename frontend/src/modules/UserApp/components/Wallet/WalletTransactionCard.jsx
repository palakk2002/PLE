import React from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const WalletTransactionCard = ({ tx }) => {
  const isCredit = tx.type === "credit" || tx.type === "Refund Credit";

  return (
    <motion.div
      key={tx.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCredit
              ? "bg-red-50 dark:bg-red-950/20 text-[#7B0A0A]"
              : "bg-red-50 dark:bg-red-950/20 text-red-600"
          }`}
        >
          {isCredit ? (
            <FiTrendingUp className="text-lg" />
          ) : (
            <FiTrendingDown className="text-lg" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">
            {tx.title || tx.description || 'Transaction'}
          </h4>
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            {new Date(tx.date || tx.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span
          className={`font-extrabold text-sm ${
            isCredit ? "text-[#7B0A0A]" : "text-red-600"
          }`}
        >
          {isCredit ? "+" : "-"} ₹{tx.amount.toFixed(2)}
        </span>
        <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
          {tx.id}
        </p>
      </div>
    </motion.div>
  );
};

export default WalletTransactionCard;
