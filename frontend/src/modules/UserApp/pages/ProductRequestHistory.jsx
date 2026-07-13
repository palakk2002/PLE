import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiInbox, FiChevronRight, FiCalendar, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import api from "../../../shared/utils/api";

const ProductRequestHistory = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, [activeStatus, activeType, currentPage]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (activeStatus !== "All") params.status = activeStatus;
      if (activeType !== "All") params.type = activeType;

      const response = await api.get('/user/product-requests', { params });
      if (response.success || response.statusCode === 200) {
        const dataPayload = response.data;
        const rawRequests = Array.isArray(dataPayload) 
          ? dataPayload 
          : (dataPayload?.requests || []);
        
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
      console.error("Failed to fetch product requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      Submitted: "bg-red-50 text-[#7B0A0A] border-red-200",
      "Under Review": "bg-yellow-50 text-yellow-750 border-yellow-200",
      "Seller Responded": "bg-red-50 text-[#7B0A0A] border-red-200",
      Accepted: "bg-green-50 text-green-700 border-green-200",
      Rejected: "bg-red-50 text-red-700 border-red-200",
      "Product Added": "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse",
    };
    return map[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full pb-24 max-w-4xl mx-auto min-h-screen bg-gray-50 px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-200"
              >
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">My Product Requests</h1>
                <p className="text-sm text-gray-500 mt-0.5">Track products you requested that were unavailable</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/product-request/new")}
              className="p-2.5 bg-[#7B0A0A] hover:bg-[#AE020B] text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 font-bold text-xs"
            >
              <FiPlus />
              <span className="hidden sm:inline">New Request</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status:</span>
              <select 
                value={activeStatus} 
                onChange={(e) => { setActiveStatus(e.target.value); setCurrentPage(1); }}
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold text-gray-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type:</span>
              <select 
                value={activeType} 
                onChange={(e) => { setActiveType(e.target.value); setCurrentPage(1); }}
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl p-2 font-bold text-gray-700 focus:outline-none"
              >
                <option value="All">All Types</option>
                <option value="GENERAL">General Requests</option>
                <option value="SHOP_SPECIFIC">Shop Requests</option>
              </select>
            </div>
          </div>

          {/* List or Empty State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7B0A0A] mb-4"></div>
              <p className="text-gray-500 font-semibold">Loading your requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-md mx-auto my-12">
              <FiInbox className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-800">No requests found</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                You haven't requested any custom or unavailable products yet.
              </p>
              <button
                onClick={() => navigate("/product-request/new")}
                 className="px-6 py-2.5 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl text-sm shadow-md transition-all"
              >
                Create Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req, idx) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/product-requests/${req.id}`)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {req.image ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 border border-gray-150">
                        <img src={req.image} alt={req.productName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100 text-[#7B0A0A] font-bold text-lg">
                        {req.productName?.charAt(0).toUpperCase() || "P"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs text-gray-400 font-mono">{req.id}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${getStatusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-gray-800 text-base truncate group-hover:text-[#AE020B] transition-colors">
                        {req.productName}
                      </h3>
                      {req.requestType === 'SHOP_SPECIFIC' && req.targetEntityId && (
                        <div className="mt-1 flex items-center gap-1.5 bg-gray-50 border border-gray-150 rounded-lg px-2 py-0.5 w-fit">
                          <span className="text-[10px] font-bold text-[#7B0A0A]">
                            Shop: {req.targetEntityId.storeName || req.targetEntityId.name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FiCalendar />
                          {new Date(req.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock />
                          Qty: {req.quantity}
                        </span>
                        <span>
                          Budget: ₹{req.expectedBudget}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors text-xl shrink-0" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-50 transition-all hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-650">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-50 transition-all hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ProductRequestHistory;
