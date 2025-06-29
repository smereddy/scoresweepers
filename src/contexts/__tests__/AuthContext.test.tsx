import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
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

  it('shows loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
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