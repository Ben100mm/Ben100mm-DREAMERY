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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn as LocationOnIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Search,
  Send,
  CalendarToday,
  Pets,
  SmokingRooms,
  Wifi,
  Pool,
  FitnessCenter
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

interface RentalProperty {
  id: number;
  title: string;
  rent: number;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  image: string;
  rating: number;
  description: string;
  amenities: string[];
  leaseTerm: string;
  availableDate: string;
  isFavorite: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
}

const mockRentals: RentalProperty[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    rent: 2200,
    location: "Downtown, City Center",
    beds: 1,
    baths: 1,
    sqft: 850,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f8c8d7b8b?w=400",
    rating: 4.5,
    description: "Luxurious downtown apartment with city views and modern amenities.",
    amenities: ["Gym", "Pool", "Parking", "Concierge"],
    leaseTerm: "12 months",
    availableDate: "2024-02-01",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  },
  {
    id: 2,
    title: "Family Townhouse",
    rent: 3200,
    location: "Suburban Heights",
    beds: 3,
    baths: 2.5,
    sqft: 1800,
    type: "Townhouse",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    rating: 4.8,
    description: "Spacious family townhouse with backyard and excellent schools.",
    amenities: ["Backyard", "Garage", "Fireplace", "Updated Kitchen"],
    leaseTerm: "12 months",
    availableDate: "2024-01-15",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  },
  {
    id: 3,
    title: "Waterfront Studio",
    rent: 1800,
    location: "Harbor District",
    beds: 0,
    baths: 1,
    sqft: 600,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
    rating: 4.7,
    description: "Beautiful waterfront studio with marina access.",
    amenities: ["Waterfront", "Marina Access", "Deck", "Modern Design"],
    leaseTerm: "6 months",
    availableDate: "2024-02-15",
    isFavorite: false,
    petsAllowed: false,
    smokingAllowed: false
  },
  {
    id: 4,
    title: "Historic Loft",
    rent: 2800,
    location: "Historic District",
    beds: 2,
    baths: 1,
    sqft: 1200,
    type: "Loft",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    rating: 4.6,
    description: "Restored historic loft with original character and modern updates.",
    amenities: ["Historic", "Fireplace", "Hardwood Floors", "High Ceilings"],
    leaseTerm: "12 months",
    availableDate: "2024-01-30",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  },
  {
    id: 5,
    title: "Luxury Penthouse",
    rent: 8500,
    location: "Uptown Luxury",
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    type: "Penthouse",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    rating: 4.9,
    description: "Ultra-luxurious penthouse with panoramic city views.",
    amenities: ["Panoramic Views", "Concierge", "Private Elevator", "Wine Cellar"],
    leaseTerm: "24 months",
    availableDate: "2024-03-01",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  },
  {
    id: 6,
    title: "Cozy Studio",
    rent: 1200,
    location: "First Time Renter Area",
    beds: 0,
    baths: 1,
    sqft: 500,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    rating: 4.3,
    description: "Perfect starter rental with great location and amenities.",
    amenities: ["Affordable", "Good Location", "Updated", "Laundry"],
    leaseTerm: "6 months",
    availableDate: "2024-01-20",
    isFavorite: false,
    petsAllowed: false,
    smokingAllowed: false
  },
  {
    id: 7,
    title: "Student Housing",
    rent: 900,
    location: "University District",
    beds: 1,
    baths: 1,
    sqft: 400,
    type: "Student",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    rating: 4.4,
    description: "Affordable student housing near university campus.",
    amenities: ["Student Discount", "Study Room", "WiFi", "Security"],
    leaseTerm: "9 months",
    availableDate: "2024-02-01",
    isFavorite: false,
    petsAllowed: false,
    smokingAllowed: false
  },
  {
    id: 8,
    title: "Mountain Cabin",
    rent: 3500,
    location: "Mountain View",
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "Cabin",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
    rating: 4.8,
    description: "Stunning mountain cabin with breathtaking views.",
    amenities: ["Mountain Views", "Fireplace", "Deck", "Privacy"],
    leaseTerm: "12 months",
    availableDate: "2024-02-15",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  },
  {
    id: 9,
    title: "Modern Loft",
    rent: 2400,
    location: "Arts District",
    beds: 1,
    baths: 1,
    sqft: 900,
    type: "Loft",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    rating: 4.2,
    description: "Industrial-chic loft in the heart of the arts district.",
    amenities: ["High Ceilings", "Exposed Brick", "Arts District", "Modern"],
    leaseTerm: "12 months",
    availableDate: "2024-01-25",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  },
  {
    id: 10,
    title: "Golf Course Villa",
    rent: 6500,
    location: "Country Club",
    beds: 4,
    baths: 3.5,
    sqft: 2800,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    rating: 4.9,
    description: "Magnificent villa on the golf course with luxury amenities.",
    amenities: ["Golf Course", "Pool", "Tennis Court", "Wine Cellar"],
    leaseTerm: "24 months",
    availableDate: "2024-03-15",
    isFavorite: false,
    petsAllowed: true,
    smokingAllowed: false
  }
];

