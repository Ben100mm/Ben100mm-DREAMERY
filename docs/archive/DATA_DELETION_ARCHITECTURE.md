# Data Deletion System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Data Deletion System                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   User Request  │  │  Admin Request  │  │  Cron Job       │  │
│  │                 │  │                 │  │                 │  │
│  └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘  │
│            │                    │                    │          │
│            └────────────────────┼────────────────────┘          │
│                                 │                               │
│            ┌────────────────────▼────────────────────┐          │
│            │         DataDeletionAPI                 │          │
│            │                                         │          │
│            └─────────────┬───────────────────────────┘          │
│                          │                                     │
│            ┌─────────────▼───────────────────────────┐          │
│            │      DataDeletionService                │          │
│            │                                         │          │
│            └─────────────┬───────────────────────────┘          │
│                          │                                     │
│            ┌─────────────▼───────────────────────────┐          │
│            │     Data Classification Engine          │          │
│            │                                         │          │
│            └─────────────┬───────────────────────────┘          │
│                          │                                     │
│    ┌─────────────────────┼─────────────────────┐                │
│    │                     │                     │                │
│    ▼                     ▼                     ▼                │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│ │   CASCADE   │  │  RESTRICT   │  │  SET_NULL   │              │
│ │             │  │             │  │             │              │
│ │ User Profile│  │ Compliance  │  │ Analytics   │              │
│ │ Tasks       │  │ Records     │  │ Audit Logs  │              │
│ │ Notifications│ │ Documents   │  │ Reviews     │              │
│ └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Data Deletion Request
```
User Request → API → DataDeletionService → Classification → Strategy Execution
```

### 2. Data Export Process
```
Export Request → UserDataExportService → Data Collection → Format Conversion → File Generation
```

### 3. Automated Cleanup
```
Cron Job → DataCleanupUtility → Retention Policy Check → Cleanup Execution → Report Generation
```

## Data Classification Matrix

| Data Type | Classification | Strategy | Retention | Cascade Behavior |
|-----------|---------------|----------|-----------|------------------|
| User Profile | USER_SPECIFIC | Soft Delete | 30 days | CASCADE |
| Tasks | USER_SPECIFIC | Soft Delete | 30 days | CASCADE |
| Notifications | USER_SPECIFIC | Soft Delete | 30 days | CASCADE |
| Compliance Records | CRITICAL_BUSINESS | Archive | 7 years | RESTRICT |
| Document Instances | CRITICAL_BUSINESS | Archive | 7 years | RESTRICT |
| Audit Logs | AUDIT_ANALYTICS | Anonymize | 7 years | SET_NULL |
| Analytics Metrics | AUDIT_ANALYTICS | Anonymize | 7 years | SET_NULL |
| Reviews | HISTORICAL_DATA | Anonymize | 7 years | SET_NULL |
| Ratings | HISTORICAL_DATA | Anonymize | 7 years | SET_NULL |

## Service Dependencies

```
DataDeletionService
├── PrismaClient (Database)
├── DataRetentionConfig (Policies)
└── AuditLogging (Compliance)

UserDataExportService
├── PrismaClient (Database)
├── FileSystem (Storage)
└── Crypto (Checksums)

DataCleanupUtility
├── DataDeletionService
├── UserDataExportService
└── RetentionPolicies

DataDeletionAPI
├── DataDeletionService
├── UserDataExportService
├── DataCleanupUtility
└── RequestValidation (Zod)
```

## Database Schema Changes

### Soft Delete Fields Added
- `deletedAt: DateTime?` - Timestamp for soft deletion
- Applied to: User, UserProfile, Task, Notification, ComplianceRecord, DocumentInstance, PartnerProfile

### Cascade Behaviors Updated
- **CASCADE**: User → UserProfile, Task, Notification, PartnerProfile
- **RESTRICT**: User → ComplianceRecord, DocumentInstance
- **SET_NULL**: User → AuditLog, AnalyticsMetric, Review, Rating

## API Endpoints

### Data Deletion
- `POST /api/data-deletion/delete-user` - Delete user data
- `POST /api/data-deletion/export-user` - Export user data
- `GET /api/data-deletion/export-history/:userId` - Get export history

### Data Management
- `POST /api/data-deletion/cleanup` - Run data cleanup
- `GET /api/data-deletion/retention-report` - Get retention report
- `GET /api/data-deletion/cleanup-statistics` - Get cleanup statistics
- `POST /api/data-deletion/cleanup-old-exports` - Cleanup old exports

### Health & Monitoring
- `GET /api/data-deletion/health` - Health check

## Compliance Features

### GDPR Compliance
- ✅ Right to Erasure (Article 17)
- ✅ Data Portability (Article 20)
- ✅ Data Minimization (Article 5)
- ✅ Consent Management

### CCPA Compliance
- ✅ Right to Know
- ✅ Right to Delete
- ✅ Right to Opt-Out

### SOX Compliance
- ✅ Audit Trail Preservation
- ✅ Data Integrity (Checksums)
- ✅ 7-Year Retention

## Security Measures

### Data Protection
- 🔒 Encryption for exported data
- 🔒 Role-based access control
- 🔒 Audit logging for all operations
- 🔒 Data integrity verification (checksums)

### Privacy
- 🔒 Automatic anonymization
- 🔒 Pseudonymization for preserved data
- 🔒 Data minimization principles

## Monitoring & Alerting

### Metrics Tracked
- Data retention statistics
- Cleanup success rates
- Export completion rates
- Error rates and types

### Automated Alerts
- Failed deletion attempts
- Cleanup errors
- Export failures
- Data integrity issues

## File Structure

```
server/
├── DataDeletionService.ts      # Main deletion service
├── DataRetentionConfig.ts      # Retention policies
├── DataCleanupUtility.ts       # Automated cleanup
├── UserDataExportService.ts    # Data export functionality
└── DataDeletionAPI.ts          # API endpoints

scripts/
└── data-cleanup-cron.js        # Cron job script

exports/                        # Export file storage
├── user_123_1234567890.json
├── user_456_1234567891.csv
└── user_789_1234567892.xml
```

## Usage Examples

### Delete User Data
```typescript
const result = await dataDeletionService.deleteUserData('user123', false);
console.log('Deleted:', result.deletedData);
console.log('Preserved:', result.preservedData);
```

### Export User Data
```typescript
const export = await userDataExportService.exportUserData('user123', {
  includeAuditLogs: true,
  format: 'json'
});
console.log('Export file:', export.filePath);
```

### Run Cleanup
```typescript
const report = await dataCleanupUtility.runCleanup();
console.log('Processed:', report.totalProcessed);
console.log('Deleted:', report.totalDeleted);
```

## Maintenance Schedule

### Daily
- Automated cleanup via cron job
- Export file cleanup
- Error monitoring

### Weekly
- Review cleanup reports
- Check retention policy compliance
- Monitor system health

### Monthly
- Update anonymization rules
- Review data classification
- Compliance audit

### Quarterly
- Retention policy review
- Legal requirement updates
- System performance optimization

### Annually
- Full compliance review
- Policy updates
- Security audit
