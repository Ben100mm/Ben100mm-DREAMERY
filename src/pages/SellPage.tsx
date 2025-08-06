import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  PhotoCamera as PhotoIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const FeatureCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProgressSection = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MarketCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockMarketData = {
  averageDaysOnMarket: 45,
  averagePrice: "$485,000",
  pricePerSqFt: "$245",
  marketTrend: "+3.2%",
  inventoryLevel: "Low",
  buyerDemand: "High"
};

const mockSellerTools = [
  {
    id: 1,
    title: "Property Valuation",
    description: "Get an accurate estimate of your property's market value",
    icon: <AssessmentIcon />,
    status: "Available"
  },
  {
    id: 2,
    title: "Market Analysis",
    description: "Understand current market conditions and trends",
    icon: <TrendingIcon />,
    status: "Available"
  },
  {
    id: 3,
    title: "Professional Photos",
    description: "High-quality photography to showcase your property",
    icon: <PhotoIcon />,
    status: "Available"
  },
  {
    id: 4,
    title: "Listing Management",
    description: "Manage your property listing and track inquiries",
    icon: <VisibilityIcon />,
    status: "Available"
  },
  {
    id: 5,
    title: "Offer Management",
    description: "Review and respond to offers efficiently",
    icon: <OfferIcon />,
    status: "Available"
  },
  {
    id: 6,
    title: "Closing Support",
    description: "Get help with the closing process and paperwork",
    icon: <HandshakeIcon />,
    status: "Available"
  }
];

const SellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [listingStep, setListingStep] = useState(0);
  const [propertyData, setPropertyData] = useState({
    address: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    askingPrice: '',
    description: ''
  });

  const handlePropertyDataChange = (field: string, value: string) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const listingSteps = [
    {
      label: 'Property Details',
      description: 'Enter basic information about your property',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Property Address"
              value={propertyData.address}
              onChange={(e) => handlePropertyDataChange('address', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Property Type</InputLabel>
              <Select
                value={propertyData.propertyType}
                label="Property Type"
                onChange={(e) => handlePropertyDataChange('propertyType', e.target.value)}
              >
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="condo">Condo</MenuItem>
                <MenuItem value="townhouse">Townhouse</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Bedrooms"
              type="number"
              value={propertyData.bedrooms}
              onChange={(e) => handlePropertyDataChange('bedrooms', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Bathrooms"
              type="number"
              value={propertyData.bathrooms}
              onChange={(e) => handlePropertyDataChange('bathrooms', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Square Footage"
              type="number"
              value={propertyData.squareFootage}
              onChange={(e) => handlePropertyDataChange('squareFootage', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Asking Price"
              value={propertyData.askingPrice}
              onChange={(e) => handlePropertyDataChange('askingPrice', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Property Description"
              multiline
              rows={4}
              value={propertyData.description}
              onChange={(e) => handlePropertyDataChange('description', e.target.value)}
              margin="normal"
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Photos & Media',
      description: 'Upload photos and videos of your property',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Upload high-quality photos and videos to showcase your property effectively.
          </Typography>
          <Button variant="outlined" startIcon={<PhotoIcon />}>
            Upload Photos
          </Button>
        </Box>
      )
    },
    {
      label: 'Review & Publish',
      description: 'Review your listing and publish to the market',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Review all information before publishing your listing.
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Your listing will be visible to potential buyers within 24 hours of publishing.
          </Alert>
          <Button variant="contained" color="primary">
            Publish Listing
          </Button>
        </Box>
      )
    }
  ];

  return (
    <PageTemplate 
      title="Sell Your Property" 
      subtitle="List your property and reach qualified buyers quickly"
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Create Listing" />
          <Tab label="Market Analysis" />
          <Tab label="Seller Tools" />
          <Tab label="My Listings" />
        </Tabs>
      </Box>

      {/* Create Listing Tab */}
      {activeTab === 0 && (
        <Box>
          <ProgressSection>
            <Typography variant="h5" gutterBottom>
              Create Your Property Listing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Follow these steps to create an effective listing that attracts qualified buyers.
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(listingStep / (listingSteps.length - 1)) * 100} 
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Step {listingStep + 1} of {listingSteps.length}
            </Typography>
          </ProgressSection>

          <Stepper activeStep={listingStep} orientation="vertical">
            {listingSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {step.description}
                  </Typography>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setListingStep((prev) => prev + 1)}
                      sx={{ mr: 1 }}
                      disabled={listingStep === listingSteps.length - 1}
                    >
                      {listingStep === listingSteps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={listingStep === 0}
                      onClick={() => setListingStep((prev) => prev - 1)}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Market Analysis Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MarketCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Market Overview
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Average Days on Market: <strong>{mockMarketData.averageDaysOnMarket} days</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Average Sale Price: <strong>{mockMarketData.averagePrice}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Price per Sq Ft: <strong>{mockMarketData.pricePerSqFt}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Market Trend: <strong style={{ color: '#4caf50' }}>{mockMarketData.marketTrend}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Inventory Level: <strong>{mockMarketData.inventoryLevel}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Buyer Demand: <strong>{mockMarketData.buyerDemand}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </MarketCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Insights
                </Typography>
                <Typography variant="body2" paragraph>
                  The current market shows strong buyer demand with limited inventory, 
                  creating favorable conditions for sellers. Properties are selling 
                  faster than the historical average.
                </Typography>
                <Alert severity="success" sx={{ mb: 2 }}>
                  This is a seller's market - great time to list your property!
                </Alert>
                <Button variant="contained" startIcon={<AssessmentIcon />}>
                  Get Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Seller Tools Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {mockSellerTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <FeatureCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2, color: '#1a365d' }}>
                      {tool.icon}
                    </Box>
                    <Chip 
                      label={tool.status} 
                      color="success" 
                      size="small"
                    />
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tool.description}
                  </Typography>
                  <Button variant="outlined" size="small">
                    Access Tool
                  </Button>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* My Listings Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Your Active Listings
          </Typography>
          <Alert severity="info">
            You don't have any active listings yet. Create your first listing to get started!
          </Alert>
        </Box>
      )}
    </PageTemplate>
  );
};

export default SellPage; 