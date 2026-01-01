import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-collapse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const value = {
    isCollapsed: isCollapsed && !isHovered,
    setIsCollapsed,
    isHovered,
    setIsHovered,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
