
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseAuthService, type AuthUser } from '@/services/supabaseAuthService';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<AuthUser>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await supabaseAuthService.initialize();
        setUser(supabaseAuthService.getCurrentUser());
        setSession(supabaseAuthService.getCurrentSession());
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up a periodic check for auth state updates
    const interval = setInterval(() => {
      const currentUser = supabaseAuthService.getCurrentUser();
      const currentSession = supabaseAuthService.getCurrentSession();
      
      if (currentUser !== user) {
        setUser(currentUser);
      }
      if (currentSession !== session) {
        setSession(currentSession);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, session]);

  const signUp = async (email: string, password: string, name: string) => {
    const newUser = await supabaseAuthService.signUp(email, password, name);
    setUser(newUser);
    return newUser;
  };

  const signIn = async (email: string, password: string) => {
    const loggedInUser = await supabaseAuthService.signIn(email, password);
    setUser(loggedInUser);
    setSession(supabaseAuthService.getCurrentSession());
    return loggedInUser;
  };

  const signInWithGoogle = async () => {
    await supabaseAuthService.signInWithGoogle();
  };

  const signOut = async () => {
    await supabaseAuthService.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    const updatedUser = await supabaseAuthService.updateProfile(updates);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
