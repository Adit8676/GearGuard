import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePageTitle from '../../hooks/usePageTitle';

const SignUp = () => {
  usePageTitle('Sign Up');
  const navigate = useNavigate();
  const { sendOtp, isLoading, setSignupData } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await sendOtp(formData.email);
      setSignupData(formData); // Store form data locally
      navigate('/auth/verify-otp');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 lg:p-12 xl:p-16 flex-col justify-center items-center">
        <div className="text-white text-center">
          <h1 className="text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-4">GearGuard.</h1>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8 xl:p-12 bg-gray-800">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-sm lg:text-base text-gray-400">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300 text-sm lg:text-base">Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input w-full pl-10 lg:pl-12 h-10 lg:h-12 text-sm lg:text-base bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-700 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <span className="text-red-400 text-xs lg:text-sm mt-1">{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300 text-sm lg:text-base">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input w-full pl-10 lg:pl-12 h-10 lg:h-12 text-sm lg:text-base bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-700 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <span className="text-red-400 text-xs lg:text-sm mt-1">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300 text-sm lg:text-base">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input w-full pl-10 lg:pl-12 pr-10 lg:pr-12 h-10 lg:h-12 text-sm lg:text-base bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-700 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
              </div>
              {errors.password && <span className="text-red-400 text-xs lg:text-sm mt-1">{errors.password}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-300 text-sm lg:text-base">Confirm Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input w-full pl-10 lg:pl-12 pr-10 lg:pr-12 h-10 lg:h-12 text-sm lg:text-base bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-gray-700 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-400 text-xs lg:text-sm mt-1">{errors.confirmPassword}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full h-10 lg:h-12 text-sm lg:text-base bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="text-center mt-4 lg:mt-6">
            <p className="text-gray-400 text-sm lg:text-base">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;