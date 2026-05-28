import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiMail, FiCheckCircle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const B2BNotifyMe = ({ product, isBusiness = false }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      toast.success('You will be notified when this product is available!');
    }, 800);
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setEmail('');
    toast.success('Notification subscription removed');
  };

  if (!product || product.stock !== 'out_of_stock') return null;

  return (
    <div className={`rounded-xl p-4 border ${isBusiness ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'}`}>
      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isBusiness ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'}`}>
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className={`font-bold text-sm ${isBusiness ? 'text-primary-800' : 'text-gray-800'}`}>
              You're on the notification list!
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              We'll email you at <span className="font-semibold">{email}</span> when stock is available.
            </p>
          </div>
          <button
            onClick={handleUnsubscribe}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
            title="Unsubscribe"
          >
            <FiX className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isBusiness ? 'bg-primary-100 text-primary-600' : 'bg-orange-100 text-orange-600'}`}>
              <FiBell className="w-5 h-5" />
            </div>
            <div>
              <p className={`font-bold text-sm ${isBusiness ? 'text-primary-800' : 'text-gray-800'}`}>
                {isBusiness ? 'Bulk Stock Notification' : 'Notify Me When Available'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isBusiness 
                  ? 'Get notified when bulk stock becomes available for this product.'
                  : 'Enter your email and we\'ll notify you when this product is back in stock.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <div className="flex-1 relative">
              <FiMail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isBusiness ? 'text-primary-400' : 'text-gray-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 transition-all ${
                  isBusiness 
                    ? 'border-primary-200 focus:border-primary-500 focus:ring-primary-200 bg-white' 
                    : 'border-gray-300 focus:border-gray-500 focus:ring-gray-200 bg-white'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 ${
                isBusiness 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              {isSubmitting ? (
                <span>...</span>
              ) : (
                <>
                  <FiBell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notify Me</span>
                  <span className="sm:hidden">Notify</span>
                </>
              )}
            </button>
          </form>

          {isBusiness && (
            <div className="mt-3 pt-3 border-t border-primary-200">
              <p className="text-[10px] text-primary-700 font-medium">
                💡 Business buyers can also use the "Request Stock" button for urgent bulk requirements.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default B2BNotifyMe;
