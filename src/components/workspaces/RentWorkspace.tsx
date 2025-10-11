import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Rating,
  Slider,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bath as BathIcon,
  SquareFoot as SquareFootIcon,
  Pets as PetsIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  AcUnit as AcIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingIcon,
  DirectionsCar as TransportationIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  VideoCall as VideoCallIcon,
  Assignment as ApplicationIcon,
  CreditCard as PaymentIcon,
  HomeWork as PropertyIcon,
  Timeline as TimelineIcon,
  Assessment as AnalyticsIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Bookmark as BookmarkIcon,
  Compare as CompareIcon,
  Map as MapIcon,
  PhotoLibrary as PhotoIcon,
  VirtualTour as VirtualTourIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface RentWorkspaceProps {
  activeTab: string;
}

const RentWorkspace: React.FC<RentWorkspaceProps> = ({ activeTab }) => {
  // State for different components
  const [searchTab, setSearchTab] = useState('property-search');
  const [favoritesTab, setFavoritesTab] = useState('saved-properties');
  const [applicationsTab, setApplicationsTab] = useState('active-applications');
  const [paymentsTab, setPaymentsTab] = useState('rent-payments');
  const [messagesTab, setMessagesTab] = useState('landlord-communication');
  const [documentsTab, setDocumentsTab] = useState('lease-documents');
  const [calendarTab, setCalendarTab] = useState('viewing-schedule');
  const [assistantTab, setAssistantTab] = useState('rental-assistant');
  const [analyticsTab, setAnalyticsTab] = useState('rental-analytics');

  // Search filters state
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    minRent: 0,
    maxRent: 10000,
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    petFriendly: false,
    furnished: false,
    parking: false,
    amenities: [] as string[],
    moveInDate: '',
    leaseLength: '',
    maxCommute: 30,
  });

  // Sample property data
  const sampleProperties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      address: "123 Main St, Downtown",
      price: 2800,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      images: ["/P1.jpg", "/P2.jpg"],
      amenities: ["Wifi", "Parking", "AC", "Gym"],
      petFriendly: true,
      furnished: false,
      rating: 4.5,
      reviews: 23,
      availableDate: "2024-02-01",
      leaseLength: "12 months",
      description: "Beautiful modern apartment in the heart of downtown with amazing city views.",
      landlord: {
        name: "John Smith",
        avatar: "/logo.png",
        rating: 4.8,
        responseTime: "2 hours",
        verified: true,
      },
      commute: {
        downtown: 15,
        airport: 25,
        university: 20,
      },
      nearby: {
        schools: ["Downtown Elementary", "City High School"],
        hospitals: ["City Medical Center"],
        restaurants: ["Downtown Bistro", "City Cafe"],
        shopping: ["Downtown Mall", "City Market"],
        transportation: ["Main St Bus Stop", "Downtown Metro"],
      },
    },
    {
      id: 2,
      title: "Cozy Suburban House",
      address: "456 Oak Ave, Suburbia",
      price: 2200,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1500,
      images: ["/P3.jpg", "/P4.jpg"],
      amenities: ["Wifi", "Parking", "Pool", "Garden"],
      petFriendly: true,
      furnished: true,
      rating: 4.2,
      reviews: 15,
      availableDate: "2024-01-15",
      leaseLength: "6 months",
      description: "Charming house in quiet neighborhood perfect for families.",
      landlord: {
        name: "Sarah Johnson",
        avatar: "/logo.png",
        rating: 4.6,
        responseTime: "1 hour",
        verified: true,
      },
      commute: {
        downtown: 35,
        airport: 45,
        university: 30,
      },
      nearby: {
        schools: ["Oak Elementary", "Suburbia High"],
        hospitals: ["Suburbia Medical"],
        restaurants: ["Oak Cafe", "Garden Bistro"],
        shopping: ["Oak Mall", "Suburbia Market"],
        transportation: ["Oak Ave Bus Stop"],
      },
    },
  ];

  const amenities = [
    "Wifi", "Parking", "AC", "Pool", "Gym", "Laundry", "Dishwasher", "Balcony", 
    "Garden", "Pet Friendly", "Furnished", "Utilities Included", "Security", "Elevator"
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <RentDashboard />;
      case 'search':
        return <PropertySearch />;
      case 'favorites':
        return <Favorites />;
      case 'applications':
        return <Applications />;
      case 'payments':
        return <Payments />;
      case 'messages':
        return <Messages />;
      case 'documents':
        return <Documents />;
      case 'calendar':
        return <Calendar />;
      case 'assistant':
        return <RentalAssistant />;
      case 'analytics':
        return <RentalAnalytics />;
      default:
        return <RentDashboard />;
    }
  };

  const RentDashboard = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Rental Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.card }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PropertyIcon sx={{ color: brandColors.primary, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Saved Properties</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>12</Typography>
            <Typography variant="body2" color="text.secondary">+3 this week</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.card }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ApplicationIcon sx={{ color: brandColors.success, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Active Applications</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandColors.success, fontWeight: 'bold' }}>3</Typography>
            <Typography variant="body2" color="text.secondary">2 pending review</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.card }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MoneyIcon sx={{ color: brandColors.warning, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Monthly Budget</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandColors.warning, fontWeight: 'bold' }}>$2,500</Typography>
            <Typography variant="body2" color="text.secondary">Max rent limit</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds.card }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ color: brandColors.info, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Viewings</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandColors.info, fontWeight: 'bold' }}>5</Typography>
            <Typography variant="body2" color="text.secondary">This week</Typography>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Activity
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Application submitted for Downtown Apartment"
                  secondary="2 hours ago"
                />
                <Chip label="Pending" color="warning" size="small" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Viewing scheduled for Suburban House"
                  secondary="Yesterday"
                />
                <Chip label="Confirmed" color="success" size="small" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="New message from Sarah Johnson"
                  secondary="2 days ago"
                />
                <Chip label="Unread" color="primary" size="small" />
              </ListItem>
            </List>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" startIcon={<SearchIcon />} fullWidth>
                Search Properties
              </Button>
              <Button variant="outlined" startIcon={<ApplicationIcon />} fullWidth>
                Submit Application
              </Button>
              <Button variant="outlined" startIcon={<CalendarIcon />} fullWidth>
                Schedule Viewing
              </Button>
              <Button variant="outlined" startIcon={<ChatIcon />} fullWidth>
                Contact Landlord
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const PropertySearch = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Property Search
      </Typography>

      {/* Search Filters */}
      <Card sx={{ p: 3, mb: 3, backgroundColor: brandColors.backgrounds.card }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Search Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              value={searchFilters.location}
              onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
              placeholder="City, neighborhood, or address"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Min Rent"
              type="number"
              value={searchFilters.minRent}
              onChange={(e) => setSearchFilters({...searchFilters, minRent: Number(e.target.value)})}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Max Rent"
              type="number"
              value={searchFilters.maxRent}
              onChange={(e) => setSearchFilters({...searchFilters, maxRent: Number(e.target.value)})}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Bedrooms</InputLabel>
              <Select
                value={searchFilters.bedrooms}
                onChange={(e) => setSearchFilters({...searchFilters, bedrooms: e.target.value})}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="1">1+</MenuItem>
                <MenuItem value="2">2+</MenuItem>
                <MenuItem value="3">3+</MenuItem>
                <MenuItem value="4">4+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Bathrooms</InputLabel>
              <Select
                value={searchFilters.bathrooms}
                onChange={(e) => setSearchFilters({...searchFilters, bathrooms: e.target.value})}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="1">1+</MenuItem>
                <MenuItem value="2">2+</MenuItem>
                <MenuItem value="3">3+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Amenities</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  clickable
                  color={searchFilters.amenities.includes(amenity) ? 'primary' : 'default'}
                  onClick={() => {
                    const newAmenities = searchFilters.amenities.includes(amenity)
                      ? searchFilters.amenities.filter(a => a !== amenity)
                      : [...searchFilters.amenities, amenity];
                    setSearchFilters({...searchFilters, amenities: newAmenities});
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={searchFilters.petFriendly}
                  onChange={(e) => setSearchFilters({...searchFilters, petFriendly: e.target.checked})}
                />
              }
              label="Pet Friendly"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={searchFilters.furnished}
                  onChange={(e) => setSearchFilters({...searchFilters, furnished: e.target.checked})}
                />
              }
              label="Furnished"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<SearchIcon />}>
            Search Properties
          </Button>
          <Button variant="outlined" startIcon={<FilterIcon />}>
            Advanced Filters
          </Button>
        </Box>
      </Card>

      {/* Property Results */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Available Properties ({sampleProperties.length})
      </Typography>
      
      <Grid container spacing={3}>
        {sampleProperties.map((property) => (
          <Grid item xs={12} md={6} key={property.id}>
            <Card sx={{ backgroundColor: brandColors.backgrounds.card }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${property.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }}
                >
                  <FavoriteIcon color="error" />
                </IconButton>
                <Chip
                  label={`$${property.price}/month`}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {property.address}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BedIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{property.bedrooms}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BathIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{property.bathrooms}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SquareFootIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{property.sqft} sqft</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={property.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({property.reviews} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <Chip key={amenity} label={amenity} size="small" />
                  ))}
                  {property.amenities.length > 3 && (
                    <Chip label={`+${property.amenities.length - 3} more`} size="small" variant="outlined" />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Available: {property.availableDate} • {property.leaseLength}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" size="small" startIcon={<CalendarIcon />}>
                    Schedule Viewing
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<ApplicationIcon />}>
                    Apply Now
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<ShareIcon />}>
                    Share
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const Favorites = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Saved Properties
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Properties you've saved for future reference
      </Typography>
      
      <Grid container spacing={3}>
        {sampleProperties.map((property) => (
          <Grid item xs={12} key={property.id}>
            <Card sx={{ backgroundColor: brandColors.backgrounds.card }}>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${property.images[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {property.title}
                      </Typography>
                      <IconButton color="error">
                        <FavoriteIcon />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {property.address}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 'bold', mb: 2 }}>
                      ${property.price}/month
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BedIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{property.bedrooms} beds</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BathIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{property.bathrooms} baths</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SquareFootIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">{property.sqft} sqft</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={property.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({property.reviews} reviews)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" size="small" startIcon={<CalendarIcon />}>
                        Schedule Viewing
                      </Button>
                      <Button variant="outlined" size="small" startIcon={<ApplicationIcon />}>
                        Apply Now
                      </Button>
                      <Button variant="outlined" size="small" startIcon={<CompareIcon />}>
                        Compare
                      </Button>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const Applications = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Rental Applications
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Application Status
            </Typography>
            
            <List>
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Modern Downtown Apartment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted: January 15, 2024
                    </Typography>
                  </Box>
                  <Chip label="Under Review" color="warning" />
                </Box>
              </ListItem>
              
              <ListItem>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Cozy Suburban House
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted: January 10, 2024
                    </Typography>
                  </Box>
                  <Chip label="Approved" color="success" />
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Apply
            </Typography>
            <Button variant="contained" fullWidth startIcon={<ApplicationIcon />}>
              Start New Application
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const Payments = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Rent Payments
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your rent payments and payment history
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Payment Methods
            </Typography>
            <List>
              <ListItem>
                <CreditCard sx={{ mr: 2 }} />
                <ListItemText
                  primary="**** **** **** 1234"
                  secondary="Primary payment method"
                />
                <Button size="small">Edit</Button>
              </ListItem>
            </List>
            <Button variant="outlined" startIcon={<CreditCard />} sx={{ mt: 2 }}>
              Add Payment Method
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Payments
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="January 2024 Rent"
                  secondary="Paid on January 1, 2024"
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  $2,800
                </Typography>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const Messages = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Messages
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Communicate with landlords and property managers
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider' }}>
              Conversations
            </Typography>
            <List>
              <ListItem>
                <Avatar sx={{ mr: 2 }}>JS</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    John Smith
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Modern Downtown Apartment
                  </Typography>
                </Box>
                <Badge color="primary" badgeContent={2} />
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: brandColors.backgrounds.card, height: 400 }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider' }}>
              John Smith - Modern Downtown Apartment
            </Typography>
            <Box sx={{ p: 2, height: 300, overflow: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                No messages yet. Start a conversation with your landlord.
              </Typography>
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <ChatIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const Documents = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Lease Documents
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Access and manage your rental documents
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Lease Agreement
            </Typography>
            <List>
              <ListItem>
                <Assignment sx={{ mr: 2 }} />
                <ListItemText
                  primary="Standard Lease Agreement"
                  secondary="Last updated: January 15, 2024"
                />
                <Button size="small">View</Button>
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Required Documents
            </Typography>
            <List>
              <ListItem>
                <CheckIcon color="success" sx={{ mr: 2 }} />
                <ListItemText primary="ID Verification" />
              </ListItem>
              <ListItem>
                <CheckIcon color="success" sx={{ mr: 2 }} />
                <ListItemText primary="Income Verification" />
              </ListItem>
              <ListItem>
                <CheckIcon color="success" sx={{ mr: 2 }} />
                <ListItemText primary="Background Check" />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const Calendar = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Viewing Calendar
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Schedule and manage property viewings
      </Typography>
      
      <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Upcoming Viewings
        </Typography>
        <List>
          <ListItem>
            <CalendarIcon sx={{ mr: 2, color: brandColors.primary }} />
            <ListItemText
              primary="Modern Downtown Apartment"
              secondary="January 20, 2024 at 2:00 PM"
            />
            <Button size="small" variant="outlined">Reschedule</Button>
          </ListItem>
        </List>
      </Card>
    </Box>
  );

  const RentalAssistant = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Rental Assistant
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        AI-powered assistance for your rental journey
      </Typography>
      
      <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Ask me anything about rentals
        </Typography>
        <TextField
          fullWidth
          placeholder="What questions do you have about renting?"
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" startIcon={<ChatIcon />}>
          Get Help
        </Button>
      </Card>
    </Box>
  );

  const RentalAnalytics = () => (
    <Box>
      <Typography variant="h4" sx={{ color: brandColors.primary, mb: 3, fontWeight: 'bold' }}>
        Rental Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Insights and trends in your rental search
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Search Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Analytics coming soon...
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: brandColors.backgrounds.card }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Market Trends
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Market insights coming soon...
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      {renderTabContent()}
    </Box>
  );
};

export default RentWorkspace;
