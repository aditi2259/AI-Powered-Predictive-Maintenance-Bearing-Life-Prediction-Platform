'use client';

import React, { useState } from 'react';
import { mockBearings, mockRULPredictions, calculateDashboardStats } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalyticsPage() {
  const stats = calculateDashboardStats();

  // Health score distribution
  const healthScoreData = [
    { range: '80-100', count: mockBearings.filter((b) => b.healthScore >= 80).length },
    { range: '60-79', count: mockBearings.filter((b) => b.healthScore >= 60 && b.healthScore < 80).length },
    { range: '40-59', count: mockBearings.filter((b) => b.healthScore >= 40 && b.healthScore < 60).length },
    { range: '0-39', count: mockBearings.filter((b) => b.healthScore < 40).length },
  ];

  // RUL distribution
  const rulData = mockRULPredictions.map((p) => ({
    name: mockBearings.find((b) => b.id === p.bearingId)?.position || 'Unknown',
    rul: p.predictedRUL,
    confidence: p.confidence,
    risk: p.riskLevel === 'critical' ? 3 : p.riskLevel === 'high' ? 2 : p.riskLevel === 'medium' ? 1 : 0,
  }));

  // Operating hours by status
  const statusData = [
    { status: 'Healthy', count: stats.healthyBearings, fill: '#10b981' },
    { status: 'Degraded', count: stats.degradedBearings, fill: '#f59e0b' },
    { status: 'Critical', count: stats.criticalBearings, fill: '#ef4444' },
    { status: 'Failed', count: stats.failedBearings, fill: '#7c2d12' },
  ];

  // Trend data
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    healthy: Math.max(2, stats.healthyBearings - Math.floor(Math.random() * 3)),
    degraded: stats.degradedBearings + Math.floor(Math.random() * 2),
    critical: stats.criticalBearings + Math.floor(Math.random() * 2),
    failed: stats.failedBearings + Math.floor(Math.random() * 2),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive bearing health analytics and trends
        </p>
      </div>

      {/* Cost Analysis Section */}
      {(() => {
        const criticalBearings = mockBearings.filter(b => b.status === 'critical').length;
        const degradedBearings = mockBearings.filter(b => b.status === 'degraded').length;
        const failedBearings = mockBearings.filter(b => b.status === 'failed').length;
        
        const costPerBearing = 1200; // Average replacement cost
        const downtimeCostPerHour = 500; // Average downtime cost
        const avgDowntimeHours = 4; // Average downtime per replacement
        
        const immediateLossCost = failedBearings * costPerBearing + failedBearings * (downtimeCostPerHour * avgDowntimeHours);
        const potentialLossCost = criticalBearings * costPerBearing + criticalBearings * (downtimeCostPerHour * avgDowntimeHours);
        const preventableLossCost = degradedBearings * costPerBearing * 0.5; // 50% cost if preventive action taken
        const totalPotentialLoss = immediateLossCost + potentialLossCost;
        const savingsIfProactive = totalPotentialLoss * 0.4; // 40% savings with proactive maintenance

        return (
          <Card className="border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle>Cost Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Immediate Loss (Failed Bearings)</p>
                    <p className="text-2xl font-bold text-red-500">${immediateLossCost.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">{failedBearings} failed bearings</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Potential Loss (Critical Bearings)</p>
                    <p className="text-2xl font-bold text-orange-500">${potentialLossCost.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">{criticalBearings} critical bearings</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Potential Loss</p>
                    <p className="text-2xl font-bold text-red-600">${totalPotentialLoss.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">if no action taken</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border-2 border-emerald-500">
                    <p className="text-sm text-muted-foreground mb-1">Potential Savings</p>
                    <p className="text-2xl font-bold text-emerald-500">${savingsIfProactive.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-2">with proactive maintenance</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-foreground"><span className="font-semibold">Cost Breakdown:</span> Each bearing replacement costs ${costPerBearing} + downtime costs (${avgDowntimeHours}h × ${downtimeCostPerHour}/h = ${avgDowntimeHours * downtimeCostPerHour})</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Avg Health Score</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stats.averageHealthScore}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">across all bearings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Fleet Utilization</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {Math.round((stats.healthyBearings / stats.totalBearings) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">operational bearings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">At-Risk Bearings</p>
              <p className="text-3xl font-bold text-red-500 mt-2">
                {stats.criticalBearings + stats.degradedBearings}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(((stats.criticalBearings + stats.degradedBearings) / stats.totalBearings) * 100)}% of fleet
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Imminent Failures</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">
                {stats.upcomingFailures}
              </p>
              <p className="text-xs text-muted-foreground mt-2">within 90 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList>
          <TabsTrigger value="distribution">Health Distribution</TabsTrigger>
          <TabsTrigger value="rul">RUL Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="status">Status Breakdown</TabsTrigger>
        </TabsList>

        {/* Health Score Distribution */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Health Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="range" stroke="currentColor" opacity={0.5} />
                    <YAxis stroke="currentColor" opacity={0.5} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a78bfa" name="Number of Bearings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RUL Analysis */}
        <TabsContent value="rul">
          <Card>
            <CardHeader>
              <CardTitle>RUL Analysis by Bearing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="rul" name="RUL (days)" stroke="currentColor" opacity={0.5} />
                    <YAxis dataKey="confidence" name="Confidence (%)" stroke="currentColor" opacity={0.5} />
                    <Tooltip />
                    <Scatter name="Bearings" data={rulData} fill="#60a5fa" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>12-Month Health Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="month" stroke="currentColor" opacity={0.5} />
                    <YAxis stroke="currentColor" opacity={0.5} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="healthy" stroke="#10b981" name="Healthy" />
                    <Line type="monotone" dataKey="degraded" stroke="#f59e0b" name="Degraded" />
                    <Line type="monotone" dataKey="critical" stroke="#ef4444" name="Critical" />
                    <Bar dataKey="failed" fill="#7c2d12" name="Failed" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Breakdown */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Current Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, count }) => `${name}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bearing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Bearing</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Health</th>
                  <th className="text-left py-3 px-4 font-semibold">Hours</th>
                  <th className="text-left py-3 px-4 font-semibold">RUL (days)</th>
                  <th className="text-left py-3 px-4 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {mockBearings.map((bearing) => {
                  const rul = mockRULPredictions.find((r) => r.bearingId === bearing.id);
                  return (
                    <tr key={bearing.id} className="border-b border-border hover:bg-card/50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{bearing.position}</div>
                        <div className="text-xs text-muted-foreground">{bearing.model}</div>
                      </td>
                      <td className="py-3 px-4 capitalize">{bearing.status}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                          <span className="text-sm">{bearing.healthScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{bearing.operatingHours.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold">{rul?.predictedRUL || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            rul?.riskLevel === 'critical'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : rul?.riskLevel === 'high'
                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                              : rul?.riskLevel === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {rul?.riskLevel || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
