#!/usr/bin/env node
/**
 * Update Insurance Integration
 * Updates the frontend to use the new insurance API endpoints
 */

const fs = require('fs');
const path = require('path');

// Path to the insurance utilities component
const insuranceUtilsPath = path.join(__dirname, '..', 'src', 'components', 'close', 'insurance-utilities', 'InsuranceUtilities.tsx');

// Read the current file
let content = fs.readFileSync(insuranceUtilsPath, 'utf8');

// Update the API endpoints to use the new insurance API
const updates = [
  {
    // Update the quotes endpoint
    from: "const response = await fetch('/api/insurance/quotes', {",
    to: "const response = await fetch('http://localhost:5002/api/insurance/quotes', {"
  },
  {
    // Update the bind endpoint
    from: "const response = await fetch('/api/insurance/bind', {",
    to: "const response = await fetch('http://localhost:5002/api/insurance/bind', {"
  }
];

// Apply updates
updates.forEach(update => {
  if (content.includes(update.from)) {
    content = content.replace(update.from, update.to);
    console.log(`✓ Updated: ${update.from}`);
  } else {
    console.log(`⚠ Not found: ${update.from}`);
  }
});

// Write the updated content back
fs.writeFileSync(insuranceUtilsPath, content);

console.log('\n✓ Insurance integration updated successfully!');
console.log('\nNext steps:');
console.log('1. Start the insurance API server: cd server && python start_insurance_api.py');
console.log('2. Configure your API keys in insurance_config.env');
console.log('3. Test the integration with: cd server && python test_insurance_api.py');
console.log('4. Start your frontend application');
