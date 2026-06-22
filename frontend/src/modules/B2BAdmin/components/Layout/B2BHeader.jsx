import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { useB2BAdminStore } from '../../store/b2bAdminStore';

const B2BHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { adminProfile, fetchAdminProfile, unreadNotificationsCount, fetchNotifications } = useB2BAdminStore();

  useEffect(() => {
    if (!adminProfile) {
      fetchAdminProfile();
    }
    fetchNotifications(1);
  }, [adminProfile, fetchAdminProfile, fetchNotifications]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-64 lg:w-96">
          <FiSearch className="text-gray-400 w-4 h-4 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/b2b-dashboard/notifications')}
          className="text-gray-500 hover:text-gray-700 relative p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiBell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
            {adminProfile?.adminName?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-gray-700 leading-tight">{adminProfile?.adminName || 'Admin'}</p>
            <p className="text-gray-500 text-xs">
              {adminProfile?.isEmployee || adminProfile?.role === 'b2bEmployee' ? 'B2B Employee' : 'B2B Admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default B2BHeader;
