import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { LoginCredentials, AuthState } from '../types';
import { authService } from '../services/authService';
import { AuthContext } from './auth-context-definition';
import { handleServiceError } from '../utils/error-handler';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isInitialized: false,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Simply check if we have stored auth data
        const user = authService.getCurrentUser();
        const token = authService.getStoredToken();
        
        setAuthState({
          user,
          isAuthenticated: !!(user && token),
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        authService.clearAuth();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Login failed',
        }));
      }
    } catch (error) {
      const appError = handleServiceError(error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: appError.message,
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      authService.clearAuth();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data,
          isAuthenticated: true,
        }));
      }
    } catch (error) {
      console.error('Auth refresh failed:', handleServiceError(error));
    }
  }, []);

  // Memoize context value
  const contextValue = useMemo(() => ({
    ...authState,
    login,
    logout,
    clearError,
    refreshAuth,
  }), [authState, login, logout, clearError, refreshAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};