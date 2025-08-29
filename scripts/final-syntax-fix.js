#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/CloseAgentPage.tsx');

console.log('🔧 Final Syntax Fix for CloseAgentPage.tsx...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix 1: Fix the first tab object missing closing brace and comma
  content = content.replace(
    /{ value: 'dashboard', label: 'Dashboard', icon: "Dashboard",\s*\n\s*\/\/ Client & Transaction Management/,
    '{ value: \'dashboard\', label: \'Dashboard\', icon: "Dashboard" },\n    // Client & Transaction Management'
  );
  
  // Fix 2: Fix all other tab objects missing closing braces and commas
  const tabFixes = [
    { value: 'offer-details', label: 'OFFER DETAILS', icon: "Description" },
    { value: 'property-info', label: 'PROPERTY INFO', icon: "Business" },
    { value: 'buyer-details', label: 'BUYER DETAILS', icon: "Person" },
    { value: 'financing', label: 'FINANCING', icon: "AccountBalance" },
    { value: 'terms', label: 'TERMS & CONDITIONS', icon: "Assignment" },
    { value: 'attachments', label: 'ATTACHMENTS', icon: "AttachMoney" },
    { value: 'review', label: 'REVIEW & SUBMIT', icon: "CheckCircle" }
  ];
  
  tabFixes.forEach(fix => {
    const searchPattern = new RegExp(
      `{ value: '${fix.value}', label: '${fix.label}', icon: "${fix.icon}",`,
      'g'
    );
    const replacement = `{ value: '${fix.value}', label: '${fix.label}', icon: "${fix.icon}" },`;
    content = content.replace(searchPattern, replacement);
  });
  
  // Fix 3: Ensure all LazyIcon components have proper React.Suspense closing tags
  content = content.replace(
    /(<Lazy[^>]*Icon \/>)(?!\s*<\/React\.Suspense>)/g,
    '$1</React.Suspense>'
  );
  
  // Fix 4: Remove any duplicate React.Suspense closing tags
  content = content.replace(/<\/React\.Suspense>\s*<\/React\.Suspense>/g, '</React.Suspense>');
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Successfully applied all syntax fixes:');
  console.log('   - Fixed missing closing braces and commas in tab objects');
  console.log('   - Added missing React.Suspense closing tags');
  console.log('   - Removed duplicate closing tags');
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing syntax:', error.message);
  process.exit(1);
}
