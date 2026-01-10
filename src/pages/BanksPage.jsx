import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  Wallet,
  CreditCard,
  Landmark,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  X,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigation from '../components/TopNavigation';
import PlaidLinkModal from '../components/PlaidLinkModal';
import plaidService from '../services/plaid';

const BanksPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [syncing, setSyncing] = useState({});
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Only fetch if backend is ready
    const loadAccounts = async () => {
      try {
        await fetchBankAccounts();
      } catch (err) {
        // If backend endpoints don't exist yet, just show empty state
        console.log('Backend Plaid endpoints not ready yet');
      } finally {
        setInitialLoad(false);
      }
    };
    loadAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await plaidService.getBankAccounts();
      setAccounts(response.accounts || response.data || response || []);
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      // Don't show error if it's just that backend endpoints aren't ready
      if (err.message && !err.message.includes('404') && !err.message.includes('Network')) {
        setError('Failed to load bank accounts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = (data) => {
    console.log('Bank account connected:', data);
    // Refresh the accounts list
    fetchBankAccounts();
  };

  const handleSyncAccount = async (accountId) => {
    setSyncing({ ...syncing, [accountId]: true });
    try {
      await plaidService.syncBankAccount(accountId);
      // Refresh the accounts list to show updated data
      await fetchBankAccounts();
    } catch (err) {
      console.error('Error syncing account:', err);
      alert('Failed to sync account. Please try again.');
    } finally {
      setSyncing({ ...syncing, [accountId]: false });
    }
  };

  const handleRemoveClick = (account) => {
    setAccountToRemove(account);
    setShowRemoveModal(true);
  };

  const handleRemoveConfirm = async () => {
    if (!accountToRemove) return;

    setRemoving(true);
    try {
      await plaidService.removeBankAccount(accountToRemove.id || accountToRemove._id);
      setShowRemoveModal(false);
      setAccountToRemove(null);
      // Refresh the accounts list
      await fetchBankAccounts();
    } catch (err) {
      console.error('Error removing account:', err);
      alert('Failed to remove account. Please try again.');
    } finally {
      setRemoving(false);
    }
  };

  const getAccountIcon = (type, subtype) => {
    if (type === 'credit' || subtype === 'credit card') {
      return <CreditCard className="w-6 h-6" />;
    } else if (type === 'depository' || subtype === 'checking' || subtype === 'savings') {
      return <Landmark className="w-6 h-6" />;
    } else if (type === 'investment') {
      return <TrendingUp className="w-6 h-6" />;
    } else {
      return <Wallet className="w-6 h-6" />;
    }
  };

  const formatAccountType = (type, subtype) => {
    if (subtype) {
      return subtype.charAt(0).toUpperCase() + subtype.slice(1).replace('_', ' ');
    }
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Account';
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return `₹${Number(amount).toLocaleString()}`;
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      const balance = account.balances?.current || account.balance || 0;
      return total + Number(balance);
    }, 0);
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-slate-900 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your bank accounts...</p>
        </div>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-3">
                <Building2 className="w-8 h-8" />
                <span>Bank Accounts</span>
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your connected bank accounts and sync transactions
              </p>
            </div>
            <button
              onClick={() => setShowPlaidModal(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Bank Account</span>
            </button>
          </div>

          {/* Total Balance Card */}
          {accounts.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm mb-2">Total Balance</p>
                  <p className="text-4xl font-bold">{formatCurrency(getTotalBalance())}</p>
                  <p className="text-slate-400 text-sm mt-2">
                    Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-rose-900 font-semibold mb-1">Error</h3>
              <p className="text-rose-700">{error}</p>
            </div>
            <button
              onClick={fetchBankAccounts}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Bank Accounts Connected</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Connect your bank account to automatically sync transactions and get real-time balance
              updates
            </p>
            <button
              onClick={() => setShowPlaidModal(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Connect Your First Account</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {accounts.map((account) => {
              const accountId = account.id || account._id;
              const isSyncing = syncing[accountId];
              const balance = account.balances?.current || account.balance || 0;
              const available = account.balances?.available;
              const institutionName = account.institution?.name || account.institutionName || 'Bank';
              const accountName = account.name || 'Account';
              const accountType = account.type || 'depository';
              const accountSubtype = account.subtype;
              const mask = account.mask;
              const lastSynced = account.lastSynced || account.updatedAt;

              return (
                <div
                  key={accountId}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                        {getAccountIcon(accountType, accountSubtype)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">
                          {institutionName}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {accountName} {mask ? `••••${mask}` : ''}
                        </p>
                        <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                          {formatAccountType(accountType, accountSubtype)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">Current Balance</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(balance)}</p>
                      {available !== null && available !== undefined && available !== balance && (
                        <p className="text-xs text-slate-500 mt-1">
                          Available: {formatCurrency(available)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100">
                    {lastSynced && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-500 text-xs">Last Synced</p>
                          <p className="text-slate-900 font-medium">
                            {new Date(lastSynced).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-slate-500 text-xs">Status</p>
                        <p className="text-emerald-600 font-medium">Active</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleSyncAccount(accountId)}
                      disabled={isSyncing}
                      className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition-colors font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync Transactions'}</span>
                    </button>
                    <button
                      onClick={() => handleRemoveClick(account)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors font-medium text-sm flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Plaid Link Modal */}
      <PlaidLinkModal
        isOpen={showPlaidModal}
        onClose={() => setShowPlaidModal(false)}
        onSuccess={handlePlaidSuccess}
      />

      {/* Remove Confirmation Modal */}
      {showRemoveModal && accountToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Remove Bank Account</h2>
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-rose-900 font-semibold text-sm">Warning</p>
                  <p className="text-rose-700 text-sm mt-1">
                    This will disconnect your bank account and stop automatic transaction syncing.
                    Your existing transactions will not be deleted.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-900 font-semibold">
                  {accountToRemove.institution?.name || accountToRemove.institutionName}
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  {accountToRemove.name} {accountToRemove.mask ? `••••${accountToRemove.mask}` : ''}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveConfirm}
                disabled={removing}
                className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {removing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanksPage;
