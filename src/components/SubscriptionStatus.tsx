import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { getProductByPriceId } from '../stripe-config';
import LoadingSpinner from './LoadingSpinner';

const SubscriptionStatus: React.FC = () => {
  const { 
    subscription, 
    loading, 
    error, 
    hasActiveSubscription, 
    isSubscriptionCanceled,
    getCurrentPeriodEnd 
  } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" text="Loading subscription..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-plus-jakarta">Error loading subscription: {error}</span>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-500/30 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white font-space-grotesk">No Active Subscription</h3>
            <p className="text-white/70 font-plus-jakarta text-sm">You don't have an active subscription</p>
          </div>
        </div>
      </div>
    );
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;
  const periodEnd = getCurrentPeriodEnd();

  const getStatusIcon = () => {
    if (hasActiveSubscription()) {
      return isSubscriptionCanceled() ? (
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-400" />
      );
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (hasActiveSubscription()) {
      return isSubscriptionCanceled() ? 'text-yellow-400' : 'text-green-400';
    }
    return 'text-gray-400';
  };

  const getStatusText = () => {
    if (hasActiveSubscription()) {
      return isSubscriptionCanceled() ? 'Canceling at period end' : 'Active';
    }
    return subscription.subscription_status.replace('_', ' ').toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            hasActiveSubscription() ? 'bg-green-500/30' : 'bg-gray-500/30'
          }`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-white font-space-grotesk">
              {product?.name || 'Subscription'}
            </h3>
            <p className={`font-plus-jakarta text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
      </div>

      {hasActiveSubscription() && (
        <div className="space-y-2 text-sm font-plus-jakarta">
          {periodEnd && (
            <div className="flex justify-between">
              <span className="text-white/70">
                {isSubscriptionCanceled() ? 'Ends on:' : 'Renews on:'}
              </span>
              <span className="text-white">{periodEnd.toLocaleDateString()}</span>
            </div>
          )}
          
          {subscription.payment_method_brand && subscription.payment_method_last4 && (
            <div className="flex justify-between">
              <span className="text-white/70">Payment method:</span>
              <span className="text-white">
                {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SubscriptionStatus;