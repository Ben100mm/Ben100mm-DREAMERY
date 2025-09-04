#!/usr/bin/env node

/**
 * Data Cleanup Cron Job
 * 
 * This script runs automated data cleanup based on retention policies.
 * It should be run daily via cron job.
 * 
 * Usage:
 * node scripts/data-cleanup-cron.js [--dry-run] [--verbose]
 * 
 * Options:
 * --dry-run: Show what would be cleaned up without actually doing it
 * --verbose: Show detailed output
 */

const { DataCleanupUtility } = require('../server/DataCleanupUtility');
const { DataDeletionService } = require('../server/DataDeletionService');
const { UserDataExportService } = require('../server/UserDataExportService');

async function runCleanup() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isVerbose = args.includes('--verbose');

  console.log(`Starting data cleanup${isDryRun ? ' (DRY RUN)' : ''}...`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  try {
    const cleanupUtility = DataCleanupUtility.getInstance();
    const dataDeletionService = DataDeletionService.getInstance();
    const userDataExportService = UserDataExportService.getInstance();

    if (isDryRun) {
      // Show what would be cleaned up
      const stats = await cleanupUtility.getCleanupStatistics();
      console.log('\nCleanup Statistics:');
      console.log(`Total Records: ${stats.totalRecords}`);
      console.log(`Soft Deleted Records: ${stats.softDeletedRecords}`);
      console.log(`Orphaned Records: ${stats.orphanedRecords}`);
      console.log(`Expired Records: ${stats.expiredRecords}`);
      
      const retentionReport = await dataDeletionService.getDataRetentionReport();
      console.log('\nData Retention Report:');
      console.log(`Total Users: ${retentionReport.totalUsers}`);
      console.log(`Active Users: ${retentionReport.activeUsers}`);
      console.log(`Soft Deleted Users: ${retentionReport.softDeletedUsers}`);
      console.log('\nData by Classification:');
      Object.entries(retentionReport.dataByClassification).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      
      return;
    }

    // Run actual cleanup
    const report = await cleanupUtility.runCleanup();
    
    console.log('\nCleanup Report:');
    console.log(`Total Processed: ${report.totalProcessed}`);
    console.log(`Total Deleted: ${report.totalDeleted}`);
    console.log(`Total Anonymized: ${report.totalAnonymized}`);
    console.log(`Total Archived: ${report.totalArchived}`);
    console.log(`Errors: ${report.errors.length}`);

    if (isVerbose && report.details.length > 0) {
      console.log('\nDetailed Results:');
      report.details.forEach(detail => {
        console.log(`\n${detail.modelName} (${detail.classification}):`);
        console.log(`  Processed: ${detail.processed}`);
        console.log(`  Deleted: ${detail.deleted}`);
        console.log(`  Anonymized: ${detail.anonymized}`);
        console.log(`  Archived: ${detail.archived}`);
        if (detail.errors.length > 0) {
          console.log(`  Errors: ${detail.errors.length}`);
          detail.errors.forEach(error => console.log(`    - ${error}`));
        }
      });
    }

    if (report.errors.length > 0) {
      console.log('\nErrors:');
      report.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Clean up old export files
    const deletedExports = await userDataExportService.cleanupOldExports(30);
    if (deletedExports > 0) {
      console.log(`\nCleaned up ${deletedExports} old export files`);
    }

    console.log('\nData cleanup completed successfully!');

  } catch (error) {
    console.error('Data cleanup failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run the cleanup
runCleanup().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
