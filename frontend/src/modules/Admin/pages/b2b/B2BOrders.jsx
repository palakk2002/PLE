import { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiShoppingBag,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiDollarSign,
  FiX,
  FiBriefcase,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiLayers,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/DataTable";
import ExportButton from "../../components/ExportButton";
import Badge from "../../../../shared/components/Badge";
import AnimatedSelect from "../../components/AnimatedSelect";
import { formatPrice } from "../../../../shared/utils/helpers";
import toast from "react-hot-toast";
import api from "../../../../shared/utils/api";

const B2BOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/purchase-orders');
      if (res && res.data) {
        const mappedOrders = res.data.map(po => ({
          id: po.poNumber,
          backendId: po._id,
          businessName: po.companyDetails?.name || 'Unknown Company',
          gstin: po.companyDetails?.gstin || 'N/A',
          date: po.createdAt,
          status: mapBackendStatusToFrontend(po.status),
          paymentTerms: po.terms?.paymentTerms || 'NET 30 Days',
          paymentStatus: po.paymentStatus || 'Unpaid',
          totalAmount: po.pricing?.total || 0,
          shippingAddress: po.deliveryInformation?.shippingAddress || po.companyDetails?.address || 'N/A',
          items: [
            { 
              name: po.productDetails?.name || 'Product', 
              qty: po.productDetails?.qty || 1, 
              price: po.productDetails?.unitPrice || po.pricing?.subtotal || 0 
            }
          ],
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      toast.error('Failed to fetch B2B Orders');
    } finally {
      setLoading(false);
    }
  };

  const mapBackendStatusToFrontend = (status) => {
    if (status === 'Sent') return 'Processing';
    if (status === 'Approved') return 'Shipped';
    if (status === 'Completed') return 'Delivered';
    if (status === 'Cancelled') return 'Pending';
    return status || 'Pending';
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      processing: orders.filter((o) => o.status === "Processing").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      revenue: orders.reduce((acc, o) => acc + o.totalAmount, 0),
    };
  }, [orders]);

  // Update Status
  const handleUpdateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${id} status updated to ${newStatus}`);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Toggle Payment Status
  const handleTogglePayment = (id, currentPayment) => {
    const newPayment = currentPayment === "Paid" ? "Unpaid" : "Paid";
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, paymentStatus: newPayment } : order
      )
    );
    toast.success(`Order ${id} payment marked as ${newPayment}`);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => ({ ...prev, paymentStatus: newPayment }));
    }
  };

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.gstin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || order.status === selectedStatus;

      const matchesTerms =
        selectedPaymentTerms === "all" || order.paymentTerms === selectedPaymentTerms;

      return matchesSearch && matchesStatus && matchesTerms;
    });
  }, [orders, searchQuery, selectedStatus, selectedPaymentTerms]);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-800 font-mono select-all">
          {value}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business / GSTIN",
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{value}</span>
          <span className="text-xs text-gray-500 font-mono select-all">GSTIN: {row.gstin}</span>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items Count",
      sortable: false,
      render: (value) => (
        <span className="text-sm text-gray-700">
          {value.reduce((acc, it) => acc + it.qty, 0)} units ({value.length} types)
        </span>
      ),
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-bold text-gray-900">
          {formatPrice(value)}
        </span>
      ),
    },
    {
      key: "paymentTerms",
      label: "Payment Terms",
      sortable: true,
      render: (value, row) => {
        let paymentVariant = "warning";
        if (row.paymentStatus === "Paid") paymentVariant = "success";
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
              {value}
            </span>
            <Badge variant={paymentVariant}>{row.paymentStatus}</Badge>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        let variant = "warning";
        if (value === "Processing") variant = "info";
        if (value === "Shipped") variant = "warning";
        if (value === "Delivered") variant = "success";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      key: "date",
      label: "Order Date",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-600 font-medium">
          {new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedOrder(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Order Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
          B2B Orders
        </h1>
        <p className="text-sm text-gray-500">
          Track and fulfill wholesale orders, oversee credit cycles, and issue GST compliance invoices.
        </p>
      </div>

      {/* Stats row - Amber-themed */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FiTruck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shipped</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.shipped + stats.processing}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Delivered</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stats.delivered}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">B2B Revenue</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-1">{formatPrice(stats.revenue)}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
        {/* Filters */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
            <div className="relative flex-1 w-full sm:min-w-[260px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Company, GSTIN..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium hidden md:inline">Status:</span>
              <AnimatedSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "Pending", label: "Pending" },
                  { value: "Processing", label: "Processing" },
                  { value: "Shipped", label: "Shipped" },
                  { value: "Delivered", label: "Delivered" },
                ]}
                className="w-full sm:w-auto min-w-[150px]"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium hidden md:inline">Payment Terms:</span>
              <AnimatedSelect
                value={selectedPaymentTerms}
                onChange={(e) => setSelectedPaymentTerms(e.target.value)}
                options={[
                  { value: "all", label: "All Payment Terms" },
                  { value: "Net 15", label: "Net 15" },
                  { value: "Net 30", label: "Net 30" },
                  { value: "Net 45", label: "Net 45" },
                ]}
                className="w-full sm:w-auto min-w-[150px]"
              />
            </div>

            <div className="w-full sm:w-auto ml-auto">
              <ExportButton
                data={filteredOrders}
                headers={[
                  { label: "Order ID", accessor: (row) => row.id },
                  { label: "Business Name", accessor: (row) => row.businessName },
                  { label: "GSTIN", accessor: (row) => row.gstin },
                  { label: "Date", accessor: (row) => row.date },
                  { label: "Total Amount (₹)", accessor: (row) => row.totalAmount },
                  { label: "Payment Terms", accessor: (row) => row.paymentTerms },
                  { label: "Payment Status", accessor: (row) => row.paymentStatus },
                  { label: "Fulfillment Status", accessor: (row) => row.status },
                  { label: "Shipping Address", accessor: (row) => row.shippingAddress },
                ]}
                filename="b2b_wholesale_orders"
              />
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredOrders}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
          onRowClick={(row) => setSelectedOrder(row)}
        />
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col h-full border-l border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-mono">
                      {selectedOrder.id}
                    </span>
                    <Badge
                      variant={
                        selectedOrder.status === "Delivered"
                          ? "success"
                          : selectedOrder.status === "Pending"
                          ? "warning"
                          : "info"
                      }
                    >
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mt-1 truncate max-w-[320px]">
                    {selectedOrder.businessName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Meta details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4" /> Order Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">GSTIN</p>
                      <p className="font-semibold text-gray-800 mt-0.5 font-mono select-all">{selectedOrder.gstin}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Order Date</p>
                      <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(selectedOrder.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Payment Terms</p>
                      <p className="font-semibold text-gray-800 mt-0.5 flex items-center gap-1.5">
                        <FiCreditCard className="w-3.5 h-3.5 text-gray-400" />
                        {selectedOrder.paymentTerms}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Payment Status</p>
                      <button
                        onClick={() => handleTogglePayment(selectedOrder.id, selectedOrder.paymentStatus)}
                        className="font-bold mt-0.5 text-left focus:outline-none flex items-center gap-1.5"
                      >
                        <Badge variant={selectedOrder.paymentStatus === "Paid" ? "success" : "warning"}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                        <span className="text-[10px] text-primary-500 font-medium underline">(Change)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" /> Delivery Address
                  </h3>
                  <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>
                </div>

                {/* Items detail list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FiLayers className="w-4 h-4" /> Line Items
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-3 font-semibold text-gray-600">Product</th>
                          <th className="p-3 font-semibold text-gray-600 text-center">Qty</th>
                          <th className="p-3 font-semibold text-gray-600 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50">
                            <td className="p-3 font-medium text-gray-800">
                              {item.name}
                              <p className="text-[10px] text-gray-400 font-normal mt-0.5">Rate: {formatPrice(item.price)}</p>
                            </td>
                            <td className="p-3 font-semibold text-gray-700 text-center">
                              {item.qty}
                            </td>
                            <td className="p-3 font-bold text-gray-900 text-right">
                              {formatPrice(item.price * item.qty)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-bold border-t border-gray-200">
                          <td className="p-3 text-gray-800">Grand Total</td>
                          <td className="p-3 text-center text-gray-800">
                            {selectedOrder.items.reduce((acc, it) => acc + it.qty, 0)}
                          </td>
                          <td className="p-3 text-right text-gray-900">
                            {formatPrice(selectedOrder.totalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fulfillment workflow */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Fulfillment Status
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {["Pending", "Processing", "Shipped", "Delivered"].map((status) => {
                      const isCurrent = selectedOrder.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                          className={`py-2 px-1 text-[10px] sm:text-xs font-bold rounded-xl border text-center transition-all ${
                            isCurrent
                              ? "bg-amber-600 border-amber-600 text-white shadow-sm shadow-amber-100"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    toast.success("GST Compliant Tax Invoice generated and downloaded!");
                  }}
                  className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  Download B2B Invoice
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default B2BOrders;
