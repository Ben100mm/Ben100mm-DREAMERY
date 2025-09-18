#!/usr/bin/env node

/**
 * Fix Grid2 closing tags
 * Replace </Grid> with </Grid2> where Grid2 is used
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixGrid2ClosingTagsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Check if file contains Grid2 opening tags
  const hasGrid2Open = content.includes('<Grid2');
  
  if (hasGrid2Open) {
    // Replace </Grid> with </Grid2> in files that use Grid2
    const gridClosingRegex = /<\/Grid>/g;
    if (content.match(gridClosingRegex)) {
      const matches = content.match(gridClosingRegex);
      content = content.replace(gridClosingRegex, '</Grid2>');
      hasChanges = true;
      console.log(`  Fixed ${matches.length} Grid closing tags to Grid2`);
    }
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid2 closing tag issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting Grid2 closing tags fix...\n');
  
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
      const hasChanges = fixGrid2ClosingTagsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Grid2 closing tags fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixGrid2ClosingTagsInFile };
