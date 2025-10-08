/**
 * Pro Forma Preset Selector Component
 * 
 * Quick-select buttons for expense presets with regional adjustment support
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  SaveAlt as SaveIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import { getLocationAdjustedPreset, type RegionKey } from '../../utils/regionalMultipliers';

interface ProFormaPreset {
  maintenance: number;
  vacancy: number;
  management: number;
  capEx: number;
  opEx: number;
}

interface CustomPreset extends ProFormaPreset {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

interface ProFormaPresetSelectorProps {
  currentValues: ProFormaPreset;
  onApplyPreset: (preset: ProFormaPreset, presetName: string) => void;
  regionalAdjustment?: {
    enabled: boolean;
    region: RegionKey;
  };
  customPresets?: CustomPreset[];
  onSaveCustomPreset?: (name: string, description?: string) => void;
  onDeleteCustomPreset?: (id: string) => void;
  variant?: 'full' | 'compact';
}

const BASE_PRESETS: Record<string, ProFormaPreset> = {
  conservative: { maintenance: 8, vacancy: 6, management: 12, capEx: 6, opEx: 4 },
  moderate: { maintenance: 6, vacancy: 4, management: 9, capEx: 4, opEx: 3 },
  aggressive: { maintenance: 4, vacancy: 2, management: 6, capEx: 2, opEx: 2 },
};

export const ProFormaPresetSelector: React.FC<ProFormaPresetSelectorProps> = ({
  currentValues,
  onApplyPreset,
  regionalAdjustment,
  customPresets = [],
  onSaveCustomPreset,
  onDeleteCustomPreset,
  variant = 'full',
}) => {
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [presetName, setPresetName] = React.useState('');
  const [presetDescription, setPresetDescription] = React.useState('');

  const getAdjustedPreset = (presetType: 'conservative' | 'moderate' | 'aggressive'): ProFormaPreset => {
    if (regionalAdjustment?.enabled && regionalAdjustment.region) {
      return getLocationAdjustedPreset(presetType, regionalAdjustment.region);
    }
    return BASE_PRESETS[presetType];
  };

  const handleApplyPreset = (presetType: 'conservative' | 'moderate' | 'aggressive') => {
    const preset = getAdjustedPreset(presetType);
    onApplyPreset(preset, presetType);
  };

  const handleSaveCustom = () => {
    if (presetName.trim() && onSaveCustomPreset) {
      onSaveCustomPreset(presetName.trim(), presetDescription.trim() || undefined);
      setPresetName('');
      setPresetDescription('');
      setShowSaveDialog(false);
    }
  };

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: brandColors.neutral[600], fontWeight: 500 }}>
          Quick Presets:
        </Typography>
        <ButtonGroup size="small" variant="outlined">
          <Button onClick={() => handleApplyPreset('conservative')}>
            Conservative
          </Button>
          <Button onClick={() => handleApplyPreset('moderate')}>
            Moderate
          </Button>
          <Button onClick={() => handleApplyPreset('aggressive')}>
            Aggressive
          </Button>
        </ButtonGroup>
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
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <StarIcon sx={{ color: brandColors.primary, fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.neutral[700] }}>
          Expense Presets
        </Typography>
        <Tooltip title="Quick-apply industry-standard expense percentages" arrow>
          <IconButton size="small">
            <InfoIcon fontSize="small" sx={{ color: brandColors.neutral[500] }} />
          </IconButton>
        </Tooltip>
      </Box>

      {regionalAdjustment?.enabled && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Presets will be adjusted for <strong>{regionalAdjustment.region}</strong> region
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Base Presets */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => handleApplyPreset('conservative')}
            sx={{
              py: 2,
              flexDirection: 'column',
              borderColor: brandColors.neutral[300],
              color: brandColors.neutral[700],
              '&:hover': {
                borderColor: brandColors.primary,
                bgcolor: brandColors.backgrounds.hover,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Conservative
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
              Higher safety margin
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, fontSize: '0.7rem', color: brandColors.neutral[500] }}>
              <span>M: {getAdjustedPreset('conservative').maintenance}%</span>
              <span>V: {getAdjustedPreset('conservative').vacancy}%</span>
              <span>Mgmt: {getAdjustedPreset('conservative').management}%</span>
            </Box>
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleApplyPreset('moderate')}
            sx={{
              py: 2,
              flexDirection: 'column',
              borderColor: brandColors.primary,
              color: brandColors.primary,
              borderWidth: 2,
              '&:hover': {
                borderColor: brandColors.primaryLight,
                bgcolor: brandColors.backgrounds.selected,
                borderWidth: 2,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Moderate
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
              Balanced approach
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, fontSize: '0.7rem', color: brandColors.neutral[500] }}>
              <span>M: {getAdjustedPreset('moderate').maintenance}%</span>
              <span>V: {getAdjustedPreset('moderate').vacancy}%</span>
              <span>Mgmt: {getAdjustedPreset('moderate').management}%</span>
            </Box>
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleApplyPreset('aggressive')}
            sx={{
              py: 2,
              flexDirection: 'column',
              borderColor: brandColors.neutral[300],
              color: brandColors.neutral[700],
              '&:hover': {
                borderColor: brandColors.primary,
                bgcolor: brandColors.backgrounds.hover,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Aggressive
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.neutral[600] }}>
              Lower cost assumption
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, fontSize: '0.7rem', color: brandColors.neutral[500] }}>
              <span>M: {getAdjustedPreset('aggressive').maintenance}%</span>
              <span>V: {getAdjustedPreset('aggressive').vacancy}%</span>
              <span>Mgmt: {getAdjustedPreset('aggressive').management}%</span>
            </Box>
          </Button>
        </Box>

        {/* Custom Presets Section */}
        {onSaveCustomPreset && (
          <>
            <Divider />
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.neutral[700] }}>
                  Custom Presets
                </Typography>
                {!showSaveDialog && (
                  <Button
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => setShowSaveDialog(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    Save Current
                  </Button>
                )}
              </Box>

              {showSaveDialog && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 1,
                    border: `1px solid ${brandColors.neutral[300]}`,
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: brandColors.neutral[600] }}>
                    Save current expense percentages as a custom preset
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <input
                      type="text"
                      placeholder="Preset name (e.g., 'SF Bay Area Multi-Family')"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: `1px solid ${brandColors.neutral[300]}`,
                        fontSize: '0.875rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={presetDescription}
                      onChange={(e) => setPresetDescription(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: `1px solid ${brandColors.neutral[300]}`,
                        fontSize: '0.875rem',
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSaveCustom}
                        disabled={!presetName.trim()}
                        sx={{ flex: 1 }}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setShowSaveDialog(false);
                          setPresetName('');
                          setPresetDescription('');
                        }}
                        sx={{ flex: 1 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {customPresets.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  {customPresets.map((preset) => (
                    <Box
                      key={preset.id}
                      sx={{
                        p: 1.5,
                        bgcolor: 'white',
                        borderRadius: 1,
                        border: `1px solid ${brandColors.neutral[200]}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': {
                          borderColor: brandColors.primary,
                          bgcolor: brandColors.backgrounds.hover,
                        },
                      }}
                    >
                      <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => onApplyPreset(preset, preset.name)}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                          {preset.name}
                        </Typography>
                        {preset.description && (
                          <Typography variant="caption" sx={{ color: brandColors.neutral[600], display: 'block', mb: 0.5 }}>
                            {preset.description}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 0.5, fontSize: '0.7rem', color: brandColors.neutral[500] }}>
                          <span>M: {preset.maintenance}%</span>
                          <span>V: {preset.vacancy}%</span>
                          <span>Mgmt: {preset.management}%</span>
                          <span>CapEx: {preset.capEx}%</span>
                          <span>OpEx: {preset.opEx}%</span>
                        </Box>
                      </Box>
                      {onDeleteCustomPreset && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustomPreset(preset.id);
                          }}
                          sx={{ color: brandColors.neutral[500] }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {customPresets.length === 0 && !showSaveDialog && (
                <Typography variant="caption" sx={{ color: brandColors.neutral[500], fontStyle: 'italic' }}>
                  No custom presets saved yet
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProFormaPresetSelector;

