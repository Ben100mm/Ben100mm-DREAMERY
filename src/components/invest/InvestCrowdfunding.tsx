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
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const InvestCrowdfunding: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Mock crowdfunding deals data
  const deals = [
    {
      id: 1,
      title: 'Downtown Office Complex',
      description: 'Modern office building in prime downtown location with high occupancy rates',
      image: '/placeholder-deal-1.jpg',
      targetAmount: 2000000,
      raisedAmount: 1500000,
      investors: 45,
      minInvestment: 10000,
      expectedReturn: 12.5,
      riskLevel: 'medium',
      location: 'Downtown, City',
      status: 'active',
      daysLeft: 15,
      rating: 4.5,
      category: 'commercial',
      features: ['Prime Location', 'High Occupancy', 'Modern Amenities'],
      isFavorite: false,
    },
    {
      id: 2,
      title: 'Luxury Residential Tower',
      description: 'High-end residential development with resort-style amenities and city views',
      image: '/placeholder-deal-2.jpg',
      targetAmount: 1500000,
      raisedAmount: 1200000,
      investors: 32,
      minInvestment: 5000,
      expectedReturn: 15.0,
      riskLevel: 'low',
      location: 'Uptown, City',
      status: 'active',
      daysLeft: 8,
      rating: 4.8,
      category: 'residential',
      features: ['Luxury Amenities', 'City Views', 'High ROI'],
      isFavorite: true,
    },
    {
      id: 3,
      title: 'Retail Shopping Center',
      description: 'Mixed-use retail and entertainment complex with anchor tenants secured',
      image: '/placeholder-deal-3.jpg',
      targetAmount: 800000,
      raisedAmount: 800000,
      investors: 28,
      minInvestment: 15000,
      expectedReturn: 18.0,
      riskLevel: 'high',
      location: 'Shopping District',
      status: 'funded',
      daysLeft: 0,
      rating: 4.2,
      category: 'retail',
      features: ['Anchor Tenants', 'High Traffic', 'Premium Location'],
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Industrial Warehouse Complex',
      description: 'Large-scale industrial development with long-term lease agreements',
      image: '/placeholder-deal-4.jpg',
      targetAmount: 3000000,
      raisedAmount: 500000,
      investors: 15,
      minInvestment: 25000,
      expectedReturn: 10.0,
      riskLevel: 'low',
      location: 'Industrial Zone',
      status: 'active',
      daysLeft: 22,
      rating: 4.0,
      category: 'industrial',
      features: ['Long-term Leases', 'Stable Returns', 'Low Risk'],
      isFavorite: false,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Deals' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'retail', label: 'Retail' },
    { value: 'industrial', label: 'Industrial' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'funded': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, dealId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedDeal(dealId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDeal(null);
  };

  const handleInvest = (dealId: number) => {
    setSelectedDeal(dealId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setInvestmentAmount('');
  };

  const handleInvestConfirm = () => {
    console.log('Investing', investmentAmount, 'in deal', selectedDeal);
    handleCloseDialog();
  };

  const handleFavorite = (dealId: number) => {
    console.log('Toggle favorite for deal', dealId);
  };

  const handleShare = (dealId: number) => {
    console.log('Share deal', dealId);
  };

  const filteredDeals = selectedTab === 0 ? deals : deals.filter(deal => deal.status === 'active');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Crowdfunded Deals
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category">
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<AddIcon />}>
            Create Deal
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="All Deals" />
          <Tab label="Active Deals" />
          <Tab label="My Investments" />
          <Tab label="Favorites" />
        </Tabs>
      </Box>

      {/* Deals Grid */}
      <Grid container spacing={3}>
        {filteredDeals.map((deal) => (
          <Grid size={{ sm: 6, md: 4, xs: 12 }} key={deal.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Deal Image */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(deal.image)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Chip
                    label={deal.status.toUpperCase()}
                    color={getStatusColor(deal.status) as any}
                    size="small"
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleFavorite(deal.id)}
                    sx={{ 
                      color: deal.isFavorite ? 'red' : 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {deal.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleShare(deal.id)}
                    sx={{ 
                      color: brandColors.text.inverse,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
                <IconButton
                  sx={{ position: 'absolute', bottom: 8, right: 8 }}
                  onClick={(e) => handleMenuClick(e, deal.id)}
                >
                  <MoreVertIcon sx={{ color: brandColors.text.inverse }} />
                </IconButton>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                {/* Deal Details */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {deal.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {deal.description}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={deal.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({deal.rating})
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {calculateProgress(deal.raisedAmount, deal.targetAmount).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(deal.raisedAmount, deal.targetAmount)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      deal.raisedAmount.toLocaleString() raised
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      deal.targetAmount.toLocaleString() target
                    </Typography>
                  </Box>
                </Box>

                {/* Deal Stats */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {deal.investors} investors
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {deal.expectedReturn}% return
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        Min: deal.minInvestment.toLocaleString()
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SecurityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Chip
                        label={deal.riskLevel}
                        size="small"
                        color={getRiskColor(deal.riskLevel) as any}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Features */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {deal.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                {/* Location and Days Left */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    📍 {deal.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {deal.daysLeft > 0 ? `${deal.daysLeft} days left` : 'Completed'}
                  </Typography>
                </Box>

                {/* Invest Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleInvest(deal.id)}
                  disabled={deal.status !== 'active'}
                  sx={{ bgcolor: brandColors.primary }}
                >
                  {deal.status === 'active' ? 'Invest Now' : 'View Details'}
                </Button>
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
        <MenuItem onClick={() => console.log('View details', selectedDeal)}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => console.log('Add to favorites', selectedDeal)}>
          <StarIcon sx={{ mr: 1 }} />
          Add to Favorites
        </MenuItem>
        <MenuItem onClick={() => console.log('Share deal', selectedDeal)}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Deal
        </MenuItem>
      </Menu>

      {/* Investment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Invest in Deal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="h6">
              {deals.find(d => d.id === selectedDeal)?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deals.find(d => d.id === selectedDeal)?.description}
            </Typography>
            <TextField
              label="Investment Amount ($)"
              type="number"
              fullWidth
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter amount"
              helperText={`Minimum investment: $${deals.find(d => d.id === selectedDeal)?.minInvestment.toLocaleString()}`}
            />
            <Typography variant="body2" color="text.secondary">
              Expected return: {deals.find(d => d.id === selectedDeal)?.expectedReturn}% annually
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleInvestConfirm}
            disabled={!investmentAmount || parseInt(investmentAmount) < (deals.find(d => d.id === selectedDeal)?.minInvestment || 0)}
          >
            Confirm Investment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvestCrowdfunding;
