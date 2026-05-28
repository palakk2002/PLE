import React, { useState } from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiSend, FiPackage, FiCalendar, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const B2BRequestStockModal = ({ isOpen, onClose, product }) => {
  const { businessProfile, addStockRequest } = useBusinessBuyer();

  const [requiredQuantity, setRequiredQuantity] = useState(100);
  const [businessName, setBusinessName] = useState(businessProfile.companyName);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (requiredQuantity < 1) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (!businessName.trim()) {
      toast.error('Please enter business name');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addStockRequest({
        productId: product.id,
        productName: product.name,
        requiredQuantity,
        unit: product.unit || 'Piece',
        businessName,
        expectedDeliveryDate,
        budgetRange,
        notes,
      });

      setIsSubmitting(false);
      toast.success('Stock request submitted successfully! Seller will respond within 24 hours.');
      onClose();
      
      // Reset form
      setRequiredQuantity(100);
      setBusinessName(businessProfile.companyName);
      setExpectedDeliveryDate('');
      setBudgetRange('');
      setNotes('');
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
              <FiPackage className="w-5 h-5 text-primary-100" />
              <h3 className="font-bold text-lg">Request Stock Availability</h3>
            </div>
            <button
              onClick={onClose}
              className="text-primary-100 hover:text-white hover:bg-primary-800/50 p-1.5 rounded-lg transition-colors"
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
                Current Status: {product.stock === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
              </p>
            </div>

            {/* Required Quantity */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <FiPackage className="w-3.5 h-3.5" />
                Required Quantity
              </label>
              <input
                type="number"
                min="1"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="Enter quantity"
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <FiCheckCircle className="w-3.5 h-3.5" />
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

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <FiCalendar className="w-3.5 h-3.5" />
                Expected Delivery Date (Optional)
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
                Budget Range (Optional)
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors bg-white"
              >
                <option value="">Select budget range</option>
                <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
                <option value="₹5,00,000+">₹5,00,000+</option>
              </select>
            </div>

            {/* Requirement Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                Requirement Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe your requirements, quality specifications, packaging needs, or any other details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
              />
            </div>

            {/* Submit Buttons */}
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <FiSend />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
              <p className="font-semibold mb-1">💡 What happens next?</p>
              <p className="text-blue-700">Our team will review your request and respond within 24-48 hours with stock availability and pricing options.</p>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default B2BRequestStockModal;
