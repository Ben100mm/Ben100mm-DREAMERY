/**
 * Milky Way Panorama Control Panel
 * Provides interactive controls for the Milky Way panorama visualization
 */

import React from 'react';
import {
  Box,
  Paper,
  Slider,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { brandColors } from '../../../theme/theme';

interface MilkyWayControlsProps {
  /** Control values */
  controls: {
    brightness: number;
    contrast: number;
    saturation: number;
    starIntensity: number;
    zoom: number;
    autoRotate: number;
  };
  /** Update control callback */
  onUpdateControl: (key: string, value: number) => void;
  /** Reset controls callback */
  onResetControls: () => void;
  /** Visibility state */
  visible: boolean;
  /** Toggle visibility callback */
  onToggleVisibility: () => void;
  /** Show/hide control panel */
  showControls: boolean;
  /** Toggle control panel */
  onToggleControls: () => void;
  /** Reset rotation callback */
  onResetRotation: () => void;
}

export const MilkyWayControls: React.FC<MilkyWayControlsProps> = ({
  controls,
  onUpdateControl,
  onResetControls,
  visible,
  onToggleVisibility,
  showControls,
  onToggleControls,
  onResetRotation,
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {/* Main control button */}
      <Tooltip title={showControls ? 'Hide Controls' : 'Show Controls'}>
        <IconButton
          onClick={onToggleControls}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: brandColors.primary,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            },
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      {/* Visibility toggle */}
      <Tooltip title={visible ? 'Hide Milky Way' : 'Show Milky Way'}>
        <IconButton
          onClick={onToggleVisibility}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: visible ? brandColors.primary : '#666',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            },
          }}
        >
          {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </Tooltip>

      {/* Control Panel */}
      {showControls && (
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${brandColors.primary}`,
            borderRadius: 2,
            minWidth: 280,
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2, textAlign: 'center' }}>
            Milky Way Controls
          </Typography>

          {/* Brightness */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
              Brightness
            </Typography>
            <Slider
              value={controls.brightness}
              onChange={(_, value) => onUpdateControl('brightness', value as number)}
              min={-1}
              max={1}
              step={0.1}
              sx={{
                color: brandColors.primary,
                '& .MuiSlider-thumb': {
                  backgroundColor: brandColors.primary,
                },
              }}
            />
          </Box>

          {/* Contrast */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
              Contrast
            </Typography>
            <Slider
              value={controls.contrast}
              onChange={(_, value) => onUpdateControl('contrast', value as number)}
              min={0}
              max={3}
              step={0.1}
              sx={{
                color: brandColors.primary,
                '& .MuiSlider-thumb': {
                  backgroundColor: brandColors.primary,
                },
              }}
            />
          </Box>

          {/* Saturation */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
              Saturation
            </Typography>
            <Slider
              value={controls.saturation}
              onChange={(_, value) => onUpdateControl('saturation', value as number)}
              min={0}
              max={2}
              step={0.1}
              sx={{
                color: brandColors.primary,
                '& .MuiSlider-thumb': {
                  backgroundColor: brandColors.primary,
                },
              }}
            />
          </Box>

          {/* Star Intensity */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
              Star Intensity
            </Typography>
            <Slider
              value={controls.starIntensity}
              onChange={(_, value) => onUpdateControl('starIntensity', value as number)}
              min={0}
              max={1}
              step={0.1}
              sx={{
                color: brandColors.primary,
                '& .MuiSlider-thumb': {
                  backgroundColor: brandColors.primary,
                },
              }}
            />
          </Box>

          {/* Zoom */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
              Zoom
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => onUpdateControl('zoom', Math.max(0.1, controls.zoom - 0.1))}
                sx={{ color: brandColors.primary }}
                size="small"
              >
                <ZoomOutIcon />
              </IconButton>
              <Slider
                value={controls.zoom}
                onChange={(_, value) => onUpdateControl('zoom', value as number)}
                min={0.1}
                max={3}
                step={0.1}
                sx={{
                  flex: 1,
                  color: brandColors.primary,
                  '& .MuiSlider-thumb': {
                    backgroundColor: brandColors.primary,
                  },
                }}
              />
              <IconButton
                onClick={() => onUpdateControl('zoom', Math.min(3, controls.zoom + 0.1))}
                sx={{ color: brandColors.primary }}
                size="small"
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Auto Rotate */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
              Auto Rotate
            </Typography>
            <Slider
              value={controls.autoRotate}
              onChange={(_, value) => onUpdateControl('autoRotate', value as number)}
              min={0}
              max={0.1}
              step={0.01}
              sx={{
                color: brandColors.primary,
                '& .MuiSlider-thumb': {
                  backgroundColor: brandColors.primary,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onResetRotation}
              startIcon={<RotateLeftIcon />}
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                '&:hover': {
                  borderColor: brandColors.actions.primary,
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              Reset View
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              onClick={onResetControls}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: brandColors.primary,
                color: brandColors.primary,
                '&:hover': {
                  borderColor: brandColors.actions.primary,
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              Reset All
            </Button>
          </Box>

          {/* Instructions */}
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#aaa', textAlign: 'center' }}>
            Drag to rotate • Scroll to zoom • Right-click for more options
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
