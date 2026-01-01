import { useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settings';

// Fallback data when APIs are not available
const FALLBACK_DATA = {
  profile: {
    firstName: 'Srinivasa',
    lastName: 'Reddy',
    email: 'srinivasa@example.com',
    phone: '+91 98765 43210',
    bio: 'Computer Science student passionate about personal finance and building useful applications.',
    photoUrl: null,
  },
  notifications: {
    email: true,
    push: false,
    weekly: true,
    monthly: true,
    goals: true,
  },
  connectedAccounts: [
    { _id: '1', name: 'HDFC Bank Checking', last4: '4532', type: 'checking', connected: true },
    { _id: '2', name: 'ICICI Bank Savings', last4: '8721', type: 'savings', connected: true },
    { _id: '3', name: 'SBI Credit Card', last4: '1928', type: 'credit', connected: true },
  ],
  preferences: {
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    darkMode: false,
  },
};

/**
 * Custom hook for managing user settings
 * Fetches settings data with fallback to dummy data
 */
export const useSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(FALLBACK_DATA.profile);
  const [notifications, setNotifications] = useState(FALLBACK_DATA.notifications);
  const [connectedAccounts, setConnectedAccounts] = useState(FALLBACK_DATA.connectedAccounts);
  const [preferences, setPreferences] = useState(FALLBACK_DATA.preferences);

  /**
   * Fetch all settings data
   */
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all settings in parallel
      const [profileResponse, accountsResponse] = await Promise.allSettled([
        settingsService.getUserProfile(),
        settingsService.getConnectedAccounts(),
      ]);

      // Process profile data
      if (profileResponse.status === 'fulfilled' && profileResponse.value) {
        const profileData = profileResponse.value;
        setProfile({
          firstName: profileData.firstName || FALLBACK_DATA.profile.firstName,
          lastName: profileData.lastName || FALLBACK_DATA.profile.lastName,
          email: profileData.email || FALLBACK_DATA.profile.email,
          phone: profileData.phone || FALLBACK_DATA.profile.phone,
          bio: profileData.bio || FALLBACK_DATA.profile.bio,
          photoUrl: profileData.photoUrl || FALLBACK_DATA.profile.photoUrl,
        });

        // Extract preferences and notifications from profile
        if (profileData.preferences) {
          setPreferences(profileData.preferences);
        }
        if (profileData.notifications) {
          setNotifications(profileData.notifications);
        }
      } else {
        console.warn('Profile API failed, using fallback data');
      }

      // Process connected accounts
      if (accountsResponse.status === 'fulfilled' && accountsResponse.value?.accounts) {
        setConnectedAccounts(accountsResponse.value.accounts);
      } else {
        console.warn('Connected accounts API failed, using fallback data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load settings');
      console.error('Settings fetch error:', err);
      // Keep fallback data on error
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await settingsService.updateUserProfile(profileData);
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      return { success: true, data: updatedProfile };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (passwordData) => {
    try {
      const result = await settingsService.changePassword(passwordData);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Update notification settings
   */
  const updateNotifications = async (notificationSettings) => {
    try {
      const updatedSettings = await settingsService.updateNotificationSettings(
        notificationSettings
      );
      setNotifications(updatedSettings);
      return { success: true, data: updatedSettings };
    } catch (err) {
      // Update locally even if API fails (optimistic update)
      setNotifications(notificationSettings);
      console.warn('Failed to update notifications on server, updated locally');
      return { success: false, error: err.message };
    }
  };

  /**
   * Disconnect bank account
   */
  const disconnectAccount = async (accountId) => {
    try {
      await settingsService.disconnectBankAccount(accountId);
      setConnectedAccounts((prev) => prev.filter((acc) => acc._id !== accountId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Update preferences
   */
  const updatePreferences = async (newPreferences) => {
    try {
      const updatedPrefs = await settingsService.updatePreferences(newPreferences);
      setPreferences(updatedPrefs);
      return { success: true, data: updatedPrefs };
    } catch (err) {
      // Update locally even if API fails (optimistic update)
      setPreferences(newPreferences);
      console.warn('Failed to update preferences on server, updated locally');
      return { success: false, error: err.message };
    }
  };

  /**
   * Upload profile photo
   */
  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const result = await settingsService.uploadProfilePhoto(formData);
      setProfile((prev) => ({ ...prev, photoUrl: result.photoUrl }));
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Refresh settings
   */
  const refresh = useCallback(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    loading,
    error,
    profile,
    notifications,
    connectedAccounts,
    preferences,
    updateProfile,
    changePassword,
    updateNotifications,
    disconnectAccount,
    updatePreferences,
    uploadPhoto,
    refresh,
  };
};

export default useSettings;
