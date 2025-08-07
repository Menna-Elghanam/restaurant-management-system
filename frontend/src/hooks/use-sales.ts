import { useState, useEffect, useCallback } from 'react';
import { salesService } from '../services/salesService';
import type { SalesData, DailySales, TableSales } from '../types';
import { handleServiceError } from '../utils/error-handler';

export function useTotalSales(startDate: string, endDate: string) {
  const [totalSales, setTotalSales] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await salesService.getTotalSales(startDate, endDate);
      
      if (response.success) {
        setTotalSales(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTotalSales();
  }, [fetchTotalSales]);

  return { totalSales, loading, error, refetch: fetchTotalSales };
}

export function useDailySales(startDate: string, endDate: string) {
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailySales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await salesService.getDailySales(startDate, endDate);
      
      if (response.success) {
        setDailySales(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const appError = handleServiceError(err);
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchDailySales();
  }, [fetchDailySales]);

  return { dailySales, loading, error, refetch: fetchDailySales };
}

export function useSalesByTable() {
  const [salesByTable, setSalesByTable] = useState<TableSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesByTable = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await salesService.getSalesByTable();
      
      if (response.success) {
        setSalesByTable(response.data);
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
    fetchSalesByTable();
  }, [fetchSalesByTable]);

  return { salesByTable, loading, error, refetch: fetchSalesByTable };
}