import { useState, useEffect, useCallback } from 'react';
import { tableService } from '../services/tableService';
import type { Table } from '../types';
import { handleServiceError } from '../utils/error-handler';

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tableService.getTables();
      
      if (response.success) {
        setTables(response.data);
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
    fetchTables();
  }, [fetchTables]);

  const refetch = useCallback(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    loading,
    error,
    refetch,
  };
}

// Individual table hook
export function useTable(id: number) {
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tableService.getTable(id);
        
        if (response.success) {
          setTable(response.data);
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
      fetchTable();
    }
  }, [id]);

  return { table, loading, error };
}

// Create table hook
export function useCreateTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTable = useCallback(async (tableData: {
    number: number;
    seats: number;
    status?: 'Free' | 'Occupied' | 'Reserved' | 'Out of Order';
  }): Promise<Table> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tableService.createTable(tableData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to create table';
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

  return { createTable, loading, error, clearError };
}

// Update table hook
export function useUpdateTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTable = useCallback(async (id: number, tableData: Partial<Table>): Promise<Table> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tableService.updateTable(id, tableData);
      
      if (response.success) {
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to update table';
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

  return { updateTable, loading, error, clearError };
}

// Delete table hook
export function useDeleteTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTable = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tableService.deleteTable(id);
      
      if (!response.success) {
        const errorMsg = response.message || 'Failed to delete table';
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

  return { deleteTable, loading, error, clearError };
}