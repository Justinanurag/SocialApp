import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, setToken, removeToken, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

