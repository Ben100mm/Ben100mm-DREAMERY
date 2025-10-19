/**
 * Market Data Integration Widget
 * 
 * A reusable component that can be added to any page to provide
 * quick access to market data from the Data Integrations framework
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Collapse,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CloudQueue as CloudQueueIcon,
  OpenInNew as OpenInNewIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDataIntegrations } from '../hooks/useDataIntegrations';
import { AggregationStrategy } from '../services/dataIntegrations';
import { formatCurrency } from './UXComponents';
import { brandColors } from '../theme';

export interface MarketDataIntegrationWidgetProps {
  /**
   * Initial ZIP code to load (optional)
   */
  initialZipCode?: string;
  
  /**
   * Compact mode (reduced size)
   */
  compact?: boolean;
  
  /**
   * Auto-expand on mount
   */
  autoExpand?: boolean;
}

/**
 * Market Data Integration Widget Component
 */
export const MarketDataIntegrationWidget: React.FC<MarketDataIntegrationWidgetProps> = ({
  initialZipCode = '',
  compact = false,
  autoExpand = false,
}) => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [expanded, setExpanded] = useState(autoExpand);

  const {
    marketData,
    availableSources,
    loading,
    error,
    fetchMarketData,
    clearData,
  } = useDataIntegrations({
    strategy: AggregationStrategy.WEIGHTED_AVERAGE,
    minimumSources: 1,
  });

  const handleFetch = () => {
    if (zipCode.trim()) {
      fetchMarketData(zipCode.trim());
      setExpanded(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  const handleViewDashboard = () => {
    navigate('/data-sources');
  };

  return (
    <Card
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${brandColors.primary}15 0%, ${brandColors.secondary}15 100%)`,
        border: `1px solid ${brandColors.primary}30`,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <CloudQueueIcon color="primary" />
            <Typography variant="h6" fontWeight="medium">
              Market Data
            </Typography>
            <Tooltip title="Powered by Data Integrations Framework">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={`${availableSources.length} Sources`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Link
              component="button"
              variant="body2"
              onClick={handleViewDashboard}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              Full Dashboard
              <OpenInNewIcon fontSize="small" />
            </Link>
          </Box>
        </Box>

        {/* Search Input */}
        <Box display="flex" gap={1} mb={2}>
          <TextField
            size={compact ? 'small' : 'medium'}
            fullWidth
            label="ZIP Code"
            placeholder="Enter ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleFetch}
            disabled={loading || !zipCode.trim()}
            sx={{
              minWidth: 100,
              backgroundColor: brandColors.primary,
              '&:hover': {
                backgroundColor: brandColors.primaryDark,
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch'}
          </Button>
          {marketData && (
            <IconButton onClick={() => { clearData(); setExpanded(false); }}>
              <ExpandLessIcon />
            </IconButton>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearData}>
            {error}
          </Alert>
        )}

        {/* Market Data Display */}
        {marketData && (
          <Collapse in={expanded}>
            <Box>
              {/* Location Info */}
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {marketData.city ? `${marketData.city}, ${marketData.state}` : marketData.zipCode}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip
                    size="small"
                    label={`${marketData.sources.length} Sources`}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={`${marketData.confidence}% Confidence`}
                    color={marketData.confidence > 75 ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Key Metrics */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Median Rent
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(marketData.medianRent)}/mo
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Median Price
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(marketData.medianPrice)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Rent Growth
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">
                        {marketData.rentGrowth12mo >= 0 ? '+' : ''}
                        {marketData.rentGrowth12mo.toFixed(2)}%
                      </Typography>
                      {marketData.rentGrowth12mo > 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Appreciation
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">
                        {marketData.appreciationRate12mo >= 0 ? '+' : ''}
                        {marketData.appreciationRate12mo.toFixed(2)}%
                      </Typography>
                      {marketData.appreciationRate12mo > 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Additional Metrics */}
              <Box mt={2} p={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Vacancy Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {marketData.vacancyRate.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Days on Market
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {Math.round(marketData.daysOnMarket)} days
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      School Rating
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {marketData.schoolRating.toFixed(1)}/10
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* View Full Data Button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={handleViewDashboard}
                sx={{ mt: 2 }}
                endIcon={<OpenInNewIcon />}
              >
                View Full Analysis in Data Sources Dashboard
              </Button>
            </Box>
          </Collapse>
        )}

        {/* Empty State */}
        {!marketData && !loading && !error && (
          <Alert severity="info" icon={<CloudQueueIcon />}>
            Enter a ZIP code to fetch real-time market data from {availableSources.length} sources
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketDataIntegrationWidget;

