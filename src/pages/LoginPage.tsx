import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, AlertTriangle, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const { user, signInWithGoogle, signInWithPassword, loading: authLoading, isUsingMockAuth, isDemoMode } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');
  const location = useLocation();

  // In demo mode, redirect directly to dashboard
  if (isDemoMode) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect if already authenticated
  if (user && !authLoading) {
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithPassword(formData.email, formData.password);
    } catch (err: any) {
      console.error('Email sign in error:', err);
      
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
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
              <CheckCircle className="w-8 h-8 text-[#5CF0B2]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Welcome Back</h1>
            <p className="text-white/80 font-plus-jakarta">
              {isUsingMockAuth 
                ? 'Demo access - Choose any sign-in method to continue' 
                : 'Sign in to access your ScoreSweep dashboard'
              }
            </p>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex bg-white/10 rounded-lg p-1 mb-6">
            <button
              onClick={() => setAuthMethod('google')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-plus-jakarta transition-colors ${
                authMethod === 'google' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-plus-jakarta transition-colors ${
                authMethod === 'email' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Email
            </button>
          </div>

          <div className="space-y-4">
            {/* Google Sign In */}
            {authMethod === 'google' && (
              <motion.button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center space-x-3 font-plus-jakarta"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <LoadingSpinner size="sm" color="primary" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>
                      {isUsingMockAuth ? 'Continue with Google (Demo)' : 'Continue with Google'}
                    </span>
                  </>
                )}
              </motion.button>
            )}

            {/* Email Sign In */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                      placeholder="Enter your password"
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
                    <span>Sign In</span>
                  )}
                </motion.button>
              </form>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm font-plus-jakarta bg-red-400/15 border border-red-400/30 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-sm text-white/80 font-plus-jakarta">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-[#5CF0B2] hover:text-[#4AE09A] font-semibold transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {!isUsingMockAuth && (
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="text-center space-y-2">
                <p className="text-sm text-white/80 font-plus-jakarta">
                  Need help accessing your account?
                </p>
                <a 
                  href="mailto:support@scoresweep.org"
                  className="text-[#5CF0B2] hover:text-[#4AE09A] font-semibold transition-colors font-plus-jakarta"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;