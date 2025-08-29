#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing malformed gridTemplateColumns patterns...\n');

// Function to fix a single file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fixes = 0;
    
    // Fix all repeat patterns with missing opening parentheses
    const patterns = [
      { regex: /repeat\(([0-9]+), 1fr\)/g, replacement: 'repeat($1, 1fr)' },
      { regex: /repeat\(auto-fit, minmax\(([^)]+)\)\)/g, replacement: 'repeat(auto-fit, minmax($1))' },
      { regex: /repeat\(auto-fill, minmax\(([^)]+)\)\)/g, replacement: 'repeat(auto-fill, minmax($1))' }
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        content = content.replace(pattern.regex, pattern.replacement);
        fixes += matches.length;
      }
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${fixes} patterns in ${path.relative(process.cwd(), filePath)}`);
      return fixes;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Find and fix all TypeScript/JavaScript files
try {
  const srcDir = path.join(__dirname, '../src');
  const files = [];
  
  // Recursively find all .tsx, .ts, .jsx, .js files
  function findFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        findFiles(fullPath);
      } else if (stat.isFile() && /\.(tsx|ts|jsx|js)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  findFiles(srcDir);
  console.log(`Found ${files.length} files to process...\n`);
  
  let totalFixes = 0;
  let filesFixed = 0;
  
  for (const file of files) {
    const fixes = fixFile(file);
    if (fixes > 0) {
      totalFixes += fixes;
      filesFixed++;
    }
  }
  
  console.log(`\n✨ Summary:`);
  console.log(`   - Processed ${files.length} files`);
  console.log(`   - Fixed ${filesFixed} files`);
  console.log(`   - Applied ${totalFixes} total fixes`);
  
} catch (error) {
  console.error('❌ Error during execution:', error.message);
  process.exit(1);
}
