// API Base URL - Change this to your actual backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2010';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // User
  GET_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',

  // Expenses
  GET_EXPENSES: '/expenses',
  CREATE_EXPENSE: '/expenses',
  UPDATE_EXPENSE: '/expenses',
  DELETE_EXPENSE: '/expenses',

  // Categories
  GET_CATEGORIES: '/categories',
  CREATE_CATEGORY: '/categories',

  // Goals
  GET_GOALS: '/goals',
  CREATE_GOAL: '/goals',
  UPDATE_GOAL: '/goals',
  DELETE_GOAL: '/goals',

  // Dashboard
  GET_DASHBOARD_OVERVIEW: '/dashboard/overview',
  GET_DASHBOARD_STATS: '/dashboard/stats',
  GET_SPENDING_TREND: '/dashboard/spending-trend',
  GET_CATEGORY_BREAKDOWN: '/dashboard/category-breakdown',
  GET_RECENT_TRANSACTIONS: '/dashboard/recent-transactions',
  GET_HEALTH_SCORE: '/dashboard/health-score',
  GET_ALERTS: '/dashboard/alerts',
  GET_TOP_CATEGORIES: '/dashboard/top-categories',

  // Transactions
  GET_TRANSACTIONS: '/transactions',
  GET_TRANSACTION: '/transactions',
  CREATE_TRANSACTION: '/transactions/create',
  UPDATE_TRANSACTION: '/transactions/update',
  DELETE_TRANSACTION: '/transactions/delete',

  // Analytics
  GET_ANALYTICS_OVERVIEW: '/analytics/overview',
  GET_FINANCIAL_HEALTH: '/analytics/financial-health',
  GET_INCOME_EXPENSE_TREND: '/analytics/income-expense-trend',
  GET_CATEGORY_BREAKDOWN: '/analytics/category-breakdown',
  GET_BUDGET_COMPARISON: '/analytics/budget-comparison',
  GET_FINANCIAL_PERSONALITY: '/analytics/financial-personality',
  GET_TOP_MERCHANTS: '/analytics/top-merchants',

  // Savings Goals
  GET_SAVINGS_GOALS: '/goals',
  GET_SAVINGS_GOAL: '/goals',
  CREATE_SAVINGS_GOAL: '/goals/create',
  UPDATE_SAVINGS_GOAL: '/goals/update',
  DELETE_SAVINGS_GOAL: '/goals/delete',
  ADD_CONTRIBUTION: '/goals/contribution',
  COMPLETE_GOAL: '/goals/complete',
  GET_GOALS_SUMMARY: '/goals/summary',

  // Budgets
  GET_BUDGETS: '/budgets',
  GET_BUDGET: '/budgets',
  CREATE_BUDGET: '/budgets/create',
  UPDATE_BUDGET: '/budgets/update',
  DELETE_BUDGET: '/budgets/delete',
  GET_BUDGET_SUMMARY: '/budgets/summary',
  GET_BUDGET_PROGRESS: '/budgets/progress',
  GET_BUDGET_ALERTS: '/budgets/alerts',

  // Settings
  GET_USER_PROFILE: '/user/profile',
  UPDATE_USER_PROFILE: '/user/profile/update',
  CHANGE_PASSWORD: '/user/change-password',
  UPDATE_NOTIFICATION_SETTINGS: '/user/notifications/update',
  GET_CONNECTED_ACCOUNTS: '/user/accounts',
  CONNECT_BANK_ACCOUNT: '/user/accounts/connect',
  DISCONNECT_BANK_ACCOUNT: '/user/accounts/disconnect',
  UPDATE_PREFERENCES: '/user/preferences/update',
  UPLOAD_PROFILE_PHOTO: '/user/profile/photo',
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'financeflow_access_token',
  REFRESH_TOKEN: 'financeflow_refresh_token',
  USER_DATA: 'financeflow_user_data',
};
