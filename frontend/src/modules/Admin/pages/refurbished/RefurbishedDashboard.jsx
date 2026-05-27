import { useState } from "react";
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

const RefurbishedDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock QC Metrics Data
  const qcMetrics = [
    {
      label: "Pending Reviews",
      value: "8",
      change: "+2 today",
      isPositive: false,
      icon: FiClock,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50 border-amber-100",
    },
    {
      label: "Approved Refurbished",
      value: "124",
      change: "+15 this week",
      isPositive: true,
      icon: FiCheckCircle,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Rejected Listings",
      value: "14",
      change: "+3 this week",
      isPositive: false,
      icon: FiXCircle,
      color: "from-rose-500 to-red-600",
      textColor: "text-rose-600",
      bgLight: "bg-rose-50 border-rose-100",
    },
    {
      label: "Total Quality Checked",
      value: "146",
      change: "100% inspected",
      isPositive: true,
      icon: FiLayers,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50 border-blue-100",
    },
    {
      label: "Refurbished Return Ratio",
      value: "1.6%",
      change: "-0.4% vs B2C average",
      isPositive: true,
      icon: FiPercent,
      color: "from-purple-500 to-indigo-700",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50 border-purple-100",
    },
  ];

  // Mock Refurbished Analytics Data
  const analyticsSummary = {
    sales: "1,248 units",
    salesChange: "+12.4% MoM",
    revenue: "₹45,82,499",
    revenueChange: "+18.2% MoM",
    approvalRatio: "89.8%",
    topSellers: [
      { name: "Apex Electronics Retail", sales: 489, rating: 4.8, revenue: "₹18,24,900", badge: "Gold Certified" },
      { name: "Fashion Hub Store", sales: 312, rating: 4.6, revenue: "₹10,12,000", badge: "Verified Refurbisher" },
      { name: "Gupta Electronics", sales: 245, rating: 4.5, revenue: "₹8,45,000", badge: "Quality Checked" },
    ],
    returnStats: [
      { condition: "Grade A Refurbished", returnRate: "0.8%", volume: "620 units" },
      { condition: "Grade B Refurbished", returnRate: "1.9%", volume: "410 units" },
      { condition: "Grade C Refurbished", returnRate: "3.5%", volume: "120 units" },
      { condition: "Renewed (Excellent)", returnRate: "1.1%", volume: "78 units" },
      { condition: "Open Box (Pristine)", returnRate: "0.5%", volume: "20 units" },
    ]
  };

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
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedPeriod === period
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
                  <span className={`text-[10px] font-bold ${
                    metric.isPositive ? "text-emerald-600" : "text-amber-600"
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
                d="M 0 160 Q 80 130 150 90 T 300 70 T 420 40 T 500 25 L 500 160 Z"
                fill="url(#chartGlow)"
              />
              {/* Stroke line */}
              <path
                d="M 0 160 Q 80 130 150 90 T 300 70 T 420 40 T 500 25"
                fill="none"
                stroke="#C07A3D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              <circle cx="150" cy="90" r="5" fill="#C07A3D" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
              <circle cx="300" cy="70" r="5" fill="#C07A3D" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
              <circle cx="420" cy="40" r="5" fill="#C07A3D" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
              <circle cx="500" cy="25" r="5" fill="#C07A3D" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
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
            {analyticsSummary.returnStats.map((item) => {
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
                      style={{ width: `${(parsedRate / 4.0) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
                {analyticsSummary.topSellers.map((seller, index) => (
                  <tr key={seller.name} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-xs text-gray-400">0{index + 1}.</span>
                      {seller.name}
                    </td>
                    <td className="py-3.5 text-center text-gray-600 font-semibold">{seller.sales} units</td>
                    <td className="py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-100">
                        ★ {seller.rating}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-gray-900">{seller.revenue}</td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        index === 0
                          ? "bg-amber-100 text-amber-800"
                          : index === 1
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                      }`}>
                        {seller.badge}
                      </span>
                    </td>
                  </tr>
                ))}
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
                  strokeDashoffset={251.2 - (251.2 * 89.8) / 100}
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
            Over <span className="font-bold text-gray-800">89.8%</span> of submitted refurbished listings successfully pass diagnostic inspection on first review.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RefurbishedDashboard;
