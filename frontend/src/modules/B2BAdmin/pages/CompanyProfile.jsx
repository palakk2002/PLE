import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useB2BAdminStore } from '../store/b2bAdminStore';

const COMPANY_TYPES = [
  'Proprietorship',
  'Partnership Firm',
  'LLP (Limited Liability Partnership)',
  'Private Limited Company',
  'Public Limited Company',
  'One Person Company (OPC)',
  'Other'
];

const CompanyProfile = () => {
  const { companyProfile, fetchCompanyProfile, updateCompanyProfile, isLoading } = useB2BAdminStore();
  const [formData, setFormData] = useState({
    companyName: '',
    businessEmail: '',
    businessPhone: '',
    companyAddress: '',
    website: '',
    gstNumber: '',
    companyType: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
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
        website: companyProfile.website || '',
        gstNumber: companyProfile.gstNumber || '',
        companyType: companyProfile.companyType || '',
        adminName: companyProfile.admin?.name || '',
        adminEmail: companyProfile.admin?.email || '',
        adminPhone: companyProfile.admin?.phone || '',
      });
    }
  }, [companyProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCompanyProfile({
      businessPhone: formData.businessPhone,
      companyAddress: formData.companyAddress,
      website: formData.website,
      companyType: formData.companyType
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'Pending Verification':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Pending Verification</span>;
      case 'Rejected':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'Suspended':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Suspended</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status || 'N/A'}</span>;
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company Profile</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your company's information and settings.</p>
        </div>
        {companyProfile && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Status:</span>
            {getStatusBadge(companyProfile.verificationStatus)}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Company General Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" disabled value={formData.companyName} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Contact Super Admin to change company name.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input type="text" disabled value={formData.gstNumber} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed uppercase font-mono" />
              <p className="text-xs text-gray-500 mt-1">GST number cannot be edited after registration.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
              <select 
                value={formData.companyType} 
                onChange={(e) => setFormData({...formData, companyType: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none bg-white"
              >
                <option value="">Select Company Type</option>
                {COMPANY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="text" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none" placeholder="https://" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
              <input type="email" disabled value={formData.businessEmail} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">Business email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input type="text" value={formData.businessPhone} onChange={(e) => setFormData({...formData, businessPhone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <textarea rows="3" value={formData.companyAddress} onChange={(e) => setFormData({...formData, companyAddress: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D71920] outline-none"></textarea>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Company Admin Details</h2>
              <p className="text-xs text-gray-500 mt-1">These details were provided during registration for the super administrator of your company account.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                <input type="text" disabled value={formData.adminName} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input type="email" disabled value={formData.adminEmail} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Phone</label>
                <input type="text" disabled value={formData.adminPhone} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
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

export default CompanyProfile;
