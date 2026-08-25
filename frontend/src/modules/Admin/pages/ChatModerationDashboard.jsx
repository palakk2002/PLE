import { useState, useEffect, useCallback } from "react";
import { FiShield, FiAlertTriangle, FiFilter, FiRefreshCw, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../../shared/utils/api";

// ── Category display config ──────────────────────────────────
const CATEGORY_LABELS = {
  PHONE_NUMBER:     { label: "Phone Number",     color: "bg-red-100 text-red-700" },
  UPI_ID:           { label: "UPI ID",            color: "bg-orange-100 text-orange-700" },
  BANK_DETAILS:     { label: "Bank Details",      color: "bg-orange-100 text-orange-700" },
  IFSC:             { label: "IFSC Code",          color: "bg-orange-100 text-orange-700" },
  PAYMENT_LINK:     { label: "Payment Link",      color: "bg-yellow-100 text-yellow-700" },
  EMAIL:            { label: "Email Address",     color: "bg-purple-100 text-purple-700" },
  EXTERNAL_CONTACT: { label: "External Contact",  color: "bg-blue-100 text-blue-700" },
  EXTERNAL_PAYMENT: { label: "External Payment",  color: "bg-pink-100 text-pink-700" },
  SUSPICIOUS:       { label: "Suspicious",        color: "bg-gray-100 text-gray-700" },
  OTHER:            { label: "Other",             color: "bg-gray-100 text-gray-700" },
};

const ACTION_LABELS = {
  BLOCK: { label: "Blocked", color: "bg-red-100 text-red-700" },
  FLAG:  { label: "Flagged", color: "bg-yellow-100 text-yellow-700" },
};

const DIRECTION_LABELS = {
  USER_TO_VENDOR:  "User → Vendor",
  VENDOR_TO_USER:  "Vendor → User",
};

const EMPTY_STATS = { totalViolations: 0, last24Hours: 0, byCategory: [], byAction: [] };

// ── Main Component ────────────────────────────────────────────
export default function ChatModerationDashboard() {
  const [violations, setViolations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    category: "",
    action: "",
    senderType: "",
    direction: "",
    from: "",
    to: "",
  });
  const [page, setPage] = useState(1);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get("/admin/chat-moderation/stats");
      setStats(res?.data?.data || EMPTY_STATS);
    } catch {
      setStats(EMPTY_STATS);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filters.category)   params.append("category",   filters.category);
      if (filters.action)     params.append("action",     filters.action);
      if (filters.senderType) params.append("senderType", filters.senderType);
      if (filters.direction)  params.append("direction",  filters.direction);
      if (filters.from)       params.append("from",       filters.from);
      if (filters.to)         params.append("to",         filters.to);

      const res = await api.get(`/admin/chat-moderation/violations?${params.toString()}`);
      const data = res?.data?.data || {};
      setViolations(data.violations || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
    } catch {
      setError("Failed to load violations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchViolations(); }, [fetchViolations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: "", action: "", senderType: "", direction: "", from: "", to: "" });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <FiShield className="text-red-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chat Moderation</h1>
            <p className="text-sm text-gray-500">Review blocked and flagged chat violations</p>
          </div>
        </div>
        <button
          onClick={() => { fetchStats(); fetchViolations(); }}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
          id="refresh-violations-btn"
        >
          <FiRefreshCw className="text-sm" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Violations"
          value={statsLoading ? "—" : stats.totalViolations}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          label="Last 24 Hours"
          value={statsLoading ? "—" : stats.last24Hours}
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <StatCard
          label="Blocked"
          value={statsLoading ? "—" : (stats.byAction?.find(a => a._id === "BLOCK")?.count ?? 0)}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          label="Flagged"
          value={statsLoading ? "—" : (stats.byAction?.find(a => a._id === "FLAG")?.count ?? 0)}
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
      </div>

      {/* Category Breakdown */}
      {!statsLoading && stats.byCategory?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Violations by Category</h2>
          <div className="flex flex-wrap gap-2">
            {stats.byCategory.map(item => (
              <button
                key={item._id}
                onClick={() => handleFilterChange("category", filters.category === item._id ? "" : item._id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filters.category === item._id
                    ? "border-gray-400 ring-2 ring-gray-400 ring-offset-1"
                    : "border-transparent"
                } ${CATEGORY_LABELS[item._id]?.color || "bg-gray-100 text-gray-700"}`}
              >
                <span>{CATEGORY_LABELS[item._id]?.label || item._id}</span>
                <span className="bg-white bg-opacity-60 rounded-full px-1">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="text-gray-500 text-sm" />
          <span className="text-sm font-semibold text-gray-700">Filters</span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-auto text-xs text-red-600 hover:underline">
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <FilterSelect
            id="filter-category"
            label="Category"
            value={filters.category}
            onChange={v => handleFilterChange("category", v)}
            options={Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v.label }))}
          />
          <FilterSelect
            id="filter-action"
            label="Action"
            value={filters.action}
            onChange={v => handleFilterChange("action", v)}
            options={[{ value: "BLOCK", label: "Blocked" }, { value: "FLAG", label: "Flagged" }]}
          />
          <FilterSelect
            id="filter-sender"
            label="Sender"
            value={filters.senderType}
            onChange={v => handleFilterChange("senderType", v)}
            options={[{ value: "customer", label: "Customer" }, { value: "vendor", label: "Vendor" }]}
          />
          <FilterSelect
            id="filter-direction"
            label="Direction"
            value={filters.direction}
            onChange={v => handleFilterChange("direction", v)}
            options={[
              { value: "USER_TO_VENDOR", label: "User → Vendor" },
              { value: "VENDOR_TO_USER", label: "Vendor → User" },
            ]}
          />
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              id="filter-from"
              type="date"
              value={filters.from}
              onChange={e => handleFilterChange("from", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              id="filter-to"
              type="date"
              value={filters.to}
              onChange={e => handleFilterChange("to", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Violations
            {!loading && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({pagination.total} total)
              </span>
            )}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm animate-pulse">
            Loading violations...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : violations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <FiShield className="text-3xl mx-auto mb-2 text-gray-300" />
            No violations found.
            {hasActiveFilters && " Try clearing your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Direction</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thread</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {violations.map(v => (
                  <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_LABELS[v.category]?.color || "bg-gray-100 text-gray-700"}`}>
                        {CATEGORY_LABELS[v.category]?.label || v.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ACTION_LABELS[v.action]?.color || "bg-gray-100 text-gray-700"}`}>
                        {ACTION_LABELS[v.action]?.label || v.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {DIRECTION_LABELS[v.direction] || v.direction}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate">
                      {v.vendorId?.storeName || v.vendorId?.name || String(v.vendorId?._id || v.vendorId || "—").slice(-6)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                      {String(v.threadId || "—").slice(-8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-1">
              <button
                id="violations-prev-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="text-sm" />
              </button>
              <button
                id="violations-next-btn"
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={pagination.page >= pagination.pages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-gray-400 text-center">
        <FiAlertTriangle className="inline mr-1" />
        Actual message content is not stored or displayed here. Only violation metadata is retained.
      </p>
    </div>
  );
}

// ── Helper Components ─────────────────────────────────────────

function StatCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl p-4`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
      >
        <option value="">All</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
