import { z } from 'zod';

// Base Schemas
export const baseSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const softDeleteSchema = baseSchema.extend({
  deletedAt: z.date().optional(),
  isDeleted: z.boolean().default(false),
});

// User Schemas
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  phone: z.string().optional(),
  company: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialties: z.array(z.string()),
  experience: z.number().min(0).max(50),
  bio: z.string().max(1000).optional(),
  avatar: z.string().url().optional(),
});

export const userSchema = baseSchema.extend({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.string().uuid(),
  isActive: z.boolean(),
  profile: userProfileSchema.optional(),
});

// Role and Permission Schemas
export const permissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  resource: z.string().min(1).max(100),
  action: z.enum(['create', 'read', 'update', 'delete']),
  conditions: z.record(z.any()).optional(),
});

export const userRoleSchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  categoryId: z.string().uuid(),
  permissions: z.array(permissionSchema).optional().default([]),
  isActive: z.boolean(),
});

export const createUserRoleSchema = userRoleSchema.omit({ id: true, createdAt: true, updatedAt: true, permissions: true });

export const professionalCategorySchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  roles: z.array(z.string().uuid()).optional().default([]),
});

// Workflow Schemas
export const validationRuleSchema = z.object({
  field: z.string().min(1),
  type: z.enum(['required', 'email', 'phone', 'number', 'date', 'custom']),
  message: z.string().min(1).max(200),
  customValidator: z.function().args(z.any()).returns(z.boolean()).optional(),
});

export const workflowStepSchema = baseSchema.extend({
  workflowId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  order: z.number().int().min(0),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped', 'failed']),
  data: z.record(z.any()),
  requiredFields: z.array(z.string()),
  validationRules: z.array(validationRuleSchema),
  estimatedDuration: z.number().min(0),
  dependencies: z.array(z.string().uuid()),
});

export const workflowSchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  roleId: z.string().uuid(),
  steps: z.array(workflowStepSchema),
  isActive: z.boolean(),
});

// Document Schemas
export const documentVariableSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(['string', 'number', 'date', 'boolean', 'object']),
  required: z.boolean(),
  defaultValue: z.any().optional(),
  validation: validationRuleSchema.optional(),
});

export const documentTemplateSchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  roleId: z.string().uuid(),
  category: z.enum(['contract', 'form', 'agreement', 'disclosure', 'report', 'template']),
  content: z.string(),
  variables: z.array(documentVariableSchema),
  version: z.string().min(1).max(20),
  isActive: z.boolean(),
});

export const documentInstanceSchema = baseSchema.extend({
  templateId: z.string().uuid(),
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  data: z.record(z.any()),
  status: z.enum(['draft', 'pending', 'signed', 'expired', 'archived']),
  signedAt: z.date().optional(),
  expiresAt: z.date().optional(),
});

// Compliance Schemas
export const complianceCheckSchema = z.object({
  id: z.string().uuid(),
  requirementId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  isRequired: z.boolean(),
  evidenceRequired: z.boolean(),
  evidenceTypes: z.array(z.string()),
  verificationMethod: z.enum(['manual', 'automatic', 'third_party']),
});

export const complianceRequirementSchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  roleId: z.string().uuid(),
  category: z.enum(['licensing', 'insurance', 'training', 'background_check', 'continuing_education', 'financial']),
  requirements: z.array(complianceCheckSchema),
  frequency: z.enum(['once', 'annually', 'quarterly', 'monthly', 'weekly', 'daily']),
  isActive: z.boolean(),
});

export const complianceEvidenceSchema = baseSchema.extend({
  recordId: z.string().uuid(),
  type: z.string().min(1).max(50),
  filename: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  uploadedAt: z.date(),
  verifiedAt: z.date().optional(),
});

export const complianceRecordSchema = baseSchema.extend({
  requirementId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['pending', 'verified', 'failed', 'expired']),
  verifiedAt: z.date().optional(),
  verifiedBy: z.string().uuid().optional(),
  evidence: z.array(complianceEvidenceSchema).optional(),
  notes: z.string().max(1000).optional(),
});

// Analytics Schemas
export const analyticsMetricSchema = baseSchema.extend({
  roleId: z.string().uuid(),
  userId: z.string().uuid(),
  metric: z.string().min(1).max(100),
  value: z.number(),
  unit: z.string().min(1).max(20),
  category: z.enum(['performance', 'productivity', 'quality', 'financial', 'compliance', 'user_engagement']),
  timestamp: z.date(),
  metadata: z.record(z.any()).optional(),
});

