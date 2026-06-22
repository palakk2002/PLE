import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useB2BAdminStore } from '../store/b2bAdminStore';

const AdminProfile = () => {
  const { adminProfile, fetchAdminProfile, updateAdminProfile, isLoading } = useB2BAdminStore();
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  useEffect(() => {
    if (adminProfile) {
      setFormData(prev => ({
        ...prev,
        adminName: adminProfile.adminName || '',
        adminEmail: adminProfile.adminEmail || '',
        adminPhone: adminProfile.adminPhone || '',
        currentPassword: '',
        newPassword: ''
      }));
    }
  }, [adminProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      adminName: formData.adminName,
      adminPhone: formData.adminPhone,
    };
    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }
    const success = await updateAdminProfile(updateData);
    if (success) {
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    }
  };

  if (isLoading && !adminProfile) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your personal settings and credentials.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
              <input type="text" value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input type="email" disabled value={formData.adminEmail} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Phone</label>
              <input type="text" value={formData.adminPhone} onChange={e => setFormData({...formData, adminPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center">
              {isLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
