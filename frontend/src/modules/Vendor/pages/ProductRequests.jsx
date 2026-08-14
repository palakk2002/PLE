import { useState, useEffect } from "react";
import { FiSearch, FiInbox, FiCheck, FiX, FiInfo, FiEye, FiUser, FiMail, FiPhone, FiCalendar, FiPackage, FiDollarSign, FiTag, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";
import { useVendorAuthStore } from "../store/vendorAuthStore";

const VendorProductRequests = () => {
  const { vendor } = useVendorAuthStore();
  const vendorId = vendor?._id || vendor?.id || "";
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "responded"
  const [filterType, setFilterType] = useState("All"); // All, General, Direct
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [selectedReq, setSelectedReq] = useState(null);
  const [modalType, setModalType] = useState(""); // "supply", "need_info"
  const [modalData, setModalData] = useState({ price: "", days: "", comment: "" });
  
  // Full details view modal
  const [viewingDetailsReq, setViewingDetailsReq] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [activeTab, filterType, currentPage]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (activeTab === "pending") params.status = "Pending";
      if (activeTab === "responded") params.status = "Seller Responded";
      if (filterType !== "All") params.type = filterType;

      const response = await api.get('/vendor/product-requests', { params });
      if (response.success || response.statusCode === 200) {
        const dataPayload = response.data;
        const rawRequests = dataPayload?.requests || [];
        const formatted = rawRequests.map(r => ({
          ...r,
          id: r.requestId,
          date: r.createdAt
        }));
        setRequests(formatted);
        if (dataPayload?.pagination) {
          setTotalPages(dataPayload.pagination.pages || 1);
        } else {
          setTotalPages(1);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (req, type) => {
    setSelectedReq(req);
    setModalType(type);
    setModalData({ price: "", days: "", comment: "" });
  };

  const submitAction = async () => {
    if (modalType === "supply") {
      if (!modalData.price || Number(modalData.price) <= 0) {
        toast.error("Please enter a valid price");
        return;
      }
      if (!modalData.days || Number(modalData.days) <= 0) {
        toast.error("Please enter valid delivery days");
        return;
      }
    } else {
      if (!modalData.comment.trim()) {
        toast.error("Please enter information request comments");
        return;
      }
    }

    try {
      const payload = {
        responseType: modalType === "supply" ? "Can Supply" : "Need Info",
        offeredPrice: modalType === "supply" ? Number(modalData.price) : undefined,
        deliveryTimeline: modalType === "supply" ? Number(modalData.days) : undefined,
        message: modalData.comment || (modalType === "supply" ? "We can fulfill this product request." : "")
      };

      const response = await api.put(`/vendor/product-requests/${selectedReq.id}/respond`, payload);
      if (response.success || response.statusCode === 200) {
        toast.success("Response submitted successfully!");
        loadRequests();
        setSelectedReq(null);
        if (viewingDetailsReq && viewingDetailsReq.id === selectedReq.id) {
          setViewingDetailsReq(null);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit response.");
    }
  };

  const handleCannotSupply = async (req) => {
    try {
      const payload = {
        responseType: "Need Info",
        message: "We are unable to fulfill this request at this moment."
      };
      const response = await api.put(`/vendor/product-requests/${req.id}/respond`, payload);
      if (response.success || response.statusCode === 200) {
        toast.success("Response submitted successfully!");
        loadRequests();
        if (viewingDetailsReq && viewingDetailsReq.id === req.id) {
          setViewingDetailsReq(null);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit response.");
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;

    if (filterType === "General" && r.requestType !== "GENERAL") return false;
    if (filterType === "Direct" && r.requestType !== "SHOP_SPECIFIC") return false;

    const hasVendorResponded = r.sellerResponses?.some((s) => String(s.sellerId) === String(vendorId)) ||
      r.assignedVendors?.some((v) => String(v.vendorId) === String(vendorId) && v.status === "RESPONDED");

    if (activeTab === "pending") {
      return !hasVendorResponded && r.status !== "Rejected" && r.status !== "Product Added" && r.status !== "Confirmed" && r.status !== "Completed";
    }
    if (activeTab === "responded") {
      return hasVendorResponded;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-gray-800 mb-2">Buyer Product Requests</h1>
        <p className="text-sm text-gray-500">Respond to custom product requests from buyers on the marketplace</p>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
            {["all", "pending", "responded"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-6 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                  activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab} Requests
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
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

        {/* Sourcing Channel Filter */}
        <div className="flex gap-2 border-t border-gray-100 pt-3">
          {["All", "General", "Direct"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all border ${
                filterType === type
                  ? "bg-indigo-600 text-white border-indigo-650"
                  : "bg-gray-50 text-gray-500 border-gray-250 hover:bg-gray-100"
              }`}
            >
              {type === "All" ? "All Channels" : type === "General" ? "Marketplace Requests" : "Direct Requests"}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiInbox className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-bold">No product requests found</p>
          <p className="text-xs text-gray-450 mt-1">Check back later for new requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => {
            const myResponse = req.sellerResponses?.find((s) => String(s.sellerId) === String(vendorId));
            const targetStoreName = req.targetEntityId?.storeName || req.targetEntityId?.name || "Direct Store";

            return (
              <motion.div
                key={req.id}
                layout
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top bar: Request ID, Status badge, and View Details Button */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs text-gray-400 font-mono font-bold">{req.id}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                        req.status === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        req.status === "Under Review" ? "bg-yellow-50 text-yellow-750 border-yellow-100" :
                        "bg-purple-50 text-purple-700 border-purple-100"
                      }`}>
                        {req.status}
                      </span>
                      <button
                        onClick={() => setViewingDetailsReq(req)}
                        className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        title="View Full Product Request Details"
                      >
                        <FiEye className="text-sm" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Image & Product Title */}
                  <div className="flex items-start gap-3 mb-3">
                    {req.image ? (
                      <div 
                        onClick={() => setViewingDetailsReq(req)}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img src={req.image} alt={req.productName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 font-extrabold text-base">
                        {req.productName?.charAt(0).toUpperCase() || "P"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-extrabold text-gray-850 text-base leading-tight mb-1">{req.productName}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                          {req.category}
                        </span>
                        {req.requestType === 'SHOP_SPECIFIC' ? (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                            🏪 Direct: {targetStoreName}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-bold border border-gray-200">
                            🌐 Marketplace Request
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Details Box */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <FiPackage className="text-indigo-500 shrink-0" />
                      <span>Qty: <strong className="text-gray-800">{req.quantity}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiDollarSign className="text-emerald-500 shrink-0" />
                      <span>Budget: <strong className="text-emerald-700 font-bold">₹{req.expectedBudget}</strong></span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-gray-500">
                        <FiCalendar className="text-gray-400 shrink-0" />
                        {new Date(req.date).toLocaleDateString()}
                      </span>
                      {req.userId?.name && (
                        <span className="flex items-center gap-1 font-bold text-gray-700">
                          <FiUser className="text-gray-400 shrink-0" />
                          {req.userId.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requirements preview with Expand button */}
                  {req.description && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Specifications:</p>
                      <p className="text-xs text-gray-650 line-clamp-2 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 font-medium">
                        {req.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action footer */}
                <div className="pt-3 border-t border-gray-100">
                  {myResponse ? (
                    <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-indigo-800 font-bold">
                        <span>Your Response: {myResponse.responseType}</span>
                        <span className="text-[10px] text-gray-400">{new Date(myResponse.date).toLocaleDateString()}</span>
                      </div>
                      {myResponse.message && <p className="text-gray-700 text-xs">{myResponse.message}</p>}
                      {myResponse.responseType === "Can Supply" && (
                        <div className="text-indigo-900 font-bold pt-1 text-xs">
                          Offered Price: ₹{myResponse.offeredPrice} | Delivery: {myResponse.deliveryTimeline} days
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAction(req, "supply")}
                        className="flex-1 min-w-[85px] py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <FiCheck />
                        <span>Can Supply</span>
                      </button>
                      <button
                        onClick={() => handleCannotSupply(req)}
                        className="flex-1 min-w-[85px] py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <FiX />
                        <span>Cannot Supply</span>
                      </button>
                      <button
                        onClick={() => handleAction(req, "need_info")}
                        className="flex-1 min-w-[85px] py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <FiInfo />
                        <span>Need Info</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full Request Details Modal */}
      <AnimatePresence>
        {viewingDetailsReq && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-2xl w-full border border-gray-100 space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-indigo-600 font-mono font-black">{viewingDetailsReq.id}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                      viewingDetailsReq.status === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-100" :
                      viewingDetailsReq.status === "Under Review" ? "bg-yellow-50 text-yellow-750 border-yellow-100" :
                      "bg-purple-50 text-purple-700 border-purple-100"
                    }`}>
                      {viewingDetailsReq.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-gray-850">{viewingDetailsReq.productName}</h2>
                </div>
                <button
                  onClick={() => setViewingDetailsReq(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Reference Image (If Available) */}
              {viewingDetailsReq.image && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Reference Image Uploaded by Buyer</label>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 max-h-72 bg-gray-50 flex items-center justify-center">
                    <img
                      src={viewingDetailsReq.image}
                      alt={viewingDetailsReq.productName}
                      className="max-h-72 w-full object-contain"
                    />
                    <a
                      href={viewingDetailsReq.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-xl font-bold backdrop-blur-sm transition-colors flex items-center gap-1"
                    >
                      <FiMaximize2 />
                      <span>View Full Image</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-150 text-xs">
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Category</span>
                  <strong className="text-gray-800 font-bold text-sm">{viewingDetailsReq.category}</strong>
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
                  <span className="text-gray-400 font-medium block mb-0.5">Request Type</span>
                  <strong className="text-gray-800 font-bold">
                    {viewingDetailsReq.requestType === 'SHOP_SPECIFIC' ? 'Direct Shop Request' : 'Marketplace Request'}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Target Store</span>
                  <strong className="text-gray-800 font-bold">
                    {viewingDetailsReq.targetEntityId?.storeName || viewingDetailsReq.targetEntityId?.name || (viewingDetailsReq.requestType === 'SHOP_SPECIFIC' ? 'Direct Shop' : 'All Marketplace Vendors')}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block mb-0.5">Submitted Date</span>
                  <strong className="text-gray-800 font-bold">{new Date(viewingDetailsReq.date).toLocaleDateString()}</strong>
                </div>
              </div>

              {/* Full Description & Specifications */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Full Requirements & Specifications</label>
                <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
                  {viewingDetailsReq.description || "No specific detailed description provided by buyer."}
                </div>
              </div>

              {/* Buyer Contact Information */}
              {viewingDetailsReq.userId && (
                <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-150">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Buyer Information</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400 shrink-0" />
                      <span>Name: <strong className="text-gray-800">{viewingDetailsReq.userId.name || "Buyer"}</strong></span>
                    </div>
                    {viewingDetailsReq.userId.email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400 shrink-0" />
                        <span>Email: <strong className="text-gray-800">{viewingDetailsReq.userId.email}</strong></span>
                      </div>
                    )}
                    {viewingDetailsReq.userId.phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-gray-400 shrink-0" />
                        <span>Phone: <strong className="text-gray-800">{viewingDetailsReq.userId.phone}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action options in modal */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => {
                    const reqToAct = viewingDetailsReq;
                    handleAction(reqToAct, "supply");
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-sm transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  <FiCheck />
                  <span>Offer Supply Proposal</span>
                </button>
                <button
                  onClick={() => {
                    const reqToAct = viewingDetailsReq;
                    handleAction(reqToAct, "need_info");
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-2xl text-sm transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  <FiInfo />
                  <span>Request Information</span>
                </button>
                <button
                  onClick={() => setViewingDetailsReq(null)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Response Modal */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-gray-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {modalType === "supply" ? "Offer Fulfillment Proposal" : "Request Clarification"}
              </h3>
              <p className="text-xs text-gray-500">
                For request: <strong>{selectedReq.productName}</strong> ({selectedReq.id})
              </p>

              <div className="space-y-3">
                {modalType === "supply" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Price Offer (₹)</label>
                      <input
                        type="number"
                        placeholder="E.g. 4800"
                        value={modalData.price}
                        onChange={(e) => setModalData({ ...modalData, price: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Time (Days)</label>
                      <input
                        type="number"
                        placeholder="E.g. 5"
                        value={modalData.days}
                        onChange={(e) => setModalData({ ...modalData, days: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {modalType === "supply" ? "Comments (Optional)" : "Questions / Details Needed *"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={modalType === "supply" ? "Details about warranty, brand, accessories..." : "What size, color preference, compatibility model are you looking for?"}
                    value={modalData.comment}
                    onChange={(e) => setModalData({ ...modalData, comment: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={submitAction}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold rounded-2xl text-sm transition-colors shadow"
                  >
                    Submit Response
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

export default VendorProductRequests;

