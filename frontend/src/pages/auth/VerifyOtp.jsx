import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePageTitle from '../../hooks/usePageTitle';

const VerifyOtp = () => {
  usePageTitle('Verify OTP');
  const navigate = useNavigate();
  const { verifyOtp, sendOtp, signupData, isLoading } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Redirect if no signup data
    if (!signupData) {
      navigate('/auth/signup');
      return;
    }

    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [signupData, navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      return;
    }

    try {
      await verifyOtp(otpString);
      navigate('/');
    } catch (error) {
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend || !signupData) return;

    try {
      await sendOtp(signupData);
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend error:', error);
    }
  };

  if (!signupData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
            <p className="text-gray-400 mt-2">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium text-emerald-400">{signupData.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:border-emerald-500 focus:outline-none"
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white disabled:bg-gray-600 disabled:border-gray-600"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Verifying...
                </>
              ) : (
                'Verify & Create Account'
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-400">Didn't receive the code?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                className="btn btn-ghost btn-sm text-emerald-400 hover:text-emerald-300"
                disabled={isLoading}
              >
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend available in {resendTimer}s
              </p>
            )}
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <Link
              to="/auth/signup"
              className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;