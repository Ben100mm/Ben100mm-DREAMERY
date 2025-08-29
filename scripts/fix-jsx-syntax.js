#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing JSX Syntax Issues...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix the JSX syntax in the tabs array by properly formatting the icon properties
  const brokenJSXRegex = /icon: <React\.Suspense fallback=\{<Box sx=\{.*?\} \/>\}><Lazy(\w+)Icon \/><\/React\.Suspense>/g;
  const fixedJSXReplacement = 'icon: React.createElement(React.Suspense, { fallback: React.createElement(Box, { sx: { width: 24, height: 24 } }) }, React.createElement(Lazy$1Icon))';
  
  const brokenJSXMatches = content.match(brokenJSXRegex);
  if (brokenJSXMatches) {
    content = content.replace(brokenJSXRegex, fixedJSXReplacement);
    changes += brokenJSXMatches.length;
    console.log(`✅ Fixed ${brokenJSXMatches.length} JSX syntax issues`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} JSX syntax issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing JSX syntax:', error.message);
  process.exit(1);
}
