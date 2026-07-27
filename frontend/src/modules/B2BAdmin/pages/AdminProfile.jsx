import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useB2BAdminStore } from '../store/b2bAdminStore';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const AdminProfile = () => {
  const { adminProfile, fetchAdminProfile, updateAdminProfile, isLoading } = useB2BAdminStore();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    newPassword: '',
    secretKey: ''
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
        newPassword: '',
        secretKey: ''
      }));
    }
  }, [adminProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.secretKey) {
      toast.error('Company Owner Secret Key is required to save changes.');
      return;
    }
    const updateData = {
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPhone: formData.adminPhone,
      secretKey: formData.secretKey
    };
    if (formData.newPassword) {
      updateData.newPassword = formData.newPassword;
    }
    const success = await updateAdminProfile(updateData);
    if (success) {
      setFormData(prev => ({ ...prev, newPassword: '', secretKey: '' }));
      setShowSecretKey(false);
      setShowNewPassword(false);
      toast.success('Profile updated successfully.');
      fetchAdminProfile();
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
              <input type="email" value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Phone</label>
              <input type="text" value={formData.adminPhone} onChange={e => setFormData({...formData, adminPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password (optional)" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none pr-10" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 bg-red-50/50 p-4 rounded-xl border border-red-100">
            <h3 className="text-lg font-medium text-red-800 mb-2">Company Owner Verification</h3>
            <p className="text-xs text-red-600 mb-4">To update admin profile, email, or credentials, you must enter the original <strong>Company Owner Secret Key</strong> created during registration.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Secret Key *</label>
                <div className="relative">
                  <input type={showSecretKey ? 'text' : 'password'} placeholder="Enter Owner Secret Key" value={formData.secretKey} onChange={e => setFormData({...formData, secretKey: e.target.value})} className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none pr-10" />
                  <button type="button" onClick={() => setShowSecretKey(!showSecretKey)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {showSecretKey ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#D71920] text-white rounded-lg hover:bg-[#B51218] font-medium disabled:opacity-50 flex items-center">
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

