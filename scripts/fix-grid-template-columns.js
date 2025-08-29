#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CloseAgentPage.tsx');

console.log('🔧 Fixing malformed gridTemplateColumns in CloseAgentPage.tsx...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix malformed gridTemplateColumns with missing opening parenthesis
  content = content.replace(
    /gridTemplateColumns: \{ xs: '1fr', sm: 'repeat\(2, 1fr\)'/g,
    "gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)'"
  );
  
  content = content.replace(
    /gridTemplateColumns: \{ xs: '1fr', sm: 'repeat\(2, 1fr\)', md: 'repeat\(3, 1fr\)'/g,
    "gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'"
  );
  
  content = content.replace(
    /gridTemplateColumns: \{ xs: '1fr', sm: 'repeat\(2, 1fr\)', md: 'repeat\(4, 1fr\)'/g,
    "gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'"
  );
  
  content = content.replace(
    /gridTemplateColumns: \{ xs: 'repeat\(2, 1fr\)', sm: 'repeat\(3, 1fr\)', md: 'repeat\(6, 1fr\)'/g,
    "gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)'"
  );
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Successfully fixed malformed gridTemplateColumns:');
  console.log('   - Fixed missing opening parentheses in repeat() functions');
  console.log('   - Fixed various gridTemplateColumns patterns');
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing gridTemplateColumns:', error.message);
  process.exit(1);
}
