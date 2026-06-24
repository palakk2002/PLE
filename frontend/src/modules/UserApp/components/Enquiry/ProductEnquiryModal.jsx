import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiPaperclip } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../../shared/store/authStore';
import { useProductEnquiryStore } from '../../../../shared/store/productEnquiryStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../../../shared/utils/api';

export const ProductEnquiryModal = ({ isOpen, onClose, product }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit an enquiry.');
      navigate('/login');
      return;
    }

    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!question.trim()) {
      toast.error('Question is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/user/enquiries', {
        productId: product.id || product._id,
        subject,
        question,
        priority,
        attachment: attachmentName || null
      });
      
      // api.js interceptor already unwraps response.data, so check response.success directly
      if (response.success || response.statusCode === 201) {
        toast.success('Product enquiry submitted successfully!');
        onClose();
        // Reset form
        setSubject('');
        setQuestion('');
        setPriority('Medium');
        setAttachmentName('');
      } else {
        toast.error(response.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to submit enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-gray-100 my-auto"
        >
          {/* Header (using header red/maroon color) */}
          <div className="bg-[#7B0A0A] px-6 py-4 flex items-center justify-between text-white">
            <div>
              <h3 className="font-extrabold text-lg">Product Enquiry</h3>
              <p className="text-xs text-red-100 mt-0.5 truncate max-w-[320px]">
                Asking about: {product?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-red-100 hover:text-white hover:bg-red-800 p-1.5 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Warranty details / Customization / Stock availability"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7B0A0A] focus:ring-1 focus:ring-[#7B0A0A] font-medium"
                required
              />
            </div>

            {/* Question */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Question / Details *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write your specific question about the product..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7B0A0A] focus:ring-1 focus:ring-[#7B0A0A] font-medium"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#7B0A0A] focus:ring-1 focus:ring-[#7B0A0A] font-medium bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Attachment (optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-150 rounded-xl cursor-pointer transition-colors text-xs font-bold text-gray-600">
                  <FiPaperclip className="text-gray-400" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {attachmentName ? (
                  <span className="text-xs text-gray-600 font-semibold truncate max-w-[200px]">
                    {attachmentName}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">
                    No file selected
                  </span>
                )}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold rounded-xl transition-all text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-[#7B0A0A] hover:bg-[#AE020B] text-white font-bold rounded-xl transition-all text-center shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductEnquiryModal;
