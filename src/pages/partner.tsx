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
  Handshake as HandshakeIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const PartnerCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PartnershipCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockPartnershipOpportunities = [
  {
    id: 1,
    name: "City Development Group",
    type: "Real Estate Developer",
    location: "Downtown, City Center",
    description: "Leading developer specializing in mixed-use properties",
    rating: 4.8,
    status: "Active",
    projects: 15,
    revenue: "$2.5M",
    specialties: ["Mixed-Use", "Commercial", "Residential"],
    contact: "John Smith",
    email: "john.smith@citydev.com",
    phone: "(555) 123-4567"
  },
  {
    id: 2,
    name: "Metro Investment Partners",
    type: "Investment Firm",
    location: "Financial District",
    description: "Private equity firm focused on real estate investments",
    rating: 4.6,
    status: "Active",
    projects: 8,
    revenue: "$1.8M",
    specialties: ["Investment", "Acquisition", "Management"],
    contact: "Sarah Johnson",
    email: "sarah.johnson@metroinvest.com",
    phone: "(555) 234-5678"
  },
  {
    id: 3,
    name: "Premier Property Management",
    type: "Property Management",
    location: "Suburban Heights",
    description: "Full-service property management company",
    rating: 4.4,
    status: "Active",
    projects: 25,
    revenue: "$3.2M",
    specialties: ["Management", "Maintenance", "Tenant Services"],
    contact: "Mike Davis",
    email: "mike.davis@premiermanagement.com",
    phone: "(555) 345-6789"
  },
  {
    id: 4,
    name: "Urban Construction Co.",
    type: "Construction",
    location: "Industrial District",
    description: "Commercial and residential construction services",
    rating: 4.7,
    status: "Active",
    projects: 12,
    revenue: "$4.1M",
    specialties: ["Construction", "Renovation", "Development"],
    contact: "Lisa Wilson",
    email: "lisa.wilson@urbanconstruction.com",
    phone: "(555) 456-7890"
  }
];

const mockActivePartnerships = [
  {
    id: 1,
    partner: "City Development Group",
    project: "Downtown Mixed-Use Complex",
    startDate: "2023-06-01",
    endDate: "2024-12-31",
    status: "In Progress",
    revenue: "$850,000",
    progress: 65
  },
  {
    id: 2,
    partner: "Metro Investment Partners",
    project: "Suburban Office Park",
    startDate: "2023-09-15",
    endDate: "2024-06-30",
    status: "Active",
    revenue: "$620,000",
    progress: 45
  },
  {
    id: 3,
    partner: "Premier Property Management",
    project: "Residential Portfolio Management",
    startDate: "2023-03-01",
    endDate: "2025-02-28",
    status: "Active",
    revenue: "$1,200,000",
    progress: 30
  }
];

const mockPartnershipMetrics = {
  totalPartners: 8,
  activePartnerships: 6,
  totalRevenue: "$2,670,000",
  averageRating: 4.6,
  successRate: "92%"
};

const PartnerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  return (
    <PageTemplate 
      title="Partnership Opportunities" 
      subtitle="Connect with industry partners and grow your real estate business"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Opportunities" />
          <Tab label="Active Partnerships" />
          <Tab label="Partner Directory" />
          <Tab label="Collaboration Tools" />
        </Tabs>
      </Box>

      {/* Opportunities Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Partnership Opportunities
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Discover potential partners and collaboration opportunities in the real estate industry.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {mockPartnershipOpportunities.map((opportunity) => (
              <PartnerCard key={opportunity.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {opportunity.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.type}
                      </Typography>
                    </Box>
                    <Chip 
                      label={opportunity.status} 
                      color="success"
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {opportunity.location}
                    </Typography>
                  </Box>

                  <Typography variant="body2" paragraph>
                    {opportunity.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={opportunity.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({opportunity.rating})
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Projects:</strong> {opportunity.projects}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Revenue:</strong> {opportunity.revenue}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Contact:</strong> {opportunity.contact}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Specialties:</strong>
                    </Typography>
                    {opportunity.specialties.map((specialty, index) => (
                      <Chip 
                        key={index}
                        label={specialty} 
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined">
                      View Profile
                    </Button>
                    <Button size="small" variant="contained">
                      Contact
                    </Button>
                  </Box>
                </CardContent>
              </PartnerCard>
            ))}
          </Box>
        </Box>
      )}

      {/* Active Partnerships Tab */}
      {activeTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Partnerships
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track and manage your current partnership agreements and projects.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Partner</TableCell>
                        <TableCell>Project</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Progress</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockActivePartnerships.map((partnership) => (
                        <TableRow key={partnership.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {partnership.partner}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {partnership.project}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {partnership.startDate} - {partnership.endDate}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {partnership.revenue}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={partnership.status} 
                              color={
                                partnership.status === 'Active' ? 'success' : 
                                partnership.status === 'In Progress' ? 'primary' : 
                                'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={partnership.progress} 
                                sx={{ width: 60, mr: 1 }}
                              />
                              <Typography variant="body2">
                                {partnership.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Button size="small" variant="outlined">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>

          <PartnershipCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Partnership Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Total Partners:</strong> {mockPartnershipMetrics.totalPartners}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Active Partnerships:</strong> {mockPartnershipMetrics.activePartnerships}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Revenue:</strong> {mockPartnershipMetrics.totalRevenue}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Average Rating:</strong> {mockPartnershipMetrics.averageRating}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Success Rate:</strong> {mockPartnershipMetrics.successRate}
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  New Partnership
                </Button>
              </CardContent>
            </PartnershipCard>
          </Grid>
        </Grid>
      )}

      {/* Partner Directory Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Partner Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Browse our comprehensive directory of verified partners and service providers.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Search Partners
                  </Typography>
                  <TextField
                    fullWidth
                    label="Search by name, type, or specialty"
                    margin="normal"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Filter by Category:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Developers" size="small" />
                      <Chip label="Investors" size="small" />
                      <Chip label="Management" size="small" />
                      <Chip label="Construction" size="small" />
                      <Chip label="Legal" size="small" />
                      <Chip label="Financial" size="small" />
                    </Box>
                  </Box>
                  <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                    Search
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Partner Categories
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><BusinessIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Real Estate Developers" 
                        secondary="15 partners"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><TrendingIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Investment Firms" 
                        secondary="8 partners"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AssignmentIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Property Management" 
                        secondary="12 partners"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><HandshakeIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Construction Services" 
                        secondary="20 partners"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AssessmentIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Legal Services" 
                        secondary="6 partners"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Collaboration Tools Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Partnership Agreement Generator
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create and customize partnership agreements with our template system.
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Partner Name"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Project Type"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Project Description"
                    multiline
                    rows={3}
                    margin="normal"
                    sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                  />
                </Box>

                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Generate Agreement
                </Button>
              </CardContent>
            </Card>
          </Grid>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Communication Hub
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Tools for effective partner communication and collaboration.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Partner Messaging" 
                      secondary="Direct communication with partners"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Document Sharing" 
                      secondary="Secure file sharing and collaboration"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TimelineIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Project Timeline" 
                      secondary="Track project milestones and deadlines"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AssessmentIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Performance Reports" 
                      secondary="Generate and share performance metrics"
                    />
                  </ListItem>
                </List>

                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Access Hub
                </Button>
              </CardContent>
            </Card>
        </Box>

        {/* Placeholder Partnership Cards */}
        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Partnership Opportunities
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`partner-placeholder-${index}`}>
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
                  image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Partnership+${index + 1}`}
                  alt={`Partnership ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                    Partnership #{index + 1}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                    ${(25000 + index * 5000)} investment
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: '#718096', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {['Real Estate Agent', 'Property Manager', 'Contractor', 'Inspector', 'Appraiser', 'Attorney', 'Accountant', 'Insurance Agent', 'Photographer', 'Marketing Specialist'][index]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {(18 + index)}% commission
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {(5 + index)} years
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {(85 + index)}% success
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
                    Partner Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageTemplate>
  );
};

export default PartnerPage; 