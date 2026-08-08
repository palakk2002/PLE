import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiDownload, FiUploadCloud, FiAlertCircle, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useVendorAuthStore } from '../store/vendorAuthStore';
import {
  uploadGstCertificate,
  uploadMsmeCertificate,
  uploadIdentityProof,
  uploadRegistrationProof,
  uploadPartnershipAgreement,
  getVendorProfile
} from '../services/vendorService';
import toast from 'react-hot-toast';
import api from '../../../shared/utils/api';

const VendorLegalDocuments = () => {
  const { vendor, setVendor } = useVendorAuthStore();
  const [uploadingField, setUploadingField] = useState(null);
  const [generalSettings, setGeneralSettings] = useState(null);

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        const res = await api.get('/settings/general');
        if (res?.data) {
          setGeneralSettings(res.data);
        }
      } catch (err) {
        console.error("Failed to load general settings:", err);
      }
    };
    fetchGeneralSettings();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getVendorProfile();
        const freshVendor = res?.data?.data || res?.data || res;
        if (freshVendor) {
          setVendor(freshVendor);
        }
      } catch (error) {
        console.error('Failed to fetch fresh vendor profile:', error);
      }
    };
    fetchProfile();
  }, [setVendor]);

  const documentTypes = [
    {
      key: 'gstCertificate',
      name: 'GST Certificate',
      description: 'Business GST registration certificate (GSTIN document)',
      url: vendor?.gstCertificate,
      uploadFn: uploadGstCertificate,
      required: vendor?.gstRegistered
    },
    {
      key: 'msmeCertificate',
      name: 'MSME Certificate',
      description: 'Micro, Small & Medium Enterprises certificate (if applicable)',
      url: vendor?.msmeCertificate,
      uploadFn: uploadMsmeCertificate,
      required: vendor?.businessType === 'MSME'
    },
    {
      key: 'identityProof',
      name: 'Identity Proof',
      description: 'Government issued ID (Aadhar Card, PAN Card, passport)',
      url: vendor?.identityProof,
      uploadFn: uploadIdentityProof,
      required: true
    },
    {
      key: 'registrationProofUrl',
      name: 'Business Registration Proof',
      description: 'Shop establishment, partnership deed or incorporation certificate',
      url: vendor?.registrationProofUrl,
      fileName: vendor?.registrationProofName,
      uploadFn: uploadRegistrationProof,
      required: true
    },
    {
      key: 'partnershipAgreementUrl',
      name: 'Partnership Agreement',
      description: 'Signed & sealed partnership agreement document',
      url: vendor?.partnershipAgreementUrl,
      fileName: vendor?.partnershipAgreementName,
      uploadFn: uploadPartnershipAgreement,
      required: generalSettings?.partnershipAgreementRequiredTypes?.includes(vendor?.businessType) || vendor?.businessType === 'Partnership'
    }
  ];

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    setUploadingField(docType.key);
    const loadingToast = toast.loading(`Uploading ${docType.name}...`);

    try {
      const res = await docType.uploadFn(file);
      const data = res?.data?.data || res?.data || res;
      
      // Update the vendor store state with the new document URL and status
      const updatedVendor = { ...vendor };
      if (docType.key === 'registrationProofUrl') {
        updatedVendor.registrationProofUrl = data.registrationProofUrl;
        updatedVendor.registrationProofName = data.registrationProofName;
      } else if (docType.key === 'partnershipAgreementUrl') {
        updatedVendor.partnershipAgreementUrl = data.partnershipAgreementUrl;
        updatedVendor.partnershipAgreementName = data.partnershipAgreementName;
      } else {
        updatedVendor[docType.key] = data[docType.key];
      }
      if (data.verificationStatus) {
        updatedVendor.verificationStatus = data.verificationStatus;
      }
      
      setVendor(updatedVendor);
      toast.success(`${docType.name} updated successfully.`, { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || `Failed to upload ${docType.name}.`, { id: loadingToast });
    } finally {
      setUploadingField(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <FiCheckCircle className="text-xs" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <FiClock className="text-xs" /> Pending Verification
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-100">
            <FiXCircle className="text-xs" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-50 text-gray-700 border border-gray-100">
            <FiAlertCircle className="text-xs" /> Unsubmitted
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiFile className="text-primary-600" />
            Legal & Registration Documents
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your legal registration certificates and identity proofs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-500">Account Status:</span>
          {getStatusBadge(vendor?.verificationStatus)}
        </div>
      </div>

      {vendor?.verificationRemark && vendor?.verificationStatus === 'Rejected' && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 items-start text-rose-800 text-sm">
          <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Verification Reject Remark:</span> {vendor.verificationRemark}
          </div>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((doc) => {
          const isUploading = uploadingField === doc.key;

          // Skip if GST card and vendor not GST registered
          if (doc.key === 'gstCertificate' && !vendor?.gstRegistered) {
            return null;
          }

          return (
            <div
              key={doc.key}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    {doc.name}
                    {doc.required && (
                      <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </h3>
                  {doc.url && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4">{doc.description}</p>

                {doc.url ? (
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <FiFile className="text-2xl text-primary-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate max-w-[200px]" title={doc.fileName || 'document_file'}>
                          {doc.fileName || `${doc.name}.pdf`}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Click download to view</p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                      title="Download/View Document"
                    >
                      <FiDownload className="text-lg" />
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50 mb-4">
                    <FiAlertCircle className="mx-auto text-2xl text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500">No document uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Upload action */}
              <div className="relative mt-4">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileUpload(e, doc)}
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"></span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="text-lg" />
                      <span>{doc.url ? 'Replace Document' : 'Upload Document'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default VendorLegalDocuments;
