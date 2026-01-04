import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Transactions Service
 * Handles all transaction-related API calls
 */

export const transactionsService = {
  /**
   * Get all transactions with optional filters
   * @param {Object} filters - Filter parameters (type, category, dateRange, search, page, limit, minAmount, maxAmount)
   * @returns {Promise} Paginated transactions with stats
   */
  getTransactions: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_TRANSACTIONS, {
        params: filters,
      });

      const data = response.data;

      // Transform backend response to match frontend expectations
      const transformedTransactions = (data.transactions || []).map(transaction => ({
        ...transaction,
        _id: transaction.transactionId || transaction._id || transaction.id,
        id: transaction.transactionId || transaction.id || transaction._id,
        date: transaction.transactionDate || transaction.date,
        merchant: transaction.merchantName || transaction.merchant,
        category: transaction.categoryName || transaction.category,
      }));

      // Transform pagination to match frontend expectations
      return {
        transactions: transformedTransactions,
        currentPage: data.pagination?.page || data.currentPage || 1,
        totalPages: data.pagination?.totalPages || Math.ceil((data.pagination?.total || 0) / (data.pagination?.limit || 10)) || 1,
        totalItems: data.pagination?.total || data.totalItems || 0,
        itemsPerPage: data.pagination?.limit || data.itemsPerPage || 10,
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get transaction summary/stats
   * @param {Object} filters - Filter parameters (type, category, dateRange)
   * @returns {Promise} Transaction summary with totals
   */
  getTransactionSummary: async (filters = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_TRANSACTIONS}/summary`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise} Transaction details
   */
  getTransaction: async (id) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_TRANSACTION}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data (type, amount, category, description, date, merchant)
   * @returns {Promise} Created transaction
   */
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_TRANSACTION, transactionData);
      const transaction = response.data.transaction || response.data;

      // Transform backend response to match frontend expectations
      return {
        ...transaction,
        _id: transaction.transactionId || transaction._id || transaction.id,
        id: transaction.transactionId || transaction.id || transaction._id,
        date: transaction.transactionDate || transaction.date,
        merchant: transaction.merchantName || transaction.merchant,
        category: transaction.categoryName || transaction.category,
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a transaction
   * @param {string} id - Transaction ID
   * @param {Object} transactionData - Updated transaction data
   * @returns {Promise} Updated transaction
   */
  updateTransaction: async (id, transactionData) => {
    try {
      // Send transaction ID in the request body along with the transaction data
      const response = await api.post(API_ENDPOINTS.UPDATE_TRANSACTION, {
        transactionId: id,
        ...transactionData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise} Success message
   */
  deleteTransaction: async (id) => {
    try {
      const response = await api.post(API_ENDPOINTS.DELETE_TRANSACTION, {
        transactionId: id,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Export transactions to CSV
   * @param {Object} filters - Filter parameters
   * @returns {Promise} CSV file blob
   */
  exportTransactions: async (filters = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_TRANSACTIONS}/export`, {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default transactionsService;
