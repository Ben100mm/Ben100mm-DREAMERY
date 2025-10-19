import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

export const UserDataExportSchema = z.object({
  userId: z.string(),
  exportDate: z.date(),
  dataTypes: z.array(z.string()),
  filePath: z.string(),
  checksum: z.string(),
  fileSize: z.number(),
  status: z.enum(['pending', 'processing', 'completed', 'failed'])
});

export type UserDataExport = z.infer<typeof UserDataExportSchema>;

export interface ExportOptions {
  includeAuditLogs?: boolean;
  includeAnalytics?: boolean;
  includeHistoricalData?: boolean;
  anonymizeSensitiveData?: boolean;
  format?: 'json' | 'csv' | 'xml';
  compression?: boolean;
}

export interface ExportResult {
  success: boolean;
  exportId: string;
  filePath: string;
  fileSize: number;
  checksum: string;
  dataTypes: string[];
  errors: string[];
}

export class UserDataExportService {
  private static instance: UserDataExportService;
  private prisma: PrismaClient;
  private exportDirectory: string;

  private constructor() {
    this.prisma = prisma;
    this.exportDirectory = path.join(process.cwd(), 'exports');
    this.ensureExportDirectory();
  }

  public static getInstance(): UserDataExportService {
    if (!UserDataExportService.instance) {
      UserDataExportService.instance = new UserDataExportService();
    }
    return UserDataExportService.instance;
  }

