#!/usr/bin/env node

/**
 * Fix Grid container tags to Grid2
 * Replace Grid container with Grid2 container and fix closing tags
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixGridContainersInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix Grid container to Grid2 container
  const gridContainerRegex = /<Grid\s+container\s+/g;
  if (content.match(gridContainerRegex)) {
    const matches = content.match(gridContainerRegex);
    content = content.replace(gridContainerRegex, '<Grid2 container ');
    hasChanges = true;
    console.log(`  Fixed ${matches.length} Grid container tags to Grid2`);
  }
  
  // Fix Grid container with other props
  const gridContainerWithPropsRegex = /<Grid\s+container\s+([^>]*?)>/g;
  if (content.match(gridContainerWithPropsRegex)) {
    const matches = content.match(gridContainerWithPropsRegex);
    content = content.replace(gridContainerWithPropsRegex, '<Grid2 container $1>');
    hasChanges = true;
    console.log(`  Fixed ${matches.length} Grid container tags with props to Grid2`);
  }
  
  // Fix Grid container on separate lines
  const gridContainerMultilineRegex = /<Grid\s*\n\s*container\s*\n/g;
  if (content.match(gridContainerMultilineRegex)) {
    const matches = content.match(gridContainerMultilineRegex);
    content = content.replace(gridContainerMultilineRegex, '<Grid2\ncontainer\n');
    hasChanges = true;
    console.log(`  Fixed ${matches.length} Grid container tags (multiline) to Grid2`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid container issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting Grid container fix...\n');
  
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
      const hasChanges = fixGridContainersInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Grid container fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixGridContainersInFile };
