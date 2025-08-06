import React, { useState } from 'react';
import {
  Box,
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
  Slider,
  Chip,
  Rating,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn as LocationOnIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Search,
  FilterList,
  Sort
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  image: string;
  rating: number;
  description: string;
  features: string[];
  isFavorite: boolean;
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Condo",
    price: 450000,
    location: "Downtown, City Center",
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "Condo",
    image: "https://images.unsplash.com/photo-1560448204-e02f8c8d7b8b?w=400",
    rating: 4.5,
    description: "Luxurious downtown condo with city views and modern amenities.",
    features: ["Balcony", "Gym", "Pool", "Parking"],
    isFavorite: false
  },
  {
    id: 2,
    title: "Family Suburban Home",
    price: 650000,
    location: "Suburban Heights",
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Single Family",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    rating: 4.8,
    description: "Spacious family home with large backyard and excellent schools.",
    features: ["Backyard", "Garage", "Fireplace", "Updated Kitchen"],
    isFavorite: false
  },
  {
    id: 3,
    title: "Waterfront Townhouse",
    price: 750000,
    location: "Harbor District",
    beds: 3,
    baths: 2.5,
    sqft: 2100,
    type: "Townhouse",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
    rating: 4.7,
    description: "Beautiful waterfront townhouse with marina access.",
    features: ["Waterfront", "Marina Access", "Deck", "Modern Design"],
    isFavorite: false
  },
  {
    id: 4,
    title: "Historic Victorian",
    price: 850000,
    location: "Historic District",
    beds: 5,
    baths: 3,
    sqft: 3200,
    type: "Historic",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    rating: 4.6,
    description: "Restored Victorian home with original character and modern updates.",
    features: ["Historic", "Fireplace", "Hardwood Floors", "Garden"],
    isFavorite: false
  },
  {
    id: 5,
    title: "Luxury Penthouse",
    price: 1200000,
    location: "Uptown Luxury",
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    type: "Penthouse",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    rating: 4.9,
    description: "Ultra-luxurious penthouse with panoramic city views.",
    features: ["Panoramic Views", "Concierge", "Private Elevator", "Wine Cellar"],
    isFavorite: false
  },
  {
    id: 6,
    title: "Cozy Starter Home",
    price: 320000,
    location: "First Time Buyer Area",
    beds: 2,
    baths: 1,
    sqft: 1100,
    type: "Starter",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    rating: 4.3,
    description: "Perfect starter home with great potential for customization.",
    features: ["Affordable", "Good Location", "Potential", "Updated"],
    isFavorite: false
  },
  {
    id: 7,
    title: "Investment Duplex",
    price: 580000,
    location: "Investment District",
    beds: 6,
    baths: 4,
    sqft: 2400,
    type: "Investment",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    rating: 4.4,
    description: "Income-producing duplex with excellent rental potential.",
    features: ["Rental Income", "Two Units", "Updated", "Good ROI"],
    isFavorite: false
  },
  {
    id: 8,
    title: "Mountain Retreat",
    price: 920000,
    location: "Mountain View",
    beds: 4,
    baths: 3,
    sqft: 2600,
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
    rating: 4.8,
    description: "Stunning mountain retreat with breathtaking views.",
    features: ["Mountain Views", "Fireplace", "Deck", "Privacy"],
    isFavorite: false
  },
  {
    id: 9,
    title: "Modern Loft",
    price: 380000,
    location: "Arts District",
    beds: 1,
    baths: 1,
    sqft: 900,
    type: "Loft",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    rating: 4.2,
    description: "Industrial-chic loft in the heart of the arts district.",
    features: ["High Ceilings", "Exposed Brick", "Arts District", "Modern"],
    isFavorite: false
  },
  {
    id: 10,
    title: "Golf Course Estate",
    price: 1500000,
    location: "Country Club",
    beds: 5,
    baths: 4.5,
    sqft: 4200,
    type: "Estate",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    rating: 4.9,
    description: "Magnificent estate on the golf course with luxury amenities.",
    features: ["Golf Course", "Pool", "Tennis Court", "Wine Cellar"],
    isFavorite: false
  }
];

const BuyPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
  const [propertyType, setPropertyType] = useState('all');
  const [beds, setBeds] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleFavorite = (propertyId: number) => {
    setProperties(properties.map(prop => 
      prop.id === propertyId 
        ? { ...prop, isFavorite: !prop.isFavorite }
        : prop
    ));
    setSnackbar({ open: true, message: 'Property added to favorites!' });
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesType = propertyType === 'all' || property.type === propertyType;
    const matchesBeds = beds === 'all' || property.beds >= parseInt(beds);
    
    return matchesSearch && matchesPrice && matchesType && matchesBeds;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'beds':
        return b.beds - a.beds;
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <PageTemplate title="Find Your Dream Home" subtitle="Discover properties that match your lifestyle">
      <Box>
        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', mb: 2 }}>
            <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
            Search & Filters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by location or property name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  label="Property Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Single Family">Single Family</MenuItem>
                  <MenuItem value="Condo">Condo</MenuItem>
                  <MenuItem value="Townhouse">Townhouse</MenuItem>
                  <MenuItem value="Penthouse">Penthouse</MenuItem>
                  <MenuItem value="Loft">Loft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Bedrooms</InputLabel>
                <Select
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  label="Bedrooms"
                >
                  <MenuItem value="all">Any</MenuItem>
                  <MenuItem value="1">1+</MenuItem>
                  <MenuItem value="2">2+</MenuItem>
                  <MenuItem value="3">3+</MenuItem>
                  <MenuItem value="4">4+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="price">Price (Low to High)</MenuItem>
                  <MenuItem value="price-desc">Price (High to Low)</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="beds">Bedrooms</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={2000000}
              step={50000}
            />
          </Box>
        </Paper>

        {/* Results Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#1a365d' }}>
            {sortedProperties.length} properties found
          </Typography>
        </Box>

        {/* Property Grid */}
        <Grid container spacing={3}>
          {sortedProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image}
                  alt={property.title}
                />
                
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                  }}
                  onClick={() => handleFavorite(property.id)}
                >
                  {property.isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                    {property.title}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#1a365d', fontWeight: 700, mb: 1 }}>
                    {formatPrice(property.price)}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={property.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({property.rating})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BedIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      {property.beds} beds
                    </Typography>
                    <BathtubIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ mr: 2 }}>
                      {property.baths} baths
                    </Typography>
                    <SquareFootIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2">
                      {property.sqft.toLocaleString()} sqft
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {property.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#1a365d',
                      '&:hover': { backgroundColor: '#0d2340' }
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Placeholder Property Cards */}
        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Properties
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`placeholder-${index}`}>
              <Card sx={{ 
                height: '100%', 
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)' 
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Dream+Property+${index + 1}`}
                  alt={`Dream Property ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                    Dream Property #{index + 1}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                    ${(500000 + index * 50000).toLocaleString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ color: '#718096', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Phoenix, AZ', 'Portland, OR', 'Nashville, TN'][index]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <BedIcon sx={{ color: '#718096', fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {3 + (index % 3)} beds
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <BathtubIcon sx={{ color: '#718096', fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {2 + (index % 2)} baths
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SquareFootIcon sx={{ color: '#718096', fontSize: 20, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {(1500 + index * 100).toLocaleString()} sqft
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#1a365d',
                      '&:hover': { backgroundColor: '#0d2340' }
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </PageTemplate>
  );
};

export default BuyPage; 