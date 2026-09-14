'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from './api-client';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; err?: any }>;
  register: (data: { name: string; email: string; password: string; userRole?: string }) => Promise<{ success: boolean; err?: any }>;
  loginWithGoogle: () => void;
  logout: () => void;
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check URL params for google login redirect callback token
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');

      if (urlToken) {
        apiClient.setToken(urlToken);
        setToken(urlToken);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const storedToken = apiClient.getToken();
        if (storedToken) {
          setToken(storedToken);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await apiClient.signin({ email, password });
    setIsLoading(false);

    if (response.success && response.data?.token) {
      setToken(response.data.token);
      return { success: true };
    }

    return {
      success: false,
      err: response.err || response.message || 'Login failed',
    };
  };

  const register = async (data: { name: string; email: string; password: string; userRole?: string }) => {
    setIsLoading(true);
    const response = await apiClient.signup(data);
    setIsLoading(false);

    if (response.success) {
      return { success: true };
    }

    return {
      success: false,
      err: response.err || response.message || 'Registration failed',
    };
  };

  const loginWithGoogle = () => {
    window.location.href = apiClient.getGoogleAuthUrl();
  };

  const logout = () => {
    apiClient.setToken(null);
    setToken(null);
    setUser(null);
  };

  const setAuthToken = (newToken: string) => {
    apiClient.setToken(newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
