import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../shared/store/authStore';
import { useCartStore } from '../../../shared/store/useStore';
import { useWishlistStore } from '../../../shared/store/wishlistStore';
import {
  clearPostLoginRedirect,
  consumePostLoginAction,
  getPostLoginRedirect,
} from '../../../shared/utils/postLoginAction';
import { isValidEmail } from '../../../shared/utils/helpers';
import toast from 'react-hot-toast';
import MobileLayout from '../components/Layout/MobileLayout';
import PageTransition from '../../../shared/components/PageTransition';
import { B2BAccountTypeSwitcher } from '../components/B2B/B2BAccountTypeSwitcher';
import { useBusinessBuyer } from '../hooks/useBusinessBuyer';

const MobileLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const { isBusiness } = useBusinessBuyer();

  // Auto-redirect when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const storedFrom = getPostLoginRedirect();
  const from = location.state?.from?.pathname || storedFrom || '/home';

  const replayPendingAction = () => {
    const action = consumePostLoginAction();
    if (!action?.type) return;

    if (action.type === 'cart:add' && action.payload) {
      useCartStore.getState().addItem(action.payload);
      return;
    }

    if (action.type === 'wishlist:add' && action.payload) {
      useWishlistStore.getState().addItem(action.payload);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Login submit start', data);
      await login(data.email, data.password, rememberMe);
      console.log('Login successful, navigating to home');
      replayPendingAction();
      toast.success('Login successful!');
      clearPostLoginRedirect();
      navigate('/home', { replace: true });
    } catch (error) {
      const backendMessage = String(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        ''
      );
      const message = String(error?.message || '');
      const normalized = `${backendMessage} ${message}`.toLowerCase();

      if (
        normalized.includes('email not verified') ||
        normalized.includes('verify your email')
      ) {
        navigate('/verification', {
          state: { email: String(data.email || '').trim().toLowerCase() },
          replace: true,
        });
        return;
      }
      toast.error(error.message || 'Login failed. Please try again.');
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-sm text-gray-600">Login to access your account</p>
              </div>

              {/* B2B Info Message */}
              {isBusiness && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                  <p className="text-xs text-[#AE020B] font-bold">
                    ✨ Business mode: unlock wholesale prices, tier discounts, MOQ, GST credit, and credit terms.
                  </p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        validate: (value) =>
                          !value || isValidEmail(value) || 'Please enter a valid email',
                      })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#AE020B]'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
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
                          : 'border-gray-200 focus:border-[#AE020B]'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="Enter your password"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#AE020B] border-gray-300 rounded focus:ring-[#AE020B]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#AE020B] hover:text-[#8d0208] font-medium"
                  >
                    Forget password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#AE020B] hover:bg-[#8d0208] text-white py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-[#AE020B] hover:text-[#8d0208] font-semibold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* Legal Disclosure */}
              <div className="mt-6 text-center text-xs text-gray-500 leading-relaxed px-4">
                By continuing, you agree to our{' '}
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

export default MobileLogin;
