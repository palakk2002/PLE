import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFlag,
  FiSearch,
  FiEye,
  FiCheck,
  FiSlash,
  FiAlertTriangle,
  FiActivity,
  FiMail,
  FiAlertCircle,
  FiTrash2
} from "react-icons/fi";
import { motion } from "framer-motion";
import DataTable from "../../components/DataTable";
import ExportButton from "../../components/ExportButton";
import Badge from "../../../../shared/components/Badge";
import AnimatedSelect from "../../components/AnimatedSelect";
import toast from "react-hot-toast";
import { initialB2BEnquiries } from "../../data/adminB2BEnquiryMockData";

const AdminRFQSpamMonitor = () => {
  const navigate = useNavigate();

  // Get only flagged enquiries initially
  const initialSpamList = useMemo(() => {
    return initialB2BEnquiries
      .filter((e) => e.flagged)
      .map((e) => ({
        ...e,
        riskScore: e.riskScore || 85,
        spamStatus: e.spamStatus || "Flagged",
        detectionMethod: e.detectionMethod || "Auto (AI Filter)",
        flagReason: e.flagReason || "Repetitive generic text structure, potential promotional spam bot."
      }));
  }, []);

  const [spamRecords, setSpamRecords] = useState(initialSpamList);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");

  // Moderate spam status (Verified, Blocked)
  const handleModerateSpam = (id, action) => {
    let nextStatus = "Flagged";
    if (action === "safe") {
      nextStatus = "Verified Safe";
      toast.success("Enquiry marked as Safe. Spam flag removed.");
    } else if (action === "block") {
      nextStatus = "Blocked";
      toast.error("Buyer account and IP successfully Blocked.");
    }

    setSpamRecords((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              spamStatus: nextStatus,
              riskScore: action === "safe" ? 0 : item.riskScore
            }
          : item
      )
    );
  };

  // Derive stats
  const stats = useMemo(() => {
    return {
      total: spamRecords.length,
      flagged: spamRecords.filter((s) => s.spamStatus === "Flagged").length,
      blocked: spamRecords.filter((s) => s.spamStatus === "Blocked").length,
      safe: spamRecords.filter((s) => s.spamStatus === "Verified Safe").length,
      avgRiskScore:
        spamRecords.length > 0
          ? Math.round(
              spamRecords.reduce((acc, c) => acc + c.riskScore, 0) / spamRecords.length
            )
          : 0
    };
  }, [spamRecords]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return spamRecords.filter((row) => {
      const matchesSearch =
        row.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.flagReason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "all" || row.spamStatus === selectedStatus;

      let matchesRisk = true;
      if (selectedRiskLevel !== "all") {
        if (selectedRiskLevel === "Critical") matchesRisk = row.riskScore >= 90;
        if (selectedRiskLevel === "High") matchesRisk = row.riskScore >= 75 && row.riskScore < 90;
        if (selectedRiskLevel === "Medium") matchesRisk = row.riskScore >= 40 && row.riskScore < 75;
      }

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [spamRecords, searchQuery, selectedStatus, selectedRiskLevel]);

  const columns = [
    {
      key: "enquiryNumber",
      label: "Enquiry #",
      sortable: true,
      render: (value, row) => (
        <span
          onClick={() => navigate(`/admin/b2b-enquiries/${row.id}`)}
          className="font-bold text-primary-600 font-mono select-all hover:underline cursor-pointer flex items-center gap-1 text-xs"
        >
          {value}
        </span>
      )
    },
    {
      key: "buyer",
      label: "Buyer / Organization",
      sortable: true,
      render: (value) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-gray-800">{value.name}</span>
          <span className="text-[10px] text-gray-400 font-medium">{value.company}</span>
          <span className="text-[9px] text-gray-400 font-mono mt-0.5 truncate max-w-[150px]">{value.email}</span>
        </div>
      )
    },
    {
      key: "flagReason",
      label: "Detection Flags",
      sortable: false,
      render: (value) => (
        <span className="text-xs text-red-750 font-semibold bg-red-50 px-2.5 py-1 rounded-xl block max-w-[220px] truncate leading-tight" title={value}>
          {value}
        </span>
      )
    },
    {
      key: "riskScore",
      label: "Spam Risk Score",
      sortable: true,
      render: (value) => {
        let barColor = "bg-green-500";
        let textColor = "text-green-600";
        if (value >= 90) {
          barColor = "bg-red-600 animate-pulse";
          textColor = "text-red-600 font-black";
        } else if (value >= 70) {
          barColor = "bg-red-500";
          textColor = "text-red-500 font-extrabold";
        } else if (value >= 40) {
          barColor = "bg-amber-500";
          textColor = "text-amber-500 font-bold";
        }

        return (
          <div className="flex items-center gap-2 min-w-[100px]">
            <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
              <div className={`${barColor} h-full`} style={{ width: `${value}%` }} />
            </div>
            <span className={`text-xs font-mono font-bold shrink-0 ${textColor}`}>{value}%</span>
          </div>
        );
      }
    },
    {
      key: "detectionMethod",
      label: "Method",
      sortable: true,
      render: (value) => (
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">
          {value}
        </span>
      )
    },
    {
      key: "spamStatus",
      label: "Trust Status",
      sortable: true,
      render: (value) => {
        let variant = "warning";
        if (value === "Verified Safe") variant = "success";
        if (value === "Blocked") variant = "danger";
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    {
      key: "actions",
      label: "Trust Actions",
      sortable: false,
      render: (_, row) => {
        const isSettled = row.spamStatus === "Verified Safe" || row.spamStatus === "Blocked";
        if (isSettled) {
          return (
            <span className="text-[10px] text-gray-400 font-bold uppercase">Mediation Settled</span>
          );
        }
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleModerateSpam(row.id, "safe")}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100 flex items-center justify-center gap-1 text-[10px] font-bold"
              title="Mark Safe (False Positive)"
            >
              <FiCheck className="w-3.5 h-3.5" /> Dismiss
            </button>
            <button
              onClick={() => handleModerateSpam(row.id, "block")}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100 flex items-center justify-center gap-1 text-[10px] font-bold"
              title="Block Spammer IP & Account"
            >
              <FiSlash className="w-3.5 h-3.5" /> Block
            </button>
          </div>
        );
      }
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
          <FiFlag className="text-primary-600" /> trust & safety: RFQ Spam Monitor
        </h1>
        <p className="text-sm text-gray-500">
          Supervise automated spam flags. Track bot indicators, filter out scrapers, block persistent junk accounts, and clear false-positive trust ratings.
        </p>
      </div>

      {/* Trust KPI Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-650">
            <FiFlag className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Flagged Incidents</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Awaiting Audit</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.flagged}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-650 border border-rose-100">
            <FiSlash className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Blocked Bots</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.blocked}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dismissed Safe</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">{stats.safe}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 col-span-2 lg:col-span-1 bg-red-50/10 border-red-100/50">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-650">
            <FiActivity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-red-650 uppercase tracking-wider">Avg Spam Index</p>
            <h3 className="text-lg sm:text-xl font-black text-red-650 mt-1">{stats.avgRiskScore}%</h3>
          </div>
        </div>
      </div>

      {/* Trust DataTable Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
            <div className="relative flex-1 w-full sm:min-w-[260px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Enquiry #, Buyer organization, Reason..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:inline">Trust State:</span>
              <AnimatedSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "all", label: "All Trust States" },
                  { value: "Flagged", label: "Flagged (Active Threats)" },
                  { value: "Verified Safe", label: "Verified (Safe/False Alarm)" },
                  { value: "Blocked", label: "Blocked (Banned)" }
                ]}
                className="w-full sm:w-auto min-w-[170px]"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:inline">Risk Threshold:</span>
              <AnimatedSelect
                value={selectedRiskLevel}
                onChange={(e) => setSelectedRiskLevel(e.target.value)}
                options={[
                  { value: "all", label: "All Risk Levels" },
                  { value: "Critical", label: "Critical Risk (>= 90%)" },
                  { value: "High", label: "High Risk (>= 75%)" },
                  { value: "Medium", label: "Medium Risk (>= 40%)" }
                ]}
                className="w-full sm:w-auto min-w-[170px]"
              />
            </div>

            <div className="w-full sm:w-auto ml-auto">
              <ExportButton
                data={filteredRows}
                headers={[
                  { label: "Enquiry #", accessor: (row) => row.enquiryNumber },
                  { label: "Buyer Company", accessor: (row) => row.buyer.company },
                  { label: "Buyer Email", accessor: (row) => row.buyer.email },
                  { label: "Flag Reason", accessor: (row) => row.flagReason },
                  { label: "Spam Risk Score (%)", accessor: (row) => row.riskScore },
                  { label: "Trust Status", accessor: (row) => row.spamStatus },
                  { label: "Detection Method", accessor: (row) => row.detectionMethod },
                  { label: "Incident Date", accessor: (row) => row.createdAt }
                ]}
                filename="trust_spam_monitor_reports"
              />
            </div>
          </div>
        </div>

        {/* Spam Table */}
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

export default AdminRFQSpamMonitor;
