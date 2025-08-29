#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating CloseAgentPage.tsx Icon Usages...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseAgentPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Define icon mappings for systematic replacement
  const iconMappings = [
    { old: 'DashboardIcon', new: 'LazyDashboardIcon' },
    { old: 'PeopleIcon', new: 'LazyPeopleIcon' },
    { old: 'AssignmentIcon', new: 'LazyAssignmentIcon' },
    { old: 'ManageAccountsIcon', new: 'LazyManageAccountsIcon' },
    { old: 'ListAltIcon', new: 'LazyListAltIcon' },
    { old: 'CreateIcon', new: 'LazyCreateIcon' },
    { old: 'ReceiptIcon', new: 'LazyReceiptIcon' },
    { old: 'CompareArrowsIcon', new: 'LazyCompareArrowsIcon' },
    { old: 'AccountBalanceIcon', new: 'LazyAccountBalanceIcon' },
    { old: 'DescriptionIcon', new: 'LazyDescriptionIcon' },
    { old: 'AssignmentTurnedInIcon', new: 'LazyAssignmentTurnedInIcon' },
    { old: 'ChecklistIcon', new: 'LazyChecklistIcon' },
    { old: 'TaskIcon', new: 'LazyTaskIcon' },
    { old: 'EditIcon', new: 'LazyEditIcon' },
    { old: 'CancelIcon', new: 'LazyCancelIcon' },
    { old: 'ArchiveIcon', new: 'LazyArchiveIcon' },
    { old: 'BusinessIcon', new: 'LazyBusinessIcon' },
    { old: 'SupportIcon', new: 'LazySupportIcon' },
    { old: 'SettingsIcon', new: 'LazySettingsIcon' },
    { old: 'IntegrationIcon', new: 'LazyIntegrationIcon' },
    { old: 'SearchIcon', new: 'LazySearchIcon' },
    { old: 'ArrowBackIcon', new: 'LazyArrowBackIcon' },
    { old: 'DownloadIcon', new: 'LazyDownloadIcon' },
    { old: 'ArrowUpwardIcon', new: 'LazyArrowUpwardIcon' },
    { old: 'CloseIcon', new: 'LazyCloseIcon' },
    { old: 'TrendingUpIcon', new: 'LazyTrendingUpIcon' },
    { old: 'EventIcon', new: 'LazyEventIcon' },
    { old: 'AttachMoneyIcon', new: 'LazyAttachMoneyIcon' },
    { old: 'ScheduleIcon', new: 'LazyScheduleIcon' },
    { old: 'WarningIcon', new: 'LazyWarningIcon' },
    { old: 'FilterListIcon', new: 'LazyFilterListIcon' },
    { old: 'VisibilityOffIcon', new: 'LazyVisibilityOffIcon' },
    { old: 'VisibilityIcon', new: 'LazyVisibilityIcon' },
    { old: 'CheckCircleIcon', new: 'LazyCheckCircleIcon' },
    { old: 'UploadIcon', new: 'LazyUploadIcon' },
    { old: 'AddIcon', new: 'LazyAddIcon' },
    { old: 'SaveIcon', new: 'LazySaveIcon' },
    { old: 'SendIcon', new: 'LazySendIcon' },
    { old: 'ExpandMoreIcon', new: 'LazyExpandMoreIcon' },
    { old: 'AssessmentIcon', new: 'LazyAssessmentIcon' },
    { old: 'NoteAddIcon', new: 'LazyNoteAddIcon' },
    { old: 'ShareIcon', new: 'LazyShareIcon' },
    { old: 'MoreVertIcon', new: 'LazyMoreVertIcon' },
    { old: 'RemoveIcon', new: 'LazyRemoveIcon' },
    { old: 'TextFieldsIcon', new: 'LazyTextFieldsIcon' },
    { old: 'CheckBoxIcon', new: 'LazyCheckBoxIcon' },
    { old: 'InputIcon', new: 'LazyInputIcon' },
    { old: 'ContentCopyIcon', new: 'LazyContentCopyIcon' },
    { old: 'ContentPasteIcon', new: 'LazyContentPasteIcon' },
    { old: 'DeleteIcon', new: 'LazyDeleteIcon' },
    { old: 'StrikethroughSIcon', new: 'LazyStrikethroughSIcon' },
    { old: 'PaymentIcon', new: 'LazyPaymentIcon' },
    { old: 'ReceiptLongIcon', new: 'LazyReceiptLongIcon' },
    { old: 'MonetizationOnIcon', new: 'LazyMonetizationOnIcon' },
    { old: 'AccountBalanceWalletIcon', new: 'LazyAccountBalanceWalletIcon' },
    { old: 'SpeedIcon', new: 'LazySpeedIcon' },
    { old: 'CreditCardIcon', new: 'LazyCreditCardIcon' },
    { old: 'PersonIcon', new: 'LazyPersonIcon' },
    { old: 'InfoIcon', new: 'LazyInfoIcon' },
    { old: 'ArrowForwardIcon', new: 'LazyArrowForwardIcon' }
  ];

  // Update each icon systematically
  iconMappings.forEach(({ old, new: newIcon }) => {
    // Pattern 1: Standalone icon usage
    const standaloneRegex = new RegExp(`<${old}[^>]*\\/>`, 'g');
    const standaloneMatches = content.match(standaloneRegex);
    if (standaloneMatches) {
      content = content.replace(standaloneRegex, `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <${newIcon} />`);
      changes += standaloneMatches.length;
      console.log(`✅ Updated ${standaloneMatches.length} ${old} usages`);
    }

    // Pattern 2: Icon with props
    const withPropsRegex = new RegExp(`<${old}([^>]*)\\/>`, 'g');
    const withPropsMatches = content.match(withPropsRegex);
    if (withPropsMatches) {
      content = content.replace(withPropsRegex, (match, props) => {
        return `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <${newIcon}${props} />`;
      });
      // Don't double count if already counted above
      if (!standaloneMatches) {
        changes += withPropsMatches.length;
        console.log(`✅ Updated ${withPropsMatches.length} ${old} usages with props`);
      }
    }
  });

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully updated ${changes} icon usages in CloseAgentPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error updating CloseAgentPage.tsx:', error.message);
  process.exit(1);
}
