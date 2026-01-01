import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Globe,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useSettings from '../hooks/useSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
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
  } = useSettings();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferencesForm, setPreferencesForm] = useState({
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    darkMode: false,
  });

  // Update forms when profile data loads
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (preferences) {
      setPreferencesForm(preferences);
    }
  }, [preferences]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileForm);
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile: ' + result.error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }

    const result = await changePassword(passwordForm);
    if (result.success) {
      alert('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      alert('Failed to change password: ' + result.error);
    }
  };

  const handleNotificationToggle = async (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    await updateNotifications(newNotifications);
  };

  const handleDisconnectAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      const result = await disconnectAccount(accountId);
      if (!result.success) {
        alert('Failed to disconnect account: ' + result.error);
      }
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    const result = await updatePreferences(preferencesForm);
    if (result.success) {
      alert('Preferences saved successfully!');
    } else {
      alert('Failed to save preferences: ' + result.error);
    }
  };

  const handleDarkModeToggle = () => {
    const newPrefs = { ...preferencesForm, darkMode: !preferencesForm.darkMode };
    setPreferencesForm(newPrefs);
    updatePreferences(newPrefs);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'connected', label: 'Connected Accounts', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              <p className="text-slate-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>

                {/* Profile Photo */}
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                    {profile.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-medium">
                      Change Photo
                    </button>
                    <p className="text-sm text-slate-500 mt-2">JPG, PNG. Max size 5MB</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, firstName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      rows="4"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                      <p className="text-xs text-slate-500 mt-2">Must be at least 8 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Two-Factor Authentication</h2>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">Authenticator App</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Use an authentication app to get free verification codes, even when your phone is
                        offline.
                      </p>
                      <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
                        Set Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: 'email',
                          label: 'Email notifications',
                          description: 'Receive email updates about your account',
                        },
                        {
                          id: 'weekly',
                          label: 'Weekly summary',
                          description: 'Get a weekly summary of your finances',
                        },
                        {
                          id: 'monthly',
                          label: 'Monthly reports',
                          description: 'Detailed monthly financial reports',
                        },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start justify-between py-3">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{item.label}</div>
                            <div className="text-sm text-slate-500">{item.description}</div>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.id] ? 'bg-slate-900' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.id] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: 'push',
                          label: 'Push notifications',
                          description: 'Receive push notifications on your devices',
                        },
                        {
                          id: 'goals',
                          label: 'Goal milestones',
                          description: 'Get notified when you reach savings goals',
                        },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start justify-between py-3">
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{item.label}</div>
                            <div className="text-sm text-slate-500">{item.description}</div>
                          </div>
                          <button
                            onClick={() => handleNotificationToggle(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.id] ? 'bg-slate-900' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.id] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connected Accounts */}
            {activeTab === 'connected' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Bank Accounts</h2>
                  {connectedAccounts.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">No connected accounts</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {connectedAccounts.map((account) => (
                        <div
                          key={account._id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{account.name}</div>
                              <div className="text-sm text-slate-500">•••• {account.last4}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-sm text-emerald-600 font-medium">Connected</span>
                            </div>
                            <button
                              onClick={() => handleDisconnectAccount(account._id)}
                              className="text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all font-medium">
                    + Connect New Account
                  </button>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">App Preferences</h2>

                <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <select
                      value={preferencesForm.currency}
                      onChange={(e) =>
                        setPreferencesForm({ ...preferencesForm, currency: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                    <select
                      value={preferencesForm.dateFormat}
                      onChange={(e) =>
                        setPreferencesForm({ ...preferencesForm, dateFormat: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Zone</label>
                    <select
                      value={preferencesForm.timezone}
                      onChange={(e) =>
                        setPreferencesForm({ ...preferencesForm, timezone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    >
                      <option value="America/New_York">UTC-05:00 Eastern Time</option>
                      <option value="America/Los_Angeles">UTC-08:00 Pacific Time</option>
                      <option value="Europe/London">UTC+00:00 London</option>
                      <option value="Asia/Kolkata">UTC+05:30 India</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-medium text-slate-900">Dark Mode</div>
                      <div className="text-sm text-slate-500">Toggle dark theme</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDarkModeToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferencesForm.darkMode ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferencesForm.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
