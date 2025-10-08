# Unified Calculator Testing Checklist

## 🎯 Testing Overview
Test the 3-tier progressive disclosure system to ensure all features work correctly across Essential, Standard, and Professional modes.

---

## 🔧 Pre-Test Setup

1. **Open the calculator:**
   - Navigate to: http://localhost:3000/underwrite
   - Or: http://localhost:3001/underwrite (if port 3000 is busy)

2. **Open Browser DevTools:**
   - Press F12 or Cmd+Option+I (Mac)
   - Check Console for errors
   - Check Network tab for failed requests

---

## 🟢 ESSENTIAL MODE TESTS

### ✅ Test 1: Mode Selection & Display
- [ ] Mode selector appears at top of page
- [ ] "Essential" mode is visually distinct (highlighted)
- [ ] Mode description shows: "Quick analysis"
- [ ] Feature list displays correctly below mode selector

### ✅ Test 2: Visible Accordions
**Should be visible:**
- [ ] Basic Info
- [ ] Property Details
- [ ] Financing (simplified)
- [ ] Income
- [ ] Operating Expenses
- [ ] Appreciation Calculator
- [ ] At a Glance

**Should be HIDDEN:**
- [ ] Subject-To Existing Mortgage ❌
- [ ] Seller Finance ❌
- [ ] Hybrid Financing ❌
- [ ] Capital Events ❌
- [ ] 1031 Exchange ❌
- [ ] Advanced Modeling ❌

### ✅ Test 3: Regional Auto-Detection
1. Open "Operating Expenses" accordion
2. Scroll to "Variable Expenses" section
3. Find "Regional Adjustments" panel
4. [ ] Regional adjustment is initially disabled
5. [ ] Enable regional adjustment toggle
6. In "Property Address" field (Basic Info), enter: "123 Main St, San Francisco, CA"
7. [ ] Region auto-detects to "California - Bay Area"
8. [ ] Multipliers display (should show elevated costs for SF)
9. [ ] Regional notes appear below multipliers

### ✅ Test 4: Preset Expenses
1. In Operating Expenses → Variable Expenses
2. [ ] Regional adjustment panel shows
3. [ ] Can select different presets (Conservative/Moderate/Aggressive)
4. [ ] Percentages update when preset changes

### ✅ Test 5: Upgrade Prompt - Complex Financing
1. In Basic Info, set Offer Type to "Seller Finance"
2. [ ] Upgrade prompt appears below mode selector
3. [ ] Prompt says "Complex Financing Options is available in Standard mode"
4. [ ] "Upgrade to Standard" button visible
5. Click "Upgrade to Standard" button
6. [ ] Mode switches to Standard
7. [ ] Seller Finance accordion now appears
8. [ ] All data preserved

---

## 🟡 STANDARD MODE TESTS

### ✅ Test 6: Switch to Standard Mode
1. Click "Standard" in mode selector
2. [ ] Mode switches successfully
3. [ ] Mode description shows: "Comprehensive"
4. [ ] All data from Essential mode preserved

### ✅ Test 7: Additional Accordions Visible
**Now visible (that were hidden in Essential):**
- [ ] Subject-To Existing Mortgage ✅
- [ ] Seller Finance ✅
- [ ] Hybrid Financing ✅

**Still hidden (Professional only):**
- [ ] Capital Events ❌
- [ ] 1031 Exchange ❌
- [ ] Advanced Modeling ❌

### ✅ Test 8: Regional Manual Selection
1. Open Operating Expenses
2. [ ] Regional Adjustments panel visible
3. Enable regional adjustment
4. [ ] Can manually select different regions from dropdown
5. Select "Texas - Major Cities"
6. [ ] Multipliers update (should show high property tax)
7. [ ] Regional notes update to show Texas-specific info

### ✅ Test 9: Subject-To Financing
1. Set Offer Type to "Subject To Existing Mortgage"
2. [ ] Subject-To accordion appears
3. Open Subject-To accordion
4. [ ] Can add loan details
5. [ ] Payment to Seller field visible
6. [ ] Loan calculator fields work

### ✅ Test 10: Seller Finance
1. Set Offer Type to "Seller Finance"
2. [ ] Seller Finance accordion appears
3. Open accordion
4. [ ] Interest rate, term, balloon fields visible
5. [ ] Amortization schedule displays

### ✅ Test 11: Upgrade Prompt to Professional
1. Scroll down page
2. [ ] Upgrade prompt appears below mode selector
3. [ ] Says "Advanced Modeling & Analysis is available in Professional mode"
4. [ ] Button says "Upgrade to Professional"

---

## 🔴 PROFESSIONAL MODE TESTS

