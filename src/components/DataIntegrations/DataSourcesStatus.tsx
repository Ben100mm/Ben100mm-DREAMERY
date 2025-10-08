/**
 * Data Sources Status Component
 * 
 * Displays the status of all available data sources, including:
 * - Connection status
 * - Availability
 * - Metadata
 * - Priority
 * - Last successful fetch
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Button,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  CloudQueue as CloudQueueIcon,
  PublicIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { DataSource, DataSourceMetadata } from '../../services/dataIntegrations';
import { brandColors } from '../../theme';

export interface DataSourcesStatusProps {
  /**
   * Map of data sources to their connection status
   */
  sourceStatuses: Map<DataSource, boolean>;
  
  /**
   * Map of data sources to their metadata
   */
  sourceMetadata: Map<DataSource, DataSourceMetadata>;
  
  /**
   * List of currently available sources
   */
  availableSources: DataSource[];
  
  /**
   * Whether a connection test is in progress
   */
  testing: boolean;
  
  /**
   * Callback to trigger connection test
   */
  onTestConnections: () => void;
  
  /**
   * Optional error message
   */
  error?: string | null;
}

/**
 * Get icon for data source
 */
function getSourceIcon(source: DataSource): React.ReactElement {
  switch (source) {
    case DataSource.ZILLOW:
      return <HomeIcon />;
    case DataSource.REALTOR:
      return <BusinessIcon />;
    case DataSource.CENSUS:
      return <PublicIcon />;
    case DataSource.MLS:
      return <CloudQueueIcon />;
    default:
      return <InfoIcon />;
  }
}

/**
 * Get display name for data source
 */
function getSourceDisplayName(source: DataSource): string {
  switch (source) {
    case DataSource.ZILLOW:
      return 'Zillow Research Data';
    case DataSource.REALTOR:
      return 'Realtor.com Economic Data';
    case DataSource.CENSUS:
      return 'US Census Bureau';
    case DataSource.MLS:
      return 'Local MLS Data';
    case DataSource.MOCK:
      return 'Mock Data Provider';
    case DataSource.AGGREGATED:
      return 'Aggregated Data';
    default:
      return source.toString();
  }
}

/**
 * Get description for data source
 */
function getSourceDescription(source: DataSource): string {
  switch (source) {
    case DataSource.ZILLOW:
      return 'Home values, rent prices, and market trends from Zillow Research';
    case DataSource.REALTOR:
      return 'Real estate market statistics and economic indicators from Realtor.com';
    case DataSource.CENSUS:
      return 'Demographic, housing, and economic data from US Census Bureau';
    case DataSource.MLS:
      return 'Multiple Listing Service data with local market statistics';
    case DataSource.MOCK:
      return 'Development/testing data provider';
    case DataSource.AGGREGATED:
      return 'Combined data from multiple sources';
    default:
      return 'Market data provider';
  }
}

/**
 * Data Sources Status Component
 */
export const DataSourcesStatus: React.FC<DataSourcesStatusProps> = ({
  sourceStatuses,
  sourceMetadata,
  availableSources,
  testing,
  onTestConnections,
  error,
}) => {
  // Get all data sources (excluding MOCK and AGGREGATED for display)
  const allSources = [
    DataSource.ZILLOW,
    DataSource.REALTOR,
    DataSource.CENSUS,
    DataSource.MLS,
  ];

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Data Sources Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor the availability and health of real estate data providers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onTestConnections}
          disabled={testing}
          sx={{
            backgroundColor: brandColors.primary,
            '&:hover': {
              backgroundColor: brandColors.primaryDark,
            },
          }}
        >
          {testing ? 'Testing...' : 'Test Connections'}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading Progress */}
      {testing && <LinearProgress sx={{ mb: 3 }} />}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {availableSources.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Sources
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {Array.from(sourceStatuses.values()).filter(Boolean).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="error.main">
                {Array.from(sourceStatuses.values()).filter(s => !s).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disconnected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Sources List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Data Source Details
          </Typography>
          <List>
            {allSources.map((source, index) => {
              const status = sourceStatuses.get(source);
              const metadata = sourceMetadata.get(source);
              const isAvailable = availableSources.includes(source);

              return (
                <React.Fragment key={source}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isAvailable
                            ? 'success.light'
                            : 'action.disabledBackground',
                          color: isAvailable ? 'success.dark' : 'text.disabled',
                        }}
                      >
                        {getSourceIcon(source)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {getSourceDisplayName(source)}
                          </Typography>
                          {status !== undefined && (
                            <Chip
                              size="small"
                              icon={status ? <CheckCircleIcon /> : <ErrorIcon />}
                              label={status ? 'Connected' : 'Disconnected'}
                              color={status ? 'success' : 'error'}
                              variant="outlined"
                            />
                          )}
                          {isAvailable && (
                            <Chip
                              size="small"
                              label="Available"
                              color="success"
                              variant="filled"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {getSourceDescription(source)}
                          </Typography>
                          {metadata && (
                            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                              {metadata.apiVersion && (
                                <Chip
                                  size="small"
                                  label={`API ${metadata.apiVersion}`}
                                  variant="outlined"
                                />
                              )}
                              {metadata.lastSuccessfulFetch && (
                                <Chip
                                  size="small"
                                  label={`Last fetch: ${new Date(metadata.lastSuccessfulFetch).toLocaleString()}`}
                                  variant="outlined"
                                />
                              )}
                              {metadata.rateLimit && (
                                <Tooltip
                                  title={`${metadata.rateLimit.requestsRemaining}/${metadata.rateLimit.requestsPerMinute} requests remaining`}
                                >
                                  <Chip
                                    size="small"
                                    label="Rate Limited"
                                    variant="outlined"
                                    color="warning"
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> All data sources currently use mock data for development.
          To enable real API connections, configure API keys in your environment variables:
        </Typography>
        <Box component="ul" sx={{ mt: 1, mb: 0 }}>
          <li><code>REACT_APP_ZILLOW_API_KEY</code></li>
          <li><code>REACT_APP_REALTOR_API_KEY</code></li>
          <li><code>REACT_APP_CENSUS_API_KEY</code> (optional, Census is public)</li>
          <li><code>REACT_APP_MLS_API_KEY</code></li>
        </Box>
      </Alert>
    </Box>
  );
};

export default DataSourcesStatus;

