'use client';

import React from 'react';
import { mockServiceContracts, mockMachines, mockBearings } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContractsPage() {
  // Calculate contract stats
  const activeContracts = mockServiceContracts.filter((c) => c.status === 'active').length;
  const totalMonthlyValue = mockServiceContracts
    .filter((c) => c.status === 'active')
    .reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalAnnualValue = totalMonthlyValue * 12;

  // Group contracts by status
  const grouped = mockServiceContracts.reduce(
    (acc, contract) => {
      if (!acc[contract.status]) {
        acc[contract.status] = [];
      }
      acc[contract.status].push(contract);
      return acc;
    },
    {} as Record<string, typeof mockServiceContracts>
  );

  const statuses = ['active', 'pending', 'expired'];

  const getServiceBadgeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'predictive':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'preventive':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'reactive':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Contracts</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor active service contracts
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Contracts</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{activeContracts}</p>
              <p className="text-xs text-muted-foreground mt-1">currently active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Recurring</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                ${(totalMonthlyValue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-muted-foreground mt-1">revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Annual Value</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                ${(totalAnnualValue / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground mt-1">projected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Bearings</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {mockServiceContracts
                  .filter((c) => c.status === 'active')
                  .reduce((sum, c) => sum + c.bearingsIncluded, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">under contract</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts by Status */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Active ({grouped['active']?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({grouped['pending']?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({grouped['expired']?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Active Contracts */}
        <TabsContent value="active" className="space-y-4">
          {grouped['active'] && grouped['active'].length > 0 ? (
            grouped['active'].map((contract) => {
              const daysUntilExpiration = Math.ceil(
                (new Date(contract.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const expiringsoon = daysUntilExpiration <= 90;

              return (
                <Card
                  key={contract.id}
                  className={expiringsoon ? 'border-l-4 border-l-amber-500 bg-amber-50/5' : ''}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-foreground">
                            {contract.customerName}
                          </h3>
                          <Badge className={getServiceBadgeColor(contract.serviceType)}>
                            {contract.serviceType.toUpperCase()}
                          </Badge>
                          {expiringsoon && (
                            <Badge variant="destructive">EXPIRING SOON</Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {mockMachines.find((m) => m.id === contract.machineId)?.name}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="font-medium text-foreground">
                              {contract.startDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">End Date</p>
                            <p className="font-medium text-foreground">
                              {contract.endDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Remaining</p>
                            <p className="font-medium text-foreground">{daysUntilExpiration} days</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Monthly Value</p>
                            <p className="font-medium text-foreground">
                              ${contract.monthlyValue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Bearings</p>
                            <p className="font-medium text-foreground">{contract.bearingsIncluded}</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Contract Duration</p>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                daysUntilExpiration <= 90
                                  ? 'bg-amber-500'
                                  : daysUntilExpiration <= 180
                                  ? 'bg-yellow-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime())) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-fit">
                        {expiringsoon && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Renew Contract
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {!expiringsoon && (
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No active contracts</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pending Contracts */}
        <TabsContent value="pending" className="space-y-4">
          {grouped['pending'] && grouped['pending'].length > 0 ? (
            grouped['pending'].map((contract) => (
              <Card key={contract.id} className="border-l-4 border-l-blue-500 bg-blue-50/5">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {contract.customerName}
                        </h3>
                        <Badge>PENDING</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {mockMachines.find((m) => m.id === contract.machineId)?.name}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Proposed Start</p>
                          <p className="font-medium text-foreground">
                            {contract.startDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Service Type</p>
                          <p className="font-medium capitalize text-foreground">
                            {contract.serviceType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Value</p>
                          <p className="font-medium text-foreground">
                            ${contract.monthlyValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bearings</p>
                          <p className="font-medium text-foreground">{contract.bearingsIncluded}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-fit">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No pending contracts</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Expired Contracts */}
        <TabsContent value="expired" className="space-y-4">
          {grouped['expired'] && grouped['expired'].length > 0 ? (
            grouped['expired'].map((contract) => (
              <Card key={contract.id} className="border-l-4 border-l-gray-400 bg-gray-50/5 opacity-75">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-foreground">
                          {contract.customerName}
                        </h3>
                        <Badge variant="secondary">EXPIRED</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {mockMachines.find((m) => m.id === contract.machineId)?.name}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Ended</p>
                          <p className="font-medium text-foreground">
                            {contract.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Service Type</p>
                          <p className="font-medium capitalize text-foreground">
                            {contract.serviceType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Value Was</p>
                          <p className="font-medium text-foreground">
                            ${contract.monthlyValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Days Since Expiration</p>
                          <p className="font-medium text-foreground">
                            {Math.floor(
                              (Date.now() - new Date(contract.endDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            days
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-fit">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Renew
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground">No expired contracts</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
