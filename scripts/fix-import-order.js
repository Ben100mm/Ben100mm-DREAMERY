#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Import Order Issues...\n');

const filesToFix = [
  'src/pages/CloseAgentPage.tsx',
  'src/pages/UnderwritePage.tsx',
  'src/pages/manage.tsx'
];

filesToFix.forEach(filePath => {
  try {
    console.log(`📝 Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;

    // Find all import statements
    const importRegex = /^import.*$/gm;
    const imports = content.match(importRegex) || [];
    
    if (imports.length > 0) {
      // Separate regular imports from lazy imports
      const regularImports = [];
      const lazyImports = [];
      const otherImports = [];
      
      imports.forEach(importStatement => {
        if (importStatement.includes('React.lazy') || importStatement.includes('const Lazy')) {
          lazyImports.push(importStatement);
        } else if (importStatement.includes('import React') || importStatement.includes('import {') || importStatement.includes('import ')) {
          regularImports.push(importStatement);
        } else {
          otherImports.push(importStatement);
        }
      });

      // Remove all existing imports
      let newContent = content.replace(importRegex, '');
      
      // Add imports in correct order
      const allImports = [
        ...regularImports,
        '', // Empty line for separation
        ...lazyImports,
        '', // Empty line for separation
        ...otherImports
      ].join('\n');
      
      // Insert imports at the top
      newContent = allImports + '\n' + newContent;
      
      // Write back to file
      fs.writeFileSync(filePath, newContent, 'utf8');
      changes = imports.length;
      
      console.log(`✅ Fixed import order for ${changes} imports in ${path.basename(filePath)}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n✨ Import order fixes completed!');
