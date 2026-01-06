import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboard';

/**
 * Custom hook for managing dashboard data
 * Fetches and manages all dashboard-related data from backend API
 */
export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Helper function to convert string numbers to actual numbers
   */
  const parseNumber = (value) => {
    if (value === null || value === undefined) return null;
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  /**
   * Helper function to format date from ISO to readable format
   */
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  /**
   * Helper function to get category icon based on category name
   */
  const getCategoryIcon = (category, type) => {
    const icons = {
      income: {
        'Investment': '💰',
        'Salary': '💵',
        'Freelance': '💼',
        'default': '💸'
      },
      expense: {
        'Shopping': '🛍️',
        'Entertainment': '🎬',
        'Food & Dining': '🍽️',
        'Transport': '🚗',
        'Groceries': '🛒',
        'Bills & Utilities': '💡',
        'default': '💳'
      }
    };

    const typeIcons = type === 'income' ? icons.income : icons.expense;
    return typeIcons[category] || typeIcons.default;
  };

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch data from API
      const dashboardData = await dashboardService.getDashboardOverview();

      // Transform the data to match frontend expectations
      const transformedData = {
        healthScore: dashboardData.healthScore ? {
          overall: dashboardData.healthScore.overall,
          dimensions: dashboardData.healthScore.dimensions,
          personalityType: dashboardData.healthScore.personalityType,
          status: dashboardData.healthScore.status,
          trend: dashboardData.healthScore.trend,
        } : null,
        stats: dashboardData.stats ? {
          totalIncome: parseNumber(dashboardData.stats.totalIncome),
          incomeChange: parseNumber(dashboardData.stats.incomeChange),
          incomeTransactions: parseNumber(dashboardData.stats.incomeTransactions),
          totalExpenses: parseNumber(dashboardData.stats.totalExpenses),
          expenseChange: parseNumber(dashboardData.stats.expenseChange),
          expenseTransactions: parseNumber(dashboardData.stats.expenseTransactions),
          netSavings: parseNumber(dashboardData.stats.netSavings),
          savingsChange: parseNumber(dashboardData.stats.savingsChange),
        } : null,
        alerts: dashboardData.alerts || [],
        recentTransactions: dashboardData.recentTransactions
          ? dashboardData.recentTransactions.map(transaction => ({
              ...transaction,
              amount: parseNumber(transaction.amount),
              date: formatDate(transaction.date),
              icon: getCategoryIcon(transaction.category, transaction.type),
            }))
          : [],
        topCategories: dashboardData.topCategories
          ? dashboardData.topCategories.map(category => ({
              ...category,
              value: parseNumber(category.value),
            }))
          : [],
        priorityGoals: dashboardData.priorityGoals || [],
      };

      setData(transformedData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh dashboard data
   */
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Create a new goal
   */
  const createGoal = async (goalData) => {
    try {
      const newGoal = await dashboardService.createGoal(goalData);
      setData((prev) => ({
        ...prev,
        priorityGoals: [...(prev?.priorityGoals || []), newGoal],
      }));
      return { success: true, data: newGoal };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    data,
    refresh,
    createGoal,
  };
};

export default useDashboard;
