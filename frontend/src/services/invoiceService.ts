// services/invoiceService.ts
import api from './api';
import type { Invoice, ApiResponse } from '../types';
import { handleServiceError } from '../utils/error-handler';

interface CreateInvoiceData {
  orderId: number;
  billingName: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
}

type InvoiceStatus = 'unpaid' | 'paid' | 'cancelled';

class InvoiceService {
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    try {
      const response = await api.get<ApiResponse<Invoice[]>>('/invoices');
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async getInvoice(id: number): Promise<ApiResponse<Invoice>> {
    try {
      const response = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async createInvoice(data: CreateInvoiceData): Promise<ApiResponse<Invoice>> {
    try {
      const response = await api.post<ApiResponse<Invoice>>('/invoices/create', data);
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }

  async updateInvoiceStatus(id: number, status: InvoiceStatus): Promise<ApiResponse<Invoice>> {
    try {
      const response = await api.patch<ApiResponse<Invoice>>(`/invoices/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw handleServiceError(error);
    }
  }
}

export const invoiceService = new InvoiceService();