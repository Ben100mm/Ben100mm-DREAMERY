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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const RentPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // Filter states
  const [propertyStatus, setPropertyStatus] = useState('for-rent');
  const [priceType, setPriceType] = useState('monthly-rent');
  const [minPrice, setMinPrice] = useState('no-min');
  const [maxPrice, setMaxPrice] = useState('no-max');
  const [minBeds, setMinBeds] = useState('any');
  const [minBaths, setMinBaths] = useState('any');
  const [homeTypes, setHomeTypes] = useState(['apartments', 'houses', 'townhomes', 'condos', 'multi-family', 'duplexes', 'studios', 'lofts']);
  const [listingTypes, setListingTypes] = useState(['owner-posted', 'property-manager', 'agent-listed', 'corporate-housing', 'short-term']);
  const [maxHoa, setMaxHoa] = useState('any');
  const [parkingSpots, setParkingSpots] = useState('any');
  const [minSqft, setMinSqft] = useState('no-min');
  const [maxSqft, setMaxSqft] = useState('no-max');
  const [petPolicy, setPetPolicy] = useState('any');
  const [leaseTerms, setLeaseTerms] = useState('any');
  const [utilitiesIncluded, setUtilitiesIncluded] = useState('any');
  const [furnished, setFurnished] = useState('any');
  const [fiftyFivePlus, setFiftyFivePlus] = useState('include');
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
      price: '$2,400/month',
      address: '153 Silliman St, San Francisco, CA 94134',
      beds: 2,
      baths: 1,
      sqft: 850,
      type: 'Apartment for rent',
      daysOnMarket: 5,
      image: 'Property 1'
    },
    {
      id: 2,
      price: '$3,200/month',
      address: '275 Teddy Ave, San Francisco, CA 94134',
      beds: 3,
      baths: 2,
      sqft: 1168,
      type: 'House for rent',
      priceCut: '$200/month',
      image: 'Property 2'
    },
    {
      id: 3,
      price: '$1,800/month',
      address: '76 Bay View St, San Francisco, CA 94124',
      beds: 1,
      baths: 1,
      sqft: 650,
      type: 'Studio for rent',
      openHouse: 'Sat 2-4pm',
      image: 'Property 3'
    },
    {
      id: 4,
      price: '$2,800/month',
      address: '444 Ellington Ave, San Francisco, CA 94112',
      beds: 2,
      baths: 1,
      sqft: 950,
      type: 'Townhouse for rent',
      flexible: true,
      image: 'Property 4'
    },
    {
      id: 5,
      price: '$4,500/month',
      address: '789 Ocean Blvd, San Francisco, CA 94121',
      beds: 3,
      baths: 2,
      sqft: 1400,
      type: 'House for rent',
      image: 'Property 5'
    },
    {
      id: 6,
      price: '$1,600/month',
      address: '321 Market St, San Francisco, CA 94105',
      beds: 1,
      baths: 1,
      sqft: 750,
      type: 'Apartment for rent',
      image: 'Property 6'
    },
    {
      id: 7,
      price: '$3,800/month',
      address: '456 Castro St, San Francisco, CA 94114',
      beds: 2,
      baths: 2,
      sqft: 1100,
      type: 'Condo for rent',
      image: 'Property 7'
    },
    {
      id: 8,
      price: '$2,200/month',
      address: '654 Mission St, San Francisco, CA 94105',
      beds: 2,
      baths: 1,
      sqft: 900,
      type: 'Apartment for rent',
      image: 'Property 8'
    },
    {
      id: 9,
      price: '$5,200/month',
      address: '987 Pacific Ave, San Francisco, CA 94133',
      beds: 3,
      baths: 2,
      sqft: 1600,
      type: 'House for rent',
      image: 'Property 9'
    },
    {
      id: 10,
      price: '$1,900/month',
      address: '123 Valencia St, San Francisco, CA 94103',
      beds: 1,
      baths: 1,
      sqft: 800,
      type: 'Loft for rent',
      image: 'Property 10'
    },
    {
      id: 11,
      price: '$3,500/month',
      address: '456 Hayes St, San Francisco, CA 94102',
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: 'Townhouse for rent',
      image: 'Property 11'
    },
    {
      id: 12,
      price: '$2,600/month',
      address: '789 Haight St, San Francisco, CA 94117',
      beds: 2,
      baths: 1,
      sqft: 1000,
      type: 'Apartment for rent',
      image: 'Property 12'
    },
    {
      id: 13,
      price: '$4,800/month',
      address: '321 Divisadero St, San Francisco, CA 94117',
      beds: 3,
      baths: 2,
      sqft: 1500,
      type: 'House for rent',
      image: 'Property 13'
    },
    {
      id: 14,
      price: '$1,700/month',
      address: '654 Fillmore St, San Francisco, CA 94117',
      beds: 1,
      baths: 1,
      sqft: 700,
      type: 'Studio for rent',
      image: 'Property 14'
    },
    {
      id: 15,
      price: '$3,300/month',
      address: '987 Church St, San Francisco, CA 94114',
      beds: 2,
      baths: 2,
      sqft: 1100,
      type: 'Condo for rent',
      image: 'Property 15'
    }
  ];

  const renderFilterContent = () => {
    switch (activeFilter) {
      case 'for-rent':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Property Status</Typography>
            <RadioGroup value={propertyStatus} onChange={(e) => setPropertyStatus(e.target.value)}>
              <FormControlLabel value="for-rent" control={<Radio />} label="For Rent" />
              <FormControlLabel value="coming-soon" control={<Radio />} label="Coming Soon" />
              <FormControlLabel value="recently-rented" control={<Radio />} label="Recently Rented" />
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
            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Rent</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Minimum</InputLabel>
                <Select 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                  label="Minimum"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="no-min">No Min</MenuItem>
                  <MenuItem value="500">$500/month</MenuItem>
                  <MenuItem value="750">$750/month</MenuItem>
                  <MenuItem value="1000">$1,000/month</MenuItem>
                  <MenuItem value="1250">$1,250/month</MenuItem>
                  <MenuItem value="1500">$1,500/month</MenuItem>
                  <MenuItem value="1750">$1,750/month</MenuItem>
                  <MenuItem value="2000">$2,000/month</MenuItem>
                  <MenuItem value="2500">$2,500/month</MenuItem>
                  <MenuItem value="3000">$3,000/month</MenuItem>
                  <MenuItem value="3500">$3,500/month</MenuItem>
                  <MenuItem value="4000">$4,000/month</MenuItem>
                  <MenuItem value="5000">$5,000/month</MenuItem>
                  <MenuItem value="7500">$7,500/month</MenuItem>
                  <MenuItem value="10000">$10,000/month</MenuItem>
                </Select>
              </FormControl>
              <Typography sx={{ alignSelf: 'center' }}>-</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Maximum</InputLabel>
                <Select 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                  label="Maximum"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="no-max">No Max</MenuItem>
                  <MenuItem value="500">$500/month</MenuItem>
                  <MenuItem value="750">$750/month</MenuItem>
                  <MenuItem value="1000">$1,000/month</MenuItem>
                  <MenuItem value="1250">$1,250/month</MenuItem>
                  <MenuItem value="1500">$1,500/month</MenuItem>
                  <MenuItem value="1750">$1,750/month</MenuItem>
                  <MenuItem value="2000">$2,000/month</MenuItem>
                  <MenuItem value="2500">$2,500/month</MenuItem>
                  <MenuItem value="3000">$3,000/month</MenuItem>
                  <MenuItem value="3500">$3,500/month</MenuItem>
                  <MenuItem value="4000">$4,000/month</MenuItem>
                  <MenuItem value="5000">$5,000/month</MenuItem>
                  <MenuItem value="7500">$7,500/month</MenuItem>
                  <MenuItem value="10000">$10,000/month</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
                  { value: 'apartments', label: 'Apartments' },
                  { value: 'houses', label: 'Houses' },
                  { value: 'townhomes', label: 'Townhomes' },
                  { value: 'condos', label: 'Condos/Co-ops' },
                  { value: 'multi-family', label: 'Multi-family' },
                  { value: 'duplexes', label: 'Duplexes' },
                  { value: 'studios', label: 'Studios' },
                  { value: 'lofts', label: 'Lofts' }
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
                { value: 'property-manager', label: 'Property manager listed' },
                { value: 'agent-listed', label: 'Agent listed' },
                { value: 'corporate-housing', label: 'Corporate housing' },
                { value: 'short-term', label: 'Short-term rentals' }
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
                <Select 
                  value={maxHoa} 
                  onChange={(e) => setMaxHoa(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
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
                <Select 
                  value={parkingSpots} 
                  onChange={(e) => setParkingSpots(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
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
                  <Select 
                    value={minSqft} 
                    onChange={(e) => setMinSqft(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
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
                  <Select 
                    value={maxSqft} 
                    onChange={(e) => setMaxSqft(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300
                        }
                      }
                    }}
                  >
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
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Pet Policy</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={petPolicy} 
                  onChange={(e) => setPetPolicy(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="cats-allowed">Cats allowed</MenuItem>
                  <MenuItem value="dogs-allowed">Dogs allowed</MenuItem>
                  <MenuItem value="no-pets">No pets</MenuItem>
                  <MenuItem value="pet-deposit">Pet deposit required</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Lease Terms</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={leaseTerms} 
                  onChange={(e) => setLeaseTerms(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="month-to-month">Month-to-month</MenuItem>
                  <MenuItem value="6-months">6 months</MenuItem>
                  <MenuItem value="12-months">12 months</MenuItem>
                  <MenuItem value="18-months">18 months</MenuItem>
                  <MenuItem value="24-months">24 months</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Utilities Included</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={utilitiesIncluded} 
                  onChange={(e) => setUtilitiesIncluded(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="water">Water</MenuItem>
                  <MenuItem value="electricity">Electricity</MenuItem>
                  <MenuItem value="gas">Gas</MenuItem>
                  <MenuItem value="internet">Internet</MenuItem>
                  <MenuItem value="all">All utilities</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Furnished</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={furnished} 
                  onChange={(e) => setFurnished(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="any">Any</MenuItem>
                  <MenuItem value="furnished">Furnished</MenuItem>
                  <MenuItem value="unfurnished">Unfurnished</MenuItem>
                  <MenuItem value="partially">Partially furnished</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                55+ Communities
              </Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={fiftyFivePlus} 
                  onChange={(e) => setFiftyFivePlus(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="include">Include</MenuItem>
                  <MenuItem value="dont-show">Don't show</MenuItem>
                  <MenuItem value="only-show">Only show</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Days on Dreamery</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={daysOnZillow} 
                  onChange={(e) => setDaysOnZillow(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
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
                placeholder="MLS #, amenities, etc."
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
      {/* Top Search Section */}
      <Box sx={{ 
        background: 'white', 
        py: 2
      }}>
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
              San Francisco, CA Real Estate & Homes For Rent
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <TextField
                fullWidth
                placeholder="San Francisco, CA"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small">
                        <Clear sx={{ color: '#666' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </Box>
            
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1a365d',
                color: 'white',
                textTransform: 'uppercase',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#0d2340',
                }
              }}
            >
              Save Search
            </Button>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e9ecef',
                borderColor: '#c0c0c0'
              }
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                500
              </Typography>
              <Favorite sx={{ color: '#e31c25', fontSize: 20 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      <HeaderSection>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FilterButton
              onClick={(e) => handleFilterClick('for-rent', e)}
              className={activeFilter === 'for-rent' ? 'active' : ''}
              endIcon={activeFilter === 'for-rent' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            >
              For Rent
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
              500 of 1,095 rentals
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
                  <MenuItem value="homes-for-you">Rentals for You</MenuItem>
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
                          <Chip label="Flexible lease" size="small" color="info" />
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

export default RentPage; 