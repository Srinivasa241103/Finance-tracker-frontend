import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import useBudget from '../hooks/useBudget';

const Budget = () => {
  const { loading, error, budgets, summary, progress, alerts, refresh, createBudget, updateBudget, deleteBudget } = useBudget();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Category options for budgets
  const categoryOptions = [
    'Food & Dining',
    'Shopping',
    'Transport',
    'Entertainment',
    'Bills & Utilities',
    'Groceries',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Other',
  ];

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    // Validation
    if (!formData.category || !formData.limit) {
      setFormError('Please fill in all required fields');
      setFormLoading(false);
      return;
    }

    const result = await createBudget({
      category: formData.category,
      limit: parseFloat(formData.limit),
      period: formData.period,
    });

    setFormLoading(false);

    if (result.success) {
      setShowCreateModal(false);
      setFormData({ category: '', limit: '', period: 'monthly' });
    } else {
      setFormError(result.error);
    }
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (!formData.category || !formData.limit) {
      setFormError('Please fill in all required fields');
      setFormLoading(false);
      return;
    }

    const result = await updateBudget(selectedBudget.id, {
      category: formData.category,
      limit: parseFloat(formData.limit),
      period: formData.period,
    });

    setFormLoading(false);

    if (result.success) {
      setShowEditModal(false);
      setSelectedBudget(null);
      setFormData({ category: '', limit: '', period: 'monthly' });
    } else {
      setFormError(result.error);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    const result = await deleteBudget(budgetId);
    if (!result.success) {
      alert(`Failed to delete budget: ${result.error}`);
    }
  };

  const openEditModal = (budget) => {
    setSelectedBudget(budget);
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period || 'monthly',
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedBudget(null);
    setFormData({ category: '', limit: '', period: 'monthly' });
    setFormError('');
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-rose-500';
    if (percentage >= 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 100) return 'text-rose-600';
    if (percentage >= 80) return 'text-amber-600';
    return 'text-emerald-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main className="ml-20 flex-1 p-8">
          <TopNavigation />
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
            <h3 className="text-rose-900 font-semibold mb-2">Error Loading Budget Data</h3>
            <p className="text-rose-700 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
              <Wallet className="w-8 h-8 text-slate-700" />
              <span>My Budget</span>
            </h1>
            <p className="text-slate-600 mt-1">Manage your monthly spending limits and track progress</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Budget</span>
          </button>
        </div>

        {/* Budget Alerts */}
        {alerts && alerts.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Budget Alerts</span>
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    alert.severity === 'high'
                      ? 'bg-rose-50 border border-rose-200'
                      : alert.severity === 'medium'
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                    alert.severity === 'high'
                      ? 'text-rose-600'
                      : alert.severity === 'medium'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Summary Cards */}
        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total Budget</div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{summary.totalBudget?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">For this month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total Spent</div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{summary.totalSpent?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {summary.totalBudget && summary.totalSpent
                    ? `${Math.round((summary.totalSpent / summary.totalBudget) * 100)}% of budget`
                    : 'No budget set'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Remaining</div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{summary.totalRemaining?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">Available to spend</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Budget Categories */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Budget by Category</h2>

          {budgets && budgets.length > 0 ? (
            <div className="space-y-6">
              {budgets.map((budget) => {
                const percentage = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;

                return (
                  <div key={budget.id} className="p-5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900">{budget.category}</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(budget)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBudget(budget.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-slate-600">
                            ₹{budget.spent?.toLocaleString() || '0'} of ₹{budget.limit?.toLocaleString() || '0'}
                          </span>
                          <span className={`font-semibold ${getProgressTextColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {budget.remaining !== undefined && (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                        <span className="text-slate-500">
                          {budget.period ? `Period: ${budget.period}` : 'Monthly'}
                        </span>
                        <span className={budget.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {budget.remaining >= 0 ? '₹' : '-₹'}
                          {Math.abs(budget.remaining || 0).toLocaleString()} remaining
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-1">No budgets created yet</p>
              <p className="text-slate-400 text-sm mb-4">Start by creating your first budget</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Budget</span>
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Budget Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {showEditModal ? 'Edit Budget' : 'Create New Budget'}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={showEditModal ? handleEditBudget : handleCreateBudget} className="space-y-4">
                {formError && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700">{formError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget Limit (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Period</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-slate-600">
                  <p><strong>Note:</strong> Budget will track expenses for the current month automatically.</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{showEditModal ? 'Update Budget' : 'Create Budget'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Budget;
