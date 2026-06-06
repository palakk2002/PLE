import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiEdit, FiX, FiCheck } from "react-icons/fi";
import { useLoyaltyStore } from "../../../../shared/store/loyaltyStore";
import toast from "react-hot-toast";

const UserPoints = () => {
  const { users, updateUserPoints } = useLoyaltyStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState("add"); // "add" | "deduct"

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setAdjustAmount("");
    setAdjustType("add");
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleAdjustPoints = (e) => {
    e.preventDefault();
    const amount = parseInt(adjustAmount, 10);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid points amount");
      return;
    }

    const diff = adjustType === "add" ? amount : -amount;
    
    if (adjustType === "deduct" && amount > selectedUser.currentPoints) {
      toast.error(`Cannot deduct more than the user's current points (${selectedUser.currentPoints} Pts)`);
      return;
    }

    updateUserPoints(selectedUser.id, diff, "adjust");
    toast.success(
      `Successfully ${adjustType === "add" ? "added" : "deducted"} ${amount} points for ${selectedUser.name}`
    );
    handleCloseModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">User Points Management</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage member loyalty balances, review earnings, and issue manual adjustments.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-250/70 focus:outline-none focus:border-amber-500 bg-white transition-colors text-sm"
          />
        </div>
      </div>

      {/* Users Points Table */}
      <div className="bg-white border border-gray-250/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-wider border-b border-gray-150">
              <tr>
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6 text-center">Current Points</th>
                <th className="py-4 px-6 text-center">Lifetime Earned</th>
                <th className="py-4 px-6 text-center">Lifetime Redeemed</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-850">{user.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                  </td>
                  <td className="py-4 px-6 text-center font-black text-amber-600 text-base">
                    {user.currentPoints} Pts
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-emerald-600">
                    {user.earnedPoints}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-rose-500">
                    {user.redeemedPoints}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/60 px-3.5 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <FiEdit />
                      <span>Adjust Balance</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-semibold">
                    No users matching search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Points Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-gray-150 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Adjust Loyalty Points</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedUser.name}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleAdjustPoints} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Adjustment Action</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAdjustType("add")}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        adjustType === "add"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span>➕ Add Points</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType("deduct")}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        adjustType === "deduct"
                          ? "border-rose-500 bg-rose-50 text-rose-800"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span>➖ Deduct Points</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Points Quantity</label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Enter points value"
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-250 focus:outline-none focus:border-amber-500 text-base"
                  />
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">
                    Current Balance: {selectedUser.currentPoints} Pts
                  </p>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow shadow-amber-250 flex items-center justify-center gap-1.5"
                  >
                    <FiCheck />
                    <span>Apply Adjustment</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserPoints;
