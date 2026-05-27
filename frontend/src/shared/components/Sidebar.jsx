import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiShoppingBag, FiSettings, FiLogOut } from 'react-icons/fi';

/**
 * Reusable slide‑in sidebar.
 * Props:
 *   isOpen: boolean – controls visibility
 *   onClose: () => void – called when backdrop or close button clicked
 *   user: object (optional) – user data for avatar/name display
 *   onLogout: () => void – logout handler
 */
const Sidebar = ({ isOpen, onClose, user, onLogout }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        {/* Sidebar panel */}
        <motion.div
          className="relative w-64 h-full bg-white dark:bg-gray-800 shadow-lg p-4"
          initial={{ x: '-100%' }}
          animate={{ x: 0, transition: { duration: 0.3 } }}
          exit={{ x: '-100%', transition: { duration: 0.3 } }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
            aria-label="Close sidebar"
          >
            <FiX size={24} />
          </button>
          {user && (
            <div className="flex items-center gap-2 mb-6">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300" />
              )}
              <span className="font-medium text-gray-800 dark:text-gray-200">{user.name || 'User'}</span>
            </div>
          )}
          <nav className="space-y-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
            >
              <FiUser />
              Profile
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
            >
              <FiShoppingBag />
              Orders
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600"
            >
              <FiSettings />
              Settings
            </Link>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 text-red-600 hover:text-red-700"
            >
              <FiLogOut />
              Logout
            </button>
          </nav>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Sidebar;
