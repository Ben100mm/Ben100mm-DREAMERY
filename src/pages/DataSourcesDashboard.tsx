/**
 * Data Sources Dashboard Page
 * 
 * Main page for managing and exploring the Data Integrations framework
 * Provides a comprehensive interface for:
 * - Monitoring data source status
 * - Fetching and exploring market data
 * - Testing connections
 * - Comparing data from multiple sources
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  CloudQueue as CloudQueueIcon,
  Info as InfoIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { DataSourcesStatus, MarketDataExplorer } from '../components/DataIntegrations';
import { useDataIntegrations } from '../hooks/useDataIntegrations';
import { AggregationStrategy } from '../services/dataIntegrations';
import { brandColors } from '../theme';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * Data Sources Dashboard Page
 */
export const DataSourcesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  // Use data integrations hook with weighted average strategy
  const {
    marketData,
    availableSources,
    sourceStatuses,
    sourceMetadata,
    loading,
    testing,
    error,
    fetchMarketData,
    testAllConnections,
    clearData,
  } = useDataIntegrations({
    strategy: AggregationStrategy.WEIGHTED_AVERAGE,
    minimumSources: 1,
    autoTest: true, // Auto-test connections on mount
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Link>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <CloudQueueIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Data Sources
            </Typography>
          </Breadcrumbs>

          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                Data Sources Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Real Estate Market Data Integration Framework
              </Typography>
              <Box display="flex" gap={1} mt={2}>
                <Chip
                  label={`${availableSources.length} Active Sources`}
                  color="success"
                  size="small"
                />
                <Chip
                  label="Aggregated Analysis"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label="Real-time Updates"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={() => setHelpDialogOpen(true)}
            >
              Documentation
            </Button>
          </Box>
        </Box>

        {/* Info Banner */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Data Integrations Framework</AlertTitle>
          This dashboard provides access to the comprehensive data integrations framework that
          aggregates real estate market data from multiple sources including Zillow, Realtor.com,
          US Census Bureau, and local MLS services. All data is intelligently combined using
          weighted averaging and quality assessment algorithms.
        </Alert>

        {/* Main Content */}
        <Paper elevation={3}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
            }}
          >
            <Tab label="Source Status" />
            <Tab label="Market Data Explorer" />
            <Tab label="API Documentation" />
          </Tabs>

          {/* Source Status Tab */}
          <TabPanel value={activeTab} index={0}>
            <Box px={3}>
              <DataSourcesStatus
                sourceStatuses={sourceStatuses}
                sourceMetadata={sourceMetadata}
                availableSources={availableSources}
                testing={testing}
                onTestConnections={testAllConnections}
                error={error}
              />
            </Box>
          </TabPanel>

          {/* Market Data Explorer Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box px={3}>
              <MarketDataExplorer
                marketData={marketData}
                loading={loading}
                error={error}
                onFetchData={fetchMarketData}
                onClearData={clearData}
              />
            </Box>
          </TabPanel>

          {/* API Documentation Tab */}
          <TabPanel value={activeTab} index={2}>
            <Box px={3}>
              <Typography variant="h5" gutterBottom>
                API Documentation
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                The Data Integrations framework provides a unified interface for accessing multiple
                real estate data sources. Below are the key components and usage examples.
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* React Hook Documentation */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  React Hook: useDataIntegrations
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="body2" component="pre" fontFamily="monospace">
{`import { useDataIntegrations } from '../hooks/useDataIntegrations';

function MyComponent() {
  const {
    marketData,
    loading,
    error,
    fetchMarketData,
    availableSources
  } = useDataIntegrations({
    strategy: AggregationStrategy.WEIGHTED_AVERAGE,
    minimumSources: 1,
    autoTest: true
  });

  const handleFetch = async () => {
    await fetchMarketData('94102');
  };

  return (
    <div>
      <button onClick={handleFetch}>
        Fetch Market Data
      </button>
      {marketData && (
        <p>Median Rent: $\{marketData.medianRent}</p>
      )}
    </div>
  );
}`}
                  </Typography>
                </Paper>
              </Box>

              {/* Direct API Usage */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Direct API Usage
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="body2" component="pre" fontFamily="monospace">
{`import { 
  DataAggregator, 
  AggregationStrategy 
} from '../services/dataIntegrations';

// Create aggregator instance
const aggregator = new DataAggregator({
  strategy: AggregationStrategy.WEIGHTED_AVERAGE,
  minimumSources: 2,
});

// Fetch aggregated data
const data = await aggregator.fetchAggregatedData('94102');

console.log('Median Rent:', data.medianRent);
console.log('Sources:', data.sources);
console.log('Confidence:', data.confidence);

// Test connections
const statuses = await aggregator.testAllConnections();
console.log('Zillow:', statuses.get(DataSource.ZILLOW));

// Get available adapters
const available = await aggregator.getAvailableAdapters();
console.log('Available sources:', available);`}
                  </Typography>
                </Paper>
              </Box>

              {/* Data Sources */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Available Data Sources
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Zillow Research Data"
                      secondary="Home values (ZHVI), rent prices (ZRI), market trends, and forecasts"
                    />
                    <Chip label="Priority: 1" size="small" variant="outlined" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Realtor.com Economic Data"
                      secondary="Market statistics, inventory data, days on market, and hotness scores"
                    />
                    <Chip label="Priority: 2" size="small" variant="outlined" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="US Census Bureau"
                      secondary="Demographics, housing statistics, income data, and economic indicators"
                    />
                    <Chip label="Priority: 3" size="small" variant="outlined" />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Local MLS Data"
                      secondary="Multiple Listing Service data with local market statistics"
                    />
                    <Chip label="Priority: 4" size="small" variant="outlined" />
                  </ListItem>
                </List>
              </Box>

              {/* Configuration */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Environment Configuration
                </Typography>
                <Alert severity="warning">
                  <AlertTitle>API Keys Required</AlertTitle>
                  <Typography variant="body2" paragraph>
                    To enable real API connections, configure the following environment variables:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <code>REACT_APP_ZILLOW_API_KEY</code> - Zillow API credentials
                    </ListItem>
                    <ListItem>
                      <code>REACT_APP_REALTOR_API_KEY</code> - Realtor.com API credentials
                    </ListItem>
                    <ListItem>
                      <code>REACT_APP_CENSUS_API_KEY</code> - Optional (Census is public)
                    </ListItem>
                    <ListItem>
                      <code>REACT_APP_MLS_API_KEY</code> - Local MLS API credentials
                    </ListItem>
                  </List>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Without API keys, the framework will use mock data for development and testing.
                  </Typography>
                </Alert>
              </Box>

              {/* Aggregation Strategies */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Aggregation Strategies
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="WEIGHTED_AVERAGE"
                      secondary="Combines data using configurable weights and quality scores (recommended)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="PRIORITY"
                      secondary="Uses highest priority source for each field"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="BEST_QUALITY"
                      secondary="Selects source with highest overall quality score"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="CONSENSUS"
                      secondary="Uses median values across all sources"
                    />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* Help Dialog */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Data Integrations Framework Help</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            The Data Integrations framework provides a unified interface for accessing real estate
            market data from multiple authoritative sources.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Key Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Multi-Source Aggregation"
                secondary="Combines data from Zillow, Realtor.com, Census, and MLS"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Intelligent Fallback"
                secondary="Automatically uses alternative sources if primary sources fail"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Quality Assessment"
                secondary="Evaluates completeness, freshness, and accuracy of data"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Caching & Rate Limiting"
                secondary="Built-in caching and rate limit management"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Type-Safe API"
                secondary="Full TypeScript support with comprehensive type definitions"
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            For detailed documentation, see the API Documentation tab or refer to the code
            in <code>src/services/dataIntegrations/</code>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataSourcesDashboard;

