import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Box,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Rating
} from '@mui/material';
import { 
  Campaign as CampaignIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Click as ClickIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const CampaignCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const AnalyticsCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockAdvertisingCampaigns = [
  {
    id: 1,
    name: "Downtown Luxury Condos",
    type: "Property Listing",
    status: "Active",
    budget: "$5,000",
    spent: "$2,850",
    impressions: "45,200",
    clicks: "1,250",
    conversions: "45",
    ctr: "2.8%",
    cpc: "$2.28",
    startDate: "2024-01-01",
    endDate: "2024-02-01"
  },
  {
    id: 2,
    name: "Suburban Family Homes",
    type: "Property Listing",
    status: "Active",
    budget: "$3,500",
    spent: "$1,200",
    impressions: "28,500",
    clicks: "890",
    conversions: "32",
    ctr: "3.1%",
    cpc: "$1.35",
    startDate: "2024-01-05",
    endDate: "2024-02-05"
  },
  {
    id: 3,
    name: "Commercial Office Space",
    type: "Property Listing",
    status: "Paused",
    budget: "$8,000",
    spent: "$4,200",
    impressions: "62,800",
    clicks: "1,650",
    conversions: "28",
    ctr: "2.6%",
    cpc: "$2.55",
    startDate: "2023-12-15",
    endDate: "2024-01-15"
  },
  {
    id: 4,
    name: "Brand Awareness",
    type: "Brand Campaign",
    status: "Active",
    budget: "$10,000",
    spent: "$6,800",
    impressions: "125,000",
    clicks: "3,200",
    conversions: "180",
    ctr: "2.6%",
    cpc: "$2.13",
    startDate: "2024-01-01",
    endDate: "2024-03-01"
  }
];

const mockAdTemplates = [
  {
    id: 1,
    name: "Property Showcase",
    type: "Display Ad",
    size: "728x90",
    description: "Professional property listing with high-quality images",
    preview: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=728&h=90&fit=crop",
    price: "$50"
  },
  {
    id: 2,
    name: "Neighborhood Spotlight",
    type: "Video Ad",
    size: "1920x1080",
    description: "Video showcasing neighborhood amenities and lifestyle",
    preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    price: "$150"
  },
  {
    id: 3,
    name: "Investment Opportunity",
    type: "Rich Media",
    size: "300x600",
    description: "Interactive ad highlighting investment potential",
    preview: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=600&fit=crop",
    price: "$75"
  }
];

const mockAnalyticsData = {
  totalImpressions: "261,500",
  totalClicks: "6,990",
  totalConversions: "285",
  averageCTR: "2.7%",
  averageCPC: "$2.08",
  totalSpent: "$14,550",
  totalBudget: "$26,500"
};

const AdvertisePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  return (
    <PageTemplate 
      title="Advertising & Marketing" 
      subtitle="Promote your properties and grow your real estate business"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Campaigns" />
          <Tab label="Ad Templates" />
          <Tab label="Analytics" />
          <Tab label="Targeting" />
        </Tabs>
      </Box>

      {/* Campaigns Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Advertising Campaigns
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage and track your advertising campaigns across multiple platforms.
          </Typography>

          <Grid container spacing={3}>
            {mockAdvertisingCampaigns.map((campaign) => (
              <Grid item xs={12} md={6} lg={3} key={campaign.id}>
                <CampaignCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {campaign.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {campaign.type}
                        </Typography>
                      </Box>
                      <Chip 
                        label={campaign.status} 
                        color={
                          campaign.status === 'Active' ? 'success' : 
                          campaign.status === 'Paused' ? 'warning' : 
                          'error'
                        }
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Budget:</strong> {campaign.budget}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Spent:</strong> {campaign.spent}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Impressions:</strong> {campaign.impressions}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Clicks:</strong> {campaign.clicks}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Conversions:</strong> {campaign.conversions}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>CTR:</strong> {campaign.ctr}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>CPC:</strong> {campaign.cpc}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {campaign.startDate} - {campaign.endDate}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                      <Button size="small" variant="contained">
                        Manage
                      </Button>
                    </Box>
                  </CardContent>
                </CampaignCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Ad Templates Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ad Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Choose from professional ad templates designed for real estate marketing.
          </Typography>

          <Grid container spacing={3}>
            {mockAdTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <Card>
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <Chip 
                      label={template.type} 
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {template.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Size:</strong> {template.size}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Price:</strong> {template.price}
                      </Typography>
                    </Box>

                    <Button variant="contained" fullWidth>
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Analytics Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Campaign Performance
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track the performance of your advertising campaigns.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Campaign</TableCell>
                        <TableCell align="right">Impressions</TableCell>
                        <TableCell align="right">Clicks</TableCell>
                        <TableCell align="center">CTR</TableCell>
                        <TableCell align="right">Spent</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockAdvertisingCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {campaign.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {campaign.type}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {campaign.impressions}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {campaign.clicks}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {campaign.ctr}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {campaign.spent}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={campaign.status} 
                              color={
                                campaign.status === 'Active' ? 'success' : 
                                campaign.status === 'Paused' ? 'warning' : 
                                'error'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button size="small" variant="outlined">
                              Optimize
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <AnalyticsCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Performance
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Impressions:</strong> {mockAnalyticsData.totalImpressions}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Clicks:</strong> {mockAnalyticsData.totalClicks}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Conversions:</strong> {mockAnalyticsData.totalConversions}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Average CTR:</strong> {mockAnalyticsData.averageCTR}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Average CPC:</strong> {mockAnalyticsData.averageCPC}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Spent:</strong> {mockAnalyticsData.totalSpent}
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  View Detailed Report
                </Button>
              </CardContent>
            </AnalyticsCard>
          </Grid>
        </Grid>
      )}

      {/* Targeting Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Audience Targeting
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Define your target audience for more effective advertising campaigns.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age Range"
                      margin="normal"
                      defaultValue="25-45"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Income Level"
                      margin="normal"
                      defaultValue="$50K-$150K"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      margin="normal"
                      defaultValue="Downtown, Suburban"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Interests"
                      margin="normal"
                      defaultValue="Real Estate, Investment"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Keywords"
                      multiline
                      rows={3}
                      margin="normal"
                      defaultValue="luxury homes, investment properties, downtown condos"
                    />
                  </Grid>
                </Grid>

                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Save Targeting
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Platform Selection
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose advertising platforms for your campaigns.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon><VisibilityIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Google Ads" 
                      secondary="Search and display advertising"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Facebook & Instagram" 
                      secondary="Social media advertising"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Local Listings" 
                      secondary="Zillow, Realtor.com, Trulia"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TrendingIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Programmatic" 
                      secondary="Automated ad buying"
                    />
                  </ListItem>
                </List>

                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Configure Platforms
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </PageTemplate>
  );
};

export default AdvertisePage; 