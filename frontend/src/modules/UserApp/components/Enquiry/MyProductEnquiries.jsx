import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../shared/store/authStore';
import api from '../../../../shared/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiEye, FiClock, FiCheckCircle, FiXCircle, FiX, FiCalendar, FiArrowRight, FiInfo, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const MyProductEnquiries = () => {
  const { user } = useAuthStore();
  const [userEnquiries, setUserEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/user/enquiries');
      if (response.success || response.statusCode === 200) {
        setUserEnquiries(response.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch your enquiries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-50 text-gray-700 border-gray-250';
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Need More Information':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Seller Responded':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-gray-150 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-250';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleCloseEnquiry = async (enquiryId) => {
    // Note: We don't have a direct /user/enquiries/:id endpoint to close yet, 
    // but typically users shouldn't update status directly unless we add that endpoint.
    // Let's add it or mock it for now, actually let's just close it locally or notify it's not supported.
    toast.error('Closing enquiry directly is not supported in this version.');
  };

  if (selectedEnquiry) {
    return (
      <div className="space-y-6 text-sm">
        {/* Back Button and Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-150">
          <button
            onClick={() => setSelectedEnquiry(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            type="button"
            title="Back to list"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div>
            <h3 className="font-extrabold text-gray-900 text-base">Enquiry Details</h3>
            <span className="font-mono text-xs text-gray-500 font-bold">{selectedEnquiry.id}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-5">
          {/* Product Info */}
          <div className="flex gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-150 items-center">
            <img
              src={selectedEnquiry.productImage}
              alt={selectedEnquiry.productName}
              className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-white shrink-0"
            />
            <div>
              <h4 className="font-bold text-gray-900 text-sm leading-snug">{selectedEnquiry.productName}</h4>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(selectedEnquiry.status)}`}>
                {selectedEnquiry.status}
              </span>
            </div>
          </div>

          {/* Question Details */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Question Details
            </p>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl space-y-2">
              <h5 className="font-extrabold text-gray-900">Subject: {selectedEnquiry.subject}</h5>
              <p className="text-gray-750 leading-relaxed whitespace-pre-wrap font-medium">{selectedEnquiry.question}</p>
              {selectedEnquiry.attachment && (
                <div className="text-xs font-bold text-[#7B0A0A] bg-red-50 px-3 py-1 rounded-xl inline-block mt-2 border border-red-100">
                  📎 Attachment: {selectedEnquiry.attachment}
                </div>
              )}
            </div>
          </div>

          {/* Seller Response */}
          {selectedEnquiry.sellerResponse && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Seller Response
              </p>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <p className="text-emerald-900 leading-relaxed whitespace-pre-wrap font-semibold">
                  {selectedEnquiry.sellerResponse}
                </p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Status Timeline
            </p>
            <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 space-y-4">
              {selectedEnquiry.timeline.map((item, index) => (
                <div key={index} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7B0A0A] ring-4 ring-red-100" />
                    {index < selectedEnquiry.timeline.length - 1 && (
                      <div className="w-0.5 h-10 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-850">{item.status}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(item.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-650 mt-1 font-semibold">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action footer */}
          {selectedEnquiry.status !== 'Closed' && selectedEnquiry.status !== 'Resolved' && (
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleCloseEnquiry(selectedEnquiry.id)}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-250 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <FiXCircle />
                <span>Close Enquiry</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiMessageSquare className="text-[#7B0A0A] text-xl" />
          <h3 className="font-extrabold text-gray-800 text-base">My Product Enquiries</h3>
        </div>
        <span className="text-[10px] text-gray-400 font-bold">
          Total: {userEnquiries.length}
        </span>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-150">
          <p className="font-semibold text-gray-800">Loading your enquiries...</p>
        </div>
      ) : userEnquiries.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-150">
          <FiMessageSquare className="w-12 h-12 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-800">No Product Enquiries found</p>
          <p className="text-xs mt-1 text-gray-500">Ask questions about products using the 'Enquire Now' button on product pages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userEnquiries.map((enq) => (
            <motion.div
              key={enq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-gray-150 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-gray-500">{enq.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(enq.status)}`}>
                    {enq.status}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(enq.priority)}`}>
                    {enq.priority}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-950">{enq.productName}</h4>
                  <p className="text-xs text-gray-500 font-semibold truncate max-w-[400px] mt-0.5">
                    Subject: {enq.subject}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400 font-bold">
                  Date: {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEnquiry(enq)}
                  className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-all border border-gray-200"
                >
                  <FiEye />
                  <span>View Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProductEnquiries;
