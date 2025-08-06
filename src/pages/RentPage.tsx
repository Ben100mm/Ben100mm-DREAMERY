import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Rating,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as SquareFootIcon,
  Pets as PetsIcon,
  LocalParking as ParkingIcon,
  FitnessCenter as GymIcon,
  Pool as PoolIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PropertyCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PropertyImage = styled(CardMedia)`
  height: 200px;
  position: relative;
`;

const FavoriteButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const RentTag = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(26, 54, 93, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const PropertyStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const AmenitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const mockRentals = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    rent: "$2,200/month",
    location: "Downtown, City Center",
    beds: 1,
    baths: 1,
    sqft: 850,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    available: true,
    amenities: ['Pets Allowed', 'Parking', 'Gym', 'Pool'],
    leaseTerm: "12 months"
  },
  {
    id: 2,
    title: "Family Townhouse",
    rent: "$3,500/month",
    location: "Suburban Heights",
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    available: true,
    amenities: ['Pets Allowed', 'Parking', 'Garden'],
    leaseTerm: "12 months"
  },
  {
    id: 3,
    title: "Luxury Penthouse Rental",
    rent: "$5,800/month",
    location: "Waterfront District",
    beds: 2,
    baths: 2,
    sqft: 1500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    available: true,
    amenities: ['Pets Allowed', 'Parking', 'Gym', 'Pool', 'Concierge'],
    leaseTerm: "6-12 months"
  },
  {
    id: 4,
    title: "Cozy Studio Apartment",
    rent: "$1,400/month",
    location: "University District",
    beds: 0,
    baths: 1,
    sqft: 550,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    available: true,
    amenities: ['Pets Allowed'],
    leaseTerm: "12 months"
  }
];

const RentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rentRange, setRentRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleFavoriteToggle = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleApplyNow = (property: any) => {
    setSelectedProperty(property);
    setApplicationDialog(true);
  };

  const filteredRentals = mockRentals.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTemplate 
      title="Find Your Perfect Rental" 
      subtitle="Discover rental properties that fit your lifestyle and budget"
    >
      {/* Search Section */}
      <SearchSection>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search rentals"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Rent Range</InputLabel>
              <Select
                value={rentRange}
                label="Rent Range"
                onChange={(e) => setRentRange(e.target.value)}
              >
                <MenuItem value="">Any Rent</MenuItem>
                <MenuItem value="0-1500">Under $1,500</MenuItem>
                <MenuItem value="1500-2500">$1,500 - $2,500</MenuItem>
                <MenuItem value="2500-3500">$2,500 - $3,500</MenuItem>
                <MenuItem value="3500+">Over $3,500</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Property Type</InputLabel>
              <Select
                value={propertyType}
                label="Property Type"
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <MenuItem value="">Any Type</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="studio">Studio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<FilterIcon />}
              sx={{ height: '56px' }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </SearchSection>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Available Rentals" />
          <Tab label="My Applications" />
          <Tab label="Saved Properties" />
        </Tabs>
      </Box>

      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {filteredRentals.length} rentals available
        </Typography>
      </Box>

      {/* Rental Grid */}
      <Grid container spacing={3}>
        {filteredRentals.map((property) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
            <PropertyCard>
              <PropertyImage image={property.image}>
                <FavoriteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(property.id);
                  }}
                >
                  {favorites.includes(property.id) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </FavoriteButton>
                <RentTag>{property.rent}</RentTag>
                {property.available && (
                  <Chip
                    label="Available"
                    color="success"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#4caf50'
                    }}
                  />
                )}
              </PropertyImage>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {property.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {property.location}
                  </Typography>
                </Box>
                <PropertyStats>
                  <StatItem>
                    <BedIcon sx={{ fontSize: 16 }} />
                    {property.beds}
                  </StatItem>
                  <StatItem>
                    <BathIcon sx={{ fontSize: 16 }} />
                    {property.baths}
                  </StatItem>
                  <StatItem>
                    <SquareFootIcon sx={{ fontSize: 16 }} />
                    {property.sqft.toLocaleString()}
                  </StatItem>
                </PropertyStats>
                <AmenitiesContainer>
                  {property.amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </AmenitiesContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={property.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    ({property.rating})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Lease: {property.leaseTerm}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => handleApplyNow(property)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </PropertyCard>
          </Grid>
        ))}
      </Grid>

      {/* Application Dialog */}
      <Dialog 
        open={applicationDialog} 
        onClose={() => setApplicationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Rental Application - {selectedProperty?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please fill out the application form below. We'll review your application and contact you within 2-3 business days.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Address"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Income"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employer"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setApplicationDialog(false)}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </PageTemplate>
  );
};

export default RentPage; 