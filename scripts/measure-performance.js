#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Performance Measurement Script');
console.log('================================\n');

// Check if build directory exists
const buildPath = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildPath)) {
  console.log('❌ Build directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// Measure bundle sizes
console.log('📊 Measuring Bundle Sizes...\n');

try {
  // Get static JS files
  const staticJsPath = path.join(buildPath, 'static', 'js');
  if (fs.existsSync(staticJsPath)) {
    const jsFiles = fs.readdirSync(staticJsPath).filter(file => file.endsWith('.js'));
    
    let totalSize = 0;
    let totalGzippedSize = 0;
    
    console.log('📁 JavaScript Bundles:');
    console.log('----------------------');
    
    jsFiles.forEach(file => {
      const filePath = path.join(staticJsPath, file);
      const stats = fs.statSync(filePath);
      const sizeInBytes = stats.size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      
      // Estimate gzipped size (rough approximation)
      const gzippedSize = Math.round(sizeInBytes * 0.3); // ~30% compression
      const gzippedKB = (gzippedSize / 1024).toFixed(2);
      
      totalSize += sizeInBytes;
      totalGzippedSize += gzippedSize;
      
      console.log(`${file}:`);
      console.log(`  Original: ${sizeInKB} KB (${sizeInMB} MB)`);
      console.log(`  Gzipped:  ~${gzippedKB} KB`);
      console.log('');
    });
    
    console.log('📈 Total Bundle Analysis:');
    console.log('-------------------------');
    console.log(`Total Original Size: ${(totalSize / 1024).toFixed(2)} KB (${(totalSize / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`Total Gzipped Size: ~${(totalGzippedSize / 1024).toFixed(2)} KB (${(totalGzippedSize / (1024 * 1024)).toFixed(2)} MB)`);
    
    // Performance budget check
    const originalMB = totalSize / (1024 * 1024);
    const gzippedMB = totalGzippedSize / (1024 * 1024);
    
    console.log('\n🎯 Performance Budget Check:');
    console.log('----------------------------');
    
    if (originalMB < 2) {
      console.log('✅ Original bundle: Under 2MB target');
    } else {
      console.log('⚠️  Original bundle: Over 2MB target');
    }
    
    if (gzippedMB < 0.5) {
      console.log('✅ Gzipped bundle: Under 500KB target');
    } else {
      console.log('⚠️  Gzipped bundle: Over 500KB target');
    }
    
  } else {
    console.log('❌ No static JS files found');
  }
  
  // Check CSS bundle
  const staticCssPath = path.join(buildPath, 'static', 'css');
  if (fs.existsSync(staticCssPath)) {
    const cssFiles = fs.readdirSync(staticCssPath).filter(file => file.endsWith('.css'));
    
    console.log('\n🎨 CSS Bundles:');
    console.log('---------------');
    
    cssFiles.forEach(file => {
      const filePath = path.join(staticCssPath, file);
      const stats = fs.statSync(filePath);
      const sizeInBytes = stats.size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      
      console.log(`${file}: ${sizeInKB} KB`);
    });
  }
  
  // Check for source maps
  const sourceMapFiles = [];
  const findSourceMaps = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findSourceMaps(filePath);
      } else if (file.endsWith('.map')) {
        sourceMapFiles.push(filePath);
      }
    });
  };
  
  findSourceMaps(buildPath);
  
  if (sourceMapFiles.length > 0) {
    console.log('\n🗺️  Source Maps Found:');
    console.log('---------------------');
    sourceMapFiles.forEach(file => {
      const relativePath = path.relative(buildPath, file);
      const stats = fs.statSync(file);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      console.log(`${relativePath}: ${sizeInKB} KB`);
    });
    
    console.log('\n💡 Note: Source maps are included in build. Consider removing for production.');
  }
  
} catch (error) {
  console.error('❌ Error measuring performance:', error.message);
  process.exit(1);
}

console.log('\n✨ Performance measurement complete!');
console.log('\n📋 Next Steps:');
console.log('1. Compare with previous bundle sizes');
console.log('2. Analyze specific chunks for optimization opportunities');
console.log('3. Consider implementing code splitting for large components');
console.log('4. Review and optimize remaining icon imports');
