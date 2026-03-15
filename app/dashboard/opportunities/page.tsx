'use client';

import React, { useState } from 'react';
import {
  mockMachines,
  mockBearings,
  mockRULPredictions,
  mockServiceContracts,
} from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OpportunitiesPage() {
  const [selectedTab, setSelectedTab] = useState('immediate');

  // Analyze opportunities
  const criticalBearings = mockBearings.filter((b) => b.status === 'critical');
  const degradedBearings = mockBearings.filter((b) => b.status === 'degraded');
  const failedBearings = mockBearings.filter((b) => b.status === 'failed');

  // Find machines with high-risk bearings
  const machinesWithOpportunities = mockMachines.filter((m) =>
    mockBearings.some(
      (b) =>
        b.machineId === m.id &&
        ['critical', 'failed'].includes(b.status)
    )
  );

  // Calculate potential contract value
  const calculateContractValue = (bearings: typeof mockBearings) => {
    const baseMonthlyValue = 1500;
    const premiumPerBearing = 400;
    return (baseMonthlyValue + bearings.length * premiumPerBearing) * 12; // Annual value
  };

  // Upsell opportunities
  const upsellOpportunities = machinesWithOpportunities.map((machine) => {
    const machineBearings = mockBearings.filter((b) => b.machineId === machine.id);
    const existingContract = mockServiceContracts.find((c) => c.machineId === machine.id);
    const criticalCount = machineBearings.filter((b) => b.status === 'critical').length;
    const failedCount = machineBearings.filter((b) => b.status === 'failed').length;
    const annualValue = calculateContractValue(machineBearings);

    return {
      id: machine.id,
      machineId: machine.id,
      machineName: machine.name,
      location: machine.location,
      criticality: 'high' as const,
      criticalBearings: criticalCount,
      failedBearings: failedCount,
      totalRiskBearings: criticalCount + failedCount,
      existingContract,
      proposedValue: annualValue,
      estimatedROI: Math.round((annualValue * 0.35) / 1000) * 1000, // 35% profit margin
    };
  });

  // Upgrade opportunities (degraded -> predictive)
  const upgradeOpportunities = mockMachines
    .filter((m) => {
      const hasContract = mockServiceContracts.some((c) => c.machineId === m.id);
      const hasDegradedBearings = mockBearings.some(
        (b) => b.machineId === m.id && b.status === 'degraded'
      );
      return hasContract && hasDegradedBearings;
    })
    .map((machine) => {
      const contract = mockServiceContracts.find((c) => c.machineId === machine.id);
      const bearings = mockBearings.filter((b) => b.machineId === machine.id);
      const upgradeCost = 800 + bearings.length * 200;
      const expectedSavings = Math.round(bearings.length * 5000);
      return {
        id: machine.id,
        machineId: machine.id,
        machineName: machine.name,
        currentService: contract?.serviceType || 'reactive',
        proposedService: 'predictive',
        upgradeCost,
        expectedSavings,
        paybackPeriod: Math.round(upgradeCost / (expectedSavings * 0.08)),
      };
    });

  // New contract opportunities (no existing contract)
  const newContractOpportunities = mockMachines
    .filter(
      (m) =>
        !mockServiceContracts.some((c) => c.machineId === m.id) &&
        mockBearings.some((b) => b.machineId === m.id)
    )
    .map((machine) => {
      const bearings = mockBearings.filter((b) => b.machineId === machine.id);
      const annualValue = calculateContractValue(bearings);
      return {
        id: machine.id,
        machineId: machine.id,
        machineName: machine.name,
        location: machine.location,
        bearingCount: bearings.length,
        proposedService: 'predictive',
        annualValue,
      };
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sales Opportunities</h1>
        <p className="text-muted-foreground mt-2">
          Identify high-value service contract and upgrade opportunities
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Immediate Opportunities</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{upsellOpportunities.length}</p>
              <p className="text-xs text-muted-foreground mt-1">high-risk machines</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Upgrade Candidates</p>
              <p className="text-3xl font-bold text-amber-500 mt-2">{upgradeOpportunities.length}</p>
              <p className="text-xs text-muted-foreground mt-1">service expansion</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">New Opportunities</p>
              <p className="text-3xl font-bold text-blue-500 mt-2">
                {newContractOpportunities.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">uncontracted machines</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Annual Value</p>
              <p className="text-3xl font-bold text-green-500 mt-2">
                ${(
                  upsellOpportunities.reduce((s, o) => s + o.proposedValue, 0) +
                  upgradeOpportunities.reduce((s, o) => s + o.upgradeCost * 10, 0) +
                  newContractOpportunities.reduce((s, o) => s + o.annualValue, 0)
                )
                  .toLocaleString()
                  .slice(0, -3)}K
              </p>
              <p className="text-xs text-muted-foreground mt-1">potential pipeline</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities Tabs */}
      <Tabs defaultValue="immediate" className="w-full">
        <TabsList>
          <TabsTrigger value="immediate">
            Immediate ({upsellOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="upgrade">
            Upgrades ({upgradeOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="new">
            New Contracts ({newContractOpportunities.length})
          </TabsTrigger>
        </TabsList>

        {/* Immediate Opportunities */}
        <TabsContent value="immediate" className="space-y-4">
          {upsellOpportunities.length > 0 ? (
            upsellOpportunities.map((opp) => (
              <Card key={opp.id} className="border-l-4 border-l-red-500 bg-red-50/5">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {opp.machineName}
                        </h3>
                        <Badge variant="destructive">HIGH RISK</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{opp.location}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Critical Bearings</p>
                          <p className="text-2xl font-bold text-red-500">{opp.criticalBearings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Failed Bearings</p>
                          <p className="text-2xl font-bold text-red-600">{opp.failedBearings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Proposed Value</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${(opp.proposedValue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Est. ROI</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${(opp.estimatedROI / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>

                      {opp.existingContract ? (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm">
                          <p className="text-muted-foreground">
                            Existing contract can be upgraded from{' '}
                            <span className="font-semibold">{opp.existingContract.serviceType}</span>
                            {' '}to{' '}
                            <span className="font-semibold">predictive maintenance</span>
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg text-sm">
                          <p className="text-muted-foreground">
                            No existing service contract. This is a new business opportunity.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-w-fit">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Create Proposal
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No immediate opportunities at this time</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upgrade Opportunities */}
        <TabsContent value="upgrade" className="space-y-4">
          {upgradeOpportunities.length > 0 ? (
            upgradeOpportunities.map((opp) => (
              <Card key={opp.id} className="border-l-4 border-l-amber-500 bg-amber-50/5">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {opp.machineName}
                        </h3>
                        <Badge variant="secondary">UPGRADE CANDIDATE</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Service</p>
                          <p className="text-sm font-semibold capitalize text-foreground">
                            {opp.currentService}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Upgrade To</p>
                          <p className="text-sm font-semibold capitalize text-foreground">
                            {opp.proposedService}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Upgrade Cost</p>
                          <p className="text-lg font-bold text-orange-600">
                            ${opp.upgradeCost.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expected Savings</p>
                          <p className="text-lg font-bold text-green-600">
                            ${(opp.expectedSavings / 1000).toFixed(0)}K/yr
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-sm">
                        <p className="text-muted-foreground">
                          Payback period: <span className="font-semibold">~{opp.paybackPeriod} months</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-fit">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Propose Upgrade
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No upgrade opportunities at this time</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* New Contract Opportunities */}
        <TabsContent value="new" className="space-y-4">
          {newContractOpportunities.length > 0 ? (
            newContractOpportunities.map((opp) => (
              <Card key={opp.id} className="border-l-4 border-l-blue-500 bg-blue-50/5">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {opp.machineName}
                        </h3>
                        <Badge>NEW OPPORTUNITY</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{opp.location}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Bearings to Monitor</p>
                          <p className="text-2xl font-bold text-blue-600">{opp.bearingCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Service Type</p>
                          <p className="text-sm font-semibold capitalize text-foreground">
                            {opp.proposedService}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Annual Value</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${(opp.annualValue / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Implementation</p>
                          <p className="text-sm font-semibold text-foreground">2-4 weeks</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm">
                        <p className="text-muted-foreground">
                          No existing service contract. Opportunity to establish new customer relationship.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-fit">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Create Proposal
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No new contract opportunities at this time</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
