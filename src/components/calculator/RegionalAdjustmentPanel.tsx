/**
 * Regional Adjustment Panel Component
 * 
 * Allows users to apply regional multipliers to pro forma presets
 */

import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Collapse,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Info as InfoIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import {
  type RegionKey,
  getAllRegions,
  regionalData,
  detectRegionFromAddress,
} from '../../utils/regionalMultipliers';

interface RegionalAdjustmentPanelProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  selectedRegion: RegionKey;
  onRegionChange: (region: RegionKey) => void;
  propertyAddress?: string;
  autoDetect?: boolean;
  variant?: 'full' | 'compact';
}

export const RegionalAdjustmentPanel: React.FC<RegionalAdjustmentPanelProps> = ({
  enabled,
  onEnabledChange,
  selectedRegion,
  onRegionChange,
  propertyAddress = '',
  autoDetect = false,
  variant = 'full',
}) => {
  const regions = getAllRegions();
  const currentRegionData = regionalData[selectedRegion];

  // Auto-detect region when address changes (if autoDetect is enabled)
  React.useEffect(() => {
    if (autoDetect && propertyAddress && enabled) {
      const detectedRegion = detectRegionFromAddress(propertyAddress);
      if (detectedRegion !== selectedRegion) {
        onRegionChange(detectedRegion);
      }
    }
  }, [propertyAddress, autoDetect, enabled, selectedRegion, onRegionChange]);

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Regional Adjustment
            </Typography>
          }
        />
        {enabled && (
          <>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value as RegionKey)}
                displayEmpty
              >
                {regions.map(({ key, data }) => (
                  <MenuItem key={key} value={key}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Chip
              icon={<LocationIcon />}
              label={currentRegionData.name}
              size="small"
              sx={{
                bgcolor: brandColors.backgrounds.info,
                color: brandColors.text.info,
              }}
            />
          </>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: brandColors.neutral[50],
        borderRadius: 1,
        border: `1px solid ${brandColors.neutral[200]}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.neutral[700] }}>
            Regional Adjustments
          </Typography>
          <Tooltip
            title="Adjusts expense percentages based on geographic location to reflect local market conditions more accurately"
            arrow
          >
            <IconButton size="small">
              <InfoIcon fontSize="small" sx={{ color: brandColors.neutral[500] }} />
            </IconButton>
          </Tooltip>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: brandColors.neutral[600] }}>
              {enabled ? 'Enabled' : 'Disabled'}
            </Typography>
          }
        />
      </Box>

      <Collapse in={enabled}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {autoDetect && propertyAddress && (
            <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
              Region auto-detected from property address: <strong>{currentRegionData.name}</strong>
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Market Region</InputLabel>
            <Select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value as RegionKey)}
              label="Market Region"
            >
              {regions.map(({ key, data }) => (
                <MenuItem key={key} value={key}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                      {data.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {currentRegionData && selectedRegion !== 'national-average' && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'white',
                borderRadius: 1,
                border: `1px solid ${brandColors.neutral[200]}`,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.neutral[700], mb: 1, display: 'block' }}>
                Regional Multipliers:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                    Maintenance:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, ml: 1 }}>
                    {(currentRegionData.multipliers.maintenance * 100).toFixed(0)}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                    Vacancy:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, ml: 1 }}>
                    {(currentRegionData.multipliers.vacancy * 100).toFixed(0)}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                    Management:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, ml: 1 }}>
                    {(currentRegionData.multipliers.management * 100).toFixed(0)}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
                    CapEx:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, ml: 1 }}>
                    {(currentRegionData.multipliers.capEx * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Box>

              {currentRegionData.notes && currentRegionData.notes.length > 0 && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${brandColors.neutral[200]}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brandColors.neutral[700], mb: 0.5, display: 'block' }}>
                    Regional Notes:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {currentRegionData.notes.map((note, idx) => (
                      <Typography
                        key={idx}
                        component="li"
                        variant="caption"
                        sx={{ color: brandColors.neutral[600], lineHeight: 1.4, mb: 0.25 }}
                      >
                        {note}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default RegionalAdjustmentPanel;

