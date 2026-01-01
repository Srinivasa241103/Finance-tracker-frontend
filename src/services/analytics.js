import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Analytics Service
 * Handles all analytics-related API calls
 */

export const analyticsService = {
  /**
   * Get complete analytics overview
   * @param {Object} filters - Filter parameters (period, startDate, endDate)
   * @returns {Promise} Complete analytics data
   */
  getAnalyticsOverview: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_ANALYTICS_OVERVIEW, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get financial health score
   * @returns {Promise} Financial health metrics
   */
  getFinancialHealth: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_FINANCIAL_HEALTH);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get income vs expense trend data
   * @param {Object} filters - Filter parameters (months, startDate, endDate)
   * @returns {Promise} Income and expense trend data
   */
  getIncomeExpenseTrend: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_INCOME_EXPENSE_TREND, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get category breakdown for spending
   * @param {Object} filters - Filter parameters (period, type)
   * @returns {Promise} Category breakdown data
   */
  getCategoryBreakdown: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CATEGORY_BREAKDOWN, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get budget vs actual spending comparison
   * @returns {Promise} Budget comparison data
   */
  getBudgetComparison: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_BUDGET_COMPARISON);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get financial personality data
   * @returns {Promise} Financial personality metrics
   */
  getFinancialPersonality: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_FINANCIAL_PERSONALITY);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get top spending merchants
   * @param {Object} filters - Filter parameters (limit, period)
   * @returns {Promise} Top merchants data
   */
  getTopMerchants: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_TOP_MERCHANTS, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default analyticsService;
