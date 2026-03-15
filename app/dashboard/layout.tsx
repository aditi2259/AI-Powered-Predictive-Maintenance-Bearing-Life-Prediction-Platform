'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Menu, LogOut, BarChart3, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, switchRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/machines', label: 'Machines', icon: '⚙️' },
    { href: '/dashboard/predictions', label: 'RUL Predictions', icon: '🔮' },
    { href: '/dashboard/recommendations', label: 'Recommendations', icon: '📋' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    { href: '/dashboard/suggestions', label: 'Suggestions', icon: '💡' },
  ];

  const managerItems = [
    { href: '/dashboard/reports', label: 'Reports', icon: '📑' },
    { href: '/dashboard/contracts', label: 'Service Contracts', icon: '📄' },
  ];

  const salesItems = [
    { href: '/dashboard/opportunities', label: 'Opportunities', icon: '🎯' },
    { href: '/dashboard/sales-revenue', label: 'Sales Revenue', icon: '💰' },
  ];

  const adminItems = [
    { href: '/dashboard/admin', label: 'Admin Panel', icon: '🔧' },
    { href: '/dashboard/ml-models', label: 'ML Models', icon: '🤖' },
  ];

  let roleItems: typeof navigationItems = [];
  if (user?.role === 'manager') {
    roleItems = managerItems;
  } else if (user?.role === 'sales') {
    roleItems = salesItems;
  } else if (user?.role === 'admin') {
    roleItems = adminItems;
  }

  const allNavItems = [...navigationItems, ...roleItems];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-sidebar-foreground">NBC</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sidebar-foreground"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {allNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="ml-2">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-accent-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            )}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sidebar-foreground"
                  >
                    <Settings size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border h-16 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold text-foreground">
              Bearing Health Monitoring System
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user?.company}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
