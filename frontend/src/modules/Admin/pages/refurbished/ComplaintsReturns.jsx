import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRotateCcw,
  FiAlertCircle,
  FiTruck,
  FiFileText,
  FiSearch,
  FiChevronRight,
  FiCamera,
  FiCheckCircle,
  FiXCircle,
  FiSliders,
} from "react-icons/fi";
import Badge from "../../../../shared/components/Badge";
import toast from "react-hot-toast";
import api from "../../../../shared/utils/api";

const ComplaintsReturns = () => {
  const [returnsList, setReturnsList] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("complaints"); // complaints, tracking, inspection, claims
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const res = await api.get('/admin/refurbished-returns');
        setReturnsList(res.data);
      } catch (err) {
        toast.error("Failed to fetch refurbished returns");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id, newStatus, trackingStep) => {
    try {
      await api.patch(`/admin/refurbished-returns/${id}/status`, { status: newStatus, trackingStep });
      
      const updated = returnsList.map((r) => {
        if (r.id === id) {
          return { ...r, status: newStatus, trackingStep };
        }
        return r;
      });
      setReturnsList(updated);
      if (selectedReturn && selectedReturn.id === id) {
        setSelectedReturn({ ...selectedReturn, status: newStatus, trackingStep });
      }
      toast.success(`Return status updated successfully.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update return status");
    }
  };

  const handleApproveRefund = (id) => {
    handleUpdateStatus(id, "refund_processed", 4);
  };

  const handleRejectClaim = (id) => {
    handleUpdateStatus(id, "claim_rejected", 4);
  };

  // Filters
  const filteredList = returnsList.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeSubTab === "complaints") {
      return matchesSearch; // show all for complaints
    } else if (activeSubTab === "tracking") {
      return matchesSearch && r.status !== "refund_processed" && r.status !== "claim_rejected";
    } else if (activeSubTab === "inspection") {
      return matchesSearch && r.status === "qc_center";
    } else if (activeSubTab === "claims") {
      return matchesSearch && r.hasDamageReport;
    }
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "return_initiated":
        return <Badge variant="neutral">Return Initiated</Badge>;
      case "in_transit":
        return <Badge variant="info">In Transit</Badge>;
      case "qc_center":
        return <Badge variant="warning">QC Inspection Center</Badge>;
      case "refund_processed":
        return <Badge variant="success">Refund Processed</Badge>;
      case "claim_rejected":
        return <Badge variant="error">Claim Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <FiRotateCcw className="text-[#C07A3D]" />
          Refurbished Complaints & Returns
        </h1>
        <p className="text-sm text-gray-500">
          Track returning refurbished shipments, evaluate customer defect reports, and review physical damage photo claims.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4">
        <div className="flex border-b border-gray-100 pb-2 flex-wrap gap-2">
          {[
            { id: "complaints", label: "Product Complaints", icon: FiAlertCircle },
            { id: "tracking", label: "Return Tracking Log", icon: FiTruck },
            { id: "inspection", label: "QC Inspection Queue", icon: FiSliders },
            { id: "claims", label: "Damage Reports & Photos", icon: FiFileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  setSelectedReturn(null);
                }}
                className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 ${
                  activeSubTab === tab.id
                    ? "bg-[#C07A3D] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Buyer name, Product name, or return ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C07A3D]/40 text-sm"
          />
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lists log */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-base capitalize border-b border-gray-100 pb-3">
            {activeSubTab} List ({filteredList.length})
          </h3>

          <div className="divide-y divide-gray-100">
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedReturn(item)}
                  className={`py-3.5 px-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-between gap-4 ${
                    selectedReturn && selectedReturn.id === item.id ? "bg-[#C07A3D]/5 border border-[#C07A3D]/10" : ""
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#C07A3D] font-bold">#{item.id}</span>
                      <span className="text-xs text-gray-400">Date: {item.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 truncate">{item.productName}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      Buyer: <span className="font-bold text-gray-700">{item.buyerName}</span> - Issue: {item.issue}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(item.status)}
                    <FiChevronRight className="text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm font-semibold">
                No active records matching current selection.
              </div>
            )}
          </div>
        </div>

        {/* Action / Detail Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <AnimatePresence mode="wait">
            {selectedReturn ? (
              <motion.div
                key={selectedReturn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* ID and general header */}
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-mono text-[#C07A3D] font-bold block">
                    RETURN ID: #{selectedReturn.id}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mt-1">
                    {selectedReturn.productName}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Vendor: <span className="font-bold text-gray-600">{selectedReturn.vendorName}</span>
                  </p>
                </div>

                {/* Complaint details */}
                <div className="space-y-1 bg-rose-50/50 border border-rose-100 p-3 rounded-xl text-xs">
                  <span className="font-bold text-rose-800 block">Buyer Defect Complaint:</span>
                  <p className="text-gray-600 leading-relaxed">{selectedReturn.issue}</p>
                </div>

                {/* Tracking Progress */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Return Shipping Tracking
                  </h4>
                  <div className="space-y-2">
                    {[
                      { step: 1, label: "Return Initiated" },
                      { step: 2, label: "In Transit" },
                      { step: 3, label: "QC Inspection Center" },
                      { step: 4, label: "Refund / Resolution Settled" },
                    ].map((t) => {
                      const isActive = selectedReturn.trackingStep >= t.step;
                      return (
                        <div key={t.step} className="flex items-center gap-3 text-xs font-medium">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isActive ? "bg-[#C07A3D] text-white" : "bg-gray-100 text-gray-400"
                          }`}>
                            {t.step}
                          </div>
                          <span className={isActive ? "text-gray-900 font-bold" : "text-gray-400"}>
                            {t.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Damage photos claims */}
                {selectedReturn.hasDamageReport && (
                  <div className="space-y-3 bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-xs">
                    <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                      <FiCamera className="text-[#C07A3D]" /> QC Damage Report Photos
                    </h4>
                    {selectedReturn.photoUrl && (
                      <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                        <img
                          src={selectedReturn.photoUrl}
                          alt="QC check"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-gray-500 leading-relaxed">
                      <span className="font-bold text-gray-700 block mt-1">Inspection Note:</span>
                      {selectedReturn.damageNotes}
                    </p>
                  </div>
                )}

                {/* Moderation actions */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Resolution Status Override
                  </h4>
                  
                  {/* Status switches */}
                  {selectedReturn.status !== "refund_processed" && selectedReturn.status !== "claim_rejected" && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleUpdateStatus(selectedReturn.id, "in_transit", 2)}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold"
                      >
                        Set In Transit
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedReturn.id, "qc_center", 3)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold border border-amber-100"
                      >
                        Set QC Center
                      </button>
                    </div>
                  )}

                  {/* Approve/Reject claims */}
                  {selectedReturn.status !== "refund_processed" && selectedReturn.status !== "claim_rejected" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveRefund(selectedReturn.id)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1"
                      >
                        <FiCheckCircle /> Settle Refund
                      </button>
                      <button
                        onClick={() => handleRejectClaim(selectedReturn.id)}
                        className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1"
                      >
                        <FiXCircle /> Deny Claim
                      </button>
                    </div>
                  )}

                  {/* Already Resolved */}
                  {(selectedReturn.status === "refund_processed" || selectedReturn.status === "claim_rejected") && (
                    <div className="bg-gray-100 border border-gray-200 text-center py-2.5 rounded-xl text-xs font-bold text-gray-500">
                      ✓ Resolution Finalized ({selectedReturn.status === "refund_processed" ? "Refunded" : "Denied"})
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20 text-gray-400 text-xs">
                Select an active return request from the list to manage diagnostics, tracking, and damage photos.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplaintsReturns;
