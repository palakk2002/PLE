import { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiSend, FiUser, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../../../../shared/utils/api";
import socketService from "../../../../shared/utils/socket";
import toast from "react-hot-toast";

const PLEShopChats = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch all approved shops (to switch between admin owned/managed shops)
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoadingShops(true);
        const res = await api.get("/admin/ple-shop/my-shops");
        const payload = res?.data?.data || res?.data || [];
        setShops(payload);
        
        // Find default PLE Shop or select the first one
        if (payload.length > 0) {
          const ple = payload.find((s) => s.storeName === "PLE Shop") || payload[0];
          setSelectedShop(ple);
        }
      } catch (err) {
        console.error("Failed to load shops list:", err);
        toast.error("Failed to load shops list.");
      } finally {
        setLoadingShops(false);
      }
    };
    fetchShops();
  }, []);

  // Load all chat threads for the selected shop
  const fetchThreads = async () => {
    if (!selectedShop?._id) return;
    try {
      setLoadingThreads(true);
      const res = await api.get("/admin/ple-shop/threads", {
        params: { vendorId: selectedShop._id },
      });
      const payload = res?.data?.data || res?.data || [];
      setThreads(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Failed to load threads:", err);
      toast.error("Failed to load conversation list.");
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    setSelectedThread(null);
    setMessages([]);
  }, [selectedShop?._id]);

  // Fetch messages when a thread is selected
  useEffect(() => {
    if (!selectedThread?._id || !selectedShop?._id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await api.get(`/admin/ple-shop/threads/${selectedThread._id}/messages`, {
          params: { vendorId: selectedShop._id },
        });
        const payload = res?.data?.data || res?.data || [];
        setMessages(Array.isArray(payload) ? payload : []);
        
        // Mark as read
        await api.patch(`/admin/ple-shop/threads/${selectedThread._id}/read`, null, {
          params: { vendorId: selectedShop._id },
        });
        setThreads((prev) =>
          prev.map((t) =>
            t._id === selectedThread._id ? { ...t, unreadCount: 0 } : t
          )
        );
      } catch (err) {
        console.error("Failed to load messages:", err);
        toast.error("Failed to load message history.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedThread?._id, selectedShop?._id]);

  // Connect to Socket.io and join room
  useEffect(() => {
    if (!selectedThread?._id) return;

    const socket = socketService.getSocket();
    if (!socket) return;

    socket.emit("join_chat_room", selectedThread._id);

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id || m._id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.emit("leave_chat_room", selectedThread._id);
      socket.off("new_message", handleNewMessage);
    };
  }, [selectedThread?._id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !selectedThread?._id || !selectedShop?._id || sending) return;

    setSending(true);
    try {
      const res = await api.post(`/admin/ple-shop/threads/${selectedThread._id}/messages`, {
        message: text,
        vendorId: selectedShop._id,
      });
      const created = res?.data?.data || res?.data || res;
      if (created) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === created.id || m._id === created.id)) return prev;
          return [...prev, created];
        });
        setNewMessage("");

        const now = new Date().toISOString();
        setThreads((prev) =>
          prev.map((t) =>
            t._id === selectedThread._id
              ? { ...t, lastMessage: text, lastActivity: now }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header and Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Store Customer Chats</h1>
          <p className="text-sm text-gray-600">Reply to pre-purchase product queries and custom orders sent directly to your stores.</p>
        </div>

        {/* Shop Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="shop-select" className="text-xs font-bold text-gray-700 uppercase">
            Active Shop:
          </label>
          {loadingShops ? (
            <span className="text-xs text-gray-500 animate-pulse">Loading shops...</span>
          ) : (
            <select
              id="shop-select"
              value={selectedShop?._id || ""}
              onChange={(e) => {
                const shop = shops.find((s) => s._id === e.target.value);
                if (shop) setSelectedShop(shop);
              }}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {shops.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.storeName || s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Threads List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[500px] max-h-[650px] overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <FiMessageSquare className="text-primary-600" />
              <span>Inbox ({threads.length})</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-250">
            {loadingThreads ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Loading conversations...</div>
            ) : threads.length > 0 ? (
              threads.map((thread) => (
                <div
                  key={thread._id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col gap-1.5 ${
                    selectedThread?._id === thread._id ? "bg-primary-50 border-l-4 border-primary-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-850 text-sm flex items-center gap-1">
                      {thread.customerName || "Customer"}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="bg-[#7B0A0A] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {thread.unreadCount} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{thread.lastMessage || "No messages yet"}</p>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {thread.lastActivity ? new Date(thread.lastActivity).toLocaleString() : "N/A"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No customer inquiries found for {selectedShop?.storeName || "this store"}.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-[500px] max-h-[650px] overflow-hidden">
          {selectedThread ? (
            <>
              {/* Active Thread Header */}
              <div className="p-4 border-b border-gray-200 bg-primary-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                    <FiUser className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{selectedThread.customerName || "Customer"}</h3>
                    <p className="text-xs text-gray-500">{selectedThread.customerEmail || "No email"}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2.5 py-0.5 rounded-full border border-green-200 uppercase">
                  Connected
                </span>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                {loadingMessages ? (
                  <div className="text-center text-gray-500 animate-pulse">Loading message history...</div>
                ) : (
                  messages.map((msg, idx) => {
                    const isVendor = msg.sender === "vendor";
                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex ${isVendor ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm shadow-xs ${
                            isVendor
                              ? "bg-[#7B0A0A] text-white rounded-tr-none"
                              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              isVendor ? "text-primary-100" : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a reply as store..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7B0A0A] focus:border-[#7B0A0A] resize-none font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-2.5 bg-[#7B0A0A] hover:bg-[#AE020B] text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <FiSend className="text-base" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
              <FiMessageSquare className="text-5xl mb-4 text-gray-300" />
              <p className="font-semibold">Select a conversation from the inbox list to reply.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PLEShopChats;
