# Regional Multipliers for Pro Forma Presets

## Problem Fixed

**Issue**: Pro forma presets used the same expense percentages for all markets, not reflecting local conditions.

**Impact**: Analysis doesn't account for:
- Regional property tax variations (e.g., NY vs. TX vs. FL)
- Climate-driven costs (hurricane insurance in Florida, heating in Northeast)
- Market-specific factors (labor costs in Bay Area vs. Midwest)
- Local regulatory environment

**Example of Regional Differences**:
- New York Metro: 2.0x property tax multiplier (highest in nation)
- Florida Coastal: 2.0x insurance multiplier (hurricane/flood)
- California Bay Area: 1.4x maintenance multiplier (high labor costs)
- Great Plains: 0.8x management multiplier (lower service costs)

## Solution Implemented

### New Utility: `regionalMultipliers.ts`

Created comprehensive regional adjustment system with:

**1. Regional Multipliers** for 17 major markets:
- California (Bay Area, SoCal)
- New York Metro
- Florida (Coastal, Inland)
- Texas Major Cities
- Midwest (Rust Belt, Growing)
- Southeast Growing Markets
- Mountain West
- Pacific Northwest
- Northeast (Boston)
- South Atlantic
- Great Plains
- Hawaii
- Alaska
- National Average (baseline)

**2. Multiplier Categories**:
- Property Tax
- Insurance
- Maintenance
- Management
- Utilities
- Vacancy Rate
- Capital Expenditures
- HOA Fees

**3. Key Functions**:
```typescript
// Get location-adjusted preset
const preset = getLocationAdjustedPreset('moderate', 'california-bay-area');

// Auto-detect region from address
const region = detectRegionFromAddress('123 Main St, San Francisco, CA');

// Apply multipliers to custom preset
const adjusted = applyRegionalMultipliers(basePreset, regionKey);

// Get all available regions for dropdown
const regions = getAllRegions();
```

## Usage Examples

### Basic Usage
```typescript
import { getLocationAdjustedPreset } from '../utils/regionalMultipliers';

// Get moderate preset for Bay Area
const bayAreaPreset = getLocationAdjustedPreset('moderate', 'california-bay-area');
// Result: {
//   maintenance: 8.4,  // 6 * 1.4
//   vacancy: 3.6,      // 4 * 0.9
//   management: 10.8,  // 9 * 1.2
//   capEx: 5.2,        // 4 * 1.3
//   opEx: 3.0
// }
```

### Auto-Detection
```typescript
import { detectRegionFromAddress } from '../utils/regionalMultipliers';

const address = '123 Mission St, San Francisco, CA 94110';
const region = detectRegionFromAddress(address);
// Returns: 'california-bay-area'

// Then apply:
const preset = getLocationAdjustedPreset('moderate', region);
```

### Integration in AnalyzePage (Already Added)

```typescript
// State (already added)
const [selectedRegion, setSelectedRegion] = useState<RegionKey>('national-average');
const [useRegionalAdjustment, setUseRegionalAdjustment] = useState(false);
const [propertyAddress, setPropertyAddress] = useState('');

// Updated applyProFormaPreset function (already updated)
const applyProFormaPreset = (preset: 'conservative' | 'moderate' | 'aggressive') => {
  let adjustedPreset;
  
  if (useRegionalAdjustment) {
    adjustedPreset = getLocationAdjustedPreset(preset, selectedRegion);
  } else {
    // Base presets...
  }
  
  setOps(adjustedPreset);
  setProFormaPreset(preset);
};

// Auto-detect handler (already added)
const handleAddressChange = (address: string) => {
  setPropertyAddress(address);
  if (address && useRegionalAdjustment) {
    const detectedRegion = detectRegionFromAddress(address);
    setSelectedRegion(detectedRegion);
    applyProFormaPreset(proFormaPreset);
  }
};
```

## UI Integration Guide

### Option 1: Add to Pro Forma Presets Tab

Add this section above or below the Conservative/Moderate/Aggressive buttons:

