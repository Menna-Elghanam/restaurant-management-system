import api from './api';
import type { Table, ApiResponse } from '../types';
import { handleServiceError } from '../utils/error-handler';

interface CreateTableData {
  number: number;
  seats: number;
  status?: 'Free' | 'Occupied' | 'Reserved' | 'Out of Order';
}

interface UpdateTableData {
  number?: number;
  seats?: number;
  status?: 'Free' | 'Occupied' | 'Reserved' | 'Out of Order';
}

class TableService {
  async getTables(): Promise<ApiResponse<Table[]>> {
    try {
      const response = await api.get<ApiResponse<Table[]>>('/tables');
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getTable(id: number): Promise<ApiResponse<Table>> {
    try {
      const response = await api.get<ApiResponse<Table>>(`/tables/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async createTable(data: CreateTableData): Promise<ApiResponse<Table>> {
    try {
      const response = await api.post<ApiResponse<Table>>('/tables', {
        ...data,
        status: data.status || 'Free',
      });
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async updateTable(id: number, data: UpdateTableData): Promise<ApiResponse<Table>> {
    try {
      const response = await api.put<ApiResponse<Table>>(`/tables/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async deleteTable(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/tables/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}

export const tableService = new TableService();