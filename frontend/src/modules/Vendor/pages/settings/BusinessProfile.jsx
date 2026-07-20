import { useState, useEffect } from 'react';
import { FiSave, FiFileText, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getVendorBusinessProfile, updateVendorBusinessProfile, uploadGstCertificate, uploadMsmeCertificate, uploadIdentityProof } from '../../services/vendorService';
import toast from 'react-hot-toast';

const BusinessProfile = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [profile, setProfile] = useState({
        businessType: 'Other',
        gstRegistered: false,
        businessName: '',
        tradeName: '',
        gstNumber: '',
        panNumber: '',
        gstCertificate: '',
        msmeCertificate: '',
        ownerName: '',
        businessAddress: '',
        city: '',
        state: '',
        pincode: '',
        identityProof: '',
        verificationStatus: 'Unsubmitted',
        verificationRemark: ''
    });

    const [files, setFiles] = useState({
        gst: null,
        msme: null,
        identity: null
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await getVendorBusinessProfile();
            const data = res?.data ?? res;
            if (data) {
                setProfile({
                    businessType: data.businessType || 'Other',
                    gstRegistered: data.gstRegistered || false,
                    businessName: data.businessName || '',
                    tradeName: data.tradeName || '',
                    gstNumber: data.gstNumber || '',
                    panNumber: data.panNumber || '',
                    gstCertificate: data.gstCertificate || '',
                    msmeCertificate: data.msmeCertificate || '',
                    ownerName: data.ownerName || '',
                    businessAddress: data.businessAddress || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    identityProof: data.identityProof || '',
                    verificationStatus: data.verificationStatus || 'Unsubmitted',
                    verificationRemark: data.verificationRemark || ''
                });
            }
        } catch (err) {
            console.error('Error fetching business profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowed.includes(file.type)) {
                toast.error('Only PDF, JPG, JPEG, and PNG files are allowed.');
                return;
            }
            setFiles((prev) => ({ ...prev, [key]: file }));
        }
    };

    const handleUpload = async (key) => {
        const file = files[key];
        if (!file) {
            toast.error('Please select a file to upload first.');
            return;
        }

        const toastId = toast.loading('Uploading document...');
        try {
            let res;
            if (key === 'gst') {
                res = await uploadGstCertificate(file);
            } else if (key === 'msme') {
                res = await uploadMsmeCertificate(file);
            } else if (key === 'identity') {
                res = await uploadIdentityProof(file);
            }

            const data = res?.data ?? res;
            toast.success('Document uploaded successfully!', { id: toastId });
            
            // Update profile file url in state
            setProfile((prev) => ({
                ...prev,
                [`${key}Certificate`]: data[`${key}Certificate`] || prev[`${key}Certificate`],
                identityProof: data.identityProof || prev.identityProof,
                verificationStatus: data.verificationStatus || prev.verificationStatus
            }));
            
            // Clear local file selection state
            setFiles((prev) => ({ ...prev, [key]: null }));
        } catch (err) {
            toast.error(err.message || 'Upload failed', { id: toastId });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Client validation
        if (profile.gstRegistered) {
            if (!profile.businessName || !profile.gstNumber || !profile.panNumber) {
                toast.error('Please fill in Business Legal Name, GST Number, and PAN.');
                setSubmitting(false);
                return;
            }
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!gstRegex.test(profile.gstNumber.trim().toUpperCase())) {
                toast.error('Invalid GST Number format.');
                setSubmitting(false);
                return;
            }
        } else {
            if (!profile.businessName || !profile.ownerName) {
                toast.error('Please fill in Business Name and Owner Name.');
                setSubmitting(false);
                return;
            }
        }

        try {
            const res = await updateVendorBusinessProfile(profile);
            const data = res?.data ?? res;
            toast.success('Business Profile updated successfully!');
            setProfile((prev) => ({
                ...prev,
                verificationStatus: data.verificationStatus || prev.verificationStatus
            }));
        } catch {
            // Error toast is shown by api.js interceptor
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const renderVerificationBadge = () => {
        switch (profile.verificationStatus) {
            case 'Approved':
                return (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                        <FiCheckCircle className="text-xl shrink-0" />
                        <div>
                            <span className="font-semibold text-sm">Verification Status: Approved</span>
                            <p className="text-xs text-green-700 mt-0.5">Your business documents have been verified. You have full system access.</p>
                        </div>
                    </div>
                );
            case 'Pending':
                return (
                    <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
                        <FiAlertCircle className="text-xl shrink-0 animate-pulse" />
                        <div>
                            <span className="font-semibold text-sm">Verification Status: Pending</span>
                            <p className="text-xs text-yellow-700 mt-0.5">Your application is currently being reviewed by our compliance team.</p>
                        </div>
                    </div>
                );
            case 'Rejected':
                return (
                    <div className="flex flex-col gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                        <div className="flex items-center gap-2">
                            <FiXCircle className="text-xl shrink-0" />
                            <span className="font-semibold text-sm">Verification Status: Rejected</span>
                        </div>
                        {profile.verificationRemark && (
                            <p className="text-xs text-red-700 mt-0.5"><strong>Remarks:</strong> {profile.verificationRemark}</p>
                        )}
                        <p className="text-xs text-red-600">Please review, make corrections, and re-upload/update details to resubmit.</p>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">
                        <FiAlertCircle className="text-xl shrink-0" />
                        <div>
                            <span className="font-semibold text-sm">Verification Status: Unsubmitted</span>
                            <p className="text-xs text-gray-700 mt-0.5">Please fill in details and upload documents to verify your business.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {renderVerificationBadge()}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Business Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                            <select
                                name="businessType"
                                value={profile.businessType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 bg-white"
                            >
                                <option value="Home Business">Home Business</option>
                                <option value="Small Business">Small Business</option>
                                <option value="MSME">MSME</option>
                                <option value="Startup">Startup</option>
                                <option value="Proprietorship">Proprietorship</option>
                                <option value="Partnership">Partnership</option>
                                <option value="LLP">LLP</option>
                                <option value="Private Limited">Private Limited</option>
                                <option value="Public Limited">Public Limited</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="gstRegistered"
                                    checked={profile.gstRegistered}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                                <span className="text-sm font-semibold text-gray-700">Are you GST Registered?</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {profile.gstRegistered ? 'Business Legal Name' : 'Business Name'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                value={profile.businessName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                            />
                        </div>

                        {profile.gstRegistered ? (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Trade Name</label>
                                    <input
                                        type="text"
                                        name="tradeName"
                                        value={profile.tradeName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={profile.gstNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. 07AAAAA1111A1Z1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder:text-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="panNumber"
                                        value={profile.panNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={profile.ownerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                            <input
                                type="text"
                                name="businessAddress"
                                value={profile.businessAddress}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={profile.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                            <input
                                type="text"
                                name="state"
                                value={profile.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={profile.pincode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
                        >
                            <FiSave />
                            {submitting ? 'Saving...' : 'Save Profile Details'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Documents Upload</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.gstRegistered ? (
                        <>
                            {/* GST Certificate */}
                            <div className="border rounded-xl p-4 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                                        <FiFileText className="text-purple-600 text-lg" />
                                        GST Certificate <span className="text-red-500">*</span>
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Upload your registered GST certificate (PDF, JPG, PNG).</p>
                                    {profile.gstCertificate && (
                                        <a
                                            href={profile.gstCertificate}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-purple-600 underline font-semibold mt-2 inline-block"
                                        >
                                            View Uploaded Certificate
                                        </a>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="file"
                                        id="gst-file"
                                        onChange={(e) => handleFileChange(e, 'gst')}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="gst-file"
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-semibold cursor-pointer text-gray-700 bg-white"
                                    >
                                        <FiUploadCloud />
                                        {files.gst ? files.gst.name.slice(0, 15) + '...' : 'Choose File'}
                                    </label>
                                    {files.gst && (
                                        <button
                                            onClick={() => handleUpload('gst')}
                                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* MSME Certificate */}
                            <div className="border rounded-xl p-4 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                                        <FiFileText className="text-purple-600 text-lg" />
                                        MSME Certificate (Optional)
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">Upload MSME registration certificate if available.</p>
                                    {profile.msmeCertificate && (
                                        <a
                                            href={profile.msmeCertificate}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-purple-600 underline font-semibold mt-2 inline-block"
                                        >
                                            View Uploaded Certificate
                                        </a>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="file"
                                        id="msme-file"
                                        onChange={(e) => handleFileChange(e, 'msme')}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="msme-file"
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-semibold cursor-pointer text-gray-700 bg-white"
                                    >
                                        <FiUploadCloud />
                                        {files.msme ? files.msme.name.slice(0, 15) + '...' : 'Choose File'}
                                    </label>
                                    {files.msme && (
                                        <button
                                            onClick={() => handleUpload('msme')}
                                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Identity Proof */
                        <div className="border rounded-xl p-4 flex flex-col justify-between md:col-span-2">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                                    <FiFileText className="text-purple-600 text-lg" />
                                    Identity Proof Upload <span className="text-red-500">*</span>
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">Upload Aadhaar, Passport, or PAN card copy (PDF, JPG, PNG).</p>
                                {profile.identityProof && (
                                    <a
                                        href={profile.identityProof}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-purple-600 underline font-semibold mt-2 inline-block"
                                    >
                                        View Uploaded Identity Proof
                                    </a>
                                )}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="file"
                                    id="identity-file"
                                    onChange={(e) => handleFileChange(e, 'identity')}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="identity-file"
                                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-semibold cursor-pointer text-gray-700 bg-white"
                                >
                                    <FiUploadCloud />
                                    {files.identity ? files.identity.name.slice(0, 15) + '...' : 'Choose File'}
                                </label>
                                {files.identity && (
                                    <button
                                        onClick={() => handleUpload('identity')}
                                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
