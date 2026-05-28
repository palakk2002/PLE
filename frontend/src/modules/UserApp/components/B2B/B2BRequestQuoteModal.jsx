import React, { useState } from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiSend, FiFileText, FiCalendar, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const B2BRequestQuoteModal = ({ isOpen, onClose, product }) => {
  const { businessProfile, addQuotation, getWholesaleSpecs } = useBusinessBuyer();
  const specs = getWholesaleSpecs(product.id, product.price);

  const [quantity, setQuantity] = useState(specs.moq);
  const [targetPrice, setTargetPrice] = useState(Math.round(specs.tiers[2]?.price || product.price * 0.6));
  const [businessName, setBusinessName] = useState(businessProfile.companyName);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity < specs.moq) {
      toast.error(`Quantity cannot be lower than MOQ (${specs.moq} ${product.unit}s)`);
      return;
    }

    if (!businessName.trim()) {
      toast.error('Please enter business name');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addQuotation({
        productId: product.id,
        productName: product.name,
        quantity,
        unit: product.unit || 'Piece',
        targetPrice,
        businessName,
        expectedDeliveryDate,
        budgetRange,
        notes,
      });

      setIsSubmitting(false);
      toast.success('Wholesale quote request (RFQ) sent successfully!');
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-primary-100" />
              <h3 className="font-bold text-lg">Request Wholesale Quote</h3>
            </div>
            <button
              onClick={onClose}
              className="text-primary-100 hover:text-white hover:bg-primary-700/50 p-1.5 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Info */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                Product
              </span>
              <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Retail Price: ₹{product.price} / {product.unit} | B2B MOQ: {specs.moq} {product.unit}s
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  RFQ Quantity
                </label>
                <input
                  type="number"
                  min={specs.moq}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Target Price (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <FiBriefcase className="w-3.5 h-3.5" />
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="Your business name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expected Delivery Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <FiCalendar className="w-3.5 h-3.5" />
                  Expected Date
                </label>
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <FiDollarSign className="w-3.5 h-3.5" />
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors bg-white"
                >
                  <option value="">Select Range</option>
                  <option value="₹10k - ₹50k">₹10k - ₹50k</option>
                  <option value="₹50k - ₹2L">₹50k - ₹2L</option>
                  <option value="₹2L - ₹10L">₹2L - ₹10L</option>
                  <option value="₹10L+">₹10L+</option>
                </select>
              </div>
            </div>

            {/* Custom Requirements / Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Requirement Notes
              </label>
              <textarea
                rows={3}
                placeholder="Specify packaging requirements, branding requests, custom sizes, or delivery dates..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending RFQ...</span>
                ) : (
                  <>
                    <FiSend />
                    <span>Submit RFQ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default B2BRequestQuoteModal;
