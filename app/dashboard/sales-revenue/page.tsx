'use client';

import React, { useState } from 'react';
import {
  mockMachines,
  mockBearings,
  mockServiceContracts,
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface RevenueScenario {
  current: number;
  reactive: number;
  predictive: number;
  premium: number;
}

export default function SalesRevenuePage() {
  const [selectedScenario, setSelectedScenario] = useState<'current' | 'reactive' | 'predictive' | 'premium'>('current');

  // Calculate current revenue
  const currentRevenue = mockServiceContracts.reduce((total, contract) => {
    return total + (contract.annualValue || 18000);
  }, 0);

  // Calculate machines with and without contracts
  const machinesWithContracts = mockMachines.filter((m) =>
    mockServiceContracts.some((c) => c.machineId === m.id)
  );
  const machinesWithoutContracts = mockMachines.filter(
    (m) => !mockServiceContracts.some((c) => c.machineId === m.id)
  );

  // Calculate potential revenue from uncontracted machines
  const potentialFromNewContracts = machinesWithoutContracts.reduce((total, machine) => {
    const machineBearings = mockBearings.filter((b) => b.machineId === machine.id);
    const baseMonthly = 1500;
    const premiumPerBearing = 400;
    const annualValue = (baseMonthly + machineBearings.length * premiumPerBearing) * 12;
    return total + annualValue;
  }, 0);

  // Calculate potential from upgrades (reactive -> predictive)
  const potentialFromUpgrades = mockServiceContracts.reduce((total, contract) => {
    const machine = mockMachines.find((m) => m.id === contract.machineId);
    if (!machine) return total;

    const machineBearings = mockBearings.filter((b) => b.machineId === machine.id);
    const currentValue = contract.annualValue || 18000;
    const predictiveValue = (2000 + machineBearings.length * 600) * 12; // Higher tier
    const upgrade = Math.max(0, predictiveValue - currentValue);
    return total + upgrade;
  }, 0);

  // Calculate potential from premium services
  const potentialFromPremium = mockMachines.reduce((total, machine) => {
    const hasCritical = mockBearings.some(
      (b) => b.machineId === machine.id && b.status === 'critical'
    );
    if (hasCritical) {
      return total + 8000; // Premium support add-on
    }
    return total;
  }, 0);

  const totalPotentialRevenue = currentRevenue + potentialFromNewContracts + potentialFromUpgrades + potentialFromPremium;

  // Revenue scenarios data
  const revenueScenarios: RevenueScenario = {
    current: currentRevenue,
    reactive: currentRevenue + potentialFromNewContracts * 0.6,
    predictive: currentRevenue + potentialFromNewContracts + potentialFromUpgrades * 0.8,
    premium: totalPotentialRevenue,
  };

  // Chart data for revenue comparison
  const scenarioData = [
    {
      name: 'Current',
      revenue: Math.round(revenueScenarios.current),
      contracts: mockServiceContracts.length,
    },
    {
      name: 'With New Contracts',
      revenue: Math.round(revenueScenarios.reactive),
      contracts: mockServiceContracts.length + machinesWithoutContracts.length * 0.5,
    },
    {
      name: 'Predictive Upgrades',
      revenue: Math.round(revenueScenarios.predictive),
      contracts: mockServiceContracts.length + machinesWithoutContracts.length,
    },
    {
      name: 'Premium Services',
      revenue: Math.round(revenueScenarios.premium),
      contracts: mockMachines.length,
    },
  ];

  // Monthly revenue projection
  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
    const currentMonthly = currentRevenue / 12;
    const projectedMonthly = totalPotentialRevenue / 12;
    const progressPercent = (i + 1) / 12;
    const transitional = currentMonthly + (projectedMonthly - currentMonthly) * progressPercent;

    return {
      month,
      current: Math.round(currentMonthly),
      projected: Math.round(projectedMonthly),
      realistic: Math.round(transitional),
    };
  });

  // Revenue breakdown by contract type
  const contractTypeBreakdown = [
    {
      name: 'Current Contracts',
      value: currentRevenue,
      percentage: (currentRevenue / totalPotentialRevenue) * 100,
    },
    {
      name: 'New Contracts (Reactive)',
      value: potentialFromNewContracts,
      percentage: (potentialFromNewContracts / totalPotentialRevenue) * 100,
    },
    {
      name: 'Upgrade Revenue',
      value: potentialFromUpgrades,
      percentage: (potentialFromUpgrades / totalPotentialRevenue) * 100,
    },
    {
      name: 'Premium Services',
      value: potentialFromPremium,
      percentage: (potentialFromPremium / totalPotentialRevenue) * 100,
    },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#f59e0b'];

  // Machine coverage analysis
  const machineBreakdown = [
    {
      name: 'With Contracts',
      value: machinesWithContracts.length,
      revenue: mockServiceContracts.reduce((total, contract) => total + (contract.annualValue || 18000), 0),
    },
    {
      name: 'Without Contracts',
      value: machinesWithoutContracts.length,
      revenue: potentialFromNewContracts,
    },
  ];

  const getScenarioRevenue = (scenario: typeof selectedScenario) => {
    return revenueScenarios[scenario];
  };

  const scenarioDescriptions: Record<typeof selectedScenario, { title: string; description: string; highlights: string[] }> = {
    current: {
      title: 'Current State',
      description: 'Baseline revenue from existing service contracts.',
      highlights: [
        `${mockServiceContracts.length} active contracts`,
        `${machinesWithoutContracts.length} machines without contracts`,
        'No premium services',
      ],
    },
    reactive: {
      title: 'Add New Contracts (Reactive)',
      description: 'Convert uncontracted machines to basic reactive maintenance contracts.',
      highlights: [
        `${machinesWithoutContracts.length} new contract opportunities`,
        '60% close rate assumption',
        'Basic maintenance tier',
      ],
    },
    predictive: {
      title: 'Predictive Maintenance Upgrades',
      description: 'Upgrade existing contracts to predictive maintenance with higher margin services.',
      highlights: [
        `${mockServiceContracts.length} contracts available for upgrade`,
        '80% upgrade adoption',
        'Higher service tier (30-40% margin increase)',
      ],
    },
    premium: {
      title: 'Full Premium Services',
      description: 'Maximize revenue with all machines on premium predictive contracts plus specialized services.',
      highlights: [
        `${mockMachines.length} total machines under contract`,
        'Premium AI monitoring add-ons',
        'Specialist maintenance packages',
      ],
    },
  };

  const currentScenario = scenarioDescriptions[selectedScenario];
  const currentRevenuValue = getScenarioRevenue(selectedScenario);
  const revenueIncrease = currentRevenuValue - revenueScenarios.current;
  const increasePercent = ((revenueIncrease / revenueScenarios.current) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sales Revenue Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Analyze revenue impact and identify growth opportunities through service contract optimization
        </p>
      </div>

      {/* Current vs Potential KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Annual Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(revenueScenarios.current / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockServiceContracts.length} active contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Potential Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${(totalPotentialRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +${(totalPotentialRevenue - revenueScenarios.current) / 1000 | 0}K opportunity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Contract Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {((machinesWithContracts.length / mockMachines.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {machinesWithContracts.length} of {mockMachines.length} machines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Growth Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{((totalPotentialRevenue / revenueScenarios.current) * 100 - 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs. current revenue baseline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Scenario Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tabs */}
          <Tabs value={selectedScenario} onValueChange={(v) => setSelectedScenario(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="reactive">New Contracts</TabsTrigger>
              <TabsTrigger value="predictive">Predictive Upgrades</TabsTrigger>
              <TabsTrigger value="premium">Premium Services</TabsTrigger>
            </TabsList>

            {Object.keys(scenarioDescriptions).map((scenario) => (
              <TabsContent key={scenario} value={scenario} className="space-y-4">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {scenarioDescriptions[scenario as typeof selectedScenario].title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {scenarioDescriptions[scenario as typeof selectedScenario].description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Annual Revenue Potential</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${(getScenarioRevenue(scenario as typeof selectedScenario) / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Revenue Increase</p>
                      <p className="text-2xl font-bold text-green-600">
                        +${(getScenarioRevenue(scenario as typeof selectedScenario) - revenueScenarios.current) / 1000 | 0}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Growth vs Current</p>
                      <p className="text-2xl font-bold text-primary">
                        +{(((getScenarioRevenue(scenario as typeof selectedScenario) / revenueScenarios.current) - 1) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-foreground mb-2">Key Highlights:</p>
                    <ul className="space-y-1">
                      {scenarioDescriptions[scenario as typeof selectedScenario].highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Scenario Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Premium Revenue Opportunity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contractTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contractTypeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Projection */}
      <Card>
        <CardHeader>
          <CardTitle>12-Month Revenue Projection</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Realistic transition from current state to premium services adoption
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={monthlyProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                name="Current Monthly Revenue"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="realistic"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Realistic Growth Path"
                dot={false}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                name="Premium Services Target"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Opportunity Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contract Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Machine Contract Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {machineBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <Badge variant={idx === 0 ? 'default' : 'secondary'}>
                    {item.value} machines
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${idx === 0 ? 'bg-primary' : 'bg-accent'}`}
                    style={{ width: `${(item.value / mockMachines.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  ${(item.revenue / 1000).toFixed(0)}K annual revenue
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Opportunity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: 'New Contracts (Uncontracted Machines)',
                value: potentialFromNewContracts,
                color: 'bg-blue-500',
              },
              {
                label: 'Upgrade to Predictive Services',
                value: potentialFromUpgrades,
                color: 'bg-purple-500',
              },
              {
                label: 'Premium Add-On Services',
                value: potentialFromPremium,
                color: 'bg-pink-500',
              },
            ].map((opp, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{opp.label}</span>
                  <span className="text-sm font-bold text-foreground">
                    ${(opp.value / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={opp.color}
                    style={{ width: `${(opp.value / totalPotentialRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Additional Revenue Potential</span>
                <span className="text-lg font-bold text-green-600">
                  ${((totalPotentialRevenue - revenueScenarios.current) / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
