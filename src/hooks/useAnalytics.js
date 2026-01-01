import { useState, useEffect, useCallback } from 'react';
import analyticsService from '../services/analytics';

// Fallback data when APIs are not available
const FALLBACK_DATA = {
  financialHealth: {
    overallScore: 78,
    metrics: {
      spendingControl: { score: 85, status: 'Well managed', icon: 'check' },
      savingsRate: { score: 72, status: 'Good progress', icon: 'check' },
      budgetAdherence: { score: 68, status: 'Needs improvement', icon: 'alert' },
      goalProgress: { score: 88, status: 'Excellent', icon: 'check' },
    },
  },
  incomeExpenseTrend: [
    { month: 'Jul', income: 4800, expense: 3200 },
    { month: 'Aug', income: 5200, expense: 3500 },
    { month: 'Sep', income: 4900, expense: 3100 },
    { month: 'Oct', income: 5400, expense: 3600 },
    { month: 'Nov', income: 5100, expense: 3300 },
    { month: 'Dec', income: 5240, expense: 3182 },
  ],
  categoryBreakdown: [
    { name: 'Food & Dining', value: 856, color: '#f59e0b', percentage: 27 },
    { name: 'Transport', value: 512, color: '#3b82f6', percentage: 16 },
    { name: 'Shopping', value: 734, color: '#8b5cf6', percentage: 23 },
    { name: 'Bills & Utilities', value: 1080, color: '#ef4444', percentage: 34 },
  ],
  budgetComparison: [
    { category: 'Food', budget: 900, actual: 856 },
    { category: 'Transport', budget: 500, actual: 512 },
    { category: 'Shopping', budget: 600, actual: 734 },
    { category: 'Bills', budget: 1100, actual: 1080 },
  ],
  financialPersonality: {
    data: [
      { category: 'Saving', you: 88, ideal: 75 },
      { category: 'Budgeting', you: 72, ideal: 85 },
      { category: 'Investing', you: 45, ideal: 65 },
      { category: 'Debt Management', you: 90, ideal: 95 },
      { category: 'Financial Planning', you: 68, ideal: 80 },
    ],
    insights: [
      {
        type: 'success',
        title: 'Strong Saver',
        description: 'Your savings rate of 40% exceeds the ideal benchmark of 30%. Great job!',
      },
      {
        type: 'warning',
        title: 'Impulse Spending',
        description: 'You tend to make more impulse purchases than ideal. Try the 24-hour rule before buying.',
      },
      {
        type: 'info',
        title: 'Goal-Oriented',
        description: "You're on track with 88% of your financial goals. Consider adding an emergency fund.",
      },
    ],
  },
  topMerchants: [
    { name: 'Whole Foods', transactions: 24, amount: 856, percentage: 100 },
    { name: 'Amazon', transactions: 12, amount: 734, percentage: 86 },
    { name: 'Uber', transactions: 18, amount: 512, percentage: 60 },
    { name: 'Netflix', transactions: 1, amount: 16, percentage: 2 },
    { name: 'Starbucks', transactions: 16, amount: 92, percentage: 11 },
  ],
};

/**
 * Custom hook for managing analytics data
 * Fetches analytics data with fallback to dummy data
 */
export const useAnalytics = (period = 'This Month') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialHealth, setFinancialHealth] = useState(FALLBACK_DATA.financialHealth);
  const [incomeExpenseTrend, setIncomeExpenseTrend] = useState(FALLBACK_DATA.incomeExpenseTrend);
  const [categoryBreakdown, setCategoryBreakdown] = useState(FALLBACK_DATA.categoryBreakdown);
  const [budgetComparison, setBudgetComparison] = useState(FALLBACK_DATA.budgetComparison);
  const [financialPersonality, setFinancialPersonality] = useState(FALLBACK_DATA.financialPersonality);
  const [topMerchants, setTopMerchants] = useState(FALLBACK_DATA.topMerchants);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  /**
   * Fetch all analytics data
   */
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all analytics data in parallel
      const [
        healthData,
        trendData,
        categoryData,
        budgetData,
        personalityData,
        merchantsData,
      ] = await Promise.allSettled([
        analyticsService.getFinancialHealth(),
        analyticsService.getIncomeExpenseTrend({ period: selectedPeriod }),
        analyticsService.getCategoryBreakdown({ period: selectedPeriod }),
        analyticsService.getBudgetComparison(),
        analyticsService.getFinancialPersonality(),
        analyticsService.getTopMerchants({ limit: 5, period: selectedPeriod }),
      ]);

      // Set data with fallback
      if (healthData.status === 'fulfilled' && healthData.value) {
        setFinancialHealth(healthData.value);
      } else {
        console.warn('Financial health API failed, using fallback data');
      }

      if (trendData.status === 'fulfilled' && trendData.value?.data?.length > 0) {
        setIncomeExpenseTrend(trendData.value.data);
      } else {
        console.warn('Income/Expense trend API failed, using fallback data');
      }

      if (categoryData.status === 'fulfilled' && categoryData.value?.data?.length > 0) {
        setCategoryBreakdown(categoryData.value.data);
      } else {
        console.warn('Category breakdown API failed, using fallback data');
      }

      if (budgetData.status === 'fulfilled' && budgetData.value?.data?.length > 0) {
        setBudgetComparison(budgetData.value.data);
      } else {
        console.warn('Budget comparison API failed, using fallback data');
      }

      if (personalityData.status === 'fulfilled' && personalityData.value) {
        setFinancialPersonality(personalityData.value);
      } else {
        console.warn('Financial personality API failed, using fallback data');
      }

      if (merchantsData.status === 'fulfilled' && merchantsData.value?.data?.length > 0) {
        setTopMerchants(merchantsData.value.data);
      } else {
        console.warn('Top merchants API failed, using fallback data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics data');
      console.error('Analytics fetch error:', err);
      // Keep fallback data on error
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  /**
   * Refresh analytics data
   */
  const refresh = useCallback(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  /**
   * Change period filter
   */
  const changePeriod = useCallback((newPeriod) => {
    setSelectedPeriod(newPeriod);
  }, []);

  // Fetch analytics data when period changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return {
    loading,
    error,
    financialHealth,
    incomeExpenseTrend,
    categoryBreakdown,
    budgetComparison,
    financialPersonality,
    topMerchants,
    selectedPeriod,
    changePeriod,
    refresh,
  };
};

export default useAnalytics;
