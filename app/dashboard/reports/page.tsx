'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { RoleGuard } from '@/lib/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockServiceContracts, calculateDashboardStats } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const stats = calculateDashboardStats();

  // Revenue by service type
  const revenueData = mockServiceContracts.reduce(
    (acc, contract) => {
      const serviceType = contract.serviceType;
      const existing = acc.find((d) => d.name === serviceType);
      if (existing) {
        existing.revenue += contract.monthlyValue * 12;
      } else {
        acc.push({ name: serviceType, revenue: contract.monthlyValue * 12 });
      }
      return acc;
    },
    [] as Array<{ name: string; revenue: number }>
  );

  return (
    <RoleGuard allowedRoles={['manager', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Generate and view management reports
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Fleet Availability</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {Math.round((stats.healthyBearings / stats.totalBearings) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">operational</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Cost</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${Math.round(stats.pendingRecommendations * 1200 / 1000)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">projected</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Downtime Risk</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.upcomingFailures}</p>
                <p className="text-xs text-muted-foreground mt-1">within 90 days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground">Avg Bearing Age</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {Math.round(
                    new Date().getFullYear() -
                    new Date(new Date().getFullYear() - 3, 0, 1).getFullYear() +
                    2
                  )}
                  yrs
                </p>
                <p className="text-xs text-muted-foreground mt-1">across fleet</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Report */}
        <Card>
          <CardHeader>
            <CardTitle>Annual Revenue by Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="name" stroke="currentColor" opacity={0.5} />
                  <YAxis stroke="currentColor" opacity={0.5} />
                  <Tooltip formatter={(value) => `$${(value as number / 1000).toFixed(0)}K`} />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="Annual Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Report Generation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Fleet Health Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Maintenance Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Revenue Summary
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Failure Forecast
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Contract Performance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Export to CSV
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export to Excel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export to PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Export
              </Button>
              <Button variant="outline" className="w-full justify-start">
                API Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Report Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Generated</th>
                    <th className="text-left py-3 px-4 font-semibold">Period</th>
                    <th className="text-left py-3 px-4 font-semibold">Format</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'Fleet Health Report',
                      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                      period: 'Monthly',
                      format: 'PDF',
                    },
                    {
                      name: 'Revenue Summary',
                      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                      period: 'Quarterly',
                      format: 'Excel',
                    },
                    {
                      name: 'Maintenance Schedule',
                      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      period: 'Monthly',
                      format: 'PDF',
                    },
                    {
                      name: 'Failure Forecast',
                      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                      period: 'Monthly',
                      format: 'CSV',
                    },
                  ].map((report, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-card/50">
                      <td className="py-3 px-4 font-medium">{report.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {report.date.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{report.period}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                          {report.format}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