### ✅ Test 12: Switch to Professional Mode
1. Click "Professional" in mode selector
2. [ ] Mode switches successfully
3. [ ] Mode description shows: "Full featured"
4. [ ] All previous data preserved

### ✅ Test 13: All Accordions Visible
**Now visible (Professional-exclusive):**
- [ ] Capital Events Planning ✅
- [ ] 1031 Exchange Calculator ✅
- [ ] Advanced Modeling & Analysis ✅

### ✅ Test 14: Capital Events Planning
1. Scroll to "At a Glance" section
2. [ ] Capital Events section visible within metrics
3. [ ] "Add Event" button works
4. [ ] Can schedule events (Roof, HVAC, etc.)
5. [ ] Can set year, cost, likelihood
6. [ ] Total Expected Cost calculates
7. [ ] Average Annual Impact shows

### ✅ Test 15: 1031 Exchange Calculator
1. Scroll down to find "1031 Exchange Calculator" accordion
2. [ ] Accordion is visible
3. Open accordion
4. [ ] Enable toggle switch
5. [ ] Relinquished Property fields appear
6. [ ] Replacement Property fields appear
7. [ ] Can enter values
8. [ ] Deferred gain calculates
9. [ ] Boot calculations work
10. [ ] Timeline deadlines show

### ✅ Test 16: Advanced Modeling & Analysis
1. Scroll down to "Advanced Modeling & Analysis" accordion
2. [ ] Accordion is visible
3. Open accordion
4. [ ] Info alert displays
5. [ ] AdvancedModelingTab component loads
6. [ ] No console errors
7. [ ] Tabs visible (Overview, Global, Seasonal, Exit, Tax, Refi, Risk, Sensitivity, Scenarios)
8. Click through tabs:
   - [ ] Overview tab loads
   - [ ] Global Configuration tab loads
   - [ ] Seasonal Adjustments tab loads
   - [ ] Exit Strategies tab loads
   - [ ] Tax Implications tab loads
   - [ ] Refinance Scenarios tab loads
   - [ ] Risk Analysis tab loads
   - [ ] Sensitivity Analysis tab loads
   - [ ] Scenario Comparison tab loads

---

## 🔄 MODE SWITCHING TESTS

### ✅ Test 17: Data Persistence
1. Start in Essential mode
2. Enter property details:
   - Property Type: "Multi Family"
   - Purchase Price: $500,000
   - Property Address: "456 Oak St, Austin, TX"
3. Switch to Standard mode
4. [ ] Property Type still "Multi Family"
5. [ ] Purchase Price still $500,000
6. [ ] Address still correct
7. Switch to Professional mode
8. [ ] All data still preserved
9. Switch back to Essential
10. [ ] All data STILL preserved

### ✅ Test 18: localStorage Persistence
1. Select "Professional" mode
2. Refresh the page (F5 or Cmd+R)
3. [ ] Page reloads with "Professional" mode selected
4. Select "Essential" mode
5. Refresh the page
6. [ ] Page reloads with "Essential" mode selected

---

## 🎨 UI/UX TESTS

### ✅ Test 19: Brand Colors & Theme
- [ ] Mode selector uses grey theme (brandColors.neutral)
- [ ] Selected mode uses primary color (brandColors.primary)
- [ ] Accordions maintain original styling
- [ ] No visual glitches or color inconsistencies

### ✅ Test 20: Accordion Structure
- [ ] All accordions have expand/collapse icons
- [ ] Accordion titles maintain fontWeight: 700
- [ ] Card borders are consistent
- [ ] Spacing between accordions is correct

### ✅ Test 21: Regional Adjustment Panel Styling
- [ ] Panel has grey background (neutral[50])
- [ ] Border is subtle (neutral[200])
- [ ] Toggle switch works smoothly
- [ ] Dropdown displays correctly
- [ ] Multipliers show with proper formatting

### ✅ Test 22: Upgrade Prompts Styling
- [ ] Info alerts use correct blue colors
- [ ] Button styling matches theme
- [ ] Alert icon displays correctly
- [ ] Text is readable and properly formatted

---

## 📱 RESPONSIVE TESTS

### ✅ Test 23: Mobile View (< 768px)
1. Open DevTools
2. Toggle device toolbar (Cmd+Shift+M or Ctrl+Shift+M)
3. Set to "iPhone 12 Pro" or similar
4. [ ] Mode selector stacks vertically
5. [ ] Mode buttons are large enough to tap
6. [ ] Accordions work on mobile
7. [ ] All fields are accessible
8. [ ] No horizontal overflow

