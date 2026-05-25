import React from 'react';
import { useBusinessBuyer } from '../../hooks/useBusinessBuyer';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase } from 'react-icons/fi';

export const B2BAccountTypeSwitcher = () => {
  const { userRole, setUserRole } = useBusinessBuyer();

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
        Select Account Type
      </label>
      <div className="flex bg-gray-100 rounded-xl p-1 relative z-0">
        <button
          type="button"
          onClick={() => setUserRole('customer')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
            userRole === 'customer'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiUser className="w-4 h-4" />
          <span>Individual (B2C)</span>
          {userRole === 'customer' && (
            <motion.div
              layoutId="activeRoleTab"
              className="absolute inset-0 bg-primary-500 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setUserRole('business_buyer')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
            userRole === 'business_buyer'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FiBriefcase className="w-4 h-4" />
          <span>Business (B2B)</span>
          {userRole === 'business_buyer' && (
            <motion.div
              layoutId="activeRoleTab"
              className="absolute inset-0 bg-primary-500 rounded-lg -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>
      {userRole === 'business_buyer' && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-primary-600 font-medium text-center mt-2"
        >
          ✨ Business mode: unlock wholesale prices, tier discounts, MOQ, GST credit, and credit terms.
        </motion.p>
      )}
    </div>
  );
};
