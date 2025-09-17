#!/usr/bin/env node

/**
 * Fix brandColors.neutral.dark references
 * Replace all instances of brandColors.neutral.dark with brandColors.neutral[800]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixNeutralDarkInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Replace all instances of brandColors.neutral.dark with brandColors.neutral[800]
  const neutralDarkRegex = /brandColors\.neutral\.dark/g;
  if (content.match(neutralDarkRegex)) {
    const matches = content.match(neutralDarkRegex);
    content = content.replace(neutralDarkRegex, 'brandColors.neutral[800]');
    hasChanges = true;
    console.log(`  Fixed ${matches.length} instances of brandColors.neutral.dark`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No neutral.dark issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting neutral.dark fix...\n');
  
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
      const hasChanges = fixNeutralDarkInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Neutral.dark fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixNeutralDarkInFile };
