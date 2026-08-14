import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
  FiBarChart2,
} from "react-icons/fi";
import { useVendorAuthStore } from "../store/vendorAuthStore";
import { useVendorProductStore } from "../store/vendorProductStore";
import { getVendorOrders, getVendorEarnings, getVendorAnalyticsOverview } from "../services/vendorService";
import { formatPrice } from "../../../shared/utils/helpers";
import RevenueLineChart from "../../Admin/components/Analytics/RevenueLineChart";
import SalesBarChart from "../../Admin/components/Analytics/SalesBarChart";
import OrderStatusPieChart from "../../Admin/components/Analytics/OrderStatusPieChart";
import TimePeriodFilter from "../../Admin/components/Analytics/TimePeriodFilter";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { vendor } = useVendorAuthStore();
  const { products, total: totalProductsCount, fetchProducts } = useVendorProductStore();

  const [stats, setStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

  const vendorId = vendor?.id || vendor?._id;

  useEffect(() => {
    if (!vendorId) return;

    // Load products into the product store (reuse if already fetched)
    if (products.length === 0) {
      fetchProducts();
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders and earnings in parallel
        const [ordersRes, earningsRes, pendingRes, processingRes] = await Promise.all([
          getVendorOrders({ page: 1, limit: 5 }),
          getVendorEarnings(),
          getVendorOrders({ page: 1, limit: 1, status: "pending" }),
          getVendorOrders({ page: 1, limit: 1, status: "processing" }),
        ]);

        const ordersData = ordersRes?.data ?? ordersRes;
        const earningsData = earningsRes?.data ?? earningsRes;
        const pendingData = pendingRes?.data ?? pendingRes;
        const processingData = processingRes?.data ?? processingRes;

        const orders = ordersData?.orders ?? [];
        const summary = earningsData?.summary ?? {};
        const pending =
          Number(pendingData?.total || 0) + Number(processingData?.total || 0);

        setStats((prev) => ({
          ...prev,
          totalOrders: ordersData?.total ?? orders.length,
          pendingOrders: pending,
          totalEarnings: summary.totalEarnings ?? 0,
          pendingEarnings: summary.pendingEarnings ?? 0,
        }));

        setRecentOrders(orders);
      } catch {
        // errors handled by api.js toast
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [vendorId, fetchProducts, products.length]);

  useEffect(() => {
    if (!vendorId) return;

    const fetchAnalytics = async () => {
      setIsAnalyticsLoading(true);
      try {
        const res = await getVendorAnalyticsOverview({ period: analyticsPeriod });
        const data = res?.data ?? res;
        setAnalyticsData(Array.isArray(data?.timeseries) ? data.timeseries : []);
        setStatusData(Array.isArray(data?.statusBreakdown) ? data.statusBreakdown : []);
      } catch {
        setAnalyticsData([]);
        setStatusData([]);
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [vendorId, analyticsPeriod]);

  // Sync product counts whenever the product store updates
  useEffect(() => {
    const inStock = products.filter((p) => p.stock === "in_stock").length;
    setStats((prev) => ({
      ...prev,
      totalProducts: Number(totalProductsCount || 0),
      inStockProducts: inStock,
    }));
  }, [products, totalProductsCount]);

  const statCards = useMemo(() => {
    return [
      {
        icon: FiPackage,
        label: "Total Products",
        value: stats.totalProducts,
        color: "bg-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/40 dark:border dark:border-blue-800/40",
        textColor: "text-blue-700 dark:text-blue-300",
        link: "/vendor/products",
      },
      {
        icon: FiShoppingBag,
        label: "Total Orders",
        value: stats.totalOrders,
        color: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/40 dark:border dark:border-green-800/40",
        textColor: "text-green-700 dark:text-green-300",
        link: "/vendor/orders",
      },
      {
        icon: FiTrendingUp,
        label: "Pending Orders",
        value: stats.pendingOrders,
        color: "bg-orange-500",
        bgColor: "bg-orange-50 dark:bg-orange-950/40 dark:border dark:border-orange-800/40",
        textColor: "text-orange-700 dark:text-orange-300",
        link: "/vendor/orders",
      },
      {
        icon: FiDollarSign,
        label: "Total Earnings",
        value: formatPrice(stats.totalEarnings || 0),
        color: "bg-purple-500",
        bgColor: "bg-purple-50 dark:bg-purple-950/40 dark:border dark:border-purple-800/40",
        textColor: "text-purple-700 dark:text-purple-300",
        link: "/vendor/earnings",
      },
    ];
  }, [stats]);

  const topProducts = useMemo(() => products.slice(0, 5), [products]);

  const b2bProducts = useMemo(() => {
    return products.filter((p) => p.b2bEnabled === true);
  }, [products]);

  const refurbishedProducts = useMemo(() => {
    return products.filter((p) => p.condition && p.condition !== "brand_new");
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Welcome back, {vendor?.storeName || vendor?.name}! Here's your store
            overview.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => stat.link && navigate(stat.link)}
            className={`${stat.bgColor} rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <FiArrowRight className={`${stat.textColor} text-lg`} />
            </div>
            <h3 className={`${stat.textColor} text-sm font-medium mb-1`}>
              {stat.label}
            </h3>
            <p className={`${stat.textColor} text-2xl font-bold`}>
              {isLoading ? "—" : stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Performance Analytics Charts */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiBarChart2 className="text-primary-600 text-xl" />
              Revenue & Performance Analytics
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Sales, revenue trends, and order status breakdown.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <TimePeriodFilter activePeriod={analyticsPeriod} onPeriodChange={setAnalyticsPeriod} />
            <button
              onClick={() => navigate("/vendor/analytics")}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/40 px-3 py-2 rounded-lg transition-colors border border-primary-100 dark:border-primary-900/40 flex items-center gap-1"
            >
              Full Report <FiArrowRight />
            </button>
          </div>
        </div>

        {isAnalyticsLoading ? (
          <div className="py-12 text-center text-gray-400">Loading analytics charts...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueLineChart data={analyticsData} period={analyticsPeriod} />
            <SalesBarChart data={analyticsData} period={analyticsPeriod} />
          </div>
        )}
      </div>

      {/* B2B Overview Widget */}
      {b2bProducts.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                B2B / Wholesale Overview
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time statistics for your bulk business operations.</p>
            </div>
            <button
              onClick={() => navigate("/vendor/products")}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1.5 rounded-lg transition-colors border border-primary-100 dark:border-primary-900/40"
            >
              Manage Wholesale Listings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/30 p-4 rounded-xl border border-amber-100 dark:border-amber-800/40">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Active B2B Products</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">{b2bProducts.length}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800/40">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Wholesale Orders (Month)</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">0</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Pending RFQs / Inquiries</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">0</p>
            </div>
          </div>
        </div>
      )}

      {/* Refurbished Overview Widget */}
      {refurbishedProducts.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
                Refurbished & Renewed Overview
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Vetting status, grading, and warranty insights for your circular catalog.</p>
            </div>
            <button
              onClick={() => navigate("/vendor/products/manage-products")}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-1.5 rounded-lg transition-colors border border-cyan-100 dark:border-cyan-900/40"
            >
              Manage Circular Listings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800/40">
              <p className="text-xs font-medium text-cyan-800 dark:text-cyan-300">Circular Products Listings</p>
              <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100 mt-1">{refurbishedProducts.length}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/30 p-4 rounded-xl border border-amber-100 dark:border-amber-800/40">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Pending Vetting / Review</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                {refurbishedProducts.filter((p) => p.refurbishedApprovalStatus === "pending").length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Certified Quality Badges</p>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                {refurbishedProducts.filter((p) => p.isCertified === true).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/vendor/products/add-product")}
            className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors text-left border border-transparent dark:border-primary-800/30">
            <div className="bg-primary-500 p-2 rounded-lg">
              <FiPackage className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Add New Product</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create a new product listing
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/vendor/orders")}
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors text-left border border-transparent dark:border-green-800/30">
            <div className="bg-green-500 p-2 rounded-lg">
              <FiShoppingBag className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">View Orders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your orders</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/vendor/earnings")}
            className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors text-left border border-transparent dark:border-purple-800/30">
            <div className="bg-purple-500 p-2 rounded-lg">
              <FiDollarSign className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">View Earnings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check your earnings</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <button
              onClick={() => navigate("/vendor/orders")}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          {isLoading ? (
            <p className="text-gray-400 text-center py-8">Loading orders...</p>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const vendorItem = order.vendorItems?.find(
                  (vi) => vi.vendorId?.toString() === vendorId?.toString()
                );
                const displayStatus = vendorItem?.status ?? order.status;
                const displayAmount =
                  vendorItem?.subtotal ?? order.totalAmount ?? order.total ?? 0;

                return (
                <div
                  key={order._id ?? order.orderId}
                  onClick={() =>
                    navigate(`/vendor/orders/${order.orderId ?? order._id}`)
                  }
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.orderId ?? order._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatPrice(displayAmount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${displayStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : displayStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                      {displayStatus}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Your Products</h2>
            <button
              onClick={() => navigate("/vendor/products")}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product._id ?? product.id}
                  onClick={() =>
                    navigate(`/vendor/products/${product._id ?? product.id}`)
                  }
                  className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/48x48?text=P";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(product.price || 0)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${product.stock === "in_stock"
                        ? "bg-green-100 text-green-700"
                        : product.stock === "low_stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                    {product.stock === "in_stock"
                      ? "In Stock"
                      : product.stock === "low_stock"
                        ? "Low Stock"
                        : "Out of Stock"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No products yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VendorDashboard;
