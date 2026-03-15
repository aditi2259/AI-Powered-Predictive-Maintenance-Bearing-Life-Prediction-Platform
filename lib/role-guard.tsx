'use client';

import React from 'react';
import { useAuth } from './auth-context';
import { UserRole } from './types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { userRole } = useAuth();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground mt-2">
            You do not have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
