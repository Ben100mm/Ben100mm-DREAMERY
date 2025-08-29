#!/usr/bin/env node

/**
 * Webpack Bundle Analyzer Integration Script
 * Provides automated bundle analysis, regression detection, and performance metrics collection
 * Integrates with webpack-bundle-analyzer for comprehensive bundle insights
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

// Configuration
const CONFIG = {
  buildPath: 'build',
  analysisPath: 'bundle-analysis',
  statsPath: 'bundle-stats.json',
  historyPath: 'bundle-history.json',
  performanceBudgets: {
    totalSize: { warning: 2048, error: 4096, critical: 8192 }, // KB
    jsSize: { warning: 1536, error: 3072, critical: 6144 }, // KB
    cssSize: { warning: 256, error: 512, critical: 1024 }, // KB
    gzippedSize: { warning: 512, error: 1024, critical: 2048 }, // KB
  },
  regressionThresholds: {
    warning: 10, // 10% increase
    error: 25, // 25% increase
    critical: 50, // 50% increase
  },
  maxHistorySize: 100,
};

class WebpackBundleAnalyzerIntegration {
  constructor() {
    this.bundleHistory = this.loadHistory();
    this.currentBuild = null;
    this.analysisResults = null;
  }

  /**
   * Main execution method
   */
  async run() {
    console.log('🚀 Webpack Bundle Analyzer Integration');
    console.log('=====================================\n');

    try {
      // Check prerequisites
      this.checkPrerequisites();

      // Analyze current build
      await this.analyzeCurrentBuild();

      // Generate bundle analysis
      await this.generateBundleAnalysis();

      // Check for regressions
      this.checkRegressions();

      // Generate performance report
      this.generatePerformanceReport();

      // Save results
      this.saveResults();

      console.log('\n✅ Bundle analysis completed successfully!');
    } catch (error) {
      console.error('\n❌ Bundle analysis failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check if all prerequisites are met
   */
  checkPrerequisites() {
    console.log('📋 Checking prerequisites...');

    // Check if build directory exists
    if (!fs.existsSync(CONFIG.buildPath)) {
      throw new Error(`Build directory '${CONFIG.buildPath}' not found. Please run "npm run build" first.`);
    }

    // Check if webpack-bundle-analyzer is installed
    try {
      require.resolve('webpack-bundle-analyzer');
    } catch (error) {
      throw new Error('webpack-bundle-analyzer not found. Please install it with "npm install --save-dev webpack-bundle-analyzer"');
    }

    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found. Please run this script from the project root.');
    }

    console.log('✅ Prerequisites check passed');
  }

  /**
   * Analyze current build
   */
  async analyzeCurrentBuild() {
    console.log('\n📊 Analyzing current build...');

    const buildStats = await this.getBuildStats();
    this.currentBuild = this.processBuildStats(buildStats);

    console.log(`✅ Build analyzed: ${this.formatBytes(this.currentBuild.totalSize)} total`);
  }

  /**
   * Get build statistics from webpack
   */
  async getBuildStats() {
    try {
      // Try to get webpack stats from build output
      const statsPath = path.join(CONFIG.buildPath, 'webpack-stats.json');
      if (fs.existsSync(statsPath)) {
        return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      }

      // Fallback: analyze build directory manually
      return this.analyzeBuildDirectory();
    } catch (error) {
      console.warn('⚠️  Could not read webpack stats, falling back to directory analysis');
      return this.analyzeBuildDirectory();
    }
  }

  /**
   * Analyze build directory manually
   */
  analyzeBuildDirectory() {
    const stats = {
      assets: [],
      chunks: [],
      modules: [],
      entrypoints: {},
    };

    // Analyze static assets
    const staticPath = path.join(CONFIG.buildPath, 'static');
    if (fs.existsSync(staticPath)) {
      this.analyzeDirectory(staticPath, stats);
    }

    // Analyze other files
    this.analyzeDirectory(CONFIG.buildPath, stats);

    return stats;
  }

  /**
   * Recursively analyze directory
   */
  analyzeDirectory(dirPath, stats) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        this.analyzeDirectory(itemPath, stats);
      } else if (stat.isFile()) {
        this.analyzeFile(itemPath, stats);
      }
    });
  }

  /**
   * Analyze individual file
   */
  analyzeFile(filePath, stats) {
    const relativePath = path.relative(CONFIG.buildPath, filePath);
    const size = fs.statSync(filePath).size;
    const ext = path.extname(filePath).toLowerCase();

    let assetType = 'other';
    if (ext === '.js') assetType = 'js';
    else if (ext === '.css') assetType = 'css';
    else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) assetType = 'image';
    else if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) assetType = 'font';

    stats.assets.push({
      name: relativePath,
      size,
      type: assetType,
      path: filePath,
    });
  }

  /**
   * Process build statistics
   */
  processBuildStats(stats) {
    const build = {
      timestamp: Date.now(),
      buildId: `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      commitHash: this.getCommitHash(),
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0,
      fontSize: 0,
      otherSize: 0,
      gzippedSize: 0,
      brotliSize: 0,
      chunks: [],
      analysis: {
        totalModules: stats.modules?.length || 0,
        totalChunks: stats.chunks?.length || 0,
        treeShakingEfficiency: 0,
        duplicateModules: 0,
        unusedModules: 0,
        compressionRatios: { gzip: 0, brotli: 0 },
      },
    };

    // Calculate sizes by type
    if (stats.assets) {
      stats.assets.forEach(asset => {
        build.totalSize += asset.size;
        
        switch (asset.type) {
          case 'js':
            build.jsSize += asset.size;
            break;
          case 'css':
            build.cssSize += asset.size;
            break;
          case 'image':
            build.imageSize += asset.size;
            break;
          case 'font':
            build.fontSize += asset.size;
            break;
          default:
            build.otherSize += asset.size;
        }
      });
    }

    // Estimate compression sizes
    build.gzippedSize = Math.round(build.totalSize * 0.3); // ~30% compression
    build.brotliSize = Math.round(build.totalSize * 0.25); // ~25% compression

    return build;
  }

  /**
   * Get current git commit hash
   */
  getCommitHash() {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      return `unknown-${Date.now()}`;
    }
  }

  /**
   * Generate bundle analysis using webpack-bundle-analyzer
   */
  async generateBundleAnalysis() {
    console.log('\n🔍 Generating bundle analysis...');

    try {
      // Create analysis directory
      if (!fs.existsSync(CONFIG.analysisPath)) {
        fs.mkdirSync(CONFIG.analysisPath, { recursive: true });
      }

      // Run webpack-bundle-analyzer
      const analyzerCommand = `npx webpack-bundle-analyzer ${CONFIG.buildPath} --mode static --report ${CONFIG.analysisPath}/report.html`;
      
      console.log('Running webpack-bundle-analyzer...');
      execSync(analyzerCommand, { stdio: 'inherit' });

      // Generate additional analysis
      this.analysisResults = this.generateAdditionalAnalysis();

      console.log('✅ Bundle analysis generated');
    } catch (error) {
      console.warn('⚠️  webpack-bundle-analyzer failed, continuing with basic analysis');
      this.analysisResults = this.generateBasicAnalysis();
    }
  }

  /**
   * Generate additional analysis insights
   */
  generateAdditionalAnalysis() {
    return {
      bundleEfficiency: this.calculateBundleEfficiency(),
      optimizationOpportunities: this.identifyOptimizationOpportunities(),
      dependencyAnalysis: this.analyzeDependencies(),
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Generate basic analysis when webpack-bundle-analyzer fails
   */
  generateBasicAnalysis() {
    return {
      bundleEfficiency: this.calculateBundleEfficiency(),
      optimizationOpportunities: this.identifyBasicOptimizations(),
      dependencyAnalysis: {},
      recommendations: this.generateBasicRecommendations(),
    };
  }

  /**
   * Calculate bundle efficiency metrics
   */
  calculateBundleEfficiency() {
    if (!this.currentBuild) return {};

    const jsRatio = (this.currentBuild.jsSize / this.currentBuild.totalSize) * 100;
    const cssRatio = (this.currentBuild.cssSize / this.currentBuild.totalSize) * 100;
    const assetRatio = ((this.currentBuild.imageSize + this.currentBuild.fontSize) / this.currentBuild.totalSize) * 100;

    return {
      jsRatio: jsRatio.toFixed(1),
      cssRatio: cssRatio.toFixed(1),
      assetRatio: assetRatio.toFixed(1),
      compressionEfficiency: {
        gzip: ((this.currentBuild.totalSize - this.currentBuild.gzippedSize) / this.currentBuild.totalSize * 100).toFixed(1),
        brotli: ((this.currentBuild.totalSize - this.currentBuild.brotliSize) / this.currentBuild.totalSize * 100).toFixed(1),
      },
    };
  }

  /**
   * Identify optimization opportunities
   */
  identifyOptimizationOpportunities() {
    const opportunities = [];

    if (this.currentBuild.jsSize > CONFIG.performanceBudgets.jsSize.warning * 1024) {
      opportunities.push({
        type: 'warning',
        category: 'JavaScript Size',
        message: `JavaScript bundle size (${this.formatBytes(this.currentBuild.jsSize)}) exceeds warning threshold`,
        recommendation: 'Consider code splitting, lazy loading, or removing unused dependencies',
      });
    }

    if (this.currentBuild.cssSize > CONFIG.performanceBudgets.cssSize.warning * 1024) {
      opportunities.push({
        type: 'warning',
        category: 'CSS Size',
        message: `CSS bundle size (${this.formatBytes(this.currentBuild.cssSize)}) exceeds warning threshold`,
        recommendation: 'Consider CSS-in-JS, CSS modules, or removing unused styles',
      });
    }

    if (this.currentBuild.totalSize > CONFIG.performanceBudgets.totalSize.warning * 1024) {
      opportunities.push({
        type: 'warning',
        category: 'Total Bundle Size',
        message: `Total bundle size (${this.formatBytes(this.currentBuild.totalSize)}) exceeds warning threshold`,
        recommendation: 'Review overall bundle optimization strategy',
      });
    }

    return opportunities;
  }

  /**
   * Identify basic optimizations
   */
  identifyBasicOptimizations() {
    return this.identifyOptimizationOpportunities();
  }

  /**
   * Analyze dependencies
   */
  analyzeDependencies() {
    // This would analyze package.json and node_modules
    // For now, return basic structure
    return {
      totalDependencies: 0,
      devDependencies: 0,
      peerDependencies: 0,
      duplicatePackages: 0,
      unusedPackages: 0,
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.currentBuild.jsSize > 1024 * 1024) { // > 1MB
      recommendations.push('Implement code splitting for large JavaScript bundles');
      recommendations.push('Use React.lazy() for route-based code splitting');
      recommendations.push('Consider using dynamic imports for heavy components');
    }

    if (this.currentBuild.cssSize > 256 * 1024) { // > 256KB
      recommendations.push('Implement CSS-in-JS for better tree shaking');
      recommendations.push('Remove unused CSS rules');
      recommendations.push('Consider CSS modules for component-scoped styles');
    }

    if (this.currentBuild.imageSize > 512 * 1024) { // > 512KB
      recommendations.push('Optimize images using WebP format');
      recommendations.push('Implement lazy loading for images');
      recommendations.push('Consider using image CDN for optimization');
    }

    return recommendations;
  }

  /**
   * Generate basic recommendations
   */
  generateBasicRecommendations() {
    return this.generateRecommendations();
  }

  /**
   * Check for bundle size regressions
   */
  checkRegressions() {
    console.log('\n📈 Checking for regressions...');

    if (this.bundleHistory.length === 0) {
      console.log('ℹ️  No previous builds to compare against');
      return;
    }

    const previousBuild = this.bundleHistory[this.bundleHistory.length - 1];
    const sizeIncrease = this.currentBuild.totalSize - previousBuild.totalSize;
    const sizeIncreasePercentage = (sizeIncrease / previousBuild.totalSize) * 100;

    console.log(`Previous build: ${this.formatBytes(previousBuild.totalSize)}`);
    console.log(`Current build: ${this.formatBytes(this.currentBuild.totalSize)}`);
    console.log(`Change: ${sizeIncrease >= 0 ? '+' : ''}${this.formatBytes(sizeIncrease)} (${sizeIncreasePercentage.toFixed(1)}%)`);

    // Check regression thresholds
    if (sizeIncreasePercentage >= CONFIG.regressionThresholds.critical) {
      console.log('🚨 CRITICAL: Bundle size increased significantly!');
    } else if (sizeIncreasePercentage >= CONFIG.regressionThresholds.error) {
      console.log('⚠️  ERROR: Bundle size increased substantially');
    } else if (sizeIncreasePercentage >= CONFIG.regressionThresholds.warning) {
      console.log('📈 WARNING: Bundle size increased moderately');
    } else if (sizeIncreasePercentage < 0) {
      console.log('✅ GOOD: Bundle size decreased');
    } else {
      console.log('✅ GOOD: Bundle size stable');
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generatePerformanceReport() {
    console.log('\n📊 Generating performance report...');

    const report = {
      timestamp: Date.now(),
      build: this.currentBuild,
      analysis: this.analysisResults,
      regressions: this.calculateRegressions(),
      budgets: this.checkPerformanceBudgets(),
      recommendations: this.analysisResults.recommendations,
    };

    // Save report
    const reportPath = path.join(CONFIG.analysisPath, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('✅ Performance report generated');
    return report;
  }

  /**
   * Calculate regression metrics
   */
  calculateRegressions() {
    if (this.bundleHistory.length === 0) return {};

    const previousBuild = this.bundleHistory[this.bundleHistory.length - 1];
    const regressions = {};

    Object.keys(CONFIG.performanceBudgets).forEach(metric => {
      const current = this.currentBuild[metric];
      const previous = previousBuild[metric];
      const increase = current - previous;
      const increasePercentage = (increase / previous) * 100;

      regressions[metric] = {
        current,
        previous,
        increase,
        increasePercentage,
        status: this.getRegressionStatus(increasePercentage),
      };
    });

    return regressions;
  }

  /**
   * Get regression status based on thresholds
   */
  getRegressionStatus(percentage) {
    if (percentage >= CONFIG.regressionThresholds.critical) return 'critical';
    if (percentage >= CONFIG.regressionThresholds.error) return 'error';
    if (percentage >= CONFIG.regressionThresholds.warning) return 'warning';
    if (percentage < 0) return 'improvement';
    return 'stable';
  }

  /**
   * Check performance budgets
   */
  checkPerformanceBudgets() {
    const budgetResults = {};

    Object.keys(CONFIG.performanceBudgets).forEach(metric => {
      const current = this.currentBuild[metric];
      const budgets = CONFIG.performanceBudgets[metric];
      
      budgetResults[metric] = {
        current,
        budgets,
        violations: [],
      };

      Object.keys(budgets).forEach(severity => {
        const threshold = budgets[severity] * 1024; // Convert KB to bytes
        if (current > threshold) {
          budgetResults[metric].violations.push({
            severity,
            threshold,
            exceeded: current - threshold,
          });
        }
      });
    });

    return budgetResults;
  }

  /**
   * Save all results
   */
  saveResults() {
    console.log('\n💾 Saving results...');

    // Add current build to history
    this.bundleHistory.push(this.currentBuild);

    // Keep only recent history
    if (this.bundleHistory.length > CONFIG.maxHistorySize) {
      this.bundleHistory = this.bundleHistory.slice(-CONFIG.maxHistorySize);
    }

    // Save bundle history
    fs.writeFileSync(CONFIG.historyPath, JSON.stringify(this.bundleHistory, null, 2));

    // Save current build stats
    const statsPath = path.join(CONFIG.buildPath, 'bundle-stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(this.currentBuild, null, 2));

    console.log('✅ Results saved');
  }

  /**
   * Load bundle history
   */
  loadHistory() {
    try {
      if (fs.existsSync(CONFIG.historyPath)) {
        return JSON.parse(fs.readFileSync(CONFIG.historyPath, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️  Could not load bundle history:', error.message);
    }
    return [];
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

// Run the integration if called directly
if (require.main === module) {
  const integration = new WebpackBundleAnalyzerIntegration();
  integration.run().catch(console.error);
}

module.exports = WebpackBundleAnalyzerIntegration;
