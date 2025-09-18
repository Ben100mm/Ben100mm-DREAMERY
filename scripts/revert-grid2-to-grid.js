#!/usr/bin/env node

/**
 * Revert Grid2 back to Grid and fix prop usage
 * Replace Grid2 with Grid and fix the prop structure for newer Material-UI
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function revertGrid2ToGridInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Remove Grid2 import
  if (content.includes("import Grid2 from '@mui/material/Unstable_Grid2'")) {
    content = content.replace(/import Grid2 from '@mui\/material\/Unstable_Grid2';\n?/g, '');
    hasChanges = true;
    console.log(`  Removed Grid2 import`);
  }
  
  // Replace Grid2 with Grid and fix props
  if (content.includes('<Grid2') || content.includes('</Grid2>')) {
    // Replace Grid2 container with Grid container
    content = content.replace(/<Grid2\s+container\s+/g, '<Grid container ');
    content = content.replace(/<Grid2\s+container>/g, '<Grid container>');
    
    // Replace Grid2 with size props with Grid item and appropriate props
    content = content.replace(/<Grid2\s+size=\{\{\s*xs:\s*(\d+)\s*\}\}/g, '<Grid item xs={$1}');
    content = content.replace(/<Grid2\s+size=\{\{\s*xs:\s*(\d+),\s*sm:\s*(\d+)\s*\}\}/g, '<Grid item xs={$1} sm={$2}');
    content = content.replace(/<Grid2\s+size=\{\{\s*xs:\s*(\d+),\s*md:\s*(\d+)\s*\}\}/g, '<Grid item xs={$1} md={$2}');
    content = content.replace(/<Grid2\s+size=\{\{\s*xs:\s*(\d+),\s*sm:\s*(\d+),\s*md:\s*(\d+)\s*\}\}/g, '<Grid item xs={$1} sm={$2} md={$3}');
    
    // Replace simple Grid2 with xs prop
    content = content.replace(/<Grid2\s+xs=\{(\d+)\}/g, '<Grid item xs={$1}');
    content = content.replace(/<Grid2\s+sm=\{(\d+)\}/g, '<Grid item sm={$1}');
    content = content.replace(/<Grid2\s+md=\{(\d+)\}/g, '<Grid item md={$1}');
    content = content.replace(/<Grid2\s+lg=\{(\d+)\}/g, '<Grid item lg={$1}');
    content = content.replace(/<Grid2\s+xl=\{(\d+)\}/g, '<Grid item xl={$1}');
    
    // Replace multiple props
    content = content.replace(/<Grid2\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}/g, '<Grid item xs={$1} sm={$2}');
    content = content.replace(/<Grid2\s+xs=\{(\d+)\}\s+md=\{(\d+)\}/g, '<Grid item xs={$1} md={$2}');
    content = content.replace(/<Grid2\s+xs=\{(\d+)\}\s+sm=\{(\d+)\}\s+md=\{(\d+)\}/g, '<Grid item xs={$1} sm={$2} md={$3}');
    
    // Replace closing tags
    content = content.replace(/<\/Grid2>/g, '</Grid>');
    
    hasChanges = true;
    console.log(`  Reverted Grid2 to Grid with proper props`);
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid2 issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting Grid2 to Grid revert...\n');
  
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
      const hasChanges = revertGrid2ToGridInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Grid2 to Grid revert completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { revertGrid2ToGridInFile };
