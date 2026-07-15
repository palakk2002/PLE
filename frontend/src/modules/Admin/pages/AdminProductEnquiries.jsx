import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../shared/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiEye,
  FiInbox,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiHelpCircle,
  FiAlertCircle,
  FiX,
  FiFlag
} from 'react-icons/fi';
import DataTable from '../components/DataTable';
import Badge from '../../../shared/components/Badge';
import AnimatedSelect from '../components/AnimatedSelect';
import toast from 'react-hot-toast';

const AdminProductEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/enquiries');
      // api.js interceptor already unwraps response.data
      if (response.success || response.statusCode === 200) {
        setEnquiries(response.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch enquiries.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      pending: enquiries.filter((e) => e.status === 'Submitted' || e.status === 'Under Review' || e.status === 'Need More Information').length,
      inProgress: enquiries.filter((e) => e.status === 'Seller Responded').length,
      resolved: enquiries.filter((e) => e.status === 'Resolved').length,
      closed: enquiries.filter((e) => e.status === 'Closed').length,
    };
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        enq.id.toLowerCase().includes(q) ||
        enq.productName.toLowerCase().includes(q) ||
        enq.userName.toLowerCase().includes(q) ||
        enq.subject.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'all' || enq.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || enq.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [enquiries, searchQuery, selectedStatus, selectedPriority]);

  const handleStatusUpdate = async (id, newStatus, noteText) => {
    try {
      const response = await api.put(`/admin/enquiries/${id}/reply`, {
        status: newStatus,
        responseText: noteText
      });
      // api.js interceptor already unwraps response.data
      if (response.success || response.statusCode === 200) {
        toast.success(`Enquiry status updated to ${newStatus}`);
        fetchEnquiries();
        const freshDoc = response?.data || response;
        setSelectedEnquiry((prev) => ({
          ...prev,
          status: freshDoc.status || prev.status,
          sellerResponse: freshDoc.sellerResponse || prev.sellerResponse,
          timeline: freshDoc.timeline || prev.timeline,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status.');
    }
  };

  const getStatusColor = (status) => {
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

  const columns = [
    {
      key: 'id',
      label: 'Enquiry #',
      sortable: true,
      render: (value) => <span className="font-bold text-gray-900 font-mono select-all">{value}</span>,
    },
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm">{value}</span>
          <span className="text-xs text-gray-400 font-medium">{row.userEmail}</span>
        </div>
      ),
    },
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
      render: (value) => <span className="font-bold text-gray-800">{value}</span>,
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: false,
      render: (value, row) => (
        <div className="max-w-[200px] truncate">
          <span className="font-semibold text-gray-700">{value}</span>
          <p className="text-xs text-gray-400 truncate">{row.question}</p>
        </div>
      ),
    },
    {
      key: 'sellerResponse',
      label: 'Seller Response',
      sortable: false,
      render: (value) => (
        <span className="text-xs text-gray-500 italic max-w-[150px] block truncate">
          {value || 'Awaiting response...'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        let variant = 'warning';
        if (value === 'Submitted') variant = 'info';
        if (value === 'Under Review') variant = 'warning';
        if (value === 'Need More Information') variant = 'warning';
        if (value === 'Seller Responded') variant = 'info';
        if (value === 'Resolved') variant = 'success';
        if (value === 'Closed') variant = 'default';
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedEnquiry(row)}
            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-bold text-xs flex items-center gap-1"
            title="Preview Details"
          >
            <FiEye /> View
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 flex items-center gap-2.5">
          <FiInbox className="text-primary-600" /> Product Enquiries Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Moderate, review, and analyze product inquiries and questions submitted by buyers.
        </p>
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <FiInbox className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Enquiries</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiClock className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.pending}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FiClock className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.inProgress}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <FiCheckCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resolved</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.resolved}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
            <FiXCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Closed</p>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-800 mt-0.5">{stats.closed}</h3>
          </div>
        </div>
      </div>

      {/* Main Table and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
        <div className="mb-6 pb-6 border-b border-gray-100 flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <div className="relative flex-1 w-full sm:min-w-[240px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, User, Product, Subject..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm transition-all"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Status:</span>
            <AnimatedSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Submitted', label: 'Submitted' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Need More Information', label: 'Need Info' },
                { value: 'Seller Responded', label: 'Seller Responded' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Closed', label: 'Closed' },
              ]}
              className="w-full sm:w-auto min-w-[140px]"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Priority:</span>
            <AnimatedSelect
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
              className="w-full sm:w-auto min-w-[130px]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 font-semibold">Loading enquiries...</p>
          </div>
        ) : (
          <DataTable
            data={filteredEnquiries}
            columns={columns}
            pagination={true}
            itemsPerPage={10}
            onRowClick={(row) => {
              setSelectedEnquiry(row);
              setReplyText('');
            }}
          />
        )}
      </div>

      {/* Quick Preview Slide Drawer */}
      <AnimatePresence>
        {selectedEnquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col h-full border-l border-gray-150"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gray-500">{selectedEnquiry.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mt-1 truncate max-w-[320px]">
                    {selectedEnquiry.productName}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedEnquiry(null);
                    setReplyText('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Scroll Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* User Details */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Buyer User Details
                  </span>
                  <p className="font-bold text-gray-800">{selectedEnquiry.userName}</p>
                  <p className="text-xs text-gray-500 font-semibold">{selectedEnquiry.userEmail}</p>
                </div>

                {/* Question Details */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Product Question
                  </span>
                  <div className="border border-gray-150 rounded-xl p-4 bg-white space-y-2">
                    <h4 className="font-bold text-gray-900">Subject: {selectedEnquiry.subject}</h4>
                    <p className="text-gray-700 leading-relaxed font-semibold">{selectedEnquiry.question}</p>
                    {selectedEnquiry.attachment && (
                      <div className="text-[11px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md inline-block">
                        📎 Attachment: {selectedEnquiry.attachment}
                      </div>
                    )}
                  </div>
                </div>

                {/* Seller Response */}
                {selectedEnquiry.sellerResponse && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Seller Response
                    </span>
                    <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4">
                      <p className="text-indigo-900 font-semibold leading-relaxed">
                        {selectedEnquiry.sellerResponse}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Timeline History
                  </span>
                  <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                    {selectedEnquiry.timeline.map((item, index) => (
                      <div key={index} className="flex gap-3 text-xs">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-4 ring-primary-50" />
                          {index < selectedEnquiry.timeline.length - 1 && (
                            <div className="w-0.5 h-10 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-850">{item.status}</span>
                            <span className="text-[10px] text-gray-400 font-bold">
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

                {/* Quick Moderation Actions */}
                {selectedEnquiry.status !== 'Closed' && selectedEnquiry.status !== 'Resolved' && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Reply to User
                      </span>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your response to the customer..."
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow outline-none resize-none"
                        rows={3}
                      />
                      <button
                        onClick={() => {
                          if (!replyText.trim()) {
                            toast.error('Please enter a reply.');
                            return;
                          }
                          handleStatusUpdate(selectedEnquiry.id, 'Seller Responded', replyText);
                          setReplyText('');
                        }}
                        className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/20"
                      >
                        <FiInbox /> Send Reply
                      </button>
                    </div>
                    
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block pt-2 border-t border-gray-50">
                      Other Actions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusUpdate(selectedEnquiry.id, 'Resolved', 'Marked resolved by Administrator.')}
                        className="py-2.5 px-3 border border-emerald-250 hover:bg-emerald-50 text-emerald-600 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <FiCheckCircle /> Resolve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedEnquiry.id, 'Closed', 'Enquiry closed by Administrator.')}
                        className="py-2.5 px-3 border border-red-250 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <FiXCircle /> Close Enquiry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProductEnquiries;
