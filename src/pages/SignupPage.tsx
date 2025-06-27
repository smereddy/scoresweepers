import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, AlertTriangle, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SignupPage: React.FC = () => {
  const { user, loading: authLoading, isUsingMockAuth, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // In demo mode, redirect directly to dashboard
  if (isDemoMode) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect if already authenticated
  if (user && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isUsingMockAuth) {
        // Mock signup for demo
        console.log('Mock signup:', formData);
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate('/dashboard');
        return;
      }

      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: undefined, // Disable email confirmation
        }
      });

      if (signupError) {
        throw signupError;
      }

      if (data.user) {
        // User was created successfully
        navigate('/dashboard');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      
      if (err.message.includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.message.includes('Invalid email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] flex items-center justify-center">
        <LoadingSpinner size="lg" color="white" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#4C8DFF] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#5CF0B2] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#4C8DFF] rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#5CF0B2] rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#050D25]" />
            </div>
            <span className="text-2xl font-bold font-space-grotesk">ScoreSweep</span>
          </Link>
          
          <Link 
            to="/"
            className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors font-plus-jakarta"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/15 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/30"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#5CF0B2]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Create Account</h1>
            <p className="text-white/80 font-plus-jakarta">
              {isUsingMockAuth 
                ? 'Demo signup - Enter any details to continue' 
                : 'Join ScoreSweep to start improving your credit'
              }
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm font-plus-jakarta bg-red-400/15 border border-red-400/30 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center space-x-2 font-plus-jakarta"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <span>Create Account</span>
              )}
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-white/80 font-plus-jakarta">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-[#5CF0B2] hover:text-[#4AE09A] font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-sm text-white/80 font-plus-jakarta">
                {isUsingMockAuth 
                  ? 'Demo environment with limited functionality'
                  : 'By creating an account, you agree to our Terms of Service and Privacy Policy'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;