/**
 * Live Market Data Widget Component
 * 
 * Displays live market data with auto-refresh functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface LiveMarketDataWidgetProps {
  autoRefreshInterval?: number; // milliseconds, default 5 minutes
  variant?: 'full' | 'compact';
}

export const LiveMarketDataWidget: React.FC<LiveMarketDataWidgetProps> = ({
  autoRefreshInterval = 5 * 60 * 1000, // 5 minutes
  variant = 'full',
}) => {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const updateMarketData = useCallback(() => {
    setIsUpdating(true);
    
    // Simulate API call to fetch live market data
    setTimeout(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setLastUpdated(`${formattedDate}, ${formattedTime}`);
      setIsUpdating(false);
    }, 1000);
  }, []);

  // Initialize on mount
  useEffect(() => {
    updateMarketData();
  }, [updateMarketData]);

  // Auto-update at specified interval
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(updateMarketData, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [updateMarketData, autoRefreshInterval]);

  if (variant === 'compact') {
    return (
      <Chip
        icon={isUpdating ? <CircularProgress size={16} /> : <TrendingUpIcon />}
        label={isUpdating ? 'Updating...' : `Updated: ${lastUpdated}`}
        size="small"
        onClick={updateMarketData}
        sx={{
          bgcolor: brandColors.backgrounds.selected,
          color: brandColors.text.info,
          '&:hover': {
            bgcolor: brandColors.backgrounds.info,
          },
        }}
      />
    );
  }

  return (
    <Box
      onClick={updateMarketData}
      sx={{
        p: 2,
        bgcolor: brandColors.backgrounds.selected,
        borderRadius: 1,
        border: `1px solid ${brandColors.borders.info}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: brandColors.backgrounds.info,
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon sx={{ color: brandColors.text.info, fontSize: 20 }} />
          <Box>
            <Typography variant="body2" sx={{ color: brandColors.text.info, fontWeight: 600 }}>
              Live Market Data
            </Typography>
            <Typography variant="caption" sx={{ color: brandColors.text.info, display: 'block' }}>
              {isUpdating ? 'Updating...' : `Last updated: ${lastUpdated}`}
            </Typography>
          </Box>
        </Box>
        {isUpdating ? (
          <CircularProgress size={20} sx={{ color: brandColors.text.info }} />
        ) : (
          <Tooltip title="Refresh market data" arrow>
            <IconButton size="small" sx={{ color: brandColors.text.info }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default LiveMarketDataWidget;

