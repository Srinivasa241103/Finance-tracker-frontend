import React, { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);

  // Fetch link token from backend on mount
  useEffect(() => {
    const generateToken = async () => {
      const response = await axios.post('/plaid/create_link_token');
      setLinkToken(response.data.link_token);
    };
    generateToken();
  }, []);

  const onSuccess = useCallback(async (public_token, metadata) => {
    // Send public_token to backend to exchange for access_token
    await axios.post('/plaid/set_access_token', { public_token });
    console.log("Account linked successfully!");
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default PlaidLink;