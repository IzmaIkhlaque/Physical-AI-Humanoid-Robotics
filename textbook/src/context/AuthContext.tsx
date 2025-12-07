import React, { createContext, useState, useEffect, ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// User type with experience level and interests
export interface User {
  id: string;
  email: string;
  name?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryInterest: string;
  createdAt: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

// Signup data with the 2 required questions
export interface SignupData {
  email: string;
  password: string;
  name?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryInterest: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth storage keys
const USER_STORAGE_KEY = 'physical_ai_textbook_user';
const TOKEN_STORAGE_KEY = 'physical_ai_textbook_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const API_BASE_URL = customFields.apiUrl as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage and validate token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedUser && storedToken) {
          // Attempt to verify token with the backend
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token invalid or expired, clear storage
            logout();
          }
        }
      } catch (e) {
        console.error('Failed to initialize auth or verify token:', e);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [API_BASE_URL]); // Add API_BASE_URL as a dependency

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (signupData: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred during signup' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  // Update user function
  const updateUser = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        logout();
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update user' };
      }

      const updatedUser = { ...user, ...data.user };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'An unexpected error occurred during user update' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
