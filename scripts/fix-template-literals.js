#!/usr/bin/env node

/**
 * Fix Template Literal Syntax Errors
 * Removes incorrect template literal syntax in JSX and styled-components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixTemplateLiteralsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix incorrect template literals in JSX attributes
  const jsxTemplateLiteralRegex = /(['"])\$\{([^}]+)\}\1/g;
  if (content.match(jsxTemplateLiteralRegex)) {
    content = content.replace(jsxTemplateLiteralRegex, (match, quote, variable) => {
      hasChanges = true;
      console.log(`  Fixed JSX template literal: ${match} -> ${variable}`);
      return variable;
    });
  }
  
  // Fix incorrect template literals in styled-components (outside of template literals)
  const styledTemplateLiteralRegex = /([^`])\$\{([^}]+)\}([^`])/g;
  if (content.match(styledTemplateLiteralRegex)) {
    content = content.replace(styledTemplateLiteralRegex, (match, before, variable, after) => {
      // Only fix if it's not inside a template literal
      if (!match.includes('`')) {
        hasChanges = true;
        console.log(`  Fixed styled template literal: ${match} -> ${before}${variable}${after}`);
        return `${before}${variable}${after}`;
      }
      return match;
    });
  }
  
  // Fix specific patterns that are definitely wrong
  const wrongPatterns = [
    // JSX sx props with template literals
    { from: /sx=\{\{\s*color:\s*['"]\$\{([^}]+)\}['"]/g, to: 'sx={{ color: $1' },
    { from: /backgroundColor:\s*['"]\$\{([^}]+)\}['"]/g, to: 'backgroundColor: $1' },
    { from: /borderColor:\s*['"]\$\{([^}]+)\}['"]/g, to: 'borderColor: $1' },
    { from: /background:\s*['"]\$\{([^}]+)\}['"]/g, to: 'background: $1' },
    
    // Styled components with template literals (non-template contexts)
    { from: /border-color:\s*\$\{([^}]+)\};/g, to: 'border-color: #e0e0e0;' },
    { from: /background:\s*linear-gradient\([^`]*\$\{([^}]+)\}[^`]*\);/g, to: 'background: linear-gradient(135deg, #eeeeee 0%, #eeeeee 100%);' },
  ];
  
  wrongPatterns.forEach(pattern => {
    if (content.match(pattern.from)) {
      content = content.replace(pattern.from, pattern.to);
      hasChanges = true;
      console.log(`  Fixed pattern: ${pattern.from} -> ${pattern.to}`);
    }
  });
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No template literal issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting template literal syntax fix...\n');
  
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
      const hasChanges = fixTemplateLiteralsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Template literal fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixTemplateLiteralsInFile };
