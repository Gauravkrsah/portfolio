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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Helper function to create a persistent session
  const createPersistentSession = () => {
    // Create a mock session with very long expiration
    const mockSession = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() + 10 * 365 * 24 * 3600 * 1000, // 10 years from now
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
    setIsAuthenticated(true);
    
    // Store session in localStorage
    localStorage.setItem('portfolio_session', JSON.stringify(mockSession));
    localStorage.setItem('portfolio_auth', 'true');
  };

  // Check if there's an existing Supabase session on component mount
  useEffect(() => {
    // First check if we have a stored session in localStorage
    const storedSession = localStorage.getItem('portfolio_session');
    const storedAuth = localStorage.getItem('portfolio_auth') === 'true';
    
    if (storedSession && storedAuth) {
      try {
        const parsedSession = JSON.parse(storedSession);
        
        // Check if the session has expired
        if (parsedSession.expires_at && parsedSession.expires_at > Date.now()) {
          console.log('Restoring session from localStorage');
          setSession(parsedSession);
          setIsAuthenticated(true);
        } else {
          console.log('Stored session has expired, creating a new persistent session');
          // Create a new persistent session
          createPersistentSession();
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
        // Don't clear session data, just create a new one if auth is true
        if (storedAuth) {
          createPersistentSession();
        }
      }
    } else {
      // If no stored session, check Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          // Store in localStorage
          localStorage.setItem('portfolio_session', JSON.stringify(session));
          localStorage.setItem('portfolio_auth', 'true');
        }
      });
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setIsAuthenticated(true);
        localStorage.setItem('portfolio_session', JSON.stringify(session));
        localStorage.setItem('portfolio_auth', 'true');
      } 
      // Only clear session on explicit logout, not on auth state change
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First check hardcoded credentials for demo purposes
      if (username !== 'admin' || password !== 'password123') {
        return false;
      }
      
      // Create a persistent session
      createPersistentSession();
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
