#!/usr/bin/env node

/**
 * Fix ListItem selected prop usage
 * Replace all instances of ListItem with selected prop to use conditional backgroundColor
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixListItemSelectedInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Look for ListItem with selected prop pattern
  const selectedPropRegex = /(<ListItem[^>]*?)\s+selected=\{([^}]+)\}([^>]*>)/g;
  
  if (content.match(selectedPropRegex)) {
    const matches = content.match(selectedPropRegex);
    content = content.replace(selectedPropRegex, (match, beforeSelected, selectedCondition, afterSelected) => {
      hasChanges = true;
      console.log(`  Fixed ListItem selected prop: ${selectedCondition}`);
      
      // Extract existing sx prop or create new one
      let sxMatch = afterSelected.match(/sx=\{([^}]*)\}/);
      let existingSx = '';
      let restOfProps = afterSelected;
      
      if (sxMatch) {
        existingSx = sxMatch[1];
        restOfProps = afterSelected.replace(/sx=\{[^}]*\}/, '');
      }
      
      // Create new sx with conditional backgroundColor
      const newSx = `sx={{
        backgroundColor: ${selectedCondition} ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
        cursor: 'pointer',
        ${existingSx ? existingSx + ',' : ''}
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
        },
      }}`;
      
      return `${beforeSelected} ${newSx}${restOfProps}`;
    });
  }
  
  // Also fix the &.Mui-selected pattern since selected prop won't work anymore
  const muiSelectedRegex = /'\&\.Mui-selected':\s*\{[^}]*\}/g;
  if (content.match(muiSelectedRegex)) {
    content = content.replace(muiSelectedRegex, '');
    hasChanges = true;
    console.log(`  Removed &.Mui-selected pattern since selected prop was removed`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No ListItem selected issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting ListItem selected prop fix...\n');
  
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
      const hasChanges = fixListItemSelectedInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 ListItem selected prop fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixListItemSelectedInFile };
