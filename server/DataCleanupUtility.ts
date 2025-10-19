import { PrismaClient } from '@prisma/client';
import { DataDeletionService, DataClassification } from './DataDeletionService';
import { DATA_RETENTION_POLICIES, getDataClassification } from './DataRetentionConfig';

const prisma = new PrismaClient();

export interface CleanupReport {
  timestamp: Date;
  totalProcessed: number;
  totalDeleted: number;
  totalAnonymized: number;
  totalArchived: number;
  errors: string[];
  details: CleanupDetail[];
}

export interface CleanupDetail {
  modelName: string;
  classification: DataClassification;
  processed: number;
  deleted: number;
  anonymized: number;
  archived: number;
  errors: string[];
}

export class DataCleanupUtility {
  private static instance: DataCleanupUtility;
  private prisma: PrismaClient;
  private dataDeletionService: DataDeletionService;

  private constructor() {
    this.prisma = prisma;
    this.dataDeletionService = DataDeletionService.getInstance();
  }

  public static getInstance(): DataCleanupUtility {
    if (!DataCleanupUtility.instance) {
      DataCleanupUtility.instance = new DataCleanupUtility();
    }
    return DataCleanupUtility.instance;
  }

  /**
   * Run comprehensive data cleanup based on retention policies
   */
  async runCleanup(): Promise<CleanupReport> {
    const report: CleanupReport = {
      timestamp: new Date(),
      totalProcessed: 0,
      totalDeleted: 0,
      totalAnonymized: 0,
      totalArchived: 0,
      errors: [],
      details: []
    };

    try {
      // Clean up soft-deleted users
      await this.cleanupSoftDeletedUsers(report);

      // Clean up expired data by classification
      await this.cleanupExpiredData(report);

      // Clean up orphaned records
      await this.cleanupOrphanedRecords(report);

      // Clean up temporary data
      await this.cleanupTemporaryData(report);

    } catch (error) {
      report.errors.push(`Cleanup failed: ${error.message}`);
    }

    return report;
  }

  /**
   * Clean up soft-deleted users based on retention policy
   */
  private async cleanupSoftDeletedUsers(report: CleanupReport): Promise<void> {
    try {
      const userPolicy = DATA_RETENTION_POLICIES.find(
        p => p.classification === DataClassification.USER_SPECIFIC
      );

      if (!userPolicy) return;

      const cutoffDate = new Date(
        Date.now() - (userPolicy.retentionPeriodDays * 24 * 60 * 60 * 1000)
      );

      const expiredUsers = await this.prisma.user.findMany({
        where: {
          deletedAt: { not: null, lte: cutoffDate }
        }
      });

      for (const user of expiredUsers) {
        try {
          await this.prisma.user.delete({
            where: { id: user.id }
          });
          report.totalDeleted++;
        } catch (error) {
          report.errors.push(`Failed to delete user ${user.id}: ${error.message}`);
        }
      }

      report.details.push({
        modelName: 'User',
        classification: DataClassification.USER_SPECIFIC,
        processed: expiredUsers.length,
        deleted: expiredUsers.length,
        anonymized: 0,
        archived: 0,
        errors: []
      });

    } catch (error) {
      report.errors.push(`Failed to cleanup soft-deleted users: ${error.message}`);
    }
  }

