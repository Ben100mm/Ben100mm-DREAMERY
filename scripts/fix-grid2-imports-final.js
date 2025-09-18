#!/usr/bin/env node

/**
 * Fix Grid2 import statements - Final Version
 * Add correct Grid2 import from @mui/material/Unstable_Grid2 where it's being used
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixGrid2ImportsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Check if file uses Grid2
  const usesGrid2 = content.includes('<Grid2') || content.includes('</Grid2>');
  
  if (usesGrid2) {
    // Check if Grid2 is already imported correctly
    const hasCorrectGrid2Import = content.includes("import Grid2 from '@mui/material/Unstable_Grid2'");
    
    if (!hasCorrectGrid2Import) {
      // Add the correct Grid2 import after React imports
      const reactImportRegex = /(import React[^;]*;)/;
      const match = content.match(reactImportRegex);
      
      if (match) {
        // Add Grid2 import after the React import
        const grid2Import = "import Grid2 from '@mui/material/Unstable_Grid2';\n";
        content = content.replace(reactImportRegex, `$1\n${grid2Import}`);
        hasChanges = true;
        console.log(`  Added correct Grid2 import`);
      } else {
        // No React import found, add at the beginning
        const grid2Import = "import Grid2 from '@mui/material/Unstable_Grid2';\n";
        content = grid2Import + content;
        hasChanges = true;
        console.log(`  Added Grid2 import at beginning`);
      }
    }
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid2 import issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting Grid2 imports fix (final version)...\n');
  
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
      const hasChanges = fixGrid2ImportsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Grid2 imports fix (final) completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixGrid2ImportsInFile };
