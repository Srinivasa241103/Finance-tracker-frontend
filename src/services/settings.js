import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Settings Service
 * Handles all settings-related API calls
 */

export const settingsService = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_USER_PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.post(API_ENDPOINTS.UPDATE_USER_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
   * @returns {Promise} Success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update notification settings
   * @param {Object} notificationSettings - Notification preferences
   * @returns {Promise} Updated settings
   */
  updateNotificationSettings: async (notificationSettings) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.UPDATE_NOTIFICATION_SETTINGS,
        notificationSettings
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get connected bank accounts
   * @returns {Promise} List of connected accounts
   */
  getConnectedAccounts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CONNECTED_ACCOUNTS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Connect a bank account
   * @param {Object} accountData - Bank account details
   * @returns {Promise} Connected account
   */
  connectBankAccount: async (accountData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CONNECT_BANK_ACCOUNT, accountData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Disconnect a bank account
   * @param {string} accountId - Account ID to disconnect
   * @returns {Promise} Success message
   */
  disconnectBankAccount: async (accountId) => {
    try {
      const response = await api.post(API_ENDPOINTS.DISCONNECT_BANK_ACCOUNT, { accountId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences (currency, dateFormat, timezone, darkMode)
   * @returns {Promise} Updated preferences
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.post(API_ENDPOINTS.UPDATE_PREFERENCES, preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Upload profile photo
   * @param {FormData} formData - Form data with photo file
   * @returns {Promise} Photo URL
   */
  uploadProfilePhoto: async (formData) => {
    try {
      const response = await api.post(API_ENDPOINTS.UPLOAD_PROFILE_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default settingsService;
