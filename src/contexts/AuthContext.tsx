import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';

interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

interface AuthContextType {
  user: User | MockUser | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isUsingMockAuth: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMockAuth, setIsUsingMockAuth] = useState(false);
  
  // Demo mode - set to true to disable authentication
  const isDemoMode = true;

  // Define helper functions before useEffect
  const initializeDemoMode = () => {
    setIsUsingMockAuth(true);
    
    // Automatically create a demo user
    const demoUser: MockUser = {
      id: 'demo-user-id',
      email: 'demo@scoresweep.com',
      user_metadata: {
        full_name: 'Demo User'
      }
    };
    
    setUser(demoUser);
    setLoading(false);
  };

  const initializeMockAuth = () => {
    setIsUsingMockAuth(true);
    
    // Check for stored mock session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const mockUser = JSON.parse(storedUser);
        setUser(mockUser);
      } catch (error) {
        console.error('Error parsing stored mock user:', error);
        localStorage.removeItem('mockUser');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, automatically create a demo user
      initializeDemoMode();
      return;
    }

    // Check if we have valid Supabase environment variables
    const hasValidSupabaseConfig = 
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
      import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key';

    if (!hasValidSupabaseConfig) {
      console.log('No valid Supabase configuration found, using mock auth');
      initializeMockAuth();
      return;
    }

    // Initialize Supabase auth
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error getting session:', error);
          // Don't fall back to mock auth immediately, user might be signing in
        }

        setSession(session);
        setUser(session?.user ?? null);
        setIsUsingMockAuth(false);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Handle sign out
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.warn('Supabase initialization failed, using mock auth:', error);
        initializeMockAuth();
      }
    };

    initializeAuth();
  }, [isDemoMode]);

  const signInWithGoogle = async () => {
    if (isDemoMode || isUsingMockAuth) {
      // Mock Google sign in
      const mockUser: MockUser = {
        id: 'demo-user-id',
        email: 'demo@scoresweep.com',
        user_metadata: {
          full_name: 'Demo User'
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

    // Real Supabase Google sign in
    const redirectTo = `${config.baseUrl}/dashboard`;
    
    console.log('Initiating Google sign in, redirect to:', redirectTo);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    if (isDemoMode || isUsingMockAuth) {
      // Mock sign in
      const mockUser: MockUser = {
        id: 'demo-user-id',
        email: email,
        user_metadata: {
          full_name: email.split('@')[0]
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

    // Real Supabase sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }

    // User state will be updated by the auth state change listener
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isDemoMode || isUsingMockAuth) {
      // Mock sign up
      const mockUser: MockUser = {
        id: 'demo-user-id',
        email: email,
        user_metadata: {
          full_name: fullName
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

    // Real Supabase sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined, // Disable email confirmation
      }
    });
    
    if (error) {
      throw error;
    }

    // User state will be updated by the auth state change listener
  };

  const signOut = async () => {
    if (isDemoMode || isUsingMockAuth) {
      // Mock sign out - clear user state
      setUser(null);
      localStorage.removeItem('mockUser');
      
      // Force a page reload to ensure proper navigation
      window.location.href = '/';
      return;
    }

    // Real Supabase sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    // Force navigation to home page
    window.location.href = '/';
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithPassword,
    signUp,
    signOut,
    isUsingMockAuth,
    isDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};