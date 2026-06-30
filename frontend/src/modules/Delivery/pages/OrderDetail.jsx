import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiClock,
  FiPackage,
  FiNavigation,
  FiCheckCircle,
  FiUser,
  FiTrendingUp,
} from 'react-icons/fi';
import PageTransition from '../../../shared/components/PageTransition';
import { formatPrice } from '../../../shared/utils/helpers';
import toast from 'react-hot-toast';
import { useDeliveryAuthStore } from '../store/deliveryStore';

import { initialDeliveryOrders } from '../../../shared/data/deliveryMockData';

const DeliveryOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById, acceptOrder, completeOrder, resendDeliveryOtp, isLoadingOrder, isUpdatingOrderStatus } = useDeliveryAuthStore();
  const [order, setOrder] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Stateful logistics timeline
  const [localTimeline, setLocalTimeline] = useState([]);

  const loadOrder = async () => {
    try {
      setLoadFailed(false);
      const response = await fetchOrderById(id);
      if (response) {
        setOrder(response);
      } else {
        throw new Error("Empty response");
      }
    } catch {
      // Graceful fallback to rich mock logistics data
      const fallback = initialDeliveryOrders.find(o => String(o.id) === String(id));
      if (fallback) {
        setLoadFailed(false);
        setOrder(fallback);
      } else {
        setLoadFailed(true);
        setOrder(null);
      }
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id, fetchOrderById]);

  useEffect(() => {
    if (order) {
      const isProcessingOrLater = ['processing', 'shipped', 'delivered'].includes(order.rawStatus);
      const isShippedOrLater = ['shipped', 'delivered'].includes(order.rawStatus);
      const isDelivered = order.rawStatus === 'delivered';

      setLocalTimeline([
        { stage: "Order Confirmed", date: order.createdAt || order.date || new Date().toISOString(), completed: true },
        { stage: "Packed", date: isProcessingOrLater ? (order.processingAt || order.updatedAt) : null, completed: isProcessingOrLater },
        { stage: "Ready for Dispatch", date: isProcessingOrLater ? (order.processingAt || order.updatedAt) : null, completed: isProcessingOrLater },
        { stage: "Local Hub Handover", date: isProcessingOrLater ? (order.processingAt || order.updatedAt) : null, completed: isProcessingOrLater },
        { stage: "Out for Delivery", date: isShippedOrLater ? (order.shippedAt || order.deliveryOtpSentAt) : null, completed: isShippedOrLater },
        { stage: "Delivered", date: isDelivered ? order.deliveredAt : null, completed: isDelivered }
      ]);
    }
  }, [order]);

  const advanceTimelineStep = async (otpChecked = false) => {
    if (!localTimeline || localTimeline.length === 0 || !order) return;

    // Find first incomplete stage
    const nextStepIndex = localTimeline.findIndex(step => !step.completed);
    if (nextStepIndex === -1) {
      toast.success("Order is already fully delivered!");
      return;
    }

    const nextStepName = localTimeline[nextStepIndex].stage;

    if (nextStepName === "Out for Delivery") {
      // Advance to Out for Delivery = Accept Order (moves status to shipped)
      await handleAcceptOrder();
    } else if (nextStepName === "Delivered") {
      // Advance to Delivered = Prompt for OTP and Complete Order
      const otp = window.prompt("Enter 6-digit delivery OTP shared by customer:");
      if (otp === null) return;
      const normalizedOtp = String(otp).trim();
      if (!/^\d{6}$/.test(normalizedOtp)) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }
      
      try {
        const updated = await completeOrder(order.id, normalizedOtp);
        setOrder(updated);
        toast.success('Order marked as delivered');
      } catch (err) {
        console.error("Complete order failed:", err);
      }
    } else {
      // For Packed, Ready, Hub Handover, if status is pending, trigger handleAcceptOrder
      if (order.status === 'pending') {
        await handleAcceptOrder();
      } else {
        // Just simulate since backend doesn't have intermediate states
        const updatedTimeline = localTimeline.map((step, idx) => {
          if (idx === nextStepIndex) {
            return {
              ...step,
              completed: true,
              date: new Date().toISOString()
            };
          }
          return step;
        });
        setLocalTimeline(updatedTimeline);
        toast.success(`Fulfillment pipeline advanced to: ${nextStepName}!`);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptOrder = async () => {
    if (!order || order.status !== 'pending') return;
    try {
      const updated = await acceptOrder(order.id);
      setOrder(updated);
      toast.success('Order accepted successfully');
    } catch {
      // Error toast handled by API interceptor.
    }
  };

  const handleCompleteOrder = async () => {
    if (!order || order.status !== 'in-transit') return;
    const normalizedOtp = String(deliveryOtp || '').trim();
    if (!/^\d{6}$/.test(normalizedOtp)) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }

    try {
      const updated = await completeOrder(order.id, normalizedOtp);
      setOrder(updated);
      setDeliveryOtp('');
      toast.success('Order marked as delivered');
    } catch {
      // Error toast handled by API interceptor.
    }
  };

  const handleResendOtp = async () => {
    if (!order || order.status !== 'in-transit' || isResendingOtp) return;
    try {
      setIsResendingOtp(true);
      await resendDeliveryOtp(order.id);
      toast.success('Delivery OTP resent to customer');
    } catch {
      // Error toast handled by API interceptor.
    } finally {
      setIsResendingOtp(false);
    }
  };

  const openInGoogleMaps = () => {
    const { latitude, longitude } = order;
    
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);
    
    if (isAndroid) {
      // Android: Use intent URL (opens Google Maps app if installed, otherwise web)
      const intentUrl = `intent://maps.google.com/maps?daddr=${latitude},${longitude}&directionsmode=driving#Intent;scheme=https;package=com.google.android.apps.maps;end`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      // iOS: Try Google Maps app URL scheme first
      const appUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
      // Universal link as fallback (opens app if installed, otherwise web)
      const universalUrl = `https://maps.google.com/maps?daddr=${latitude},${longitude}&directionsmode=driving`;
      
      // Try app URL
      const link = document.createElement('a');
      link.href = appUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Fallback to universal link after brief delay
      setTimeout(() => {
        window.location.href = universalUrl;
      }, 400);
    } else {
      // Desktop: Use web version
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(webUrl, '_blank');
    }
  };

  if (isLoadingOrder) {
    return (
      <PageTransition>
        <div className="px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition>
        <div className="px-4 py-6 text-center space-y-3">
          <p className="text-gray-600">{loadFailed ? 'Unable to load order details' : 'Order not found'}</p>
          {loadFailed && (
            <button
              onClick={loadOrder}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold"
            >
              Retry
            </button>
          )}
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/delivery/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiArrowLeft className="text-xl text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{order.id}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
              {order.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiUser />
            Customer Information
          </h2>
          <div className="space-y-2">
            <p className="text-gray-800 font-semibold">{order.customer}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiPhone />
              <a
                href={order.phone ? `tel:${order.phone}` : '#'}
                className={`hover:text-primary-600 ${!order.phone ? 'pointer-events-none opacity-60' : ''}`}
              >
                {order.phone || 'Phone unavailable'}
              </a>
            </div>
            <p className="text-sm text-gray-600">{order.email || '-'}</p>
          </div>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiMapPin />
            Delivery Address
          </h2>
          <p className="text-gray-700 mb-3">{order.address || 'Address unavailable'}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiNavigation />
              <span>{order.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock />
              <span>{order.estimatedTime}</span>
            </div>
          </div>
          {order.instructions && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Instructions: </span>
                {order.instructions}
              </p>
            </div>
          )}
        </motion.div>

        {/* Map - Show when order is accepted */}
        {(order.status === 'in-transit' || order.status === 'completed') && order.latitude && order.longitude && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FiMapPin className="text-primary-600" />
              Delivery Location
            </h2>
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '300px' }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${order.longitude - 0.01},${order.latitude - 0.01},${order.longitude + 0.01},${order.latitude + 0.01}&layer=mapnik&marker=${order.latitude},${order.longitude}`}
                title="Delivery Location Map"
              />
            </div>
            <div className="mt-3">
              <button
                onClick={openInGoogleMaps}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
              >
                <FiNavigation />
                Open in Google Maps
              </button>
            </div>
          </motion.div>
        )}

        {/* Fulfillment Pipeline Timeline Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Fulfillment Pipeline</h2>
              <p className="text-xs text-gray-500 mt-0.5">Step-by-step delivery tracking status</p>
            </div>
            {order.delivery?.type && (
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                order.delivery.type === 'express' ? 'bg-orange-50 text-orange-700 border border-orange-100 animate-pulse' :
                order.delivery.type === 'bulk' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {order.delivery.type} dispatch
              </span>
            )}
          </div>

          {/* Timeline Graphic */}
          <div className="relative pl-6 space-y-5 border-l-2 border-dashed border-gray-100 ml-3 py-1">
            {localTimeline.map((step, idx) => {
              const isCompleted = step.completed;
              const hasDate = step.date;
              return (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                    isCompleted
                      ? 'bg-primary-600 border-primary-600 ring-4 ring-primary-50 scale-110'
                      : 'bg-white border-gray-300'
                  }`}>
                    {isCompleted && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </span>

                  {/* Stage Details */}
                  <div>
                    <h3 className={`text-xs font-bold transition-colors ${
                      isCompleted ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {step.stage}
                    </h3>
                    {hasDate && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(step.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive driver manual controls */}
          <div className="mt-5 p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Logistics Action Center</span>
              <span className="text-[10px] bg-primary-100 text-primary-800 px-2 py-0.5 rounded font-bold">Driver Console</span>
            </div>
            
            {localTimeline.some(step => !step.completed) ? (
              <button
                onClick={() => advanceTimelineStep(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 transition-colors shadow-sm"
              >
                <FiCheckCircle className="text-sm" />
                Advance shipment to: "{localTimeline.find(step => !step.completed)?.stage}"
              </button>
            ) : (
              <div className="text-xs text-center text-emerald-700 font-bold bg-emerald-50 py-2.5 rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5">
                ✓ Order Handed Over & Fully Delivered!
              </div>
            )}
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiPackage />
            Order Items
          </h2>
          <div className="space-y-3">
            {order.items.length === 0 && (
              <p className="text-sm text-gray-500">No items available for this order.</p>
            )}
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800">{item.name || 'Item'}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
                </div>
                <p className="font-semibold text-gray-800">{formatPrice(item.price || 0)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FiTrendingUp />
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatPrice(order.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-primary-600 text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 pt-4"
        >
          {order.status === 'pending' && (
            <button
              onClick={handleAcceptOrder}
              disabled={isUpdatingOrderStatus}
              className="w-full gradient-green text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiCheckCircle />
              {isUpdatingOrderStatus ? 'Please wait...' : 'Accept Order'}
            </button>
          )}
          {order.status === 'in-transit' && (
            <div className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={deliveryOtp}
                onChange={(e) => setDeliveryOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit delivery OTP"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-base"
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleResendOtp}
                  disabled={isResendingOtp || isUpdatingOrderStatus}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isResendingOtp ? 'Resending...' : 'Resend OTP'}
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isUpdatingOrderStatus}
                  className="w-full gradient-green text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiCheckCircle />
                  {isUpdatingOrderStatus ? 'Please wait...' : 'Mark as Delivered'}
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => order.phone && window.open(`tel:${order.phone}`, '_self')}
            disabled={!order.phone}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiPhone />
            Call Customer
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default DeliveryOrderDetail;



