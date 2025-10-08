/**
 * Market Data Explorer Component
 * 
 * Interactive component for exploring market data from multiple sources:
 * - Fetch data by zip code
 * - View aggregated results
 * - Compare data across sources
 * - See quality metrics
 * - Visualize trends
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import {
  AggregatedMarketData,
  DataSource,
  StandardMarketData,
} from '../../services/dataIntegrations';
import { brandColors } from '../../theme';
import { formatCurrency } from '../UXComponents';

export interface MarketDataExplorerProps {
  /**
   * Current market data
   */
  marketData: AggregatedMarketData | null;
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Error message
   */
  error: string | null;
  
  /**
   * Callback to fetch data
   */
  onFetchData: (zipCode: string, forceRefresh?: boolean) => void;
  
  /**
   * Callback to clear data
   */
  onClearData: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`market-data-tabpanel-${index}`}
      aria-labelledby={`market-data-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Format percentage
 */
function formatPercentage(value: number): string {
  const formatted = value.toFixed(2);
  return value >= 0 ? `+${formatted}%` : `${formatted}%`;
}

/**
 * Get trend icon
 */
function getTrendIcon(value: number): React.ReactElement {
  if (value > 0) {
    return <TrendingUpIcon color="success" />;
  } else if (value < 0) {
    return <TrendingDownIcon color="error" />;
  }
  return <></>;
}

/**
 * Market Data Explorer Component
 */
export const MarketDataExplorer: React.FC<MarketDataExplorerProps> = ({
  marketData,
  loading,
  error,
  onFetchData,
  onClearData,
}) => {
  const [zipCode, setZipCode] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleSearch = () => {
    if (zipCode.trim()) {
      onFetchData(zipCode.trim());
    }
  };

  const handleRefresh = () => {
    if (zipCode.trim()) {
      onFetchData(zipCode.trim(), true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Explore Market Data
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter a ZIP code to fetch aggregated market data from multiple sources
          </Typography>
          
          <Box display="flex" gap={2} mt={2} alignItems="flex-start">
            <TextField
              fullWidth
              label="ZIP Code"
              placeholder="e.g., 94102"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading || !zipCode.trim()}
              sx={{
                minWidth: 120,
                backgroundColor: brandColors.primary,
                '&:hover': {
                  backgroundColor: brandColors.primaryDark,
                },
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            {marketData && (
              <Button
                variant="outlined"
                onClick={handleRefresh}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                Refresh
              </Button>
            )}
            {marketData && (
              <IconButton onClick={onClearData} color="default">
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Loading Progress */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results Section */}
      {marketData && (
        <Box>
          {/* Header Info */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h5">
                {marketData.city ? `${marketData.city}, ${marketData.state}` : marketData.zipCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ZIP Code: {marketData.zipCode}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Chip
                label={`${marketData.sources.length} Sources`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`${marketData.confidence}% Confidence`}
                color={marketData.confidence > 75 ? 'success' : 'warning'}
                variant="outlined"
              />
              <Chip
                label={marketData.aggregationStrategy.replace('_', ' ')}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Tabs */}
          <Paper>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Overview" />
              <Tab label="Source Comparison" />
              <Tab label="Quality Metrics" />
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                {/* Financial Metrics */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Financial Metrics
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Median Rent</strong></TableCell>
                          <TableCell align="right">
                            {formatCurrency(marketData.medianRent)}/mo
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Median Price</strong></TableCell>
                          <TableCell align="right">
                            {formatCurrency(marketData.medianPrice)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <strong>Rent Growth (12mo)</strong>
                              {getTrendIcon(marketData.rentGrowth12mo)}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={formatPercentage(marketData.rentGrowth12mo)}
                              size="small"
                              color={marketData.rentGrowth12mo > 0 ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <strong>Appreciation Rate (12mo)</strong>
                              {getTrendIcon(marketData.appreciationRate12mo)}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={formatPercentage(marketData.appreciationRate12mo)}
                              size="small"
                              color={marketData.appreciationRate12mo > 0 ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Market Dynamics */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Market Dynamics
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Vacancy Rate</strong></TableCell>
                          <TableCell align="right">
                            {marketData.vacancyRate.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Days on Market</strong></TableCell>
                          <TableCell align="right">
                            {Math.round(marketData.daysOnMarket)} days
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Foreclosure Rate</strong></TableCell>
                          <TableCell align="right">
                            {marketData.foreclosureRate.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Quality Metrics */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Quality of Life
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            Economic Diversity
                          </Typography>
                          <Typography variant="h5">
                            {marketData.economicDiversityIndex.toFixed(0)}/100
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            Crime Safety Score
                          </Typography>
                          <Typography variant="h5">
                            {marketData.crimeSafetyScore.toFixed(0)}/100
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            School Rating
                          </Typography>
                          <Typography variant="h5">
                            {marketData.schoolRating.toFixed(1)}/10
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Metadata */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary">
                    Last Updated: {new Date(marketData.dateUpdated).toLocaleString()} •
                    Data Sources: {marketData.sources.map(s => s.toString()).join(', ')}
                  </Typography>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Source Comparison Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" gutterBottom>
                Source-by-Source Comparison
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Compare raw data from each source before aggregation
              </Typography>

              {marketData.sources.map((source) => {
                const sourceData = marketData.sourceData.get(source);
                if (!sourceData) return null;

                return (
                  <Accordion key={source}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={2} width="100%">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {source.toString().toUpperCase()}
                        </Typography>
                        <Chip
                          label={`Confidence: ${sourceData.confidence || 'N/A'}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell><strong>Median Rent</strong></TableCell>
                              <TableCell align="right">
                                {sourceData.medianRent
                                  ? formatCurrency(sourceData.medianRent)
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Median Price</strong></TableCell>
                              <TableCell align="right">
                                {sourceData.medianPrice
                                  ? formatCurrency(sourceData.medianPrice)
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Rent Growth</strong></TableCell>
                              <TableCell align="right">
                                {sourceData.rentGrowth12mo
                                  ? formatPercentage(sourceData.rentGrowth12mo)
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Appreciation Rate</strong></TableCell>
                              <TableCell align="right">
                                {sourceData.appreciationRate12mo
                                  ? formatPercentage(sourceData.appreciationRate12mo)
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Vacancy Rate</strong></TableCell>
                              <TableCell align="right">
                                {sourceData.vacancyRate
                                  ? `${sourceData.vacancyRate.toFixed(2)}%`
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Days on Market</strong></TableCell>
                              <TableCell align="right">
                                {sourceData.daysOnMarket
                                  ? `${Math.round(sourceData.daysOnMarket)} days`
                                  : 'N/A'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </TabPanel>

            {/* Quality Metrics Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Data Quality Assessment
              </Typography>
              
              {Array.from(marketData.qualityScores.entries()).map(([source, quality]) => (
                <Card key={source} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {source.toString().toUpperCase()}
                      </Typography>
                      <Chip
                        label={`Overall: ${quality.overall.toFixed(0)}%`}
                        color={
                          quality.overall > 75
                            ? 'success'
                            : quality.overall > 50
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Completeness
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={quality.completeness}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                          />
                          <Typography variant="body2">
                            {quality.completeness.toFixed(0)}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Freshness
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={quality.freshness}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                          />
                          <Typography variant="body2">
                            {quality.freshness.toFixed(0)}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Accuracy
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={quality.accuracy}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                          />
                          <Typography variant="body2">
                            {quality.accuracy.toFixed(0)}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {quality.warnings.length > 0 && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        {quality.warnings.map((warning, index) => (
                          <Typography key={index} variant="body2">
                            • {warning}
                          </Typography>
                        ))}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabPanel>
          </Paper>
        </Box>
      )}

      {/* Empty State */}
      {!marketData && !loading && !error && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <AssessmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Data Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter a ZIP code above to fetch and explore market data
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MarketDataExplorer;

