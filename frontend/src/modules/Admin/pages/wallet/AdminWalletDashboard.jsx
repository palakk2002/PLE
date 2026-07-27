import React, { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiLock,
  FiUnlock,
  FiPlus,
  FiMinus,
  FiActivity,
  FiX
} from "react-icons/fi";
import { useAdminWalletStore } from "../../store/adminWalletStore";
import { useWalletStore } from "../../../../shared/store/walletStore";
import toast from "react-hot-toast";
import { formatPrice } from "../../../../shared/utils/helpers";

const AdminWalletDashboard = () => {
  const {
    stats,
    users,
    pagination,
    selectedUserWallet,
    selectedUserTransactions,
    isLoading,
    fetchDashboardStats,
    searchUsers,
    fetchUserWallet,
    fetchUserTransactions,
    creditUserWallet,
    debitUserWallet,
    toggleFreezeWallet
  } = useAdminWalletStore();

  const { fetchWalletSettings, updateWalletSettings } = useWalletStore();
  const [settingsForm, setSettingsForm] = useState({
    minRecharge: 100,
    maxRecharge: 50000,
    maxBalance: 100000,
    cashbackPercent: 0,
    refundPolicy: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState("credit"); // "credit" | "debit"
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  useEffect(() => {
    fetchDashboardStats();
    searchUsers("", 1, 10);
    fetchWalletSettings().then(res => {
      if (res.success && res.data) {
        setSettingsForm({
          minRecharge: res.data.minRecharge || 100,
          maxRecharge: res.data.maxRecharge || 50000,
          maxBalance: res.data.maxBalance || 100000,
          cashbackPercent: res.data.cashbackPercent || 0,
          refundPolicy: res.data.refundPolicy || ""
        });
      }
    });
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const res = await updateWalletSettings(settingsForm);
    if (res.success) {
      toast.success("Wallet settings updated successfully!");
    } else {
      toast.error(res.error || "Failed to update settings");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchUsers(searchQuery, 1, 10);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchUsers(searchQuery, page, 10);
  };

  const handleSelectUser = async (userId) => {
    setSelectedUserId(userId);
    await fetchUserWallet(userId);
    await fetchUserTransactions(userId, 1, 20);
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    let res;
    if (adjustType === "credit") {
      res = await creditUserWallet(selectedUserId, amount, adjustReason);
    } else {
      res = await debitUserWallet(selectedUserId, amount, adjustReason);
    }

    if (res.success) {
      toast.success("Wallet balance adjusted successfully!");
      setShowAdjustModal(false);
      setAdjustAmount("");
      setAdjustReason("");
      // Refresh views
      fetchDashboardStats();
      searchUsers(searchQuery, currentPage, 10);
      handleSelectUser(selectedUserId);
    } else {
      toast.error(res.error || "Failed to adjust balance");
    }
  };

  const handleToggleFreeze = async (userId, isFrozen) => {
    const res = await toggleFreezeWallet(userId, !isFrozen);
    if (res.success) {
      toast.success(isFrozen ? "Wallet unfrozen successfully!" : "Wallet frozen successfully!");
      searchUsers(searchQuery, currentPage, 10);
      if (selectedUserId === userId) {
        handleSelectUser(userId);
      }
    } else {
      toast.error(res.error || "Failed to update wallet status");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Wallet Management Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-150 dark:border-white/5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-[#7B0A0A] flex items-center justify-center">
            <FiDollarSign className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Balance</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{formatPrice(stats.totalWalletBalance)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-150 dark:border-white/5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 flex items-center justify-center">
            <FiTrendingUp className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Credits</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{formatPrice(stats.totalCredits)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-150 dark:border-white/5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center">
            <FiTrendingDown className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Debits</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{formatPrice(stats.totalDebits)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-150 dark:border-white/5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center">
            <FiClock className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Pending Refunds</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{stats.pendingRefunds}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-150 dark:border-white/5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Completed Refunds</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{stats.completedRefunds}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Search & Selection */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Registered Users</h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search user by name, email or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B0A0A] text-sm"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl text-sm transition-colors"
            >
              Search
            </button>
          </form>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400">
                  <th className="py-3 px-4 font-semibold">User Details</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Wallet Balance</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    onClick={() => handleSelectUser(u._id)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50/50 dark:hover:bg-white/5 ${
                      selectedUserId === u._id ? "bg-red-50/20 dark:bg-red-950/5" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800 dark:text-gray-200">{u.name}</div>
                      <div className="text-xs text-gray-400">{u.email} | {u.phone || "No phone"}</div>
                    </td>
                    <td className="py-3 px-4 capitalize text-xs font-semibold text-gray-500">{u.role}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-850 dark:text-white">
                        {formatPrice(u.wallet?.balance || 0)}
                      </span>
                      {u.wallet?.isFrozen && (
                        <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                          <FiLock className="text-[8px]" /> Frozen
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUserId(u._id);
                            handleSelectUser(u._id);
                            setAdjustType("credit");
                            setShowAdjustModal(true);
                          }}
                          className="p-1.5 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          title="Credit Wallet"
                        >
                          <FiPlus />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserId(u._id);
                            handleSelectUser(u._id);
                            setAdjustType("debit");
                            setShowAdjustModal(true);
                          }}
                          className="p-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                          title="Debit Wallet"
                        >
                          <FiMinus />
                        </button>
                        <button
                          onClick={() => handleToggleFreeze(u._id, !!u.wallet?.isFrozen)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.wallet?.isFrozen
                              ? "bg-green-50 dark:bg-green-950/20 text-green-600 hover:bg-green-100"
                              : "bg-red-50 dark:bg-red-950/20 text-[#7B0A0A] hover:bg-red-100"
                          }`}
                          title={u.wallet?.isFrozen ? "Unfreeze Wallet" : "Freeze Wallet"}
                        >
                          {u.wallet?.isFrozen ? <FiUnlock /> : <FiLock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                disabled={currentPage <= 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-100 dark:bg-white/5 border border-gray-250 dark:border-white/5 rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-500 py-1.5">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                disabled={currentPage >= pagination.pages || isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-100 dark:bg-white/5 border border-gray-250 dark:border-white/5 rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Selected User Wallet Details & Transactions */}
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4">
          {selectedUserWallet ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
                Selected User Detail
              </h2>
              <div className="bg-gray-50 dark:bg-[#222] p-4 rounded-xl space-y-2">
                <div className="text-sm font-bold text-gray-800 dark:text-white">
                  {selectedUserWallet.user.name}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedUserWallet.user.email}
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
                  <span className="text-xs font-semibold text-gray-400">Current Balance</span>
                  <span className="text-base font-extrabold text-[#7B0A0A]">
                    {formatPrice(selectedUserWallet.wallet.balance)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-semibold mt-1">
                  <div>In: {formatPrice(selectedUserWallet.wallet.totalCredit)}</div>
                  <div>Out: {formatPrice(selectedUserWallet.wallet.totalDebit)}</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                    <FiActivity /> Recent Activity
                  </h3>
                  {selectedUserTransactions && selectedUserTransactions.length > 0 && (
                    <button
                      onClick={() => {
                        let csvContent = "data:text/csv;charset=utf-8,";
                        csvContent += "Transaction ID,Date,Type,Category,Amount,Balance After,Description\n";
                        selectedUserTransactions.forEach((tx) => {
                          const date = new Date(tx.createdAt).toLocaleDateString();
                          csvContent += `"${tx._id}","${date}","${tx.type}","${tx.transactionCategory}",${tx.amount},${tx.balanceAfterTransaction},"${tx.description}"\n`;
                        });
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `wallet_user_${selectedUserId}_statement.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success("Statement exported successfully!");
                      }}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg hover:underline"
                    >
                      Export CSV
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedUserTransactions.map((tx) => {
                    const isCredit = tx.type === "credit";
                    return (
                      <div
                        key={tx._id}
                        className="p-2 border-b border-gray-100 dark:border-white/5 flex justify-between items-start text-xs"
                      >
                        <div>
                          <div className="font-bold text-gray-850 dark:text-white capitalize">
                            {tx.transactionCategory.replace("_", " ")}
                          </div>
                          <div className="text-[10px] text-gray-450 mt-0.5">{tx.description}</div>
                          <div className="text-[8px] text-gray-400 mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                          {isCredit ? "+" : "-"} {formatPrice(tx.amount)}
                        </div>
                      </div>
                    );
                  })}
                  {selectedUserTransactions.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400">No transaction logs available.</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4 text-xs text-gray-400 border-b border-gray-100 dark:border-white/5">
                Select a user from the list to view wallet balance and transaction logs.
              </div>
              
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">
                  Wallet Global Settings
                </h2>
                <form onSubmit={handleSaveSettings} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Min Recharge</label>
                      <input
                        type="number"
                        value={settingsForm.minRecharge}
                        onChange={e => setSettingsForm({ ...settingsForm, minRecharge: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-lg focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Max Recharge</label>
                      <input
                        type="number"
                        value={settingsForm.maxRecharge}
                        onChange={e => setSettingsForm({ ...settingsForm, maxRecharge: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-lg focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Max Balance</label>
                      <input
                        type="number"
                        value={settingsForm.maxBalance}
                        onChange={e => setSettingsForm({ ...settingsForm, maxBalance: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-lg focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Cashback %</label>
                      <input
                        type="number"
                        value={settingsForm.cashbackPercent}
                        onChange={e => setSettingsForm({ ...settingsForm, cashbackPercent: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-lg focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Refund Policy</label>
                    <textarea
                      value={settingsForm.refundPolicy}
                      onChange={e => setSettingsForm({ ...settingsForm, refundPolicy: e.target.value })}
                      rows="2"
                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-lg focus:outline-none text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#7B0A0A] hover:bg-[#AE020B] text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-md"
                  >
                    Save Settings
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit / Debit Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-2">
              <h3 className="text-lg font-bold capitalize text-gray-800 dark:text-white">
                {adjustType} Wallet Balance
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Amount (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-xl focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Reason / Description</label>
                <textarea
                  required
                  placeholder="Adjustment reason..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 dark:bg-[#222] dark:text-white rounded-xl focus:outline-none text-sm"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl text-sm transition-colors"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletDashboard;
