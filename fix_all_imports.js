const fs = require('fs');
const path = require('path');

// Function to add brandColors import if missing
function addBrandColorsImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has brandColors import
    if (content.includes('import') && content.includes('brandColors')) {
      return false; // Already has import
    }
    
    // Check if file uses brandColors
    if (!content.includes('brandColors.')) {
      return false; // Doesn't use brandColors
    }
    
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    if (importLines.length === 0) {
      return false; // No imports found
    }
    
    const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
    const nextLineIndex = content.indexOf('\n', lastImportIndex);
    
    // Determine correct import path
    const relativePath = path.relative('src', filePath);
    const depth = relativePath.split(path.sep).length - 1;
    const importPath = '../'.repeat(depth) + 'theme';
    
    // Add the import
    const newImport = `import { brandColors } from "${importPath}";`;
    content = content.substring(0, nextLineIndex) + '\n' + newImport + content.substring(nextLineIndex);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added import to: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix TypeScript/TSX files
function fixFilesInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixedCount += fixFilesInDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (addBrandColorsImport(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
console.log('Starting to add missing brandColors imports...');
console.log('Source directory:', srcDir);

const fixedFiles = fixFilesInDirectory(srcDir);
console.log(`\nImport fix complete! Added imports to ${fixedFiles} files.`);
console.log('\nNote: Please review the changes and test your application.');
