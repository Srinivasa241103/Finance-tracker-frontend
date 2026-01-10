import React, { useState } from 'react';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  X,
  Plane,
  Home,
  Laptop,
  Heart,
  Briefcase,
  AlertCircle,
  Music,
  Check,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import useSavingsGoals from '../hooks/useSavingsGoals';
import { OnTrackBadge, CompletedCheckmark } from '../components/CustomCheckmark';
import './SavingsGoalsPage.css';

const SavingsGoalsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: '',
    description: '',
  });
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const {
    loading,
    error,
    goals,
    summary,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    completeGoal,
  } = useSavingsGoals();

  const categories = [
    { icon: Plane, value: 'vacation', label: 'Travel' },
    { icon: Heart, value: 'emergency', label: 'Emergency' },
    { icon: Laptop, value: 'tech', label: 'Tech' },
    { icon: Home, value: 'home', label: 'Home' },
    { icon: Briefcase, value: 'career', label: 'Career' },
    { icon: Music, value: 'entertainment', label: 'Fun' },
  ];

  const getCategoryIcon = (category) => {
    const categoryData = categories.find((cat) => cat.value === category);
    if (!categoryData) return <Target className="w-6 h-6" />;
    const Icon = categoryData.icon;
    return <Icon className="w-6 h-6" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const result = await createGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || 0),
    });

    if (result.success) {
      setShowAddModal(false);
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: '',
        description: '',
      });
      setSelectedCategory('');
    } else {
      alert('Failed to create goal: ' + result.error);
    }
  };

  const handleEditClick = (goal) => {
    setSelectedGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
      description: goal.description || '',
    });
    setSelectedCategory(goal.category);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const goalId = selectedGoal?.goalId || selectedGoal?.id || selectedGoal?._id;
    const result = await updateGoal(goalId, {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
    });

    if (result.success) {
      setShowEditModal(false);
      setSelectedGoal(null);
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: '',
        description: '',
      });
      setSelectedCategory('');
    } else {
      alert('Failed to update goal: ' + result.error);
    }
  };

  const handleDeleteClick = (goal) => {
    setSelectedGoal(goal);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const goalId = selectedGoal?.goalId || selectedGoal?.id || selectedGoal?._id;
    const result = await deleteGoal(goalId);

    if (result.success) {
      setShowDeleteModal(false);
      setSelectedGoal(null);
    } else {
      alert('Failed to delete goal: ' + result.error);
    }
  };

  const handleContributionClick = (goal) => {
    setSelectedGoal(goal);
    setContributionAmount('');
    setContributionNote('');
    setShowContributionModal(true);
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();

    // Get the goal ID - handle different possible field names
    const goalId = selectedGoal?.goalId || selectedGoal?.id || selectedGoal?._id;

    console.log('Selected goal:', selectedGoal);
    console.log('Goal ID:', goalId);
    console.log('Contribution amount:', parseFloat(contributionAmount));
    console.log('Contribution note:', contributionNote);

    if (!goalId) {
      alert('Error: Goal ID not found');
      return;
    }

    const result = await addContribution(
      goalId,
      parseFloat(contributionAmount),
      contributionNote
    );

    if (result.success) {
      setShowContributionModal(false);
      setSelectedGoal(null);
      setContributionAmount('');
      setContributionNote('');

      // Show success toast
      setShowSuccessToast(true);

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    } else {
      alert('Failed to add contribution: ' + result.error);
    }
  };

  const handleCompleteGoal = async (goalId) => {
    if (window.confirm('Mark this goal as completed?')) {
      const result = await completeGoal(goalId);
      if (!result.success) {
        alert('Failed to complete goal: ' + result.error);
      }
    }
  };

  const activeGoals = Array.isArray(goals) ? goals.filter((goal) => goal?.status === 'active') : [];
  const completedGoals = Array.isArray(goals) ? goals.filter((goal) => goal?.status === 'completed') : [];

  console.log('Goals state:', goals);
  console.log('Active goals:', activeGoals);
  console.log('Completed goals:', completedGoals);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-20">
          <TopNavigation />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
              <p className="text-slate-600">Loading savings goals...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-20">
          <TopNavigation />
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 mt-8">
            <h3 className="text-rose-900 font-semibold mb-2">Error Loading Goals</h3>
            <p className="text-rose-700">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 ml-20">
        <TopNavigation />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Savings Goals</h1>
              <p className="text-slate-600 mt-1">Track your progress towards financial milestones</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Goal</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-emerald-600 font-medium text-sm">Active</span>
            </div>
            <div className="text-sm text-slate-500 mb-1">Active Goals</div>
            <div className="text-3xl font-bold text-slate-900">{summary.activeGoals || 0}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-medium text-sm">Total</span>
            </div>
            <div className="text-sm text-slate-500 mb-1">Total Saved</div>
            <div className="text-3xl font-bold text-slate-900">
              ₹{summary.totalSaved?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-amber-600 font-medium text-sm">Avg Progress</span>
            </div>
            <div className="text-sm text-slate-500 mb-1">Average Progress</div>
            <div className="text-3xl font-bold text-slate-900">{summary.averageProgress || 0}%</div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Active Goals</h2>
          {activeGoals.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-16 text-center">
              <div className="max-w-md mx-auto">
                <Target className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No Active Goals</h3>
                <p className="text-slate-600 mb-6">
                  You don't have any active savings goals. Please add a goal to start tracking your financial milestones!
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your Goal</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {activeGoals.map((goal) => {
                if (!goal) return null;
                const goalId = goal?.goalId || goal?.id || goal?._id;
                if (!goalId) return null;

                return (
                <div
                  key={goalId}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className={`p-6 ${goal.colorClass || 'bg-slate-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white/90 rounded-xl flex items-center justify-center">
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{goal.name || 'Unnamed Goal'}</h3>
                          <p className="text-sm text-slate-600 mt-1">{goal.description || ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(goal)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(goal)}
                          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-rose-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-slate-500">Progress</div>
                        <div className="text-2xl font-bold text-slate-900">
                          ₹{goal.currentAmount?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">Goal</div>
                        <div className="text-2xl font-bold text-slate-900">
                          ₹{goal.targetAmount?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-slate-900">{goal.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            goal.progressColor || 'bg-slate-500'
                          }`}
                          style={{ width: `${goal.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-6 flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Due {formatDate(goal.deadline)}</span>
                      </div>
                      {goal.onTrack ? (
                        <OnTrackBadge />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-600 font-medium">Needs attention</span>
                        </div>
                      )}
                    </div>

                    {/* Monthly Contribution */}
                    <div className="mt-4 bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Recommended monthly save</span>
                        <span className="text-lg font-bold text-slate-900">
                          ₹{goal.monthlyTarget || 0}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => handleContributionClick(goal)}
                        className="flex-1 py-3 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200 font-medium"
                      >
                        Add Contribution
                      </button>
                      {goal.progress >= 100 && (
                        <button
                          onClick={() => handleCompleteGoal(goalId)}
                          className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Completed Goals</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {completedGoals.map((goal) => {
                if (!goal) return null;
                const goalId = goal?.goalId || goal?.id || goal?._id;
                if (!goalId) return null;

                return (
                <div key={goalId} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <CompletedCheckmark />
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{goal.name || 'Unnamed Goal'}</h3>
                  <div className="text-2xl font-bold text-slate-900 mb-2">
                    ₹{goal.targetAmount?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-slate-500">
                    Completed on {goal.completedDate ? new Date(goal.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Create New Goal</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Summer Vacation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="grid grid-cols-6 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg hover:border-slate-900 transition-all ${
                          selectedCategory === cat.value
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs mt-1">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="10,000"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add notes about your goal..."
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Goal</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="grid grid-cols-6 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg hover:border-slate-900 transition-all ${
                          selectedCategory === cat.value
                            ? 'border-slate-900 bg-slate-50'
                            : 'border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs mt-1">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Date <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Delete Goal</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete this goal? This action cannot be undone.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="font-medium text-slate-900">{selectedGoal.name}</div>
                <div className="text-sm text-slate-500 mt-1">
                  ₹{selectedGoal.currentAmount?.toLocaleString() || 0} of ₹
                  {selectedGoal.targetAmount?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contribution Modal */}
      {showContributionModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Contribution</h2>
              <button
                onClick={() => setShowContributionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4">
                <div className="font-medium text-slate-900">{selectedGoal.name}</div>
                <div className="text-sm text-slate-500 mt-1">
                  Current: ₹{selectedGoal.currentAmount?.toLocaleString() || 0} / ₹
                  {selectedGoal.targetAmount?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <form onSubmit={handleContributionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="500"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  placeholder="Add a note for this contribution..."
                  rows="2"
                  value={contributionNote}
                  onChange={(e) => setContributionNote(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContributionModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
                >
                  Add Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 min-w-[320px]">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-scale-in">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold">Contribution Added!</p>
              <p className="text-sm text-emerald-100">Your savings goal has been updated.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsPage;
