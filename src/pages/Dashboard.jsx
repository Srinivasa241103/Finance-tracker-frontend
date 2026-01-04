import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  ChevronDown,
  DollarSign,
  PieChart,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import StatCard from '../components/StatCard';
import useDashboard from '../hooks/useDashboard';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const { loading, error, data, refresh } = useDashboard(selectedPeriod);

  // Default/fallback data for when backend is not ready
  const defaultSpendingTrend = [
    { day: 'Mon', amount: 420 },
    { day: 'Tue', amount: 680 },
    { day: 'Wed', amount: 450 },
    { day: 'Thu', amount: 820 },
    { day: 'Fri', amount: 550 },
    { day: 'Sat', amount: 920 },
    { day: 'Sun', amount: 720 },
  ];

  const defaultCategoryData = [
    { name: 'Food', value: 856, color: '#f59e0b' },
    { name: 'Transport', value: 512, color: '#3b82f6' },
    { name: 'Shopping', value: 734, color: '#8b5cf6' },
    { name: 'Bills', value: 1080, color: '#ef4444' },
  ];

  const defaultTransactions = [
    {
      name: 'Salary Deposit',
      category: 'Income',
      date: 'Dec 15',
      amount: '5,240.00',
      type: 'income',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
    },
    {
      name: 'Whole Foods',
      category: 'Groceries',
      date: 'Dec 14',
      amount: '87.50',
      type: 'expense',
      icon: <PieChart className="w-5 h-5 text-rose-600" />,
    },
    {
      name: 'Netflix',
      category: 'Entertainment',
      date: 'Dec 13',
      amount: '15.99',
      type: 'expense',
      icon: <PieChart className="w-5 h-5 text-rose-600" />,
    },
    {
      name: 'Uber',
      category: 'Transport',
      date: 'Dec 12',
      amount: '24.30',
      type: 'expense',
      icon: <PieChart className="w-5 h-5 text-rose-600" />,
    },
  ];

  const defaultGoals = [
    {
      name: 'Vacation Fund',
      current: 7500,
      target: 10000,
      progress: 75,
      color: 'bg-amber-500',
    },
    {
      name: 'Emergency Fund',
      current: 4200,
      target: 15000,
      progress: 28,
      color: 'bg-emerald-500',
    },
    {
      name: 'New Laptop',
      current: 890,
      target: 2500,
      progress: 36,
      color: 'bg-blue-500',
    },
  ];

  // Use actual data or fallback to default
  const stats = data.stats || {
    totalBalance: 12458.5,
    totalIncome: 5240.0,
    totalExpenses: 3182.0,
    balanceChange: 12.5,
    incomeTransactions: 3,
    expenseTransactions: 42,
    savingsGoal: {
      name: 'Vacation Fund',
      current: 7500,
      target: 10000,
      progress: 75,
    },
  };

  const spendingTrendData = data.spendingTrend.length > 0 ? data.spendingTrend : defaultSpendingTrend;
  const categoryData = data.categoryBreakdown.length > 0 ? data.categoryBreakdown : defaultCategoryData;
  const recentTransactions = data.recentTransactions.length > 0 ? data.recentTransactions : defaultTransactions;
  const savingsGoals = data.goals.length > 0 ? data.goals : defaultGoals;

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8 ml-20">
        <TopNavigation />

        {/* Period Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                {selectedPeriod === 'thisMonth' ? 'This Month' : selectedPeriod}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value={`₹${stats.totalBalance.toLocaleString()}`}
            change={`${stats.balanceChange}%`}
            icon={Wallet}
            footer={`+₹${(stats.totalBalance * (stats.balanceChange / 100)).toFixed(2)} from last month`}
          />

          <StatCard
            title="Total Income"
            value={`₹${stats.totalIncome.toLocaleString()}`}
            changeLabel="This Month"
            icon={ArrowUpRight}
            iconBgColor="bg-emerald-600"
            bgColor="bg-emerald-50"
            borderColor="border-emerald-100"
            footer={`${stats.incomeTransactions} transactions`}
          />

          <StatCard
            title="Total Expenses"
            value={`₹${stats.totalExpenses.toLocaleString()}`}
            changeLabel="This Month"
            icon={ArrowDownRight}
            iconBgColor="bg-rose-600"
            bgColor="bg-rose-50"
            borderColor="border-rose-100"
            footer={`${stats.expenseTransactions} transactions`}
          />

          <StatCard
            title={stats.savingsGoal.name}
            value={`₹${stats.savingsGoal.current.toLocaleString()}`}
            changeLabel={`${stats.savingsGoal.progress}%`}
            icon={Target}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
            showProgress={true}
            progressValue={stats.savingsGoal.progress}
            progressColor="bg-amber-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Spending Trend */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Spending Trend</h2>
              <button className="text-sm text-slate-600 hover:text-slate-900">View All</button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={spendingTrendData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0f172a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpending)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Spending by Category</h2>
              <button className="text-sm text-slate-600 hover:text-slate-900">View All</button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm text-slate-600">{cat.name}</span>
                  <span className="text-sm font-medium text-slate-900 ml-auto">₹{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions & Savings Goals */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <button className="text-sm text-slate-600 hover:text-slate-900">View All</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                      }`}
                    >
                      {transaction.icon}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{transaction.name}</div>
                      <div className="text-sm text-slate-500">
                        {transaction.category} • {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Goals */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Savings Goals</h2>
              <button className="text-slate-600 hover:text-slate-900">
                <Target className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {savingsGoals.map((goal, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{goal.name}</span>
                    <span className="text-sm text-slate-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${goal.color}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">₹{goal.current.toLocaleString()}</span>
                    <span className="text-slate-900 font-medium">₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors font-medium">
              + Add New Goal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
