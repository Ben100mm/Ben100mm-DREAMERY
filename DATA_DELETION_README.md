# Data Deletion and Retention System

This document describes the comprehensive data deletion and retention system implemented for the Dreamery platform, ensuring compliance with GDPR, CCPA, and other data protection regulations.

## Overview

The system implements different deletion strategies based on data classification:

- **Cascade**: User-specific data (profile, preferences, tasks)
- **Restrict**: Critical business data (transactions, compliance records)
- **SetNull**: Optional relationships (if the field is nullable)
- **Preserve**: Audit and analytics data for historical analysis
- **Soft Delete**: Important data instead of hard deletes

## Data Classification

### 1. User-Specific Data (CASCADE)
- User profiles
- Personal tasks
- Notifications
- Partner profiles
- User preferences

**Deletion Strategy**: Soft delete with 30-day retention period

### 2. Critical Business Data (RESTRICT)
- Compliance records
- Document instances
- Workflow data
- Transaction records

**Deletion Strategy**: Archive with 7-year retention period

### 3. Optional Relationships (SET_NULL)
- User role assignments
- Permission mappings
- Optional foreign keys

**Deletion Strategy**: Set foreign key to null

### 4. Audit & Analytics Data (PRESERVE)
- Audit logs
- Analytics metrics
- Performance data
- Security logs

**Deletion Strategy**: Anonymize with 7-year retention period

### 5. Historical Data (PRESERVE)
- Reviews and ratings
- Chat messages
- Historical transactions

**Deletion Strategy**: Anonymize with 7-year retention period

## Implementation

### Database Schema Changes

The Prisma schema has been updated with:

1. **Soft Delete Fields**: Added `deletedAt` timestamp to relevant models
2. **Cascade Behaviors**: Configured appropriate `onDelete` actions
3. **Data Classification**: Mapped models to data classifications

### Services

#### DataDeletionService
Main service for handling user data deletion with different strategies.

```typescript
// Delete user data
const result = await dataDeletionService.deleteUserData(userId, forceHardDelete);

// Export user data before deletion
const export = await dataDeletionService.exportUserData(userId);
```

#### UserDataExportService
Handles user data export in multiple formats (JSON, CSV, XML).

```typescript
// Export user data
const export = await userDataExportService.exportUserData(userId, {
  includeAuditLogs: true,
  includeAnalytics: true,
  format: 'json'
});
```

#### DataCleanupUtility
Automated cleanup based on retention policies.

```typescript
// Run cleanup
const report = await dataCleanupUtility.runCleanup();

// Get statistics
const stats = await dataCleanupUtility.getCleanupStatistics();
```

### API Endpoints

#### Delete User Data
```http
POST /api/data-deletion/delete-user
Content-Type: application/json

{
  "userId": "user_id",
  "forceHardDelete": false,
  "exportData": true
}
```

#### Export User Data
```http
POST /api/data-deletion/export-user
Content-Type: application/json

{
  "userId": "user_id",
  "options": {
    "includeAuditLogs": true,
    "includeAnalytics": true,
    "format": "json"
  }
}
```

#### Run Data Cleanup
```http
POST /api/data-deletion/cleanup
Content-Type: application/json

{
  "dryRun": false
}
```

#### Get Data Retention Report
```http
GET /api/data-deletion/retention-report
```

## Configuration

### Data Retention Policies

Policies are defined in `server/DataRetentionConfig.ts`:

```typescript
export const DATA_RETENTION_POLICIES: DataRetentionConfig[] = [
  {
    classification: DataClassification.USER_SPECIFIC,
    retentionPeriodDays: 30,
    deletionStrategy: DeletionStrategy.SOFT_DELETE,
    description: 'User profile data, preferences, and personal tasks',
    legalBasis: 'GDPR Article 17 (Right to erasure)'
  },
  // ... more policies
];
```

### Anonymization Rules

Sensitive fields are automatically anonymized:

