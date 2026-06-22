import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiEye,
  FiMessageSquare,
  FiInbox,
  FiUser,
} from "react-icons/fi";
import DataTable from "../../../Admin/components/DataTable";
import Badge from "../../../../shared/components/Badge";
import api from "../../../../shared/utils/api";

const VendorDirectRFQs = () => {
  const navigate = useNavigate();
  const [directRfqs, setDirectRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDirectRFQs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/vendor/direct-rfq");
        const payload = res?.data ?? res;
        const list = Array.isArray(payload) ? payload : [];
        const sorted = [...list].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setDirectRfqs(sorted);
      } catch (err) {
        console.error("Failed to fetch Direct RFQs:", err);
        setDirectRfqs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectRFQs();
  }, []);

  const getStatusVariant = (status) => {
    const map = {
      "Pending Vendor": "warning",
      Negotiating: "info",
      "Vendor Accepted": "success",
      "Pending Admin Approval": "info",
      "PO Generated": "success",
      Rejected: "danger",
    };
    return map[status] || "default";
  };

  const filtered = useMemo(() => {
    let list = directRfqs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          (r.directRfqId || "").toLowerCase().includes(q) ||
          (r.customProductName || "").toLowerCase().includes(q) ||
          (r.employeeId?.name || "").toLowerCase().includes(q) ||
          (r.category || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    return list;
  }, [directRfqs, searchQuery, statusFilter]);

  const columns = [
    {
      label: "RFQ ID",
      key: "directRfqId",
      render: (_, row) => (
        <span className="font-mono text-xs font-bold text-gray-800">
          {row.directRfqId}
        </span>
      ),
    },
    {
      label: "Product",
      key: "customProductName",
      render: (_, row) => (
        <span className="text-xs font-semibold text-gray-700">
          {row.customProductName || row.productId?.name || "N/A"}
        </span>
      ),
    },
    {
      label: "From Employee",
      key: "employeeId",
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <FiUser className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">
            {row.employeeId?.name || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      label: "Qty",
      key: "quantity",
      render: (_, row) => (
        <span className="text-xs font-bold text-gray-800">{row.quantity}</span>
      ),
    },
    {
      label: "Target Price",
      key: "targetPrice",
      render: (_, row) => (
        <span className="text-xs font-bold text-gray-800">
          ₹{row.targetPrice?.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (_, row) => (
        <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      label: "Date",
      key: "createdAt",
      render: (_, row) => (
        <span className="text-[10px] text-gray-500 font-semibold">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      label: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vendor/direct-rfqs/${row._id}`);
            }}
            className="p-1.5 bg-[#C07A3D]/10 text-[#C07A3D] rounded-lg hover:bg-[#C07A3D]/20 transition-colors"
            title="View Details"
          >
            <FiEye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vendor/direct-rfqs/${row._id}?tab=chat`);
            }}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title="Chat"
          >
            <FiMessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Direct RFQs from Employees
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            RFQs sent directly to you by B2B company employees for negotiation
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: directRfqs.length,
            color: "text-gray-800",
          },
          {
            label: "Pending",
            value: directRfqs.filter((r) => r.status === "Pending Vendor")
              .length,
            color: "text-amber-600",
          },
          {
            label: "Negotiating",
            value: directRfqs.filter((r) => r.status === "Negotiating").length,
            color: "text-blue-600",
          },
          {
            label: "Accepted",
            value: directRfqs.filter(
              (r) =>
                r.status === "Vendor Accepted" || r.status === "PO Generated"
            ).length,
            color: "text-emerald-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-2xl font-black mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by RFQ ID, product, employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C07A3D]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C07A3D]"
        >
          <option value="all">All Statuses</option>
          <option value="Pending Vendor">Pending Vendor</option>
          <option value="Negotiating">Negotiating</option>
          <option value="Vendor Accepted">Vendor Accepted</option>
          <option value="Pending Admin Approval">Pending Admin Approval</option>
          <option value="PO Generated">PO Generated</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-xl h-8 w-8 border-t-2 border-b-2 border-[#C07A3D]"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FiInbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-400">
            No Direct RFQs found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Employees haven't sent any Direct RFQs to you yet.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={10}
          onRowClick={(row) => navigate(`/vendor/direct-rfqs/${row._id}`)}
        />
      )}
    </motion.div>
  );
};

export default VendorDirectRFQs;
