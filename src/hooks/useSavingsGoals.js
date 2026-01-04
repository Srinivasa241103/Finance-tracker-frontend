import { useState, useEffect, useCallback } from 'react';
import savingsGoalsService from '../services/savingsGoals';

/**
 * Custom hook for managing savings goals
 */
export const useSavingsGoals = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({
    activeGoals: 0,
    totalSaved: 0,
    averageProgress: 0,
    completedGoals: 0,
  });

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
    if (!goalsData || !Array.isArray(goalsData)) {
      console.error('Invalid goals data:', goalsData);
      return [];
    }

    return goalsData.map((goal) => {
      try {
        const progress = calculateProgress(goal.currentAmount || 0, goal.targetAmount || 1);
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
            goal.currentAmount || 0,
            goal.targetAmount || 1,
            goal.deadline
          ),
          onTrack: isOnTrack(goal.currentAmount || 0, goal.targetAmount || 1, goal.deadline),
          colorClass: colors.bg,
          progressColor: colors.progress,
        };
      } catch (err) {
        console.error('Error processing goal:', goal, err);
        return goal; // Return unprocessed goal if there's an error
      }
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
        console.warn('Goals API failed, no data available');
        setGoals([]);
      }

      // Process summary data
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value) {
        setSummary(summaryResponse.value);
      } else {
        console.warn('Goals summary API failed, calculating from goals');
        // Calculate summary from the goals we just fetched
        const currentGoals = goalsResponse.status === 'fulfilled' && goalsResponse.value?.goals
          ? goalsResponse.value.goals
          : [];
        const activeGoals = currentGoals.filter((g) => g.status === 'active');
        const completedGoals = currentGoals.filter((g) => g.status === 'completed');
        const totalSaved = activeGoals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
        const avgProgress =
          activeGoals.length > 0
            ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals.length)
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
      setGoals([]);
      setSummary({
        activeGoals: 0,
        totalSaved: 0,
        averageProgress: 0,
        completedGoals: 0,
      });
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

      // Refresh the list
      try {
        await fetchGoals();
      } catch (fetchErr) {
        console.error('Error refreshing goals after contribution:', fetchErr);
        // Don't fail the whole operation if refresh fails
      }

      return { success: true, data: updatedGoal };
    } catch (err) {
      console.error('Add contribution error:', err);
      return { success: false, error: err.message || 'Failed to add contribution' };
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
