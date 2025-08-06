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
  IconButton
} from '@mui/material';
import { 
  Home as HomeIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const PropertyCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatsCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockProperties = [
  {
    id: 1,
    address: "123 Main St, City, State",
    type: "Single Family",
    status: "Occupied",
    tenant: "John Smith",
    rent: "$2,200",
    occupancy: "100%",
    maintenance: "Good",
    lastInspection: "2024-01-10",
    nextInspection: "2024-04-10"
  },
  {
    id: 2,
    address: "456 Oak Ave, City, State",
    type: "Townhouse",
    status: "Available",
    tenant: null,
    rent: "$1,800",
    occupancy: "0%",
    maintenance: "Needs Attention",
    lastInspection: "2024-01-05",
    nextInspection: "2024-04-05"
  },
  {
    id: 3,
    address: "789 Pine Rd, City, State",
    type: "Apartment",
    status: "Occupied",
    tenant: "Sarah Johnson",
    rent: "$1,500",
    occupancy: "100%",
    maintenance: "Excellent",
    lastInspection: "2024-01-15",
    nextInspection: "2024-04-15"
  }
];

const mockMaintenanceRequests = [
  {
    id: 1,
    property: "123 Main St",
    tenant: "John Smith",
    issue: "Leaky faucet in kitchen",
    priority: "Medium",
    status: "In Progress",
    date: "2024-01-12",
    assignedTo: "Mike's Plumbing"
  },
  {
    id: 2,
    property: "456 Oak Ave",
    tenant: "Previous Tenant",
    issue: "HVAC system not working",
    priority: "High",
    status: "Scheduled",
    date: "2024-01-10",
    assignedTo: "City HVAC"
  },
  {
    id: 3,
    property: "789 Pine Rd",
    tenant: "Sarah Johnson",
    issue: "Light fixture replacement",
    priority: "Low",
    status: "Completed",
    date: "2024-01-08",
    assignedTo: "Electric Pro"
  }
];

const mockFinancialData = {
  totalRevenue: "$6,500",
  totalExpenses: "$1,200",
  netIncome: "$5,300",
  occupancyRate: "67%",
  averageRent: "$1,833",
  monthlyGrowth: "+2.3%"
};

const ManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  return (
    <PageTemplate 
      title="Property Management" 
      subtitle="Manage your properties, tenants, and maintenance efficiently"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Properties" />
          <Tab label="Tenants" />
          <Tab label="Maintenance" />
          <Tab label="Financial" />
        </Tabs>
      </Box>

      {/* Properties Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Property Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage your properties and track their performance.
          </Typography>

          <Grid container spacing={3}>
            {mockProperties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <PropertyCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {property.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.type}
                        </Typography>
                      </Box>
                      <Chip 
                        label={property.status} 
                        color={
                          property.status === 'Occupied' ? 'success' : 
                          property.status === 'Available' ? 'primary' : 
                          'warning'
                        }
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Rent:</strong> {property.rent}/month
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Occupancy:</strong> {property.occupancy}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Maintenance:</strong> {property.maintenance}
                      </Typography>
                      {property.tenant && (
                        <Typography variant="body2">
                          <strong>Tenant:</strong> {property.tenant}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                      <Button size="small" variant="outlined">
                        Manage
                      </Button>
                    </Box>
                  </CardContent>
                </PropertyCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tenants Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Tenant Management
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Manage tenant information, leases, and communications.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tenant</TableCell>
                      <TableCell>Property</TableCell>
                      <TableCell>Lease End</TableCell>
                      <TableCell align="right">Rent</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockProperties.filter(p => p.tenant).map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {property.tenant?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {property.tenant}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                <EmailIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                john.smith@email.com
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {property.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Dec 31, 2024
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {property.rent}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label="Active" 
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            Contact
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><PersonIcon /></ListItemIcon>
                      <ListItemText primary="Add New Tenant" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><AssignmentIcon /></ListItemIcon>
                      <ListItemText primary="Create Lease Agreement" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><NotificationIcon /></ListItemIcon>
                      <ListItemText primary="Send Notifications" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarIcon /></ListItemIcon>
                      <ListItemText primary="Schedule Inspections" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Maintenance Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Maintenance Requests
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Track and manage maintenance requests and repairs.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Issue</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockMaintenanceRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {request.property}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {request.issue}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={request.priority} 
                            color={
                              request.priority === 'High' ? 'error' : 
                              request.priority === 'Medium' ? 'warning' : 
                              'success'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status} 
                            color={
                              request.status === 'Completed' ? 'success' : 
                              request.status === 'In Progress' ? 'primary' : 
                              'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {request.date}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Maintenance Summary
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Open Requests:</strong> 2
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>In Progress:</strong> 1
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Completed:</strong> 1
                    </Typography>
                    <Typography variant="body2">
                      <strong>Average Response Time:</strong> 2.5 days
                    </Typography>
                  </Box>
                  <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                    Create Request
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Financial Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockFinancialData.totalRevenue}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockFinancialData.totalExpenses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Expenses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockFinancialData.netIncome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Net Income
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockFinancialData.occupancyRate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Occupancy Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <StatsCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Average Rent: {mockFinancialData.averageRent}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Monthly Growth: {mockFinancialData.monthlyGrowth}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Cash Flow: Positive
                  </Typography>
                  <Typography variant="body2">
                    ROI: 8.5%
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  View Detailed Report
                </Button>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* Placeholder Management Cards */}
        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Management Properties
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`manage-placeholder-${index}`}>
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
                  image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Managed+Property+${index + 1}`}
                  alt={`Managed Property ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                    Managed Property #{index + 1}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                    ${(2800 + index * 300)}/month
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: '#718096', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Phoenix, AZ', 'Portland, OR', 'Nashville, TN'][index]}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {(95 + index)}% occupied
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        ${(1200 + index * 100)} expenses
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {(8 + index)}% ROI
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
                    Manage Property
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

export default ManagePage; 