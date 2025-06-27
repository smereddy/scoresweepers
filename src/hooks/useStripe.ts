import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CheckoutSessionData {
  sessionId: string;
  url: string;
}

interface CreateCheckoutSessionParams {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
}

export const useStripe = () => {
  const { isUsingMockAuth, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async ({
    priceId,
    mode,
    successUrl = `${window.location.origin}/success`,
    cancelUrl = `${window.location.origin}/cancel`
  }: CreateCheckoutSessionParams): Promise<CheckoutSessionData | null> => {
    setLoading(true);
    setError(null);

    try {
      if (isUsingMockAuth) {
        throw new Error('Stripe payments are not available in demo mode. Please connect to Supabase for full functionality.');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        throw new Error('Supabase configuration is required for payments');
      }

      // For authenticated users, get their session token
      let authToken = null;
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        authToken = session?.access_token;
        
        if (!authToken) {
          throw new Error('Authentication session expired. Please sign in again.');
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add Authorization header if user is authenticated
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Stripe checkout error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (params: CreateCheckoutSessionParams) => {
    const session = await createCheckoutSession(params);
    
    if (session?.url) {
      window.location.href = session.url;
    }
  };

  return {
    createCheckoutSession,
    redirectToCheckout,
    loading,
    error,
  };
};