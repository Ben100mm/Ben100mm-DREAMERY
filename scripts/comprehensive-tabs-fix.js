#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Comprehensive Tabs Array Fix...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Fix all the broken tab object literals by ensuring proper syntax
  const fixes = [
    // Fix missing closing braces and commas
    { 
      regex: /\{ value: 'clients', label: 'Client Management', icon: "People",\s*$/gm,
      replacement: '{ value: \'clients\', label: \'Client Management\', icon: "People" },'
    },
    { 
      regex: /\{ value: 'transactions', label: 'Transactions', icon: "Assignment",\s*$/gm,
      replacement: '{ value: \'transactions\', label: \'Transactions\', icon: "Assignment" },'
    },
    { 
      regex: /\{ value: 'manage-transactions', label: 'Manage Transactions', icon: "ManageAccounts",\s*$/gm,
      replacement: '{ value: \'manage-transactions\', label: \'Manage Transactions\', icon: "ManageAccounts" },'
    },
    { 
      regex: /\{ value: 'manage-listings', label: 'Manage Listings', icon: "ListAlt",\s*$/gm,
      replacement: '{ value: \'manage-listings\', label: \'Manage Listings\', icon: "ListAlt" },'
    },
    { 
      regex: /\{ value: 'write-listing', label: 'Write A Listing', icon: "Create",\s*$/gm,
      replacement: '{ value: \'write-listing\', label: \'Write A Listing\', icon: "Create" },'
    },
    { 
      regex: /\{ value: 'write-offer', label: 'Write An Offer', icon: "Receipt",\s*$/gm,
      replacement: '{ value: \'write-offer\', label: \'Write An Offer\', icon: "Receipt" },'
    },
    { 
      regex: /\{ value: 'review-offers', label: 'Review Offers', icon: "CompareArrows",\s*$/gm,
      replacement: '{ value: \'review-offers\', label: \'Review Offers\', icon: "CompareArrows" },'
    },
    { 
      regex: /\{ value: 'payments-finance', label: 'Payments & Finance', icon: "AccountBalance",\s*$/gm,
      replacement: '{ value: \'payments-finance\', label: \'Payments & Finance\', icon: "AccountBalance" },'
    },
    { 
      regex: /\{ value: 'documents-review', label: 'Documents to Review', icon: "Description",\s*$/gm,
      replacement: '{ value: \'documents-review\', label: \'Documents to Review\', icon: "Description" },'
    },
    { 
      regex: /\{ value: 'working-documents', label: 'Templates', icon: "AssignmentTurnedIn",\s*$/gm,
      replacement: '{ value: \'working-documents\', label: \'Templates\', icon: "AssignmentTurnedIn" },'
    },
    { 
      regex: /\{ value: 'incomplete-checklist', label: 'Checklists', icon: "Checklist",\s*$/gm,
      replacement: '{ value: \'incomplete-checklist\', label: \'Checklists\', icon: "Checklist" },'
    },
    { 
      regex: /\{ value: 'tasks-reminders', label: 'Tasks & Reminders', icon: "Task",\s*$/gm,
      replacement: '{ value: \'tasks-reminders\', label: \'Tasks & Reminders\', icon: "Task" },'
    },
    { 
      regex: /\{ value: 'digital-signature', label: 'Digital Signature', icon: "Edit",\s*$/gm,
      replacement: '{ value: \'digital-signature\', label: \'Digital Signature\', icon: "Edit" },'
    },
    { 
      regex: /\{ value: 'canceled-contracts', label: 'Canceled Contracts', icon: "Cancel",\s*$/gm,
      replacement: '{ value: \'canceled-contracts\', label: \'Canceled Contracts\', icon: "Cancel" },'
    },
    { 
      regex: /\{ value: 'access-archives', label: 'Access Archives', icon: "Archive",\s*$/gm,
      replacement: '{ value: \'access-archives\', label: \'Access Archives\', icon: "Archive" },'
    },
    { 
      regex: /\{ value: 'reports', label: 'Reports & Analytics', icon: "Business",\s*$/gm,
      replacement: '{ value: \'reports\', label: \'Reports & Analytics\', icon: "Business" },'
    },
    { 
      regex: /\{ value: 'support', label: 'Support', icon: "Support",\s*$/gm,
      replacement: '{ value: \'support\', label: \'Support\', icon: "Support" },'
    },
    { 
      regex: /\{ value: 'settings', label: 'Settings', icon: "Settings",\s*$/gm,
      replacement: '{ value: \'settings\', label: \'Settings\', icon: "Settings" },'
    },
    { 
      regex: /\{ value: 'integrations', label: 'Integrations', icon: "Integration",\s*$/gm,
      replacement: '{ value: \'integrations\', label: \'Integrations\', icon: "Integration" },'
    }
  ];

  // Apply all fixes
  fixes.forEach(fix => {
    const matches = content.match(fix.regex);
    if (matches) {
      content = content.replace(fix.regex, fix.replacement);
      changes += matches.length;
      console.log(`✅ Fixed ${matches.length} ${fix.regex.source.slice(0, 50)}...`);
    }
  });

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully fixed ${changes} tab syntax issues in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error fixing tabs array:', error.message);
  process.exit(1);
}