const RentPage: React.FC = () => {
  const [rentals, setRentals] = useState<RentalProperty[]>(mockRentals);
  const [searchTerm, setSearchTerm] = useState('');
  const [rentRange, setRentRange] = useState<number[]>([0, 10000]);
  const [propertyType, setPropertyType] = useState('all');
  const [beds, setBeds] = useState('all');
  const [sortBy, setSortBy] = useState('rent');
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<RentalProperty | null>(null);
  const [applicationStep, setApplicationStep] = useState(0);

  const handleFavorite = (propertyId: number) => {
    setRentals(rentals.map(prop => 
      prop.id === propertyId 
        ? { ...prop, isFavorite: !prop.isFavorite }
        : prop
    ));
    setSnackbar({ open: true, message: 'Property added to favorites!', severity: 'success' });
  };

  const handleApplyNow = (property: RentalProperty) => {
    setSelectedProperty(property);
    setApplicationDialog(true);
    setApplicationStep(0);
  };

  const handleApplicationSubmit = () => {
    setSnackbar({ open: true, message: 'Application submitted successfully!', severity: 'success' });
    setApplicationDialog(false);
  };

  const filteredRentals = rentals.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRent = property.rent >= rentRange[0] && property.rent <= rentRange[1];
    const matchesType = propertyType === 'all' || property.type === propertyType;
    const matchesBeds = beds === 'all' || property.beds >= parseInt(beds);
    
    return matchesSearch && matchesRent && matchesType && matchesBeds;
  });

  const sortedRentals = [...filteredRentals].sort((a, b) => {
    switch (sortBy) {
      case 'rent':
        return a.rent - b.rent;
      case 'rent-desc':
        return b.rent - a.rent;
      case 'rating':
        return b.rating - a.rating;
      case 'beds':
        return b.beds - a.beds;
      default:
        return 0;
    }
  });

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rent);
  };

  const applicationSteps = [
    'Personal Information',
    'Employment Details',
    'Rental History',
    'References',
    'Review & Submit'
  ];

  return (
    <PageTemplate title="Find Your Perfect Rental" subtitle="Discover rental properties that fit your lifestyle and budget">
      <Box>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Available Rentals" />
          <Tab label="My Applications" />
          <Tab label="Saved Properties" />
        </Tabs>

        {tabValue === 0 && (
          <>
            {/* Search and Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', mb: 2 }}>
                <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
                Search & Filters
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Search by location or property name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    label="Property Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="Townhouse">Townhouse</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                    <MenuItem value="Loft">Loft</MenuItem>
                    <MenuItem value="Penthouse">Penthouse</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Bedrooms</InputLabel>
                  <Select
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    label="Bedrooms"
                  >
                    <MenuItem value="all">Any</MenuItem>
                    <MenuItem value="0">Studio</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="rent">Rent (Low to High)</MenuItem>
                    <MenuItem value="rent-desc">Rent (High to Low)</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="beds">Bedrooms</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Rent Range: {formatRent(rentRange[0])} - {formatRent(rentRange[1])}</Typography>
                <Slider
                  value={rentRange}
                  onChange={(_, newValue) => setRentRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={100}
                />
              </Box>
            </Paper>

            {/* Results Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#1a365d' }}>
                {sortedRentals.length} rental properties found
              </Typography>
            </Box>

            {/* Rental Property Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {sortedRentals.map((property) => (
                <Card key={property.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
                      {formatRent(property.rent)}/month
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
                        {property.beds === 0 ? 'Studio' : `${property.beds} beds`}
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
                      {property.amenities.slice(0, 3).map((amenity, index) => (
                        <Chip
                          key={index}
                          label={amenity}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Send />}
                        onClick={() => handleApplyNow(property)}
                        sx={{
                          backgroundColor: '#1a365d',
                          '&:hover': { backgroundColor: '#0d2340' }
                        }}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1a365d', mb: 2 }}>
              My Applications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No applications submitted yet. Apply to properties to see them here.
            </Typography>
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1a365d', mb: 2 }}>
              Saved Properties
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No saved properties yet. Click the heart icon to save properties.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Application Dialog */}
      <Dialog open={applicationDialog} onClose={() => setApplicationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Rental Application - {selectedProperty?.title}
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={applicationStep} orientation="vertical">
            {applicationSteps.map((step, index) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
                <StepContent>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Step {index + 1} content will be implemented here.
                    </Typography>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleApplicationSubmit}
            variant="contained"
            sx={{ backgroundColor: '#1a365d' }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Placeholder Rental Cards */}
      <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
        Featured Rentals
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {Array.from({ length: 10 }, (_, index) => (
          <Card key={`rental-placeholder-${index}`} sx={{ 
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
              image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Rental+Property+${index + 1}`}
              alt={`Rental Property ${index + 1}`}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                Rental Property #{index + 1}
              </Typography>
              
              <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                ${(1500 + index * 200)}/month
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
                    {2 + (index % 2)} beds
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <BathtubIcon sx={{ color: '#718096', fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {1 + (index % 2)} baths
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SquareFootIcon sx={{ color: '#718096', fontSize: 20, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {(800 + index * 50).toLocaleString()} sqft
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
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageTemplate>
  );
};

export default RentPage; 