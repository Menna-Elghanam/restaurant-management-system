import { useState } from 'react';
import { orderService } from '../services/orderService';
import type { CreateOrderRequest } from '../types';
import { useAuth } from './use-auth';
import { useAsync } from './use-async';

export function useOrders() {
  const { data, loading, error, refetch } = useAsync(
    () => orderService.getOrders()
  );

  return {
    orders: data?.data || [],
    loading,
    error,
    refetch,
  };
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createOrder = async (orderData: CreateOrderRequest) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await orderService.createOrder({
        ...orderData,
        userId: user.id,
      });
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
}


export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (orderId: number, status: string) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderStatus, loading };
}