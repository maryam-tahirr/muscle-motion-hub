
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

class SupabaseAuthService {
  private currentUser: AuthUser | null = null;
  private currentSession: Session | null = null;

  // Initialize auth state
  async initialize() {
    const { data: { session } } = await supabase.auth.getSession();
    this.currentSession = session;
    this.currentUser = session?.user ? await this.getUserProfile(session.user.id) : null;

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentSession = session;
      if (session?.user) {
        this.currentUser = await this.getUserProfile(session.user.id);
      } else {
        this.currentUser = null;
      }
    });
  }

  // Email validation using MailerCheck
  async validateEmail(email: string): Promise<boolean> {
    try {
      const response = await fetch('https://app.mailercheck.com/api/check/single-async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        console.warn('Email validation service unavailable, proceeding with signup');
        return true; // Allow signup if validation service is down
      }
      
      const result = await response.json();
      return result.valid === true;
    } catch (error) {
      console.warn('Email validation failed, proceeding with signup:', error);
      return true; // Allow signup if validation fails
    }
  }

  // Sign up with email validation
  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      // Validate email first
      const isEmailValid = await this.validateEmail(email);
      if (!isEmailValid) {
        throw new Error('Please enter a valid email address');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to create user');

      toast.success('Account created successfully! Please check your email to verify your account.');
      
      return {
        id: data.user.id,
        email: data.user.email!,
        name,
      };
    } catch (error: any) {
      const message = error.message || 'Failed to create account';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Sign in
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to sign in');

      const userProfile = await this.getUserProfile(data.user.id);
      toast.success('Signed in successfully!');
      
      return userProfile;
    } catch (error: any) {
      const message = error.message || 'Failed to sign in';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      const message = error.message || 'Failed to sign in with Google';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.currentUser = null;
      this.currentSession = null;
      toast.success('Signed out successfully');
    } catch (error: any) {
      const message = error.message || 'Failed to sign out';
      toast.error(message);
      throw new Error(message);
    }
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name || 'Unknown User',
        avatar_url: data.avatar_url,
      };
    } catch (error) {
      // If profile doesn't exist, create it
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        return {
          id: userData.user.id,
          email: userData.user.email!,
          name: userData.user.user_metadata?.name || 'Unknown User',
          avatar_url: userData.user.user_metadata?.avatar_url,
        };
      }
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Get current session
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.currentSession && !!this.currentUser;
  }

  // Update profile
  async updateProfile(updates: Partial<AuthUser>): Promise<AuthUser> {
    try {
      if (!this.currentUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar_url,
        })
        .eq('id', this.currentUser.id);

      if (error) throw error;

      this.currentUser = { ...this.currentUser, ...updates };
      toast.success('Profile updated successfully');
      
      return this.currentUser;
    } catch (error: any) {
      const message = error.message || 'Failed to update profile';
      toast.error(message);
      throw new Error(message);
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
export default supabaseAuthService;
