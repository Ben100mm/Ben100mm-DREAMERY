#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CloseAgentPage.tsx');

console.log('🔧 Fixing Grid Component Props in CloseAgentPage.tsx...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix all Grid component="div" to Grid item
  content = content.replace(
    /<Grid component="div"/g,
    '<Grid item'
  );
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Successfully fixed Grid component props:');
  console.log('   - Changed all Grid component="div" to Grid item');
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing Grid props:', error.message);
  process.exit(1);
}
