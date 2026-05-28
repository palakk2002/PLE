import { useMemo } from "react";
import {
  FiInbox,
  FiTrendingUp,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiPieChart,
  FiShoppingBag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useVendorB2BStore } from "../../store/vendorB2BStore";
import { formatPrice } from "../../../../shared/utils/helpers";

const B2BAnalytics = () => {
  const { analytics } = useVendorB2BStore();

  const statusMetrics = useMemo(() => [
    { label: "New", value: analytics.newEnquiries, color: "bg-blue-500", text: "text-blue-600" },
    { label: "Responded", value: analytics.respondedEnquiries, color: "bg-indigo-500", text: "text-indigo-600" },
    { label: "Quoted", value: analytics.quotedEnquiries, color: "bg-amber-500", text: "text-amber-600" },
    { label: "Accepted", value: analytics.acceptedEnquiries, color: "bg-green-500", text: "text-green-600" },
    { label: "Rejected", value: analytics.rejectedEnquiries, color: "bg-red-500", text: "text-red-600" },
    { label: "Expired", value: analytics.expiredEnquiries, color: "bg-gray-400", text: "text-gray-500" },
  ], [analytics]);

  const maxMonthCount = useMemo(() => {
    return Math.max(...analytics.monthlyTrend.map((m) => m.count), 1);
  }, [analytics]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 lg:hidden mb-1">
          B2B Analytics
        </h1>
        <p className="text-sm text-gray-500 lg:hidden">
          Performance and quotation metrics for wholesale enquiries
        </p>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-lg">
            <FiDollarSign className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Quote Value</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              {formatPrice(analytics.totalQuoteValue)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Avg. quote value: <span className="font-semibold">{formatPrice(analytics.avgQuoteValue)}</span>
            </p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-800 rounded-lg">
            <FiTrendingUp className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Conversion Rate</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              {analytics.conversionRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Enquiries quoted that got accepted
            </p>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-lg">
            <FiClock className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg. Response Time</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              {analytics.avgResponseTime} hrs
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Target SLA standard: &lt; 24 hours
            </p>
          </div>
        </div>

        {/* Total RFQs */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex items-start gap-4">
          <div className="p-3 bg-purple-100 text-purple-800 rounded-lg">
            <FiInbox className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Enquiries</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              {analytics.totalEnquiries}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Wholesale inquiries received
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 text-base">
            <FiTrendingUp className="text-amber-800" />
            Monthly Enquiry Trend
          </h2>
          <div className="flex-1 flex items-end justify-between gap-2 pt-10 pb-4 h-[250px] px-2 sm:px-4">
            {analytics.monthlyTrend.map((item, index) => {
              const heightPercent = (item.count / maxMonthCount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="w-full bg-gray-50 rounded-t-lg relative h-[180px] flex items-end">
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2.5 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.count} Enquiries
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 rounded-t-md transition-all duration-500 ease-out"
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 text-base">
            <FiPieChart className="text-amber-800" />
            RFQ Status Summary
          </h2>
          <div className="space-y-4 pt-4">
            {statusMetrics.map((status) => {
              const pct = analytics.totalEnquiries > 0 ? (status.value / analytics.totalEnquiries) * 100 : 0;
              return (
                <div key={status.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${status.color}`}></span>
                      {status.label}
                    </span>
                    <span className="text-gray-800">
                      {status.value} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${status.color} rounded-full`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
            <FiShoppingBag className="text-amber-800" />
            Top Demanded Products (RFQ volume)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-55 text-xs font-semibold text-gray-650 uppercase">
                <th className="p-4">Product Name</th>
                <th className="p-4 text-center">RFQ Appearances</th>
                <th className="p-4 text-center">Total Quantity Demanded</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.topProductsByEnquiry.map((prod, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{prod.name}</td>
                  <td className="p-4 text-center font-semibold text-gray-700">{prod.count} times</td>
                  <td className="p-4 text-center font-bold text-amber-900">{prod.totalQty} units</td>
                  <td className="p-4 text-right">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-150">
                      High Demand
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default B2BAnalytics;
