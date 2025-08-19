import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "../firebase/services";
import { brandColors } from "../theme";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Placeholder authentication methods - these would be implemented with actual Firebase auth
  const login = async (email: string, password: string): Promise<void> => {
    // TODO: Implement actual Firebase authentication
    console.log('Login attempt:', email);
    throw new Error('Authentication not implemented yet');
  };

  const signup = async (email: string, password: string, fullName?: string): Promise<void> => {
    // TODO: Implement actual Firebase authentication
    console.log('Signup attempt:', email, fullName);
    throw new Error('Authentication not implemented yet');
  };

  const logout = async (): Promise<void> => {
    // TODO: Implement actual Firebase authentication
    console.log('Logout attempt');
    throw new Error('Authentication not implemented yet');
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