```tsx
{/* Regional Adjustment Section */}
<Box sx={{ mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
    <FormControlLabel
      control={
        <Switch
          checked={useRegionalAdjustment}
          onChange={(e) => toggleRegionalAdjustment(e.target.checked)}
          color="primary"
        />
      }
      label="Use Regional Adjustments"
    />
    <Chip
      label={useRegionalAdjustment ? "Location-Adjusted" : "National Average"}
      color={useRegionalAdjustment ? "success" : "default"}
      size="small"
    />
  </Box>

  {useRegionalAdjustment && (
    <>
      {/* Property Address Input */}
      <TextField
        fullWidth
        label="Property Address"
        value={propertyAddress}
        onChange={(e) => handleAddressChange(e.target.value)}
        placeholder="Enter address for auto-detection"
        helperText="Address will auto-detect region"
        sx={{ mb: 2 }}
      />

      {/* Manual Region Selection */}
      <FormControl fullWidth>
        <InputLabel>Region</InputLabel>
        <Select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value as RegionKey);
            applyProFormaPreset(proFormaPreset);
          }}
          label="Region"
        >
          {getAllRegions().map(({ key, data }) => (
            <MenuItem key={key} value={key}>
              {data.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Show Regional Info */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          <strong>{regionalData[selectedRegion].name}</strong>
        </Typography>
        <Typography variant="caption">
          {regionalData[selectedRegion].description}
        </Typography>
        {regionalData[selectedRegion].notes && (
          <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
            {regionalData[selectedRegion].notes.map((note, i) => (
              <li key={i}>
                <Typography variant="caption">{note}</Typography>
              </li>
            ))}
          </Box>
        )}
      </Alert>
    </>
  )}
</Box>
```

### Option 2: Add as Separate Settings Panel

Create a collapsible "Location Settings" panel:

```tsx
<Accordion>
  <AccordionSummary expandIcon={<ExpandMore />}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LocationOnIcon />
      <Typography>Location Settings</Typography>
      {useRegionalAdjustment && (
        <Chip
          label={regionalData[selectedRegion].name}
          size="small"
          color="primary"
        />
      )}
    </Box>
  </AccordionSummary>
  <AccordionDetails>
    {/* Include the UI from Option 1 here */}
  </AccordionDetails>
</Accordion>
```

### Option 3: Add to Property Details Section

If there's a property details/basic info section, add region selection there and have it automatically apply to presets.

## Regional Data Summary

### High-Cost Markets (Multipliers > 1.2)
- **New York Metro**: Highest property taxes (2.0x), high labor costs
- **California Bay Area**: High everything except taxes (Prop 13)
- **Hawaii**: Highest utilities (1.8x), expensive materials (1.6x maintenance)
- **Boston Area**: High taxes (1.5x), old housing stock (1.3x maintenance)

### Moderate-Cost Markets (Multipliers ~1.0)
- **Growing Midwest**: Columbus, Indianapolis - balanced costs
- **Southeast Growing**: Charlotte, Atlanta - good growth, moderate costs
- **Mountain West**: Denver, Phoenix - below-average taxes

### Lower-Cost Markets (Multipliers < 1.0 on average)
- **Great Plains**: Lowest professional services (0.8x management)
- **Midwest Rust Belt**: Lower services but higher vacancy (1.3x)

### Special Considerations
- **Florida Coastal**: 2.0x insurance (hurricane/flood)
- **Texas**: 1.8x property tax (funds schools, no income tax)
- **Alaska**: 1.5x utilities (extreme heating costs)

## Benefits

1. **More Accurate Analysis**: Reflects real local market conditions
2. **Better Decision Making**: Avoid underestimating costs in expensive markets
3. **Risk Management**: Properly account for regional risk factors
4. **Investor Education**: Notes explain WHY costs differ
5. **Flexibility**: Can toggle on/off, useful for portfolio analysis

## Testing

```typescript
// Test auto-detection
console.log(detectRegionFromAddress('San Francisco, CA'));
// Expected: 'california-bay-area'

// Test adjustments
const base = { maintenance: 6, vacancy: 4, management: 9, capEx: 4, opEx: 3 };
const adjusted = applyRegionalMultipliers(base, 'new-york-metro');
console.log(adjusted);
// Expected: maintenance: 9.0 (6 * 1.5), management: 11.7 (9 * 1.3), etc.

// Test all regions load
const allRegions = getAllRegions();
console.log(allRegions.length);
// Expected: 17
```

## Next Steps

1. **Add UI** to AnalyzePage pro-forma section (see integration guide above)
2. **Add to UnderwritePage** - same logic can be applied
3. **Save preferences** - remember user's region selection
4. **Enhanced auto-detection** - integrate with geocoding API for better detection
5. **Update documentation** - add regional considerations to user guide
6. **Add tooltips** - explain each multiplier when hovering

## Files Modified

- ✅ `/src/utils/regionalMultipliers.ts` - New utility (620 lines)
- ✅ `/src/pages/AnalyzePage.tsx` - Added state and handlers (partial)
- 📝 TODO: Add UI components to render region selection
- 📝 TODO: Apply to UnderwritePage
- 📝 TODO: Add to types if needed

## Questions?

For questions or to customize regions/multipliers:
1. Edit `/src/utils/regionalMultipliers.ts`
2. Add new regions to `regionalData` object
3. Adjust multipliers based on local research
4. Update `detectRegionFromAddress` for better auto-detection

---

**Implementation Status**: Backend complete, UI integration pending
**Estimated UI Work**: 30-60 minutes to add components
**Breaking Changes**: None (additive only)

