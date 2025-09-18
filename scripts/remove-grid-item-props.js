#!/usr/bin/env node

/**
 * Remove deprecated Grid item props for Material-UI v7
 * Remove all item props from Grid components since they're deprecated in v7
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function removeGridItemPropsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Remove item prop from Grid components
  // Pattern: <Grid item xs={...}> -> <Grid xs={...}>
  content = content.replace(/<Grid\s+item\s+([^>]*?)>/g, (match, props) => {
    hasChanges = true;
    console.log(`  Removed item prop from Grid`);
    return `<Grid ${props}>`;
  });
  
  // Also handle multiline patterns
  content = content.replace(/<Grid\s*\n\s*item\s*\n([^>]*?)>/g, (match, props) => {
    hasChanges = true;
    console.log(`  Removed item prop from Grid (multiline)`);
    return `<Grid\n${props}>`;
  });
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid item prop issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting Grid item props removal...\n');
  
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
      const hasChanges = removeGridItemPropsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Grid item props removal completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { removeGridItemPropsInFile };
