// hooks/use-invoices.ts
import { useState, useEffect, useCallback } from 'react';
import { invoiceService } from '../services/invoiceService';
import type { Invoice } from '../types';
import { handleServiceError } from '../utils/error-handler'; 

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getInvoices();
      
      if (response.success) {
        setInvoices(response.data);
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
    fetchInvoices();
  }, [fetchInvoices]);

  const refetch = useCallback(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch };
}

export function useInvoice(id: number) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await invoiceService.getInvoice(id);
        
        if (response.success) {
          setInvoice(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        const appError = handleServiceError(err);
        setError(appError.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  return { invoice, loading, error };
}

// ✅ ADDED: useCreateInvoice hook
export function useCreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = useCallback(async (invoiceData: {
    orderId: number;
    billingName: string;
    billingAddress: string;
    billingEmail: string;
    billingPhone: string;
  }): Promise<Invoice> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoiceService.createInvoice(invoiceData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to create invoice';
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

  return { createInvoice, loading, error, clearError };
}

export function useUpdateInvoiceStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateInvoiceStatus = useCallback(async (
    id: number, 
    status: 'unpaid' | 'paid' | 'cancelled'
  ): Promise<Invoice> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await invoiceService.updateInvoiceStatus(id, status);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to update invoice status';
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

  return { updateInvoiceStatus, loading, error, clearError };
}