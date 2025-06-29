import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '../../test/utils';
import { useAuth, AuthProvider } from '../AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, isDemoMode, isUsingMockAuth } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="demo-mode">{isDemoMode ? 'Demo' : 'Production'}</div>
      <div data-testid="mock-auth">{isUsingMockAuth ? 'Mock' : 'Real'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides demo mode by default', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('demo-mode')).toHaveTextContent('Demo');
    });
  });

  it('creates demo user in demo mode', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('demo@scoresweep.com');
    });
  });

  it('shows loading state initially', async () => {
    let resolveAuth: () => void;
    const authPromise = new Promise<void>((resolve) => {
      resolveAuth = resolve;
    });

    // Mock a delayed auth state change
    const mockOnAuthStateChange = vi.fn().mockImplementation((callback) => {
      setTimeout(() => {
        callback('SIGNED_OUT', null);
        resolveAuth();
      }, 100);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    vi.doMock('../../lib/supabase', () => ({
      supabase: {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
          onAuthStateChange: mockOnAuthStateChange,
        },
      },
    }));

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for auth to resolve
    await act(async () => {
      await authPromise;
    });

    // Should show demo user after loading
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('demo@scoresweep.com');
    });
  });

  it('handles mock auth when no Supabase config', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-auth')).toHaveTextContent('Mock');
    });
  });
});