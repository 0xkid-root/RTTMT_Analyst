'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('rttmt-sidebar-collapsed');
    if (saved === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newVal = !isSidebarCollapsed;
    setIsSidebarCollapsed(newVal);
    localStorage.setItem('rttmt-sidebar-collapsed', String(newVal));
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div className={`flex flex-1 flex-col transition-all duration-300 w-full overflow-hidden ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
