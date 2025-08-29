#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CloseAgentPage.tsx');

console.log('🔧 Replacing Grid with Box components in CloseAgentPage.tsx...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace Grid container with Box using CSS Grid
  content = content.replace(
    /<Grid container spacing=\{(\d+)\}>/g,
    '<Box sx={{ display: \'grid\', gap: $1 }}>'
  );
  
  // Replace Grid component="div" xs={12} md={6} with Box
  content = content.replace(
    /<Grid component="div" xs=\{12\} md=\{6\}>/g,
    '<Box>'
  );
  
  // Replace Grid component="div" xs={12} md={4} with Box
  content = content.replace(
    /<Grid component="div" xs=\{12\} md=\{4\}>/g,
    '<Box>'
  );
  
  // Replace Grid component="div" xs={12} md={3} with Box
  content = content.replace(
    /<Grid component="div" xs=\{12\} md=\{3\}>/g,
    '<Box>'
  );
  
  // Replace Grid component="div" xs={12} sm={6} md={4} with Box
  content = content.replace(
    /<Grid component="div" xs=\{12\} sm=\{6\} md=\{4\}>/g,
    '<Box>'
  );
  
  // Replace Grid component="div" xs={12} with Box
  content = content.replace(
    /<Grid component="div" xs=\{12\}>/g,
    '<Box>'
  );
  
  // Replace closing Grid tags with Box
  content = content.replace(/<\/Grid>/g, '</Box>');
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Successfully replaced Grid components with Box:');
  console.log('   - Replaced Grid container with Box using CSS Grid');
  console.log('   - Replaced Grid item variants with Box components');
  console.log('   - Updated all closing tags');
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error replacing Grid components:', error.message);
  process.exit(1);
}
