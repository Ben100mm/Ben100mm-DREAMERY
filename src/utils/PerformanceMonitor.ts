/**
 * PerformanceMonitor - Real-time performance monitoring and metrics collection
 * Provides comprehensive performance tracking, metrics dashboard, and regression detection
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'navigation' | 'resource' | 'paint' | 'memory' | 'custom';
  metadata?: Record<string, any>;
}

export interface PerformanceBudget {
  name: string;
  threshold: number;
  unit: string;
  category: string;
  severity: 'warning' | 'error' | 'critical';
}

export interface PerformanceReport {
  timestamp: number;
  metrics: PerformanceMetric[];
  violations: PerformanceBudget[];
  summary: {
    totalMetrics: number;
    violations: number;
    averageScore: number;
  };
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private budgets: PerformanceBudget[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private isMonitoring: boolean = false;
  private reportInterval: number = 5000; // 5 seconds
  private reportCallback?: (report: PerformanceReport) => void;

  constructor() {
    this.initializeBudgets();
    this.setupPerformanceObservers();
  }

  /**
   * Initialize default performance budgets
   */
  private initializeBudgets(): void {
    this.budgets = [
      // Navigation timing budgets
      { name: 'First Contentful Paint', threshold: 1800, unit: 'ms', category: 'paint', severity: 'warning' },
      { name: 'Largest Contentful Paint', threshold: 2500, unit: 'ms', category: 'paint', severity: 'error' },
      { name: 'First Input Delay', threshold: 100, unit: 'ms', category: 'navigation', severity: 'warning' },
      { name: 'Cumulative Layout Shift', threshold: 0.1, unit: 'score', category: 'paint', severity: 'error' },
      
      // Resource loading budgets
      { name: 'Total Bundle Size', threshold: 2048, unit: 'KB', category: 'resource', severity: 'warning' },
      { name: 'Gzipped Bundle Size', threshold: 512, unit: 'KB', category: 'resource', severity: 'error' },
      
      // Memory budgets
      { name: 'Memory Usage', threshold: 50, unit: '%', category: 'memory', severity: 'warning' },
      { name: 'Heap Size', threshold: 100, unit: 'MB', category: 'memory', severity: 'error' },
    ];
  }

  /**
   * Setup Performance Observer API listeners
   */
  private setupPerformanceObservers(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported, falling back to manual monitoring');
      return;
    }

    // Navigation timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navigationObserver);
    } catch (error) {
      console.warn('Navigation timing observer setup failed:', error);
    }

    // Paint timing
    try {
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            this.recordPaintMetrics(entry as PerformancePaintTiming);
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.set('paint', paintObserver);
    } catch (error) {
      console.warn('Paint timing observer setup failed:', error);
    }

    // Resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    } catch (error) {
      console.warn('Resource timing observer setup failed:', error);
    }

    // Long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            this.recordLongTaskMetrics(entry as PerformanceLongTaskTiming);
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', longTaskObserver);
    } catch (error) {
      console.warn('Long task observer setup failed:', error);
    }
  }

  /**
   * Record navigation timing metrics
   */
  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics = [
      { name: 'DNS Lookup', value: entry.domainLookupEnd - entry.domainLookupStart, unit: 'ms' },
      { name: 'TCP Connection', value: entry.connectEnd - entry.connectStart, unit: 'ms' },
      { name: 'Request/Response', value: entry.responseEnd - entry.requestStart, unit: 'ms' },
      { name: 'DOM Processing', value: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart, unit: 'ms' },
      { name: 'Load Complete', value: entry.loadEventEnd - entry.loadEventStart, unit: 'ms' },
      { name: 'Total Navigation Time', value: entry.loadEventEnd - entry.fetchStart, unit: 'ms' },
    ];

    metrics.forEach(metric => {
      this.recordMetric({
        ...metric,
        timestamp: Date.now(),
        category: 'navigation' as const,
      });
    });
  }

  /**
   * Record paint timing metrics
   */
  private recordPaintMetrics(entry: PerformancePaintTiming): void {
    this.recordMetric({
      name: entry.name === 'first-paint' ? 'First Paint' : 'First Contentful Paint',
      value: entry.startTime,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'paint',
    });
  }

  /**
   * Record resource timing metrics
   */
  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    this.recordMetric({
      name: `Resource: ${entry.name}`,
      value: entry.duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'resource',
      metadata: {
        size: entry.transferSize,
        type: entry.initiatorType,
        url: entry.name,
      },
    });
  }

  /**
   * Record long task metrics
   */
  private recordLongTaskMetrics(entry: PerformanceLongTaskTiming): void {
    this.recordMetric({
      name: 'Long Task',
      value: entry.duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'navigation',
      metadata: {
        startTime: entry.startTime,
        name: entry.name,
      },
    });
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
    };

    this.metrics.push(fullMetric);
    
    // Check against budgets
    this.checkBudgetViolations(fullMetric);
    
    // Emit metric event
    this.emitMetricEvent(fullMetric);
  }

  /**
   * Check if a metric violates any performance budgets
   */
  private checkBudgetViolations(metric: PerformanceMetric): void {
    const violations = this.budgets.filter(budget => {
      if (budget.name === metric.name && budget.unit === metric.unit) {
        return metric.value > budget.threshold;
      }
      return false;
    });

    if (violations.length > 0) {
      this.emitViolationEvent(metric, violations);
    }
  }

  /**
   * Emit metric event for external listeners
   */
  private emitMetricEvent(metric: PerformanceMetric): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance:metric', { detail: metric }));
    }
  }

  /**
   * Emit violation event for external listeners
   */
  private emitViolationEvent(metric: PerformanceMetric, violations: PerformanceBudget[]): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance:violation', { 
        detail: { metric, violations } 
      }));
    }
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Start memory monitoring
    this.startMemoryMonitoring();
    
    // Start frame rate monitoring
    this.startFrameRateMonitoring();
    
    // Start periodic reporting
    this.startPeriodicReporting();
    
    console.log('Performance monitoring started');
  }

  /**
   * Stop continuous monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    // Stop all observers
    this.observers.forEach(observer => observer.disconnect());
    
    // Clear intervals
    if (this.memoryInterval) clearInterval(this.memoryInterval);
    if (this.frameRateInterval) clearInterval(this.frameRateInterval);
    if (this.reportInterval) clearInterval(this.reportInterval);
    
    console.log('Performance monitoring stopped');
  }

  private memoryInterval?: NodeJS.Timeout;
  private frameRateInterval?: NodeJS.Timeout;
  private reportInterval?: NodeJS.Timeout;

  /**
   * Start memory usage monitoring
   */
  private startMemoryMonitoring(): void {
    if ('memory' in performance) {
      this.memoryInterval = setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          this.recordMetric({
            name: 'Memory Usage',
            value: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
            unit: '%',
            category: 'memory',
            metadata: {
              used: memory.usedJSHeapSize,
              total: memory.totalJSHeapSize,
              limit: memory.jsHeapSizeLimit,
            },
          });
        }
      }, 10000); // Every 10 seconds
    }
  }

  /**
   * Start frame rate monitoring
   */
  private startFrameRateMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    this.frameRateInterval = setInterval(() => {
      const currentTime = performance.now();
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      this.recordMetric({
        name: 'Frame Rate',
        value: fps,
        unit: 'fps',
        category: 'custom',
      });
      
      frameCount = 0;
      lastTime = currentTime;
    }, 1000);
    
    // Count frames
    const countFrame = () => {
      frameCount++;
      if (this.isMonitoring) {
        requestAnimationFrame(countFrame);
      }
    };
    requestAnimationFrame(countFrame);
  }

  /**
   * Start periodic performance reporting
   */
  private startPeriodicReporting(): void {
    this.reportInterval = setInterval(() => {
      if (this.reportCallback) {
        const report = this.generateReport();
        this.reportCallback(report);
      }
    }, this.reportInterval);
  }

  /**
   * Generate a comprehensive performance report
   */
  generateReport(): PerformanceReport {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 60000); // Last minute
    
    const violations = this.budgets.filter(budget => {
      const metric = recentMetrics.find(m => m.name === budget.name);
      return metric && metric.value > budget.threshold;
    });

    const averageScore = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length 
      : 0;

    return {
      timestamp: now,
      metrics: recentMetrics,
      violations,
      summary: {
        totalMetrics: recentMetrics.length,
        violations: violations.length,
        averageScore,
      },
    };
  }

  /**
   * Set callback for periodic reports
   */
  onReport(callback: (report: PerformanceReport) => void): void {
    this.reportCallback = callback;
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(category: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.category === category);
  }

  /**
   * Get metrics within time range
   */
  getMetricsInRange(startTime: number, endTime: number): PerformanceMetric[] {
    return this.metrics.filter(m => m.timestamp >= startTime && m.timestamp <= endTime);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
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
   * Get current performance score (0-100)
   */
  getPerformanceScore(): number {
    const recentMetrics = this.metrics.filter(m => Date.now() - m.timestamp < 300000); // Last 5 minutes
    if (recentMetrics.length === 0) return 100;

    const violations = recentMetrics.filter(metric => {
      const budget = this.budgets.find(b => b.name === metric.name);
      return budget && metric.value > budget.threshold;
    });

    const violationRate = violations.length / recentMetrics.length;
    return Math.max(0, Math.round((1 - violationRate) * 100));
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      budgets: this.budgets,
      timestamp: Date.now(),
    }, null, 2);
  }

  /**
   * Import metrics from JSON
   */
  importMetrics(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.metrics) this.metrics = data.metrics;
      if (data.budgets) this.budgets = data.budgets;
    } catch (error) {
      console.error('Failed to import metrics:', error);
    }
  }
}

// Create and export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring();
}

export default performanceMonitor;
