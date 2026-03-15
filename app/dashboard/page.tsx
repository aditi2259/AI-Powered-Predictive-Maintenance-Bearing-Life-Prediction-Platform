'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { RoleGuard } from '@/lib/role-guard';
import { calculateDashboardStats, mockBearings } from '@/lib/mock-data';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { SuggestionsWidget } from '@/components/dashboard/suggestions-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const stats = calculateDashboardStats();
  const { userRole } = useAuth();

  // Data for health distribution chart
  const healthDistribution = [
    { name: 'Healthy', value: stats.healthyBearings, fill: '#10b981' },
    { name: 'Degraded', value: stats.degradedBearings, fill: '#f59e0b' },
    { name: 'Critical', value: stats.criticalBearings, fill: '#ef4444' },
    { name: 'Failed', value: stats.failedBearings, fill: '#7c2d12' },
  ];

  // Recent bearing status changes
  const recentBearings = mockBearings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time bearing health monitoring and predictive maintenance insights
        </p>
      </div>

      {/* Suggestions Widget */}
      <SuggestionsWidget />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Machines"
          value={stats.totalMachines}
          icon="⚙️"
          color="default"
        />
        <StatsCard
          title="Total Bearings"
          value={stats.totalBearings}
          icon="📌"
          description="Across all machines"
        />
        <StatsCard
          title="Avg Health Score"
          value={`${stats.averageHealthScore}%`}
          icon="💪"
          color="success"
        />
        <StatsCard
          title="Urgent Actions"
          value={stats.pendingRecommendations}
          icon="⚠️"
          color={stats.pendingRecommendations > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bearing Health Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bearing Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Healthy</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.healthyBearings / stats.totalBearings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {stats.healthyBearings}/{stats.totalBearings}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Degraded</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.degradedBearings / stats.totalBearings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {stats.degradedBearings}/{stats.totalBearings}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Critical</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.criticalBearings / stats.totalBearings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {stats.criticalBearings}/{stats.totalBearings}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Failed</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-900 h-2 rounded-full"
                      style={{
                        width: `${(stats.failedBearings / stats.totalBearings) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {stats.failedBearings}/{stats.totalBearings}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bearings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bearings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Health Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Hours</th>
                </tr>
              </thead>
              <tbody>
                {recentBearings.map((bearing) => (
                  <tr key={bearing.id} className="border-b border-border hover:bg-card/50">
                    <td className="py-3 px-4 text-foreground">{bearing.position}</td>
                    <td className="py-3 px-4 text-foreground">{bearing.model}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={bearing.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              bearing.healthScore >= 80
                                ? 'bg-emerald-500'
                                : bearing.healthScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${bearing.healthScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {bearing.healthScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {bearing.operatingHours.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
