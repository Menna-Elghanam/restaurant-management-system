import api from './api';
import type { SalesData, DailySales, TableSales, ApiResponse } from '../types';
import { handleServiceError } from '../utils/error-handler';

class SalesService {
  async getTotalSales(startDate: string, endDate: string): Promise<ApiResponse<SalesData>> {
    try {
      const response = await api.post<ApiResponse<SalesData>>('/sales/total', { 
        startDate, 
        endDate 
      });
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getDailySales(startDate: string, endDate: string): Promise<ApiResponse<DailySales[]>> {
    try {
      const response = await api.post<ApiResponse<DailySales[]>>('/sales/by-day', { 
        startDate, 
        endDate 
      });
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getSalesByTable(): Promise<ApiResponse<TableSales[]>> {
    try {
      const response = await api.get<ApiResponse<TableSales[]>>('/sales/by-table');
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}

export const salesService = new SalesService();