import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend, FiPaperclip, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from '../../../shared/components/PageTransition';
import { useSupportStore } from '../../../shared/store/supportStore';
import toast from 'react-hot-toast';

const SupportChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTicketById, addReply } = useSupportStore();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    let active = true;
    const loadTicket = async () => {
      setLoading(true);
      const data = await fetchTicketById(id);
      if (active) {
        if (!data) {
          toast.error("Ticket not found");
          navigate("/support-tickets");
          return;
        }
        setTicket(data);
        setLoading(false);
      }
    };
    loadTicket();
    return () => { active = false; };
  }, [id, fetchTicketById, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = replyMessage.trim();
    if (!text && !attachment) return;

    try {
      const updated = await addReply(id, text || "Sent an attachment", "user", attachment);
      if (updated) {
        setTicket(updated);
        setReplyMessage('');
        setAttachment(null);
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusStepIndex = (status) => {
    const steps = ['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'];
    return steps.indexOf(status);
  };

  const getStatusLabel = (status) => {
    return status?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
  };

  const timelineSteps = ['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'];

  if (loading) {
    return (
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500 animate-pulse">Loading ticket chat...</p>
        </div>
      </MobileLayout>
    );
  }

  const currentStepIndex = getStatusStepIndex(ticket.status);

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={false}>
        <div className="w-full flex flex-col h-[calc(100vh-64px)] bg-gray-50 pb-12">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/support-tickets')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-800">#{ticket.id}</h1>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-semibold">
                  {ticket.category}
                </span>
              </div>
              <p className="text-xs text-gray-600 truncate max-w-[200px] sm:max-w-xs">{ticket.subject}</p>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                ticket.status === 'closed' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                ticket.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                'bg-primary-50 text-primary-700 border-primary-200'
              }`}>
                {getStatusLabel(ticket.status)}
              </span>
            </div>
          </div>

          {/* Timeline View */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
              ></div>
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isActive = idx === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${
                      isCompleted ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white text-gray-400 border-gray-300'
                    } ${isActive ? 'ring-4 ring-primary-100' : ''}`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-semibold mt-1 transition-all ${
                      isCompleted ? 'text-primary-700 font-bold' : 'text-gray-400'
                    }`}>
                      {step.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm mb-2">
              <span className="text-[10px] font-bold text-gray-400 block mb-1">TICKET DESCRIPTION</span>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{ticket.description}</p>
              {ticket.screenshot && (
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-gray-400 block mb-1">ATTACHMENT</span>
                  <img src={ticket.screenshot} alt="Ticket Screenshot" className="max-h-48 rounded-lg object-contain border" />
                </div>
              )}
            </div>

            {/* Conversation */}
            {ticket.messages?.map((msg, idx) => {
              const isUser = msg.senderType === 'user';
              return (
                <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    isUser ? 'bg-primary-600 text-white rounded-br-none shadow-sm' : 'bg-white border border-gray-150 text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    {msg.attachment && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <img src={msg.attachment} alt="Attachment" className="max-h-40 rounded object-contain" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">
                    {msg.senderType.toUpperCase()} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Reply Form */}
          {ticket.status !== 'closed' ? (
            <form onSubmit={handleSend} className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
              {attachment && (
                <div className="pb-2 flex items-center gap-2">
                  <div className="relative w-12 h-12 border rounded overflow-hidden">
                    <img src={attachment} alt="Attached Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 text-[8px] font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">Image attached</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <label className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200">
                  <FiPaperclip className="text-gray-500 text-lg" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAttachmentChange}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim() && !attachment}
                  className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <FiSend className="text-lg" />
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 border-t border-gray-200 text-center py-3 text-xs text-gray-500 font-bold flex-shrink-0">
              This ticket has been resolved and closed.
            </div>
          )}
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default SupportChat;
