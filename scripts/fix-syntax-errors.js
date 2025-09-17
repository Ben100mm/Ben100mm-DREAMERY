#!/usr/bin/env node

/**
 * Fix syntax errors introduced by the previous script
 * Remove orphaned commas and fix malformed sx props
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixSyntaxErrorsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix orphaned commas in sx props
  const orphanedCommaRegex = /sx=\{\{\s*,\s*/g;
  if (content.match(orphanedCommaRegex)) {
    content = content.replace(orphanedCommaRegex, 'sx={{ ');
    hasChanges = true;
    console.log(`  Fixed orphaned comma in sx prop`);
  }
  
  // Fix malformed sx props with extra commas
  const extraCommaRegex = /sx=\{\{\s*([^}]*),\s*,\s*/g;
  if (content.match(extraCommaRegex)) {
    content = content.replace(extraCommaRegex, 'sx={{ $1, ');
    hasChanges = true;
    console.log(`  Fixed extra comma in sx prop`);
  }
  
  // Fix selected prop that might still be there
  const selectedPropRegex = /\s*selected=\{[^}]+\}\s*\n/g;
  if (content.match(selectedPropRegex)) {
    content = content.replace(selectedPropRegex, '\n');
    hasChanges = true;
    console.log(`  Removed selected prop`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No syntax errors found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting syntax error fix...\n');
  
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
      const hasChanges = fixSyntaxErrorsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Syntax error fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixSyntaxErrorsInFile };
