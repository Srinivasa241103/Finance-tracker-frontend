import { useState, useEffect, useCallback } from 'react';
import savingsGoalsService from '../services/savingsGoals';

// Fallback data when APIs are not available
const FALLBACK_DATA = {
  goals: [
    {
      _id: '1',
      name: 'Vacation Fund',
      description: 'Trip to Bali this summer',
      currentAmount: 7500,
      targetAmount: 10000,
      progress: 75,
      deadline: '2025-06-30',
      category: 'vacation',
      colorClass: 'bg-amber-50',
      progressColor: 'bg-amber-500',
      monthlyTarget: 500,
      onTrack: true,
      status: 'active',
    },
    {
      _id: '2',
      name: 'Emergency Fund',
      description: '6 months of expenses',
      currentAmount: 4200,
      targetAmount: 15000,
      progress: 28,
      deadline: '2025-12-31',
      category: 'emergency',
      colorClass: 'bg-rose-50',
      progressColor: 'bg-rose-500',
      monthlyTarget: 900,
      onTrack: false,
      status: 'active',
    },
    {
      _id: '3',
      name: 'New Laptop',
      description: 'MacBook Pro M3',
      currentAmount: 890,
      targetAmount: 2500,
      progress: 36,
      deadline: '2025-03-31',
      category: 'tech',
      colorClass: 'bg-blue-50',
      progressColor: 'bg-blue-500',
      monthlyTarget: 537,
      onTrack: true,
      status: 'active',
    },
    {
      _id: '4',
      name: 'House Down Payment',
      description: 'First home purchase',
      currentAmount: 1000,
      targetAmount: 50000,
      progress: 2,
      deadline: '2026-12-31',
      category: 'home',
      colorClass: 'bg-emerald-50',
      progressColor: 'bg-emerald-500',
      monthlyTarget: 2041,
      onTrack: false,
      status: 'active',
    },
    {
      _id: '5',
      name: 'Professional Course',
      description: 'AWS Certification',
      currentAmount: 0,
      targetAmount: 500,
      progress: 0,
      deadline: '2025-04-30',
      category: 'career',
      colorClass: 'bg-purple-50',
      progressColor: 'bg-purple-500',
      monthlyTarget: 125,
      onTrack: true,
      status: 'active',
    },
    {
      _id: '6',
      name: 'Camera Upgrade',
      targetAmount: 1200,
      currentAmount: 1200,
      status: 'completed',
      completedDate: '2024-10-15',
      category: 'tech',
    },
    {
      _id: '7',
      name: 'Concert Tickets',
      targetAmount: 300,
      currentAmount: 300,
      status: 'completed',
      completedDate: '2024-09-20',
      category: 'entertainment',
    },
  ],
  summary: {
    activeGoals: 5,
    totalSaved: 13590,
    averageProgress: 58,
    completedGoals: 2,
  },
};

/**
 * Custom hook for managing savings goals
 * Fetches goals data with fallback to dummy data
 */
export const useSavingsGoals = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState(FALLBACK_DATA.goals);
  const [summary, setSummary] = useState(FALLBACK_DATA.summary);

  /**
   * Calculate progress percentage
   */
  const calculateProgress = (current, target) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  /**
   * Calculate monthly target to reach goal
   */
  const calculateMonthlyTarget = (current, target, deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const monthsLeft = Math.max(
      1,
      Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24 * 30))
    );
    const remaining = target - current;
    return Math.ceil(remaining / monthsLeft);
  };

  /**
   * Determine if goal is on track
   */
  const isOnTrack = (current, target, deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const totalTime = deadlineDate - new Date(deadlineDate.getFullYear() - 1, deadlineDate.getMonth(), deadlineDate.getDate());
    const timePassed = now - new Date(deadlineDate.getFullYear() - 1, deadlineDate.getMonth(), deadlineDate.getDate());
    const expectedProgress = (timePassed / totalTime) * 100;
    const actualProgress = (current / target) * 100;
    return actualProgress >= expectedProgress - 10; // 10% tolerance
  };

  /**
   * Get color class based on category
   */
  const getCategoryColorClass = (category) => {
    const colorMap = {
      vacation: { bg: 'bg-amber-50', progress: 'bg-amber-500' },
      emergency: { bg: 'bg-rose-50', progress: 'bg-rose-500' },
      tech: { bg: 'bg-blue-50', progress: 'bg-blue-500' },
      home: { bg: 'bg-emerald-50', progress: 'bg-emerald-500' },
      career: { bg: 'bg-purple-50', progress: 'bg-purple-500' },
      entertainment: { bg: 'bg-pink-50', progress: 'bg-pink-500' },
    };
    return colorMap[category] || { bg: 'bg-slate-50', progress: 'bg-slate-500' };
  };

  /**
   * Process goals data from API
   */
  const processGoals = (goalsData) => {
    return goalsData.map((goal) => {
      const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
      const colors = getCategoryColorClass(goal.category);

      if (goal.status === 'completed') {
        return {
          ...goal,
          progress: 100,
        };
      }

      return {
        ...goal,
        progress,
        monthlyTarget: calculateMonthlyTarget(
          goal.currentAmount,
          goal.targetAmount,
          goal.deadline
        ),
        onTrack: isOnTrack(goal.currentAmount, goal.targetAmount, goal.deadline),
        colorClass: colors.bg,
        progressColor: colors.progress,
      };
    });
  };

  /**
   * Fetch savings goals
   */
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch goals and summary in parallel
      const [goalsResponse, summaryResponse] = await Promise.allSettled([
        savingsGoalsService.getSavingsGoals(),
        savingsGoalsService.getGoalsSummary(),
      ]);

      // Process goals data
      if (goalsResponse.status === 'fulfilled' && goalsResponse.value?.goals) {
        const processedGoals = processGoals(goalsResponse.value.goals);
        setGoals(processedGoals);
      } else {
        console.warn('Goals API failed, using fallback data');
        setGoals(FALLBACK_DATA.goals);
      }

      // Process summary data
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value) {
        setSummary(summaryResponse.value);
      } else {
        console.warn('Goals summary API failed, using fallback data');
        // Calculate summary from goals
        const activeGoals = goals.filter((g) => g.status === 'active');
        const completedGoals = goals.filter((g) => g.status === 'completed');
        const totalSaved = activeGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
        const avgProgress =
          activeGoals.length > 0
            ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
            : 0;

        setSummary({
          activeGoals: activeGoals.length,
          totalSaved,
          averageProgress: avgProgress,
          completedGoals: completedGoals.length,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load savings goals');
      console.error('Goals fetch error:', err);
      // Keep fallback data on error
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new savings goal
   */
  const createGoal = async (goalData) => {
    try {
      const newGoal = await savingsGoalsService.createSavingsGoal(goalData);
      await fetchGoals(); // Refresh the list
      return { success: true, data: newGoal };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Update a savings goal
   */
  const updateGoal = async (id, goalData) => {
    try {
      const updatedGoal = await savingsGoalsService.updateSavingsGoal(id, goalData);
      await fetchGoals(); // Refresh the list
      return { success: true, data: updatedGoal };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Delete a savings goal
   */
  const deleteGoal = async (id) => {
    try {
      await savingsGoalsService.deleteSavingsGoal(id);
      await fetchGoals(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Add contribution to a goal
   */
  const addContribution = async (id, amount, note = '') => {
    try {
      const updatedGoal = await savingsGoalsService.addContribution(id, amount, note);
      await fetchGoals(); // Refresh the list
      return { success: true, data: updatedGoal };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Mark goal as completed
   */
  const completeGoal = async (id) => {
    try {
      const updatedGoal = await savingsGoalsService.completeGoal(id);
      await fetchGoals(); // Refresh the list
      return { success: true, data: updatedGoal };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Refresh goals
   */
  const refresh = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    loading,
    error,
    goals,
    summary,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    completeGoal,
    refresh,
  };
};

export default useSavingsGoals;
