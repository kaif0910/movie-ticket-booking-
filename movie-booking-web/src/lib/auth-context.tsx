'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from './api-client';
import { User } from './types';

function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function userFromToken(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.email) return null;
  return {
    _id: payload.userId || '',
    name: payload.name || payload.email.split('@')[0],
    email: payload.email,
    userRole: payload.userRole || 'CUSTOMER',
    userStatus: payload.userStatus || 'APPROVED',
  };
}

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
  setAuthTokenAndUser: (token: string) => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = apiClient.getToken();
      if (storedToken) {
        setToken(storedToken);
        const parsedUser = userFromToken(storedToken);
        setUser(parsedUser);
      }
      setIsLoading(false);
    }
  }, []);

  const setAuthTokenAndUser = (newToken: string): User | null => {
    apiClient.setToken(newToken);
    setToken(newToken);
    const parsedUser = userFromToken(newToken);
    setUser(parsedUser);
    return parsedUser;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await apiClient.signin({ email, password });
    setIsLoading(false);

    if (response.success && response.data?.token) {
      setAuthTokenAndUser(response.data.token);
      return { success: true };
    }

    return {
      success: false,
      err: response.err || response.message || 'Invalid email or password',
    };
  };

  const register = async (data: { name: string; email: string; password: string; userRole?: string }) => {
    setIsLoading(true);
    const response = await apiClient.signup(data);
    setIsLoading(false);

    if (response.success) {
      // Auto-signin after successful registration if credentials work
      const signinRes = await apiClient.signin({ email: data.email, password: data.password });
      if (signinRes.success && signinRes.data?.token) {
        setAuthTokenAndUser(signinRes.data.token);
      }
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
    setAuthTokenAndUser(newToken);
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
        setAuthTokenAndUser,
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
