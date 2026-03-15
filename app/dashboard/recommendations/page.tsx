'use client';

import React from 'react';
import { mockRecommendations, mockBearings, mockMachines } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';

export default function RecommendationsPage() {
  const priorityColors = {
    urgent: 'border-l-red-500 bg-red-50 dark:bg-red-950',
    high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950',
    medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950',
    low: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950',
  };

  const priorityBadgeMap = {
    urgent: 'failed' as const,
    high: 'critical' as const,
    medium: 'degraded' as const,
    low: 'healthy' as const,
  };

  // Group recommendations by priority
  const grouped = mockRecommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.priority]) {
        acc[rec.priority] = [];
      }
      acc[rec.priority].push(rec);
      return acc;
    },
    {} as Record<string, typeof mockRecommendations>
  );

  const priorities = ['urgent', 'high', 'medium', 'low'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Maintenance Recommendations</h1>
        <p className="text-muted-foreground mt-2">
          Prioritized maintenance actions based on AI analysis
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{grouped['urgent']?.length || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Urgent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{grouped['high']?.length || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">{grouped['medium']?.length || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Medium Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{grouped['low']?.length || 0}</p>
              <p className="text-sm text-muted-foreground mt-2">Low Priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations by Priority */}
      {priorities.map((priority) => {
        const items = grouped[priority] || [];
        if (items.length === 0) return null;

        return (
          <div key={priority} className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground capitalize">{priority} Priority</h2>
            <div className="space-y-3">
              {items.map((rec) => (
                <Card
                  key={rec.id}
                  className={`border-l-4 ${priorityColors[rec.priority as keyof typeof priorityColors]}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">
                            {rec.machineName}
                          </h3>
                          <StatusBadge
                            status={priorityBadgeMap[rec.priority as keyof typeof priorityBadgeMap]}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Bearing Position</p>
                            <p className="font-medium text-foreground">
                              {mockBearings.find((b) => b.id === rec.bearingId)?.position}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Bearing Model</p>
                            <p className="font-medium text-foreground">{rec.bearingModel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Est. Downtime</p>
                            <p className="font-medium text-foreground">{rec.estimatedDowntime} hours</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Est. Cost</p>
                            <p className="font-medium text-foreground">
                              ${rec.estimatedCost.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="bg-background/50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-muted-foreground mb-2 font-semibold">
                            Recommendation
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            {rec.recommendation}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Generated: {(() => {
                              const date = rec.generatedAt instanceof Date ? rec.generatedAt : new Date(rec.generatedAt);
                              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                              const day = String(date.getUTCDate()).padStart(2, '0');
                              const year = date.getUTCFullYear();
                              return `${month}/${day}/${year}`;
                            })()}
                          </span>
                          <span>•</span>
                          <span className="capitalize">Status: {rec.status}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-fit">
                        {rec.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              Schedule
                            </Button>
                            <Button size="sm" variant="outline">
                              Dismiss
                            </Button>
                          </>
                        )}
                        {rec.status === 'scheduled' && (
                          <>
                            <Button size="sm" variant="outline" disabled>
                              Scheduled
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </>
                        )}
                        {rec.status === 'completed' && (
                          <Button size="sm" variant="outline" disabled>
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {mockRecommendations.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No recommendations at this time</p>
              <p className="text-sm text-muted-foreground mt-2">
                All bearings are operating within normal parameters
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
