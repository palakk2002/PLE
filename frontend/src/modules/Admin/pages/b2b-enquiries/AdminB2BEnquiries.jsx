import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiExternalLink,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiX,
  FiCheck,
  FiFlag
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../components/DataTable";
import ExportButton from "../../components/ExportButton";
import Badge from "../../../../shared/components/Badge";
import AnimatedSelect from "../../components/AnimatedSelect";
import { formatPrice } from "../../../../shared/utils/helpers";
import toast from "react-hot-toast";
import { initialB2BEnquiries, initialAdminB2BAnalytics } from "../../data/adminB2BEnquiryMockData";

const AdminB2BEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(initialB2BEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Derive unique sellers list for filters dropdown
  const sellerList = useMemo(() => {
    const sellersMap = {};
    enquiries.forEach((e) => {
      sellersMap[e.seller.id] = e.seller.storeName;
    });
    return Object.entries(sellersMap).map(([id, name]) => ({ value: id, label: name }));
  }, [enquiries]);

  // Handle status update directly from quick preview drawer
  const handleUpdateStatus = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              responseHistory: [
                ...item.responseHistory,
                {
                  stage: `Status updated to ${newStatus}`,
                  user: "Admin",
                  date: new Date().toISOString(),
                  comment: `Status manually changed by administrator.`
                }
              ]
            }
          : item
      )
    );
    toast.success(`Enquiry status updated to ${newStatus}`);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Flag/Unflag as spam directly from drawer
  const handleToggleSpam = (id, currentlyFlagged) => {
    const nextFlagged = !currentlyFlagged;
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              flagged: nextFlagged,
              flagReason: nextFlagged ? "Manually flagged by Administrator." : null,
              riskScore: nextFlagged ? 85 : 0,
              spamStatus: nextFlagged ? "Flagged" : null,
              responseHistory: [
                ...item.responseHistory,
                {
                  stage: nextFlagged ? "Flagged as Spam" : "Cleared Spam Flag",
                  user: "Admin",
                  date: new Date().toISOString(),
                  comment: nextFlagged
                    ? "Enquiry flagged as spam/suspicious."
                    : "Spam flag cleared by administrator."
                }
              ]
            }
          : item
      )
    );

    if (nextFlagged) {
      toast.error("Enquiry flagged as spam");
    } else {
      toast.success("Spam flag cleared successfully");
    }

    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        flagged: nextFlagged,
        spamStatus: nextFlagged ? "Flagged" : null,
        riskScore: nextFlagged ? 85 : 0
      }));
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      pending: enquiries.filter((e) => e.status === "Pending").length,
      responded: enquiries.filter((e) => e.status === "Seller Responded" || e.status === "Quotation Sent").length,
      approved: enquiries.filter((e) => e.status === "Approved").length,
      rejected: enquiries.filter((e) => e.status === "Rejected").length,
      spam: enquiries.filter((e) => e.flagged).length,
      totalValue: enquiries.reduce((acc, e) => acc + (e.totalEstimatedValue || 0), 0)
    };
  }, [enquiries]);

  // Filters logic
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesSearch =
        item.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
      const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority;
      const matchesSeller = selectedSeller === "all" || item.seller.id === selectedSeller;

      return matchesSearch && matchesStatus && matchesPriority && matchesSeller;
    });
  }, [enquiries, searchQuery, selectedStatus, selectedPriority, selectedSeller]);

  const columns = [
    {
      key: "enquiryNumber",
      label: "Enquiry #",
      sortable: true,
      render: (value, row) => (
        <span className="font-bold text-gray-900 font-mono select-all">
          {row.flagged && <span className="mr-1 text-red-500 font-sans" title="Spam/Fraud Flag">⚠️</span>}
          {value}
        </span>
      )
    },
    {
      key: "buyer",
      label: "Buyer / Company",
      sortable: true,
      render: (value) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{value.name}</span>
          <span className="text-xs text-gray-400 font-medium">{value.company}</span>
        </div>
      )
    },
    {
      key: "seller",
      label: "Assigned Seller",
      sortable: true,
      render: (value) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700 text-xs bg-gray-100 px-2 py-0.5 rounded-md inline-block max-w-max">
            {value.storeName}
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">{value.name}</span>
        </div>
      )
    },
    {
      key: "products",
      label: "Requested Items",
      sortable: false,
      render: (value) => {
        if (!value || value.length === 0) return "-";
        const primaryProduct = value[0].name;
        const additionalCount = value.length - 1;
        return (
          <div className="text-xs text-gray-700">
            <span className="font-medium truncate block max-w-[200px]" title={primaryProduct}>
              {primaryProduct}
            </span>
            {additionalCount > 0 && (
              <span className="text-[10px] text-primary-500 font-bold bg-primary-50 px-1.5 py-0.2 rounded-full mt-0.5 inline-block">
                +{additionalCount} more items
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: "totalEstimatedValue",
      label: "Est. Value",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-bold text-gray-900">
          {formatPrice(value)}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        let variant = "warning";
        if (value === "Under Review") variant = "info";
        if (value === "Seller Responded") variant = "info";
        if (value === "Quotation Sent") variant = "success";
        if (value === "Approved") variant = "success";
        if (value === "Rejected") variant = "danger";
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (value) => {
        let colors = "bg-gray-100 text-gray-700";
        if (value === "High") colors = "bg-red-50 text-red-700 border border-red-100";
        if (value === "Medium") colors = "bg-amber-50 text-amber-700 border border-amber-100";
        if (value === "Low") colors = "bg-blue-50 text-blue-700 border border-blue-100";
        return (
          <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${colors}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: "createdAt",
      label: "Received Date",
      sortable: true,
      render: (value) => (
        <span className="text-xs text-gray-500 font-medium">
          {new Date(value).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedEnquiry(row)}
            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Quick Preview"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/admin/b2b-enquiries/${row.id}`)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Full Detail View"
          >
            <FiExternalLink className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 flex items-center gap-2.5">
            <FiInbox className="text-primary-600" /> B2B Enquiry & RFQ Management
          </h1>
          <p className="text-sm text-gray-500">
            Monitor, moderate, and analyze wholesale Requests for Quotations, buyer intents, and seller response times.
          </p>
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <FiInbox className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total RFQs</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiClock className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FiCheckCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Responded</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.responded}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <FiCheckCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Approved</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.approved}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <FiXCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rejected</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.rejected}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <FiFlag className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flagged Spam</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.spam}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
        {/* Filters */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
            <div className="relative flex-1 w-full sm:min-w-[240px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Enquiry #, Buyer, Product, Seller..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:inline">Status:</span>
              <AnimatedSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "Pending", label: "Pending" },
                  { value: "Under Review", label: "Under Review" },
                  { value: "Seller Responded", label: "Seller Responded" },
                  { value: "Quotation Sent", label: "Quotation Sent" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" }
                ]}
                className="w-full sm:w-auto min-w-[140px]"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:inline">Priority:</span>
              <AnimatedSelect
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                options={[
                  { value: "all", label: "All Priorities" },
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" }
                ]}
                className="w-full sm:w-auto min-w-[130px]"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:inline">Seller:</span>
              <AnimatedSelect
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                options={[
                  { value: "all", label: "All Sellers" },
                  ...sellerList
                ]}
                className="w-full sm:w-auto min-w-[160px]"
              />
            </div>

            <div className="w-full sm:w-auto ml-auto">
              <ExportButton
                data={filteredEnquiries}
                headers={[
                  { label: "Enquiry Number", accessor: (row) => row.enquiryNumber },
                  { label: "Buyer Company", accessor: (row) => row.buyer.company },
                  { label: "Buyer Contact", accessor: (row) => row.buyer.name },
                  { label: "Buyer Phone", accessor: (row) => row.buyer.phone },
                  { label: "Buyer GSTIN", accessor: (row) => row.buyer.gstin },
                  { label: "Seller Store", accessor: (row) => row.seller.storeName },
                  { label: "Seller Contact", accessor: (row) => row.seller.name },
                  { label: "Estimated Value (₹)", accessor: (row) => row.totalEstimatedValue },
                  { label: "Status", accessor: (row) => row.status },
                  { label: "Priority", accessor: (row) => row.priority },
                  { label: "Created Date", accessor: (row) => row.createdAt },
                  { label: "Is Flagged", accessor: (row) => (row.flagged ? "Yes" : "No") }
                ]}
                filename="b2b_rfqs_all_admin"
              />
            </div>
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredEnquiries}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
          onRowClick={(row) => setSelectedEnquiry(row)}
        />
      </div>

      {/* Slide Drawer for Enquiry Quick Preview */}
      <AnimatePresence>
        {selectedEnquiry && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col h-full border-l border-gray-100"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full font-mono">
                      {selectedEnquiry.enquiryNumber}
                    </span>
                    <Badge
                      variant={
                        selectedEnquiry.status === "Approved" || selectedEnquiry.status === "Quotation Sent"
                          ? "success"
                          : selectedEnquiry.status === "Rejected"
                          ? "danger"
                          : selectedEnquiry.status === "Pending"
                          ? "warning"
                          : "info"
                      }
                    >
                      {selectedEnquiry.status}
                    </Badge>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mt-1 truncate max-w-[320px]">
                    {selectedEnquiry.buyer.company}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Spam Alert Banner */}
                {selectedEnquiry.flagged && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-800">
                    <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">Flagged Suspicious</h4>
                      <p className="text-xs font-medium mt-0.5 leading-relaxed">
                        {selectedEnquiry.flagReason || "Flagged for safety monitoring. Verify credentials carefully."}
                      </p>
                      <button
                        onClick={() => handleToggleSpam(selectedEnquiry.id, true)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 underline mt-2 block"
                      >
                        Dismiss / Mark as Safe
                      </button>
                    </div>
                  </div>
                )}

                {/* RFQ Value & Priority */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Estimated Value</p>
                    <p className="font-extrabold text-gray-800 mt-0.5 text-base flex items-center gap-1">
                      <FiDollarSign className="text-primary-500 w-4 h-4" />
                      {formatPrice(selectedEnquiry.totalEstimatedValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Priority</p>
                    <div className="mt-1">
                      <span
                        className={`text-xs px-2.5 py-0.5 font-bold rounded-full ${
                          selectedEnquiry.priority === "High"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : selectedEnquiry.priority === "Medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}
                      >
                        {selectedEnquiry.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buyer / Seller Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FiUser className="w-4 h-4" /> Trade Profiles
                  </h3>
                  <div className="border border-gray-100 rounded-2xl p-4 space-y-3.5 bg-gray-50/50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Buyer Company</p>
                      <p className="font-bold text-gray-800 text-sm">{selectedEnquiry.buyer.company}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedEnquiry.buyer.name} • {selectedEnquiry.buyer.phone}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">GSTIN: {selectedEnquiry.buyer.gstin}</p>
                    </div>
                    <div className="border-t border-gray-200/80 pt-3">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Assigned Seller</p>
                      <p className="font-bold text-gray-800 text-sm">{selectedEnquiry.seller.storeName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedEnquiry.seller.name} • {selectedEnquiry.seller.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Requested Products Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4" /> Requested Items
                  </h3>
                  <div className="border border-gray-150 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-2.5 font-bold text-gray-600">Product</th>
                          <th className="p-2.5 font-bold text-gray-600 text-center">Qty</th>
                          <th className="p-2.5 font-bold text-gray-600 text-right">Est. Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEnquiry.products.map((p, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50">
                            <td className="p-2.5 font-semibold text-gray-800 truncate max-w-[200px]" title={p.name}>
                              {p.name}
                            </td>
                            <td className="p-2.5 font-bold text-gray-700 text-center">
                              {p.qty.toLocaleString()}
                            </td>
                            <td className="p-2.5 font-bold text-gray-900 text-right">
                              {formatPrice(p.targetPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Buyer message */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Buyer Requirement Message
                  </h3>
                  <div className="p-3 border border-gray-150 rounded-xl bg-gray-50 text-xs leading-relaxed text-gray-700 font-medium whitespace-pre-line">
                    "{selectedEnquiry.buyerMessage}"
                  </div>
                </div>

                {/* Timeline status monitoring */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" /> Activity History
                  </h3>
                  <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                    {selectedEnquiry.responseHistory.map((hist, i) => (
                      <div key={i} className="flex gap-3 text-xs last:mb-0">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-4 ring-primary-50" />
                          {i < selectedEnquiry.responseHistory.length - 1 && (
                            <div className="w-0.5 h-10 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-850">{hist.stage}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(hist.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-450 mt-0.5">By: {hist.user}</p>
                          <p className="text-gray-650 mt-1 font-medium">{hist.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions for Admin */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Enquiry Moderation & Status Actions
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["Pending", "Under Review", "Approved"].map((status) => {
                      const isCurrent = selectedEnquiry.status === status;
                      return (
                        <button
                          key={status}
                          disabled={isCurrent}
                          onClick={() => handleUpdateStatus(selectedEnquiry.id, status)}
                          className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all ${
                            isCurrent
                              ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "Rejected")}
                      disabled={selectedEnquiry.status === "Rejected"}
                      className="py-2 px-3 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <FiXCircle className="w-4 h-4" /> Reject Enquiry
                    </button>
                    <button
                      onClick={() => handleToggleSpam(selectedEnquiry.id, selectedEnquiry.flagged)}
                      className={`py-2 px-3 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        selectedEnquiry.flagged
                          ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-700"
                      }`}
                    >
                      <FiFlag className="w-4 h-4" />
                      {selectedEnquiry.flagged ? "Unflag Safe" : "Flag as Spam"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                <button
                  onClick={() => navigate(`/admin/b2b-enquiries/${selectedEnquiry.id}`)}
                  className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors shadow-sm"
                >
                  Go to Full Detail Page <FiExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminB2BEnquiries;
