import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiX, FiInfo, FiShoppingBag, FiMapPin, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import VendorSidebar from './VendorSidebar';
import VendorHeader from './VendorHeader';
import VendorBottomNav from './VendorBottomNav';
import useAdminHeaderHeight from '../../../Admin/hooks/useAdminHeaderHeight';
import { useVendorAuthStore } from '../../store/vendorAuthStore';
import socketService from '../../../../shared/utils/socket';
import { updateVendorOrderStatus } from '../../services/vendorService';
import { formatPrice } from '../../../../shared/utils/helpers';

const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Default to collapsed on small laptops (< 1280px) for maximum working space
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 && window.innerWidth < 1280;
    }
    return false;
  });
  const [newOrder, setNewOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  
  const headerHeight = useAdminHeaderHeight();
  const navigate = useNavigate();
  
  const { vendor, refreshProfile } = useVendorAuthStore();
  const vendorId = vendor?.id || vendor?._id;

  // Bottom nav height is 64px (h-16)
  const bottomNavHeight = 64;

  // Add small buffer to prevent content overlap (8px)
  const topPadding = headerHeight + 8;
  const bottomPadding = bottomNavHeight + 8;

  useEffect(() => {
    if (refreshProfile) {
      refreshProfile();
    }
  }, []);

  useEffect(() => {
    if (!vendorId) return;

    const socket = socketService.getSocket();
    if (socket) {
      const joinRoom = () => {
        socket.emit('join_user_room', vendorId);
        console.log(`Vendor joined room: user_${vendorId}`);
      };

      if (socket.connected) {
        joinRoom();
      }

      socket.on('connect', joinRoom);
      
      const handleNewOrder = (data) => {
        // Play notification sound if possible
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {
          console.warn("Audio play failed:", e);
        }
        setNewOrder(data);
      };

      socket.on('new_order_placed', handleNewOrder);

      return () => {
        socket.off('connect', joinRoom);
        socket.off('new_order_placed', handleNewOrder);
        socket.emit('leave_user_room', vendorId);
      };
    }
  }, [vendorId]);

  const handleAccept = async () => {
    if (!newOrder || updating) return;
    setUpdating(true);
    try {
      const orderIdToUpdate = newOrder.orderId || newOrder.dbOrderId;
      await updateVendorOrderStatus(orderIdToUpdate, 'processing');
      toast.success('Order accepted! Opening details...', {
        duration: 4000,
        position: 'top-right',
      });
      setNewOrder(null);
      navigate(`/vendor/orders/${orderIdToUpdate}`);
    } catch (err) {
      console.error("Accept failed:", err);
      toast.error('Failed to accept order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!newOrder || updating) return;
    setUpdating(true);
    try {
      const orderIdToUpdate = newOrder.orderId || newOrder.dbOrderId;
      await updateVendorOrderStatus(orderIdToUpdate, 'cancelled');
      toast.error('Order rejected/cancelled.');
      setNewOrder(null);
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error('Failed to reject order. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] dark:text-gray-100 flex">
      {/* Sidebar */}
      <div className="print:hidden">
        <VendorSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden print:ml-0 transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Header */}
        <div className="print:hidden">
          <VendorHeader
            onMenuClick={() => setSidebarOpen(true)}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          />
        </div>

        {/* Page Content - with dynamic padding to account for fixed header and bottom nav */}
        <main
          className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden scrollbar-admin w-full min-w-0 print:p-0 print:m-0"
          style={{
            paddingTop: `${Math.max(topPadding, 72)}px`,
            paddingBottom: typeof window !== 'undefined' && window.innerWidth < 1024
              ? `calc(${Math.max(bottomPadding, 72)}px + env(safe-area-inset-bottom, 0px))`
              : "2rem",
          }}
        >
          <div className="w-full max-w-full overflow-x-hidden min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="print:hidden">
        <VendorBottomNav />
      </div>

      {/* Interactive Real-Time Order Popup Modal */}
      <AnimatePresence>
        {newOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg animate-pulse">
                    <FiShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-wide">🚨 New Order Received!</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">Order ID: {newOrder.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNewOrder(null)}
                  disabled={updating}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Order Info Body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Customer & Earnings Row */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center text-xs text-gray-500 font-medium mb-1">
                      <FiUser className="mr-1" /> Customer
                    </div>
                    <p className="font-semibold text-gray-800">{newOrder.customerName}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-xs text-gray-500 font-medium mb-1">
                      💰 Your Earnings
                    </div>
                    <p className="font-bold text-lg text-emerald-600">
                      {formatPrice(newOrder.total)}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                {newOrder.shippingAddress && (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
                    <div className="flex items-center text-xs text-gray-500 font-medium mb-1">
                      <FiMapPin className="mr-1 text-emerald-500" /> Delivery Address
                    </div>
                    <p className="font-medium text-gray-800">{newOrder.shippingAddress.name}</p>
                    <p className="text-gray-600 mt-0.5">
                      {[
                        newOrder.shippingAddress.address,
                        newOrder.shippingAddress.city,
                        newOrder.shippingAddress.state,
                        newOrder.shippingAddress.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}

                {/* Order Items List */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                    Items to Fulfill
                  </div>
                  <div className="space-y-2">
                    {newOrder.items && newOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center space-x-3 min-w-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded bg-white border"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-emerald-100 rounded flex items-center justify-center text-emerald-600 font-bold">
                              {item.name?.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} &times; {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-800 ml-2">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center space-x-4">
                <button
                  onClick={handleReject}
                  disabled={updating}
                  className="flex-1 py-3 px-4 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>{updating ? 'Processing...' : 'Reject Order'}</span>
                </button>
                <button
                  onClick={handleAccept}
                  disabled={updating}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-700 active:from-emerald-700 active:to-teal-800 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <FiCheck className="w-5 h-5" />
                  <span>{updating ? 'Processing...' : 'Accept Order'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorLayout;


