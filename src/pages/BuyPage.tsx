import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Popover,
  Paper,
  Link,
} from '@mui/material';
import {
  Search,
  Favorite,
  FavoriteBorder,
  ArrowBack,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Clear,
} from '@mui/icons-material';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const FilterButton = styled(Button)`
  text-transform: none;
  color: #333;
  border: 1px solid #e0e0e0;
  background: white;
  padding: 8px 16px;
  min-width: 120px;
  &:hover {
    background: #f8f9fa;
    border-color: #c0c0c0;
  }
  &.active {
    border-color: #1a365d;
    color: #1a365d;
  }
`;

const FilterPopover = styled(Paper)`
  padding: 1.5rem;
  min-width: 300px;
  max-width: 400px;
`;

const MapContainer = styled.div`
  height: 70vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  position: relative;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #333;
  font-weight: 600;
`;

const PropertiesContainer = styled.div`
  padding: 2rem;
  background: white;
`;

const PropertyCard = styled(Card)`
  height: 100%;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PropertyImage = styled.div`
  height: 200px;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9rem;
`;

const BuyPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Filter states
  const [propertyStatus, setPropertyStatus] = useState('for-sale');
  const [priceType, setPriceType] = useState('list-price');
  const [minPrice, setMinPrice] = useState('no-min');
  const [maxPrice, setMaxPrice] = useState('no-max');
  const [minBeds, setMinBeds] = useState('any');
  const [minBaths, setMinBaths] = useState('any');
  const [homeTypes, setHomeTypes] = useState(['houses', 'townhomes', 'multi-family', 'condos', 'lots', 'apartments', 'manufactured']);
  const [listingTypes, setListingTypes] = useState(['owner-posted', 'agent-listed', 'new-construction', 'foreclosures', 'auctions']);
  const [maxHoa, setMaxHoa] = useState('any');
  const [propertyStatuses, setPropertyStatuses] = useState(['coming-soon']);
  const [parkingSpots, setParkingSpots] = useState('any');
  const [minSqft, setMinSqft] = useState('no-min');
  const [maxSqft, setMaxSqft] = useState('no-max');
  const [minLotSize, setMinLotSize] = useState('no-min');
  const [maxLotSize, setMaxLotSize] = useState('no-max');
  const [yearBuiltMin, setYearBuiltMin] = useState('');
  const [yearBuiltMax, setYearBuiltMax] = useState('');
  const [hasBasement, setHasBasement] = useState(false);
  const [singleStoryOnly, setSingleStoryOnly] = useState(false);
  const [fiftyFivePlus, setFiftyFivePlus] = useState('include');
  const [hasAC, setHasAC] = useState(false);
  const [hasPool, setHasPool] = useState(false);
  const [waterfront, setWaterfront] = useState(false);
  const [daysOnZillow, setDaysOnZillow] = useState('any');
  const [keywords, setKeywords] = useState('');

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleFilterClick = (filterName: string, event: React.MouseEvent<HTMLElement>) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setActiveFilter(null);
    setAnchorEl(null);
  };

  const properties = [
    {
      id: 1,
      price: '$649,900',
      address: '153 Silliman St, San Francisco, CA 94134',
      beds: 5,
      baths: 3,
      sqft: 1850,
      type: 'Foreclosure',
      daysOnMarket: 49,
      image: 'Property 1'
    },
    {
      id: 2,
      price: '$799,000',
      address: '275 Teddy Ave, San Francisco, CA 94134',
      beds: 3,
      baths: 2,
      sqft: 1168,
      type: 'House for sale',
      priceCut: '$50,000',
      image: 'Property 2'
    },
    {
      id: 3,
      price: '$899,000',
      address: '76 Bay View St, San Francisco, CA 94124',
      beds: 2,
      baths: 1,
      sqft: 1515,
      type: 'House for sale',
      openHouse: 'Sat 2-4pm',
      image: 'Property 3'
    },
    {
      id: 4,
      price: '$698,000',
      address: '444 Ellington Ave, San Francisco, CA 94112',
      beds: 2,
      baths: 1,
      sqft: 1275,
      type: 'House for sale',
      flexible: true,
      image: 'Property 4'
    },
    {
      id: 5,
      price: '$925,000',
      address: '123 Marina Blvd, San Francisco, CA 94123',
      beds: 3,
      baths: 2,
      sqft: 1650,
      type: 'Condo for sale',
      daysOnMarket: 12,
      image: 'Property 5'
    },
    {
      id: 6,
      price: '$1,250,000',
      address: '456 Pacific Heights, San Francisco, CA 94115',
      beds: 4,
      baths: 3,
      sqft: 2200,
      type: 'House for sale',
      priceCut: '$75,000',
      image: 'Property 6'
    },
    {
      id: 7,
      price: '$550,000',
      address: '789 Mission Bay, San Francisco, CA 94158',
      beds: 2,
      baths: 2,
      sqft: 1100,
      type: 'Condo for sale',
      daysOnMarket: 8,
      image: 'Property 7'
    },
    {
      id: 8,
      price: '$1,450,000',
      address: '321 Presidio Heights, San Francisco, CA 94118',
      beds: 5,
      baths: 4,
      sqft: 2800,
      type: 'House for sale',
      openHouse: 'Sun 1-3pm',
      image: 'Property 8'
    },
    {
      id: 9,
      price: '$750,000',
      address: '654 Noe Valley, San Francisco, CA 94114',
      beds: 3,
      baths: 2,
      sqft: 1400,
      type: 'House for sale',
      daysOnMarket: 23,
      image: 'Property 9'
    },
    {
      id: 10,
      price: '$850,000',
      address: '987 Castro District, San Francisco, CA 94114',
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: 'Condo for sale',
      priceCut: '$25,000',
      image: 'Property 10'
    },
    {
      id: 11,
      price: '$1,100,000',
      address: '147 Russian Hill, San Francisco, CA 94109',
      beds: 3,
      baths: 2,
      sqft: 1800,
      type: 'House for sale',
      daysOnMarket: 15,
      image: 'Property 11'
    },
    {
      id: 12,
      price: '$650,000',
      address: '258 Hayes Valley, San Francisco, CA 94102',
      beds: 2,
      baths: 1,
      sqft: 950,
      type: 'Condo for sale',
      flexible: true,
      image: 'Property 12'
    },
    {
      id: 13,
      price: '$1,350,000',
      address: '369 Nob Hill, San Francisco, CA 94108',
      beds: 4,
      baths: 3,
      sqft: 2400,
      type: 'House for sale',
      openHouse: 'Sat 11am-1pm',
      image: 'Property 13'
    },
    {
      id: 14,
      price: '$720,000',
      address: '741 Potrero Hill, San Francisco, CA 94110',
      beds: 3,
      baths: 2,
      sqft: 1350,
      type: 'House for sale',
      daysOnMarket: 31,
      image: 'Property 14'
    },
    {
      id: 15,
      price: '$980,000',
      address: '852 Bernal Heights, San Francisco, CA 94110',
      beds: 3,
      baths: 2,
      sqft: 1600,
      type: 'House for sale',
      priceCut: '$40,000',
      image: 'Property 15'
    }
  ];

  const renderFilterContent = () => {
    switch (activeFilter) {
      case 'for-sale':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Property Status</Typography>
            <RadioGroup value={propertyStatus} onChange={(e) => setPropertyStatus(e.target.value)}>
              <FormControlLabel value="for-sale" control={<Radio />} label="For Sale" />
              <FormControlLabel value="for-rent" control={<Radio />} label="For Rent" />
              <FormControlLabel value="sold" control={<Radio />} label="Sold" />
              <FormControlLabel value="coming-soon" control={<Radio />} label="Coming soon" />
            </RadioGroup>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case 'price':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Price Range</Typography>
            <Box sx={{ mb: 2 }}>
              <RadioGroup value={priceType} onChange={(e) => setPriceType(e.target.value)}>
                <FormControlLabel value="list-price" control={<Radio />} label="List Price" />
                <FormControlLabel value="monthly-payment" control={<Radio />} label="Monthly Payment" />
              </RadioGroup>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Minimum</InputLabel>
                <Select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} label="Minimum">
                  <MenuItem value="no-min">No Min</MenuItem>
                  <MenuItem value="50000">$50,000</MenuItem>
                  <MenuItem value="100000">$100,000</MenuItem>
                  <MenuItem value="150000">$150,000</MenuItem>
                  <MenuItem value="200000">$200,000</MenuItem>
                  <MenuItem value="250000">$250,000</MenuItem>
                  <MenuItem value="300000">$300,000</MenuItem>
                  <MenuItem value="400000">$400,000</MenuItem>
                  <MenuItem value="500000">$500,000</MenuItem>
                  <MenuItem value="600000">$600,000</MenuItem>
                  <MenuItem value="700000">$700,000</MenuItem>
                  <MenuItem value="800000">$800,000</MenuItem>
                  <MenuItem value="900000">$900,000</MenuItem>
                  <MenuItem value="1000000">$1,000,000</MenuItem>
                  <MenuItem value="14000000">$14M</MenuItem>
                  <MenuItem value="15000000">$15M</MenuItem>
                  <MenuItem value="16000000">$16M</MenuItem>
                  <MenuItem value="17000000">$17M</MenuItem>
                  <MenuItem value="18000000">$18M</MenuItem>
                </Select>
              </FormControl>
              <Typography sx={{ alignSelf: 'center' }}>-</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Maximum</InputLabel>
                <Select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} label="Maximum">
                  <MenuItem value="no-max">No Max</MenuItem>
                  <MenuItem value="50000">$50,000</MenuItem>
                  <MenuItem value="100000">$100,000</MenuItem>
                  <MenuItem value="150000">$150,000</MenuItem>
                  <MenuItem value="200000">$200,000</MenuItem>
                  <MenuItem value="250000">$250,000</MenuItem>
                  <MenuItem value="300000">$300,000</MenuItem>
                  <MenuItem value="400000">$400,000</MenuItem>
                  <MenuItem value="500000">$500,000</MenuItem>
                  <MenuItem value="600000">$600,000</MenuItem>
                  <MenuItem value="700000">$700,000</MenuItem>
                  <MenuItem value="800000">$800,000</MenuItem>
                  <MenuItem value="900000">$900,000</MenuItem>
                  <MenuItem value="1000000">$1,000,000</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {priceType === 'monthly-payment' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Includes estimated principal and interest, mortgage insurance, property taxes, home insurance and HOA fees.
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                  <InputLabel>Down Payment</InputLabel>
                  <Select value="no-down" label="Down Payment">
                    <MenuItem value="no-down">No Down Payment</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Credit Score</InputLabel>
                  <Select value="no-selection" label="Credit Score">
                    <MenuItem value="no-selection">No Selection</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Save this monthly payment info to your Dreamery account. (See our{' '}
                    <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>
                      privacy policy
                    </Link>
                    )
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#1a365d',
                      color: '#1a365d',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#1a365d',
                        backgroundColor: 'rgba(26, 54, 93, 0.04)',
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case 'beds-baths':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Beds & Baths</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Bedrooms</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Any', '1+', '2+', '3+', '4+', '5+'].map((bed) => (
                  <Button
                    key={bed}
                    variant={minBeds === bed.toLowerCase().replace('+', '') ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setMinBeds(bed.toLowerCase().replace('+', ''))}
                    sx={{ minWidth: '60px' }}
                  >
                    {bed}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Bathrooms</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Any', '1+', '1.5+', '2+', '3+', '4+'].map((bath) => (
                  <Button
                    key={bath}
                    variant={minBaths === bath.toLowerCase().replace('+', '').replace('.5', '5') ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setMinBaths(bath.toLowerCase().replace('+', '').replace('.5', '5'))}
                    sx={{ minWidth: '60px' }}
                  >
                    {bath}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case 'home-type':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Home Type</Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { value: 'houses', label: 'Houses' },
                  { value: 'townhomes', label: 'Townhomes' },
                  { value: 'multi-family', label: 'Multi-family' },
                  { value: 'condos', label: 'Condos/Co-ops' },
                  { value: 'lots', label: 'Lots/Land' },
                  { value: 'apartments', label: 'Apartments' },
                  { value: 'manufactured', label: 'Manufactured' }
                ].map((type) => (
                  <FormControlLabel
                    key={type.value}
                    control={
                      <Checkbox
                        checked={homeTypes.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHomeTypes([...homeTypes, type.value]);
                          } else {
                            setHomeTypes(homeTypes.filter(t => t !== type.value));
                          }
                        }}
                      />
                    }
                    label={type.label}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case 'listing-type':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Listing Type</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { value: 'owner-posted', label: 'Owner posted' },
                { value: 'agent-listed', label: 'Agent listed' },
                { value: 'new-construction', label: 'New construction' },
                { value: 'foreclosures', label: 'Foreclosures' },
                { value: 'auctions', label: 'Auctions' },
                { value: 'foreclosed', label: 'Foreclosed' },
                { value: 'pre-foreclosures', label: 'Pre-foreclosures' }
              ].map((type) => (
                <FormControlLabel
                  key={type.value}
                  control={
                    <Checkbox
                      checked={listingTypes.includes(type.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setListingTypes([...listingTypes, type.value]);
                        } else {
                          setListingTypes(listingTypes.filter(t => t !== type.value));
                        }
                      }}
                    />
                  }
                  label={type.label}
                />
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCloseFilter}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      case 'more':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>More Filters</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Max HOA</Typography>
              <FormControl fullWidth size="small">
                <Select value={maxHoa} onChange={(e) => setMaxHoa(e.target.value)}>
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="no-hoa">No HOA Fee</MenuItem>
                  <MenuItem value="50">$50/month</MenuItem>
                  <MenuItem value="100">$100/month</MenuItem>
                  <MenuItem value="200">$200/month</MenuItem>
                  <MenuItem value="300">$300/month</MenuItem>
                  <MenuItem value="400">$400/month</MenuItem>
                  <MenuItem value="500">$500/month</MenuItem>
                  <MenuItem value="600">$600/month</MenuItem>
                  <MenuItem value="700">$700/month</MenuItem>
                  <MenuItem value="800">$800/month</MenuItem>
                  <MenuItem value="900">$900/month</MenuItem>
                  <MenuItem value="1000">$1000/month</MenuItem>
                  <MenuItem value="1500">$1500/month</MenuItem>
                  <MenuItem value="2000">$2000/month</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Parking spots</Typography>
              <FormControl fullWidth size="small">
                <Select value={parkingSpots} onChange={(e) => setParkingSpots(e.target.value)}>
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="1">1+</MenuItem>
                  <MenuItem value="2">2+</MenuItem>
                  <MenuItem value="3">3+</MenuItem>
                  <MenuItem value="4">4+</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Square feet</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl fullWidth size="small">
                  <Select value={minSqft} onChange={(e) => setMinSqft(e.target.value)}>
                    <MenuItem value="no-min">No Min</MenuItem>
                    <MenuItem value="500">500</MenuItem>
                    <MenuItem value="750">750</MenuItem>
                    <MenuItem value="1000">1,000</MenuItem>
                    <MenuItem value="1250">1,250</MenuItem>
                    <MenuItem value="1500">1,500</MenuItem>
                    <MenuItem value="1750">1,750</MenuItem>
                    <MenuItem value="2000">2,000</MenuItem>
                    <MenuItem value="2250">2,250</MenuItem>
                    <MenuItem value="2500">2,500</MenuItem>
                    <MenuItem value="2750">2,750</MenuItem>
                    <MenuItem value="3000">3,000</MenuItem>
                    <MenuItem value="3500">3,500</MenuItem>
                    <MenuItem value="4000">4,000</MenuItem>
                    <MenuItem value="5000">5,000</MenuItem>
                    <MenuItem value="7500">7,500</MenuItem>
                  </Select>
                </FormControl>
                <Typography sx={{ alignSelf: 'center' }}>-</Typography>
                <FormControl fullWidth size="small">
                  <Select value={maxSqft} onChange={(e) => setMaxSqft(e.target.value)}>
                    <MenuItem value="no-max">No Max</MenuItem>
                    <MenuItem value="500">500</MenuItem>
                    <MenuItem value="750">750</MenuItem>
                    <MenuItem value="1000">1,000</MenuItem>
                    <MenuItem value="1250">1,250</MenuItem>
                    <MenuItem value="1500">1,500</MenuItem>
                    <MenuItem value="1750">1,750</MenuItem>
                    <MenuItem value="2000">2,000</MenuItem>
                    <MenuItem value="2250">2,250</MenuItem>
                    <MenuItem value="2500">2,500</MenuItem>
                    <MenuItem value="2750">2,750</MenuItem>
                    <MenuItem value="3000">3,000</MenuItem>
                    <MenuItem value="3500">3,500</MenuItem>
                    <MenuItem value="4000">4,000</MenuItem>
                    <MenuItem value="5000">5,000</MenuItem>
                    <MenuItem value="7500">7,500</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Lot size</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl fullWidth size="small">
                  <Select value={minLotSize} onChange={(e) => setMinLotSize(e.target.value)}>
                    <MenuItem value="no-min">No Min</MenuItem>
                    <MenuItem value="1000">1,000 sqft</MenuItem>
                    <MenuItem value="2000">2,000 sqft</MenuItem>
                    <MenuItem value="3000">3,000 sqft</MenuItem>
                    <MenuItem value="4000">4,000 sqft</MenuItem>
                    <MenuItem value="5000">5,000 sqft</MenuItem>
                    <MenuItem value="7500">7,500 sqft</MenuItem>
                    <MenuItem value="10890">1/4 acre/10,890 sqft</MenuItem>
                    <MenuItem value="21780">1/2 acre</MenuItem>
                    <MenuItem value="43560">1 acre</MenuItem>
                    <MenuItem value="87120">2 acres</MenuItem>
                    <MenuItem value="217800">5 acres</MenuItem>
                    <MenuItem value="435600">10 acres</MenuItem>
                    <MenuItem value="871200">20 acres</MenuItem>
                    <MenuItem value="2178000">50 acres</MenuItem>
                    <MenuItem value="4356000">100 acres</MenuItem>
                  </Select>
                </FormControl>
                <Typography sx={{ alignSelf: 'center' }}>-</Typography>
                <FormControl fullWidth size="small">
                  <Select value={maxLotSize} onChange={(e) => setMaxLotSize(e.target.value)}>
                    <MenuItem value="no-max">No Max</MenuItem>
                    <MenuItem value="1000">1,000 sqft</MenuItem>
                    <MenuItem value="2000">2,000 sqft</MenuItem>
                    <MenuItem value="3000">3,000 sqft</MenuItem>
                    <MenuItem value="4000">4,000 sqft</MenuItem>
                    <MenuItem value="5000">5,000 sqft</MenuItem>
                    <MenuItem value="7500">7,500 sqft</MenuItem>
                    <MenuItem value="10890">1/4 acre/10,890 sqft</MenuItem>
                    <MenuItem value="21780">1/2 acre</MenuItem>
                    <MenuItem value="43560">1 acre</MenuItem>
                    <MenuItem value="87120">2 acres</MenuItem>
                    <MenuItem value="217800">5 acres</MenuItem>
                    <MenuItem value="435600">10 acres</MenuItem>
                    <MenuItem value="871200">20 acres</MenuItem>
                    <MenuItem value="2178000">50 acres</MenuItem>
                    <MenuItem value="4356000">100 acres</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Year built</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="No Min"
                  value={yearBuiltMin}
                  onChange={(e) => setYearBuiltMin(e.target.value)}
                  fullWidth
                />
                <Typography sx={{ alignSelf: 'center' }}>-</Typography>
                <TextField
                  size="small"
                  placeholder="No Max"
                  value={yearBuiltMax}
                  onChange={(e) => setYearBuiltMax(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                55+ Communities <Chip label="NEW" size="small" color="primary" />
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={fiftyFivePlus} onChange={(e) => setFiftyFivePlus(e.target.value)}>
                  <MenuItem value="include">Include</MenuItem>
                  <MenuItem value="dont-show">Don't show</MenuItem>
                  <MenuItem value="only-show">Only show</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Days on Dreamery</Typography>
              <FormControl fullWidth size="small">
                <Select value={daysOnZillow} onChange={(e) => setDaysOnZillow(e.target.value)}>
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="1">1 day</MenuItem>
                  <MenuItem value="7">7 days</MenuItem>
                  <MenuItem value="14">14 days</MenuItem>
                  <MenuItem value="30">30 days</MenuItem>
                  <MenuItem value="90">90 days</MenuItem>
                  <MenuItem value="180">6 months</MenuItem>
                  <MenuItem value="365">12 months</MenuItem>
                  <MenuItem value="730">24 months</MenuItem>
                  <MenuItem value="1095">36 months</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Keywords</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="MLS #, yard, etc."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="text" onClick={handleCloseFilter} sx={{ flex: 1 }}>
                Reset all filters
              </Button>
              <Button variant="contained" onClick={handleCloseFilter} sx={{ flex: 1 }}>
                Apply
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              sx={{ color: '#666', textTransform: 'none' }}
            >
              Back
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a365d' }}>
              San Francisco, CA Real Estate & Homes For Sale
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="San Francisco, CA"
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" sx={{ bgcolor: '#1a365d' }}>
              Save search
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">500</Typography>
              <Favorite sx={{ color: '#e31c25', fontSize: 20 }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <FilterButton
              onClick={(e) => handleFilterClick('for-sale', e)}
              className={activeFilter === 'for-sale' ? 'active' : ''}
              endIcon={activeFilter === 'for-sale' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              Property Status
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick('price', e)}
              className={activeFilter === 'price' ? 'active' : ''}
              endIcon={activeFilter === 'price' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              Price
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick('beds-baths', e)}
              className={activeFilter === 'beds-baths' ? 'active' : ''}
              endIcon={activeFilter === 'beds-baths' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              Beds & Baths
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick('home-type', e)}
              className={activeFilter === 'home-type' ? 'active' : ''}
              endIcon={activeFilter === 'home-type' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              Home Type
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick('listing-type', e)}
              className={activeFilter === 'listing-type' ? 'active' : ''}
              endIcon={activeFilter === 'listing-type' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              Listing Type
            </FilterButton>
            <FilterButton
              onClick={(e) => handleFilterClick('more', e)}
              className={activeFilter === 'more' ? 'active' : ''}
              endIcon={activeFilter === 'more' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              More
            </FilterButton>
          </Box>
        </Container>
      </HeaderSection>

      <Popover
        open={Boolean(activeFilter)}
        anchorEl={anchorEl}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <FilterPopover>
          {renderFilterContent()}
        </FilterPopover>
      </Popover>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
        <Box sx={{ flex: '2', position: 'relative', p: 2 }}>
          <Box sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              color: '#333',
              fontWeight: 600
            }}>
              500 of 1,095 homes
            </Box>
            <Typography variant="h6">
              Interactive Map View
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flex: '1', overflowY: 'auto', borderLeft: '1px solid #e0e0e0' }}>
          <Container maxWidth="xl" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                1,095 results
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort</InputLabel>
                <Select value="homes-for-you" label="Sort">
                  <MenuItem value="homes-for-you">Homes for You</MenuItem>
                  <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                  <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {properties.map((property) => (
                <PropertyCard key={property.id} sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ 
                      width: '120px', 
                      height: '90px', 
                      flexShrink: 0,
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666'
                    }}>
                      {property.image}
                    </Box>
                    <CardContent sx={{ p: 2, flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d' }}>
                          {property.price}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavorite(property.id)}
                          sx={{ color: favorites.has(property.id) ? '#e31c25' : '#ccc' }}
                        >
                          {favorites.has(property.id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        {property.daysOnMarket && (
                          <Chip label={`${property.daysOnMarket} days on Dreamery`} size="small" color="primary" />
                        )}
                        {property.priceCut && (
                          <Chip label={`Price cut: ${property.priceCut}`} size="small" color="secondary" />
                        )}
                        {property.openHouse && (
                          <Chip label={`Open: ${property.openHouse}`} size="small" color="success" />
                        )}
                        {property.flexible && (
                          <Chip label="Flexible layout" size="small" color="info" />
                        )}
                      </Box>

                      <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                        {property.beds} bds | {property.baths} ba | {property.sqft.toLocaleString()} sqft - {property.type}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                        {property.address}
                      </Typography>
                    </CardContent>
                  </Box>
                </PropertyCard>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default BuyPage; 