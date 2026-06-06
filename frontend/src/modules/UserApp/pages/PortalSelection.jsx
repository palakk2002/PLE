import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiGlobe, FiCheckCircle } from 'react-icons/fi';
import { useB2bStore } from '../../../shared/store/b2bStore';
import pleLogo from '../../../assets/PLEwhite.png';

const PortalSelection = () => {
  const navigate = useNavigate();
  const setUserRole = useB2bStore((state) => state.setUserRole);

  const handleSelectB2C = () => {
    setUserRole('customer');
    navigate('/login');
  };

  const handleSelectB2B = () => {
    setUserRole('business_buyer');
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative flex flex-col md:flex-row items-stretch justify-center">
      {/* Left Panel: Retail Store (B2C) */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, duration: 0.8 }}
        className="flex-1 flex flex-col justify-between p-8 md:p-16 bg-white relative z-10"
      >
        <div className="my-auto max-w-lg mx-auto w-full space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-4">
              Retail Store
            </h1>
            <p className="text-gray-600 text-base leading-relaxed md:text-lg">
              Direct purchase for components, peripherals, and high-end prebuilt systems with instant delivery tracking.
            </p>
          </div>

          {/* Quick Specs Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-red-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-3">
                <FiUser size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm tracking-wide">PC BUILDER</span>
              <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">CUSTOM DRAG & DROP</span>
            </div>

            <div className="border border-red-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-3">
                <FiGlobe size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm tracking-wide">SPECIAL REQ</span>
              <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">PRODUCT SOURCING</span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSelectB2C}
            className="w-full bg-[#AE020B] hover:bg-[#8d0208] text-white py-4 rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 hover:shadow-xl transform active:scale-[0.98]"
          >
            ENTER PORTAL
          </button>
        </div>
      </motion.div>

      {/* Center Divider & Logo Overlay */}
      <div className="hidden md:flex flex-col items-center justify-center absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 12 }}
          className="bg-white rounded-full p-4 shadow-lg border border-gray-100 pointer-events-auto"
        >
          <img
            src={pleLogo}
            alt="PLE Logo"
            className="w-20 h-20 rounded-full object-cover border-2 border-red-600"
          />
        </motion.div>
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-[2px] bg-red-100 flex-1 origin-top mt-4"
        />
      </div>

      {/* Right Panel: Enterprise (B2B) */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 15, duration: 0.8 }}
        className="flex-1 flex flex-col justify-between p-8 md:p-16 bg-white border-t md:border-t-0 md:border-l border-gray-100 relative z-10"
      >
        <div className="my-auto max-w-lg mx-auto w-full space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-4">
              Enterprise
            </h1>
            <p className="text-gray-600 text-base leading-relaxed md:text-lg">
              Enquiry-based procurement, bulk quotations, and GST-compliant enterprise logistics management.
            </p>
          </div>

          {/* Features Checklist Panel */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-red-600 flex-shrink-0" size={20} />
              <span className="font-bold text-gray-700 text-xs md:text-sm uppercase tracking-wider">
                GST VALIDATION REQUIRED
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-red-600 flex-shrink-0" size={20} />
              <span className="font-bold text-gray-700 text-xs md:text-sm uppercase tracking-wider">
                RFQ SYSTEM INTEGRATION
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-red-600 flex-shrink-0" size={20} />
              <span className="font-bold text-gray-700 text-xs md:text-sm uppercase tracking-wider">
                BULK PRICING ENGINE
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSelectB2B}
            className="w-full bg-[#AE020B] hover:bg-[#8d0208] text-white py-4 rounded-xl font-bold tracking-widest text-sm uppercase transition-all duration-300 hover:shadow-xl transform active:scale-[0.98]"
          >
            BUSINESS ONBOARDING
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalSelection;
