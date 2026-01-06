import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Budget Service
 * Handles all budget-related API calls
 */

export const budgetService = {
  /**
   * Get all budgets for the current user
   * @returns {Promise} List of budgets
   */
  getBudgets: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_BUDGETS);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific budget by ID
   * @param {string} budgetId - Budget ID
   * @returns {Promise} Budget details
   */
  getBudget: async (budgetId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_BUDGET}/${budgetId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new budget
   * @param {Object} budgetData - Budget data
   * @param {string} budgetData.category - Category name
   * @param {number} budgetData.limit - Budget limit amount
   * @param {string} budgetData.period - Budget period (monthly, weekly, yearly)
   * @returns {Promise} Created budget
   */
  createBudget: async (budgetData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_BUDGET, budgetData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update an existing budget
   * @param {string} budgetId - Budget ID
   * @param {Object} budgetData - Updated budget data
   * @returns {Promise} Updated budget
   */
  updateBudget: async (budgetId, budgetData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.UPDATE_BUDGET}/${budgetId}`, budgetData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a budget
   * @param {string} budgetId - Budget ID
   * @returns {Promise} Delete confirmation
   */
  deleteBudget: async (budgetId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.DELETE_BUDGET}/${budgetId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get budget summary (total budget, total spent, remaining)
   * @returns {Promise} Budget summary
   */
  getBudgetSummary: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_BUDGET_SUMMARY);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get budget progress for all categories
   * @returns {Promise} Budget progress data
   */
  getBudgetProgress: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_BUDGET_PROGRESS);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get budget alerts (overspending, approaching limit, etc.)
   * @returns {Promise} Budget alerts
   */
  getBudgetAlerts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_BUDGET_ALERTS);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default budgetService;
