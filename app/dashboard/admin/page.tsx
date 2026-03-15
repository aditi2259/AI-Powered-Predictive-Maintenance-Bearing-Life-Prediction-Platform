'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { RoleGuard } from '@/lib/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockMachines, mockBearings, calculateDashboardStats } from '@/lib/mock-data';

export default function AdminPage() {
  const stats = calculateDashboardStats();

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            System administration and management tools
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Machines</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.totalMachines}</p>
                <p className="text-xs text-muted-foreground mt-1">in system</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Bearings</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.totalBearings}</p>
                <p className="text-xs text-muted-foreground mt-1">being monitored</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-3xl font-bold text-emerald-500 mt-2">99.9%</p>
                <p className="text-xs text-muted-foreground mt-1">uptime</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-blue-500 mt-2">12</p>
                <p className="text-xs text-muted-foreground mt-1">logged in</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Machine Management */}
          <Card>
            <CardHeader>
              <CardTitle>Machine Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage machines, bearings, and monitoring configurations
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Add New Machine
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configure Sensors
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Bearings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage user accounts and permissions
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Add User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Roles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Audit Log
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Reset Passwords
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure system settings and integrations
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  API Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Email Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Rules
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  System Backup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reporting */}
          <Card>
            <CardHeader>
              <CardTitle>Reporting & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate reports and analytics
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Schedule Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent System Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', event: 'System backup completed', status: 'success' },
                {
                  time: '4 hours ago',
                  event: 'Critical bearing RUL prediction generated',
                  status: 'alert',
                },
                { time: '6 hours ago', event: 'User Sarah Johnson logged in', status: 'info' },
                { time: '8 hours ago', event: 'Maintenance recommendation created', status: 'info' },
                { time: '12 hours ago', event: 'Database optimization completed', status: 'success' },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success'
                        ? 'bg-emerald-500'
                        : activity.status === 'alert'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.event}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
