import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Savings Goals Service
 * Handles all savings goals-related API calls
 */

export const savingsGoalsService = {
  /**
   * Get all savings goals
   * @param {Object} filters - Filter parameters (status, category)
   * @returns {Promise} List of savings goals
   */
  getSavingsGoals: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_SAVINGS_GOALS, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single savings goal by ID
   * @param {string} id - Goal ID
   * @returns {Promise} Goal details
   */
  getSavingsGoal: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_SAVINGS_GOAL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new savings goal
   * @param {Object} goalData - Goal data (name, targetAmount, currentAmount, deadline, category, description)
   * @returns {Promise} Created goal
   */
  createSavingsGoal: async (goalData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_SAVINGS_GOAL, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a savings goal
   * @param {string} id - Goal ID
   * @param {Object} goalData - Updated goal data
   * @returns {Promise} Updated goal
   */
  updateSavingsGoal: async (id, goalData) => {
    try {
      const response = await api.post(API_ENDPOINTS.UPDATE_SAVINGS_GOAL, {
        goalId: id,
        ...goalData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a savings goal
   * @param {string} id - Goal ID
   * @returns {Promise} Success message
   */
  deleteSavingsGoal: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.DELETE_SAVINGS_GOAL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add contribution to a savings goal
   * @param {string} id - Goal ID
   * @param {number} amount - Contribution amount
   * @param {string} note - Optional note
   * @returns {Promise} Updated goal
   */
  addContribution: async (id, amount, note = '') => {
    try {
      const response = await api.post(API_ENDPOINTS.ADD_CONTRIBUTION, {
        goalId: id,
        amount,
        note,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Mark a goal as completed
   * @param {string} id - Goal ID
   * @returns {Promise} Updated goal
   */
  completeGoal: async (id) => {
    try {
      const response = await api.post(API_ENDPOINTS.COMPLETE_GOAL, {
        goalId: id,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get goals summary/stats
   * @returns {Promise} Goals summary
   */
  getGoalsSummary: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_GOALS_SUMMARY);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default savingsGoalsService;
