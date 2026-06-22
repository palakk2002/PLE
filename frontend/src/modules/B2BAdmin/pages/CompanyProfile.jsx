import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useB2BAdminStore } from '../store/b2bAdminStore';

const CompanyProfile = () => {
  const { companyProfile, fetchCompanyProfile, updateCompanyProfile, isLoading } = useB2BAdminStore();
  const [formData, setFormData] = useState({
    companyName: '',
    businessEmail: '',
    businessPhone: '',
    companyAddress: '',
    website: ''
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, [fetchCompanyProfile]);

  useEffect(() => {
    if (companyProfile) {
      setFormData({
        companyName: companyProfile.companyName || '',
        businessEmail: companyProfile.businessEmail || '',
        businessPhone: companyProfile.businessPhone || '',
        companyAddress: companyProfile.companyAddress || '',
        website: companyProfile.website || ''
      });
    }
  }, [companyProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCompanyProfile({
      businessPhone: formData.businessPhone,
      companyAddress: formData.companyAddress,
      website: formData.website
    });
  };

  if (isLoading && !companyProfile) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your company's information and settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" disabled value={formData.companyName} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Contact Super Admin to change company name.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
              <input type="email" disabled value={formData.businessEmail} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input type="text" value={formData.businessPhone} onChange={(e) => setFormData({...formData, businessPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="text" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <textarea rows="3" value={formData.companyAddress} onChange={(e) => setFormData({...formData, companyAddress: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
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

export default CompanyProfile;
