// Core Database Types and Interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  company?: string;
  licenseNumber?: string;
  specialties: string[];
  experience: number;
  bio?: string;
  avatar?: string;
}

export interface UserRole {
  id: string;
  name: string;
  category: ProfessionalCategory;
  permissions: Permission[];
  isActive: boolean;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  conditions?: Record<string, any>;
}

export interface ProfessionalCategory {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

// Workflow Management
export interface Workflow {
  id: string;
  name: string;
  description: string;
  roleId: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  name: string;
  description: string;
  order: number;
  status: WorkflowStepStatus;
  data: Record<string, any>;
  requiredFields: string[];
  validationRules: ValidationRule[];
  estimatedDuration: number; // in minutes
  dependencies: string[]; // step IDs this depends on
}

export type WorkflowStepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'number' | 'date' | 'custom';
  message: string;
  customValidator?: (value: any) => boolean;
}

// Document Management
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  roleId: string;
  category: DocumentCategory;
  content: string;
  variables: DocumentVariable[];
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object';
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule;
}

export type DocumentCategory = 'contract' | 'form' | 'agreement' | 'disclosure' | 'report' | 'template';

export interface DocumentInstance {
  id: string;
  templateId: string;
  userId: string;
  roleId: string;
  data: Record<string, any>;
  status: DocumentStatus;
  signedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentStatus = 'draft' | 'pending' | 'signed' | 'expired' | 'archived';

// Compliance Management
export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  roleId: string;
  category: ComplianceCategory;
  requirements: ComplianceCheck[];
  frequency: ComplianceFrequency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceCheck {
  id: string;
  requirementId: string;
  name: string;
  description: string;
  isRequired: boolean;
  evidenceRequired: boolean;
  evidenceTypes: string[];
  verificationMethod: 'manual' | 'automatic' | 'third_party';
}

export type ComplianceCategory = 'licensing' | 'insurance' | 'training' | 'background_check' | 'continuing_education' | 'financial';
export type ComplianceFrequency = 'once' | 'annually' | 'quarterly' | 'monthly' | 'weekly' | 'daily';

export interface ComplianceRecord {
  id: string;
  requirementId: string;
  userId: string;
  status: ComplianceStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
  evidence?: ComplianceEvidence[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ComplianceStatus = 'pending' | 'verified' | 'failed' | 'expired';

export interface ComplianceEvidence {
  id: string;
  recordId: string;
  type: string;
  filename: string;
  fileUrl: string;
  uploadedAt: Date;
  verifiedAt?: Date;
}

// Analytics and Metrics
export interface AnalyticsMetric {
  id: string;
  roleId: string;
  userId: string;
  metric: string;
  value: number;
  unit: string;
  category: MetricCategory;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type MetricCategory = 'performance' | 'productivity' | 'quality' | 'financial' | 'compliance' | 'user_engagement';

export interface AnalyticsDashboard {
  id: string;
  roleId: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  title: string;
  dataSource: string;
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

// Task and Reminder Management
export interface Task {
  id: string;
  title: string;
  description: string;
  roleId: string;
  userId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Reminder {
  id: string;
  taskId: string;
  userId: string;
  type: ReminderType;
  scheduledAt: Date;
  sentAt?: Date;
  isActive: boolean;
}

export type ReminderType = 'email' | 'push' | 'sms' | 'in_app';

// Notification System
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder';

// Audit and Logging
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type WithSoftDelete<T> = T & {
  deletedAt?: Date;
  isDeleted: boolean;
};
