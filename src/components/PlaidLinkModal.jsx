import React, { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { X, Loader2, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import plaidService from '../services/plaid';

const PlaidLinkModal = ({ isOpen, onClose, onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exchangingToken, setExchangingToken] = useState(false);

  // Fetch link token when modal opens
  useEffect(() => {
    if (isOpen && !linkToken) {
      generateLinkToken();
    }
  }, [isOpen]);

  const generateLinkToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await plaidService.createLinkToken();
      setLinkToken(response.link_token || response.linkToken);
    } catch (err) {
      console.error('Error generating link token:', err);
      setError('Failed to initialize Plaid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = useCallback(async (public_token, metadata) => {
    setExchangingToken(true);
    try {
      // Send public_token to backend to exchange for access_token
      const response = await plaidService.exchangePublicToken(public_token, metadata);

      console.log('Bank account connected successfully!', response);

      // Call parent onSuccess callback
      if (onSuccess) {
        onSuccess(response);
      }

      // Close modal
      onClose();
    } catch (err) {
      console.error('Error exchanging public token:', err);
      setError('Failed to connect bank account. Please try again.');
    } finally {
      setExchangingToken(false);
    }
  }, [onSuccess, onClose]);

  const handleExit = useCallback((err, metadata) => {
    if (err) {
      console.error('Plaid Link exited with error:', err);
      setError('Connection failed. Please try again.');
    }
    // Don't close modal on exit, let user retry or close manually
  }, []);

  const config = {
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
  };

  const { open, ready } = usePlaidLink(config);

  const handleOpenPlaid = () => {
    if (ready) {
      setError(null);
      open();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-slate-600" />
            <span>Connect Bank Account</span>
          </h2>
          <button
            onClick={onClose}
            disabled={exchangingToken}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Initializing secure connection...</p>
          </div>
        ) : exchangingToken ? (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-900 font-semibold mb-2">Connecting your bank account...</p>
            <p className="text-slate-600 text-sm">This will only take a moment</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-rose-900 font-semibold text-sm">Connection Error</p>
                <p className="text-rose-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={generateLinkToken}
                className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Secure & Encrypted</p>
                  <p className="text-slate-600 text-sm mt-1">
                    Your credentials are encrypted and never stored
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Read-Only Access</p>
                  <p className="text-slate-600 text-sm mt-1">
                    We can only view your transactions, not move money
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Powered by Plaid</p>
                  <p className="text-slate-600 text-sm mt-1">
                    Trusted by thousands of financial apps
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOpenPlaid}
                disabled={!ready}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {ready ? 'Continue with Plaid' : 'Loading...'}
              </button>
              <button
                onClick={onClose}
                className="w-full px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              By connecting your bank account, you agree to Plaid's{' '}
              <a href="https://plaid.com/legal/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaidLinkModal;