  /**
   * Export all user data
   */
  async exportUserData(
    userId: string, 
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    const exportId = `export_${userId}_${Date.now()}`;
    const result: ExportResult = {
      success: false,
      exportId,
      filePath: '',
      fileSize: 0,
      checksum: '',
      dataTypes: [],
      errors: []
    };

    try {
      // Get user data
      const userData = await this.getUserData(userId, options);
      
      // Generate file path
      const fileName = `${exportId}.${options.format || 'json'}`;
      const filePath = path.join(this.exportDirectory, fileName);
      
      // Write data to file
      const dataString = this.formatData(userData, options.format || 'json');
      fs.writeFileSync(filePath, dataString);
      
      // Calculate checksum
      const checksum = this.calculateChecksum(dataString);
      
      // Get file size
      const stats = fs.statSync(filePath);
      
      // Update result
      result.success = true;
      result.filePath = filePath;
      result.fileSize = stats.size;
      result.checksum = checksum;
      result.dataTypes = Object.keys(userData);

      // Log the export
      await this.logExport(userId, exportId, result);

    } catch (error) {
      result.errors.push(`Export failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Get comprehensive user data
   */
  private async getUserData(userId: string, options: ExportOptions): Promise<any> {
    const userData: any = {};

    try {
      // Basic user information
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              category: true,
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      userData.user = this.anonymizeUserData(user, options.anonymizeSensitiveData);

      // User profile
      const profile = await this.prisma.userProfile.findUnique({
        where: { userId }
      });
      if (profile) {
        userData.profile = this.anonymizeProfileData(profile, options.anonymizeSensitiveData);
      }

      // Tasks
      const tasks = await this.prisma.task.findMany({
        where: { userId },
        include: {
          reminders: true
        }
      });
      userData.tasks = tasks;

      // Notifications
      const notifications = await this.prisma.notification.findMany({
        where: { userId }
      });
      userData.notifications = notifications;

      // Partner profile
      const partnerProfile = await this.prisma.partnerProfile.findUnique({
        where: { userId },
        include: {
          reviews: true,
          ratings: true
        }
      });
      if (partnerProfile) {
        userData.partnerProfile = partnerProfile;
      }

      // Document instances
      const documentInstances = await this.prisma.documentInstance.findMany({
        where: { userId },
        include: {
          template: true
        }
      });
      userData.documentInstances = documentInstances;

      // Compliance records
      const complianceRecords = await this.prisma.complianceRecord.findMany({
        where: { userId },
        include: {
          requirement: true
        }
      });
      userData.complianceRecords = complianceRecords;

      // Audit logs (if requested)
      if (options.includeAuditLogs) {
        const auditLogs = await this.prisma.auditLog.findMany({
          where: { userId }
        });
        userData.auditLogs = auditLogs;
      }

      // Analytics metrics (if requested)
      if (options.includeAnalytics) {
        const analyticsMetrics = await this.prisma.analyticsMetric.findMany({
          where: { userId }
        });
        userData.analyticsMetrics = analyticsMetrics;
      }

      // Historical data (if requested)
      if (options.includeHistoricalData) {
        const reviews = await this.prisma.review.findMany({
          where: { reviewerId: userId }
        });
        userData.reviews = reviews;

        const ratings = await this.prisma.rating.findMany({
          where: { reviewerId: userId }
        });
        userData.ratings = ratings;
      }

    } catch (error) {
      throw new Error(`Failed to get user data: ${error.message}`);
    }

    return userData;
  }

  /**
   * Anonymize user data
   */
  private anonymizeUserData(user: any, anonymize: boolean = false): any {
    if (!anonymize) return user;

    return {
      ...user,
      email: `anonymized_${user.id}@anonymized.local`,
      firstName: 'Anonymized',
      lastName: 'User',
      phone: null
    };
  }

  /**
   * Anonymize profile data
   */
  private anonymizeProfileData(profile: any, anonymize: boolean = false): any {
    if (!anonymize) return profile;

    return {
      ...profile,
      phone: null,
      company: 'Anonymized Company',
      licenseNumber: null,
      bio: 'Anonymized profile'
    };
  }

  /**
   * Format data based on requested format
   */
  private formatData(data: any, format: string): string {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return this.convertToCSV(data);
      case 'xml':
        return this.convertToXML(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    const csvLines: string[] = [];
    
    // Add user data
    csvLines.push('Data Type,Field,Value');
    csvLines.push('User,id,' + data.user?.id);
    csvLines.push('User,email,' + data.user?.email);
    csvLines.push('User,firstName,' + data.user?.firstName);
    csvLines.push('User,lastName,' + data.user?.lastName);
    csvLines.push('User,createdAt,' + data.user?.createdAt);
    
    // Add profile data
    if (data.profile) {
      csvLines.push('Profile,phone,' + data.profile.phone);
      csvLines.push('Profile,company,' + data.profile.company);
      csvLines.push('Profile,experience,' + data.profile.experience);
    }
    
    // Add tasks
    if (data.tasks) {
      data.tasks.forEach((task: any, index: number) => {
        csvLines.push(`Task ${index + 1},title,${task.title}`);
        csvLines.push(`Task ${index + 1},description,${task.description}`);
        csvLines.push(`Task ${index + 1},status,${task.status}`);
        csvLines.push(`Task ${index + 1},priority,${task.priority}`);
      });
    }
    
    return csvLines.join('\n');
  }

  /**
   * Convert data to XML format
   */
  private convertToXML(data: any): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<userData>\n';
    
    // Add user data
    xml += '  <user>\n';
    xml += `    <id>${data.user?.id}</id>\n`;
    xml += `    <email>${data.user?.email}</email>\n`;
    xml += `    <firstName>${data.user?.firstName}</firstName>\n`;
    xml += `    <lastName>${data.user?.lastName}</lastName>\n`;
    xml += `    <createdAt>${data.user?.createdAt}</createdAt>\n`;
    xml += '  </user>\n';
    
    // Add profile data
    if (data.profile) {
      xml += '  <profile>\n';
      xml += `    <phone>${data.profile.phone || ''}</phone>\n`;
      xml += `    <company>${data.profile.company || ''}</company>\n`;
      xml += `    <experience>${data.profile.experience}</experience>\n`;
      xml += '  </profile>\n';
    }
    
    // Add tasks
    if (data.tasks && data.tasks.length > 0) {
      xml += '  <tasks>\n';
      data.tasks.forEach((task: any) => {
        xml += '    <task>\n';
        xml += `      <title>${task.title}</title>\n`;
        xml += `      <description>${task.description}</description>\n`;
        xml += `      <status>${task.status}</status>\n`;
        xml += `      <priority>${task.priority}</priority>\n`;
        xml += '    </task>\n';
      });
      xml += '  </tasks>\n';
    }
    
    xml += '</userData>';
    return xml;
  }

  /**
   * Calculate checksum for data integrity
   */
  private calculateChecksum(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Log export activity
   */
  private async logExport(userId: string, exportId: string, result: ExportResult): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DATA_EXPORT',
          resource: 'UserData',
          resourceId: exportId,
          changes: {
            exportId,
            filePath: result.filePath,
            fileSize: result.fileSize,
            checksum: result.checksum,
            dataTypes: result.dataTypes
          },
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to log export:', error);
    }
  }

  /**
   * Ensure export directory exists
   */
  private ensureExportDirectory(): void {
    if (!fs.existsSync(this.exportDirectory)) {
      fs.mkdirSync(this.exportDirectory, { recursive: true });
    }
  }

  /**
   * Get export history for a user
   */
  async getExportHistory(userId: string): Promise<any[]> {
    try {
      const exports = await this.prisma.auditLog.findMany({
        where: {
          userId,
          action: 'DATA_EXPORT'
        },
        orderBy: { timestamp: 'desc' }
      });

      return exports.map(exp => ({
        exportId: exp.resourceId,
        timestamp: exp.timestamp,
        filePath: exp.changes?.filePath,
        fileSize: exp.changes?.fileSize,
        checksum: exp.changes?.checksum,
        dataTypes: exp.changes?.dataTypes
      }));
    } catch (error) {
      throw new Error(`Failed to get export history: ${error.message}`);
    }
  }

  /**
   * Clean up old export files
   */
  async cleanupOldExports(olderThanDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - (olderThanDays * 24 * 60 * 60 * 1000));
      
      const oldExports = await this.prisma.auditLog.findMany({
        where: {
          action: 'DATA_EXPORT',
          timestamp: { lte: cutoffDate }
        }
      });

      let deletedCount = 0;
      for (const exp of oldExports) {
        try {
          const filePath = exp.changes?.filePath;
          if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (error) {
          console.error(`Failed to delete export file: ${error.message}`);
        }
      }

      return deletedCount;
    } catch (error) {
      throw new Error(`Failed to cleanup old exports: ${error.message}`);
    }
  }
}

export const userDataExportService = UserDataExportService.getInstance();
