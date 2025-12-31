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
  GET_DASHBOARD_STATS: '/dashboard/stats',
  GET_SPENDING_TREND: '/dashboard/spending-trend',
  GET_CATEGORY_BREAKDOWN: '/dashboard/category-breakdown',
  GET_RECENT_TRANSACTIONS: '/dashboard/recent-transactions',

  // Transactions
  GET_TRANSACTIONS: '/transactions',
  GET_TRANSACTION: '/transactions',
  CREATE_TRANSACTION: '/transactions/create',
  UPDATE_TRANSACTION: '/transactions/update',
  DELETE_TRANSACTION: '/transactions/delete',
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'financeflow_access_token',
  REFRESH_TOKEN: 'financeflow_refresh_token',
  USER_DATA: 'financeflow_user_data',
};
