import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as SquareFootIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const ManageListings: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock listings data
  const listings = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      address: '123 Main St, Downtown',
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      status: 'active',
      type: 'apartment',
      images: ['/placeholder-property-1.jpg'],
      listedDate: '2024-01-01',
      views: 45,
      inquiries: 8,
    },
    {
      id: 2,
      title: 'Cozy Suburban House',
      address: '456 Oak Ave, Suburbs',
      price: 3200,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      status: 'pending',
      type: 'house',
      images: ['/placeholder-property-2.jpg'],
      listedDate: '2024-01-05',
      views: 32,
      inquiries: 5,
    },
    {
      id: 3,
      title: 'Luxury Condo with View',
      address: '789 Pine St, Uptown',
      price: 4500,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      status: 'draft',
      type: 'condo',
      images: ['/placeholder-property-3.jpg'],
      listedDate: '2024-01-10',
      views: 0,
      inquiries: 0,
    },
    {
      id: 4,
      title: 'Family Home with Garden',
      address: '321 Elm St, Residential',
      price: 3800,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      status: 'rented',
      type: 'house',
      images: ['/placeholder-property-4.jpg'],
      listedDate: '2023-12-15',
      views: 67,
      inquiries: 12,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'default';
      case 'rented': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment': return <HomeIcon />;
      case 'house': return <HomeIcon />;
      case 'condo': return <HomeIcon />;
      default: return <HomeIcon />;
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, listingId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleCreateListing = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = () => {
    console.log('Edit listing:', selectedListing);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete listing:', selectedListing);
    handleMenuClose();
  };

  const handleView = () => {
    console.log('View listing:', selectedListing);
    handleMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Property Listings
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'grid'}
                onChange={(e) => setViewMode(e.target.checked ? 'grid' : 'list')}
              />
            }
            label="Grid View"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateListing}
            sx={{ bgcolor: brandColors.primary }}
          >
            Create Listing
          </Button>
        </Box>
      </Box>

      {/* Listings Grid */}
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} key={listing.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Property Image */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(listing.images[0])`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Chip
                    label={listing.status.toUpperCase()}
                    color={getStatusColor(listing.status) as any}
                    size="small"
                  />
                </Box>
                <IconButton
                  sx={{ position: 'absolute', top: 8, left: 8 }}
                  onClick={(e) => handleMenuClick(e, listing.id)}
                >
                  <MoreVertIcon sx={{ color: brandColors.text.inverse }} />
                </IconButton>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                {/* Property Details */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {listing.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {listing.address}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                    listing.price.toLocaleString()/month
                  </Typography>
                </Box>

                {/* Property Features */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BedIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2">{listing.bedrooms}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BathIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2">{listing.bathrooms}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SquareFootIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2">{listing.sqft} sqft</Typography>
                  </Box>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {listing.views} views
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {listing.inquiries} inquiries
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Listed {new Date(listing.listedDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Listing
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Listing
        </MenuItem>
      </Menu>

      {/* Create Listing Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Listing</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Property Title"
              fullWidth
              placeholder="e.g., Modern Downtown Apartment"
            />
            <TextField
              label="Address"
              fullWidth
              placeholder="e.g., 123 Main St, City, State"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Monthly Rent"
                  type="number"
                  fullWidth
                  placeholder="2500"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select label="Property Type">
                    <MenuItem value="apartment">Apartment</MenuItem>
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="condo">Condo</MenuItem>
                    <MenuItem value="townhouse">Townhouse</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Bedrooms"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Bathrooms"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Square Feet"
                  type="number"
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              placeholder="Describe the property, amenities, and what makes it special..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">Create Listing</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageListings;
