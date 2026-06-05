import { useState, useEffect } from "react";
import { FiSearch, FiEye, FiMessageSquare, FiSend, FiX, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "../../Admin/components/DataTable";
import Badge from "../../../shared/components/Badge";
import AnimatedSelect from "../../Admin/components/AnimatedSelect";
import { useSupportStore } from "../../../shared/store/supportStore";
import { useVendorAuthStore } from "../store/vendorAuthStore";
import toast from "react-hot-toast";

const SupportEscalations = () => {
  const { vendor } = useVendorAuthStore();
  const { tickets, isLoading, fetchTickets, addReply, updateTicketStatus } = useSupportStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetchTickets({
      search: searchQuery,
      status: statusFilter === "all" ? undefined : statusFilter
    });
  }, [searchQuery, statusFilter, fetchTickets]);

  const handleViewTicket = async (ticketRow) => {
    setSelectedTicket(ticketRow);
    const updated = await useSupportStore.getState().fetchTicketById(ticketRow.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleReply = async () => {
    const message = replyMessage.trim();
    if (!message) return;
    const updated = await addReply(selectedTicket.id, message, "vendor");
    if (updated) {
      setReplyMessage("");
      setSelectedTicket(updated);
    }
  };

  const handleEscalate = async (ticketId) => {
    try {
      // Escalating sets status to in_progress or changes priority/flag
      const success = await updateTicketStatus(ticketId, "in_progress", "Vendor escalated this ticket to Admin support.");
      if (success) {
        toast.success("Ticket escalated to Admin support!");
        const updated = await useSupportStore.getState().fetchTicketById(ticketId);
        if (updated) setSelectedTicket(updated);
      }
    } catch (e) {
      toast.error("Failed to escalate ticket");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "error",
      in_progress: "warning",
      waiting_for_user: "info",
      resolved: "success",
      closed: "default",
    };
    return colors[status] || "default";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-blue-100 text-blue-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      key: "id",
      label: "Ticket ID",
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-800 text-xs">{value}</span>,
    },
    {
      key: "customer",
      label: "User",
      sortable: false,
      render: (_, row) => (
        <div>
          <p className="font-medium text-xs">{row.customer?.name || "Anonymous User"}</p>
          <p className="text-[10px] text-gray-500">{row.customer?.email}</p>
        </div>
      )
    },
    {
      key: "category",
      label: "Product / Category",
      sortable: true,
      render: (value) => (
        <div>
          <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-semibold text-gray-600">
            {value}
          </span>
        </div>
      )
    },
    {
      key: "subject",
      label: "Issue",
      sortable: false,
      render: (value, row) => (
        <div>
          <p className="text-xs font-semibold text-gray-850 truncate max-w-xs">{value}</p>
          <p className="text-[10px] text-gray-500 truncate max-w-xs">{row.description}</p>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => <Badge variant={getStatusColor(value)}>{value?.replace("_", " ") || "unknown"}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewTicket(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Ticket"
          >
            <FiEye className="text-sm" />
          </button>
          {row.status !== "closed" && (
            <button
              onClick={() => handleEscalate(row.id)}
              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Escalate to Admin"
            >
              <FiAlertTriangle className="text-sm" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto p-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <FiMessageSquare className="text-[#C07A3D]" /> Vendor Support Escalations
        </h1>
        <p className="text-sm text-gray-500">Manage customer complaints, orders, and payment support issues escalated to your store.</p>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-150">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search escalations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C07A3D]/50 text-sm"
            />
          </div>

          <AnimatedSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "open", label: "Open" },
              { value: "in_progress", label: "In Progress" },
              { value: "waiting_for_user", label: "Waiting For User" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
            className="min-w-[140px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-150">
        <DataTable
          data={tickets}
          columns={columns}
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {/* Ticket Details / Chat Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="fixed inset-0 bg-black/50 z-[10000]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto flex flex-col"
              >
                <div className="flex items-center justify-between mb-4 border-b pb-3 flex-shrink-0">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">#{selectedTicket.id} - {selectedTicket.subject}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">User: {selectedTicket.customer?.name} ({selectedTicket.customer?.email})</p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-xs">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{selectedTicket.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Priority</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <span className={`inline-block mt-0.5`}><Badge variant={getStatusColor(selectedTicket.status)}>{selectedTicket.status?.replace('_', ' ')}</Badge></span>
                    </div>
                    <div>
                      <p className="text-gray-400">Created Date</p>
                      <p className="font-semibold text-gray-800 mt-0.5">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-1">ISSUE DESCRIPTION</span>
                    <div className="bg-gray-50 p-3 rounded-lg border text-xs text-gray-700 whitespace-pre-wrap">
                      {selectedTicket.description}
                    </div>
                    {selectedTicket.screenshot && (
                      <div className="mt-2">
                        <img src={selectedTicket.screenshot} alt="Screenshot attachment" className="max-h-40 rounded border object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Conversation History */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <FiMessageSquare /> Messages
                    </h4>
                    <div className="space-y-3">
                      {selectedTicket.messages?.map((msg, idx) => {
                        const isVendor = msg.senderType === 'vendor';
                        return (
                          <div key={idx} className={`flex flex-col ${isVendor ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                              isVendor ? 'bg-[#C07A3D] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none border'
                            }`}>
                              {msg.message}
                            </div>
                            <span className="text-[9px] text-gray-400 mt-0.5">
                              {msg.senderType.toUpperCase()} | {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reply / Actions */}
                {selectedTicket.status !== "closed" && (
                  <div className="mt-4 pt-3 border-t flex flex-col gap-3 flex-shrink-0">
                    <div className="relative">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your response as Vendor..."
                        className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C07A3D]/50 text-xs resize-none"
                        rows="2"
                      />
                      <button
                        onClick={handleReply}
                        disabled={!replyMessage.trim() || isLoading}
                        className="absolute right-2 bottom-2 p-2 bg-[#C07A3D] text-white rounded-lg hover:bg-[#A6642E] transition-colors disabled:opacity-50"
                      >
                        <FiSend />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEscalate(selectedTicket.id)}
                        className="flex-1 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold transition-all border border-orange-200 flex items-center justify-center gap-1.5"
                      >
                        <FiAlertTriangle /> Escalate to Admin
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

export default SupportEscalations;
