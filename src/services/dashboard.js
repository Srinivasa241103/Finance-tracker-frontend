import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

export const dashboardService = {
  /**
   * Get dashboard statistics (balance, income, expenses, etc.)
   * @param {string} period - Time period (e.g., 'thisMonth', 'lastMonth', 'thisYear')
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async (period = 'thisMonth') => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_DASHBOARD_STATS, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get spending trend data for charts
   * @param {string} period - Time period
   * @returns {Promise} Spending trend data
   */
  getSpendingTrend: async (period = 'thisWeek') => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_SPENDING_TREND, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get category breakdown for pie chart
   * @param {string} period - Time period
   * @returns {Promise} Category breakdown data
   */
  getCategoryBreakdown: async (period = 'thisMonth') => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CATEGORY_BREAKDOWN, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get recent transactions
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise} Recent transactions
   */
  getRecentTransactions: async (limit = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_RECENT_TRANSACTIONS, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all goals
   * @returns {Promise} User's savings goals
   */
  getGoals: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_GOALS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new savings goal
   * @param {Object} goalData - Goal data
   * @returns {Promise} Created goal
   */
  createGoal: async (goalData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_GOAL, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all transactions with optional filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Transactions
   */
  getTransactions: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_TRANSACTIONS, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default dashboardService;
