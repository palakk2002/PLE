import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLayers,
  FiPercent,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUpRight,
  FiActivity,
  FiAward,
} from "react-icons/fi";
import api from "../../../../shared/utils/api";

const RefurbishedDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [stats, setStats] = useState({
    totalListings: 0,
    approved: 0,
    pendingApproval: 0,
    rejected: 0,
    advanced: {
      sales: 0,
      salesChange: "+0% MoM",
      revenue: 0,
      revenueChange: "+0% MoM",
      returnRatio: "0.0",
      topSellers: [],
      returnStats: [],
      monthlyRevenue: [0, 0, 0, 0, 0]
    }
  });

  // Chart Path Generator for smooth curves
  const generateSmoothPath = (points) => {
    if (!points || points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/refurbished-stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch refurbished stats", err);
      }
    };
    fetchStats();
  }, []);

  // Hybrid QC Metrics Data (Real + Visual Mock)
  const qcMetrics = [
    {
      label: "Pending Reviews",
      value: stats.pendingApproval,
      change: "Action needed",
      isPositive: false,
      icon: FiClock,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50 border-amber-100",
    },
    {
      label: "Approved Refurbished",
      value: stats.approved,
      change: "Live listings",
      isPositive: true,
      icon: FiCheckCircle,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Rejected Listings",
      value: stats.rejected,
      change: "Needs review",
      isPositive: false,
      icon: FiXCircle,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-600",
      bgLight: "bg-rose-50 border-rose-100",
    },
    {
      label: "Total Quality Checked",
      value: stats.totalListings,
      change: "Total processed",
      isPositive: true,
      icon: FiLayers,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50 border-blue-100",
    },
    {
      label: "Refurbished Return Ratio",
      value: `${stats.advanced?.returnRatio || "0.0"}%`,
      change: "-0.4% vs B2C average",
      isPositive: true,
      icon: FiPercent,
      color: "from-purple-500 to-indigo-700",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50 border-purple-100",
    },
  ];

  // Dynamic Refurbished Analytics Data from Backend
  const approvalRatioNum = stats.totalListings > 0 ? ((stats.approved / stats.totalListings) * 100).toFixed(1) : "0.0";
  const analyticsSummary = {
    sales: `${stats.advanced?.sales || 0} units`,
    salesChange: stats.advanced?.salesChange || "+0% MoM",
    revenue: `₹${(stats.advanced?.revenue || 0).toLocaleString()}`,
    revenueChange: stats.advanced?.revenueChange || "+0% MoM",
    approvalRatio: `${approvalRatioNum}%`,
    topSellers: stats.advanced?.topSellers || [],
    returnStats: stats.advanced?.returnStats || []
  };

  // Generate dynamic chart points based on monthlyRevenue
  const monthlyRevenue = stats.advanced?.monthlyRevenue || [0, 0, 0, 0, 0];
  const maxRevenue = Math.max(...monthlyRevenue) || 1;
  const chartPoints = monthlyRevenue.map((rev, i) => ({
    x: i * 125, // 500 width / 4 intervals = 125
    y: 160 - (rev / maxRevenue) * 140, // 160 max Y, 20 top padding
  }));
  const chartPath = generateSmoothPath(chartPoints);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <FiActivity className="text-[#C07A3D]" />
            QC & Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Real-time quality metrics, product checking pipeline, and refurbished selling performance.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {["7d", "30d", "12m"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${selectedPeriod === period
                  ? "bg-[#C07A3D] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* QC metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {qcMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-gray-200/80`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {metric.label}
                </span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-sm`}>
                  <Icon className="text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {metric.value}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold ${metric.isPositive ? "text-emerald-600" : "text-amber-600"
                    }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visual Analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Refurbished Sales Revenue Trend</h3>
              <p className="text-xs text-gray-500">Visualizing monthly revenue performance</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">{analyticsSummary.revenue}</span>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                <FiArrowUpRight /> {analyticsSummary.revenueChange}
              </p>
            </div>
          </div>

          {/* Clean SVG Area Chart */}
          <div className="w-full h-56 pt-2">
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C07A3D" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C07A3D" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />

              {/* Area path */}
              <path
                d={`${chartPath} L 500 160 L 0 160 Z`}
                fill="url(#chartGlow)"
              />
              {/* Stroke line */}
              <path
                d={chartPath}
                fill="none"
                stroke="#C07A3D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Dynamic Points */}
              {chartPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="5" fill="#C07A3D" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-2 px-1">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May (Current)</span>
          </div>
        </div>

        {/* Return Statistics Widget */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Return Rates by Condition</h3>
            <p className="text-xs text-gray-500 mb-4">Inspecting customer complaints & product returns</p>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {analyticsSummary.returnStats.length > 0 ? analyticsSummary.returnStats.map((item) => {
              const parsedRate = parseFloat(item.returnRate);
              const colorClass = parsedRate > 2 ? "bg-red-500" : parsedRate > 1 ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div key={item.condition} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{item.condition}</span>
                    <span className="text-gray-900">{item.returnRate} <span className="text-[10px] text-gray-400">({item.volume})</span></span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorClass}`}
                      style={{ width: `${Math.min((parsedRate / 4.0) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-400 text-xs font-bold border border-dashed border-gray-200 rounded-xl">
                No return complaints logged yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Sellers and Extra Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sellers */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Top Refurbished Sellers</h3>
              <p className="text-xs text-gray-500">Based on diagnostic pass rates and sales volumes</p>
            </div>
            <FiAward className="text-2xl text-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Seller Store</th>
                  <th className="pb-3 text-center">Items Sold</th>
                  <th className="pb-3 text-center">Quality Rating</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-right">Certifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analyticsSummary.topSellers.length > 0 ? analyticsSummary.topSellers.map((seller, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-800 text-xs flex items-center gap-2">
                      <span className="text-gray-400 text-[10px]">0{idx + 1}.</span> {seller.name}
                    </td>
                    <td className="py-4 text-xs font-bold text-gray-700 text-center">{seller.sales} <span className="text-[10px] text-gray-400 font-semibold">units</span></td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                        ★ {seller.rating}
                      </span>
                    </td>
                    <td className="py-4 font-black text-gray-900 text-right">{seller.revenue}</td>
                    <td className="py-4 text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${seller.badge.includes("Gold") ? "bg-amber-100 text-amber-700" :
                          seller.badge.includes("Verified") ? "bg-purple-100 text-purple-700" :
                            "bg-blue-100 text-blue-700"
                        }`}>
                        {seller.badge}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 text-xs font-bold">
                      Not enough active sales data to rank top sellers.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Summary Widget */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Diagnostic Quality Assurance</h3>
            <p className="text-xs text-gray-500 mb-4">Inspection pass rates & grading metrics</p>
          </div>

          <div className="text-center py-4 flex flex-col items-center justify-center">
            {/* Circular Progress Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#C07A3D"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * parseFloat(approvalRatioNum)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-gray-900">{analyticsSummary.approvalRatio}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Approval Ratio</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-500 text-center leading-relaxed">
            Over <span className="font-bold text-gray-800">{analyticsSummary.approvalRatio}</span> of submitted refurbished listings successfully pass diagnostic inspection on first review.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RefurbishedDashboard;
