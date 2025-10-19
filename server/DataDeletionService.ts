import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { DatabaseService } from './DatabaseService';

const prisma = new PrismaClient();

// Data classification types
export enum DataClassification {
  USER_SPECIFIC = 'user_specific',      // Profile, preferences, tasks - CASCADE
  CRITICAL_BUSINESS = 'critical_business', // Transactions, compliance - RESTRICT
  OPTIONAL_RELATIONSHIP = 'optional_relationship', // Optional fields - SET_NULL
  AUDIT_ANALYTICS = 'audit_analytics',  // Audit logs, analytics - PRESERVE
  HISTORICAL_DATA = 'historical_data'   // Reviews, ratings - PRESERVE
}

// Deletion strategy types
export enum DeletionStrategy {
  HARD_DELETE = 'hard_delete',
  SOFT_DELETE = 'soft_delete',
  ANONYMIZE = 'anonymize',
  ARCHIVE = 'archive',
  RESTRICT = 'restrict'
}

// Data retention policy
export interface DataRetentionPolicy {
  classification: DataClassification;
  retentionPeriodDays: number;
  deletionStrategy: DeletionStrategy;
  anonymizeFields?: string[];
  archiveLocation?: string;
}

// User data export schema
export const UserDataExportSchema = z.object({
  userId: z.string(),
  exportDate: z.date(),
  dataTypes: z.array(z.string()),
  filePath: z.string(),
  checksum: z.string()
});

export type UserDataExport = z.infer<typeof UserDataExportSchema>;

export class DataDeletionService {
  private static instance: DataDeletionService;
  private prisma: PrismaClient;
  private databaseService: DatabaseService;

  // Data retention policies
  private retentionPolicies: DataRetentionPolicy[] = [
    {
      classification: DataClassification.USER_SPECIFIC,
      retentionPeriodDays: 30, // 30 days after account deletion
      deletionStrategy: DeletionStrategy.SOFT_DELETE
    },
    {
      classification: DataClassification.CRITICAL_BUSINESS,
      retentionPeriodDays: 2555, // 7 years for compliance
      deletionStrategy: DeletionStrategy.ARCHIVE
    },
    {
      classification: DataClassification.AUDIT_ANALYTICS,
      retentionPeriodDays: 2555, // 7 years for audit trail
      deletionStrategy: DeletionStrategy.ANONYMIZE
    },
    {
      classification: DataClassification.HISTORICAL_DATA,
      retentionPeriodDays: 2555, // 7 years for historical analysis
      deletionStrategy: DeletionStrategy.ANONYMIZE
    }
  ];

  private constructor() {
    this.prisma = prisma;
    this.databaseService = DatabaseService.getInstance();
  }

  public static getInstance(): DataDeletionService {
    if (!DataDeletionService.instance) {
      DataDeletionService.instance = new DataDeletionService();
    }
    return DataDeletionService.instance;
  }

  /**
   * Export user data before deletion
   */
  async exportUserData(userId: string): Promise<UserDataExport> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          tasks: true,
          notifications: true,
          partnerProfile: true,
          reviewsAuthored: true,
          ratingsAuthored: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const exportData = {
        user: user,
        exportDate: new Date(),
        dataTypes: ['profile', 'tasks', 'notifications', 'partner_profile', 'reviews', 'ratings']
      };

      // In a real implementation, you would save this to a file
      const filePath = `/exports/user_${userId}_${Date.now()}.json`;
      const checksum = this.generateChecksum(JSON.stringify(exportData));

      const userDataExport: UserDataExport = {
        userId,
        exportDate: new Date(),
        dataTypes: exportData.dataTypes,
        filePath,
        checksum
      };

      // Log the export for audit purposes
      await this.logAuditEvent(userId, 'DATA_EXPORT', 'User data exported before deletion', {
        exportDate: userDataExport.exportDate,
        dataTypes: userDataExport.dataTypes,
        checksum: userDataExport.checksum
      });

