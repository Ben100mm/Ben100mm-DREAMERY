import React, { ReactNode } from 'react';
import { useProfessionalSupport } from '../context/ProfessionalSupportContext';

interface RBACMiddlewareProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: ReactNode;
  showIfNoPermission?: boolean;
}

// RBAC Middleware Component for controlling access to content
export const RBACMiddleware: React.FC<RBACMiddlewareProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback = null,
  showIfNoPermission = false,
}) => {
  const { state, hasPermission } = useProfessionalSupport();
  const { selectedRole, permissions } = state;

  // Check if user has required permission
  const hasRequiredPermission = requiredPermission ? hasPermission(requiredPermission) : true;

  // Check if user has required role
  const hasRequiredRole = requiredRole ? selectedRole?.id === requiredRole : true;

  // Check if user has access
  const hasAccess = hasRequiredPermission && hasRequiredRole;

  // If no access and fallback is provided, show fallback
  if (!hasAccess && fallback) {
    return <>{fallback}</>;
  }

  // If no access and showIfNoPermission is false, don't render anything
  if (!hasAccess && !showIfNoPermission) {
    return null;
  }

  // If no access but showIfNoPermission is true, render children with disabled state
  if (!hasAccess && showIfNoPermission) {
    return (
      <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
        {children}
      </div>
    );
  }

  // User has access, render children normally
  return <>{children}</>;
};

// Higher-order component for wrapping components with RBAC
export function withRBAC<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string,
  requiredRole?: string,
  fallback?: ReactNode
) {
  return function RBACWrappedComponent(props: P) {
    return (
      <RBACMiddleware
        requiredPermission={requiredPermission}
        requiredRole={requiredRole}
        fallback={fallback}
      >
        <Component {...props} />
      </RBACMiddleware>
    );
  };
}

// Hook for checking permissions in components
export const useRBAC = () => {
  const { state, hasPermission } = useProfessionalSupport();
  
  return {
    hasPermission,
    selectedRole: state.selectedRole,
    permissions: state.permissions,
    isAuthenticated: !!state.selectedRole,
  };
};

// Component for conditional rendering based on permissions
interface ConditionalRenderProps {
  children: ReactNode;
  permission?: string;
  role?: string;
  fallback?: ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  permission,
  role,
  fallback = null,
}) => {
  return (
    <RBACMiddleware
      requiredPermission={permission}
      requiredRole={role}
      fallback={fallback}
    >
      {children}
    </RBACMiddleware>
  );
};

// Component for permission-based tab rendering
interface PermissionTabProps {
  tabId: string;
  label: string;
  icon?: React.ReactNode;
  permission?: string;
  role?: string;
  children: ReactNode;
}

export const PermissionTab: React.FC<PermissionTabProps> = ({
  tabId,
  label,
  icon,
  permission,
  role,
  children,
}) => {
  return (
    <RBACMiddleware
      requiredPermission={permission}
      requiredRole={role}
      fallback={null}
    >
      <div data-tab-id={tabId} data-tab-label={label}>
        {children}
      </div>
    </RBACMiddleware>
  );
};

// Utility function for filtering tabs based on permissions
export const filterTabsByPermissions = (
  tabs: Array<{ id: string; label: string; permission?: string; role?: string }>,
  hasPermission: (permission: string) => boolean,
  selectedRole?: string | null
): Array<{ id: string; label: string; permission?: string; role?: string }> => {
  return tabs.filter(tab => {
    // Check permission
    if (tab.permission && !hasPermission(tab.permission)) {
      return false;
    }

    // Check role
    if (tab.role && selectedRole !== tab.role) {
      return false;
    }

    return true;
  });
};

// Component for role-based content rendering
interface RoleBasedContentProps {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}

export const RoleBasedContent: React.FC<RoleBasedContentProps> = ({
  children,
  roles,
  fallback = null,
}) => {
  const { state } = useProfessionalSupport();
  const { selectedRole } = state;

  if (!selectedRole || !roles.includes(selectedRole.id)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component for permission-based feature flags
interface FeatureFlagProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
}

export const FeatureFlag: React.FC<FeatureFlagProps> = ({
  children,
  feature,
  fallback = null,
}) => {
  const { hasPermission } = useRBAC();
  
  if (!hasPermission(`feature_${feature}`)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Export all components and utilities
export default RBACMiddleware;
