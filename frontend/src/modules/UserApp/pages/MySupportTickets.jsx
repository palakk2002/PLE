import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFilter, FiPlus, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from '../../../shared/components/PageTransition';
import { useSupportStore } from '../../../shared/store/supportStore';

const MySupportTickets = () => {
  const navigate = useNavigate();
  const { tickets = [], fetchTickets, isLoading } = useSupportStore();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchTickets().catch(() => null);
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    if (selectedStatus === 'all') return list;
    return list.filter((t) => t.status === selectedStatus);
  }, [selectedStatus, tickets]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting_for_user', label: 'Waiting For User' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const getStatusBadge = (status) => {
    const map = {
      open: 'bg-red-50 text-red-700 border-red-150',
      in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-150',
      waiting_for_user: 'bg-blue-50 text-blue-700 border-blue-150',
      resolved: 'bg-green-50 text-green-700 border-green-150',
      closed: 'bg-gray-50 text-gray-700 border-gray-150'
    };
    return map[status] || 'bg-gray-50 text-gray-700';
  };

  const getStatusLabel = (status) => {
    return status?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full pb-24">
          {/* Header */}
          <div className="px-4 py-4 bg-white border-b border-gray-200 sticky top-1 z-30 flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">My Support Tickets</h1>
              <p className="text-sm text-gray-600">
                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
              </p>
            </div>
            <button
              onClick={() => navigate('/help-support')}
              className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors"
              title="Create Ticket"
            >
              <FiPlus className="text-lg" />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-2 glass-card rounded-xl hover:bg-white/80 transition-colors"
            >
              <FiFilter className="text-gray-600 text-lg" />
            </button>
          </div>

          {/* Filter Options */}
          {showFilter && (
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedStatus(option.value);
                    setShowFilter(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all ${
                    selectedStatus === option.value
                      ? 'gradient-green text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* List of Tickets */}
          <div className="px-4 py-4 space-y-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-sm animate-pulse">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 p-6">
                <div className="text-5xl text-gray-300 mb-3"><FiMessageSquare className="mx-auto" /></div>
                <h3 className="text-base font-bold text-gray-800 mb-1">No tickets found</h3>
                <p className="text-xs text-gray-500 mb-4">
                  {selectedStatus === 'all'
                    ? "You don't have any support tickets yet"
                    : `No tickets found with status: ${getStatusLabel(selectedStatus)}`}
                </p>
                <button
                  onClick={() => navigate('/help-support')}
                  className="gradient-green text-white px-5 py-2.5 rounded-xl font-semibold text-xs"
                >
                  Create New Ticket
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((t, index) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/support-chat/${t.id}`)}
                    className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-150 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold block">Ticket ID</span>
                        <span className="text-xs font-bold text-gray-800">{t.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(t.status)}`}>
                        {getStatusLabel(t.status)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{t.subject}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{t.description}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs text-gray-400">
                      <span className="font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {t.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default MySupportTickets;