export const dashboardWidgetSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['chart', 'metric', 'table', 'list']),
  title: z.string().min(1).max(100),
  dataSource: z.string().min(1).max(100),
  config: z.record(z.any()),
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    w: z.number().int().min(1),
    h: z.number().int().min(1),
  }),
});

export const analyticsDashboardSchema = baseSchema.extend({
  roleId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  widgets: z.array(dashboardWidgetSchema),
  isDefault: z.boolean(),
});

// Task and Reminder Schemas
export const taskSchema = baseSchema.extend({
  title: z.string().min(1).max(200),
  description: z.string().max(1000),
  roleId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  tags: z.array(z.string()),
});

export const reminderSchema = baseSchema.extend({
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['email', 'push', 'sms', 'in_app']),
  scheduledAt: z.date(),
  sentAt: z.date().optional(),
  isActive: z.boolean(),
});

// Notification Schema
export const notificationSchema = baseSchema.extend({
  userId: z.string().uuid(),
  title: z.string().min(1).max(200),
  message: z.string().max(1000),
  type: z.enum(['info', 'success', 'warning', 'error', 'reminder']),
  category: z.string().min(1).max(100),
  data: z.record(z.any()).optional(),
  isRead: z.boolean(),
  readAt: z.date().optional(),
});

// Audit Log Schema
export const auditLogSchema = baseSchema.extend({
  userId: z.string().uuid(),
  action: z.string().min(1).max(100),
  resource: z.string().min(1).max(100),
  resourceId: z.string().uuid(),
  changes: z.record(z.any()).optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
  timestamp: z.date(),
});

// API Response Schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    timestamp: z.date(),
  });

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1).max(100),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    }),
  });

// Input Schemas (for API endpoints)
export const createUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateUserSchema = createUserSchema.partial();

export const createWorkflowSchema = workflowSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateWorkflowSchema = createWorkflowSchema.partial();

export const createDocumentTemplateSchema = documentTemplateSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateDocumentTemplateSchema = createDocumentTemplateSchema.partial();

export const createTaskSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateTaskSchema = createTaskSchema.partial();

// Query Schemas
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const filterQuerySchema = z.object({
  roleId: z.string().uuid().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().optional(),
});

export const combinedQuerySchema = paginationQuerySchema.merge(filterQuerySchema);

// Export all schemas
export const schemas = {
  // Base
  base: baseSchema,
  softDelete: softDeleteSchema,
  
  // Users
  user: userSchema,
  userProfile: userProfileSchema,
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  
  // Roles
  userRole: userRoleSchema,
  createUserRole: createUserRoleSchema,
  professionalCategory: professionalCategorySchema,
  permission: permissionSchema,
  
  // Workflows
  workflow: workflowSchema,
  workflowStep: workflowStepSchema,
  validationRule: validationRuleSchema,
  createWorkflow: createWorkflowSchema,
  updateWorkflow: updateWorkflowSchema,
  
  // Documents
  documentTemplate: documentTemplateSchema,
  documentInstance: documentInstanceSchema,
  documentVariable: documentVariableSchema,
  createDocumentTemplate: createDocumentTemplateSchema,
  updateDocumentTemplate: updateDocumentTemplateSchema,
  
  // Compliance
  complianceRequirement: complianceRequirementSchema,
  complianceRecord: complianceRecordSchema,
  complianceCheck: complianceCheckSchema,
  complianceEvidence: complianceEvidenceSchema,
  
  // Analytics
  analyticsMetric: analyticsMetricSchema,
  analyticsDashboard: analyticsDashboardSchema,
  dashboardWidget: dashboardWidgetSchema,
  
  // Tasks
  task: taskSchema,
  reminder: reminderSchema,
  createTask: createTaskSchema,
  updateTask: updateTaskSchema,
  
  // Notifications
  notification: notificationSchema,
  
  // Audit
  auditLog: auditLogSchema,
  
  // API
  apiResponse: apiResponseSchema,
  paginatedResponse: paginatedResponseSchema,
  paginationQuery: paginationQuerySchema,
  filterQuery: filterQuerySchema,
  combinedQuery: combinedQuerySchema,
};
