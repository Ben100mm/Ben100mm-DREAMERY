// Bundle analysis utilities for performance monitoring
export interface BundleMetrics {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  fontSize: number;
  otherSize: number;
  gzipSize: number;
  brotliSize: number;
}

export interface ChunkAnalysis {
  name: string;
  size: number;
  gzipSize: number;
  brotliSize: number;
  dependencies: string[];
  modules: string[];
}

/**
 * Analyze bundle size from build output
 */
export function analyzeBundleSize(buildPath: string = 'build'): BundleMetrics {
  // This would typically integrate with webpack-bundle-analyzer
  // For now, we'll provide a structure for manual analysis
  
  return {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    fontSize: 0,
    otherSize: 0,
    gzipSize: 0,
    brotliSize: 0,
  };
}

/**
 * Get chunk information for analysis
 */
export function getChunkInfo(): ChunkAnalysis[] {
  // This would integrate with webpack stats
  return [];
}

/**
 * Calculate compression ratios
 */
export function calculateCompressionRatios(metrics: BundleMetrics) {
  const gzipRatio = metrics.gzipSize / metrics.totalSize;
  const brotliRatio = metrics.brotliSize / metrics.totalSize;
  
  return {
    gzipRatio: (gzipRatio * 100).toFixed(1) + '%',
    brotliRatio: (brotliRatio * 100).toFixed(1) + '%',
    gzipSavings: ((1 - gzipRatio) * 100).toFixed(1) + '%',
    brotliSavings: ((1 - brotliRatio) * 100).toFixed(1) + '%',
  };
}

/**
 * Performance budget checker
 */
export function checkPerformanceBudget(metrics: BundleMetrics, budget: Partial<BundleMetrics>) {
  const violations: string[] = [];
  
  if (budget.totalSize && metrics.totalSize > budget.totalSize) {
    violations.push(`Total bundle size metrics.totalSize exceeds budget ${budget.totalSize}`);
  }
  
  if (budget.jsSize && metrics.jsSize > budget.jsSize) {
    violations.push(`JavaScript size metrics.jsSize exceeds budget ${budget.jsSize}`);
  }
  
  if (budget.gzipSize && metrics.gzipSize > budget.gzipSize) {
    violations.push(`Gzipped size metrics.gzipSize exceeds budget ${budget.gzipSize}`);
  }
  
  return {
    passed: violations.length === 0,
    violations,
    recommendations: generateRecommendations(metrics, budget),
  };
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(metrics: BundleMetrics, budget: Partial<BundleMetrics>): string[] {
  const recommendations: string[] = [];
  
  if (metrics.jsSize > (budget.jsSize || 0)) {
    recommendations.push('Consider code splitting and lazy loading for large JavaScript chunks');
    recommendations.push('Review and remove unused dependencies');
    recommendations.push('Implement tree shaking for better dead code elimination');
  }
  
  if (metrics.imageSize > (budget.imageSize || 0)) {
    recommendations.push('Optimize images with WebP format and proper sizing');
    recommendations.push('Implement lazy loading for images below the fold');
    recommendations.push('Use responsive images with srcset');
  }
  
  if (metrics.cssSize > (budget.cssSize || 0)) {
    recommendations.push('Remove unused CSS with PurgeCSS');
    recommendations.push('Consider CSS-in-JS for better tree shaking');
    recommendations.push('Minimize CSS with advanced minification');
  }
  
  return recommendations;
}

/**
 * Track bundle size over time
 */
export class BundleSizeTracker {
  private static history: Array<{ date: string; metrics: BundleMetrics }> = [];
  
  static recordBuild(metrics: BundleMetrics) {
    this.history.push({
      date: new Date().toISOString(),
      metrics,
    });
    
    // Keep only last 10 builds
    if (this.history.length > 10) {
      this.history.shift();
    }
    
    this.saveToStorage();
  }
  
  static getHistory() {
    return [...this.history];
  }
  
  static getTrend() {
    if (this.history.length < 2) return 'insufficient data';
    
    const latest = this.history[this.history.length - 1];
    const previous = this.history[this.history.length - 2];
    
    const change = latest.metrics.totalSize - previous.metrics.totalSize;
    const percentage = (change / previous.metrics.totalSize) * 100;
    
    if (change > 0) {
      return `+(change / 1024).toFixed(1)KB (+percentage.toFixed(1)%)`;
    } else {
      return `${(change / 1024).toFixed(1)}KB (percentage.toFixed(1)%)`;
    }
  }
  
  private static saveToStorage() {
    try {
      localStorage.setItem('bundle-size-history', JSON.stringify(this.history));
    } catch (error) {
      console.warn('Could not save bundle size history to localStorage');
    }
  }
  
  static loadFromStorage() {
    try {
      const stored = localStorage.getItem('bundle-size-history');
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not load bundle size history from localStorage');
    }
  }
}

// Initialize tracker
BundleSizeTracker.loadFromStorage();
