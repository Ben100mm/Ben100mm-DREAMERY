import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Chip,
  Popper,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Map as MapIcon,
  History as HistoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const HeroContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
              url('/hero-background.jpg') center/cover;
  color: white;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 2rem;
  z-index: 2;
`;

const SearchContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledAutocomplete = styled(Autocomplete)`
  .MuiOutlinedInput-root {
    background: white;
    border-radius: 8px;
  }
`;

const SearchButton = styled(Button)`
  background-color: #1a365d !important;
  color: white !important;
  padding: 12px 24px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 1rem !important;
  
  &:hover {
    background-color: #0d2340 !important;
  }
`;

interface SearchResult {
  id: string;
  title: string;
  type: 'property' | 'location' | 'recent';
}

const mockSearchResults: SearchResult[] = [
  { id: '1', title: 'Downtown Condos', type: 'property' },
  { id: '2', title: 'Suburban Homes', type: 'property' },
  { id: '3', title: 'Waterfront Properties', type: 'property' },
  { id: '4', title: 'Downtown, City Center', type: 'location' },
  { id: '5', title: 'Suburban Heights', type: 'location' },
  { id: '6', title: 'Harbor District', type: 'location' },
  { id: '7', title: 'Historic District', type: 'location' },
  { id: '8', title: 'Uptown Luxury', type: 'location' },
];

const Hero: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const savedHistory = localStorage.getItem('dreamery_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add to search history
    const newHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('dreamery_search_history', JSON.stringify(newHistory));
    
    setLoading(false);
    setSnackbar({ open: true, message: `Searching for: ${searchTerm}` });
  };

  const handleSearchSubmit = () => {
    handleSearch(searchValue);
  };

  const handleHistoryClick = (item: string) => {
    setSearchValue(item);
    handleSearch(item);
  };

  const handleRemoveHistory = (itemToRemove: string) => {
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    setSearchHistory(newHistory);
    localStorage.setItem('dreamery_search_history', JSON.stringify(newHistory));
  };

  const allSearchResults = [
    ...searchHistory.map(item => ({ id: `history-${item}`, title: item, type: 'recent' as const })),
    ...mockSearchResults
  ];

  return (
    <HeroContainer>
      <HeroContent>
        <h1 style={{ fontSize: isMobile ? '2.5rem' : '4rem', margin: '0 0 1rem 0', fontWeight: 700 }}>
          Find Your Dream Home
        </h1>
        <p style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', margin: '0 0 2rem 0', opacity: 0.9 }}>
          Discover properties that match your lifestyle and budget
        </p>
        
        <SearchContainer>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <StyledAutocomplete
              freeSolo
              options={allSearchResults}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.title
              }
              value={searchValue}
              onChange={(_, newValue) => {
                if (typeof newValue === 'string') {
                  setSearchValue(newValue);
                } else if (newValue) {
                  setSearchValue(newValue.title);
                  if (newValue.type === 'recent') {
                    handleHistoryClick(newValue.title);
                  }
                }
              }}
              onInputChange={(_, newInputValue) => {
                setSearchValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <MapIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                    endAdornment: (
                      <>
                        {loading && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {option.type === 'recent' && <HistoryIcon sx={{ mr: 1, fontSize: 16 }} />}
                    <Box sx={{ flexGrow: 1 }}>{option.title}</Box>
                    {option.type === 'recent' && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveHistory(option.title);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              )}
              PopperComponent={(props) => (
                <Popper
                  {...props}
                  placement="bottom-start"
                  modifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8],
                      },
                    },
                  ]}
                />
              )}
            />
            
            <SearchButton
              variant="contained"
              onClick={handleSearchSubmit}
              disabled={loading || !searchValue.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            >
              Search
            </SearchButton>
          </Box>
          
          {searchHistory.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ width: '100%', mb: 1 }}>
                Recent searches:
              </Typography>
              {searchHistory.slice(0, 3).map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  size="small"
                  onClick={() => handleHistoryClick(item)}
                  onDelete={() => handleRemoveHistory(item)}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          )}
        </SearchContainer>
      </HeroContent>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </HeroContainer>
  );
};

export default Hero; 