#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating CloseBrokeragesPage.tsx Icon Usages...\n');

const filePath = path.join(process.cwd(), 'src', 'pages', 'CloseBrokeragesPage.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Update BusinessIcon usages
  const businessIconRegex = /<BusinessIcon[^>]*\/>/g;
  const businessIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyBusinessIcon />
                </React.Suspense>`;
  
  const businessIconMatches = content.match(businessIconRegex);
  if (businessIconMatches) {
    content = content.replace(businessIconRegex, businessIconReplacement);
    changes += businessIconMatches.length;
    console.log(`✅ Updated ${businessIconMatches.length} BusinessIcon usages`);
  }

  // Update PeopleIcon usages
  const peopleIconRegex = /<PeopleIcon[^>]*\/>/g;
  const peopleIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPeopleIcon />
                </React.Suspense>`;
  
  const peopleIconMatches = content.match(peopleIconRegex);
  if (peopleIconMatches) {
    content = content.replace(peopleIconRegex, peopleIconReplacement);
    changes += peopleIconMatches.length;
    console.log(`✅ Updated ${peopleIconMatches.length} PeopleIcon usages`);
  }

  // Update TrendingUpIcon usages
  const trendingUpIconRegex = /<TrendingUpIcon[^>]*\/>/g;
  const trendingUpIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyTrendingUpIcon />
                </React.Suspense>`;
  
  const trendingUpIconMatches = content.match(trendingUpIconRegex);
  if (trendingUpIconMatches) {
    content = content.replace(trendingUpIconRegex, trendingUpIconReplacement);
    changes += trendingUpIconMatches.length;
    console.log(`✅ Updated ${trendingUpIconMatches.length} TrendingUpIcon usages`);
  }

  // Update CheckCircleIcon usages
  const checkCircleIconRegex = /<CheckCircleIcon[^>]*\/>/g;
  const checkCircleIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCheckCircleIcon />
                </React.Suspense>`;
  
  const checkCircleIconMatches = content.match(checkCircleIconRegex);
  if (checkCircleIconMatches) {
    content = content.replace(checkCircleIconRegex, checkCircleIconReplacement);
    changes += checkCircleIconMatches.length;
    console.log(`✅ Updated ${checkCircleIconMatches.length} CheckCircleIcon usages`);
  }

  // Update ArrowForwardIcon usages
  const arrowForwardIconRegex = /<ArrowForwardIcon[^>]*\/>/g;
  const arrowForwardIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyArrowForwardIcon />
                </React.Suspense>`;
  
  const arrowForwardIconMatches = content.match(arrowForwardIconRegex);
  if (arrowForwardIconMatches) {
    content = content.replace(arrowForwardIconRegex, arrowForwardIconReplacement);
    changes += arrowForwardIconMatches.length;
    console.log(`✅ Updated ${arrowForwardIconMatches.length} ArrowForwardIcon usages`);
  }

  // Update PersonIcon usages
  const personIconRegex = /<PersonIcon[^>]*\/>/g;
  const personIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyPersonIcon />
                </React.Suspense>`;
  
  const personIconMatches = content.match(personIconRegex);
  if (personIconMatches) {
    content = content.replace(personIconRegex, personIconReplacement);
    changes += personIconMatches.length;
    console.log(`✅ Updated ${personIconMatches.length} PersonIcon usages`);
  }

  // Update EditIcon usages
  const editIconRegex = /<EditIcon[^>]*\/>/g;
  const editIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyEditIcon />
                </React.Suspense>`;
  
  const editIconMatches = content.match(editIconRegex);
  if (editIconMatches) {
    content = content.replace(editIconRegex, editIconReplacement);
    changes += editIconMatches.length;
    console.log(`✅ Updated ${editIconMatches.length} EditIcon usages`);
  }

  // Update AddIcon usages
  const addIconRegex = /<AddIcon[^>]*\/>/g;
  const addIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAddIcon />
                </React.Suspense>`;
  
  const addIconMatches = content.match(addIconRegex);
  if (addIconMatches) {
    content = content.replace(addIconRegex, addIconReplacement);
    changes += addIconMatches.length;
    console.log(`✅ Updated ${addIconMatches.length} AddIcon usages`);
  }

  // Update SearchIcon usages
  const searchIconRegex = /<SearchIcon[^>]*\/>/g;
  const searchIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySearchIcon />
                </React.Suspense>`;
  
  const searchIconMatches = content.match(searchIconRegex);
  if (searchIconMatches) {
    content = content.replace(searchIconRegex, searchIconReplacement);
    changes += searchIconMatches.length;
    console.log(`✅ Updated ${searchIconMatches.length} SearchIcon usages`);
  }

  // Update AssessmentIcon usages
  const assessmentIconRegex = /<AssessmentIcon[^>]*\/>/g;
  const assessmentIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssessmentIcon />
                </React.Suspense>`;
  
  const assessmentIconMatches = content.match(assessmentIconRegex);
  if (assessmentIconMatches) {
    content = content.replace(assessmentIconRegex, assessmentIconReplacement);
    changes += assessmentIconMatches.length;
    console.log(`✅ Updated ${assessmentIconMatches.length} AssessmentIcon usages`);
  }

  // Update AssignmentIcon usages
  const assignmentIconRegex = /<AssignmentIcon[^>]*\/>/g;
  const assignmentIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyAssignmentIcon />
                </React.Suspense>`;
  
  const assignmentIconMatches = content.match(assignmentIconRegex);
  if (assignmentIconMatches) {
    content = content.replace(assignmentIconRegex, assignmentIconReplacement);
    changes += assignmentIconMatches.length;
    console.log(`✅ Updated ${assignmentIconMatches.length} AssignmentIcon usages`);
  }

  // Update MoreVertIcon usages
  const moreVertIconRegex = /<MoreVertIcon[^>]*\/>/g;
  const moreVertIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyMoreVertIcon />
                </React.Suspense>`;
  
  const moreVertIconMatches = content.match(moreVertIconRegex);
  if (moreVertIconMatches) {
    content = content.replace(moreVertIconRegex, moreVertIconReplacement);
    changes += moreVertIconMatches.length;
    console.log(`✅ Updated ${moreVertIconMatches.length} MoreVertIcon usages`);
  }

  // Update ArchiveIcon usages
  const archiveIconRegex = /<ArchiveIcon[^>]*\/>/g;
  const archiveIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyArchiveIcon />
                </React.Suspense>`;
  
  const archiveIconMatches = content.match(archiveIconRegex);
  if (archiveIconMatches) {
    content = content.replace(archiveIconRegex, archiveIconReplacement);
    changes += archiveIconMatches.length;
    console.log(`✅ Updated ${archiveIconMatches.length} ArchiveIcon usages`);
  }

  // Update SendIcon usages
  const sendIconRegex = /<SendIcon[^>]*\/>/g;
  const sendIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySendIcon />
                </React.Suspense>`;
  
  const sendIconMatches = content.match(sendIconRegex);
  if (sendIconMatches) {
    content = content.replace(sendIconRegex, sendIconReplacement);
    changes += sendIconMatches.length;
    console.log(`✅ Updated ${sendIconMatches.length} SendIcon usages`);
  }

  // Update SecurityIcon usages
  const securityIconRegex = /<SecurityIcon[^>]*\/>/g;
  const securityIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySecurityIcon />
                </React.Suspense>`;
  
  const securityIconMatches = content.match(securityIconRegex);
  if (securityIconMatches) {
    content = content.replace(securityIconRegex, securityIconReplacement);
    changes += securityIconMatches.length;
    console.log(`✅ Updated ${securityIconMatches.length} SecurityIcon usages`);
  }

  // Update SchoolIcon usages
  const schoolIconRegex = /<SchoolIcon[^>]*\/>/g;
  const schoolIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySchoolIcon />
                </React.Suspense>`;
  
  const schoolIconMatches = content.match(schoolIconRegex);
  if (schoolIconMatches) {
    content = content.replace(schoolIconRegex, schoolIconReplacement);
    changes += schoolIconMatches.length;
    console.log(`✅ Updated ${schoolIconMatches.length} SchoolIcon usages`);
  }

  // Update SettingsIcon usages
  const settingsIconRegex = /<SettingsIcon[^>]*\/>/g;
  const settingsIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySettingsIcon />
                </React.Suspense>`;
  
  const settingsIconMatches = content.match(settingsIconRegex);
  if (settingsIconMatches) {
    content = content.replace(settingsIconRegex, settingsIconReplacement);
    changes += settingsIconMatches.length;
    console.log(`✅ Updated ${settingsIconMatches.length} SettingsIcon usages`);
  }

  // Update IntegrationIcon usages
  const integrationIconRegex = /<IntegrationIcon[^>]*\/>/g;
  const integrationIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyIntegrationIcon />
                </React.Suspense>`;
  
  const integrationIconMatches = content.match(integrationIconRegex);
  if (integrationIconMatches) {
    content = content.replace(integrationIconRegex, integrationIconReplacement);
    changes += integrationIconMatches.length;
    console.log(`✅ Updated ${integrationIconMatches.length} IntegrationIcon usages`);
  }

  // Update SupportIcon usages
  const supportIconRegex = /<SupportIcon[^>]*\/>/g;
  const supportIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazySupportIcon />
                </React.Suspense>`;
  
  const supportIconMatches = content.match(supportIconRegex);
  if (supportIconMatches) {
    content = content.replace(supportIconRegex, supportIconReplacement);
    changes += supportIconMatches.length;
    console.log(`✅ Updated ${supportIconMatches.length} SupportIcon usages`);
  }

  // Update CloseIcon usages
  const closeIconRegex = /<CloseIcon[^>]*\/>/g;
  const closeIconReplacement = `<React.Suspense fallback={<Box sx={{ width: 24, height: 24 }} />}>
                  <LazyCloseIcon />
                </React.Suspense>`;
  
  const closeIconMatches = content.match(closeIconRegex);
  if (closeIconMatches) {
    content = content.replace(closeIconRegex, closeIconReplacement);
    changes += closeIconMatches.length;
    console.log(`✅ Updated ${closeIconMatches.length} CloseIcon usages`);
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✨ Successfully updated ${changes} icon usages in CloseBrokeragesPage.tsx`);
  console.log('📝 File has been updated and saved');
  
} catch (error) {
  console.error('❌ Error updating CloseBrokeragesPage.tsx:', error.message);
  process.exit(1);
}
