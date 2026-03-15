import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'critical' | 'failed' | 'active' | 'maintenance' | 'offline';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    healthy: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'Healthy' },
    degraded: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', label: 'Degraded' },
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Critical' },
    failed: { bg: 'bg-red-200 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', label: 'Failed' },
    active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', label: 'Active' },
    maintenance: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Maintenance' },
    offline: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', label: 'Offline' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
