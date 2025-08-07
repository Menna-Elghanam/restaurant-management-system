import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../services/menuService';
import type { MenuItem, Category } from '../types';
import { handleServiceError } from '../utils/error-handler';

export function useMenuItems(params?: {
  search?: string;
  categoryId?: number;
  available?: boolean;
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuService.getMenuItems(params);
      
      if (response.success) {
        setMenuItems(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [params?.search, params?.categoryId, params?.available]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const refetch = useCallback(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return { menuItems, loading, error, refetch };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuService.getCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useCreateMenuItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMenuItem = useCallback(async (itemData: {
    name: string;
    description: string;
    price: number;
    categoryId?: number;
    available?: boolean;
  }): Promise<MenuItem> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await menuService.createMenuItem(itemData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to create menu item';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
      throw appError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { createMenuItem, loading, error, clearError };
}

export function useUpdateMenuItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMenuItem = useCallback(async (id: number, itemData: Partial<MenuItem>): Promise<MenuItem> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await menuService.updateMenuItem(id, itemData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to update menu item';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
      throw appError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { updateMenuItem, loading, error, clearError };
}

export function useDeleteMenuItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMenuItem = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await menuService.deleteMenuItem(id);
      
      if (!response.success) {
        const errorMsg = response.message || 'Failed to delete menu item';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
      throw appError;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { deleteMenuItem, loading, error, clearError };
}