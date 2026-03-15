'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { mockBearings, mockRULPredictions } from '@/lib/mock-data';

export function SuggestionsWidget() {
  const { user } = useAuth();

  // Get the top suggestion based on role
  const getSuggestion = () => {
    if (user?.role === 'engineer') {
      const replacementDemand = mockRULPredictions.filter((p) => p.predictedRUL <= 90).length;
      return {
        number: 1,
        title: 'Predictive Maintenance Schedule',
        metric: `Planned Replacements (Next 90 Days): ${replacementDemand}`,
        color: 'bg-blue-500/10 border-blue-500/20',
      };
    } else if (user?.role === 'manager') {
      const criticalBearings = mockBearings.filter((b) => b.healthScore < 40);
      return {
        number: 1,
        title: 'Fleet Downtime Projection',
        metric: `Expected Failures: ${criticalBearings.length} (${criticalBearings.length * 4} hours downtime)`,
        color: 'bg-amber-500/10 border-amber-500/20',
      };
    } else if (user?.role === 'sales') {
      const replacementDemand = mockRULPredictions.filter((p) => p.predictedRUL <= 90).length;
      const aftermarketValue = replacementDemand * 1214;
      return {
        number: 1,
        title: 'Projected Replacement Demand',
        metric: `Next 90 Days: ${replacementDemand} replacements ($${aftermarketValue.toLocaleString()})`,
        color: 'bg-green-500/10 border-green-500/20',
      };
    } else {
      return {
        number: 1,
        title: 'System Performance Metrics',
        metric: 'API Response Time: 142ms | Data Accuracy: 99.8%',
        color: 'bg-purple-500/10 border-purple-500/20',
      };
    }
  };

  const suggestion = getSuggestion();

  return (
    <Card className={`border ${suggestion.color}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground font-bold text-xs">
              {suggestion.number}
            </div>
            <CardTitle className="text-base">{suggestion.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary/30 rounded p-3 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
            Key Metric
          </p>
          <p className="font-mono text-sm text-foreground">{suggestion.metric}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          View all personalized suggestions tailored to your role.
        </p>
        <Link href="/dashboard/suggestions">
          <Button variant="outline" size="sm" className="w-full">
            View All Suggestions
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
