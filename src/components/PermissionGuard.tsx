
import React from 'react';
import { useAuth, UserPermissions } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PermissionGuardProps {
  permission: keyof UserPermissions;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback 
}) => {
  const { permissions } = useAuth();
  const { t } = useLanguage();

  // Check if user has permission (1 = allowed, 0 = not allowed)
  const hasPermission = permissions && permissions[permission] === 1;

  if (!hasPermission) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
            {t('accessDenied')}
          </h2>
          <p className="text-muted-foreground">
            {t('noPermissionMessage')}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
