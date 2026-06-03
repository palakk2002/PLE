import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../shared/store/authStore';
import { isValidEmail, isValidPhone } from '../../../shared/utils/helpers';
import toast from 'react-hot-toast';
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from '../../../shared/components/PageTransition';
import { B2BAccountTypeSwitcher } from '../components/B2B/B2BAccountTypeSwitcher';
import { useBusinessBuyer } from '../hooks/useBusinessBuyer';

const MobileRegister = () => {
  const navigate = useNavigate();
  const { register: registerUser, registerB2B, isLoading } = useAuthStore();
  const { isBusiness } = useBusinessBuyer();
  const [showPassword, setShowPassword] = useState(false);
  const [formMode, setFormMode] = useState('signup'); // 'signup' or 'login'

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const handleModeChange = (mode) => {
    setFormMode(mode);
    if (mode === 'login') {
      navigate('/login');
    }
  };

  const onSubmit = async (data) => {
    try {
      // Combine first name and last name
      const fullName = `${data.firstName} ${data.lastName}`;
      // Backend stores a normalized 10-digit phone value.
      const phone = data.phone;

      if (isBusiness) {
        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phone', phone);
        formData.append('companyName', data.companyName);
        formData.append('businessType', data.businessType);
        formData.append('gstNumber', data.gstNumber);
        formData.append('businessAddress', data.businessAddress);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('pincode', data.pincode);
        formData.append('yearsInBusiness', data.yearsInBusiness || '');
        formData.append('monthlyPurchaseVolume', data.monthlyPurchaseVolume || '');
        
        if (data.gstCertificate && data.gstCertificate[0]) {
          formData.append('gstCertificate', data.gstCertificate[0]);
        } else {
          toast.error('GST Certificate file is required.');
          return;
        }

        await registerB2B(formData);
      } else {
        await registerUser(fullName, data.email, data.password, phone);
      }
      
      toast.success('Registration successful!');
      // Navigate to verification page
      navigate('/verification', { state: { email: data.email } });
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={false}>
        <div className="w-full min-h-screen flex items-start justify-center px-4 pt-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm relative">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-6 top-6 text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-full"
                title="Go Back"
              >
                <FiArrowLeft className="text-xl" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Get Started Now</h1>
                <p className="text-sm text-gray-600">Create an account or log in to explore about our app</p>
              </div>

              {/* Sign Up / Log In Toggle */}
              <div className="mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${formMode === 'signup'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${formMode === 'login'
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Log In
                  </button>
                </div>
              </div>

              {/* B2B Role Switcher */}
              <B2BAccountTypeSwitcher />

              {/* Register Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'First name must be at least 2 characters',
                        },
                      })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.firstName
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary-500'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="Raj"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Last name must be at least 2 characters',
                        },
                      })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.lastName
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary-500'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="Sarkar"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        validate: (value) =>
                          isValidEmail(value) || 'Please enter a valid email',
                      })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary-500'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="sarkarraj0766@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      {...register('countryCode', { required: true })}
                      className="w-24 px-3 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm"
                    >
                      <option value="+880">+880</option>
                      <option value="+1">+1</option>
                      <option value="+91">+91</option>
                      <option value="+44">+44</option>
                    </select>
                    <div className="relative flex-1">
                      <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                          validate: (value) =>
                            isValidPhone(value) || 'Please enter a valid phone number',
                        })}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.phone
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-200 focus:border-primary-500'
                          } focus:outline-none transition-colors text-base`}
                        placeholder="4547260592"
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* B2B Business Fields */}
                {isBusiness && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-5"
                  >
                    <div className="border-t border-gray-100 my-6 pt-4">
                      <h3 className="text-sm font-extrabold text-primary-600 uppercase tracking-wider mb-2">Business Information</h3>
                      <p className="text-xs text-gray-500">Provide registration details to verify your wholesale buyer status.</p>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        {...register('companyName', { required: isBusiness ? 'Company name is required' : false })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.companyName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                        placeholder="Apex General Enterprises"
                      />
                      {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
                    </div>

                    {/* Business Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type *</label>
                      <select
                        {...register('businessType', { required: isBusiness ? 'Business type is required' : false })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.businessType ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base bg-white`}
                      >
                        <option value="">Select Business Type</option>
                        <option value="Retailer">Retailer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Reseller">Reseller</option>
                        <option value="Importer">Importer</option>
                        <option value="Exporter">Exporter</option>
                      </select>
                      {errors.businessType && <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>}
                    </div>

                    {/* GST Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number *</label>
                      <input
                        type="text"
                        {...register('gstNumber', {
                          required: isBusiness ? 'GST number is required' : false,
                          pattern: {
                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                            message: 'Please enter a valid Indian GSTIN format'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.gstNumber ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base font-mono uppercase`}
                        placeholder="27AAPCG9838F1Z1"
                      />
                      {errors.gstNumber && <p className="mt-1 text-sm text-red-600">{errors.gstNumber.message}</p>}
                    </div>

                    {/* GST Certificate Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">GST Certificate * (PDF, JPG, PNG)</label>
                      <input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        {...register('gstCertificate', { required: isBusiness ? 'GST Certificate is required' : false })}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 ${errors.gstCertificate ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-sm`}
                      />
                      {errors.gstCertificate && <p className="mt-1 text-sm text-red-600">{errors.gstCertificate.message}</p>}
                    </div>

                    {/* Business Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address *</label>
                      <textarea
                        rows={2}
                        {...register('businessAddress', { required: isBusiness ? 'Business address is required' : false })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.businessAddress ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                        placeholder="404 Business Hub, BKC"
                      />
                      {errors.businessAddress && <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>}
                    </div>

                    {/* City, State, Pincode in a grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          {...register('city', { required: isBusiness ? 'City is required' : false })}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${errors.city ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                          placeholder="Mumbai"
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          {...register('state', { required: isBusiness ? 'State is required' : false })}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${errors.state ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                          placeholder="Maharashtra"
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                      <input
                        type="text"
                        {...register('pincode', {
                          required: isBusiness ? 'Pincode is required' : false,
                          pattern: { value: /^[0-9]{6}$/, message: 'Pincode must be 6 digits' }
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.pincode ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                        placeholder="400051"
                      />
                      {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>}
                    </div>

                    {/* Years in Business & Monthly Purchase Volume */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Years In Business</label>
                        <input
                          type="number"
                          {...register('yearsInBusiness', { min: { value: 0, message: 'Invalid value' } })}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${errors.yearsInBusiness ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                          placeholder="5"
                        />
                        {errors.yearsInBusiness && <p className="mt-1 text-sm text-red-600">{errors.yearsInBusiness.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Purchase Vol.</label>
                        <input
                          type="text"
                          {...register('monthlyPurchaseVolume')}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${errors.monthlyPurchaseVolume ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:outline-none transition-colors text-base`}
                          placeholder="₹2,00,000"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Set Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 ${errors.password
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-primary-500'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Legal Disclosure */}
              <div className="mt-6 text-center text-xs text-gray-500 leading-relaxed px-4">
                By creating an account, you agree to our{' '}
                <Link
                  to="/terms-and-conditions"
                  className="text-[#7B0A0A] hover:text-[#AE020B] font-bold underline transition-colors"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy-policy"
                  className="text-[#7B0A0A] hover:text-[#AE020B] font-bold underline transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileRegister;
