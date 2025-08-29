#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Object Literal Syntax...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix the broken object literal syntax by replacing JSX with simple icon references
  const brokenObjectRegex = /icon: <React\.Suspense fallback=\{<Box sx=\{.*?\} \/>\}>\s*<Lazy(\w+)Icon \/>\s*}/g;
  const fixedObjectReplacement = 'icon: "$1"';
  
  const brokenObjectMatches = content.match(brokenObjectRegex);
  if (brokenObjectMatches) {
    content = content.replace(brokenObjectRegex, fixedObjectReplacement);
    changes += brokenObjectMatches.length;
    console.log(`✅ Fixed ${brokenObjectMatches.length} broken object literal syntax issues`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} object literal syntax issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing object literal syntax:', error.message);
  process.exit(1);
}
