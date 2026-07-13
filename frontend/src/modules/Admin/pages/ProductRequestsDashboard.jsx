import { useState, useEffect } from "react";
import { FiSearch, FiLayers, FiAlertCircle, FiCheckCircle, FiXCircle, FiTrendingUp, FiSettings, FiEdit, FiTrash2 } from "react-icons/fi";
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
    const pending = requests.filter((r) => r.status === "Submitted" || r.status === "Under Review").length;
    const accepted = requests.filter((r) => r.status === "Accepted" || r.status === "Product Added").length;
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
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request record?")) {
      try {
        const response = await api.delete(`/admin/product-requests/${id}`);
        if (response.success || response.statusCode === 200) {
          toast.success("Request record deleted.");
          loadRequests();
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
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
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
      status === "Seller Responded" ? "bg-purple-50 text-purple-700 border-purple-200" :
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
        <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-2">Product Sourcing Dashboard</h1>
        <p className="text-sm text-gray-500">Manage buyer custom product requests, responses, and catalog onboarding status</p>
      </div>

      {/* Analytics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: stats.total, icon: FiLayers, color: "text-blue-600 bg-blue-50" },
            { label: "Pending Requests", value: stats.pending, icon: FiAlertCircle, color: "text-amber-600 bg-amber-50" },
            { label: "Accepted Requests", value: stats.accepted, icon: FiCheckCircle, color: "text-emerald-600 bg-emerald-50" },
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
            <h3 className="font-extrabold text-gray-800 text-lg">All Product Requests</h3>
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
                  <th className="p-4">Request Info</th>
                  <th className="p-4">Specifications</th>
                  <th className="p-4">Sourcing Target</th>
                  <th className="p-4">Seller Bids</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Manage Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {req.image ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-150">
                            <img src={req.image} alt={req.productName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-sm">
                            {req.productName?.charAt(0).toUpperCase() || "P"}
                          </div>
                        )}
                        <div>
                          <h4 className="font-extrabold text-gray-800">{req.productName}</h4>
                          <span className="text-xs text-gray-400 font-mono">{req.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      <div>Cat: <strong className="text-gray-700">{req.category}</strong></div>
                      <div>Qty: <strong className="text-gray-700">{req.quantity}</strong> | Budget: <strong className="text-gray-700">₹{req.expectedBudget}</strong></div>
                    </td>
                    <td className="p-4">
                      {req.requestType === 'SHOP_SPECIFIC' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                          🏪 {req.targetEntityId?.storeName || req.targetEntityName || 'PLE Shop'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-150">
                          🌐 General (Global)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {req.sellerResponses && req.sellerResponses.length > 0 ? (
                        <div className="text-indigo-650 font-bold">
                          {req.sellerResponses.length} bid(s) received
                        </div>
                      ) : (
                        <span>No responses yet</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                        {["Under Review", "Accepted", "Rejected", "Product Added"].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChangeClick(req, st)}
                            disabled={req.status === st}
                            className={`px-2 py-1 rounded text-[10px] font-extrabold transition-all ${
                              req.status === st 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
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