```typescript
export const ANONYMIZATION_RULES: Record<string, string[]> = {
  'User': ['email', 'firstName', 'lastName', 'phone'],
  'UserProfile': ['phone', 'company', 'licenseNumber', 'bio'],
  'AuditLog': ['userId', 'ipAddress', 'userAgent']
};
```

## Automated Cleanup

### Cron Job

A cron job runs daily to clean up expired data:

```bash
# Run cleanup
npm run data:cleanup

# Dry run (show what would be cleaned)
npm run data:cleanup:dry

# Verbose output
npm run data:cleanup:verbose
```

### Cron Configuration

Add to your crontab for daily cleanup at 2 AM:

```bash
0 2 * * * cd /path/to/dreamery-homepage && npm run data:cleanup
```

## Data Export

### Supported Formats

- **JSON**: Complete data structure
- **CSV**: Tabular format for spreadsheets
- **XML**: Structured markup format

### Export Contents

- User profile and preferences
- Tasks and notifications
- Partner profile data
- Document instances
- Compliance records
- Audit logs (optional)
- Analytics data (optional)
- Historical data (optional)

## Compliance Features

### GDPR Compliance

- **Right to Erasure**: Complete user data deletion
- **Data Portability**: Export user data in standard formats
- **Data Minimization**: Only retain necessary data
- **Consent Management**: Track data processing consent

### CCPA Compliance

- **Right to Know**: Data retention reporting
- **Right to Delete**: User data deletion
- **Right to Opt-Out**: Data processing controls

### SOX Compliance

- **Audit Trail**: Preserved audit logs
- **Data Integrity**: Checksums for exported data
- **Retention Policies**: 7-year retention for financial data

## Security Considerations

### Data Protection

- **Encryption**: Exported data is encrypted
- **Access Control**: Role-based access to deletion functions
- **Audit Logging**: All deletion activities are logged
- **Checksums**: Data integrity verification

### Privacy

- **Anonymization**: Sensitive data is anonymized, not deleted
- **Pseudonymization**: User identifiers are replaced with pseudonyms
- **Data Minimization**: Only necessary data is retained

## Monitoring and Alerting

### Metrics

- Data retention statistics
- Cleanup success rates
- Export completion rates
- Error rates and types

### Alerts

- Failed deletion attempts
- Cleanup errors
- Export failures
- Data integrity issues

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=data-deletion
```

### Integration Tests

```bash
npm run test:integration -- --testPathPattern=data-deletion
```

### Manual Testing

1. **Export Test**: Export user data and verify format
2. **Deletion Test**: Delete user and verify cascade behavior
3. **Cleanup Test**: Run cleanup and verify expired data removal
4. **Anonymization Test**: Verify sensitive data is properly anonymized

## Troubleshooting

### Common Issues

1. **Cascade Failures**: Check foreign key constraints
2. **Export Errors**: Verify file system permissions
3. **Cleanup Failures**: Check database connectivity
4. **Anonymization Issues**: Verify field mappings

### Debug Mode

Enable debug logging:

```bash
DEBUG=data-deletion* npm run data:cleanup
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review cleanup reports
2. **Monthly**: Verify retention policies
3. **Quarterly**: Update anonymization rules
4. **Annually**: Review compliance requirements

### Backup Considerations

- Export data before major deletions
- Maintain audit trail backups
- Test restoration procedures

## Legal Considerations

### Data Protection Laws

- **GDPR**: European Union data protection
- **CCPA**: California Consumer Privacy Act
- **PIPEDA**: Canadian privacy law
- **LGPD**: Brazilian data protection law

### Industry Regulations

- **SOX**: Sarbanes-Oxley Act
- **HIPAA**: Health Insurance Portability and Accountability Act
- **PCI DSS**: Payment Card Industry Data Security Standard

## Support

For questions or issues with the data deletion system:

1. Check the troubleshooting section
2. Review the API documentation
3. Contact the development team
4. Submit an issue in the project repository

## Changelog

### Version 1.0.0
- Initial implementation
- Basic deletion strategies
- Export functionality
- Automated cleanup
- Compliance features
