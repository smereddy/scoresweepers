import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useStripe } from '../useStripe';
import { AuthProvider } from '../../contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useStripe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useStripe(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.createCheckoutSession).toBe('function');
    expect(typeof result.current.redirectToCheckout).toBe('function');
  });

  it('handles demo mode correctly', async () => {
    const { result } = renderHook(() => useStripe(), { wrapper });

    let checkoutData;
    await act(async () => {
      checkoutData = await result.current.createCheckoutSession({
        priceId: 'price_test',
        mode: 'payment',
      });
    });

    expect(checkoutData).toBe(null);
    expect(result.current.error).toContain('demo mode');
  });

  it('sets loading state during checkout creation', async () => {
    const { result } = renderHook(() => useStripe(), { wrapper });

    let promise: Promise<any>;
    
    // Start checkout creation and capture loading state
    act(() => {
      promise = result.current.createCheckoutSession({
        priceId: 'price_test',
        mode: 'payment',
      });
    });

    // Should be loading immediately after starting
    expect(result.current.loading).toBe(true);

    // Wait for promise to resolve
    await act(async () => {
      await promise;
    });

    // Should not be loading anymore
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('handles errors correctly', async () => {
    const { result } = renderHook(() => useStripe(), { wrapper });

    await act(async () => {
      await result.current.createCheckoutSession({
        priceId: 'price_test',
        mode: 'payment',
      });
    });

    expect(result.current.error).toBeTruthy();
    expect(typeof result.current.error).toBe('string');
  });
});