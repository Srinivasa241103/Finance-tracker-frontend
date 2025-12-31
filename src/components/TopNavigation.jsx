import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const TopNavigation = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title || `Welcome back, ${user?.name || 'User'}!`}
        </h1>
        <p className="text-slate-600 mt-1">
          {subtitle || "Here's your financial overview for today"}
        </p>
      </div>

      {/* Actions Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
          />
        </form>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-6 h-6 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center space-x-2 hover:bg-slate-100 rounded-lg p-2 transition-colors">
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopNavigation;
