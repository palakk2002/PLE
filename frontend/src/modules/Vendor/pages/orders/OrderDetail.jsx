import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiPackage,
    FiMapPin,
    FiUser,
    FiDollarSign,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useVendorAuthStore } from '../../store/vendorAuthStore';
import { getVendorOrderById, updateVendorOrderStatus } from '../../services/vendorService';
import { formatPrice } from '../../../../shared/utils/helpers';
import Badge from '../../../../shared/components/Badge';
import AnimatedSelect from '../../../Admin/components/AnimatedSelect';
import toast from 'react-hot-toast';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { vendor } = useVendorAuthStore();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const vendorIdsToMatch = [
        vendor?.id?.toString(),
        vendor?._id?.toString(),
        vendor?.shopId?.toString(),
        vendor?.shopId?._id?.toString(),
    ].filter(Boolean);

    const shippingAddress = order?.shippingAddress ?? order?.address ?? null;
    const customerName =
        (typeof order?.userId === 'object' && order?.userId?.name) ||
        order?.shippingAddress?.name ||
        order?.shippingAddress?.fullName ||
        order?.guestInfo?.name ||
        order?.customer?.name ||
        'Guest';

    const customerEmail =
        (typeof order?.userId === 'object' && order?.userId?.email) ||
        order?.shippingAddress?.email ||
        order?.guestInfo?.email ||
        order?.customer?.email ||
        'N/A';

    useEffect(() => {
        if (!id || !vendor) return;

        const fetchOrder = async () => {
            setLoading(true);
            try {
                const res = await getVendorOrderById(id);
                const data = res?.data ?? res;
                setOrder(data ?? null);
            } catch {
                // api.js shows toast
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, vendor]);

    const handleStatusChange = async (newStatus) => {
        if (!order) return;
        setUpdatingStatus(true);
        try {
            await updateVendorOrderStatus(order.orderId ?? order._id, newStatus);
            // Optimistically update local state
            setOrder((prev) => ({
                ...prev,
                vendorItems: prev.vendorItems?.map((vi) => {
                    const itemVid = (vi.vendorId?._id || vi.vendorId)?.toString();
                    return vendorIdsToMatch.includes(itemVid)
                        ? { ...vi, status: newStatus }
                        : vi;
                }),
                status: newStatus,
            }));
            toast.success(`Order status updated to ${newStatus}`);
        } catch {
            // api.js shows toast
        } finally {
            setUpdatingStatus(false);
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'yellow' },
        { value: 'processing', label: 'Processing', color: 'blue' },
        { value: 'shipped', label: 'Shipped', color: 'purple' },
        { value: 'delivered', label: 'Delivered', color: 'green' },
        { value: 'cancelled', label: 'Cancelled', color: 'red' },
    ];

    const transitionMap = {
        pending: ['pending', 'processing', 'cancelled'],
        processing: ['processing', 'shipped', 'cancelled'],
        shipped: ['shipped', 'delivered'],
        delivered: ['delivered'],
        cancelled: ['cancelled'],
    };

    // Derive per-vendor status from vendorItems
    const vendorItem = order?.vendorItems?.find((vi) => {
        const itemVendorId = (vi.vendorId?._id || vi.vendorId)?.toString();
        return vendorIdsToMatch.includes(itemVendorId);
    }) || (order?.vendorItems?.length === 1 ? order?.vendorItems[0] : null);

    const currentStatus = String(vendorItem?.status ?? order?.status ?? 'pending').toLowerCase();
    const allowedStatuses = transitionMap[currentStatus] || [currentStatus];
    const visibleStatusOptions = statusOptions.filter((option) =>
        allowedStatuses.includes(option.value)
    );

    const earnedPoints = order?.loyaltyPointsEarned ?? 0;
    const redeemedPoints = order?.loyaltyPointsRedeemed ?? 0;

    // Items this vendor sold in this order (fallback to order.items)
    const vendorItems = (vendorItem?.items && vendorItem.items.length > 0)
        ? vendorItem.items
        : (order?.items ?? []);
    const vendorSubtotal = vendorItem?.subtotal ?? order?.subtotal ?? order?.total ?? 0;

    if (loading) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-500">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6 text-center space-y-3">
                <p className="text-gray-700 font-semibold">Order not found</p>
                <p className="text-sm text-gray-500">
                    Order #{id} may not belong to your store.
                </p>
                <Link
                    to="/vendor/orders"
                    className="inline-block text-blue-600 hover:underline text-sm"
                >
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    return (        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 min-w-0"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        to="/vendor/orders"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                    >
                        <FiArrowLeft className="text-gray-600 dark:text-gray-300" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-white truncate">
                                Order #{order.orderId ?? order._id}
                            </h1>
                            <Badge variant={order.isB2b || order.orderType === 'b2b' ? 'warning' : 'success'}>
                                {order.isB2b || order.orderType === 'b2b' ? 'WHOLESALE' : 'RETAIL'}
                            </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Placed on{' '}
                            {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : '—'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    <AnimatedSelect
                        options={visibleStatusOptions}
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updatingStatus}
                        color={
                            visibleStatusOptions.find((opt) => opt.value === currentStatus)
                                ?.color || 'gray'
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden min-w-0">
                        <div className="p-4 border-b border-gray-200 dark:border-white/5">
                            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                                <FiPackage />
                                Your Items in this Order
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-white/5">
                            {vendorItems.length > 0 ? (
                                vendorItems.map((item, index) => (
                                    <div key={index} className="p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/64?text=Product';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                {formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right flex-shrink-0">
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                                                {formatPrice((item.price ?? 0) * (item.quantity ?? 1))}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                    No item details available for this order.
                                </div>
                            )}
                        </div>
                        {vendorSubtotal > 0 && (
                            <div className="p-4 border-t border-gray-200 flex justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        Your subtotal
                                    </p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {formatPrice(vendorSubtotal)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FiDollarSign />
                            Order Summary
                        </h2>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Your items status</span>
                            <Badge
                                variant={
                                    currentStatus === 'delivered'
                                        ? 'success'
                                        : currentStatus === 'pending'
                                            ? 'warning'
                                            : currentStatus === 'cancelled'
                                                ? 'error'
                                                : 'info'
                                }
                            >
                                {currentStatus.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="text-gray-600">Loyalty Points Earned</span>
                            <span className="font-bold text-emerald-600">+{earnedPoints} Pts</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-600">Loyalty Points Redeemed</span>
                            <span className="font-bold text-rose-600">-{redeemedPoints} Pts</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiUser />
                            Customer Details
                        </h2>
                        <div className="space-y-3">
                            {(order.isB2b || order.orderType === 'b2b') ? (
                                <>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Company Name</p>
                                        <p className="font-semibold text-gray-800">{order.companyName || order.customer?.companyName || 'Apex General Enterprises'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Requested By</p>
                                        <p className="font-semibold text-gray-800">{customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Employee Name</p>
                                        <p className="font-semibold text-gray-800">{customerName}</p>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{customerName}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{customerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FiMapPin />
                            Shipping Address
                        </h2>
                        {shippingAddress ? (
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {shippingAddress.address ?? shippingAddress.street ?? 'N/A'}
                                <br />
                                {shippingAddress.city}, {shippingAddress.state}{' '}
                                {shippingAddress.zipCode}
                                <br />
                                {shippingAddress.country}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No address available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetail;
