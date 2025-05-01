import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/services/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  session: null,
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if there's an existing Supabase session on component mount
  useEffect(() => {
    // First check if we have a stored session in localStorage
    const storedSession = localStorage.getItem('portfolio_session');
    const storedAuth = localStorage.getItem('portfolio_auth');
    
    if (storedSession && storedAuth === 'true') {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored session:', error);
        // Clear invalid session data
        localStorage.removeItem('portfolio_session');
        localStorage.removeItem('portfolio_auth');
      }
    } else {
      // If no stored session, check Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setIsAuthenticated(!!session);
      });

    }
    
    setIsLoading(false);
   // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      
      if (session) {
        // Store session in localStorage when authenticated
        localStorage.setItem('portfolio_session', JSON.stringify(session));
        localStorage.setItem('portfolio_auth', 'true');
      } else {
        // Remove session from localStorage when logged out
        localStorage.removeItem('portfolio_session');
        localStorage.removeItem('portfolio_auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First check hardcoded credentials for demo purposes
      if (username !== 'admin' || password !== 'password123') {
        return false;
      }
      
      // For demo purposes, we'll just set isAuthenticated to true
      // This bypasses Supabase auth for now, but still allows the admin to log in
      setIsAuthenticated(true);
      localStorage.setItem('portfolio_auth', 'true');
      
      // Create a mock session
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600 * 1000, // 1 hour from now
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'mock-user-id',
          email: 'admin@example.com',
          role: 'authenticated',
          aud: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      } as Session;
      
      setSession(mockSession);
      
      // Store session in localStorage
      localStorage.setItem('portfolio_session', JSON.stringify(mockSession));
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };
  
  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setSession(null);
      
      // Clear session from localStorage
      localStorage.removeItem('portfolio_session');
      localStorage.removeItem('portfolio_auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const value = {
    isAuthenticated,
    login,
    logout,
    session,
    isLoading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
