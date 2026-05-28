import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiMessageSquare,
  FiFileText,
  FiInbox,
} from "react-icons/fi";
import { motion } from "framer-motion";
import DataTable from "../../../Admin/components/DataTable";
import ExportButton from "../../../Admin/components/ExportButton";
import Badge from "../../../../shared/components/Badge";
import AnimatedSelect from "../../../Admin/components/AnimatedSelect";
import { formatPrice } from "../../../../shared/utils/helpers";
import { useVendorB2BStore } from "../../store/vendorB2BStore";
import { b2bEnquiryStatuses, b2bPriorities } from "../../data/b2bEnquiryMockData";

const B2BEnquiries = () => {
  const navigate = useNavigate();
  const { enquiries, isLoading, fetchEnquiries } = useVendorB2BStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.enquiryNumber.toLowerCase().includes(q) ||
          e.buyer.name.toLowerCase().includes(q) ||
          e.buyer.company.toLowerCase().includes(q) ||
          e.buyer.email.toLowerCase().includes(q) ||
          e.products.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    // Status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((e) => e.status === selectedStatus);
    }

    // Priority
    if (selectedPriority !== "all") {
      filtered = filtered.filter((e) => e.priority === selectedPriority);
    }

    // Date
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter((e) => new Date(e.createdAt) >= filterDate);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter((e) => new Date(e.createdAt) >= filterDate);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter((e) => new Date(e.createdAt) >= filterDate);
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [enquiries, searchQuery, selectedStatus, selectedPriority, dateFilter]);

  // Status badge helpers
  const getStatusVariant = (status) => {
    const map = {
      new: "info",
      responded: "info",
      quoted: "warning",
      accepted: "success",
      rejected: "error",
      expired: "default",
    };
    return map[status] || "default";
  };

  const getPriorityBadge = (priority) => {
    const cfg = b2bPriorities.find((p) => p.value === priority);
    if (!cfg) return null;
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
        {cfg.label}
      </span>
    );
  };

  // Stats
  const statusCounts = useMemo(() => ({
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    responded: enquiries.filter((e) => e.status === "responded").length,
    quoted: enquiries.filter((e) => e.status === "quoted").length,
    accepted: enquiries.filter((e) => e.status === "accepted").length,
    rejected: enquiries.filter((e) => e.status === "rejected").length,
    expired: enquiries.filter((e) => e.status === "expired").length,
  }), [enquiries]);

  // Table columns
  const columns = [
    {
      key: "enquiryNumber",
      label: "Enquiry #",
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800">{value}</span>,
    },
    {
      key: "buyer",
      label: "Buyer",
      sortable: true,
      render: (value) => (
        <div>
          <p className="font-medium text-gray-800">{value.name}</p>
          <p className="text-xs text-gray-500">{value.company}</p>
        </div>
      ),
    },
    {
      key: "products",
      label: "Products",
      sortable: false,
      render: (value) => {
        const count = Array.isArray(value) ? value.length : 0;
        const totalQty = value.reduce((sum, p) => sum + p.qty, 0);
        return (
          <div>
            <span className="text-sm">{count} product{count !== 1 ? "s" : ""}</span>
            <p className="text-xs text-gray-500">{totalQty} units total</p>
          </div>
        );
      },
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (value) => getPriorityBadge(value),
    },
    {
      key: "totalEstimatedValue",
      label: "Est. Value",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-gray-800">{formatPrice(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => <Badge variant={getStatusVariant(value)}>{value}</Badge>,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vendor/b2b-enquiries/${row.id}`);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye />
          </button>
          {(row.status === "new" || row.status === "responded") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/vendor/b2b-enquiries/${row.id}/create-quote`);
              }}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Create Quote"
            >
              <FiFileText />
            </button>
          )}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            B2B Enquiries
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage buyer enquiries and quotation requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {[
          { label: "Total", value: statusCounts.all, color: "text-gray-800" },
          { label: "New", value: statusCounts.new, color: "text-blue-600" },
          { label: "Responded", value: statusCounts.responded, color: "text-indigo-600" },
          { label: "Quoted", value: statusCounts.quoted, color: "text-amber-600" },
          { label: "Accepted", value: statusCounts.accepted, color: "text-green-600" },
          { label: "Rejected", value: statusCounts.rejected, color: "text-red-600" },
          { label: "Expired", value: statusCounts.expired, color: "text-gray-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200"
          >
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 w-full sm:min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, buyer, company, product..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
            />
          </div>

          <AnimatedSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: "all", label: "All Status" },
              ...b2bEnquiryStatuses.map((s) => ({ value: s.value, label: s.label })),
            ]}
            className="w-full sm:w-auto min-w-[140px]"
          />

          <AnimatedSelect
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            options={[
              { value: "all", label: "All Priority" },
              ...b2bPriorities.map((p) => ({ value: p.value, label: p.label })),
            ]}
            className="w-full sm:w-auto min-w-[140px]"
          />

          <AnimatedSelect
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            options={[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "Last 7 Days" },
              { value: "month", label: "Last 30 Days" },
            ]}
            className="w-full sm:w-auto min-w-[140px]"
          />

          <div className="w-full sm:w-auto">
            <ExportButton
              data={filteredEnquiries}
              headers={[
                { label: "Enquiry #", accessor: (r) => r.enquiryNumber },
                { label: "Buyer", accessor: (r) => r.buyer.name },
                { label: "Company", accessor: (r) => r.buyer.company },
                { label: "Email", accessor: (r) => r.buyer.email },
                { label: "Products", accessor: (r) => r.products.map((p) => p.name).join(", ") },
                { label: "Priority", accessor: (r) => r.priority },
                { label: "Est. Value", accessor: (r) => formatPrice(r.totalEstimatedValue) },
                { label: "Status", accessor: (r) => r.status },
                { label: "Date", accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
              ]}
              filename="b2b-enquiries"
            />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!isLoading && filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <FiInbox className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg font-medium">No enquiries found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery || selectedStatus !== "all" || selectedPriority !== "all"
              ? "Try adjusting your filters"
              : "B2B buyer enquiries will appear here"}
          </p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Loading enquiries...</p>
        </div>
      ) : (
        <DataTable
          data={filteredEnquiries}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
          onRowClick={(row) => navigate(`/vendor/b2b-enquiries/${row.id}`)}
        />
      )}
    </motion.div>
  );
};

export default B2BEnquiries;
