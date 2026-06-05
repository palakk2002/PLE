import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiTrash2, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from '../../../shared/components/PageTransition';
import { useOrderStore } from '../../../shared/store/orderStore';
import { useReturnStore } from '../../../shared/store/returnStore';
import { useAuthStore } from '../../../shared/store/authStore';
import { formatPrice } from '../../../shared/utils/helpers';
import LazyImage from '../../../shared/components/LazyImage';
import toast from 'react-hot-toast';

const ReturnRequestForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, fetchOrderById } = useOrderStore();
  const { createReturnRequest } = useReturnStore();
  const { user } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [selectedItems, setSelectedItems] = useState({}); // { itemId: true/false }
  const [quantities, setQuantities] = useState({}); // { itemId: qty }
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]); // Array of base64 strings
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Damaged Product',
    'Wrong Product Received',
    'Missing Parts',
    'Defective Item',
    'Not As Described',
    'Other'
  ];

  useEffect(() => {
    let active = true;
    const loadOrder = async () => {
      setIsLoadingOrder(true);
      const fetched = await fetchOrderById(orderId);
      if (active) {
        setOrder(fetched);
        setIsLoadingOrder(false);
        // Default select all items for return
        if (fetched && fetched.items) {
          const itemsMap = {};
          const qtyMap = {};
          fetched.items.forEach(item => {
            const itemId = item.id || item.productId;
            itemsMap[itemId] = true;
            qtyMap[itemId] = item.quantity || 1;
          });
          setSelectedItems(itemsMap);
          setQuantities(qtyMap);
        }
      }
    };
    loadOrder();
    return () => { active = false; };
  }, [orderId, fetchOrderById]);

  if (isLoadingOrder) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Order Not Found</h3>
            <button
              onClick={() => navigate('/orders')}
              className="gradient-green text-white px-6 py-2 rounded-xl font-semibold"
            >
              Go to Orders
            </button>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  const handleToggleItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleQtyChange = (itemId, val, max) => {
    const qty = Math.max(1, Math.min(max, val));
    setQuantities(prev => ({
      ...prev,
      [itemId]: qty
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('You can upload up to 5 images only');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedKeys = Object.keys(selectedItems).filter(key => selectedItems[key]);
    if (selectedKeys.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    if (!reason) {
      toast.error('Please select a return reason');
      return;
    }

    if (description.trim().length < 10) {
      toast.error('Please provide a detailed description (min 10 characters)');
      return;
    }

    setIsSubmitting(true);

    const itemsToReturn = order.items
      .filter(item => selectedItems[item.id || item.productId])
      .map(item => ({
        id: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: quantities[item.id || item.productId] || 1,
        image: item.image,
        reason: reason
      }));

    const refundAmount = itemsToReturn.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const payload = {
      orderId: order.id,
      customer: {
        name: user?.name || order.shippingAddress?.name || 'Customer',
        email: user?.email || order.shippingAddress?.email || 'customer@example.com',
        phone: user?.phone || order.shippingAddress?.phone || ''
      },
      items: itemsToReturn,
      reason,
      description,
      notes,
      images,
      refundAmount
    };

    const result = await createReturnRequest(payload);
    setIsSubmitting(false);

    if (result) {
      navigate(`/returns/${result.id}`);
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={false}>
        <div className="w-full pb-24">
          {/* Header */}
          <div className="px-4 py-4 bg-white border-b border-gray-200 sticky top-1 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Return Items</h1>
              <p className="text-xs text-gray-500">Order #{order.id}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
            {/* Items Selection */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-800 mb-3">Select items to return</h2>
              <div className="space-y-3">
                {order.items.map((item) => {
                  const itemId = item.id || item.productId;
                  const isSelected = !!selectedItems[itemId];
                  return (
                    <div key={itemId} className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => handleToggleItem(itemId)}
                        className={`w-5 h-5 rounded border mt-1 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <FiCheck className="text-xs" />}
                      </button>

                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <LazyImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-xs truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price)}</p>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] text-gray-600 font-medium">Qty:</span>
                            <input
                              type="number"
                              min={1}
                              max={item.quantity || 1}
                              value={quantities[itemId] || 1}
                              onChange={(e) => handleQtyChange(itemId, parseInt(e.target.value, 10), item.quantity || 1)}
                              className="w-12 text-center text-xs py-0.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <span className="text-[10px] text-gray-400">max {item.quantity || 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Return reason */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Reason for Return
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                required
              >
                <option value="">Select a reason</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Please explain in detail why you are returning the product..."
                required
              />
            </div>

            {/* Images Upload */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Upload Product Images (Max 5)
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {images.map((img, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={img} alt="upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0.5 right-0.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <FiTrash2 className="text-[10px]" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50">
                    <FiCamera className="text-gray-400 text-lg" />
                    <span className="text-[9px] text-gray-500 mt-1">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Additional notes */}
            <div className="glass-card rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Any extra details or preferences..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 gradient-green text-white rounded-xl font-bold shadow-md hover:shadow-glow-green disabled:opacity-75 transition-all text-sm"
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default ReturnRequestForm;
