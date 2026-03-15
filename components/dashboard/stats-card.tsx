import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  color = 'default',
}: StatsCardProps) {
  const colorClass = {
    default: 'border-l-4 border-l-accent',
    success: 'border-l-4 border-l-emerald-500',
    warning: 'border-l-4 border-l-amber-500',
    danger: 'border-l-4 border-l-red-500',
  }[color];

  return (
    <Card className={colorClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-2xl">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="text-xs mt-2">
            {trend > 0 ? (
              <span className="text-red-500">↑ {trend}% from last week</span>
            ) : (
              <span className="text-emerald-500">↓ {Math.abs(trend)}% from last week</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
