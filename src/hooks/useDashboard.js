import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboard';

/**
 * Custom hook for managing dashboard data
 * Fetches and manages all dashboard-related data
 */
export const useDashboard = (period = 'thisMonth') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: null,
    spendingTrend: [],
    categoryBreakdown: [],
    recentTransactions: [],
    goals: [],
  });

  /**
   * Fetch all dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [stats, spendingTrend, categoryBreakdown, transactions, goals] = await Promise.all([
        dashboardService.getDashboardStats(period),
        dashboardService.getSpendingTrend(period),
        dashboardService.getCategoryBreakdown(period),
        dashboardService.getRecentTransactions(10),
        dashboardService.getGoals(),
      ]);

      setData({
        stats,
        spendingTrend,
        categoryBreakdown,
        recentTransactions: transactions,
        goals,
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

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
        goals: [...prev.goals, newGoal],
      }));
      return { success: true, data: newGoal };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Fetch data on mount and when period changes
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
