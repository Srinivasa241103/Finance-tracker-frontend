import { useState, useEffect, useCallback } from 'react';
import transactionsService from '../services/transactions';

/**
 * Custom hook for managing transactions data
 * Fetches and manages transactions with filtering, pagination, and CRUD operations
 */
export const useTransactions = (initialFilters = {}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    incomeCount: 0,
    expenseCount: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    dateRange: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  /**
   * Fetch transactions with current filters
   */
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch transactions
      const transactionsResponse = await transactionsService.getTransactions(filters);

      const fetchedTransactions = transactionsResponse.transactions || [];

      setTransactions(fetchedTransactions);
      setPagination({
        currentPage: transactionsResponse.currentPage || 1,
        totalPages: transactionsResponse.totalPages || 1,
        totalItems: transactionsResponse.totalItems || 0,
        itemsPerPage: transactionsResponse.itemsPerPage || 10,
      });

      // Use summary from backend if available, otherwise calculate from current page (fallback)
      if (transactionsResponse.summary) {
        // Backend provides summary for ALL filtered transactions
        setSummary({
          totalTransactions: transactionsResponse.summary.totalTransactions || transactionsResponse.totalItems || 0,
          totalIncome: transactionsResponse.summary.totalIncome || 0,
          totalExpenses: transactionsResponse.summary.totalExpenses || 0,
          incomeCount: transactionsResponse.summary.incomeCount || 0,
          expenseCount: transactionsResponse.summary.expenseCount || 0,
        });
      } else {
        // Fallback: calculate from current page only (not ideal, but works for single-page results)
        console.warn('Backend did not return summary data. Calculating from current page only.');
        const calculatedSummary = {
          totalTransactions: transactionsResponse.totalItems || fetchedTransactions.length,
          totalIncome: fetchedTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
          totalExpenses: fetchedTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
          incomeCount: fetchedTransactions.filter((t) => t.type === 'income').length,
          expenseCount: fetchedTransactions.filter((t) => t.type === 'expense').length,
        };
        setSummary(calculatedSummary);
      }
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      console.error('Transactions fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Update filters and reset to page 1
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  /**
   * Change page
   */
  const changePage = useCallback((page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      type: '',
      category: '',
      search: '',
      dateRange: '',
      minAmount: '',
      maxAmount: '',
      page: 1,
      limit: 10,
    });
  }, []);

  /**
   * Create a new transaction
   */
  const createTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionsService.createTransaction(transactionData);
      await fetchTransactions(); // Refresh the list
      return { success: true, data: newTransaction };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Update a transaction
   */
  const updateTransaction = async (id, transactionData) => {
    try {
      const updatedTransaction = await transactionsService.updateTransaction(id, transactionData);
      await fetchTransactions(); // Refresh the list
      return { success: true, data: updatedTransaction };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Delete a transaction
   */
  const deleteTransaction = async (id) => {
    try {
      await transactionsService.deleteTransaction(id);
      await fetchTransactions(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Export transactions to CSV
   */
  const exportTransactions = async () => {
    try {
      const blob = await transactionsService.exportTransactions(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Refresh transactions
   */
  const refresh = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    loading,
    error,
    transactions,
    summary,
    pagination,
    filters,
    updateFilters,
    changePage,
    resetFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    exportTransactions,
    refresh,
  };
};

export default useTransactions;
