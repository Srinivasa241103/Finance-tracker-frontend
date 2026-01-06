import { useState, useEffect, useCallback } from 'react';
import budgetService from '../services/budget';

/**
 * Custom hook for managing budget data
 * Fetches and manages all budget-related data from backend API
 */
export const useBudget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState([]);
  const [alerts, setAlerts] = useState([]);

  /**
   * Helper function to convert string numbers to actual numbers
   */
  const parseNumber = (value) => {
    if (value === null || value === undefined) return null;
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  /**
   * Fetch all budget data
   */
  const fetchBudgetData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all budget-related data in parallel
      const [budgetsData, summaryData, progressData, alertsData] = await Promise.allSettled([
        budgetService.getBudgets(),
        budgetService.getBudgetSummary(),
        budgetService.getBudgetProgress(),
        budgetService.getBudgetAlerts(),
      ]);

      // Process budgets
      if (budgetsData.status === 'fulfilled' && budgetsData.value) {
        const transformedBudgets = budgetsData.value.map(budget => ({
          ...budget,
          limit: parseNumber(budget.limit),
          spent: parseNumber(budget.spent),
          remaining: parseNumber(budget.remaining),
        }));
        setBudgets(transformedBudgets);
      } else {
        setBudgets([]);
      }

      // Process summary
      if (summaryData.status === 'fulfilled' && summaryData.value) {
        setSummary({
          ...summaryData.value,
          totalBudget: parseNumber(summaryData.value.totalBudget),
          totalSpent: parseNumber(summaryData.value.totalSpent),
          totalRemaining: parseNumber(summaryData.value.totalRemaining),
        });
      } else {
        setSummary(null);
      }

      // Process progress
      if (progressData.status === 'fulfilled' && progressData.value) {
        const transformedProgress = progressData.value.map(item => ({
          ...item,
          budget: parseNumber(item.budget),
          spent: parseNumber(item.spent),
          percentage: parseNumber(item.percentage),
        }));
        setProgress(transformedProgress);
      } else {
        setProgress([]);
      }

      // Process alerts
      if (alertsData.status === 'fulfilled' && alertsData.value) {
        setAlerts(alertsData.value);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error('Failed to fetch budget data:', err);
      setError(err.message || 'Failed to load budget data. Please try again.');
      setBudgets([]);
      setSummary(null);
      setProgress([]);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh budget data
   */
  const refresh = useCallback(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  /**
   * Create a new budget
   */
  const createBudget = async (budgetData) => {
    try {
      const newBudget = await budgetService.createBudget(budgetData);
      await fetchBudgetData(); // Refresh all data
      return { success: true, data: newBudget };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create budget' };
    }
  };

  /**
   * Update an existing budget
   */
  const updateBudget = async (budgetId, budgetData) => {
    try {
      const updatedBudget = await budgetService.updateBudget(budgetId, budgetData);
      await fetchBudgetData(); // Refresh all data
      return { success: true, data: updatedBudget };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update budget' };
    }
  };

  /**
   * Delete a budget
   */
  const deleteBudget = async (budgetId) => {
    try {
      await budgetService.deleteBudget(budgetId);
      await fetchBudgetData(); // Refresh all data
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete budget' };
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  return {
    loading,
    error,
    budgets,
    summary,
    progress,
    alerts,
    refresh,
    createBudget,
    updateBudget,
    deleteBudget,
  };
};

export default useBudget;
