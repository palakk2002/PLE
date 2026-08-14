import { useState, useEffect } from "react";
import { FiSearch, FiLayers, FiAlertCircle, FiCheckCircle, FiXCircle, FiTrendingUp, FiSettings, FiEdit, FiTrash2, FiActivity, FiUser, FiInfo, FiSend, FiEye, FiMaximize2, FiMail, FiPhone, FiCalendar, FiPackage, FiDollarSign, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";

const ProductRequestsDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, General, PLE Shop
  
  // Status modification state
  const [selectedReq, setSelectedReq] = useState(null);
  const [nextStatus, setNextStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");

  // Full Details View state
  const [viewingDetailsReq, setViewingDetailsReq] = useState(null);

  // Detailed Sourcing Workspace state
  const [sourcingReq, setSourcingReq] = useState(null);
  const [sourcingData, setSourcingData] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [sourcingMode, setSourcingMode] = useState("PLE_SHOP"); // PLE_SHOP, VENDOR, SPLIT

  // Proposal Submission state
  const [proposalReq, setProposalReq] = useState(null);
  const [proposalData, setProposalData] = useState({
    pleQuantity: 0,
    vendors: [],
    finalPrice: "",
    estimatedDelivery: "",
    notes: ""
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/product-requests');
      if (response.success || response.statusCode === 200) {
        const payload = response.data;
        const list = Array.isArray(payload) ? payload : (payload?.requests || []);
        setRequests(list);
      }
    } catch (error) {
      console.error("Failed to fetch product requests:", error);
      toast.error("Failed to fetch requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Submitted" || r.status === "Under Review" || r.status === "Vendor Sourcing" || r.status === "PLE Sourcing").length;
    const accepted = requests.filter((r) => r.status === "Accepted" || r.status === "Confirmed" || r.status === "Completed" || r.status === "Product Added").length;
    const rejected = requests.filter((r) => r.status === "Rejected").length;
    return { total, pending, accepted, rejected };
  };

  const handleStatusChangeClick = (req, status) => {
    setSelectedReq(req);
    setNextStatus(status);
    setAdminComment(
      status === "Under Review" ? "Your request is currently being reviewed by our sourcing team." :
      status === "Accepted" ? "Sourcing options found. Request accepted and sellers notified." :
      status === "Rejected" ? "Sorry, we are unable to source this product model at the moment." :
      status === "Product Added" ? "Great news! The product has been successfully added to our catalog." :
      ""
    );
  };

  const submitStatusChange = async () => {
    try {
      const response = await api.put(`/admin/product-requests/${selectedReq.id}/status`, {
        status: nextStatus,
        comment: adminComment
      });
      if (response.success || response.statusCode === 200) {
        toast.success(`Updated request status to ${nextStatus}`);
        loadRequests();
        setSelectedReq(null);
        if (viewingDetailsReq && viewingDetailsReq.id === selectedReq.id) {
          setViewingDetailsReq(null);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleOpenSourcingWorkspace = async (req) => {
    setSourcingReq(req);
    setSourcingMode(req.fulfillmentType && req.fulfillmentType !== "NONE" ? req.fulfillmentType : "PLE_SHOP");
    setSelectedVendors(req.assignedVendors?.map(v => v.vendorId) || []);
    try {
      const response = await api.get(`/admin/product-requests/${req.id}/sourcing-check`);
      if (response.success || response.statusCode === 200) {
        setSourcingData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load live sourcing inventory.");
    }
  };

  const submitSourcingAssignment = async () => {
    try {
      const response = await api.post(`/admin/product-requests/${sourcingReq.id}/assign-sourcing`, {
        fulfillmentType: sourcingMode,
        vendors: selectedVendors.map(id => ({ vendorId: id }))
      });
      if (response.success || response.statusCode === 200) {
        toast.success("Sourcing strategy assigned successfully!");
        loadRequests();
        setSourcingReq(null);
        setSourcingData(null);
      }
    } catch (err) {
      toast.error("Failed to assign sourcing targets.");
    }
  };

  const handleOpenProposalWorkspace = (req) => {
    setProposalReq(req);
    // Auto fill with existing responses if available
    const responsiveVendors = req.assignedVendors
      ?.filter(v => v.status === "RESPONDED")
      ?.map(v => ({
        vendorId: v.vendorId,
        quantity: req.quantity,
        price: v.offeredPrice
      })) || [];

    setProposalData({
      pleQuantity: req.fulfillmentType === "PLE_SHOP" || req.fulfillmentType === "SPLIT" ? req.quantity : 0,
      vendors: responsiveVendors,
      finalPrice: responsiveVendors[0]?.price || req.expectedBudget || "",
      estimatedDelivery: "",
      notes: ""
    });
  };

  const submitFinalProposal = async () => {
    if (!proposalData.finalPrice) {
      toast.error("Please enter a final proposed price");
      return;
    }
    try {
      const response = await api.post(`/admin/product-requests/${proposalReq.id}/select-fulfillment`, proposalData);
      if (response.success || response.statusCode === 200) {
        toast.success("Final proposal dispatched to B2B buyer!");
        loadRequests();
        setProposalReq(null);
      }
    } catch (err) {
      toast.error("Failed to submit proposal");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request record?")) {
      try {
        const response = await api.delete(`/admin/product-requests/${id}`);
        if (response.success || response.statusCode === 200) {
          toast.success("Request record deleted.");
          loadRequests();
          if (viewingDetailsReq && viewingDetailsReq.id === id) {
            setViewingDetailsReq(null);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete request');
      }
    }
  };

  const stats = getStats();

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = (
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!matchesSearch) return false;

    if (filterType === "General") {
      return r.requestType === "GENERAL";
    }
    if (filterType === "PLE Shop") {
      return (
        r.requestType === "SHOP_SPECIFIC" &&
        (r.targetEntityType === "ManagedShop" || 
         r.targetEntityId?.name === "PLE Shop" || 
         r.targetEntityId?.storeName === "PLE Shop" || 
         String(r.targetEntityId) === "1" ||
         r.targetEntityName === "PLE Shop")
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const style = 
      status === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-200" :
      status === "Under Review" ? "bg-yellow-50 text-yellow-800 border-yellow-250" :
      status === "Vendor Sourcing" ? "bg-purple-50 text-purple-700 border-purple-200" :
      status === "PLE Sourcing" ? "bg-teal-50 text-teal-700 border-teal-200" :
      status === "Final Proposal" ? "bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse" :
      status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-250 font-black" :
      status === "Accepted" ? "bg-green-50 text-green-700 border-green-200" :
      status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
      "bg-emerald-50 text-emerald-700 border-emerald-200";

    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-2">B2B Product Sourcing Workspace</h1>
        <p className="text-sm text-gray-500">Manage buyer custom product requests, check PLE inventory, find vendors, assign RFQs, and submit final proposals</p>
      </div>

      {/* Analytics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: stats.total, icon: FiLayers, color: "text-blue-600 bg-blue-50" },
            { label: "Active Sourcing", value: stats.pending, icon: FiAlertCircle, color: "text-amber-600 bg-amber-50" },
            { label: "Accepted / Confirmed", value: stats.accepted, icon: FiCheckCircle, color: "text-emerald-600 bg-emerald-50" },
            { label: "Rejected Requests", value: stats.rejected, icon: FiXCircle, color: "text-red-650 bg-red-50" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                <h2 className="text-3xl font-black text-gray-800 mt-1">{card.value}</h2>
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <card.icon className="text-2xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requests table control */}
      <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-extrabold text-gray-800 text-lg">All B2B Procurement Requests</h3>
            {/* Filter Tabs */}
            <div className="flex gap-2 mt-2">
              {["All", "General", "PLE Shop"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${
                    filterType === type
                      ? "bg-indigo-600 text-white border-indigo-650"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {type === "All" ? "All Requests" : type === "General" ? "Marketplace Sourcing" : "PLE Shop Requests"}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative w-full sm:max-w-xs shrink-0">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requests..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500 font-semibold">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FiLayers className="mx-auto text-4xl mb-2" />
              <span>No requests found matching criteria.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase">
                  <th className="p-4">Request Details</th>
                  <th className="p-4">Specifications</th>
                  <th className="p-4">Sourcing Strategy</th>
                  <th className="p-4">Sourcing Options</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Manage</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {req.image ? (
                          <div 
                            onClick={() => setViewingDetailsReq(req)}
                            className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-150 cursor-pointer hover:opacity-80 transition-opacity"
                            title="Click to view full image & details"
                          >
                            <img src={req.image} alt={req.productName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div 
                            onClick={() => setViewingDetailsReq(req)}
                            className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-sm cursor-pointer hover:bg-indigo-100 transition-colors"
                          >
                            {req.productName?.charAt(0).toUpperCase() || "P"}
                          </div>
                        )}
                        <div>
                          <h4 
                            onClick={() => setViewingDetailsReq(req)}
                            className="font-extrabold text-gray-800 hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {req.productName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <span>{req.id}</span>
                            {req.userId?.name && (
                              <span className="font-sans font-bold text-gray-600">
                                • {req.userId.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      <div>Category: <strong className="text-gray-700">{req.category}</strong></div>
                      <div>Requested Qty: <strong className="text-gray-700">{req.quantity}</strong></div>
                      <div>Budget: <strong className="text-gray-700">₹{req.expectedBudget}</strong></div>
                      {req.description && (
                        <div className="text-[11px] text-gray-400 line-clamp-1 italic mt-0.5">
                          "{req.description}"
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                        {!req.fulfillmentType || req.fulfillmentType === "NONE" ? "Unassigned" : req.fulfillmentType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {req.assignedVendors && req.assignedVendors.length > 0 ? (
                        <div className="text-indigo-650 font-bold">
                          {req.assignedVendors.filter(v => v.status === "RESPONDED").length} / {req.assignedVendors.length} bids responded
                        </div>
                      ) : (
                        <span>No vendors assigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-center max-w-[200px] mx-auto">
                        <button
                          onClick={() => setViewingDetailsReq(req)}
                          className="w-full px-3 py-1 bg-gray-100 text-gray-750 hover:bg-gray-200 font-extrabold text-xs rounded transition-all flex items-center justify-center gap-1"
                        >
                          <FiEye className="text-xs" />
                          <span>Full Details</span>
                        </button>
                        <button
                          onClick={() => handleOpenSourcingWorkspace(req)}
                          className="w-full px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-extrabold text-xs rounded transition-all"
                        >
                          Sourcing Strategy
                        </button>
                        <button
                          onClick={() => handleOpenProposalWorkspace(req)}
                          disabled={req.status === "Submitted" || req.status === "Under Review"}
                          className={`w-full px-3 py-1 font-extrabold text-xs rounded transition-all ${
                            req.status === "Submitted" || req.status === "Under Review"
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          Select Fulfillment
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Full Request Details Modal */}
      <AnimatePresence>
        {viewingDetailsReq && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-3xl w-full border border-gray-100 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-indigo-600 font-mono font-black">{viewingDetailsReq.id}</span>
                    {getStatusBadge(viewingDetailsReq.status)}
                  </div>
                  <h2 className="text-2xl font-black text-gray-850">{viewingDetailsReq.productName}</h2>
                </div>
                <button
                  onClick={() => setViewingDetailsReq(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Reference Image (If Uploaded) */}
              {viewingDetailsReq.image && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Buyer Uploaded Reference Image</label>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 max-h-80 bg-gray-50 flex items-center justify-center">
                    <img
                      src={viewingDetailsReq.image}
                      alt={viewingDetailsReq.productName}
                      className="max-h-80 w-full object-contain"
                    />
                    <a
                      href={viewingDetailsReq.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 bg-black/75 hover:bg-black text-white text-xs px-3.5 py-2 rounded-xl font-bold backdrop-blur-sm transition-colors flex items-center gap-1.5 shadow"
                    >
                      <FiMaximize2 />
                      <span>Open Full High-Res Image</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Comprehensive Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Category</span>
                  <strong className="text-gray-850 font-bold text-sm">{viewingDetailsReq.category}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Quantity Required</span>
                  <strong className="text-indigo-600 font-black text-sm">{viewingDetailsReq.quantity} units</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Expected Budget</span>
                  <strong className="text-emerald-600 font-black text-sm">₹{viewingDetailsReq.expectedBudget}</strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Sourcing Channel</span>
                  <strong className="text-gray-800 font-bold">
                    {viewingDetailsReq.requestType === 'SHOP_SPECIFIC' ? 'Direct Shop Request' : 'Marketplace Sourcing'}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Target Entity</span>
                  <strong className="text-gray-800 font-bold">
                    {viewingDetailsReq.targetEntityId?.storeName || viewingDetailsReq.targetEntityId?.name || (viewingDetailsReq.requestType === 'SHOP_SPECIFIC' ? 'Direct Store' : 'All Vendors')}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Submission Date</span>
                  <strong className="text-gray-800 font-bold">{new Date(viewingDetailsReq.date).toLocaleString()}</strong>
                </div>
              </div>

              {/* Full Description & Requirements */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Full Specifications & Requirements (Filled by Buyer)</label>
                <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
                  {viewingDetailsReq.description || "No specific detailed description provided by buyer."}
                </div>
              </div>

              {/* Buyer Information Section */}
              {viewingDetailsReq.userId && (
                <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-150">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Buyer Account Details</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400 shrink-0 text-base" />
                      <div>
                        <span className="text-gray-400 block text-[10px]">Name</span>
                        <strong className="text-gray-800 font-bold">{viewingDetailsReq.userId.name || "N/A"}</strong>
                      </div>
                    </div>
                    {viewingDetailsReq.userId.email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400 shrink-0 text-base" />
                        <div>
                          <span className="text-gray-400 block text-[10px]">Email</span>
                          <strong className="text-gray-800 font-bold">{viewingDetailsReq.userId.email}</strong>
                        </div>
                      </div>
                    )}
                    {viewingDetailsReq.userId.phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400 shrink-0 text-base" />
                        <div>
                          <span className="text-gray-400 block text-[10px]">Phone</span>
                          <strong className="text-gray-800 font-bold">{viewingDetailsReq.userId.phone}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sourcing Strategy & Vendor Bids Overview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Sourcing Bids ({viewingDetailsReq.assignedVendors?.length || 0})</label>
                {viewingDetailsReq.assignedVendors && viewingDetailsReq.assignedVendors.length > 0 ? (
                  <div className="border border-gray-150 rounded-2xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <tr>
                          <th className="p-3">Vendor</th>
                          <th className="p-3">Bid Status</th>
                          <th className="p-3 text-right">Offered Price</th>
                          <th className="p-3 text-right">Delivery Days</th>
                          <th className="p-3">Comments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-650">
                        {viewingDetailsReq.assignedVendors.map((v, i) => (
                          <tr key={i} className="hover:bg-gray-50/50">
                            <td className="p-3 font-bold text-gray-800">{v.vendorName || "Assigned Vendor"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                v.status === "RESPONDED" ? "bg-green-50 text-green-700" :
                                v.status === "UNAVAILABLE" ? "bg-red-50 text-red-700" :
                                "bg-yellow-50 text-yellow-750"
                              }`}>
                                {v.status}
                              </span>
                            </td>
                            <td className="p-3 text-right font-extrabold text-gray-850">₹{v.offeredPrice || "N/A"}</td>
                            <td className="p-3 text-right">{v.deliveryTimeline ? `${v.deliveryTimeline} days` : "N/A"}</td>
                            <td className="p-3 text-gray-500">{v.message || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-400 italic border border-gray-100">
                    No vendors assigned yet. Click "Sourcing Strategy" to match inventory & assign vendors.
                  </div>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const r = viewingDetailsReq;
                    setViewingDetailsReq(null);
                    handleOpenSourcingWorkspace(r);
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs transition-colors shadow"
                >
                  Sourcing Strategy
                </button>
                <button
                  onClick={() => {
                    const r = viewingDetailsReq;
                    setViewingDetailsReq(null);
                    handleOpenProposalWorkspace(r);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white font-bold rounded-xl text-xs transition-colors shadow"
                >
                  Select Fulfillment & Proposal
                </button>
                <button
                  onClick={() => {
                    const r = viewingDetailsReq;
                    handleStatusChangeClick(r, "Under Review");
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold rounded-xl text-xs transition-colors"
                >
                  Change Status
                </button>
                <button
                  onClick={() => setViewingDetailsReq(null)}
                  className="ml-auto px-6 py-2.5 bg-gray-150 hover:bg-gray-250 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sourcing Workspace Modal */}
      <AnimatePresence>
        {sourcingReq && sourcingData && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-3xl w-full border border-gray-100 space-y-6"
            >
              <div>
                <h3 className="text-xl font-black text-gray-800">Sourcing & Fulfillment Strategy</h3>
                <p className="text-xs text-gray-500">Determine fulfillment sources for request: <strong>{sourcingReq.productName}</strong> (Qty: {sourcingReq.quantity})</p>
              </div>

              {/* PLE Shop Check Status */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-250 space-y-3">
                <h4 className="font-extrabold text-sm text-gray-700 flex items-center gap-2">
                  🏪 PLE Shop Check
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>PLE Available: <strong className="text-gray-900">{sourcingData.pleAvailability.availableQuantity} units</strong></div>
                  <div>Shortfall: <strong className="text-red-650">{sourcingData.pleAvailability.shortfall} units</strong></div>
                  <div>Status: <span className="font-extrabold uppercase">{sourcingData.pleAvailability.status}</span></div>
                </div>
              </div>

              {/* Sourcing Mode Switch */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Fulfillment Mode</label>
                <div className="flex gap-2">
                  {[
                    { mode: "PLE_SHOP", label: "Fulfill from PLE Shop" },
                    { mode: "VENDOR", label: "Source from Vendors" },
                    { mode: "SPLIT", label: "Split Sourcing (PLE + Vendor)" }
                  ].map(item => (
                    <button
                      key={item.mode}
                      onClick={() => setSourcingMode(item.mode)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        sourcingMode === item.mode
                          ? "bg-indigo-600 text-white border-indigo-650"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vendors List for Sourcing */}
              {sourcingMode !== "PLE_SHOP" && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700">Select Matching B2B Vendors</label>
                  <div className="border border-gray-150 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase">
                        <tr>
                          <th className="p-3">Select</th>
                          <th className="p-3">Vendor</th>
                          <th className="p-3">Matched Product</th>
                          <th className="p-3 text-right">Standard B2B Price</th>
                          <th className="p-3 text-right">Available Qty</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-650">
                        {sourcingData.vendors.map((v, idx) => (
                          <tr key={`${v.vendorId}-${idx}`} className="hover:bg-gray-50/50">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={selectedVendors.includes(v.vendorId)}
                                disabled={v.status === "Vendor Inactive"}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedVendors([...selectedVendors, v.vendorId]);
                                  } else {
                                    setSelectedVendors(selectedVendors.filter(id => id !== v.vendorId));
                                  }
                                }}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                            </td>
                            <td className="p-3 font-bold text-gray-805">{v.vendorName}</td>
                            <td className="p-3">{v.productName}</td>
                            <td className="p-3 text-right">₹{v.normalB2BPrice}</td>
                            <td className="p-3 text-right">{v.availableQuantity}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                v.status === "Eligible" ? "bg-green-50 text-green-700" :
                                v.status === "Partially Available" ? "bg-yellow-50 text-yellow-750" :
                                v.status === "Out of Stock" ? "bg-orange-50 text-orange-700" :
                                "bg-red-50 text-red-750"
                              }`}>
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={submitSourcingAssignment}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-2xl text-sm transition-colors shadow"
                >
                  Apply Sourcing Strategy
                </button>
                <button
                  onClick={() => { setSourcingReq(null); setSourcingData(null); }}
                  className="flex-1 py-3 bg-gray-150 hover:bg-gray-250 text-gray-700 font-bold rounded-2xl text-sm transition-colors text-center"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Select Fulfillment & Proposal workspace */}
      <AnimatePresence>
        {proposalReq && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-2xl w-full border border-gray-100 space-y-6"
            >
              <div>
                <h3 className="text-xl font-black text-gray-800">Final Procurement Proposal</h3>
                <p className="text-xs text-gray-500">Prepare fulfillment price and estimate for buyer request: <strong>{proposalReq.productName}</strong></p>
              </div>

              {/* Vendor bids comparison */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Compare Vendor Responses</label>
                <div className="border border-gray-150 rounded-2xl overflow-hidden max-h-40 overflow-y-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase">
                      <tr>
                        <th className="p-3">Vendor</th>
                        <th className="p-3">Bid Status</th>
                        <th className="p-3 text-right">Offered Price</th>
                        <th className="p-3 text-right">Available Qty</th>
                        <th className="p-3 text-right">Estimate Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-650">
                      {proposalReq.assignedVendors?.map((v, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="p-3 font-bold">{v.vendorName || "Associated Vendor"}</td>
                          <td className="p-3 uppercase font-extrabold">{v.status}</td>
                          <td className="p-3 text-right font-bold text-gray-805">₹{v.offeredPrice || "N/A"}</td>
                          <td className="p-3 text-right">{v.availableQuantity || "N/A"}</td>
                          <td className="p-3 text-right">{v.deliveryTimeline ? `${v.deliveryTimeline} days` : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Proposed Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={proposalData.finalPrice}
                    onChange={(e) => setProposalData({ ...proposalData, finalPrice: Number(e.target.value) })}
                    placeholder="E.g. 4500"
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Delivery Date</label>
                  <input
                    type="date"
                    value={proposalData.estimatedDelivery}
                    onChange={(e) => setProposalData({ ...proposalData, estimatedDelivery: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-250 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Admin Sourcing Notes</label>
                  <textarea
                    rows={2}
                    value={proposalData.notes}
                    onChange={(e) => setProposalData({ ...proposalData, notes: e.target.value })}
                    placeholder="Warranty options, shipping details, or split distribution..."
                    className="w-full p-3 rounded-xl border border-gray-250 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={submitFinalProposal}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-2xl text-sm transition-colors shadow flex items-center justify-center gap-1"
                >
                  <FiSend />
                  <span>Send Proposal to Buyer</span>
                </button>
                <button
                  onClick={() => setProposalReq(null)}
                  className="flex-1 py-3 bg-gray-150 hover:bg-gray-250 text-gray-700 font-bold rounded-2xl text-sm transition-colors text-center"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Comment Modal */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-gray-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-800">Change Sourcing Status</h3>
              <p className="text-xs text-gray-500">
                Updating status of: <strong>{selectedReq.productName}</strong> to <strong className="text-indigo-600">{nextStatus}</strong>
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Timeline Comment for Buyer *</label>
                  <textarea
                    rows={3}
                    placeholder="Enter message for buyer update timeline..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={submitStatusChange}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-2xl text-sm transition-colors shadow"
                  >
                    Confirm Change
                  </button>
                  <button
                    onClick={() => setSelectedReq(null)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-sm transition-colors text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductRequestsDashboard;

