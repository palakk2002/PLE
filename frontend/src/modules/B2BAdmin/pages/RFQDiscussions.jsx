import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUser, FiActivity, FiPaperclip, FiArrowRight, FiInbox } from 'react-icons/fi';
import api from '../../../shared/utils/api';
import toast from 'react-hot-toast';
import socketService from '../../../shared/utils/socket';

const RFQDiscussions = () => {
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [message, setMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/b2b-user/admin/rfq');
      if (res && res.data) {
        // Filter RFQs that are not in Draft and are not dummy Direct RFQ records
        const activeRfqs = res.data.filter(r => r.status !== 'Draft' && !r.rfqId?.startsWith('DRFQ-'));
        setRfqs(activeRfqs);
        if (activeRfqs.length > 0 && !selectedRfq) {
          // Auto select first
          setSelectedRfq(activeRfqs[0]);
        } else if (selectedRfq) {
          // Keep current selected updated
          const updatedSelected = activeRfqs.find(r => r._id === selectedRfq._id);
          if (updatedSelected) setSelectedRfq(updatedSelected);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRfq) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRfq?.negotiationMessages]);

  useEffect(() => {
    const socket = socketService.getSocket();
    const rfqId = selectedRfq?._id;
    if (socket && rfqId) {
      socket.emit("join_rfq_room", rfqId);

      const handleNewMessage = (data) => {
        if (String(data.rfqId) === String(rfqId)) {
          const newMsg = data.message;
          setSelectedRfq((prev) => {
            if (!prev) return prev;
            const exists = prev.negotiationMessages?.some((m) => String(m._id) === String(newMsg._id));
            if (exists) return prev;
            return {
              ...prev,
              negotiationMessages: [...(prev.negotiationMessages || []), newMsg]
            };
          });
          setRfqs((prevRfqs) => 
            prevRfqs.map((r) => {
              if (r._id === rfqId) {
                const exists = r.negotiationMessages?.some((m) => String(m._id) === String(newMsg._id));
                if (exists) return r;
                return {
                  ...r,
                  negotiationMessages: [...(r.negotiationMessages || []), newMsg]
                };
              }
              return r;
            })
          );
        }
      };

      const handleStatusUpdate = (data) => {
        if (String(data.rfqId) === String(rfqId)) {
          setSelectedRfq((prev) => {
            if (!prev) return prev;
            return { ...prev, status: data.status };
          });
          setRfqs((prevRfqs) => 
            prevRfqs.map((r) => {
              if (r._id === rfqId) {
                return { ...r, status: data.status };
              }
              return r;
            })
          );
        }
      };

      socket.on("new_internal_message", handleNewMessage);
      socket.on("status_update", handleStatusUpdate);

      return () => {
        socket.emit("leave_rfq_room", rfqId);
        socket.off("new_internal_message", handleNewMessage);
        socket.off("status_update", handleStatusUpdate);
      };
    }
  }, [selectedRfq?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedRfq) return;

    try {
      setSending(true);
      const res = await api.post(`/b2b-user/admin/rfq/${selectedRfq._id}/message`, {
        message,
        attachments: [],
        isInternalNote
      });
      if (res && (res.success || res.data)) {
        setMessage('');
        setIsInternalNote(false);
        // Reload
        await loadData();
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading && rfqs.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-xl h-10 w-10 border-t-2 border-b-2 border-[#C07A3D]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-[1400px] mx-auto pb-12"
    >
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <FiMessageSquare className="text-[#C07A3D]" /> Discussion Panel
        </h1>
        <p className="text-sm text-gray-500">
          Direct messaging logs with the Super Admin and platform moderators.
        </p>
      </div>

      {rfqs.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm flex h-[600px] overflow-hidden">
          {/* Threads Sidebar */}
          <div className="w-80 border-r border-gray-150 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-gray-150 bg-white">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sourcing Campaigns</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {rfqs.map((r) => {
                const isSelected = selectedRfq?._id === r._id;
                const lastMsg = r.negotiationMessages?.[r.negotiationMessages.length - 1]?.message || 'No messages yet';
                
                return (
                  <button
                    key={r._id}
                    onClick={() => setSelectedRfq(r)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-[#C07A3D] text-white shadow-sm' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-mono font-bold text-xs">{r.rfqId}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <span className="font-semibold text-xs truncate w-full">
                      {r.productId?.name || r.customProductName}
                    </span>
                    <p className={`text-[10px] truncate w-full ${
                      isSelected ? 'text-white/80' : 'text-gray-400'
                    }`}>
                      {lastMsg}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Workspace */}
          {selectedRfq ? (
            <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
              {/* Active Header */}
              <div className="p-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                <div>
                  <span className="text-xs font-bold text-[#C07A3D] font-mono">{selectedRfq.rfqId}</span>
                  <h3 className="font-bold text-sm text-gray-800">
                    {selectedRfq.productId?.name || selectedRfq.customProductName}
                  </h3>
                </div>
                <button
                  onClick={() => navigate(`/b2b-dashboard/rfqs/${selectedRfq._id}`)}
                  className="text-xs font-bold text-[#C07A3D] hover:underline flex items-center gap-1"
                >
                  View Details Sheet <FiArrowRight />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedRfq.negotiationMessages && selectedRfq.negotiationMessages.length > 0 ? (
                  selectedRfq.negotiationMessages.map((msg, i) => {
                    const isSelf = msg.senderType === 'B2BAdmin' || msg.senderType === 'Employee';
                    const isInternal = msg.isInternalNote;

                    return (
                      <div key={i} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl p-4 text-xs font-semibold ${
                          isInternal 
                            ? 'bg-amber-50 border border-amber-200 text-amber-955'
                            : isSelf
                              ? 'bg-[#C07A3D] text-white rounded-tr-none'
                              : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}>
                          <div className="flex items-center justify-between gap-4 mb-1 border-b border-black/5 pb-1">
                            <span className="text-[9px] font-black uppercase">
                              {msg.senderName} ({msg.senderType})
                            </span>
                            {isInternal && (
                              <span className="text-[8px] bg-amber-250 text-amber-800 px-1 rounded font-bold uppercase">
                                Internal Note
                              </span>
                            )}
                          </div>
                          <p className="leading-relaxed font-medium">{msg.message}</p>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-gray-400 font-bold">
                    Start discussions with Super Admin by sending a message below.
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-150 bg-gray-50 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type message for Super Admin..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#C07A3D] font-medium resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="p-3 bg-[#C07A3D] hover:bg-[#A9662E] text-white rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-gray-500">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded border-gray-300 text-[#C07A3D] focus:ring-[#C07A3D]"
                    />
                    <span>Internal Note (only visible to B2B staff members)</span>
                  </label>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-400">
              <FiMessageSquare className="w-12 h-12 mb-3 text-gray-300" />
              <h3 className="font-extrabold text-sm text-gray-800">Select Sourcing Thread</h3>
              <p className="text-xs text-gray-400 mt-1">
                Choose an active sourcing campaign from the list to begin discussions.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 border border-gray-150 text-center text-gray-450 shadow-sm">
          <FiInbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="font-extrabold text-sm text-gray-850">No Discussions Active</h3>
          <p className="text-xs text-gray-450 mt-1 max-w-[280px] mx-auto">
            Discussions will become active once you submit an RFQ to the Super Admin.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default RFQDiscussions;
