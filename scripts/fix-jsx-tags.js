#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing JSX Closing Tags...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix missing closing tags for React.Suspense elements
  const missingClosingTagRegex = /<React\.Suspense fallback=\{<Box sx=\{.*?\} \/>\}>\s*<Lazy(\w+)Icon[^>]*\/>\s*<\/IconButton>/g;
  const fixedClosingTagReplacement = '<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><Lazy$1Icon /></React.Suspense></IconButton>';
  
  const missingClosingTagMatches = content.match(missingClosingTagRegex);
  if (missingClosingTagMatches) {
    content = content.replace(missingClosingTagRegex, fixedClosingTagReplacement);
    changes += missingClosingTagMatches.length;
    console.log(`✅ Fixed ${missingClosingTagMatches.length} missing JSX closing tag issues`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} JSX closing tag issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing JSX closing tags:', error.message);
  process.exit(1);
}
