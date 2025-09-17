#!/usr/bin/env node

/**
 * Fix JSX syntax errors with nested object structures
 * Fix issues with malformed sx props in Material-UI components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixJSXSyntaxInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix malformed sx props with nested objects that have extra closing braces
  const malformedSxRegex = /sx=\{\{\s*([^{}]*),\s*'&\s*([^']+)':\s*\{([^}]*)\},\s*([^{}]*),\s*\},\s*'&:hover':\s*\{([^}]*)\},\s*\}\}/g;
  
  if (content.match(malformedSxRegex)) {
    content = content.replace(malformedSxRegex, (match, beforeProp, selector, selectorContent, betweenProps, hoverContent) => {
      hasChanges = true;
      console.log(`  Fixed malformed sx prop with nested objects`);
      return `sx={{ 
        ${beforeProp.trim()}, 
        '& ${selector}': {
          ${selectorContent.trim()}
        },
        ${betweenProps.trim()},
        '&:hover': {
          ${hoverContent.trim()}
        },
      }}`;
    });
  }
  
  // Fix specific pattern from the error message
  const specificPatternRegex = /sx=\{\{\s*borderRadius:\s*2,\s*'&\s*\.MuiListItemIcon-root':\s*\{([^}]*)\},\s*'&\s*\.MuiListItemText-primary':\s*\{([^}]*)\},\s*\},\s*'&:hover':\s*\{([^}]*)\},\s*\}\}/g;
  
  if (content.match(specificPatternRegex)) {
    content = content.replace(specificPatternRegex, (match, iconContent, textContent, hoverContent) => {
      hasChanges = true;
      console.log(`  Fixed specific ListItemButton sx pattern`);
      return `sx={{ 
        borderRadius: 2, 
        '& .MuiListItemIcon-root': {
          ${iconContent.trim()}
        },
        '& .MuiListItemText-primary': {
          ${textContent.trim()}
        },
        '&:hover': {
          ${hoverContent.trim()}
        },
      }}`;
    });
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No JSX syntax errors found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting JSX syntax error fix...\n');
  
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
      const hasChanges = fixJSXSyntaxInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 JSX syntax error fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixJSXSyntaxInFile };
