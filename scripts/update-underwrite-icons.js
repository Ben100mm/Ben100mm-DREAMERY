#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating UnderwritePage.tsx Icon Usages...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'UnderwritePage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Update ExpandMoreIcon usages in AccordionSummary
  const expandMoreRegex = /<AccordionSummary expandIcon=\{<ExpandMoreIcon \/>\}>/g;
  const expandMoreReplacement = `<AccordionSummary expandIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>
              }>`;
  
  const expandMoreMatches = content.match(expandMoreRegex);
  if (expandMoreMatches) {
    content = content.replace(expandMoreRegex, expandMoreReplacement);
    changes += expandMoreMatches.length;
    console.log(`✅ Updated ${expandMoreMatches.length} ExpandMoreIcon usages in AccordionSummary`);
  }

  // Update standalone ExpandMoreIcon usage
  const standaloneExpandMoreRegex = /<ExpandMoreIcon \/>/g;
  const standaloneExpandMoreReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyExpandMoreIcon />
                </React.Suspense>`;
  
  const standaloneExpandMoreMatches = content.match(standaloneExpandMoreRegex);
  if (standaloneExpandMoreMatches) {
    content = content.replace(standaloneExpandMoreRegex, standaloneExpandMoreReplacement);
    changes += standaloneExpandMoreMatches.length;
    console.log(`✅ Updated ${standaloneExpandMoreMatches.length} standalone ExpandMoreIcon usages`);
  }

  // Update DeleteIcon usage
  const deleteIconRegex = /<DeleteIcon fontSize="small" \/>/g;
  const deleteIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyDeleteIcon fontSize="small" />
                </React.Suspense>`;
  
  const deleteIconMatches = content.match(deleteIconRegex);
  if (deleteIconMatches) {
    content = content.replace(deleteIconRegex, deleteIconReplacement);
    changes += deleteIconMatches.length;
    console.log(`✅ Updated ${deleteIconMatches.length} DeleteIcon usages`);
  }

  // Update TrendingUpIcon usage
  const trendingUpIconRegex = /startIcon=\{<TrendingUpIcon \/>\}/g;
  const trendingUpIconReplacement = `startIcon={
                <React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyTrendingUpIcon />
                </React.Suspense>
              }`;
  
  const trendingUpIconMatches = content.match(trendingUpIconRegex);
  if (trendingUpIconMatches) {
    content = content.replace(trendingUpIconRegex, trendingUpIconReplacement);
    changes += trendingUpIconMatches.length;
    console.log(`✅ Updated ${trendingUpIconMatches.length} TrendingUpIcon usages`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully updated ${changes} icon usages in UnderwritePage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error updating UnderwritePage.tsx:', error.message);
  process.exit(1);
}
