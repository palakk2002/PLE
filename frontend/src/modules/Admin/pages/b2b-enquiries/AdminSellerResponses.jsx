import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiSearch,
  FiEye,
  FiAlertTriangle,
  FiCheckCircle,
  FiBriefcase,
  FiTrendingUp,
  FiCalendar,
  FiUser
} from "react-icons/fi";
import { motion } from "framer-motion";
import DataTable from "../../components/DataTable";
import ExportButton from "../../components/ExportButton";
import Badge from "../../../../shared/components/Badge";
import AnimatedSelect from "../../components/AnimatedSelect";
import { formatPrice } from "../../../../shared/utils/helpers";
import { initialB2BEnquiries } from "../../data/adminB2BEnquiryMockData";

const AdminSellerResponses = () => {
  const navigate = useNavigate();
  const [enquiries] = useState(initialB2BEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResponseStatus, setSelectedResponseStatus] = useState("all");

  // Derive SLA and response status for each enquiry
  const sellerResponseRows = useMemo(() => {
    return enquiries.map((item) => {
      const assignedDate = new Date(item.createdAt);
      // Let's set SLA to 48 hours from creation date
      const deadlineDate = new Date(assignedDate.getTime() + 48 * 60 * 60 * 1000);
      const isResponded = !!item.sellerQuotation;

      let responseTimeHours = "-";
      let daysElapsed = 0;
      let status = "Pending";

      if (isResponded) {
        status = "Responded";
        // Calculate response time from created to quote date
        const quoteDate = new Date(item.responseHistory.find((h) => h.stage.includes("Response") || h.stage.includes("Quote"))?.date || item.createdAt);
        const diffMs = quoteDate.getTime() - assignedDate.getTime();
        responseTimeHours = (diffMs / (1000 * 60 * 60)).toFixed(1) + "h";
        daysElapsed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      } else {
        const now = new Date();
        const diffMs = now.getTime() - assignedDate.getTime();
        daysElapsed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (now > deadlineDate) {
          status = "Overdue";
        } else {
          status = "Pending Response";
        }
      }

      return {
        ...item,
        assignedDate: item.createdAt,
        deadlineDate: deadlineDate.toISOString(),
        daysElapsed,
        responseTimeHours,
        responseStatus: status,
        quotedAmount: item.sellerQuotation ? item.sellerQuotation.quotedValue : null
      };
    });
  }, [enquiries]);

  // Compute overall stats
  const stats = useMemo(() => {
    const total = sellerResponseRows.length;
    const responded = sellerResponseRows.filter((r) => r.responseStatus === "Responded").length;
    const pending = sellerResponseRows.filter((r) => r.responseStatus === "Pending Response").length;
    const overdue = sellerResponseRows.filter((r) => r.responseStatus === "Overdue").length;

    // Filter responses to get numbers for average
    const respondedEntries = sellerResponseRows.filter((r) => r.responseStatus === "Responded" && r.responseTimeHours !== "-");
    const avgResponseTimeVal = respondedEntries.length > 0
      ? (respondedEntries.reduce((acc, curr) => acc + parseFloat(curr.responseTimeHours), 0) / respondedEntries.length).toFixed(1)
      : "8.4";

    return {
      total,
      responded,
      pending,
      overdue,
      avgResponseTime: `${avgResponseTimeVal} hrs`,
      slaPerformance: total > 0 ? Math.round(((responded + pending) / total) * 100) : 100
    };
  }, [sellerResponseRows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return sellerResponseRows.filter((row) => {
      const matchesSearch =
        row.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.buyer.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedResponseStatus === "all" || row.responseStatus === selectedResponseStatus;

      return matchesSearch && matchesStatus;
    });
  }, [sellerResponseRows, searchQuery, selectedResponseStatus]);

  const columns = [
    {
      key: "enquiryNumber",
      label: "Enquiry #",
      sortable: true,
      render: (value, row) => (
        <span
          onClick={() => navigate(`/admin/b2b-enquiries/${row.id}`)}
          className="font-bold text-primary-600 font-mono select-all hover:underline cursor-pointer flex items-center gap-1.5"
        >
          {value}
        </span>
      )
    },
    {
      key: "seller",
      label: "Assigned Seller",
      sortable: true,
      render: (value) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{value.storeName}</span>
          <span className="text-[10px] text-gray-400 font-medium">Rep: {value.name}</span>
        </div>
      )
    },
    {
      key: "assignedDate",
      label: "Assigned On",
      sortable: true,
      render: (value) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-gray-700">
            {new Date(value).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(value).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      )
    },
    {
      key: "deadlineDate",
      label: "Response SLA Deadline",
      sortable: true,
      render: (value, row) => {
        const isOverdue = row.responseStatus === "Overdue";
        return (
          <div className={`flex flex-col text-xs ${isOverdue ? "text-red-650" : "text-gray-600"}`}>
            <span className="font-bold">
              {new Date(value).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
            <span className="text-[10px] opacity-80">
              {new Date(value).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        );
      }
    },
    {
      key: "responseStatus",
      label: "SLA Status",
      sortable: true,
      render: (value) => {
        let variant = "warning";
        if (value === "Responded") variant = "success";
        if (value === "Overdue") variant = "danger";
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: "responseTimeHours",
      label: "Turnaround Time",
      sortable: true,
      render: (value, row) => {
        if (row.responseStatus === "Overdue") {
          return (
            <span className="text-xs font-bold text-red-650 flex items-center gap-1">
              <FiAlertTriangle className="w-3.5 h-3.5" /> Lapsed
            </span>
          );
        }
        return (
          <span className="text-xs text-gray-700 font-semibold">
            {value === "-" ? "Running SLA" : value}
          </span>
        );
      }
    },
    {
      key: "quotedAmount",
      label: "Bid Value",
      sortable: true,
      render: (value) => (
        <span className="text-xs font-extrabold text-gray-900">
          {value ? formatPrice(value) : <span className="text-gray-400 font-medium font-sans">No Bid Yet</span>}
        </span>
      )
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      render: (_, row) => (
        <button
          onClick={() => navigate(`/admin/b2b-enquiries/${row.id}`)}
          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
          title="Inspect Details"
        >
          <FiEye className="w-4 h-4" /> Inspect
        </button>
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 flex items-center gap-2.5">
          <FiBriefcase className="text-primary-600" /> Seller SLA & Response Monitor
        </h1>
        <p className="text-sm text-gray-500">
          Supervise seller quotation response times. Manage bottlenecks, identify delay frequencies, and optimize overall RFQ turnaround efficiency.
        </p>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <FiBriefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned RFQs</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bids Received</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.responded}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Response SLA</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-650">
            <FiAlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overdue SLAs</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.overdue}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FiTrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Turnaround</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-1">{stats.avgResponseTime}</h3>
          </div>
        </div>
      </div>

      {/* Main SLA Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
            <div className="relative flex-1 w-full sm:min-w-[260px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Enquiry #, Seller Store, Buyer Company..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:inline">Filter SLA Status:</span>
              <AnimatedSelect
                value={selectedResponseStatus}
                onChange={(e) => setSelectedResponseStatus(e.target.value)}
                options={[
                  { value: "all", label: "All SLA Statuses" },
                  { value: "Responded", label: "Responded (Bids Submitted)" },
                  { value: "Pending Response", label: "Pending (Within SLA)" },
                  { value: "Overdue", label: "Overdue (SLA Violated)" }
                ]}
                className="w-full sm:w-auto min-w-[200px]"
              />
            </div>

            <div className="w-full sm:w-auto ml-auto">
              <ExportButton
                data={filteredRows}
                headers={[
                  { label: "Enquiry #", accessor: (row) => row.enquiryNumber },
                  { label: "Seller Store", accessor: (row) => row.seller.storeName },
                  { label: "Representative", accessor: (row) => row.seller.name },
                  { label: "Assigned Date", accessor: (row) => row.assignedDate },
                  { label: "SLA Deadline", accessor: (row) => row.deadlineDate },
                  { label: "Days Elapsed", accessor: (row) => row.daysElapsed },
                  { label: "Response Status", accessor: (row) => row.responseStatus },
                  { label: "Turnaround Hours", accessor: (row) => row.responseTimeHours },
                  { label: "Quoted Bid Amount (₹)", accessor: (row) => row.quotedAmount || "0" }
                ]}
                filename="seller_sla_response_reports"
              />
            </div>
          </div>
        </div>

        {/* SLA DataTable */}
        <DataTable
          data={filteredRows}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    </motion.div>
  );
};

export default AdminSellerResponses;
