import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types for Professional Support System
export interface ProfessionalRole {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  coreComponents: string[];
  features: string[];
  color: string;
  category: string;
  permissions: string[];
  workflowSteps: WorkflowStep[];
  documentTemplates: DocumentTemplate[];
  complianceChecklists: ComplianceChecklist[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  required: boolean;
  estimatedTime: number; // in minutes
  dependencies: string[]; // step IDs this depends on
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignee?: string;
  dueDate?: Date;
  completedAt?: Date;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string; // JSON schema or HTML template
  variables: TemplateVariable[];
  requiredFields: string[];
  version: string;
  lastUpdated: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select type
  validation?: string; // regex or validation rule
}

export interface ComplianceChecklist {
  id: string;
  name: string;
  description: string;
  category: string;
  items: ComplianceItem[];
  required: boolean;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastCompleted?: Date;
  nextDue?: Date;
}

export interface ComplianceItem {
  id: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  attachments?: string[];
}

export interface ProfessionalSupportState {
  selectedRole: ProfessionalRole | null;
  activeTab: string;
  activeWorkflow: string | null;
  workflows: Record<string, WorkflowStep[]>;
  documents: Record<string, DocumentTemplate[]>;
  compliance: Record<string, ComplianceChecklist[]>;
  permissions: string[];
  isLoading: boolean;
  error: string | null;
}

export type ProfessionalSupportAction =
  | { type: 'SET_SELECTED_ROLE'; payload: ProfessionalRole | null }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_ACTIVE_WORKFLOW'; payload: string | null }
  | { type: 'UPDATE_WORKFLOW_STEP'; payload: { workflowId: string; stepId: string; updates: Partial<WorkflowStep> } }
  | { type: 'SET_WORKFLOWS'; payload: Record<string, WorkflowStep[]> }
  | { type: 'SET_DOCUMENTS'; payload: Record<string, DocumentTemplate[]> }
  | { type: 'SET_COMPLIANCE'; payload: Record<string, ComplianceChecklist[]> }
  | { type: 'SET_PERMISSIONS'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: ProfessionalSupportState = {
  selectedRole: null,
  activeTab: 'overview',
  activeWorkflow: null,
  workflows: {},
  documents: {},
  compliance: {},
  permissions: [],
  isLoading: false,
  error: null,
};

// Reducer for state management
function professionalSupportReducer(state: ProfessionalSupportState, action: ProfessionalSupportAction): ProfessionalSupportState {
  switch (action.type) {
    case 'SET_SELECTED_ROLE':
      return {
        ...state,
        selectedRole: action.payload,
        activeTab: action.payload ? 'overview' : 'roles',
        activeWorkflow: null,
      };
    
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };
    
    case 'SET_ACTIVE_WORKFLOW':
      return {
        ...state,
        activeWorkflow: action.payload,
      };
    
    case 'UPDATE_WORKFLOW_STEP':
      const { workflowId, stepId, updates } = action.payload;
      const workflow = state.workflows[workflowId] || [];
      const updatedWorkflow = workflow.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      );
      return {
        ...state,
        workflows: {
          ...state.workflows,
          [workflowId]: updatedWorkflow,
        },
      };
    
    case 'SET_WORKFLOWS':
      return {
        ...state,
        workflows: action.payload,
      };
    
    case 'SET_DOCUMENTS':
      return {
        ...state,
        documents: action.payload,
      };
    
    case 'SET_COMPLIANCE':
      return {
        ...state,
        compliance: action.payload,
      };
    
    case 'SET_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context creation
interface ProfessionalSupportContextType {
  state: ProfessionalSupportState;
  dispatch: React.Dispatch<ProfessionalSupportAction>;
  // Helper functions
  hasPermission: (permission: string) => boolean;
  getRoleWorkflows: (roleId: string) => WorkflowStep[];
  getRoleDocuments: (roleId: string) => DocumentTemplate[];
  getRoleCompliance: (roleId: string) => ComplianceChecklist[];
  startWorkflow: (workflowId: string) => void;
  completeWorkflowStep: (workflowId: string, stepId: string) => void;
  getVisibleTabs: () => string[];
}

const ProfessionalSupportContext = createContext<ProfessionalSupportContextType | undefined>(undefined);

// Provider component
export const ProfessionalSupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(professionalSupportReducer, initialState);

  // Helper function to check permissions
  const hasPermission = (permission: string): boolean => {
    return state.permissions.includes(permission) || state.permissions.includes('*');
  };

  // Get workflows for a specific role
  const getRoleWorkflows = (roleId: string): WorkflowStep[] => {
    return state.workflows[roleId] || [];
  };

  // Get documents for a specific role
  const getRoleDocuments = (roleId: string): DocumentTemplate[] => {
    return state.documents[roleId] || [];
  };

  // Get compliance checklists for a specific role
  const getRoleCompliance = (roleId: string): ComplianceChecklist[] => {
    return state.compliance[roleId] || [];
  };

  // Start a workflow
  const startWorkflow = (workflowId: string): void => {
    dispatch({ type: 'SET_ACTIVE_WORKFLOW', payload: workflowId });
  };

  // Complete a workflow step
  const completeWorkflowStep = (workflowId: string, stepId: string): void => {
    dispatch({
      type: 'UPDATE_WORKFLOW_STEP',
      payload: {
        workflowId,
        stepId,
        updates: {
          status: 'completed',
          completedAt: new Date(),
        },
      },
    });
  };

  // Get visible tabs based on role and permissions
  const getVisibleTabs = (): string[] => {
    const baseTabs = ['overview', 'roles'];
    
    if (!state.selectedRole) {
      return baseTabs;
    }

    const role = state.selectedRole;
    const visibleTabs = [...baseTabs];

    // Add role-specific tabs based on permissions and role type
    if (hasPermission('view_integrations')) {
      visibleTabs.push('integrations');
    }
    
    if (hasPermission('view_workflows')) {
      visibleTabs.push('workflows');
    }
    
    if (hasPermission('view_compliance')) {
      visibleTabs.push('compliance');
    }
    
    if (hasPermission('view_documents')) {
      visibleTabs.push('documents');
    }
    
    if (hasPermission('view_analytics')) {
      visibleTabs.push('analytics');
    }
    
    if (hasPermission('view_reports')) {
      visibleTabs.push('reports');
    }
    
    if (hasPermission('view_settings')) {
      visibleTabs.push('settings');
    }

    return visibleTabs;
  };

  const value: ProfessionalSupportContextType = {
    state,
    dispatch,
    hasPermission,
    getRoleWorkflows,
    getRoleDocuments,
    getRoleCompliance,
    startWorkflow,
    completeWorkflowStep,
    getVisibleTabs,
  };

  return (
    <ProfessionalSupportContext.Provider value={value}>
      {children}
    </ProfessionalSupportContext.Provider>
  );
};

// Custom hook to use the context
export const useProfessionalSupport = (): ProfessionalSupportContextType => {
  const context = useContext(ProfessionalSupportContext);
  if (context === undefined) {
    throw new Error('useProfessionalSupport must be used within a ProfessionalSupportProvider');
  }
  return context;
};