### ✅ Test 24: Tablet View (768px - 1024px)
1. Set device to "iPad"
2. [ ] Mode selector displays in grid (3 columns)
3. [ ] Content readable
4. [ ] Touch targets adequate

---

## 🐛 ERROR HANDLING TESTS

### ✅ Test 25: Console Errors
1. Open Console in DevTools
2. Switch between all three modes
3. [ ] No React errors
4. [ ] No 404 errors
5. [ ] No import errors
6. [ ] No type errors

### ✅ Test 26: Network Requests
1. Open Network tab in DevTools
2. Refresh page
3. [ ] All assets load successfully
4. [ ] No failed requests
5. [ ] bundle.js loads
6. [ ] CSS files load

### ✅ Test 27: Invalid Inputs
1. In Essential mode, Operating Expenses
2. Try entering invalid values:
   - Negative numbers
   - Very large numbers (999999999)
   - Text in number fields
3. [ ] Input validation works
4. [ ] No crashes
5. [ ] Helpful error messages (if any)

---

## 🔗 INTEGRATION TESTS

### ✅ Test 28: Financing Type Changes
1. Start in Standard mode
2. Change Offer Type from "Conventional" to "Seller Finance"
3. [ ] Seller Finance accordion appears
4. Change to "Subject To Existing Mortgage"
5. [ ] Subject-To accordion appears
6. [ ] Seller Finance accordion hides
7. Change back to "Conventional"
8. [ ] Both special accordions hide

### ✅ Test 29: Property Type Changes
1. Change Property Type to "Hotel"
2. [ ] Income fields adjust accordingly
3. [ ] Operating expenses adjust
4. [ ] No console errors

### ✅ Test 30: Operation Type Changes
1. Change Operation Type to "Fix & Flip"
2. [ ] Fix & Flip section appears
3. [ ] ARV field visible
4. Change to "BRRRR"
5. [ ] BRRRR section appears
6. [ ] Refinance fields visible

---

## 💾 CALCULATION TESTS

### ✅ Test 31: Basic Calculations (Essential Mode)
1. Enter:
   - Purchase Price: $300,000
   - Down Payment: $60,000 (20%)
   - Interest Rate: 7%
   - Monthly Rent: $2,500
2. Check "At a Glance" section
3. [ ] Monthly Payment calculates
4. [ ] Monthly Cash Flow calculates
5. [ ] Cash on Cash Return calculates
6. [ ] Values are reasonable (no NaN, no Infinity)

### ✅ Test 32: Regional Adjustment Calculations
1. Set Operating Expenses with no regional adjustment:
   - Maintenance: 6%
   - Vacancy: 4%
2. Enable regional adjustment
3. Select "California - Bay Area"
4. [ ] Percentages adjust upward (maintenance should be ~8.4%)
5. Select "Great Plains"
6. [ ] Percentages adjust downward
7. [ ] Calculations reflect adjusted values

### ✅ Test 33: Advanced Calculations (Professional Mode)
1. In Professional mode
2. Add capital event: Roof replacement, Year 3, $15,000
3. [ ] IRR adjusts to account for capital event
4. [ ] Cash flow projections include capital event cost
5. Enable 1031 Exchange
6. [ ] Tax calculations update
7. [ ] Deferred gains calculate correctly

---

## 📊 FINAL CHECKS

### ✅ Test 34: All Features Work
- [ ] Mode switching: ✅
- [ ] Regional adjustments: ✅
- [ ] Upgrade prompts: ✅
- [ ] Accordion visibility: ✅
- [ ] Data persistence: ✅
- [ ] localStorage: ✅
- [ ] Calculations: ✅
- [ ] Styling: ✅
- [ ] No console errors: ✅

### ✅ Test 35: User Flow
Complete a full deal analysis:
1. Start in Essential mode
2. Enter basic property info
3. See results
4. Upgrade to Standard for complex financing
5. Add Subject-To details
6. Upgrade to Professional
7. Plan capital events
8. Model 1031 exchange
9. Use Advanced Modeling tab
10. [ ] Entire flow works smoothly
11. [ ] No data loss at any step
12. [ ] User experience is intuitive

---

## 🎉 Testing Complete!

### Summary
- [ ] All Essential mode features work
- [ ] All Standard mode features work
- [ ] All Professional mode features work
- [ ] Mode switching is seamless
- [ ] Data persists correctly
- [ ] UI/UX is consistent with brand
- [ ] No breaking changes
- [ ] Zero features lost

### Issues Found
(Document any issues here)

1. 
2. 
3. 

### Recommendations
(Any improvements or polish needed)

1. 
2. 
3. 

---

**Tester:** _____________
**Date:** _____________
**Browser:** _____________
**Result:** ✅ PASS / ❌ FAIL

