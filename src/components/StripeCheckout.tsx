import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, Lock, Heart } from 'lucide-react';
import { useStripe } from '../hooks/useStripe';
import { useAuth } from '../contexts/AuthContext';
import { StripeProduct } from '../stripe-config';

interface StripeCheckoutProps {
  product: StripeProduct;
  className?: string;
  children?: React.ReactNode;
  requireAuth?: boolean; // New prop to control authentication requirement
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  product, 
  className = '',
  children,
  requireAuth = false // Default to false for anonymous donations
}) => {
  const { redirectToCheckout, loading, error } = useStripe();
  const { user, isUsingMockAuth } = useAuth();

  const handleCheckout = async () => {
    // Only require authentication if explicitly set
    if (requireAuth && !user) {
      // Redirect to login if authentication is required
      window.location.href = '/login';
      return;
    }

    if (isUsingMockAuth) {
      // Show demo message for mock auth
      alert('Demo mode: Stripe payments are not available in demo mode. Please connect to Supabase for full functionality.');
      return;
    }

    await redirectToCheckout({
      priceId: product.priceId,
      mode: product.mode,
    });
  };

  // If this is being used as a wrapper (with children), render as a clickable wrapper
  if (children) {
    return (
      <div className={className}>
        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm font-plus-jakarta">{error}</p>
          </div>
        )}
        
        <motion.button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? (
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-plus-jakarta">Processing...</span>
            </div>
          ) : (
            children
          )}
        </motion.button>
      </div>
    );
  }

  // Default button styling
  return (
    <div className={className}>
      {error && (
        <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm font-plus-jakarta">{error}</p>
        </div>
      )}
      
      <motion.button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#4C8DFF] to-[#5CF0B2] hover:from-[#3A7AE4] hover:to-[#4AE09A] disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-plus-jakarta"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : requireAuth && !user ? (
          <>
            <Lock className="w-5 h-5" />
            <span>Sign in to {product.name}</span>
          </>
        ) : isUsingMockAuth ? (
          <>
            <Heart className="w-5 h-5" />
            <span>Demo: {product.name}</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            <span>{product.name} - {product.price}</span>
          </>
        )}
      </motion.button>
      
      {requireAuth && !user && (
        <p className="text-center text-sm text-white/70 font-plus-jakarta mt-2">
          Please sign in to make a payment
        </p>
      )}
      
      {isUsingMockAuth && (
        <p className="text-center text-sm text-white/70 font-plus-jakarta mt-2">
          Demo mode - Payments require Supabase connection
        </p>
      )}

      {!requireAuth && !user && !isUsingMockAuth && (
        <p className="text-center text-sm text-white/70 font-plus-jakarta mt-2">
          No account required for donations
        </p>
      )}
    </div>
  );
};

export default StripeCheckout;