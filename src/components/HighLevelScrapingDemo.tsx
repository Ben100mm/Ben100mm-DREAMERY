/**
 * High-level scraping API demo component
 * Demonstrates the comprehensive scraping API with validation
 */

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Search,
  Clear,
  LocationOn,
  ExpandMore,
  Home,
  Business,
  School,
  AttachMoney,
  CalendarToday,
  Info,
  Security,
  Speed,
  DataObject,
  TableChart,
  Code
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { realtorService } from '../services/realtorService';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

const SearchForm = styled(Box)({
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginBottom: '16px',
});

const ResultsContainer = styled(Box)({
  marginTop: '24px',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '48px',
});

const EmptyState = styled(Box)({
  textAlign: 'center',
  padding: '48px',
  color: 'text.secondary',
});

const DataContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
}));

const HighLevelScrapingDemo: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [scrapeParams, setScrapeParams] = useState({
    location: 'San Francisco, CA',
    listing_type: 'for_sale',
    return_type: 'pandas',
    property_type: ['single_family', 'condos'],
    radius: 5.0,
    mls_only: false,
    past_days: 30,
    foreclosure: false,
    extra_property_data: true,
    exclude_pending: false,
    limit: 20
  });

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await realtorService.scrapeProperties(scrapeParams);
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Scraping failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scraping failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setData(null);
    setScrapeParams({
      location: '',
      listing_type: 'for_sale',
      return_type: 'pandas',
      property_type: [],
      radius: 5.0,
      mls_only: false,
      past_days: 30,
      foreclosure: false,
      extra_property_data: true,
      exclude_pending: false,
      limit: 20
    });
  };

  const renderPandasData = (data: any[]) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.slice(0, 10).map((column) => (
                <TableCell key={column}>
                  <Typography variant="subtitle2">
                    {column.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, 10).map((row, index) => (
              <TableRow key={index}>
                {columns.slice(0, 10).map((column) => (
                  <TableCell key={column}>
                    <Typography variant="body2">
                      {row[column] || 'N/A'}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderPydanticData = (data: any[]) => {
    if (!data || data.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        {data.slice(0, 5).map((property, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {property.property_id}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Price:</strong> {property.list_price ? `$${property.list_price.toLocaleString()}` : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> {property.address?.formatted_address || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Beds:</strong> {property.description?.beds || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Baths:</strong> {property.description?.baths_full || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>SQFT:</strong> {property.description?.sqft || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Status:</strong> {property.status || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>MLS:</strong> {property.mls || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Agent:</strong> {property.advertisers?.agent?.name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>County:</strong> {property.county || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Days on MLS:</strong> {property.days_on_mls || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    );
  };

  const renderRawData = (data: any) => {
    return (
      <DataContainer>
        <Typography variant="h6" gutterBottom>
          <Code fontSize="small" sx={{ mr: 0.5 }} />
          Raw Data
        </Typography>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </DataContainer>
    );
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        High-Level Scraping API Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Demonstrates the comprehensive scraping API with validation, multiple return types, and data processing
      </Typography>

      <SearchContainer elevation={2}>
        <Typography variant="h6" gutterBottom>
          <DataObject fontSize="small" sx={{ mr: 0.5 }} />
          Scraping Parameters
        </Typography>
        
        <SearchForm>
          <TextField
            label="Location"
            value={scrapeParams.location}
            onChange={(e) => setScrapeParams(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter city, state, or address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: '300px' }}
          />
          
          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Listing Type</InputLabel>
            <Select
              value={scrapeParams.listing_type}
              onChange={(e) => setScrapeParams(prev => ({ ...prev, listing_type: e.target.value }))}
              label="Listing Type"
            >
              <MenuItem value="for_sale">For Sale</MenuItem>
              <MenuItem value="for_rent">For Rent</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel>Return Type</InputLabel>
            <Select
              value={scrapeParams.return_type}
              onChange={(e) => setScrapeParams(prev => ({ ...prev, return_type: e.target.value }))}
              label="Return Type"
            >
              <MenuItem value="pandas">Pandas DataFrame</MenuItem>
              <MenuItem value="pydantic">Pydantic Models</MenuItem>
              <MenuItem value="raw">Raw Data</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Radius (miles)"
            type="number"
            value={scrapeParams.radius}
            onChange={(e) => setScrapeParams(prev => ({ 
              ...prev, 
              radius: e.target.value ? parseFloat(e.target.value) : 5.0 
            }))}
            placeholder="5.0"
            sx={{ width: '120px' }}
          />
          
          <TextField
            label="Past Days"
            type="number"
            value={scrapeParams.past_days}
            onChange={(e) => setScrapeParams(prev => ({ 
              ...prev, 
              past_days: e.target.value ? parseInt(e.target.value) : 30 
            }))}
            placeholder="30"
            sx={{ width: '120px' }}
          />

          <TextField
            label="Limit"
            type="number"
            value={scrapeParams.limit}
            onChange={(e) => setScrapeParams(prev => ({ 
              ...prev, 
              limit: e.target.value ? parseInt(e.target.value) : 20 
            }))}
            placeholder="20"
            sx={{ width: '100px' }}
          />
        </SearchForm>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">
              <Security fontSize="small" sx={{ mr: 0.5 }} />
              Advanced Options
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scrapeParams.mls_only}
                    onChange={(e) => setScrapeParams(prev => ({ 
                      ...prev, 
                      mls_only: e.target.checked 
                    }))}
                  />
                }
                label="MLS Only"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scrapeParams.extra_property_data}
                    onChange={(e) => setScrapeParams(prev => ({ 
                      ...prev, 
                      extra_property_data: e.target.checked 
                    }))}
                  />
                }
                label="Extra Property Data"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scrapeParams.exclude_pending}
                    onChange={(e) => setScrapeParams(prev => ({ 
                      ...prev, 
                      exclude_pending: e.target.checked 
                    }))}
                  />
                }
                label="Exclude Pending"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scrapeParams.foreclosure}
                    onChange={(e) => setScrapeParams(prev => ({ 
                      ...prev, 
                      foreclosure: e.target.checked 
                    }))}
                  />
                }
                label="Include Foreclosures"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleScrape}
            disabled={loading}
            sx={{ minWidth: '120px' }}
          >
            {loading ? 'Scraping...' : 'Scrape Properties'}
          </Button>
          
          <IconButton
            onClick={handleClear}
            disabled={loading}
            title="Clear results"
          >
            <Clear />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </SearchContainer>

      <ResultsContainer>
        {loading && (
          <LoadingContainer>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              <Speed fontSize="small" sx={{ mr: 0.5 }} />
              Scraping properties with high-level API...
            </Typography>
          </LoadingContainer>
        )}

        {!loading && data && (
          <>
            <Typography variant="h6" gutterBottom>
              <TableChart fontSize="small" sx={{ mr: 0.5 }} />
              Scraping Results ({Array.isArray(data) ? data.length : 'N/A'} properties)
            </Typography>
            
            {scrapeParams.return_type === 'pandas' && renderPandasData(data)}
            {scrapeParams.return_type === 'pydantic' && renderPydanticData(data)}
            {scrapeParams.return_type === 'raw' && renderRawData(data)}
          </>
        )}

        {!loading && !data && !error && (
          <EmptyState>
            <Typography variant="h6" gutterBottom>
              No data scraped yet
            </Typography>
            <Typography variant="body2">
              Configure your parameters and click "Scrape Properties" to get started
            </Typography>
          </EmptyState>
        )}
      </ResultsContainer>
    </Box>
  );
};

export default HighLevelScrapingDemo;
