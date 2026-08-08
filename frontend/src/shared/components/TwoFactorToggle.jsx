import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const TwoFactorToggle = ({ apiPrefix }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('idle'); // idle, password_prompt, otp_prompt
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [actionType, setActionType] = useState('enable'); // enable, disable

  // Fetch current 2FA status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get(`${apiPrefix}/2fa/status`);
        const data = response?.data || response;
        setIsEnabled(!!data.twoFactorEnabled);
      } catch (err) {
        console.error('Failed to fetch 2FA status:', err);
      }
    };
    fetchStatus();
  }, [apiPrefix]);

  const handleStartAction = (type) => {
    setActionType(type);
    setPassword('');
    setOtp('');
    setStep('password_prompt');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Password is required.');
      return;
    }

    setLoading(true);
    try {
      if (actionType === 'enable') {
        // Initiates 2FA setup and sends OTP
        await api.post(`${apiPrefix}/2fa/enable`, { password });
        toast.success('Verification code sent to your email.');
        setStep('otp_prompt');
      } else {
        // For disabling, we need OTP. Request OTP using the normal enable endpoint or we prompt for both password and OTP directly
        toast.success('Please enter your password and current 2FA code.');
        setStep('otp_prompt');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Password verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Verification code is required.');
      return;
    }

    setLoading(true);
    try {
      if (actionType === 'enable') {
        const response = await api.post(`${apiPrefix}/2fa/verify-enable`, { otp });
        const data = response?.data || response;
        setIsEnabled(true);
        toast.success('Two-factor authentication enabled successfully.');
      } else {
        const response = await api.post(`${apiPrefix}/2fa/disable`, { password, otp });
        const data = response?.data || response;
        setIsEnabled(false);
        toast.success('Two-factor authentication disabled successfully.');
      }
      setStep('idle');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-colors duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100">Two-Factor Authentication (2FA)</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Secure your account by requiring an additional email code on logins.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {step === 'idle' && (
        <button
          onClick={() => handleStartAction(isEnabled ? 'disable' : 'enable')}
          className={`py-2.5 px-5 font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all ${isEnabled ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
        >
          {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      )}

      {step === 'password_prompt' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setStep('idle')}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-250 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 font-medium rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {step === 'otp_prompt' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit verification code"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white text-center font-bold tracking-widest text-lg"
              maxLength={6}
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm disabled:opacity-50"
            >
              Verify & Submit
            </button>
            <button
              type="button"
              onClick={() => setStep('idle')}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-250 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 font-medium rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TwoFactorToggle;
