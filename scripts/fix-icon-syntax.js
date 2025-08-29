#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Icon Syntax Issues...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix the broken icon syntax in the tabs array
  const brokenIconRegex = /icon: <React\.Suspense fallback=\{<Box sx=\{.*?\} \/>\}>\s*<Lazy(\w+)Icon \/>\s*}/g;
  const fixedIconReplacement = 'icon: <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}><Lazy$1Icon /></React.Suspense>';
  
  const brokenIconMatches = content.match(brokenIconRegex);
  if (brokenIconMatches) {
    content = content.replace(brokenIconRegex, fixedIconReplacement);
    changes += brokenIconMatches.length;
    console.log(`✅ Fixed ${brokenIconMatches.length} broken icon syntax issues`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} syntax issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing icon syntax:', error.message);
  process.exit(1);
}
