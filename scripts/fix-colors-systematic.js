#!/usr/bin/env node

/**
 * Systematic Color Fix Script
 * Replaces hardcoded colors with semantic color tokens across the entire codebase
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color mapping from hardcoded values to semantic tokens
const colorMappings = {
  // Primary brand colors
  '#1a365d': 'brandColors.primary',
  '#0d2340': 'brandColors.primaryDark',
  '#2d5a8a': 'brandColors.primaryLight',
  
  // Accent colors
  '#4caf50': 'brandColors.accent.success',
  '#66bb6a': 'brandColors.accent.successLight',
  '#388e3c': 'brandColors.accent.successDark',
  '#ff9800': 'brandColors.accent.warning',
  '#ffb74d': 'brandColors.accent.warningLight',
  '#f57c00': 'brandColors.accent.warningDark',
  '#2196f3': 'brandColors.accent.info',
  '#64b5f6': 'brandColors.accent.infoLight',
  '#1976d2': 'brandColors.accent.infoDark',
  '#f44336': 'brandColors.accent.error',
  '#ef5350': 'brandColors.accent.errorLight',
  '#c62828': 'brandColors.accent.errorDark',
  
  // Neutral colors
  '#ffffff': 'brandColors.neutral[0]',
  '#fafafa': 'brandColors.neutral[50]',
  '#f5f5f5': 'brandColors.neutral[100]',
  '#eeeeee': 'brandColors.neutral[200]',
  '#e0e0e0': 'brandColors.neutral[300]',
  '#bdbdbd': 'brandColors.neutral[400]',
  '#9e9e9e': 'brandColors.neutral[500]',
  '#757575': 'brandColors.neutral[600]',
  '#616161': 'brandColors.neutral[700]',
  '#424242': 'brandColors.neutral[800]',
  '#212121': 'brandColors.neutral[900]',
  '#000000': 'brandColors.neutral[950]',
  
  // Common grays
  '#ccc': 'brandColors.neutral[400]',
  '#c0c0c0': 'brandColors.neutral[300]',
  '#d3d3d3': 'brandColors.neutral[200]',
  '#f0f0f0': 'brandColors.neutral[100]',
  '#e9ecef': 'brandColors.neutral[100]',
  
  // Special colors
  '#e31c25': 'brandColors.accent.error', // Red for favorites
  '#333333': 'brandColors.text.primary',
  '#666666': 'brandColors.text.secondary',
  '#999999': 'brandColors.text.tertiary',
  
  // RGBA patterns
  'rgba(26, 54, 93, 0.08)': 'brandColors.interactive.hover',
  'rgba(26, 54, 93, 0.12)': 'brandColors.interactive.hoverDark',
  'rgba(26, 54, 93, 0.2)': 'brandColors.interactive.focus',
  'rgba(255, 255, 255, 0.25)': 'brandColors.surfaces.glass',
  'rgba(255, 255, 255, 0.35)': 'brandColors.surfaces.glassHover',
  'rgba(255, 255, 255, 0.4)': 'brandColors.surfaces.glass',
  'rgba(255, 255, 255, 0.6)': 'brandColors.surfaces.glassHover',
  'rgba(0, 0, 0, 0.1)': 'brandColors.shadows.light',
  'rgba(0, 0, 0, 0.15)': 'brandColors.shadows.medium',
  'rgba(0, 0, 0, 0.25)': 'brandColors.shadows.dark',
  'rgba(0, 0, 0, 0.3)': 'rgba(0, 0, 0, 0.3)', // Keep overlay
  'rgba(0, 0, 0, 0.5)': 'brandColors.surfaces.overlay',
};

// Text color mappings
const textColorMappings = {
  'white': 'brandColors.text.inverse',
  'black': 'brandColors.text.primary',
  'inherit': 'inherit', // Keep as is
};

function fixColorsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Check if file already imports brandColors
  const needsImport = !content.includes('import { brandColors') && 
                     !content.includes('from "../theme"') &&
                     !content.includes('from "../../theme"') &&
                     !content.includes('from "../../../theme"');
  
  // Apply color mappings
  Object.entries(colorMappings).forEach(([hardcoded, semantic]) => {
    const regex = new RegExp(hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (content.includes(hardcoded)) {
      content = content.replace(regex, `\${${semantic}}`);
      hasChanges = true;
      console.log(`  Replaced ${hardcoded} with \${${semantic}}`);
    }
  });
  
  // Apply text color mappings
  Object.entries(textColorMappings).forEach(([hardcoded, semantic]) => {
    const regex = new RegExp(`color:\\s*['"]${hardcoded}['"]`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, `color: ${semantic}`);
      hasChanges = true;
      console.log(`  Replaced color: "${hardcoded}" with color: ${semantic}`);
    }
  });
  
  // Add import if needed and changes were made
  if (needsImport && hasChanges) {
    const importLine = "import { brandColors } from \"../theme\";\n";
    const importLine2 = "import { brandColors } from \"../../theme\";\n";
    const importLine3 = "import { brandColors } from \"../../../theme\";\n";
    
    // Determine the correct import path based on file location
    let correctImport;
    if (filePath.includes('/pages/')) {
      correctImport = importLine;
    } else if (filePath.includes('/components/')) {
      correctImport = importLine2;
    } else {
      correctImport = importLine3;
    }
    
    // Add import after existing imports
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      }
    }
    
    lines.splice(insertIndex, 0, correctImport);
    content = lines.join('\n');
    
    console.log(`  Added import: ${correctImport.trim()}`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes needed for ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🎨 Starting systematic color fix...\n');
  
  // Find all TypeScript and JavaScript files in src
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'src/**/*.spec.{ts,tsx,js,jsx}',
      'src/**/*.backup.{ts,tsx,js,jsx}',
      'src/**/*.old.{ts,tsx,js,jsx}',
      'src/**/*.new.{ts,tsx,js,jsx}',
      'src/**/*.original.{ts,tsx,js,jsx}',
    ]
  });
  
  console.log(`Found ${files.length} files to process\n`);
  
  let totalChanges = 0;
  const changedFiles = [];
  
  files.forEach(file => {
    try {
      const hasChanges = fixColorsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Color fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
  
  if (changedFiles.length > 0) {
    console.log('\n📝 Next steps:');
    console.log('   1. Review the changes');
    console.log('   2. Test the application');
    console.log('   3. Fix any linting errors');
    console.log('   4. Commit the changes');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixColorsInFile, colorMappings };
