import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFile, FiDownload, FiUploadCloud, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useB2BAdminStore } from '../store/b2bAdminStore';

const LegalDocuments = () => {
  const { companyProfile, fetchCompanyProfile, uploadCompanyLegalDocument, isLoading } = useB2BAdminStore();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, [fetchCompanyProfile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadCompanyLegalDocument(file);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const doc = companyProfile?.acceptanceExecutionDocument;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiFile className="text-[#D71920]" />
          Legal & Agreement Documents
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          View, download, or replace your company's registered legal agreement documents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Current Document Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Registered Document</h2>

            {doc?.url ? (
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50 flex items-start gap-4">
                <div className="p-3 bg-red-50 text-[#D71920] rounded-xl flex-shrink-0">
                  <FiFile className="text-3xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate" title={doc.fileName}>
                    {doc.fileName || 'agreement_document.pdf'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {formatBytes(doc.size)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : 'N/A'}
                  </p>

                  <div className="flex items-center gap-1.5 mt-3 text-emerald-600">
                    <FiCheckCircle className="text-sm flex-shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Legal Document</span>
                  </div>
                </div>

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-white transition-all shadow-sm font-semibold text-sm flex-shrink-0"
                >
                  <FiDownload />
                  <span>Download</span>
                </a>
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                <FiAlertCircle className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">No registered legal documents found.</p>
                <p className="text-xs text-gray-400 mt-1">Please upload your agreement document using the panel on the right.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Upload / Replace Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {doc?.url ? 'Replace Document' : 'Upload Document'}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Upload a PDF or image document (max 10MB).
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#D71920] transition-colors relative bg-gray-50/20">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <FiUploadCloud className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-xs font-semibold text-gray-700">
                  {file ? file.name : 'Click or Drag file to upload'}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">PDF, PNG, JPG up to 10MB</p>
              </div>

              {file && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
                  <span className="truncate flex-1 pr-2 font-medium">{file.name}</span>
                  <span className="font-semibold text-gray-700 flex-shrink-0">{formatBytes(file.size)}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || isLoading || isUploading}
                className="w-full py-2.5 bg-[#D71920] text-white rounded-lg hover:bg-[#B51218] transition-all font-semibold shadow-md shadow-red-600/10 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(isLoading || isUploading) && (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                )}
                <span>{doc?.url ? 'Replace Document' : 'Upload Document'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LegalDocuments;
