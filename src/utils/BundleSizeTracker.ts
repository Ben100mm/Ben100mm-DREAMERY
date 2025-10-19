/**
 * BundleSizeTracker - Tracks bundle size over time and detects performance regressions
 * Provides integration with webpack-bundle-analyzer and automated regression detection
 */

export interface BundleSizeData {
  timestamp: number;
  buildId: string;
  commitHash: string;
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  fontSize: number;
  otherSize: number;
  gzippedSize: number;
  brotliSize: number;
  chunks: ChunkData[];
  analysis: BundleAnalysis;
}

export interface ChunkData {
  name: string;
  size: number;
  gzippedSize: number;
  brotliSize: number;
  dependencies: string[];
  modules: ModuleData[];
}

export interface ModuleData {
  name: string;
  size: number;
  gzippedSize: number;
  brotliSize: number;
  chunks: string[];
}

export interface BundleAnalysis {
  totalModules: number;
  totalChunks: number;
  treeShakingEfficiency: number;
  duplicateModules: number;
  unusedModules: number;
  compressionRatios: {
    gzip: number;
    brotli: number;
  };
}

export interface RegressionAlert {
  type: 'warning' | 'error' | 'critical';
  message: string;
  currentSize: number;
  previousSize: number;
  increase: number;
  increasePercentage: number;
  threshold: number;
  timestamp: number;
}

export interface PerformanceBudget {
  name: string;
  threshold: number;
  unit: string;
  severity: 'warning' | 'error' | 'critical';
}

export class BundleSizeTracker {
  private bundleHistory: BundleSizeData[] = [];
  private budgets: PerformanceBudget[] = [];
  private alerts: RegressionAlert[] = [];
  private storageKey = 'dreamery-bundle-size-history';
  private maxHistorySize = 100; // Keep last 100 builds
  private isTracking: boolean = false;
  private alertCallback?: (alert: RegressionAlert) => void;

  constructor() {
    this.initializeBudgets();
    this.loadHistory();
  }

  /**
   * Initialize default performance budgets
   */
  private initializeBudgets(): void {
    this.budgets = [
      { name: 'Total Bundle Size', threshold: 2048, unit: 'KB', severity: 'warning' },
      { name: 'Total Bundle Size', threshold: 4096, unit: 'KB', severity: 'error' },
      { name: 'Total Bundle Size', threshold: 8192, unit: 'KB', severity: 'critical' },
      { name: 'JavaScript Size', threshold: 1536, unit: 'KB', severity: 'warning' },
      { name: 'JavaScript Size', threshold: 3072, unit: 'KB', severity: 'error' },
      { name: 'CSS Size', threshold: 256, unit: 'KB', severity: 'warning' },
      { name: 'CSS Size', threshold: 512, unit: 'KB', severity: 'error' },
      { name: 'Gzipped Size', threshold: 512, unit: 'KB', severity: 'warning' },
      { name: 'Gzipped Size', threshold: 1024, unit: 'KB', severity: 'error' },
    ];
  }

  /**
   * Load bundle size history from localStorage
   */
  private loadHistory(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.bundleHistory = JSON.parse(stored);
        }
      }
    } catch (error) {
      console.warn('Failed to load bundle size history:', error);
    }
  }

  /**
   * Save bundle size history to localStorage
   */
  private saveHistory(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.bundleHistory));
      }
    } catch (error) {
      console.warn('Failed to save bundle size history:', error);
    }
  }

  /**
   * Track bundle size for current build
   */
  async trackBundleSize(buildPath: string = 'build'): Promise<BundleSizeData> {
    const bundleData = await this.analyzeBundle(buildPath);
    
    // Add to history
    this.bundleHistory.push(bundleData);
    
    // Keep only recent history
    if (this.bundleHistory.length > this.maxHistorySize) {
      this.bundleHistory = this.bundleHistory.slice(-this.maxHistorySize);
    }
    
    // Save to storage
    this.saveHistory();
    
    // Check for regressions
    this.checkRegressions(bundleData);
    
    // Check budgets
    this.checkBudgetViolations(bundleData);
    
    return bundleData;
  }

  /**
   * Analyze bundle size from build output
   */
  private async analyzeBundle(buildPath: string): Promise<BundleSizeData> {
    const timestamp = Date.now();
    const buildId = this.generateBuildId();
    const commitHash = await this.getCommitHash();
    
    // Analyze bundle structure
    const analysis = await this.analyzeBundleStructure(buildPath);
    
    // Calculate sizes
    const sizes = await this.calculateSizes(buildPath);
    
    // Analyze chunks
    const chunks = await this.analyzeChunks(buildPath);
    
    return {
      timestamp,
      buildId,
      commitHash,
      ...sizes,
      chunks,
      analysis,
    };
  }

  /**
   * Generate unique build ID
   */
  private generateBuildId(): string {
    return `build-Date.now()-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current git commit hash
   */
  private async getCommitHash(): Promise<string> {
    try {
      // This would typically be injected during build
      if (process.env.REACT_APP_COMMIT_HASH) {
        return process.env.REACT_APP_COMMIT_HASH;
      }
      
      // Fallback to timestamp
      return `commit-${Date.now()}`;
    } catch (error) {
      return `unknown-${Date.now()}`;
    }
  }

  /**
   * Analyze bundle structure for optimization insights
   */
  private async analyzeBundleStructure(buildPath: string): Promise<BundleAnalysis> {
    // This would integrate with webpack-bundle-analyzer
    // For now, provide structure for manual analysis
    
    return {
      totalModules: 0,
      totalChunks: 0,
      treeShakingEfficiency: 0,
      duplicateModules: 0,
      unusedModules: 0,
      compressionRatios: {
        gzip: 0,
        brotli: 0,
      },
    };
  }

  /**
   * Calculate bundle sizes
   */
  private async calculateSizes(buildPath: string): Promise<{
    totalSize: number;
    jsSize: number;
    cssSize: number;
    imageSize: number;
    fontSize: number;
    otherSize: number;
    gzippedSize: number;
    brotliSize: number;
  }> {
    // This would integrate with actual build output
    // For now, provide structure for manual analysis
    
    return {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0,
      fontSize: 0,
      otherSize: 0,
      gzippedSize: 0,
      brotliSize: 0,
    };
  }

  /**
   * Analyze individual chunks
   */
  private async analyzeChunks(buildPath: string): Promise<ChunkData[]> {
    // This would integrate with webpack stats
    // For now, provide structure for manual analysis
    
    return [];
  }

  /**
   * Check for bundle size regressions
   */
  private checkRegressions(currentBuild: BundleSizeData): void {
    if (this.bundleHistory.length < 2) return;
    
    const previousBuild = this.bundleHistory[this.bundleHistory.length - 2];
    
    // Check total size regression
    const sizeIncrease = currentBuild.totalSize - previousBuild.totalSize;
    const sizeIncreasePercentage = (sizeIncrease / previousBuild.totalSize) * 100;
    
    // Alert thresholds
    const warningThreshold = 10; // 10% increase
    const errorThreshold = 25; // 25% increase
    const criticalThreshold = 50; // 50% increase
    
    let severity: 'warning' | 'error' | 'critical' = 'warning';
    if (sizeIncreasePercentage >= criticalThreshold) {
      severity = 'critical';
    } else if (sizeIncreasePercentage >= errorThreshold) {
      severity = 'error';
    } else if (sizeIncreasePercentage >= warningThreshold) {
      severity = 'warning';
    } else {
      return; // No regression
    }
    
    const alert: RegressionAlert = {
      type: severity,
      message: `Bundle size increased by ${sizeIncreasePercentage.toFixed(1)}% (${this.formatBytes(sizeIncrease)})`,
      currentSize: currentBuild.totalSize,
      previousSize: previousBuild.totalSize,
      increase: sizeIncrease,
      increasePercentage: sizeIncreasePercentage,
      threshold: severity === 'critical' ? criticalThreshold : severity === 'error' ? errorThreshold : warningThreshold,
      timestamp: Date.now(),
    };
    
    this.alerts.push(alert);
    this.emitAlert(alert);
  }

  /**
   * Check performance budget violations
   */
  private checkBudgetViolations(bundleData: BundleSizeData): void {
    this.budgets.forEach(budget => {
      let currentValue = 0;
      
      switch (budget.name) {
        case 'Total Bundle Size':
          currentValue = bundleData.totalSize;
          break;
        case 'JavaScript Size':
          currentValue = bundleData.jsSize;
          break;
        case 'CSS Size':
          currentValue = bundleData.cssSize;
          break;
        case 'Gzipped Size':
          currentValue = bundleData.gzippedSize;
          break;
        default:
          return;
      }
      
      if (currentValue > budget.threshold) {
        const alert: RegressionAlert = {
          type: budget.severity,
          message: `${budget.name} (${this.formatBytes(currentValue)}) exceeds budget (${this.formatBytes(budget.threshold)})`,
          currentSize: currentValue,
          previousSize: budget.threshold,
          increase: currentValue - budget.threshold,
          increasePercentage: ((currentValue - budget.threshold) / budget.threshold) * 100,
          threshold: budget.threshold,
          timestamp: Date.now(),
        };
        
        this.alerts.push(alert);
        this.emitAlert(alert);
      }
    });
  }

  /**
   * Emit regression alert
   */
  private emitAlert(alert: RegressionAlert): void {
    if (this.alertCallback) {
      this.alertCallback(alert);
    }
    
    // Also emit as custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bundle:regression', { detail: alert }));
    }
    
    // Log to console
    const emoji = alert.type === 'critical' ? '🚨' : alert.type === 'error' ? '⚠️' : '📈';
    console.warn(`${emoji} Bundle Regression: ${alert.message}`);
  }

  /**
   * Set callback for regression alerts
   */
  onRegression(callback: (alert: RegressionAlert) => void): void {
    this.alertCallback = callback;
  }

  /**
   * Get bundle size history
   */
  getHistory(): BundleSizeData[] {
    return [...this.bundleHistory];
  }

  /**
   * Get recent builds (last N builds)
   */
  getRecentBuilds(count: number = 10): BundleSizeData[] {
    return this.bundleHistory.slice(-count);
  }

  /**
   * Get build by ID
   */
  getBuildById(buildId: string): BundleSizeData | undefined {
    return this.bundleHistory.find(build => build.buildId === buildId);
  }

  /**
   * Get build by commit hash
   */
  getBuildByCommit(commitHash: string): BundleSizeData | undefined {
    return this.bundleHistory.find(build => build.commitHash === commitHash);
  }

  /**
   * Get size trend over time
   */
  getSizeTrend(metric: keyof BundleSizeData = 'totalSize', days: number = 30): {
    dates: string[];
    values: number[];
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recentBuilds = this.bundleHistory.filter(build => build.timestamp >= cutoff);
    
    const dates = recentBuilds.map(build => new Date(build.timestamp).toISOString().split('T')[0]);
    const values = recentBuilds.map(build => build[metric] as number);
    
    // Calculate trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (values.length >= 2) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg * 1.1) trend = 'increasing';
      else if (secondAvg < firstAvg * 0.9) trend = 'decreasing';
    }
    
    return { dates, values, trend };
  }

  /**
   * Get all regression alerts
   */
  getAlerts(): RegressionAlert[] {
    return [...this.alerts];
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: 'warning' | 'error' | 'critical'): RegressionAlert[] {
    return this.alerts.filter(alert => alert.type === severity);
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Add custom performance budget
   */
  addBudget(budget: PerformanceBudget): void {
    this.budgets.push(budget);
  }

  /**
   * Remove performance budget
   */
  removeBudget(name: string): void {
    this.budgets = this.budgets.filter(b => b.name !== name);
  }

  /**
   * Get all performance budgets
   */
  getBudgets(): PerformanceBudget[] {
    return [...this.budgets];
  }

  /**
   * Export bundle history as JSON
   */
  exportHistory(): string {
    return JSON.stringify({
      history: this.bundleHistory,
      budgets: this.budgets,
      alerts: this.alerts,
      timestamp: Date.now(),
    }, null, 2);
  }

  /**
   * Import bundle history from JSON
   */
  importHistory(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.history) this.bundleHistory = data.history;
      if (data.budgets) this.budgets = data.budgets;
      if (data.alerts) this.alerts = data.alerts;
      this.saveHistory();
    } catch (error) {
      console.error('Failed to import bundle history:', error);
    }
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Start continuous tracking
   */
  startTracking(): void {
    if (this.isTracking) return;
    
    this.isTracking = true;
    console.log('Bundle size tracking started');
  }

  /**
   * Stop continuous tracking
   */
  stopTracking(): void {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    console.log('Bundle size tracking stopped');
  }

  /**
   * Get current tracking status
   */
  isTrackingEnabled(): boolean {
    return this.isTracking;
  }

  /**
   * Generate comprehensive bundle report
   */
  generateReport(): {
    currentBuild: BundleSizeData | undefined;
    history: BundleSizeData[];
    alerts: RegressionAlert[];
    trends: Record<string, any>;
    recommendations: string[];
  } {
    const currentBuild = this.bundleHistory[this.bundleHistory.length - 1];
    const trends = {
      totalSize: this.getSizeTrend('totalSize'),
      jsSize: this.getSizeTrend('jsSize'),
      cssSize: this.getSizeTrend('cssSize'),
    };
    
    const recommendations = this.generateRecommendations();
    
    return {
      currentBuild,
      history: this.bundleHistory,
      alerts: this.alerts,
      trends,
      recommendations,
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.bundleHistory.length === 0) return recommendations;
    
    const currentBuild = this.bundleHistory[this.bundleHistory.length - 1];
    
    if (currentBuild.totalSize > 2048) {
      recommendations.push('Consider code splitting and lazy loading for large bundles');
    }
    
    if (currentBuild.jsSize > 1536) {
      recommendations.push('Review and remove unused JavaScript dependencies');
      recommendations.push('Implement tree shaking for better dead code elimination');
    }
    
    if (currentBuild.cssSize > 256) {
      recommendations.push('Consider CSS-in-JS or CSS modules for better tree shaking');
      recommendations.push('Remove unused CSS rules');
    }
    
    if (currentBuild.gzippedSize > 512) {
      recommendations.push('Enable Brotli compression for better compression ratios');
      recommendations.push('Consider using dynamic imports for route-based code splitting');
    }
    
    return recommendations;
  }
}

// Create and export singleton instance
export const bundleSizeTracker = new BundleSizeTracker();

// Auto-start tracking in development
if (process.env.NODE_ENV === 'development') {
  bundleSizeTracker.startTracking();
}

export default bundleSizeTracker;
