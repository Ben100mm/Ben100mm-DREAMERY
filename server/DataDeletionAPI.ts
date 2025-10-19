import { Request, Response } from 'express';
import { DataDeletionService } from './DataDeletionService';
import { UserDataExportService } from './UserDataExportService';
import { DataCleanupUtility } from './DataCleanupUtility';
import { z } from 'zod';

const dataDeletionService = DataDeletionService.getInstance();
const userDataExportService = UserDataExportService.getInstance();
const dataCleanupUtility = DataCleanupUtility.getInstance();

// Request validation schemas
const DeleteUserRequestSchema = z.object({
  userId: z.string(),
  forceHardDelete: z.boolean().optional().default(false),
  exportData: z.boolean().optional().default(true)
});

const ExportUserDataRequestSchema = z.object({
  userId: z.string(),
  options: z.object({
    includeAuditLogs: z.boolean().optional().default(false),
    includeAnalytics: z.boolean().optional().default(false),
    includeHistoricalData: z.boolean().optional().default(false),
    anonymizeSensitiveData: z.boolean().optional().default(true),
    format: z.enum(['json', 'csv', 'xml']).optional().default('json'),
    compression: z.boolean().optional().default(false)
  }).optional()
});

const CleanupRequestSchema = z.object({
  dryRun: z.boolean().optional().default(false)
});

/**
 * Delete user data endpoint
 */
export async function deleteUserData(req: Request, res: Response): Promise<void> {
  try {
    const { userId, forceHardDelete, exportData } = DeleteUserRequestSchema.parse(req.body);

    // Check if user exists
    const user = await dataDeletionService['prisma'].user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Export user data if requested
    let exportResult = null;
    if (exportData) {
      try {
        exportResult = await userDataExportService.exportUserData(userId, {
          includeAuditLogs: true,
          includeAnalytics: true,
          includeHistoricalData: true,
          anonymizeSensitiveData: false
        });
      } catch (error) {
        console.error('Export failed:', error);
        // Continue with deletion even if export fails
      }
    }

    // Delete user data
    const deletionResult = await dataDeletionService.deleteUserData(userId, forceHardDelete);

    res.json({
      success: deletionResult.success,
      data: {
        deletedData: deletionResult.deletedData,
        preservedData: deletionResult.preservedData,
        errors: deletionResult.errors,
        export: exportResult ? {
          exportId: exportResult.exportId,
          filePath: exportResult.filePath,
          fileSize: exportResult.fileSize,
          checksum: exportResult.checksum
        } : null
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Export user data endpoint
 */
export async function exportUserData(req: Request, res: Response): Promise<void> {
  try {
    const { userId, options } = ExportUserDataRequestSchema.parse(req.body);

    // Check if user exists
    const user = await dataDeletionService['prisma'].user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const exportResult = await userDataExportService.exportUserData(userId, options);

    res.json({
      success: exportResult.success,
      data: exportResult
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Get export history endpoint
 */
export async function getExportHistory(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
      return;
    }

    const exportHistory = await userDataExportService.getExportHistory(userId);

    res.json({
      success: true,
      data: exportHistory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Run data cleanup endpoint
 */
export async function runDataCleanup(req: Request, res: Response): Promise<void> {
  try {
    const { dryRun } = CleanupRequestSchema.parse(req.body);

    if (dryRun) {
      const stats = await dataCleanupUtility.getCleanupStatistics();
      const retentionReport = await dataDeletionService.getDataRetentionReport();
      
      res.json({
        success: true,
        data: {
          statistics: stats,
          retentionReport: retentionReport
        }
      });
      return;
    }

    const cleanupReport = await dataCleanupUtility.runCleanup();

    res.json({
      success: true,
      data: cleanupReport
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Get data retention report endpoint
 */
export async function getDataRetentionReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await dataDeletionService.getDataRetentionReport();

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Get cleanup statistics endpoint
 */
export async function getCleanupStatistics(req: Request, res: Response): Promise<void> {
  try {
    const stats = await dataCleanupUtility.getCleanupStatistics();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Cleanup old exports endpoint
 */
export async function cleanupOldExports(req: Request, res: Response): Promise<void> {
  try {
    const { olderThanDays = 30 } = req.body;

    const deletedCount = await userDataExportService.cleanupOldExports(olderThanDays);

    res.json({
      success: true,
      data: {
        deletedCount,
        olderThanDays
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Health check endpoint
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  try {
    const isHealthy = await dataDeletionService['prisma'].$queryRaw`SELECT 1`;

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: isHealthy ? 'connected' : 'disconnected'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
}