  /**
   * Clean up expired data based on classification
   */
  private async cleanupExpiredData(report: CleanupReport): Promise<void> {
    const models = [
      { name: 'UserProfile', classification: DataClassification.USER_SPECIFIC },
      { name: 'Task', classification: DataClassification.USER_SPECIFIC },
      { name: 'Notification', classification: DataClassification.USER_SPECIFIC },
      { name: 'ComplianceRecord', classification: DataClassification.CRITICAL_BUSINESS },
      { name: 'DocumentInstance', classification: DataClassification.CRITICAL_BUSINESS },
      { name: 'AuditLog', classification: DataClassification.AUDIT_ANALYTICS },
      { name: 'AnalyticsMetric', classification: DataClassification.AUDIT_ANALYTICS }
    ];

    for (const model of models) {
      try {
        const policy = DATA_RETENTION_POLICIES.find(
          p => p.classification === model.classification
        );

        if (!policy) continue;

        const cutoffDate = new Date(
          Date.now() - (policy.retentionPeriodDays * 24 * 60 * 60 * 1000)
        );

        const detail: CleanupDetail = {
          modelName: model.name,
          classification: model.classification,
          processed: 0,
          deleted: 0,
          anonymized: 0,
          archived: 0,
          errors: []
        };

        switch (policy.deletionStrategy) {
          case 'soft_delete':
            await this.softDeleteExpiredRecords(model.name, cutoffDate, detail);
            break;
          case 'anonymize':
            await this.anonymizeExpiredRecords(model.name, cutoffDate, detail);
            break;
          case 'archive':
            await this.archiveExpiredRecords(model.name, cutoffDate, detail);
            break;
        }

        report.details.push(detail);
        report.totalProcessed += detail.processed;
        report.totalDeleted += detail.deleted;
        report.totalAnonymized += detail.anonymized;
        report.totalArchived += detail.archived;

      } catch (error) {
        report.errors.push(`Failed to cleanup ${model.name}: ${error.message}`);
      }
    }
  }

  /**
   * Soft delete expired records
   */
  private async softDeleteExpiredRecords(modelName: string, cutoffDate: Date, detail: CleanupDetail): Promise<void> {
    const model = (this.prisma as any)[modelName.toLowerCase()];
    if (!model) return;

    const expiredRecords = await model.findMany({
      where: {
        deletedAt: null,
        createdAt: { lte: cutoffDate }
      }
    });

    detail.processed = expiredRecords.length;

    for (const record of expiredRecords) {
      try {
        await model.update({
          where: { id: record.id },
          data: { deletedAt: new Date() }
        });
        detail.deleted++;
      } catch (error) {
        detail.errors.push(`Failed to soft delete ${record.id}: ${error.message}`);
      }
    }
  }

  /**
   * Anonymize expired records
   */
  private async anonymizeExpiredRecords(modelName: string, cutoffDate: Date, detail: CleanupDetail): Promise<void> {
    const model = (this.prisma as any)[modelName.toLowerCase()];
    if (!model) return;

    const expiredRecords = await model.findMany({
      where: {
        createdAt: { lte: cutoffDate }
      }
    });

    detail.processed = expiredRecords.length;

    for (const record of expiredRecords) {
      try {
        const anonymizedData = this.getAnonymizedData(modelName, record);
        await model.update({
          where: { id: record.id },
          data: anonymizedData
        });
        detail.anonymized++;
      } catch (error) {
        detail.errors.push(`Failed to anonymize ${record.id}: ${error.message}`);
      }
    }
  }

  /**
   * Archive expired records
   */
  private async archiveExpiredRecords(modelName: string, cutoffDate: Date, detail: CleanupDetail): Promise<void> {
    const model = (this.prisma as any)[modelName.toLowerCase()];
    if (!model) return;

    const expiredRecords = await model.findMany({
      where: {
        deletedAt: null,
        createdAt: { lte: cutoffDate }
      }
    });

    detail.processed = expiredRecords.length;

    for (const record of expiredRecords) {
      try {
        // In a real implementation, you would move this to an archive table or external storage
        await model.update({
          where: { id: record.id },
          data: { deletedAt: new Date() }
        });
        detail.archived++;
      } catch (error) {
        detail.errors.push(`Failed to archive ${record.id}: ${error.message}`);
      }
    }
  }

  /**
   * Get anonymized data for a record
   */
  private getAnonymizedData(modelName: string, record: any): any {
    const anonymizedData: any = {};

    switch (modelName) {
      case 'AuditLog':
        anonymizedData.userId = null;
        anonymizedData.ipAddress = null;
        anonymizedData.userAgent = null;
        break;
      case 'AnalyticsMetric':
        anonymizedData.userId = null;
        break;
      case 'Review':
        anonymizedData.reviewerId = null;
        break;
      case 'Rating':
        anonymizedData.reviewerId = null;
        break;
      default:
        // Generic anonymization
        if (record.userId) anonymizedData.userId = null;
        if (record.email) anonymizedData.email = `anonymized_${Date.now()}@anonymized.local`;
        if (record.firstName) anonymizedData.firstName = 'Anonymized';
        if (record.lastName) anonymizedData.lastName = 'User';
    }

    return anonymizedData;
  }