      return userDataExport;
    } catch (error) {
      throw new Error(`Failed to export user data: ${error.message}`);
    }
  }

  /**
   * Delete user data based on classification and retention policies
   */
  async deleteUserData(userId: string, forceHardDelete: boolean = false): Promise<{
    success: boolean;
    deletedData: string[];
    preservedData: string[];
    errors: string[];
  }> {
    const results = {
      success: true,
      deletedData: [] as string[],
      preservedData: [] as string[],
      errors: [] as string[]
    };

    try {
      // First, export user data
      await this.exportUserData(userId);

      // Check if user has critical business data that prevents deletion
      const hasCriticalData = await this.checkCriticalBusinessData(userId);
      if (hasCriticalData && !forceHardDelete) {
        results.success = false;
        results.errors.push('User has critical business data that prevents deletion. Use forceHardDelete=true to override.');
        return results;
      }

      // Delete user-specific data (CASCADE)
      await this.deleteUserSpecificData(userId, results);

      // Handle critical business data (RESTRICT or ARCHIVE)
      await this.handleCriticalBusinessData(userId, results, forceHardDelete);

      // Anonymize audit and analytics data (SET_NULL)
      await this.anonymizeAuditData(userId, results);

      // Anonymize historical data (SET_NULL)
      await this.anonymizeHistoricalData(userId, results);

      // Finally, soft delete the user
      await this.softDeleteUser(userId);

      // Log the deletion for audit purposes
      await this.logAuditEvent(userId, 'USER_DELETION', 'User data deleted', {
        deletedData: results.deletedData,
        preservedData: results.preservedData,
        forceHardDelete
      });

    } catch (error) {
      results.success = false;
      results.errors.push(`Deletion failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Delete user-specific data (profile, preferences, tasks)
   */
  private async deleteUserSpecificData(userId: string, results: any): Promise<void> {
    try {
      // Delete user profile
      await this.prisma.userProfile.deleteMany({
        where: { userId }
      });
      results.deletedData.push('user_profile');

      // Delete tasks
      await this.prisma.task.deleteMany({
        where: { userId }
      });
      results.deletedData.push('tasks');

      // Delete notifications
      await this.prisma.notification.deleteMany({
        where: { userId }
      });
      results.deletedData.push('notifications');

      // Delete partner profile
      await this.prisma.partnerProfile.deleteMany({
        where: { userId }
      });
      results.deletedData.push('partner_profile');

    } catch (error) {
      results.errors.push(`Failed to delete user-specific data: ${error.message}`);
    }
  }

  /**
   * Handle critical business data (compliance records, transactions)
   */
  private async handleCriticalBusinessData(userId: string, results: any, forceHardDelete: boolean): Promise<void> {
    try {
      // Check for compliance records
      const complianceRecords = await this.prisma.complianceRecord.findMany({
        where: { userId }
      });

      if (complianceRecords.length > 0) {
        if (forceHardDelete) {
          // Archive compliance records instead of deleting
          await this.archiveComplianceRecords(userId);
          results.preservedData.push('compliance_records (archived)');
        } else {
          results.errors.push('User has compliance records that prevent deletion');
        }
      }

      // Check for document instances
      const documentInstances = await this.prisma.documentInstance.findMany({
        where: { userId }
      });

      if (documentInstances.length > 0) {
        // Set user reference to null but preserve the documents
        await this.prisma.documentInstance.updateMany({
          where: { userId },
          data: { userId: null }
        });
        results.preservedData.push('document_instances (anonymized)');
      }

    } catch (error) {
      results.errors.push(`Failed to handle critical business data: ${error.message}`);
    }
  }

  /**
   * Anonymize audit and analytics data
   */
  private async anonymizeAuditData(userId: string, results: any): Promise<void> {
    try {
      // Anonymize audit logs
      await this.prisma.auditLog.updateMany({
        where: { userId },
        data: { userId: null }
      });
      results.preservedData.push('audit_logs (anonymized)');

      // Anonymize analytics metrics
      await this.prisma.analyticsMetric.updateMany({
        where: { userId },
        data: { userId: null }
      });
      results.preservedData.push('analytics_metrics (anonymized)');

    } catch (error) {
      results.errors.push(`Failed to anonymize audit data: ${error.message}`);
    }
  }

  /**
   * Anonymize historical data (reviews, ratings)
   */
  private async anonymizeHistoricalData(userId: string, results: any): Promise<void> {
    try {
      // Anonymize reviews
      await this.prisma.review.updateMany({
        where: { reviewerId: userId },
        data: { reviewerId: null }
      });
      results.preservedData.push('reviews (anonymized)');

      // Anonymize ratings
      await this.prisma.rating.updateMany({
        where: { reviewerId: userId },
        data: { reviewerId: null }
      });
      results.preservedData.push('ratings (anonymized)');

    } catch (error) {
      results.errors.push(`Failed to anonymize historical data: ${error.message}`);
    }
  }

  /**
   * Soft delete the user
   */
  private async softDeleteUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        email: `deleted_${Date.now()}@deleted.local` // Anonymize email
      }
    });
  }

  /**
   * Check if user has critical business data
   */
  private async checkCriticalBusinessData(userId: string): Promise<boolean> {
    const complianceRecords = await this.prisma.complianceRecord.count({
      where: { userId }
    });

    const documentInstances = await this.prisma.documentInstance.count({
      where: { userId }
    });

    return complianceRecords > 0 || documentInstances > 0;
  }

  /**
   * Archive compliance records
   */
  private async archiveComplianceRecords(userId: string): Promise<void> {
    // In a real implementation, you would move these to an archive table or external storage
    await this.prisma.complianceRecord.updateMany({
      where: { userId },
      data: { deletedAt: new Date() }
    });
  }

  /**
   * Log audit event
   */
  private async logAuditEvent(userId: string, action: string, resource: string, changes: any): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId: userId,
        changes,
        timestamp: new Date()
      }
    });
  }

  /**
   * Generate checksum for data integrity
   */
  private generateChecksum(data: string): string {
    // Simple checksum implementation - in production, use crypto.createHash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Clean up expired soft-deleted data based on retention policies
   */
  async cleanupExpiredData(): Promise<{
    cleanedUp: string[];
    errors: string[];
  }> {
    const results = {
      cleanedUp: [] as string[],
      errors: [] as string[]
    };

    try {
      const now = new Date();

      // Clean up soft-deleted users after retention period
      const userRetentionPolicy = this.retentionPolicies.find(
        p => p.classification === DataClassification.USER_SPECIFIC
      );

      if (userRetentionPolicy) {
        const cutoffDate = new Date(now.getTime() - (userRetentionPolicy.retentionPeriodDays * 24 * 60 * 60 * 1000));
        
        const expiredUsers = await this.prisma.user.findMany({
          where: {
            deletedAt: { not: null, lte: cutoffDate }
          }
        });

        for (const user of expiredUsers) {
          await this.prisma.user.delete({
            where: { id: user.id }
          });
        }

        results.cleanedUp.push(`${expiredUsers.length} expired users`);
      }

    } catch (error) {
      results.errors.push(`Cleanup failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Get data retention report
   */
  async getDataRetentionReport(): Promise<{
    totalUsers: number;
    activeUsers: number;
    softDeletedUsers: number;
    dataByClassification: Record<string, number>;
  }> {
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({
      where: { deletedAt: null }
    });
    const softDeletedUsers = await this.prisma.user.count({
      where: { deletedAt: { not: null } }
    });

    const dataByClassification = {
      user_profiles: await this.prisma.userProfile.count(),
      tasks: await this.prisma.task.count(),
      notifications: await this.prisma.notification.count(),
      compliance_records: await this.prisma.complianceRecord.count(),
      audit_logs: await this.prisma.auditLog.count(),
      analytics_metrics: await this.prisma.analyticsMetric.count(),
      reviews: await this.prisma.review.count(),
      ratings: await this.prisma.rating.count()
    };

    return {
      totalUsers,
      activeUsers,
      softDeletedUsers,
      dataByClassification
    };
  }
}

export const dataDeletionService = DataDeletionService.getInstance();
