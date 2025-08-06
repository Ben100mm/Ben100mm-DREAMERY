import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isEmailVerified: false,
    isLoading: true,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('dreamery_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isEmailVerified: user.isEmailVerified,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate login success
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        isEmailVerified: false, // Will be verified later
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('dreamery_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isEmailVerified: false,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Login failed');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate signup success
      const user: User = {
        id: '1',
        email,
        name,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('dreamery_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isEmailVerified: false,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('dreamery_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isEmailVerified: false,
      isLoading: false,
    });
  };

  const verifyEmail = async (token: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (authState.user) {
        const updatedUser = { ...authState.user, isEmailVerified: true };
        localStorage.setItem('dreamery_user', JSON.stringify(updatedUser));
        
        setAuthState({
          user: updatedUser,
          isAuthenticated: true,
          isEmailVerified: true,
          isLoading: false,
        });
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Email verification failed');
    }
  };

  const sendVerificationEmail = async () => {
    if (!authState.user) return;
    
    try {
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Verification email sent to:', authState.user.email);
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    verifyEmail,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 