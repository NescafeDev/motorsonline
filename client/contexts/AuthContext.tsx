import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (name: string, email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for authentication
  useEffect(() => {
    console.log('token:', token);
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if token is valid on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // You could add an endpoint to verify token validity
          // For now, we'll just check if the token exists
          setUser(JSON.parse(localStorage.getItem('user') || 'null'));
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    console.log("login called with email:", email);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      console.log("login response:", response.data);
      const { token: newToken, user: userData } = response.data;
      
      console.log("Setting token:", newToken);
      console.log("Setting user:", userData);
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log("Login completed successfully");
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const googleLogin = async (name: string, email: string) => {
    console.log("google login called with email:", email);
    try {
      const response = await axios.post('/api/auth/google', { name, email });
      console.log("login response:", response.data);
      const { token: newToken, user: userData } = response.data;
      
      console.log("Setting token:", newToken);
      console.log("Setting user:", userData);
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      console.log("Login completed successfully");
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  const logout = () => {
    console.log("logout called");
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    console.log("Logout completed");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    googleLogin,
    isAuthenticated: !!user && !!token,
    loading
  };

  console.log("AuthContext state - user:", user, "token:", token, "isAuthenticated:", !!user && !!token);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 