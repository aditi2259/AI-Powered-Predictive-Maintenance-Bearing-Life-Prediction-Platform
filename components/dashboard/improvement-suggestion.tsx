'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
}

interface ImprovementSuggestionProps {
  number: number;
  title: string;
  description: string;
  suggestedMetric: string;
  example: Metric[];
  impact: string;
}

export function ImprovementSuggestion({
  number,
  title,
  description,
  suggestedMetric,
  example,
  impact,
}: ImprovementSuggestionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="border border-border bg-card p-6 hover:border-accent transition-colors">
      {/* Header with Number Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
            {number}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Suggested Metric */}
      <div className="mb-4 bg-secondary/50 rounded-lg p-4 border border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
          Suggested Metric
        </p>
        <p className="font-mono text-foreground">{suggestedMetric}</p>
      </div>

      {/* Example Section */}
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-3">Example:</p>
        <div className="space-y-2">
          {example.map((metric, idx) => (
            <div
              key={idx}
              className="bg-secondary/30 rounded-lg p-4 border border-border flex items-center justify-between group hover:bg-secondary/50 transition-colors"
            >
              <div>
                <p className="font-mono text-sm text-foreground">
                  {metric.label}: {metric.value}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(`${metric.label}: ${metric.value}`, idx)
                }
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Statement */}
      <p className="text-sm text-muted-foreground border-t border-border pt-4">
        {impact}
      </p>
    </Card>
  );
}
