import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiPlus,
  FiSend,
  FiRotateCcw,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiShoppingBag,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import { useAuthStore } from "../../../shared/store/authStore";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import toast from "react-hot-toast";

const MobileWallet = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem(`wallet_balance_${user?.id || "guest"}`);
    return savedBalance ? parseFloat(savedBalance) : 1500.0;
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem(`wallet_txs_${user?.id || "guest"}`);
    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [
          {
            id: "TXN10023901",
            type: "credit",
            title: "Sign Up Reward",
            amount: 500.0,
            date: "2026-06-01T10:30:00Z",
            description: "Welcome bonus credited to wallet",
          },
          {
            id: "TXN10024098",
            type: "debit",
            title: "Paid for Order #98102",
            amount: 350.0,
            date: "2026-06-03T15:45:00Z",
            description: "Order payment debit",
          },
          {
            id: "TXN10025211",
            type: "credit",
            title: "Cashback Received",
            amount: 50.0,
            date: "2026-06-04T09:12:00Z",
            description: "Promo campaign cashback reward",
          },
        ];
  });

  const [activeTab, setActiveTab] = useState("all"); // 'all', 'credit', 'debit'
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showWithdrawMoney, setShowWithdrawMoney] = useState(false);

  // Form states
  const [addAmount, setAddAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card', 'upi'
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Persist balance and transactions
  useEffect(() => {
    localStorage.setItem(`wallet_balance_${user?.id || "guest"}`, balance.toString());
  }, [balance, user]);

  useEffect(() => {
    localStorage.setItem(`wallet_txs_${user?.id || "guest"}`, JSON.stringify(transactions));
  }, [transactions, user]);

  const handleAddMoney = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(addAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (paymentMethod === "card" && !cardNumber.trim()) {
      toast.error("Please enter your card number");
      return;
    }

    if (paymentMethod === "upi" && !upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    // Process deposit
    const newTx = {
      id: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
      type: "credit",
      title: "Deposited Funds",
      amount: amountVal,
      date: new Date().toISOString(),
      description: `Added money via ${paymentMethod.toUpperCase()}`,
    };

    setBalance((prev) => prev + amountVal);
    setTransactions((prev) => [newTx, ...prev]);
    toast.success(`₹${amountVal.toFixed(2)} added to your wallet!`);
    
    // Reset form
    setAddAmount("");
    setCardNumber("");
    setUpiId("");
    setShowAddMoney(false);
  };

  const handleSendMoney = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(sendAmount);
    if (!sendRecipient.trim()) {
      toast.error("Please enter recipient email or phone");
      return;
    }
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amountVal > balance) {
      toast.error("Insufficient wallet balance");
      return;
    }

    // Process send
    const newTx = {
      id: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
      type: "debit",
      title: `Sent to ${sendRecipient}`,
      amount: amountVal,
      date: new Date().toISOString(),
      description: `Transferred funds to ${sendRecipient}`,
    };

    setBalance((prev) => prev - amountVal);
    setTransactions((prev) => [newTx, ...prev]);
    toast.success(`₹${amountVal.toFixed(2)} transferred successfully!`);

    // Reset form
    setSendRecipient("");
    setSendAmount("");
    setShowSendMoney(false);
  };

  const handleWithdrawMoney = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amountVal > balance) {
      toast.error("Insufficient wallet balance");
      return;
    }
    if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      toast.error("Please fill all bank details");
      return;
    }

    // Process withdraw
    const newTx = {
      id: `TXN${Math.floor(10000000 + Math.random() * 90000000)}`,
      type: "debit",
      title: "Withdrawal to Bank",
      amount: amountVal,
      date: new Date().toISOString(),
      description: `Withdrew to ${bankName} A/C: ****${accountNumber.slice(-4)}`,
    };

    setBalance((prev) => prev - amountVal);
    setTransactions((prev) => [newTx, ...prev]);
    toast.success(`₹${amountVal.toFixed(2)} withdrawal requested successfully!`);

    // Reset form
    setWithdrawAmount("");
    setBankName("");
    setAccountNumber("");
    setIfscCode("");
    setShowWithdrawMoney(false);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "credit") return tx.type === "credit";
    if (activeTab === "debit") return tx.type === "debit";
    return true;
  });

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full pb-24 lg:pb-12 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200">
          
          {/* Header */}
          <div className="px-4 py-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/10 sticky top-0 z-30 shadow-sm flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-700 dark:text-gray-200"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">My Wallet</h1>
          </div>

          <div className="p-4 space-y-6">
            
            {/* Visual Balance Card */}
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
                  {user?.name || "Premium Customer"}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => setShowAddMoney(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-[#7B0A0A] text-[10px] sm:text-xs font-bold rounded-xl shadow-md hover:bg-red-50 transition-colors"
                  >
                    <FiPlus /> Add Money
                  </button>
                  <button
                    onClick={() => setShowSendMoney(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-xl hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-colors"
                  >
                    <FiSend /> Transfer
                  </button>
                  <button
                    onClick={() => setShowWithdrawMoney(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-xl hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-colors"
                  >
                    <FiRotateCcw /> Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions / Toggles */}
            <div className="flex justify-between items-center px-1">
              <h3 className="font-extrabold text-gray-800 dark:text-white text-base">Transactions</h3>
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                {["all", "credit", "debit"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                      activeTab === tab
                        ? "bg-white dark:bg-[#252525] text-[#7B0A0A] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Log */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
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
                            tx.type === "credit"
                              ? "bg-red-50 dark:bg-red-950/20 text-[#7B0A0A]"
                              : "bg-red-50 dark:bg-red-950/20 text-red-600"
                          }`}
                        >
                          {tx.type === "credit" ? (
                            <FiTrendingUp className="text-lg" />
                          ) : (
                            <FiTrendingDown className="text-lg" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate">
                            {tx.title}
                          </h4>
                          <p className="text-gray-400 dark:text-gray-500 text-xs">
                            {new Date(tx.date).toLocaleDateString("en-IN", {
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
                            tx.type === "credit" ? "text-[#7B0A0A]" : "text-red-600"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"} ₹{tx.amount.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono tracking-tighter">
                          {tx.id}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated Add Money Drawer */}
            {createPortal(
              <AnimatePresence>
                {showAddMoney && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowAddMoney(false)}
                      className="fixed inset-0 bg-black/40 z-[10000] backdrop-blur-sm"
                    />
                    {/* Content Sheet */}
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25 }}
                      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-white/10 rounded-t-3xl p-5 pb-6 z-[10001] shadow-2xl max-w-4xl mx-auto"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-white">Add Money</h3>
                        <button
                          onClick={() => setShowAddMoney(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleAddMoney} className="space-y-3">
                        {/* Amount Input */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                            Enter Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white font-extrabold text-base text-[#7B0A0A] focus:outline-none focus:ring-2 focus:ring-[#7B0A0A]"
                            required
                          />
                        </div>

                        {/* Fast Options */}
                        <div className="flex gap-2">
                          {[500, 1000, 2000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setAddAmount(amt.toString())}
                              className="flex-1 py-1.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
                            >
                              +₹{amt}
                            </button>
                          ))}
                        </div>

                        {/* Payment Methods */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                            Select Payment Method
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("card")}
                              className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors ${
                                paymentMethod === "card"
                                  ? "border-[#7B0A0A] bg-red-50/50 dark:bg-red-950/20 text-[#7B0A0A]"
                                  : "border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              <FiCreditCard className="text-sm" /> Credit/Debit Card
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod("upi")}
                              className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors ${
                                paymentMethod === "upi"
                                  ? "border-[#7B0A0A] bg-red-50/50 dark:bg-red-950/20 text-[#7B0A0A]"
                                  : "border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              <FiDollarSign className="text-sm" /> UPI Address
                            </button>
                          </div>
                        </div>

                        {/* Dynamic Payment Method fields */}
                        {paymentMethod === "card" ? (
                          <div>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="Card Number (e.g. 4111 2222 3333 4444)"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white text-xs focus:outline-none"
                              required
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="UPI ID (e.g. user@upi)"
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white text-xs focus:outline-none"
                              required
                            />
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl text-xs transition-colors shadow-lg"
                        >
                          Add to Wallet
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>,
              document.body
            )}

            {/* Simulated Transfer Drawer */}
            {createPortal(
              <AnimatePresence>
                {showSendMoney && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowSendMoney(false)}
                      className="fixed inset-0 bg-black/40 z-[10000] backdrop-blur-sm"
                    />
                    {/* Content Sheet */}
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25 }}
                      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-white/10 rounded-t-3xl p-5 pb-6 z-[10001] shadow-2xl max-w-4xl mx-auto"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-white">Transfer Balance</h3>
                        <button
                          onClick={() => setShowSendMoney(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSendMoney} className="space-y-3">
                        {/* Recipient */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                            Recipient Phone or Email
                          </label>
                          <input
                            type="text"
                            value={sendRecipient}
                            onChange={(e) => setSendRecipient(e.target.value)}
                            placeholder="e.g. friend@example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white text-xs focus:outline-none"
                            required
                          />
                        </div>

                        {/* Transfer Amount */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                            Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white font-extrabold text-base focus:outline-none"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl text-xs transition-colors shadow-lg"
                        >
                          Send Money
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>,
              document.body
            )}

            {/* Simulated Withdraw Drawer */}
            {createPortal(
              <AnimatePresence>
                {showWithdrawMoney && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowWithdrawMoney(false)}
                      className="fixed inset-0 bg-black/40 z-[10000] backdrop-blur-sm"
                    />
                    {/* Content Sheet */}
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25 }}
                      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-white/10 rounded-t-3xl p-5 pb-6 z-[10001] shadow-2xl max-w-4xl mx-auto"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-white">Withdraw Funds</h3>
                        <button
                          onClick={() => setShowWithdrawMoney(false)}
                          className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleWithdrawMoney} className="space-y-2.5">
                        {/* Amount */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                              Amount (₹)
                            </label>
                            <input
                              type="number"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="Amount"
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white font-extrabold text-sm focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="e.g. HDFC"
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white text-xs focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        {/* Account details */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                              Account Number
                            </label>
                            <input
                              type="text"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              placeholder="Account Number"
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white text-xs focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                              IFSC Code
                            </label>
                            <input
                              type="text"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value)}
                              placeholder="IFSC Code"
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white text-xs focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl text-xs transition-colors shadow-lg mt-1"
                        >
                          Request Withdrawal
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>,
              document.body
            )}

          </div>

        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileWallet;
