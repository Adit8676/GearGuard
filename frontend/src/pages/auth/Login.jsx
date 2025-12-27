import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePageTitle from '../../hooks/usePageTitle';

const Login = () => {
  usePageTitle('Login');
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      // Redirect based on user role will be handled by App.jsx default route
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
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
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-sm lg:text-base text-gray-400">Sign in to your GearGuard account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
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
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full h-10 lg:h-12 text-sm lg:text-base bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-4 lg:mt-6">
            <p className="text-gray-400 text-sm lg:text-base">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="text-emerald-400 hover:text-emerald-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;