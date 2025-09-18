#!/usr/bin/env node

/**
 * Fix Grid props comprehensively for Material-UI v7
 * Convert all Grid breakpoint props to proper size object syntax
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixGridPropsComprehensiveInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Function to extract breakpoint props from a Grid component
  function extractBreakpointProps(gridMatch) {
    const props = {};
    
    // Extract xs
    const xsMatch = gridMatch.match(/xs=\{([^}]+)\}/);
    if (xsMatch) props.xs = xsMatch[1];
    
    // Extract sm
    const smMatch = gridMatch.match(/sm=\{([^}]+)\}/);
    if (smMatch) props.sm = smMatch[1];
    
    // Extract md
    const mdMatch = gridMatch.match(/md=\{([^}]+)\}/);
    if (mdMatch) props.md = mdMatch[1];
    
    // Extract lg
    const lgMatch = gridMatch.match(/lg=\{([^}]+)\}/);
    if (lgMatch) props.lg = lgMatch[1];
    
    // Extract xl
    const xlMatch = gridMatch.match(/xl=\{([^}]+)\}/);
    if (xlMatch) props.xl = xlMatch[1];
    
    return props;
  }
  
  // Function to create size object from breakpoint props
  function createSizeObject(props) {
    const sizeEntries = Object.entries(props).map(([key, value]) => `${key}: ${value}`);
    return `{ ${sizeEntries.join(', ')} }`;
  }
  
  // Find all Grid components with breakpoint props and fix them
  const gridPattern = /<Grid\s+([^>]*?)>/g;
  let match;
  
  while ((match = gridPattern.exec(content)) !== null) {
    const fullMatch = match[0];
    const propsString = match[1];
    
    // Check if this Grid has breakpoint props
    if (propsString.includes('xs={') || propsString.includes('sm={') || 
        propsString.includes('md={') || propsString.includes('lg={') || 
        propsString.includes('xl={')) {
      
      const breakpointProps = extractBreakpointProps(propsString);
      
      if (Object.keys(breakpointProps).length > 0) {
        // Create the size object
        const sizeObject = createSizeObject(breakpointProps);
        
        // Remove breakpoint props and add size prop
        let newPropsString = propsString;
        
        // Remove all breakpoint props
        newPropsString = newPropsString.replace(/xs=\{([^}]+)\}/g, '');
        newPropsString = newPropsString.replace(/sm=\{([^}]+)\}/g, '');
        newPropsString = newPropsString.replace(/md=\{([^}]+)\}/g, '');
        newPropsString = newPropsString.replace(/lg=\{([^}]+)\}/g, '');
        newPropsString = newPropsString.replace(/xl=\{([^}]+)\}/g, '');
        
        // Clean up extra spaces
        newPropsString = newPropsString.replace(/\s+/g, ' ').trim();
        
        // Add size prop
        const sizeProp = `size={${sizeObject}}`;
        if (newPropsString) {
          newPropsString = `${sizeProp} ${newPropsString}`;
        } else {
          newPropsString = sizeProp;
        }
        
        const newGridTag = `<Grid ${newPropsString}>`;
        
        content = content.replace(fullMatch, newGridTag);
        hasChanges = true;
        
        console.log(`  Fixed Grid props: ${Object.keys(breakpointProps).join(', ')} -> size={${sizeObject}}`);
      }
    }
  }
  
  // Write back if changes were made
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No Grid breakpoint prop issues found in ${filePath}`);
  }
  
  return hasChanges;
}

function main() {
  console.log('🔧 Starting comprehensive Grid props fix...\n');
  
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
      const hasChanges = fixGridPropsComprehensiveInFile(file);
      if (hasChanges) {
        totalChanges++;
        changedFiles.push(file);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n🎉 Comprehensive Grid props fix completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Files processed: ${files.length}`);
  console.log(`   - Files changed: ${totalChanges}`);
  console.log(`   - Changed files: ${changedFiles.length > 0 ? changedFiles.join(', ') : 'None'}`);
}

if (require.main === module) {
  main();
}

module.exports = { fixGridPropsComprehensiveInFile };