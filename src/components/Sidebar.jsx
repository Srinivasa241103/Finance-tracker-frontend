import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DollarSign,
  Home,
  Receipt,
  BarChart3,
  Target,
  CreditCard,
  Wallet,
} from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsHovered } = useSidebar();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      disabled: false,
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: Receipt,
      disabled: false,
    },
    {
      name: 'My Budget',
      path: '/budget',
      icon: Wallet,
      disabled: false,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      disabled: false,
    },
    {
      name: 'Savings Goals',
      path: '/goals',
      icon: Target,
      disabled: false,
    },
    {
      name: 'Bank Accounts',
      path: '/banks',
      icon: CreditCard,
      disabled: false,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`bg-white border-r border-slate-200 fixed h-full transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? 'w-20' : 'w-64 shadow-2xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ top: 0, left: 0 }}
    >
      <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-slate-900 whitespace-nowrap overflow-hidden">
              FinanceFlow
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            if (item.disabled) {
              return (
                <div key={item.path} className="relative group">
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg text-slate-400 cursor-not-allowed opacity-60 ${
                      isCollapsed ? 'justify-center' : 'space-x-3'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                  </div>
                  {item.comingSoon && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Coming Soon
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}

                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

      </div>
    </aside>
  );
};

export default Sidebar;
