import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home, Receipt } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SuccessPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate a brief loading period to allow webhook processing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <LoadingSpinner size="lg" color="white" />
          <div>
            <h2 className="text-2xl font-bold font-space-grotesk mb-2">Processing your payment...</h2>
            <p className="text-white/80 font-plus-jakarta">Please wait while we confirm your transaction</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] text-white">
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
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/15 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/30 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-[#5CF0B2]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
              Payment Successful!
            </h1>
            
            <p className="text-white/80 font-plus-jakarta mb-6 leading-relaxed">
              Thank you for your support! Your payment has been processed successfully.
            </p>

            {sessionId && (
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-white/70 mb-2">
                  <Receipt className="w-4 h-4" />
                  <span className="text-sm font-plus-jakarta">Transaction ID</span>
                </div>
                <p className="text-white font-mono text-sm break-all">{sessionId}</p>
              </div>
            )}

            <div className="space-y-4">
              {user ? (
                <Link to="/dashboard">
                  <motion.button
                    className="w-full bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center space-x-2 font-plus-jakarta"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              ) : (
                <Link to="/login">
                  <motion.button
                    className="w-full bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center space-x-2 font-plus-jakarta"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}

              <Link to="/">
                <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;