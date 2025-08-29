#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing First Tab Object...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix the first tab object that is missing its closing brace and comma
  const firstTabRegex = /\{ value: 'dashboard', label: 'Dashboard', icon: "Dashboard",\s*$/gm;
  const firstTabReplacement = '{ value: \'dashboard\', label: \'Dashboard\', icon: "Dashboard" },';
  
  const firstTabMatches = content.match(firstTabRegex);
  if (firstTabMatches) {
    content = content.replace(firstTabRegex, firstTabReplacement);
    changes += firstTabMatches.length;
    console.log(`✅ Fixed ${firstTabMatches.length} first tab object syntax issues`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} first tab syntax issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing first tab:', error.message);
  process.exit(1);
}
