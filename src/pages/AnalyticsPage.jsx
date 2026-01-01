import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Info,
  AlertCircle,
  CheckCircle,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import useAnalytics from '../hooks/useAnalytics';
import { useSidebar } from '../contexts/SidebarContext';

const AnalyticsPage = () => {
  const { isCollapsed } = useSidebar();
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const {
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
  } = useAnalytics();

  const periodOptions = ['This Week', 'This Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

  const handlePeriodChange = (period) => {
    changePeriod(period);
    setShowPeriodDropdown(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main
          className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          <TopNavigation />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
              <p className="text-slate-600">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main
        className={`flex-1 p-8 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <TopNavigation />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
              <p className="text-slate-600 mt-1">Understand your spending patterns and financial health</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <Calendar className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700 font-medium">{selectedPeriod}</span>
                <ChevronDown className="w-5 h-5 text-slate-600" />
              </button>

              {showPeriodDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  {periodOptions.map((period) => (
                    <button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${
                        period === selectedPeriod ? 'bg-slate-100 font-medium' : ''
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        {/* Financial Health Score */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Financial Health Score</h2>
              <p className="text-slate-300">Based on your spending, saving, and goal progress</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{financialHealth.overallScore || 0}</div>
              <div className="text-slate-300 text-sm mt-1">out of 100</div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                {financialHealth.metrics?.spendingControl?.icon === 'check' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm">Spending Control</span>
              </div>
              <div className="text-2xl font-bold">
                {financialHealth.metrics?.spendingControl?.score || 0}/100
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {financialHealth.metrics?.spendingControl?.status || 'N/A'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                {financialHealth.metrics?.savingsRate?.icon === 'check' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm">Savings Rate</span>
              </div>
              <div className="text-2xl font-bold">{financialHealth.metrics?.savingsRate?.score || 0}/100</div>
              <div className="text-xs text-slate-300 mt-1">
                {financialHealth.metrics?.savingsRate?.status || 'N/A'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                {financialHealth.metrics?.budgetAdherence?.icon === 'check' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm">Budget Adherence</span>
              </div>
              <div className="text-2xl font-bold">
                {financialHealth.metrics?.budgetAdherence?.score || 0}/100
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {financialHealth.metrics?.budgetAdherence?.status || 'N/A'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                {financialHealth.metrics?.goalProgress?.icon === 'check' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm">Goal Progress</span>
              </div>
              <div className="text-2xl font-bold">{financialHealth.metrics?.goalProgress?.score || 0}/100</div>
              <div className="text-xs text-slate-300 mt-1">
                {financialHealth.metrics?.goalProgress?.status || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Income vs Expenses Trend */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Income vs Expenses</h2>
              <p className="text-sm text-slate-600">Monthly comparison over the last 6 months</p>
            </div>
          </div>
          {incomeExpenseTrend && incomeExpenseTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={incomeExpenseTrend}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">No data available</div>
          )}
        </div>

        {/* Category Analysis & Budget Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Spending by Category</h2>
            {categoryBreakdown && categoryBreakdown.length > 0 ? (
              <>
                <div className="flex justify-center mb-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">₹{cat.value.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">{cat.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">No data available</div>
            )}
          </div>

          {/* Budget vs Actual */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Budget vs Actual Spending</h2>
            {budgetComparison && budgetComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#cbd5e1" name="Budget" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="actual" fill="#0f172a" name="Actual" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">No data available</div>
            )}
          </div>
        </div>

        {/* Financial Personality Comparison */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Your Financial Personality</h2>
              <p className="text-sm text-slate-600">Comparison with ideal financial behavior patterns</p>
            </div>
            <button className="flex items-center space-x-1 text-slate-600 hover:text-slate-900">
              <Info className="w-5 h-5" />
            </button>
          </div>

          {financialPersonality && financialPersonality.data && financialPersonality.data.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={financialPersonality.data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="category" stroke="#64748b" />
                    <PolarRadiusAxis stroke="#64748b" />
                    <Radar
                      name="Your Score"
                      dataKey="you"
                      stroke="#0f172a"
                      fill="#0f172a"
                      fillOpacity={0.3}
                    />
                    <Radar name="Ideal" dataKey="ideal" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4">Insights & Recommendations</h3>

                {financialPersonality.insights && financialPersonality.insights.length > 0 ? (
                  financialPersonality.insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 ${
                        insight.type === 'success'
                          ? 'bg-emerald-50 border-emerald-100'
                          : insight.type === 'warning'
                          ? 'bg-amber-50 border-amber-100'
                          : 'bg-blue-50 border-blue-100'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {insight.type === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : insight.type === 'warning' ? (
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div
                            className={`font-medium mb-1 ${
                              insight.type === 'success'
                                ? 'text-emerald-900'
                                : insight.type === 'warning'
                                ? 'text-amber-900'
                                : 'text-blue-900'
                            }`}
                          >
                            {insight.title}
                          </div>
                          <div
                            className={`text-sm ${
                              insight.type === 'success'
                                ? 'text-emerald-700'
                                : insight.type === 'warning'
                                ? 'text-amber-700'
                                : 'text-blue-700'
                            }`}
                          >
                            {insight.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-sm">No insights available</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">No data available</div>
          )}
        </div>

        {/* Top Spending Merchants */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Top Spending Merchants</h2>
          {topMerchants && topMerchants.length > 0 ? (
            <div className="space-y-4">
              {topMerchants.map((merchant, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-2xl font-bold text-slate-300">#{idx + 1}</div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{merchant.name}</div>
                      <div className="text-sm text-slate-500">{merchant.transactions} transactions</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{merchant.amount.toLocaleString()}</div>
                    <div className="w-32 bg-slate-100 rounded-full h-2 mt-2">
                      <div
                        className="bg-slate-900 h-2 rounded-full"
                        style={{ width: `${merchant.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500">No data available</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
