import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiAward, FiRotateCcw, FiUsers, FiTrendingUp } from "react-icons/fi";
import api from "../../../../shared/utils/api";

const LoyaltyDashboard = () => {
  const [statsData, setStatsData] = useState({
    totalIssued: 0,
    totalRedeemed: 0,
    activeMembers: 0,
    outstandingPoints: 0
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, historyRes] = await Promise.all([
          api.get('/admin/loyalty/stats'),
          api.get('/admin/loyalty/transactions')
        ]);
        setStatsData(statsRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error("Failed to fetch loyalty data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalIssued = statsData.totalIssued;
  const totalRedeemed = statsData.totalRedeemed;
  const activeMembers = statsData.activeMembers;
  const outstandingPoints = statsData.outstandingPoints;

  const stats = [
    {
      title: "Total Points Issued",
      value: totalIssued,
      change: "+15% this month",
      icon: FiTrendingUp,
      color: "from-blue-500 to-indigo-650",
      bg: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Total Points Redeemed",
      value: totalRedeemed,
      change: "+8% this month",
      icon: FiRotateCcw,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Active Members",
      value: activeMembers,
      change: "4 registered accounts",
      icon: FiUsers,
      color: "from-purple-500 to-indigo-600",
      bg: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "Outstanding Points",
      value: outstandingPoints,
      change: "Liability value",
      icon: FiAward,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Loyalty Program Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Monitor your customer loyalty points metrics, issue history, and outstanding liabilities.
        </p>
      </div>

      {/* Metrics Cards */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 font-semibold">Loading stats...</div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-250/60 shadow-sm hover:shadow transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                  <Icon className="text-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-2">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Recent Points Transactions */}
      <div className="bg-white border border-gray-250/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-extrabold text-gray-800 text-base">Recent System Transactions</h3>
          <p className="text-xs text-gray-500 mt-0.5">Logs of points earned and redeemed by buyers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-wider border-b border-gray-150">
              <tr>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Order Ref</th>
                <th className="py-4 px-6 text-center">Points Earned</th>
                <th className="py-4 px-6 text-center">Points Redeemed</th>
                <th className="py-4 px-6 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 font-semibold">Loading transactions...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-semibold">
                    No points transactions found.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-55/40 transition-colors">
                    <td className="py-4 px-6 font-medium">
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-bold text-primary-650">
                      {item.orderRef}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.earnedPoints > 0 ? (
                        <span className="inline-flex items-center text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          +{item.earnedPoints}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.redeemedPoints > 0 ? (
                        <span className="inline-flex items-center text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                          -{item.redeemedPoints}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-gray-800">
                      {item.balance}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default LoyaltyDashboard;
