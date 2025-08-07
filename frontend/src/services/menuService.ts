import api from './api';
import type { MenuItem, Category, ApiResponse, PaginatedResponse } from '../types';
import { handleServiceError } from '../utils/error-handler';

interface CreateMenuItemData {
  name: string;
  description: string;
  price: number;
  categoryId?: number;
  available?: boolean;
}

class MenuService {
  async getMenuItems(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    available?: boolean;
  }): Promise<PaginatedResponse<MenuItem>> {
    try {
      const response = await api.get<PaginatedResponse<MenuItem>>('/menu', { params });
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getMenuItem(id: number): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.get<ApiResponse<MenuItem>>(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async createMenuItem(data: CreateMenuItemData): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.post<ApiResponse<MenuItem>>('/menu', {
        ...data,
        available: data.available ?? true,
      });
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async updateMenuItem(id: number, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> {
    try {
      const response = await api.put<ApiResponse<MenuItem>>(`/menu/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async deleteMenuItem(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await api.get<ApiResponse<Category[]>>('/categories');
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}

export const menuService = new MenuService();