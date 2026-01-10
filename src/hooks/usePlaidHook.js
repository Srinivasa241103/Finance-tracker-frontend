import { useState, useEffect } from 'react';
import plaidService from '../services/plaid';

/**
 * Custom hook for managing Plaid bank accounts
 */
const usePlaidHook = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bank accounts
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await plaidService.getBankAccounts();
      setAccounts(response.accounts || response.data || response || []);
      return response;
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      setError(err.message || 'Failed to fetch bank accounts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a new bank account (creates link token)
  const createLinkToken = async () => {
    try {
      const response = await plaidService.createLinkToken();
      return response;
    } catch (err) {
      console.error('Error creating link token:', err);
      setError(err.message || 'Failed to create link token');
      throw err;
    }
  };

  // Exchange public token for access token
  const exchangePublicToken = async (publicToken, metadata) => {
    try {
      const response = await plaidService.exchangePublicToken(publicToken, metadata);
      // Refresh accounts list after adding new account
      await fetchAccounts();
      return response;
    } catch (err) {
      console.error('Error exchanging public token:', err);
      setError(err.message || 'Failed to exchange public token');
      throw err;
    }
  };

  // Sync a specific account
  const syncAccount = async (accountId) => {
    try {
      const response = await plaidService.syncBankAccount(accountId);
      // Refresh accounts list after syncing
      await fetchAccounts();
      return response;
    } catch (err) {
      console.error('Error syncing account:', err);
      setError(err.message || 'Failed to sync account');
      throw err;
    }
  };

  // Remove a bank account
  const removeAccount = async (accountId) => {
    try {
      const response = await plaidService.removeBankAccount(accountId);
      // Refresh accounts list after removing
      await fetchAccounts();
      return response;
    } catch (err) {
      console.error('Error removing account:', err);
      setError(err.message || 'Failed to remove account');
      throw err;
    }
  };

  // Get account balance
  const getAccountBalance = async (accountId) => {
    try {
      const response = await plaidService.getAccountBalance(accountId);
      return response;
    } catch (err) {
      console.error('Error getting account balance:', err);
      setError(err.message || 'Failed to get account balance');
      throw err;
    }
  };

  // Refresh all accounts
  const refreshAll = async () => {
    try {
      const response = await plaidService.refreshAllAccounts();
      // Refresh accounts list after refreshing all
      await fetchAccounts();
      return response;
    } catch (err) {
      console.error('Error refreshing all accounts:', err);
      setError(err.message || 'Failed to refresh all accounts');
      throw err;
    }
  };

  // Calculate total balance across all accounts
  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      const balance = account.balances?.current || account.balance || 0;
      return total + Number(balance);
    }, 0);
  };

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createLinkToken,
    exchangePublicToken,
    syncAccount,
    removeAccount,
    getAccountBalance,
    refreshAll,
    getTotalBalance,
  };
};

export default usePlaidHook;
