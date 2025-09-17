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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Handshake as HandshakeIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const InvestJointVenture: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJV, setSelectedJV] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Mock joint venture opportunities data
  const jvOpportunities = [
    {
      id: 1,
      title: 'Downtown Mixed-Use Development',
      description: 'Joint venture opportunity for a large-scale mixed-use development in prime downtown location',
      image: '/placeholder-jv-1.jpg',
      totalInvestment: 5000000,
      availableInvestment: 2000000,
      minInvestment: 100000,
      expectedReturn: 18.0,
      riskLevel: 'medium',
      location: 'Downtown, City',
      status: 'active',
      daysLeft: 30,
      rating: 4.7,
      category: 'mixed-use',
      partner: 'ABC Development Group',
      partnerRating: 4.8,
      partnerExperience: '15 years',
      features: ['Prime Location', 'Experienced Partner', 'High ROI'],
      isFavorite: false,
      partnershipTerms: '50/50 profit sharing, 3-year term',
      dueDiligence: 'Completed',
    },
    {
      id: 2,
      title: 'Luxury Residential Complex',
      description: 'Joint venture for luxury residential development with resort-style amenities',
      image: '/placeholder-jv-2.jpg',
      totalInvestment: 3000000,
      availableInvestment: 1500000,
      minInvestment: 75000,
      expectedReturn: 22.0,
      riskLevel: 'high',
      location: 'Uptown, City',
      status: 'active',
      daysLeft: 45,
      rating: 4.5,
      category: 'residential',
      partner: 'Luxury Homes LLC',
      partnerRating: 4.6,
      partnerExperience: '12 years',
      features: ['Luxury Market', 'High-End Amenities', 'Premium Location'],
      isFavorite: true,
      partnershipTerms: '60/40 profit sharing, 2-year term',
      dueDiligence: 'In Progress',
    },
    {
      id: 3,
      title: 'Industrial Warehouse Park',
      description: 'Joint venture for large-scale industrial development with long-term lease agreements',
      image: '/placeholder-jv-3.jpg',
      totalInvestment: 8000000,
      availableInvestment: 3000000,
      minInvestment: 200000,
      expectedReturn: 15.0,
      riskLevel: 'low',
      location: 'Industrial Zone',
      status: 'active',
      daysLeft: 60,
      rating: 4.3,
      category: 'industrial',
      partner: 'Industrial Partners Inc',
      partnerRating: 4.9,
      partnerExperience: '20 years',
      features: ['Stable Returns', 'Long-term Leases', 'Low Risk'],
      isFavorite: false,
      partnershipTerms: '70/30 profit sharing, 5-year term',
      dueDiligence: 'Completed',
    },
    {
      id: 4,
      title: 'Retail Entertainment District',
      description: 'Joint venture for retail and entertainment complex with anchor tenants',
      image: '/placeholder-jv-4.jpg',
      totalInvestment: 4000000,
      availableInvestment: 0,
      minInvestment: 150000,
      expectedReturn: 20.0,
      riskLevel: 'medium',
      location: 'Entertainment District',
      status: 'funded',
      daysLeft: 0,
      rating: 4.4,
      category: 'retail',
      partner: 'Retail Ventures Group',
      partnerRating: 4.5,
      partnerExperience: '18 years',
      features: ['Anchor Tenants', 'High Traffic', 'Entertainment Focus'],
      isFavorite: false,
      partnershipTerms: '55/45 profit sharing, 4-year term',
      dueDiligence: 'Completed',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Opportunities' },
    { value: 'mixed-use', label: 'Mixed-Use' },
    { value: 'residential', label: 'Residential' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'retail', label: 'Retail' },
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

  const calculateProgress = (available: number, total: number) => {
    return ((total - available) / total) * 100;
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, jvId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedJV(jvId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJV(null);
  };

  const handleInvest = (jvId: number) => {
    setSelectedJV(jvId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setInvestmentAmount('');
  };

  const handleInvestConfirm = () => {
    console.log('Investing', investmentAmount, 'in JV', selectedJV);
    handleCloseDialog();
  };

  const handleFavorite = (jvId: number) => {
    console.log('Toggle favorite for JV', jvId);
  };

  const handleShare = (jvId: number) => {
    console.log('Share JV opportunity', jvId);
  };

  const filteredJVs = selectedTab === 0 ? jvOpportunities : jvOpportunities.filter(jv => jv.status === 'active');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Joint Venture Opportunities
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
            Create JV
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="All Opportunities" />
          <Tab label="Active JVs" />
          <Tab label="My Partnerships" />
          <Tab label="Favorites" />
        </Tabs>
      </Box>

      {/* JV Opportunities Grid */}
      <Grid container spacing={3}>
        {filteredJVs.map((jv) => (
          <Grid item xs={12} sm={6} md={4} key={jv.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* JV Image */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${jv.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Chip
                    label={jv.status.toUpperCase()}
                    color={getStatusColor(jv.status) as any}
                    size="small"
                  />
                </Box>
                <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleFavorite(jv.id)}
                    sx={{ 
                      color: jv.isFavorite ? 'red' : 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    {jv.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleShare(jv.id)}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Box>
                <IconButton
                  sx={{ position: 'absolute', bottom: 8, right: 8 }}
                  onClick={(e) => handleMenuClick(e, jv.id)}
                >
                  <MoreVertIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                {/* JV Details */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {jv.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {jv.description}
                </Typography>

                {/* Partner Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: brandColors.primary, mr: 1, width: 32, height: 32 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {jv.partner}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={jv.partnerRating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        {jv.partnerExperience}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Investment Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {calculateProgress(jv.availableInvestment, jv.totalInvestment).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(jv.availableInvestment, jv.totalInvestment)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      ${(jv.totalInvestment - jv.availableInvestment).toLocaleString()} invested
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ${jv.totalInvestment.toLocaleString()} total
                    </Typography>
                  </Box>
                </Box>

                {/* JV Stats */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        Min: ${jv.minInvestment.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {jv.expectedReturn}% return
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SecurityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Chip
                        label={jv.riskLevel}
                        size="small"
                        color={getRiskColor(jv.riskLevel) as any}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HandshakeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        JV Partner
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Partnership Terms */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Partnership: {jv.partnershipTerms}
                  </Typography>
                </Box>

                {/* Features */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {jv.features.map((feature, index) => (
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
                    📍 {jv.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {jv.daysLeft > 0 ? `${jv.daysLeft} days left` : 'Completed'}
                  </Typography>
                </Box>

                {/* Invest Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleInvest(jv.id)}
                  disabled={jv.status !== 'active' || jv.availableInvestment === 0}
                  sx={{ bgcolor: brandColors.primary }}
                >
                  {jv.status === 'active' && jv.availableInvestment > 0 ? 'Join Venture' : 'View Details'}
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
        <MenuItem onClick={() => console.log('View details', selectedJV)}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => console.log('Add to favorites', selectedJV)}>
          <StarIcon sx={{ mr: 1 }} />
          Add to Favorites
        </MenuItem>
        <MenuItem onClick={() => console.log('Share JV', selectedJV)}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Opportunity
        </MenuItem>
      </Menu>

      {/* Investment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Join Joint Venture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="h6">
              {jvOpportunities.find(jv => jv.id === selectedJV)?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {jvOpportunities.find(jv => jv.id === selectedJV)?.description}
            </Typography>
            
            <Divider />
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Partnership Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Partner: {jvOpportunities.find(jv => jv.id === selectedJV)?.partner}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Terms: {jvOpportunities.find(jv => jv.id === selectedJV)?.partnershipTerms}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due Diligence: {jvOpportunities.find(jv => jv.id === selectedJV)?.dueDiligence}
            </Typography>
            
            <TextField
              label="Investment Amount ($)"
              type="number"
              fullWidth
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter amount"
              helperText={`Minimum investment: $${jvOpportunities.find(jv => jv.id === selectedJV)?.minInvestment.toLocaleString()}`}
            />
            <Typography variant="body2" color="text.secondary">
              Expected return: {jvOpportunities.find(jv => jv.id === selectedJV)?.expectedReturn}% annually
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleInvestConfirm}
            disabled={!investmentAmount || parseInt(investmentAmount) < (jvOpportunities.find(jv => jv.id === selectedJV)?.minInvestment || 0)}
          >
            Join Venture
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvestJointVenture;
