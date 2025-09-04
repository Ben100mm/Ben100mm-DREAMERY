import { DataClassification, DeletionStrategy } from './DataDeletionService';

export interface DataRetentionConfig {
  classification: DataClassification;
  retentionPeriodDays: number;
  deletionStrategy: DeletionStrategy;
  anonymizeFields?: string[];
  archiveLocation?: string;
  description: string;
  legalBasis?: string;
  exceptions?: string[];
}

export const DATA_RETENTION_POLICIES: DataRetentionConfig[] = [
  {
    classification: DataClassification.USER_SPECIFIC,
    retentionPeriodDays: 30,
    deletionStrategy: DeletionStrategy.SOFT_DELETE,
    description: 'User profile data, preferences, and personal tasks',
    legalBasis: 'GDPR Article 17 (Right to erasure)',
    exceptions: ['Data required for legal compliance', 'Data in active legal proceedings']
  },
  {
    classification: DataClassification.CRITICAL_BUSINESS,
    retentionPeriodDays: 2555, // 7 years
    deletionStrategy: DeletionStrategy.ARCHIVE,
    description: 'Compliance records, transactions, and critical business data',
    legalBasis: 'Financial regulations, SOX compliance',
    exceptions: ['Data required for ongoing investigations', 'Data subject to legal hold']
  },
  {
    classification: DataClassification.OPTIONAL_RELATIONSHIP,
    retentionPeriodDays: 90,
    deletionStrategy: DeletionStrategy.SET_NULL,
    description: 'Optional relationships and nullable foreign keys',
    legalBasis: 'Data minimization principle',
    exceptions: []
  },
  {
    classification: DataClassification.AUDIT_ANALYTICS,
    retentionPeriodDays: 2555, // 7 years
    deletionStrategy: DeletionStrategy.ANONYMIZE,
    description: 'Audit logs and analytics data for historical analysis',
    legalBasis: 'Security monitoring, compliance reporting',
    anonymizeFields: ['userId', 'ipAddress', 'userAgent'],
    exceptions: ['Data required for security investigations']
  },
  {
    classification: DataClassification.HISTORICAL_DATA,
    retentionPeriodDays: 2555, // 7 years
    deletionStrategy: DeletionStrategy.ANONYMIZE,
    description: 'Reviews, ratings, and other historical data',
    legalBasis: 'Business intelligence, historical analysis',
    anonymizeFields: ['reviewerId', 'userId'],
    exceptions: ['Data required for legal proceedings']
  }
];

export const DATA_CLASSIFICATION_MAPPING: Record<string, DataClassification> = {
  // User-specific data
  'UserProfile': DataClassification.USER_SPECIFIC,
  'Task': DataClassification.USER_SPECIFIC,
  'Notification': DataClassification.USER_SPECIFIC,
  'PartnerProfile': DataClassification.USER_SPECIFIC,

  // Critical business data
  'ComplianceRecord': DataClassification.CRITICAL_BUSINESS,
  'DocumentInstance': DataClassification.CRITICAL_BUSINESS,
  'Workflow': DataClassification.CRITICAL_BUSINESS,
  'DocumentTemplate': DataClassification.CRITICAL_BUSINESS,

  // Optional relationships
  'UserRole': DataClassification.OPTIONAL_RELATIONSHIP,
  'Permission': DataClassification.OPTIONAL_RELATIONSHIP,

  // Audit and analytics data
  'AuditLog': DataClassification.AUDIT_ANALYTICS,
  'AnalyticsMetric': DataClassification.AUDIT_ANALYTICS,
  'AnalyticsDashboard': DataClassification.AUDIT_ANALYTICS,

  // Historical data
  'Review': DataClassification.HISTORICAL_DATA,
  'Rating': DataClassification.HISTORICAL_DATA,
  'ChatMessage': DataClassification.HISTORICAL_DATA
};

export const ANONYMIZATION_RULES: Record<string, string[]> = {
  'User': ['email', 'firstName', 'lastName', 'phone'],
  'UserProfile': ['phone', 'company', 'licenseNumber', 'bio'],
  'AuditLog': ['userId', 'ipAddress', 'userAgent'],
  'AnalyticsMetric': ['userId'],
  'Review': ['reviewerId'],
  'Rating': ['reviewerId']
};

export const ARCHIVE_LOCATIONS: Record<string, string> = {
  'ComplianceRecord': '/archive/compliance',
  'DocumentInstance': '/archive/documents',
  'AuditLog': '/archive/audit',
  'AnalyticsMetric': '/archive/analytics'
};

export const RETENTION_EXCEPTIONS: Record<string, string[]> = {
  'legal_hold': ['ComplianceRecord', 'DocumentInstance', 'AuditLog'],
  'active_investigation': ['ComplianceRecord', 'AuditLog', 'AnalyticsMetric'],
  'financial_reporting': ['ComplianceRecord', 'DocumentInstance'],
  'security_incident': ['AuditLog', 'AnalyticsMetric']
};

export function getRetentionPolicy(classification: DataClassification): DataRetentionConfig | undefined {
  return DATA_RETENTION_POLICIES.find(policy => policy.classification === classification);
}

export function getDataClassification(modelName: string): DataClassification {
  return DATA_CLASSIFICATION_MAPPING[modelName] || DataClassification.USER_SPECIFIC;
}

export function getAnonymizationFields(modelName: string): string[] {
  return ANONYMIZATION_RULES[modelName] || [];
}

export function getArchiveLocation(modelName: string): string | undefined {
  return ARCHIVE_LOCATIONS[modelName];
}

export function hasRetentionException(modelName: string, exceptionType: string): boolean {
  return RETENTION_EXCEPTIONS[exceptionType]?.includes(modelName) || false;
}
