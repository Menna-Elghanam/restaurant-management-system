import api from './api';
import type { User, ApiResponse, LoginCredentials } from '../types';
import { handleServiceError } from '../utils/error-handler';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'user';

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Store auth data
        localStorage.setItem(this.TOKEN_KEY, response.data.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Validate user structure
      if (this.isValidUser(user)) {
        return user;
      }
      
      // Invalid user data, clear it
      localStorage.removeItem(this.USER_KEY);
      return null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  /**
   * Get user profile from API (fresh data)
   */
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');
      
      // Update stored user data if successful
      if (response.data.success && response.data.data) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  /**
   * Get stored token
   */
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated (has valid stored data)
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Validate user object structure
   */
  private isValidUser(user: User): user is User {
    return (
      user &&
      typeof user === 'object' &&
      typeof user.id === 'number' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      typeof user.role === 'string' &&
      ['ADMIN', 'MANAGER', 'STAFF'].includes(user.role)
    );
  }
}

export const authService = new AuthService();