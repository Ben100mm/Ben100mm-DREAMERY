/**
 * Comprehensive property search component using enhanced GraphQL queries
 * Demonstrates maximum data extraction capabilities
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
  Divider
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
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRealtorData } from '../hooks/useRealtorData';
import { Property, RealtorSearchParams } from '../types/realtor';

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

const PropertyGrid = styled(Grid)({
  marginTop: '16px',
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

const PropertyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
}));

const ComprehensivePropertySearch: React.FC = () => {
  const { searchPropertiesComprehensive } = useRealtorData();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useState<RealtorSearchParams & {
    mls_only?: boolean;
    extra_property_data?: boolean;
    exclude_pending?: boolean;
  }>({
    location: 'San Francisco, CA',
    listing_type: 'for_sale',
    min_price: 500000,
    max_price: 2000000,
    beds: 2,
    limit: 20,
    mls_only: false,
    extra_property_data: true,
    exclude_pending: false
  });

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchPropertiesComprehensive(searchParams);
      setProperties(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setProperties([]);
    setSearchParams({
      location: '',
      listing_type: 'for_sale',
      limit: 20,
      mls_only: false,
      extra_property_data: true,
      exclude_pending: false
    });
  };

  const formatPropertyForDisplay = (property: Property) => {
    const address = property.address;
    const price = property.list_price || 0;
    const sqft = property.description?.sqft || 0;

    return {
      id: property.property_id,
      price: price > 0 ? `$${price.toLocaleString()}` : 'Price not available',
      address: address ? 
        `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') :
        'Address not available',
      beds: property.description?.beds || 0,
      baths: (property.description?.baths_full || 0) + (property.description?.baths_half || 0) * 0.5,
      sqft: sqft,
      type: property.description?.type || 'Property',
      daysOnMarket: property.days_on_mls || 0,
      status: property.status || 'active',
      pricePerSqft: sqft > 0 ? Math.round(price / sqft) : 0,
      mls: property.mls,
      county: property.county,
      neighborhoods: property.neighborhoods,
      assessedValue: property.assessed_value,
      estimatedValue: property.estimated_value,
      newConstruction: property.new_construction,
      hoaFee: property.hoa_fee,
      schools: property.nearby_schools,
      advertisers: property.advertisers,
      taxHistory: property.tax_history,
      monthlyFees: property.monthly_fees,
      oneTimeFees: property.one_time_fees,
      parking: property.parking,
      terms: property.terms,
      popularity: property.popularity,
      tags: property.tags,
      details: property.details,
      petPolicy: property.pet_policy,
      flags: property.flags
    };
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Comprehensive Property Search
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for properties with maximum data extraction using enhanced GraphQL queries
      </Typography>

      <SearchContainer elevation={2}>
        <Typography variant="h6" gutterBottom>
          Search Parameters
        </Typography>
        
        <SearchForm>
          <TextField
            label="Location"
            value={searchParams.location}
            onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
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
          
          <TextField
            label="Min Price"
            type="number"
            value={searchParams.min_price || ''}
            onChange={(e) => setSearchParams(prev => ({ 
              ...prev, 
              min_price: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            placeholder="500000"
            sx={{ width: '120px' }}
          />
          
          <TextField
            label="Max Price"
            type="number"
            value={searchParams.max_price || ''}
            onChange={(e) => setSearchParams(prev => ({ 
              ...prev, 
              max_price: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            placeholder="2000000"
            sx={{ width: '120px' }}
          />
          
          <TextField
            label="Bedrooms"
            type="number"
            value={searchParams.beds || ''}
            onChange={(e) => setSearchParams(prev => ({ 
              ...prev, 
              beds: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            placeholder="2"
            sx={{ width: '100px' }}
          />
        </SearchForm>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1">Comprehensive Search Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={searchParams.mls_only || false}
                    onChange={(e) => setSearchParams(prev => ({ 
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
                    checked={searchParams.extra_property_data || false}
                    onChange={(e) => setSearchParams(prev => ({ 
                      ...prev, 
                      extra_property_data: e.target.checked 
                    }))}
                  />
                }
                label="Extra Property Data (Schools, Tax History, Popularity, etc.)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={searchParams.exclude_pending || false}
                    onChange={(e) => setSearchParams(prev => ({ 
                      ...prev, 
                      exclude_pending: e.target.checked 
                    }))}
                  />
                }
                label="Exclude Pending Properties"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: '120px' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
          
          <IconButton
            onClick={handleClear}
            disabled={loading}
            title="Clear search"
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
              Searching for properties...
            </Typography>
          </LoadingContainer>
        )}

        {!loading && properties.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Found {properties.length} properties
            </Typography>
            
            <PropertyGrid container spacing={2}>
              {properties.map((property) => {
                const display = formatPropertyForDisplay(property);
                return (
                  <Grid item xs={12} key={property.property_id}>
                    <PropertyCard elevation={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5" color="primary">
                          {display.price}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {display.newConstruction && (
                            <Chip label="New Construction" color="success" size="small" />
                          )}
                          {display.status && (
                            <Chip label={display.status} color="primary" size="small" />
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        {display.address}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                        <Typography variant="body2">
                          <Home fontSize="small" sx={{ mr: 0.5 }} />
                          {display.beds} bed{display.beds !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2">
                          <Business fontSize="small" sx={{ mr: 0.5 }} />
                          {display.baths} bath{display.baths !== 1 ? 's' : ''}
                        </Typography>
                        {display.sqft > 0 && (
                          <Typography variant="body2">
                            {display.sqft.toLocaleString()} sqft
                          </Typography>
                        )}
                        {display.pricePerSqft > 0 && (
                          <Typography variant="body2">
                            ${display.pricePerSqft}/sqft
                          </Typography>
                        )}
                      </Box>

                      <InfoSection>
                        <Typography variant="subtitle2" gutterBottom>
                          <Info fontSize="small" sx={{ mr: 0.5 }} />
                          Comprehensive Property Data
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>MLS:</strong> {display.mls || 'N/A'}
                            </Typography>
                            {display.county && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>County:</strong> {display.county}
                              </Typography>
                            )}
                            {display.neighborhoods && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Neighborhoods:</strong> {display.neighborhoods}
                              </Typography>
                            )}
                            {display.assessedValue && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Assessed Value:</strong> ${display.assessedValue.toLocaleString()}
                              </Typography>
                            )}
                            {display.estimatedValue && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Estimated Value:</strong> ${display.estimatedValue.toLocaleString()}
                              </Typography>
                            )}
                            {display.hoaFee && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>HOA Fee:</strong> ${display.hoaFee}/month
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            {display.schools && display.schools.length > 0 && (
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  <School fontSize="small" sx={{ mr: 0.5 }} />
                                  <strong>Nearby Schools:</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {display.schools.join(', ')}
                                </Typography>
                              </Box>
                            )}
                            
                            {display.tags && display.tags.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  <strong>Tags:</strong>
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {display.tags.map((tag, index) => (
                                    <Chip key={index} label={tag} size="small" variant="outlined" />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Grid>
                        </Grid>

                        {display.advertisers?.agent && (
                          <Box sx={{ mt: 2, p: 2, backgroundColor: 'primary.50', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              <Business fontSize="small" sx={{ mr: 0.5 }} />
                              Agent Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Name:</strong> {display.advertisers.agent.name}
                            </Typography>
                            {display.advertisers.agent.email && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Email:</strong> {display.advertisers.agent.email}
                              </Typography>
                            )}
                            {display.advertisers.agent.phones && display.advertisers.agent.phones.length > 0 && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Phone:</strong> {display.advertisers.agent.phones[0]}
                              </Typography>
                            )}
                            {display.advertisers.agent.state_license && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>License:</strong> {display.advertisers.agent.state_license}
                              </Typography>
                            )}
                          </Box>
                        )}

                        {display.taxHistory && display.taxHistory.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                              Tax History
                            </Typography>
                            {display.taxHistory.slice(0, 3).map((tax, index) => (
                              <Typography key={index} variant="body2" color="text.secondary">
                                {tax.year}: ${tax.tax?.toLocaleString() || 'N/A'}
                                {tax.assessment?.total && ` (Assessed: $${tax.assessment.total.toLocaleString()})`}
                              </Typography>
                            ))}
                          </Box>
                        )}

                        {display.popularity && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                              Popularity Metrics
                            </Typography>
                            {display.popularity.periods && display.popularity.periods.map((period, index) => (
                              <Typography key={index} variant="body2" color="text.secondary">
                                Last {period.last_n_days} days: {period.views_total} views, {period.clicks_total} clicks
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </InfoSection>
                    </PropertyCard>
                  </Grid>
                );
              })}
            </PropertyGrid>
          </>
        )}

        {!loading && properties.length === 0 && !error && (
          <EmptyState>
            <Typography variant="h6" gutterBottom>
              No properties found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search criteria or location
            </Typography>
          </EmptyState>
        )}
      </ResultsContainer>
    </Box>
  );
};

export default ComprehensivePropertySearch;
