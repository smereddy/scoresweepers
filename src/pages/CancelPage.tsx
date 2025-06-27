import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const CancelPage: React.FC = () => {
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
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-10 h-10 text-red-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
              Payment Canceled
            </h1>
            
            <p className="text-white/80 font-plus-jakarta mb-6 leading-relaxed">
              Your payment was canceled. No charges have been made to your account.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center space-x-2 font-plus-jakarta"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>

              <Link to="/">
                <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-white/70 font-plus-jakarta">
                Need help? Contact us at{' '}
                <a 
                  href="mailto:support@scoresweep.org" 
                  className="text-[#5CF0B2] hover:text-[#4AE09A] transition-colors"
                >
                  support@scoresweep.org
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancelPage;