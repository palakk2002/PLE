import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiSend, FiFileText, FiCalendar, FiBriefcase, FiDollarSign, FiPaperclip } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../../../shared/utils/api';

export const B2BRequestQuoteModal = ({ isOpen, onClose, product }) => {
  const { businessProfile, getWholesaleSpecs } = useBusinessBuyer();
  const specs = product ? getWholesaleSpecs(product.id, product.price) : { moq: 1, tiers: [] };

  const [quantity, setQuantity] = useState(product ? specs.moq : 1);
  const [targetPrice, setTargetPrice] = useState(product ? Math.round(specs.tiers[2]?.price || product.price * 0.6) : 100);
  const [customProductName, setCustomProductName] = useState('');
  const [businessName, setBusinessName] = useState(businessProfile.companyName);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [notes, setNotes] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product && quantity < specs.moq) {
      toast.error(`Quantity cannot be lower than MOQ (${specs.moq} ${product.unit}s)`);
      return;
    }

    if (!product && !customProductName.trim()) {
      toast.error('Please enter the custom product details');
      return;
    }

    if (!businessName.trim()) {
      toast.error('Please enter business name');
      return;
    }

    setIsSubmitting(true);

    try {
      let attachmentUrl = '';
      if (attachmentFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', attachmentFile);
        const uploadRes = await api.post('/rfq/upload', uploadForm, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        attachmentUrl = uploadRes.data?.url || uploadRes.url || '';
      }

      await api.post('/rfq', {
        productId: product ? (product.id || product._id) : undefined,
        customProductName: product ? undefined : customProductName,
        quantity,
        targetPrice,
        requirementDetails: notes,
        expectedDeliveryDate: expectedDeliveryDate || undefined,
        attachment: attachmentUrl
      });

      toast.success('Wholesale quote request (RFQ) sent successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
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
          <div className="sticky top-0 z-20 bg-gradient-to-r from-[#AE020B] to-[#7B0A0A] px-6 py-4 flex items-center justify-between text-white shadow-sm">
            <div className="flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-red-100" />
              <h3 className="font-bold text-lg">Request Wholesale Quote</h3>
            </div>
            <button
              onClick={onClose}
              className="text-red-100 hover:text-white hover:bg-red-700/50 p-1.5 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Info */}
            {product ? (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                  Product
                </span>
                <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Retail Price: ₹{product.price} / {product.unit} | B2B MOQ: {specs.moq} {product.unit}s
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Requested Custom Product Details / Specifications
                </label>
                <input
                  type="text"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="e.g. Organic Cotton T-Shirts, Custom Sizes"
                  required
                />
              </div>
            )}

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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
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
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors bg-white"
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
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <FiPaperclip className="w-3.5 h-3.5" />
                Upload Attachment (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setAttachmentFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-750 hover:file:bg-red-100 transition-all"
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
                className="px-5 py-2.5 rounded-xl bg-[#AE020B] hover:bg-[#7B0A0A] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
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
    </AnimatePresence>,
    document.body
  );
};

export default B2BRequestQuoteModal;