  /**
   * Clean up orphaned records
   */
  private async cleanupOrphanedRecords(report: CleanupReport): Promise<void> {
    try {
      // Clean up orphaned reminders
      const orphanedReminders = await this.prisma.reminder.findMany({
        where: {
          task: null
        }
      });

      for (const reminder of orphanedReminders) {
        try {
          await this.prisma.reminder.delete({
            where: { id: reminder.id }
          });
          report.totalDeleted++;
        } catch (error) {
          report.errors.push(`Failed to delete orphaned reminder ${reminder.id}: ${error.message}`);
        }
      }

      // Clean up orphaned role permissions
      const orphanedRolePermissions = await this.prisma.rolePermission.findMany({
        where: {
          OR: [
            { role: null },
            { permission: null }
          ]
        }
      });

      for (const rolePermission of orphanedRolePermissions) {
        try {
          await this.prisma.rolePermission.delete({
            where: { id: rolePermission.id }
          });
          report.totalDeleted++;
        } catch (error) {
          report.errors.push(`Failed to delete orphaned role permission ${rolePermission.id}: ${error.message}`);
        }
      }

    } catch (error) {
      report.errors.push(`Failed to cleanup orphaned records: ${error.message}`);
    }
  }

  /**
   * Clean up temporary data
   */
  private async cleanupTemporaryData(report: CleanupReport): Promise<void> {
    try {
      // Clean up old chat messages (older than 1 year)
      const oneYearAgo = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000));
      
      const oldChatMessages = await this.prisma.chatMessage.findMany({
        where: {
          ts: { lte: oneYearAgo }
        }
      });

      for (const message of oldChatMessages) {
        try {
          await this.prisma.chatMessage.delete({
            where: { id: message.id }
          });
          report.totalDeleted++;
        } catch (error) {
          report.errors.push(`Failed to delete old chat message ${message.id}: ${error.message}`);
        }
      }

    } catch (error) {
      report.errors.push(`Failed to cleanup temporary data: ${error.message}`);
    }
  }

  /**
   * Get cleanup statistics
   */
  async getCleanupStatistics(): Promise<{
    totalRecords: number;
    softDeletedRecords: number;
    orphanedRecords: number;
    expiredRecords: number;
  }> {
    const totalRecords = await this.prisma.user.count() +
                        await this.prisma.userProfile.count() +
                        await this.prisma.task.count() +
                        await this.prisma.notification.count() +
                        await this.prisma.complianceRecord.count() +
                        await this.prisma.auditLog.count() +
                        await this.prisma.analyticsMetric.count();

    const softDeletedRecords = await this.prisma.user.count({
      where: { deletedAt: { not: null } }
    });

    const orphanedRecords = await this.prisma.reminder.count({
      where: { task: null }
    });

    const oneYearAgo = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000));
    const expiredRecords = await this.prisma.chatMessage.count({
      where: { ts: { lte: oneYearAgo } }
    });

    return {
      totalRecords,
      softDeletedRecords,
      orphanedRecords,
      expiredRecords
    };
  }

  /**
   * Schedule automatic cleanup (to be called by cron job)
   */
  async scheduleCleanup(): Promise<void> {
    try {
      const report = await this.runCleanup();
      
      // Log the cleanup report
      console.log('Data cleanup completed:', {
        timestamp: report.timestamp,
        totalProcessed: report.totalProcessed,
        totalDeleted: report.totalDeleted,
        totalAnonymized: report.totalAnonymized,
        totalArchived: report.totalArchived,
        errorCount: report.errors.length
      });

      // In a real implementation, you would send this to a monitoring system
      if (report.errors.length > 0) {
        console.error('Cleanup errors:', report.errors);
      }

    } catch (error) {
      console.error('Scheduled cleanup failed:', error);
    }
  }
}

export const dataCleanupUtility = DataCleanupUtility.getInstance();
