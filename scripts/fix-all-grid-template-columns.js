#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all malformed gridTemplateColumns patterns across the codebase...\n');

// Function to fix a single file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fixes = 0;
    
    // Fix pattern 1: repeat(2, 1fr) -> repeat(2, 1fr) (missing opening parenthesis)
    const pattern1 = /repeat\(([0-9]+), 1fr\)/g;
    content = content.replace(pattern1, (match, number) => {
      fixes++;
      return `repeat(${number}, 1fr)`;
    });
    
    // Fix pattern 2: repeat(3, 1fr) -> repeat(3, 1fr) (missing opening parenthesis)
    const pattern2 = /repeat\(([0-9]+), 1fr\)/g;
    content = content.replace(pattern2, (match, number) => {
      fixes++;
      return `repeat(${number}, 1fr)`;
    });
    
    // Fix pattern 3: repeat(4, 1fr) -> repeat(4, 1fr) (missing opening parenthesis)
    const pattern3 = /repeat\(([0-9]+), 1fr\)/g;
    content = content.replace(pattern3, (match, number) => {
      fixes++;
      return `repeat(${number}, 1fr)`;
    });
    
    // Fix pattern 4: repeat(5, 1fr) -> repeat(5, 1fr) (missing opening parenthesis)
    const pattern4 = /repeat\(([0-9]+), 1fr\)/g;
    content = content.replace(pattern4, (match, number) => {
      fixes++;
      return `repeat(${number}, 1fr)`;
    });
    
    // Fix pattern 5: repeat(6, 1fr) -> repeat(6, 1fr) (missing opening parenthesis)
    const pattern5 = /repeat\(([0-9]+), 1fr\)/g;
    content = content.replace(pattern5, (match, number) => {
      fixes++;
      return `repeat(${number}, 1fr)`;
    });
    
    // Fix pattern 6: repeat(auto-fit, minmax(...)) -> repeat(auto-fit, minmax(...)) (missing opening parenthesis)
    const pattern6 = /repeat\(auto-fit, minmax\(([^)]+)\)\)/g;
    content = content.replace(pattern6, (match, minmaxContent) => {
      fixes++;
      return `repeat(auto-fit, minmax(${minmaxContent}))`;
    });
    
    // Fix pattern 7: repeat(auto-fill, minmax(...)) -> repeat(auto-fill, minmax(...)) (missing opening parenthesis)
    const pattern7 = /repeat\(auto-fill, minmax\(([^)]+)\)\)/g;
    content = content.replace(pattern7, (match, minmaxContent) => {
      fixes++;
      return `repeat(auto-fill, minmax(${minmaxContent}))`;
    });
    
    // Only write if changes were made
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

// Function to find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'build') {
        traverse(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
try {
  const srcDir = path.join(__dirname, '../src');
  const files = findFiles(srcDir);
  
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
