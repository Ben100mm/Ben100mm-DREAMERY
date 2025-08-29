#!/usr/bin/env node

/**
 * Automated Performance Regression Detection Script
 * Monitors performance metrics over time and alerts on regressions
 * Integrates with CI/CD pipelines for automated performance monitoring
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  metricsPath: 'performance-metrics',
  historyPath: 'performance-history.json',
  alertsPath: 'performance-alerts.json',
  thresholds: {
    // Core Web Vitals thresholds
    fcp: { warning: 1800, error: 3000, critical: 5000 }, // First Contentful Paint (ms)
    lcp: { warning: 2500, error: 4000, critical: 6000 }, // Largest Contentful Paint (ms)
    fid: { warning: 100, error: 300, critical: 500 }, // First Input Delay (ms)
    cls: { warning: 0.1, error: 0.25, critical: 0.5 }, // Cumulative Layout Shift
    
    // Bundle size thresholds
    bundleSize: { warning: 2048, error: 4096, critical: 8192 }, // KB
    jsSize: { warning: 1536, error: 3072, critical: 6144 }, // KB
    
    // Performance score thresholds
    performanceScore: { warning: 80, error: 60, critical: 40 }, // 0-100
    
    // Regression thresholds (percentage increase)
    regression: { warning: 10, error: 25, critical: 50 },
  },
  monitoring: {
    checkInterval: 60000, // 1 minute
    historyRetention: 30, // days
    maxAlerts: 1000,
    enableNotifications: true,
    notificationChannels: ['console', 'file', 'slack'], // Add more as needed
  },
  ci: {
    enabled: process.env.CI === 'true',
    failOnCritical: true,
    failOnError: false,
    failOnWarning: false,
  },
};

class AutomatedPerformanceRegressionDetection {
  constructor() {
    this.metricsHistory = this.loadMetricsHistory();
    this.alerts = this.loadAlerts();
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  /**
   * Main execution method
   */
  async run() {
    console.log('🚀 Automated Performance Regression Detection');
    console.log('============================================\n');

    try {
      // Check if running in CI mode
      if (CONFIG.ci.enabled) {
        console.log('🔧 CI/CD Mode Detected');
        await this.runCICheck();
      } else {
        console.log('🖥️  Development Mode');
        await this.runDevelopmentCheck();
      }

      console.log('\n✅ Performance regression detection completed!');
    } catch (error) {
      console.error('\n❌ Performance regression detection failed:', error.message);
      
      // In CI mode, exit with error code if critical regressions found
      if (CONFIG.ci.enabled && CONFIG.ci.failOnCritical) {
        const criticalAlerts = this.alerts.filter(alert => alert.severity === 'critical');
        if (criticalAlerts.length > 0) {
          console.error(`🚨 ${criticalAlerts.length} critical regressions found. Failing build.`);
          process.exit(1);
        }
      }
      
      process.exit(1);
    }
  }

  /**
   * Run CI/CD performance check
   */
  async runCICheck() {
    console.log('Running CI/CD performance check...');
    
    // Collect current metrics
    const currentMetrics = await this.collectCurrentMetrics();
    
    // Compare with baseline
    const baselineMetrics = this.getBaselineMetrics();
    const regressions = this.detectRegressions(currentMetrics, baselineMetrics);
    
    // Generate report
    const report = this.generateCIReport(currentMetrics, baselineMetrics, regressions);
    
    // Save results
    this.saveMetrics(currentMetrics);
    this.saveAlerts(regressions);
    
    // Output results for CI
    this.outputCIResults(report, regressions);
    
    // Check if build should fail
    this.checkCIBuildFailure(regressions);
  }

  /**
   * Run development performance check
   */
  async runDevelopmentCheck() {
    console.log('Running development performance check...');
    
    // Collect current metrics
    const currentMetrics = await this.collectCurrentMetrics();
    
    // Compare with previous metrics
    const previousMetrics = this.getPreviousMetrics();
    const regressions = this.detectRegressions(currentMetrics, previousMetrics);
    
    // Generate report
    const report = this.generateDevelopmentReport(currentMetrics, previousMetrics, regressions);
    
    // Save results
    this.saveMetrics(currentMetrics);
    this.saveAlerts(regressions);
    
    // Output results
    this.outputDevelopmentResults(report, regressions);
    
    // Start monitoring if requested
    if (process.argv.includes('--monitor')) {
      this.startMonitoring();
    }
  }

  /**
   * Collect current performance metrics
   */
  async collectCurrentMetrics() {
    console.log('📊 Collecting current performance metrics...');
    
    const metrics = {
      timestamp: Date.now(),
      buildId: this.generateBuildId(),
      commitHash: this.getCommitHash(),
      environment: process.env.NODE_ENV || 'development',
      
      // Core Web Vitals (if available)
      webVitals: await this.collectWebVitals(),
      
      // Bundle metrics
      bundle: await this.collectBundleMetrics(),
      
      // Runtime metrics
      runtime: await this.collectRuntimeMetrics(),
      
      // Custom metrics
      custom: await this.collectCustomMetrics(),
    };
    
    console.log('✅ Metrics collected');
    return metrics;
  }

  /**
   * Collect Core Web Vitals metrics
   */
  async collectWebVitals() {
    try {
      // Try to read from performance API or build artifacts
      const webVitalsPath = path.join(CONFIG.metricsPath, 'web-vitals.json');
      if (fs.existsSync(webVitalsPath)) {
        return JSON.parse(fs.readFileSync(webVitalsPath, 'utf8'));
      }
      
      // Fallback: return default structure
      return {
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
      };
    } catch (error) {
      console.warn('⚠️  Could not collect Web Vitals:', error.message);
      return {};
    }
  }

  /**
   * Collect bundle size metrics
   */
  async collectBundleMetrics() {
    try {
      // Check if build directory exists
      const buildPath = 'build';
      if (!fs.existsSync(buildPath)) {
        return { totalSize: 0, jsSize: 0, cssSize: 0 };
      }
      
      // Analyze build directory
      const bundleStats = this.analyzeBuildDirectory(buildPath);
      return bundleStats;
    } catch (error) {
      console.warn('⚠️  Could not collect bundle metrics:', error.message);
      return { totalSize: 0, jsSize: 0, cssSize: 0 };
    }
  }

  /**
   * Analyze build directory for bundle metrics
   */
  analyzeBuildDirectory(buildPath) {
    const stats = { totalSize: 0, jsSize: 0, cssSize: 0 };
    
    const analyzeDirectory = (dirPath) => {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          analyzeDirectory(itemPath);
        } else if (stat.isFile()) {
          const size = stat.size;
          const ext = path.extname(itemPath).toLowerCase();
          
          stats.totalSize += size;
          
          if (ext === '.js') {
            stats.jsSize += size;
          } else if (ext === '.css') {
            stats.cssSize += size;
          }
        }
      });
    };
    
    analyzeDirectory(buildPath);
    return stats;
  }

  /**
   * Collect runtime performance metrics
   */
  async collectRuntimeMetrics() {
    try {
      // Collect memory usage if available
      const memory = process.memoryUsage();
      
      return {
        memoryUsage: {
          rss: memory.rss,
          heapTotal: memory.heapTotal,
          heapUsed: memory.heapUsed,
          external: memory.external,
        },
        uptime: process.uptime(),
        cpuUsage: process.cpuUsage(),
      };
    } catch (error) {
      console.warn('⚠️  Could not collect runtime metrics:', error.message);
      return {};
    }
  }

  /**
   * Collect custom performance metrics
   */
  async collectCustomMetrics() {
    try {
      // Check for custom metrics file
      const customMetricsPath = path.join(CONFIG.metricsPath, 'custom-metrics.json');
      if (fs.existsSync(customMetricsPath)) {
        return JSON.parse(fs.readFileSync(customMetricsPath, 'utf8'));
      }
      
      return {};
    } catch (error) {
      console.warn('⚠️  Could not collect custom metrics:', error.message);
      return {};
    }
  }

  /**
   * Get baseline metrics for CI comparison
   */
  getBaselineMetrics() {
    try {
      // Try to get baseline from environment variable or file
      const baselinePath = process.env.PERFORMANCE_BASELINE_PATH || path.join(CONFIG.metricsPath, 'baseline.json');
      
      if (fs.existsSync(baselinePath)) {
        return JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
      }
      
      // Fallback: use last known good metrics
      const goodMetrics = this.metricsHistory.filter(m => m.performanceScore > 80);
      return goodMetrics[goodMetrics.length - 1] || null;
    } catch (error) {
      console.warn('⚠️  Could not load baseline metrics:', error.message);
      return null;
    }
  }

  /**
   * Get previous metrics for development comparison
   */
  getPreviousMetrics() {
    if (this.metricsHistory.length === 0) return null;
    return this.metricsHistory[this.metricsHistory.length - 1];
  }

  /**
   * Detect performance regressions
   */
  detectRegressions(currentMetrics, baselineMetrics) {
    if (!baselineMetrics) return [];
    
    const regressions = [];
    
    // Check Web Vitals regressions
    if (currentMetrics.webVitals && baselineMetrics.webVitals) {
      Object.keys(CONFIG.thresholds).forEach(metric => {
        if (metric === 'regression' || metric === 'bundleSize' || metric === 'jsSize' || metric === 'performanceScore') return;
        
        const current = currentMetrics.webVitals[metric];
        const baseline = baselineMetrics.webVitals[metric];
        
        if (current !== null && baseline !== null) {
          const regression = this.checkMetricRegression(metric, current, baseline);
          if (regression) {
            regressions.push(regression);
          }
        }
      });
    }
    
    // Check bundle size regressions
    if (currentMetrics.bundle && baselineMetrics.bundle) {
      const bundleRegression = this.checkBundleRegression(currentMetrics.bundle, baselineMetrics.bundle);
      if (bundleRegression) {
        regressions.push(bundleRegression);
      }
    }
    
    // Check performance score regression
    if (currentMetrics.performanceScore !== undefined && baselineMetrics.performanceScore !== undefined) {
      const scoreRegression = this.checkPerformanceScoreRegression(
        currentMetrics.performanceScore,
        baselineMetrics.performanceScore
      );
      if (scoreRegression) {
        regressions.push(scoreRegression);
      }
    }
    
    return regressions;
  }

  /**
   * Check individual metric regression
   */
  checkMetricRegression(metricName, currentValue, baselineValue) {
    const thresholds = CONFIG.thresholds[metricName];
    if (!thresholds) return null;
    
    // Calculate percentage change
    const change = ((currentValue - baselineValue) / baselineValue) * 100;
    
    // Determine severity
    let severity = null;
    if (change >= CONFIG.thresholds.regression.critical) severity = 'critical';
    else if (change >= CONFIG.thresholds.regression.error) severity = 'error';
    else if (change >= CONFIG.thresholds.regression.warning) severity = 'warning';
    
    if (!severity) return null;
    
    return {
      type: 'metric_regression',
      metric: metricName,
      severity,
      currentValue,
      baselineValue,
      change,
      changePercentage: change.toFixed(2),
      threshold: CONFIG.thresholds.regression[severity],
      timestamp: Date.now(),
      message: `${metricName} regressed by ${change.toFixed(2)}% (${currentValue} vs ${baselineValue})`,
    };
  }

  /**
   * Check bundle size regression
   */
  checkBundleRegression(currentBundle, baselineBundle) {
    const totalSizeChange = ((currentBundle.totalSize - baselineBundle.totalSize) / baselineBundle.totalSize) * 100;
    
    let severity = null;
    if (totalSizeChange >= CONFIG.thresholds.regression.critical) severity = 'critical';
    else if (totalSizeChange >= CONFIG.thresholds.regression.error) severity = 'error';
    else if (totalSizeChange >= CONFIG.thresholds.regression.warning) severity = 'warning';
    
    if (!severity) return null;
    
    return {
      type: 'bundle_regression',
      severity,
      currentSize: currentBundle.totalSize,
      baselineSize: baselineBundle.totalSize,
      change: currentBundle.totalSize - baselineBundle.totalSize,
      changePercentage: totalSizeChange.toFixed(2),
      threshold: CONFIG.thresholds.regression[severity],
      timestamp: Date.now(),
      message: `Bundle size increased by ${totalSizeChange.toFixed(2)}% (${this.formatBytes(currentBundle.totalSize)} vs ${this.formatBytes(baselineBundle.totalSize)})`,
    };
  }

  /**
   * Check performance score regression
   */
  checkPerformanceScoreRegression(currentScore, baselineScore) {
    const scoreDecrease = baselineScore - currentScore;
    
    let severity = null;
    if (scoreDecrease >= 20) severity = 'critical';
    else if (scoreDecrease >= 15) severity = 'error';
    else if (scoreDecrease >= 10) severity = 'warning';
    
    if (!severity) return null;
    
    return {
      type: 'performance_score_regression',
      severity,
      currentScore,
      baselineScore,
      decrease: scoreDecrease,
      timestamp: Date.now(),
      message: `Performance score decreased by ${scoreDecrease} points (${currentScore} vs ${baselineScore})`,
    };
  }

  /**
   * Generate CI report
   */
  generateCIReport(currentMetrics, baselineMetrics, regressions) {
    return {
      type: 'ci_report',
      timestamp: Date.now(),
      environment: 'ci',
      currentMetrics,
      baselineMetrics,
      regressions,
      summary: {
        totalRegressions: regressions.length,
        criticalRegressions: regressions.filter(r => r.severity === 'critical').length,
        errorRegressions: regressions.filter(r => r.severity === 'error').length,
        warningRegressions: regressions.filter(r => r.severity === 'warning').length,
        buildShouldFail: this.shouldFailBuild(regressions),
      },
    };
  }

  /**
   * Generate development report
   */
  generateDevelopmentReport(currentMetrics, previousMetrics, regressions) {
    return {
      type: 'development_report',
      timestamp: Date.now(),
      environment: 'development',
      currentMetrics,
      previousMetrics,
      regressions,
      summary: {
        totalRegressions: regressions.length,
        criticalRegressions: regressions.filter(r => r.severity === 'critical').length,
        errorRegressions: regressions.filter(r => r.severity === 'error').length,
        warningRegressions: regressions.filter(r => r.severity === 'warning').length,
      },
    };
  }

  /**
   * Check if CI build should fail
   */
  shouldFailBuild(regressions) {
    if (CONFIG.ci.failOnCritical) {
      const criticalRegressions = regressions.filter(r => r.severity === 'critical');
      if (criticalRegressions.length > 0) return true;
    }
    
    if (CONFIG.ci.failOnError) {
      const errorRegressions = regressions.filter(r => r.severity === 'error');
      if (errorRegressions.length > 0) return true;
    }
    
    if (CONFIG.ci.failOnWarning) {
      const warningRegressions = regressions.filter(r => r.severity === 'warning');
      if (warningRegressions.length > 0) return true;
    }
    
    return false;
  }

  /**
   * Output CI results
   */
  outputCIResults(report, regressions) {
    console.log('\n📊 CI Performance Report');
    console.log('========================');
    
    if (regressions.length === 0) {
      console.log('✅ No performance regressions detected');
      return;
    }
    
    console.log(`🚨 ${regressions.length} performance regressions detected:`);
    
    regressions.forEach(regression => {
      const emoji = regression.severity === 'critical' ? '🚨' : regression.severity === 'error' ? '⚠️' : '📈';
      console.log(`${emoji} ${regression.severity.toUpperCase()}: ${regression.message}`);
    });
    
    console.log(`\nBuild will ${report.summary.buildShouldFail ? 'FAIL' : 'PASS'} due to performance regressions`);
  }

  /**
   * Output development results
   */
  outputDevelopmentResults(report, regressions) {
    console.log('\n📊 Development Performance Report');
    console.log('==================================');
    
    if (regressions.length === 0) {
      console.log('✅ No performance regressions detected');
      return;
    }
    
    console.log(`🚨 ${regressions.length} performance regressions detected:`);
    
    regressions.forEach(regression => {
      const emoji = regression.severity === 'critical' ? '🚨' : regression.severity === 'error' ? '⚠️' : '📈';
      console.log(`${emoji} ${regression.severity.toUpperCase()}: ${regression.message}`);
    });
  }

  /**
   * Check CI build failure conditions
   */
  checkCIBuildFailure(regressions) {
    if (this.shouldFailBuild(regressions)) {
      console.error('\n🚨 Performance regressions detected. Build will fail.');
      process.exit(1);
    }
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    console.log('\n🔄 Starting continuous performance monitoring...');
    this.isMonitoring = true;
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const metrics = await this.collectCurrentMetrics();
        const previousMetrics = this.getPreviousMetrics();
        const regressions = this.detectRegressions(metrics, previousMetrics);
        
        if (regressions.length > 0) {
          console.log(`🚨 ${regressions.length} new regressions detected at ${new Date().toISOString()}`);
          regressions.forEach(regression => {
            console.log(`  - ${regression.severity.toUpperCase()}: ${regression.message}`);
          });
        }
        
        this.saveMetrics(metrics);
        this.saveAlerts(regressions);
      } catch (error) {
        console.error('❌ Monitoring error:', error.message);
      }
    }, CONFIG.monitoring.checkInterval);
    
    console.log(`✅ Monitoring started (checking every ${CONFIG.monitoring.checkInterval / 1000} seconds)`);
  }

  /**
   * Stop continuous monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('🛑 Performance monitoring stopped');
  }

  /**
   * Save metrics to history
   */
  saveMetrics(metrics) {
    this.metricsHistory.push(metrics);
    
    // Clean up old metrics
    const cutoff = Date.now() - (CONFIG.monitoring.historyRetention * 24 * 60 * 60 * 1000);
    this.metricsHistory = this.metricsHistory.filter(m => m.timestamp >= cutoff);
    
    // Save to file
    this.saveMetricsToFile();
  }

  /**
   * Save alerts
   */
  saveAlerts(newAlerts) {
    this.alerts.push(...newAlerts);
    
    // Keep only recent alerts
    if (this.alerts.length > CONFIG.monitoring.maxAlerts) {
      this.alerts = this.alerts.slice(-CONFIG.monitoring.maxAlerts);
    }
    
    // Save to file
    this.saveAlertsToFile();
  }

  /**
   * Save metrics to file
   */
  saveMetricsToFile() {
    try {
      if (!fs.existsSync(CONFIG.metricsPath)) {
        fs.mkdirSync(CONFIG.metricsPath, { recursive: true });
      }
      
      const metricsPath = path.join(CONFIG.metricsPath, 'performance-history.json');
      fs.writeFileSync(metricsPath, JSON.stringify(this.metricsHistory, null, 2));
    } catch (error) {
      console.warn('⚠️  Could not save metrics:', error.message);
    }
  }

  /**
   * Save alerts to file
   */
  saveAlertsToFile() {
    try {
      if (!fs.existsSync(CONFIG.metricsPath)) {
        fs.mkdirSync(CONFIG.metricsPath, { recursive: true });
      }
      
      const alertsPath = path.join(CONFIG.metricsPath, 'performance-alerts.json');
      fs.writeFileSync(alertsPath, JSON.stringify(this.alerts, null, 2));
    } catch (error) {
      console.warn('⚠️  Could not save alerts:', error.message);
    }
  }

  /**
   * Load metrics history from file
   */
  loadMetricsHistory() {
    try {
      const metricsPath = path.join(CONFIG.metricsPath, 'performance-history.json');
      if (fs.existsSync(metricsPath)) {
        return JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️  Could not load metrics history:', error.message);
    }
    return [];
  }

  /**
   * Load alerts from file
   */
  loadAlerts() {
    try {
      const alertsPath = path.join(CONFIG.metricsPath, 'performance-alerts.json');
      if (fs.existsSync(alertsPath)) {
        return JSON.parse(fs.readFileSync(alertsPath, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️  Could not load alerts:', error.message);
    }
    return [];
  }

  /**
   * Generate build ID
   */
  generateBuildId() {
    return `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get git commit hash
   */
  getCommitHash() {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      return `unknown-${Date.now()}`;
    }
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the detection if called directly
if (require.main === module) {
  const detection = new AutomatedPerformanceRegressionDetection();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    detection.stopMonitoring();
    process.exit(0);
  });
  
  detection.run().catch(console.error);
}

module.exports = AutomatedPerformanceRegressionDetection;
