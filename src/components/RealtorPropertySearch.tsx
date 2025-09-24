/**
 * Example component demonstrating Realtor.com integration
 * Shows how to use the new parsers and services
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
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search,
  Clear,
  LocationOn
} from '@mui/icons-material';
import { useRealtorData } from '../hooks/useRealtorData';
import RealtorPropertyCard from './RealtorPropertyCard';
import { RealtorSearchParams, PropertyFilters } from '../types/realtor';

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

const RealtorPropertySearch: React.FC = () => {
  const {
    properties,
    loading,
    error,
    total,
    searchProperties,
    clearError,
    clearProperties
  } = useRealtorData();

  const [searchParams, setSearchParams] = useState<RealtorSearchParams>({
    location: 'San Francisco, CA',
    listing_type: 'for_sale',
    min_price: 500000,
    max_price: 2000000,
    beds: 2,
    limit: 20
  });

  const [filters, setFilters] = useState<PropertyFilters>({
    priceRange: { min: 500000, max: 2000000 },
    bedrooms: { min: 2, max: 5 },
    bathrooms: { min: 1, max: 3 },
    squareFootage: { min: 1000, max: 3000 }
  });

  const handleSearch = async () => {
    clearError();
    await searchProperties(searchParams);
  };

  const handleClear = () => {
    clearProperties();
    setSearchParams({
      location: '',
      listing_type: 'for_sale',
      limit: 20
    });
  };

  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property);
    // Add navigation or modal logic here
  };

  const handleToggleFavorite = (propertyId: string) => {
    console.log('Toggle favorite:', propertyId);
    // Add favorite logic here
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Property Search
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for properties using real-time data from Realtor.com
      </Typography>

      <SearchContainer elevation={2}>
        <Typography variant="h6" gutterBottom>
          Search Properties
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
        </SearchForm>

        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mt: 2 }}>
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
              Found {total} properties
            </Typography>
            
            <PropertyGrid container spacing={3}>
              {properties.map((property) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={property.property_id}>
                  <RealtorPropertyCard
                    property={property}
                    onPropertyClick={handlePropertyClick}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Grid>
              ))}
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

export default RealtorPropertySearch;
