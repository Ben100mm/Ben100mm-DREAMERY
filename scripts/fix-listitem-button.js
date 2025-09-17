#!/usr/bin/env node

/**
 * Fix ListItem button prop usage
 * Replace all instances of ListItem with button prop to use proper onClick patterns
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixListItemButtonInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix ListItem with button prop - simple case
  const listItemButtonRegex = /<ListItem\s*\n\s*button\s*\n/g;
  if (content.match(listItemButtonRegex)) {
    content = content.replace(listItemButtonRegex, '<ListItem\n');
    hasChanges = true;
    console.log(`  Fixed ListItem button prop pattern 1`);
  }
  
  // Fix ListItem with button prop - inline case
  const listItemButtonInlineRegex = /<ListItem\s+button\s*/g;
  if (content.match(listItemButtonInlineRegex)) {
    content = content.replace(listItemButtonInlineRegex, '<ListItem ');
    hasChanges = true;
    console.log(`  Fixed ListItem button prop pattern 2`);
  }
  
  // Fix ListItem with button and other props
  const listItemButtonPropsRegex = /<ListItem\s*([\s\S]*?)\s*button\s*([\s\S]*?)>/g;
  if (content.match(listItemButtonPropsRegex)) {
    content = content.replace(listItemButtonPropsRegex, (match, beforeButton, afterButton) => {
      hasChanges = true;
      console.log(`  Fixed ListItem button prop pattern 3`);
      return `<ListItem ${beforeButton} ${afterButton}>`;
    });
  }
  
  // Fix specific pattern: button prop on separate line
  const buttonPropLineRegex = /(\s*)<ListItem\s*\n\s*button\s*\n/g;
  if (content.match(buttonPropLineRegex)) {
    content = content.replace(buttonPropLineRegex, '$1<ListItem\n');
    hasChanges = true;
    console.log(`  Fixed ListItem button prop on separate line`);
  }
  
  // Add cursor pointer style if onClick is present and no existing cursor style
  if (content.includes('onClick') && content.includes('ListItem') && !content.includes('cursor:')) {
    // This is a more complex pattern that would need careful regex work
    // For now, just log that manual review might be needed
    console.log(`  Note: File contains ListItem with onClick - may need cursor: pointer`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No ListItem button issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting ListItem button prop fix...\n');
  
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
      const hasChanges = fixListItemButtonInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 ListItem button prop fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixListItemButtonInFile };
