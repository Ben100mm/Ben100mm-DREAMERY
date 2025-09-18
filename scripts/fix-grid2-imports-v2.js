#!/usr/bin/env node

/**
 * Fix Grid2 import statements - Version 2
 * Add Grid2 to Material-UI imports where it's being used but not imported
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
    // Check if Grid2 is already imported
    const hasGrid2Import = content.includes('Grid2') && content.includes('from') && content.includes('@mui/material');
    
    if (!hasGrid2Import) {
      // Find Material-UI import statement
      const muiImportRegex = /import\s*{\s*([^}]*)\s*}\s*from\s*['"]@mui\/material['"];?/g;
      const match = content.match(muiImportRegex);
      
      if (match) {
        // Add Grid2 to the existing import
        content = content.replace(muiImportRegex, (match, imports) => {
          const importList = imports.split(',').map(imp => imp.trim()).filter(imp => imp);
          
          // Add Grid2 if not already present
          if (!importList.includes('Grid2')) {
            importList.push('Grid2');
            hasChanges = true;
            console.log(`  Added Grid2 to Material-UI imports`);
          }
          
          return `import { ${importList.join(', ')} } from '@mui/material';`;
        });
      } else {
        // No existing Material-UI import, add a new one
        const importStatement = "import { Grid2 } from '@mui/material';\n";
        content = importStatement + content;
        hasChanges = true;
        console.log(`  Added new Material-UI import with Grid2`);
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
  console.log('🔧 Starting Grid2 imports fix (v2)...\n');
  
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
  
  console.log('\n🎉 Grid2 imports fix (v2) completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixGrid2ImportsInFile };
