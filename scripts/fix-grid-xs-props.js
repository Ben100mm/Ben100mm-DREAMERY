#!/usr/bin/env node

/**
 * Fix Grid xs props to use proper Material-UI v7 syntax
 * Convert Grid xs={...} to Grid size={{ xs: ... }}
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixGridXsPropsInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Fix Grid xs props - convert to size prop
  // Pattern: <Grid xs={6}> -> <Grid size={{ xs: 6 }}>
  content = content.replace(/<Grid\s+xs=\{([^}]+)\}([^>]*?)>/g, (match, xsValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid xs prop: xs={${xsValue}} -> size={{ xs: ${xsValue} }}`);
    return `<Grid size={{ xs: ${xsValue} }}${otherProps}>`;
  });
  
  // Also handle md, lg, xl props
  content = content.replace(/<Grid\s+md=\{([^}]+)\}([^>]*?)>/g, (match, mdValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid md prop: md={${mdValue}} -> size={{ md: ${mdValue} }}`);
    return `<Grid size={{ md: ${mdValue} }}${otherProps}>`;
  });
  
  content = content.replace(/<Grid\s+lg=\{([^}]+)\}([^>]*?)>/g, (match, lgValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid lg prop: lg={${lgValue}} -> size={{ lg: ${lgValue} }}`);
    return `<Grid size={{ lg: ${lgValue} }}${otherProps}>`;
  });
  
  content = content.replace(/<Grid\s+xl=\{([^}]+)\}([^>]*?)>/g, (match, xlValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid xl prop: xl={${xlValue}} -> size={{ xl: ${xlValue} }}`);
    return `<Grid size={{ xl: ${xlValue} }}${otherProps}>`;
  });
  
  // Handle multiple breakpoint props on same Grid
  // Pattern: <Grid xs={6} md={4}> -> <Grid size={{ xs: 6, md: 4 }}>
  content = content.replace(/<Grid\s+xs=\{([^}]+)\}\s+md=\{([^}]+)\}([^>]*?)>/g, (match, xsValue, mdValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid multiple props: xs={${xsValue}} md={${mdValue}} -> size={{ xs: ${xsValue}, md: ${mdValue} }}`);
    return `<Grid size={{ xs: ${xsValue}, md: ${mdValue} }}${otherProps}>`;
  });
  
  content = content.replace(/<Grid\s+xs=\{([^}]+)\}\s+lg=\{([^}]+)\}([^>]*?)>/g, (match, xsValue, lgValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid multiple props: xs={${xsValue}} lg={${lgValue}} -> size={{ xs: ${xsValue}, lg: ${lgValue} }}`);
    return `<Grid size={{ xs: ${xsValue}, lg: ${lgValue} }}${otherProps}>`;
  });
  
  content = content.replace(/<Grid\s+md=\{([^}]+)\}\s+lg=\{([^}]+)\}([^>]*?)>/g, (match, mdValue, lgValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid multiple props: md={${mdValue}} lg={${lgValue}} -> size={{ md: ${mdValue}, lg: ${lgValue} }}`);
    return `<Grid size={{ md: ${mdValue}, lg: ${lgValue} }}${otherProps}>`;
  });
  
  // Handle three breakpoints
  content = content.replace(/<Grid\s+xs=\{([^}]+)\}\s+md=\{([^}]+)\}\s+lg=\{([^}]+)\}([^>]*?)>/g, (match, xsValue, mdValue, lgValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid three props: xs={${xsValue}} md={${mdValue}} lg={${lgValue}} -> size={{ xs: ${xsValue}, md: ${mdValue}, lg: ${lgValue} }}`);
    return `<Grid size={{ xs: ${xsValue}, md: ${mdValue}, lg: ${lgValue} }}${otherProps}>`;
  });
  
  // Handle sm breakpoint
  content = content.replace(/<Grid\s+sm=\{([^}]+)\}([^>]*?)>/g, (match, smValue, otherProps) => {
    hasChanges = true;
    console.log(`  Fixed Grid sm prop: sm={${smValue}} -> size={{ sm: ${smValue} }}`);
    return `<Grid size={{ sm: ${smValue} }}${otherProps}>`;
  });
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid xs prop issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting Grid xs props fix...\n');
  
  // Find all TypeScript and JavaScript files in src
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
    ignore: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'src/**/*.spec.{ts,tsx,js,jsx}',
      'src/**/*.backup.{ts,tsx,js,jsx}',
      'src/**/*.old.{ts,tsx,js,jsx}',
      'src/**/*.new.{ts,tsx,js,jsx}',
      'src/**/*.original.{ts,tsx,js,jsx}',
    ]
  });
  
  console.log(`Found ${files.length} files to process\n`);
  
  let totalChanges = 0;
  const changedFiles = [];
  
  files.forEach(file => {
    try {
      const hasChanges = fixGridXsPropsInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Grid xs props fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixGridXsPropsInFile };
