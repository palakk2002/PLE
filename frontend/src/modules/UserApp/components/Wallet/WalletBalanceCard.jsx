import React from "react";
import { FiPlus, FiSend, FiRotateCcw } from "react-icons/fi";

const WalletBalanceCard = ({
  balance,
  userName,
  onAddMoney,
  onTransfer,
  onWithdraw,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#AE020B] to-[#7B0A0A] p-6 text-white shadow-xl">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 bg-black/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase tracking-widest text-red-100 font-semibold mb-1">
            WALLET BALANCE
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight">
            ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xs tracking-wider border border-white/10 backdrop-blur-sm">
          PLE
        </div>
      </div>

      <div className="mt-8 flex justify-between items-end">
        <div className="text-xs text-red-100 font-mono">
          {userName || "Premium Customer"}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={onAddMoney}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-[#7B0A0A] text-[10px] sm:text-xs font-bold rounded-xl shadow-md hover:bg-red-50 transition-colors"
          >
            <FiPlus /> Add Money
          </button>
          <button
            onClick={onTransfer}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-xl hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-colors"
          >
            <FiSend /> Transfer
          </button>
          <button
            onClick={onWithdraw}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-xl hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-colors"
          >
            <FiRotateCcw /> Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;
