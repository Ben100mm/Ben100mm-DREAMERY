#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Tabs Array Syntax...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix the tabs array by ensuring proper object literal syntax
  const brokenTabsRegex = /\{ value: '([^']+)', label: '([^']+)', icon: "([^"]+)"\s*$/gm;
  const fixedTabsReplacement = '{ value: \'$1\', label: \'$2\', icon: "$3" },';
  
  const brokenTabsMatches = content.match(brokenTabsRegex);
  if (brokenTabsMatches) {
    content = content.replace(brokenTabsRegex, fixedTabsReplacement);
    changes += brokenTabsMatches.length;
    console.log(`✅ Fixed ${brokenTabsMatches.length} broken tab object literals`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} tab syntax issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing tabs array:', error.message);
  process.exit(1);
}
