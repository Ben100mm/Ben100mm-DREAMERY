import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  TextField, 
  IconButton, 
  Autocomplete, 
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Box,
  Chip,
  Popper,
  Paper
} from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';

const HeroContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/hero-background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 2rem;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  margin-top: -5%;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  padding: 0.75rem;
  max-width: 600px;
  margin: 0 auto;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

interface SearchResult {
  id: string;
  description: string;
  type: 'address' | 'neighborhood' | 'city' | 'zip';
  mainText: string;
  secondaryText: string;
}

interface SearchHistory {
  timestamp: number;
  query: string;
  type: SearchResult['type'];
}

const StyledAutocomplete = styled(Autocomplete<SearchResult | string, true, false, false>)`
  flex-grow: 1;
  .MuiInputBase-root {
    color: #1a365d;
    font-weight: 600;
    padding-right: 65px !important;
    &::before, &::after {
      display: none;
    }
    input {
      font-size: 1.1rem;
      &::placeholder {
        color: #1a365d;
        opacity: 1;
        font-weight: 500;
      }
    }
  }
`;

const LocationButton = styled(IconButton)`
  color: #1a365d;
  opacity: 0.9;
  &:hover {
    opacity: 1;
    background-color: rgba(26, 54, 93, 0.1);
  }
`;

const SearchHistoryContainer = styled(Paper)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HistoryChip = styled(Chip)`
  margin: 4px;
  background: rgba(26, 54, 93, 0.1);
  &:hover {
    background: rgba(26, 54, 93, 0.2);
  }
`;

// Mock data for demonstration
const mockSearchResults: SearchResult[] = [
  { id: '1', description: 'New York, NY', type: 'city', mainText: 'New York', secondaryText: 'NY' },
  { id: '2', description: 'Los Angeles, CA', type: 'city', mainText: 'Los Angeles', secondaryText: 'CA' },
  { id: '3', description: 'Chicago, IL', type: 'city', mainText: 'Chicago', secondaryText: 'IL' },
  { id: '4', description: '90210, Beverly Hills', type: 'zip', mainText: '90210', secondaryText: 'Beverly Hills' },
  { id: '5', description: 'Manhattan, New York', type: 'neighborhood', mainText: 'Manhattan', secondaryText: 'New York' },
];

const Hero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [geoLocationError, setGeoLocationError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async (value: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const filtered = mockSearchResults.filter(result =>
        result.description.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.length >= 2) {
      handleSearch(value);
    } else {
      setOptions([]);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setGeoLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Simulate reverse geocoding API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setSearchValue('Current Location');
          setGeoLocationError(null);
        } catch (error) {
          setGeoLocationError('Failed to get location details');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setGeoLocationError('Failed to get your location');
        setLoading(false);
      }
    );
  };

  const addToHistory = (query: string, type: SearchResult['type']) => {
    const newHistory = [{
      timestamp: Date.now(),
      query,
      type
    }, ...searchHistory.slice(0, 4)];
    setSearchHistory(newHistory);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <HeroContainer>
      <Overlay />
      <Content>
        <Title>It Starts with a Home.</Title>
        <SearchContainer style={{ position: 'relative' }}>
          <StyledAutocomplete
            freeSolo
            options={options}
            loading={loading}
            inputValue={searchValue}
            onInputChange={(event, value) => setSearchValue(value)}
            onChange={(event, value) => {
              if (value && typeof value !== 'string') {
                addToHistory(value.description, value.type);
              } else if (value) {
                addToHistory(value, 'address');
              }
            }}
            filterOptions={(x) => x}
            getOptionLabel={(option: SearchResult | string) => 
              typeof option === 'string' ? option : option.description
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder={isMobile ? "Search location..." : "Enter an address, neighborhood, city, or ZIP code"}
                onChange={handleInputChange}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            renderOption={(props, option: SearchResult | string) => {
              if (typeof option === 'string') {
                return (
                  <Box component="li" {...props}>
                    <LocationOnIcon style={{ marginRight: 8 }} />
                    {option}
                  </Box>
                );
              }
              return (
                <Box component="li" {...props}>
                  <LocationOnIcon style={{ marginRight: 8 }} />
                  <Box>
                    <Box component="span" sx={{ fontWeight: 600 }}>{option.mainText}</Box>
                    <Box component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                      {option.secondaryText}
                    </Box>
                  </Box>
                </Box>
              );
            }}
            PopperComponent={(props) => (
              <Popper {...props} style={{ width: '100%' }} placement="bottom-start" />
            )}
          />
          <LocationButton 
            onClick={handleLocationClick}
            disabled={loading}
          >
            <LocationOnIcon />
          </LocationButton>
          <IconButton 
            color="primary"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? <CloseIcon /> : <HistoryIcon />}
          </IconButton>
          {showHistory && searchHistory.length > 0 && (
            <SearchHistoryContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box component="span" sx={{ fontWeight: 600 }}>Recent Searches</Box>
                <IconButton size="small" onClick={clearHistory}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {searchHistory.map((item, index) => (
                  <HistoryChip
                    key={index}
                    label={item.query}
                    onClick={() => setSearchValue(item.query)}
                    icon={<HistoryIcon />}
                  />
                ))}
              </Box>
            </SearchHistoryContainer>
          )}
        </SearchContainer>
      </Content>
      <Snackbar
        open={!!geoLocationError}
        autoHideDuration={6000}
        onClose={() => setGeoLocationError(null)}
      >
        <Alert 
          onClose={() => setGeoLocationError(null)} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {geoLocationError}
        </Alert>
      </Snackbar>
    </HeroContainer>
  );
};

export default Hero;