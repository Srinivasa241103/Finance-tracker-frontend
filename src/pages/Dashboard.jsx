import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  TrendingUp,
  AlertCircle,
  Plus,
  DollarSign,
  Award,
  Calendar,
  Bell,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import StatCard from '../components/StatCard';
import useDashboard from '../hooks/useDashboard';

const Dashboard = () => {
  const { loading, error, data, refresh } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
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
            <h3 className="text-rose-900 font-semibold mb-2">Error Loading Dashboard</h3>
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

  const { healthScore, stats, alerts, recentTransactions, topCategories, priorityGoals } = data || {};

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 ml-20">
        <TopNavigation />

        {/* Financial Health Score Card - TOP PRIORITY */}
        {healthScore ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 mb-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-slate-300 mb-2 flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Financial Health Score</span>
                </div>
                <div className="flex items-baseline space-x-4">
                  <div className="text-6xl font-bold">{healthScore.overall}</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {healthScore.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : healthScore.trend === 'down' ? (
                        <TrendingUp className="w-4 h-4 text-rose-400 transform rotate-180" />
                      ) : (
                        <span className="text-sm text-slate-300">-</span>
                      )}
                      <span className="text-sm text-slate-300">{healthScore.status}</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-blue-200 text-xs rounded-full border border-blue-400/30">
                      {healthScore.personalityType}
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-colors border border-white/20 text-sm font-medium">
                View Full Analysis →
              </button>
            </div>

            {/* Health Dimensions */}
            <div className="grid grid-cols-4 gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{healthScore.dimensions.spending}</div>
                <div className="text-xs text-slate-400">Spending Health</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{healthScore.dimensions.savings}</div>
                <div className="text-xs text-slate-400">Savings Health</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{healthScore.dimensions.consistency}</div>
                <div className="text-xs text-slate-400">Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{healthScore.dimensions.goalAchievement}</div>
                <div className="text-xs text-slate-400">Goal Achievement</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-8 mb-6 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Failed to load health score data</p>
            <button
              onClick={refresh}
              className="mt-3 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Alerts & Milestones */}
        {alerts && alerts.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-slate-600" />
                <span>Alerts & Milestones</span>
              </h3>
              <button className="text-sm text-slate-600 hover:text-slate-900">View All</button>
            </div>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    alert.severity === 'warning'
                      ? 'bg-amber-50 border border-amber-200'
                      : alert.severity === 'success'
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <span className="text-2xl">{alert.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{alert.description}</p>
                  </div>
                  <button className="text-xs text-slate-600 hover:text-slate-900 font-medium">
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Summary Stats */}
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Income */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total Income</div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{stats.totalIncome?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">{stats.incomeTransactions || 0} transactions</span>
                {stats.incomeChange !== null && stats.incomeChange !== undefined ? (
                  <span
                    className={`text-xs font-medium ${
                      stats.incomeChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {stats.incomeChange >= 0 ? '↑' : '↓'} {Math.abs(stats.incomeChange)}% vs last month
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">No comparison data</span>
                )}
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total Expenses</div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{stats.totalExpenses?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">{stats.expenseTransactions || 0} transactions</span>
                {stats.expenseChange !== null && stats.expenseChange !== undefined ? (
                  <span
                    className={`text-xs font-medium ${
                      stats.expenseChange <= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {stats.expenseChange <= 0 ? '↓' : '↑'} {Math.abs(stats.expenseChange)}% vs last month
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">No comparison data</span>
                )}
              </div>
            </div>

            {/* Net Savings */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Net Savings</div>
                    <div className="text-2xl font-bold text-slate-900">
                      ₹{stats.netSavings?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">This month</span>
                {stats.savingsChange !== null && stats.savingsChange !== undefined ? (
                  <span
                    className={`text-xs font-medium ${
                      stats.savingsChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {stats.savingsChange >= 0 ? '↑' : '↓'} {Math.abs(stats.savingsChange)}% vs last month
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">No comparison data</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 mb-8 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm">Failed to load statistics</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Transactions - 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </button>
            </div>
            {recentTransactions && recentTransactions.length > 0 ? (
              <>
                <div className="space-y-1">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{transaction.icon}</div>
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{transaction.name}</div>
                          <div className="text-xs text-slate-500">
                            {transaction.category} • {transaction.date}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-bold text-sm ${
                          transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount?.toLocaleString() || 0}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all font-medium text-sm flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Transaction</span>
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No transactions yet</p>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium inline-flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create your first transaction</span>
                </button>
              </div>
            )}
          </div>

          {/* Top Spending Categories - 1 column */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Spending</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                See Breakdown →
              </button>
            </div>
            {topCategories && topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">{category.name}</span>
                      <span className="text-slate-600">₹{category.value?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${category.percentage}%`,
                            backgroundColor: category.color,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 font-medium w-8 text-right">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No spending data yet</p>
                <p className="text-slate-400 text-xs mt-1">Start adding expenses to see breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-slate-600" />
              <span>Priority Savings Goals</span>
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Manage All Goals →
            </button>
          </div>
          {priorityGoals && priorityGoals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {priorityGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-3 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{goal.emoji || '🎯'}</span>
                      <span className="font-semibold text-slate-900">{goal.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">{goal.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${goal.color || 'bg-blue-500'} transition-all duration-300`}
                      style={{ width: `${goal.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">₹{goal.current?.toLocaleString() || 0}</span>
                    <span className="text-slate-900 font-semibold">₹{goal.target?.toLocaleString() || 0}</span>
                  </div>
                  {goal.daysRemaining && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {goal.daysRemaining} days remaining
                      </span>
                      <button className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded font-medium transition-colors">
                        Contribute
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-1">No savings goals yet</p>
              <p className="text-slate-400 text-sm mb-4">Create your first goal to start saving</p>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium inline-flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Goal</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions Floating Button */}
        <button className="fixed bottom-8 right-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50">
          <Plus className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
