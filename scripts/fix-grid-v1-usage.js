#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CloseAgentPage.tsx');

console.log('🔧 Fixing Grid v1 Usage in CloseAgentPage.tsx...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix Grid item to Grid component="div" for Grid v1
  content = content.replace(
    /<Grid item/g,
    '<Grid component="div"'
  );
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Successfully fixed Grid v1 usage:');
  console.log('   - Changed all Grid item to Grid component="div"');
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing Grid v1 usage:', error.message);
  process.exit(1);
}
