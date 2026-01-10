import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Plaid Service
 * Handles all Plaid-related API calls for bank account connections
 */

export const plaidService = {
  /**
   * Create a link token for Plaid Link initialization
   * @returns {Promise} Link token response
   */
  createLinkToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_PLAID_LINK_TOKEN);
      return response.data;
    } catch (error) {
      console.error('Create link token error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Exchange public token for access token
   * @param {string} publicToken - Public token from Plaid Link
   * @param {Object} metadata - Metadata from Plaid Link
   * @returns {Promise} Exchange token response with account details
   */
  exchangePublicToken: async (publicToken, metadata) => {
    try {
      const response = await api.post(API_ENDPOINTS.EXCHANGE_PLAID_PUBLIC_TOKEN, {
        publicToken,
        metadata,
      });
      return response.data;
    } catch (error) {
      console.error('Exchange public token error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all connected bank accounts
   * @returns {Promise} List of connected bank accounts
   */
  getBankAccounts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_BANK_ACCOUNTS);
      return response.data;
    } catch (error) {
      console.error('Get bank accounts error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific bank account by ID
   * @param {string} accountId - Bank account ID
   * @returns {Promise} Bank account details
   */
  getBankAccount: async (accountId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_BANK_ACCOUNT}/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Get bank account error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Remove/disconnect a bank account
   * @param {string} accountId - Bank account ID to remove
   * @returns {Promise} Success response
   */
  removeBankAccount: async (accountId) => {
    try {
      const response = await api.post(API_ENDPOINTS.REMOVE_BANK_ACCOUNT, {
        accountId,
      });
      return response.data;
    } catch (error) {
      console.error('Remove bank account error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Sync/update transactions for a bank account
   * @param {string} accountId - Bank account ID to sync
   * @returns {Promise} Sync response with transaction count
   */
  syncBankAccount: async (accountId) => {
    try {
      const response = await api.post(API_ENDPOINTS.SYNC_BANK_ACCOUNT, {
        accountId,
      });
      return response.data;
    } catch (error) {
      console.error('Sync bank account error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get balance for a specific bank account
   * @param {string} accountId - Bank account ID
   * @returns {Promise} Account balance information
   */
  getAccountBalance: async (accountId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.GET_ACCOUNT_BALANCE}/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Get account balance error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Refresh all bank accounts (sync all connected accounts)
   * @returns {Promise} Refresh response
   */
  refreshAllAccounts: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.REFRESH_ALL_ACCOUNTS);
      return response.data;
    } catch (error) {
      console.error('Refresh all accounts error:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default plaidService;
