import api from './api';
import type { Order, CreateOrderRequest, ApiResponse } from '../types';

export const orderService = {
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await api.post('/orders/create', data);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string): Promise<ApiResponse<Order>> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};