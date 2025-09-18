#!/usr/bin/env node

/**
 * Fix duplicate size props in Grid components
 * Merge multiple size props into a single size object
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixDuplicateSizePropsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Find Grid components with duplicate size props and merge them
  // Pattern: <Grid size={{ md: 6 }} size={{ xs: 12 }}> -> <Grid size={{ xs: 12, md: 6 }}>
  content = content.replace(/<Grid\s+([^>]*?)>/g, (match, propsString) => {
    // Check if there are multiple size props
    const sizeMatches = propsString.match(/size=\{\s*\{[^}]*\}\s*\}/g);
    
    if (sizeMatches && sizeMatches.length > 1) {
      // Extract all size objects
      const sizeObjects = sizeMatches.map(match => {
        const sizeContent = match.match(/size=\{\s*\{([^}]*)\}\s*\}/)[1];
        return sizeContent.trim();
      });
      
      // Merge all size objects
      const mergedSizeEntries = [];
      sizeObjects.forEach(sizeObj => {
        // Split by comma and add each entry
        const entries = sizeObj.split(',').map(entry => entry.trim()).filter(entry => entry);
        mergedSizeEntries.push(...entries);
      });
      
      // Remove duplicates (keep last occurrence)
      const uniqueEntries = [];
      const seen = new Set();
      
      mergedSizeEntries.reverse().forEach(entry => {
        const key = entry.split(':')[0].trim();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueEntries.unshift(entry);
        }
      });
      
      // Create merged size prop
      const mergedSizeProp = `size={{ ${uniqueEntries.join(', ')} }}`;
      
      // Remove all size props from propsString
      let newPropsString = propsString.replace(/size=\{\s*\{[^}]*\}\s*\}/g, '');
      newPropsString = newPropsString.replace(/\s+/g, ' ').trim();
      
      // Add merged size prop
      if (newPropsString) {
        newPropsString = `${mergedSizeProp} ${newPropsString}`;
      } else {
        newPropsString = mergedSizeProp;
      }
      
      hasChanges = true;
      console.log(`  Merged size props: ${sizeMatches.join(' ')} -> ${mergedSizeProp}`);
      
      return `<Grid ${newPropsString}>`;
    }
    
    return match;
  });
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No duplicate size prop issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting duplicate size props fix...\n');
  
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
      const hasChanges = fixDuplicateSizePropsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Duplicate size props fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixDuplicateSizePropsInFile };
