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
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as SquareFootIcon
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

const PriceTag = styled.div`
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

const mockProperties = [
  {
    id: 1,
    title: "Modern Downtown Condo",
    price: "$450,000",
    location: "Downtown, City Center",
    beds: 2,
    baths: 2,
    sqft: 1200,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Family Home with Garden",
    price: "$650,000",
    location: "Suburban Heights",
    beds: 4,
    baths: 3,
    sqft: 2200,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "Luxury Penthouse",
    price: "$1,200,000",
    location: "Waterfront District",
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    featured: true
  },
  {
    id: 4,
    title: "Cozy Starter Home",
    price: "$320,000",
    location: "Quiet Neighborhood",
    beds: 2,
    baths: 1,
    sqft: 950,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    featured: false
  }
];

const BuyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleFavoriteToggle = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const filteredProperties = mockProperties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTemplate 
      title="Find Your Dream Home" 
      subtitle="Discover properties that match your lifestyle and budget"
    >
      {/* Search Section */}
      <SearchSection>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search properties"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <MenuItem value="">Any Price</MenuItem>
                <MenuItem value="0-300000">Under $300,000</MenuItem>
                <MenuItem value="300000-500000">$300,000 - $500,000</MenuItem>
                <MenuItem value="500000-750000">$500,000 - $750,000</MenuItem>
                <MenuItem value="750000+">Over $750,000</MenuItem>
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
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="condo">Condo</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
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

      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {filteredProperties.length} properties found
        </Typography>
      </Box>

      {/* Property Grid */}
      <Grid container spacing={3}>
        {filteredProperties.map((property) => (
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
                <PriceTag>{property.price}</PriceTag>
                {property.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#1a365d'
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
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={property.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    ({property.rating})
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  View Details
                </Button>
              </CardContent>
            </PropertyCard>
          </Grid>
        ))}
      </Grid>
    </PageTemplate>
  );
};

export default BuyPage; 