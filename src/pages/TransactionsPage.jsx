import React, { useState, useEffect, useRef } from 'react';
import {
  Filter,
  Search,
  Download,
  Plus,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Film,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit,
  Trash2,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import useTransactions from '../hooks/useTransactions';
import { useSidebar } from '../contexts/SidebarContext';

const TransactionsPage = () => {
  const { isCollapsed } = useSidebar();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [exchangeRate, setExchangeRate] = useState(83.5); // Default USD to INR rate
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showFilterCategoryDropdown, setShowFilterCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);
  const filterCategoryDropdownRef = useRef(null);
  const actionMenuRef = useRef(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    currency: 'INR',
  });

  // Use the custom hook
  const {
    loading,
    error,
    transactions,
    summary,
    pagination,
    filters,
    updateFilters,
    changePage,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    exportTransactions,
  } = useTransactions();

  // Category options
  const categoryOptions = {
    expense: [
      { value: 'Food & Dining', icon: Utensils, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { value: 'Groceries', icon: ShoppingCart, color: 'text-green-600', bgColor: 'bg-green-50' },
      { value: 'Transport', icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { value: 'Shopping', icon: ShoppingCart, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      { value: 'Bills & Utilities', icon: Home, color: 'text-red-600', bgColor: 'bg-red-50' },
      { value: 'Entertainment', icon: Film, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    ],
    income: [
      { value: 'Salary', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      { value: 'Freelance', icon: DollarSign, color: 'text-teal-600', bgColor: 'bg-teal-50' },
      { value: 'Investment', icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    ],
  };

  // Icon mapping for categories
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': <Utensils className="w-5 h-5" />,
      'Groceries': <ShoppingCart className="w-5 h-5" />,
      'Transport': <Car className="w-5 h-5" />,
      'Entertainment': <Film className="w-5 h-5" />,
      'Bills & Utilities': <Home className="w-5 h-5" />,
      'Salary': <DollarSign className="w-5 h-5" />,
      'Freelance': <DollarSign className="w-5 h-5" />,
      'Income': <DollarSign className="w-5 h-5" />,
    };
    return iconMap[category] || <DollarSign className="w-5 h-5" />;
  };

  // Get currency symbol - INR (₹) as standard
  const getCurrencySymbol = (currency) => {
    // Always return ₹ as standard, regardless of currency type
    return '₹';
  };

  // Get current category options based on transaction type
  const getCurrentCategoryOptions = () => {
    return categoryOptions[formData.type] || categoryOptions.expense;
  };

  // Get selected category details
  const getSelectedCategory = () => {
    const options = getCurrentCategoryOptions();
    return options.find((opt) => opt.value === formData.category);
  };

  // Handle filter change
  const handleFilterChange = (type) => {
    setSelectedFilter(type);
    updateFilters({ type: type === 'All' ? '' : type.toLowerCase() });
  };

  // Handle search
  const handleSearch = (e) => {
    updateFilters({ search: e.target.value });
  };

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Using a free API to get real-time USD to INR rate
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.INR) {
          setExchangeRate(data.rates.INR);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Keep default rate of 83.5 if API fails
      }
    };

    fetchExchangeRate();
    // Refresh exchange rate every 30 minutes
    const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (filterCategoryDropdownRef.current && !filterCategoryDropdownRef.current.contains(event.target)) {
        setShowFilterCategoryDropdown(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle currency change
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setFormData({ ...formData, currency, amount: '' });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setShowCategoryDropdown(false);
  };

  // Handle transaction type change
  const handleTypeChange = (type) => {
    setFormData({ ...formData, type, category: '' }); // Reset category when type changes
    setShowCategoryDropdown(false);
  };

  // Calculate converted amount
  const getConvertedAmount = () => {
    if (selectedCurrency === 'USD' && formData.amount) {
      const inrAmount = (parseFloat(formData.amount) * exchangeRate).toFixed(2);
      return inrAmount;
    }
    return null;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send to backend
    const transactionData = {
      ...formData,
      currency: selectedCurrency,
      // If USD, also send the INR equivalent for backend storage
      amountInINR: selectedCurrency === 'USD' ? parseFloat(getConvertedAmount()) : parseFloat(formData.amount),
      originalAmount: parseFloat(formData.amount),
      exchangeRate: selectedCurrency === 'USD' ? exchangeRate : 1,
    };

    const result = await createTransaction(transactionData);

    if (result.success) {
      setShowAddModal(false);
      setSelectedCurrency('INR');
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        merchant: '',
        currency: 'INR',
      });
    } else {
      alert('Failed to create transaction: ' + result.error);
    }
  };

  // Handle export
  const handleExport = async () => {
    const result = await exportTransactions();
    if (!result.success) {
      alert('Failed to export transactions: ' + result.error);
    }
  };

  // Handle edit transaction
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0],
      merchant: transaction.merchant || '',
      currency: transaction.currency || 'INR',
    });
    setSelectedCurrency(transaction.currency || 'INR');
    setShowActionMenu(null);
    setShowEditModal(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      ...formData,
      currency: selectedCurrency,
      amountInINR: selectedCurrency === 'USD' ? parseFloat(getConvertedAmount()) : parseFloat(formData.amount),
      originalAmount: parseFloat(formData.amount),
      exchangeRate: selectedCurrency === 'USD' ? exchangeRate : 1,
    };

    const result = await updateTransaction(selectedTransaction._id || selectedTransaction.id, transactionData);

    if (result.success) {
      setShowEditModal(false);
      setSelectedTransaction(null);
      setSelectedCurrency('INR');
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        merchant: '',
        currency: 'INR',
      });
    } else {
      alert('Failed to update transaction: ' + result.error);
    }
  };

  // Handle delete click
  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowActionMenu(null);
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    const result = await deleteTransaction(selectedTransaction._id || selectedTransaction.id);

    if (result.success) {
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    } else {
      alert('Failed to delete transaction: ' + result.error);
    }
  };

  // Toggle action menu
  const toggleActionMenu = (transactionId) => {
    setShowActionMenu(showActionMenu === transactionId ? null : transactionId);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <main
          className={`flex-1 p-8 flex items-center justify-center transition-all duration-300 ease-in-out ${
            isCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
            <p className="text-slate-600">Loading transactions...</p>
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
              <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
              <p className="text-slate-600 mt-1">Track and manage all your transactions</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 mb-1">Total Transactions</div>
                <div className="text-3xl font-bold text-slate-900">{summary.totalTransactions}</div>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-600 font-medium">
                    {summary.incomeCount + summary.expenseCount} this period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-emerald-700 mb-1">Total Income</div>
                <div className="text-3xl font-bold text-emerald-900">
                  ₹{summary.totalIncome.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600 mt-2">{summary.incomeCount} transactions</div>
              </div>
              <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-rose-700 mb-1">Total Expenses</div>
                <div className="text-3xl font-bold text-rose-900">
                  ₹{summary.totalExpenses.toLocaleString()}
                </div>
                <div className="text-sm text-rose-600 mt-2">{summary.expenseCount} transactions</div>
              </div>
              <div className="w-12 h-12 bg-rose-200 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-rose-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-3">
              {['All', 'Income', 'Expense'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Filters</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                <button className="flex items-center justify-between w-full px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700">Last 30 days</span>
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="relative" ref={filterCategoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowFilterCategoryDropdown(!showFilterCategoryDropdown)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-between focus:ring-2 focus:ring-slate-900 outline-none"
                  >
                    <span className="text-slate-700 font-medium">
                      {filters.category || 'All Categories'}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 transition-transform ${
                        showFilterCategoryDropdown ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showFilterCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            updateFilters({ category: '' });
                            setShowFilterCategoryDropdown(false);
                          }}
                          className={`w-full flex items-center px-3 py-2 rounded-lg transition-all ${
                            !filters.category
                              ? 'bg-slate-100 border border-slate-300 font-medium'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          All Categories
                          {!filters.category && <Check className="w-4 h-4 ml-auto" />}
                        </button>

                        <div className="border-t border-slate-200 my-2" />

                        {[...categoryOptions.expense, ...categoryOptions.income].map((option) => {
                          const Icon = option.icon;
                          const isSelected = filters.category === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                updateFilters({ category: option.value });
                                setShowFilterCategoryDropdown(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                                isSelected
                                  ? 'bg-slate-100 border border-slate-300'
                                  : 'hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${option.bgColor}`}>
                                <Icon className={`w-4 h-4 ${option.color}`} />
                              </div>
                              <span className="flex-1 text-left font-medium text-slate-900">
                                {option.value}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount}
                    onChange={(e) => updateFilters({ minAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount}
                    onChange={(e) => updateFilters({ maxAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
            <p className="text-rose-700">{error}</p>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction._id || transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 font-medium">
                          {formatDate(transaction.date)}
                        </div>
                        <div className="text-xs text-slate-500">{formatTime(transaction.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                            }`}
                          >
                            <div className={transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                              {getCategoryIcon(transaction.category)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{transaction.description}</div>
                            {transaction.merchant && (
                              <div className="text-sm text-slate-500">{transaction.merchant}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={`font-bold ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}₹
                          {parseFloat(transaction.amount).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative" ref={showActionMenu === (transaction._id || transaction.id) ? actionMenuRef : null}>
                          <button
                            onClick={() => toggleActionMenu(transaction._id || transaction.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {showActionMenu === (transaction._id || transaction.id) && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                              <button
                                onClick={() => handleEditClick(transaction)}
                                className="w-full flex items-center space-x-2 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(transaction)}
                                className="w-full flex items-center space-x-2 px-4 py-3 text-left text-rose-600 hover:bg-rose-50 rounded-b-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Page numbers */}
                {[...Array(pagination.totalPages)].slice(0, 5).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => changePage(pageNum)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        pagination.currentPage === pageNum
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Transaction</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    formData.type === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    formData.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange('INR')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                      selectedCurrency === 'INR'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    INR (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange('USD')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                      selectedCurrency === 'USD'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount {selectedCurrency === 'USD' && <span className="text-xs text-slate-500">(1 USD = ₹{exchangeRate.toFixed(2)})</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-2xl font-bold"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-slate-400">
                    {selectedCurrency === 'INR' ? '₹' : '$'}
                  </div>
                </div>
                {selectedCurrency === 'USD' && formData.amount && (
                  <div className="mt-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">Equivalent: ₹{getConvertedAmount()}</span>
                    <span className="text-xs text-slate-500 ml-2">(Will be stored in INR)</span>
                  </div>
                )}
              </div>

              {/* Custom Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all flex items-center justify-between ${
                      formData.category
                        ? 'border-slate-300 bg-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {formData.category && getSelectedCategory() ? (
                        <>
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              getSelectedCategory().bgColor
                            }`}
                          >
                            {React.createElement(getSelectedCategory().icon, {
                              className: `w-4 h-4 ${getSelectedCategory().color}`,
                            })}
                          </div>
                          <span className="font-medium text-slate-900">{formData.category}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">Select category</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        showCategoryDropdown ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {getCurrentCategoryOptions().map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.category === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleCategorySelect(option.value)}
                              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                                isSelected
                                  ? 'bg-slate-100 border border-slate-300'
                                  : 'hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.bgColor}`}>
                                <Icon className={`w-5 h-5 ${option.color}`} />
                              </div>
                              <span className="flex-1 text-left font-medium text-slate-900">
                                {option.value}
                              </span>
                              {isSelected && <Check className="w-5 h-5 text-slate-900" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Lunch at restaurant"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Merchant (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Starbucks"
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  required
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
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Transaction</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Same form fields as Add Transaction */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    formData.type === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    formData.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange('INR')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                      selectedCurrency === 'INR'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    INR (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCurrencyChange('USD')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                      selectedCurrency === 'USD'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount {selectedCurrency === 'USD' && <span className="text-xs text-slate-500">(1 USD = ₹{exchangeRate.toFixed(2)})</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-2xl font-bold"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-slate-400">
                    {selectedCurrency === 'INR' ? '₹' : '$'}
                  </div>
                </div>
                {selectedCurrency === 'USD' && formData.amount && (
                  <div className="mt-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">Equivalent: ₹{getConvertedAmount()}</span>
                    <span className="text-xs text-slate-500 ml-2">(Will be stored in INR)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all flex items-center justify-between ${
                      formData.category
                        ? 'border-slate-300 bg-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {formData.category && getSelectedCategory() ? (
                        <>
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              getSelectedCategory().bgColor
                            }`}
                          >
                            {React.createElement(getSelectedCategory().icon, {
                              className: `w-4 h-4 ${getSelectedCategory().color}`,
                            })}
                          </div>
                          <span className="font-medium text-slate-900">{formData.category}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">Select category</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        showCategoryDropdown ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {getCurrentCategoryOptions().map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.category === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleCategorySelect(option.value)}
                              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                                isSelected
                                  ? 'bg-slate-100 border border-slate-300'
                                  : 'hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${option.bgColor}`}>
                                <Icon className={`w-5 h-5 ${option.color}`} />
                              </div>
                              <span className="flex-1 text-left font-medium text-slate-900">
                                {option.value}
                              </span>
                              {isSelected && <Check className="w-5 h-5 text-slate-900" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="e.g., Lunch at restaurant"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Merchant (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Starbucks"
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  required
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
      {showDeleteModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Delete Transaction</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{selectedTransaction.description}</p>
                    <p className="text-sm text-slate-500">{selectedTransaction.category}</p>
                  </div>
                  <div className={`font-bold ${selectedTransaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}₹{parseFloat(selectedTransaction.amount).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
