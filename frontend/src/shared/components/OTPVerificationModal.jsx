import React, { useState, useEffect, useRef } from 'react';
import { Shield, RefreshCw, X, CheckCircle, AlertTriangle } from 'lucide-react';

const OTPVerificationModal = ({ isOpen, onClose, email, onVerify, onResend }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setError('');
            setSuccess(false);
            setCooldown(30);
            setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        let timer;
        if (isOpen && cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown, isOpen]);

    if (!isOpen) return null;

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError('Please enter all 6 digits.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onVerify(otpString);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendClick = async () => {
        if (cooldown > 0) return;
        setError('');
        setIsLoading(true);
        try {
            await onResend();
            setCooldown(30);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Resend failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="relative w-full max-w-md scale-95 transform rounded-2xl bg-white p-8 shadow-2xl transition-all border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {success ? <CheckCircle size={32} className="animate-bounce" /> : <Shield size={32} />}
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {success ? 'Identity Verified!' : 'Verify Your Identity'}
                    </h3>
                    
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        {success 
                            ? 'Applying your profile changes...'
                            : `For security, we sent a 6-digit verification code to ${email ? email.replace(/(.{3})(.*)(@.*)/, '$1***$3') : 'your registered email'}.`
                        }
                    </p>

                    {error && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400 w-full text-left">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-6 flex justify-center gap-2" onPaste={handlePaste}>
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (inputRefs.current[idx] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-bold text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.join('').length < 6}
                                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-700 transition-all duration-200"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Save'}
                            </button>

                            <div className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Didn't receive code?</span>
                                <button
                                    type="button"
                                    onClick={handleResendClick}
                                    disabled={cooldown > 0 || isLoading}
                                    className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationModal;
