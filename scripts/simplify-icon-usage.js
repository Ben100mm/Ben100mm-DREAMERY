#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Simplifying Icon Usage...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Simplify the complex icon usage by using a simpler approach
  const complexIconRegex = /icon: React\.createElement\(React\.Suspense, \{ fallback: React\.createElement\(Box, \{ sx: \{ width: 24, height: 24 \} \}\) \}, React\.createElement\(Lazy(\w+)Icon\)\)/g;
  const simpleIconReplacement = 'icon: () => React.createElement(React.Suspense, { fallback: React.createElement(Box, { sx: { width: 24, height: 24 } }) }, React.createElement(Lazy$1Icon))';
  
  const complexIconMatches = content.match(complexIconRegex);
  if (complexIconMatches) {
    content = content.replace(complexIconRegex, simpleIconReplacement);
    changes += complexIconMatches.length;
    console.log(`✅ Simplified ${complexIconMatches.length} complex icon usages`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully simplified ${changes} icon usages in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error simplifying icon usage:', error.message);
  process.exit(1);
}
