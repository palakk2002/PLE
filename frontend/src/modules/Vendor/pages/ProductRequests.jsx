import { useState, useEffect } from "react";
import { FiSearch, FiInbox, FiCheck, FiX, FiInfo, FiChevronDown } from "react-icons/fi";
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
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

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

            return (
              <motion.div
                key={req.id}
                layout
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs text-gray-400 font-mono font-bold">{req.id}</span>
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${
                      req.status === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-100" :
                      req.status === "Under Review" ? "bg-yellow-50 text-yellow-750 border-yellow-100" :
                      "bg-purple-50 text-purple-700 border-purple-100"
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-800 text-base mb-1">{req.productName}</h3>
                  
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-xs text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">
                      {req.category}
                    </span>
                    {req.requestType === 'SHOP_SPECIFIC' ? (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-105">
                        🏪 Direct Shop Request
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-bold border border-gray-150">
                        🌐 Marketplace Request
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
                    <div>Quantity: <strong className="text-gray-700">{req.quantity}</strong></div>
                    <div>Budget: <strong className="text-gray-700">₹{req.expectedBudget}</strong></div>
                    <div className="col-span-2 mt-1">
                      Submitted: <strong className="text-gray-700">{new Date(req.date).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <p className="text-sm text-gray-650 line-clamp-3 mb-4">{req.description}</p>
                </div>

                {/* Actions Section */}
                <div className="pt-4 border-t border-gray-100">
                  {myResponse ? (
                    <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-indigo-700 font-bold">
                        <span>Your Response: {myResponse.responseType}</span>
                        <span>{new Date(myResponse.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600">{myResponse.comments}</p>
                      {myResponse.responseType === "Can Supply" && (
                        <div className="text-gray-500 pt-1">
                          Price: ₹{myResponse.offeredPrice} | Delivery: {myResponse.deliveryTimeline} days
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAction(req, "supply")}
                        className="flex-1 min-w-[90px] py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <FiCheck />
                        <span>Can Supply</span>
                      </button>
                      <button
                        onClick={() => handleCannotSupply(req)}
                        className="flex-1 min-w-[90px] py-2 bg-red-650 hover:bg-red-750 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <FiX />
                        <span>Cannot Supply</span>
                      </button>
                      <button
                        onClick={() => handleAction(req, "need_info")}
                        className="flex-1 min-w-[90px] py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
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
