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
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const OperationCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const DashboardCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockProperties = [
  {
    id: 1,
    name: "Downtown Office Building",
    address: "123 Main St, City, State",
    type: "Commercial",
    occupancy: "95%",
    monthlyRevenue: "$45,000",
    monthlyExpenses: "$12,000",
    netIncome: "$33,000",
    maintenanceStatus: "Good",
    nextInspection: "2024-02-15"
  },
  {
    id: 2,
    name: "Suburban Apartment Complex",
    address: "456 Oak Ave, City, State",
    type: "Residential",
    occupancy: "88%",
    monthlyRevenue: "$28,000",
    monthlyExpenses: "$8,500",
    netIncome: "$19,500",
    maintenanceStatus: "Needs Attention",
    nextInspection: "2024-01-25"
  },
  {
    id: 3,
    name: "Industrial Warehouse",
    address: "789 Pine Rd, City, State",
    type: "Industrial",
    occupancy: "100%",
    monthlyRevenue: "$65,000",
    monthlyExpenses: "$15,000",
    netIncome: "$50,000",
    maintenanceStatus: "Excellent",
    nextInspection: "2024-03-01"
  }
];

const mockMaintenanceTasks = [
  {
    id: 1,
    property: "Downtown Office Building",
    task: "HVAC System Maintenance",
    priority: "Medium",
    status: "Scheduled",
    assignedTo: "City HVAC Services",
    dueDate: "2024-01-20",
    estimatedCost: "$2,500"
  },
  {
    id: 2,
    property: "Suburban Apartment Complex",
    task: "Roof Repair",
    priority: "High",
    status: "In Progress",
    assignedTo: "Roofing Pro",
    dueDate: "2024-01-18",
    estimatedCost: "$8,000"
  },
  {
    id: 3,
    property: "Industrial Warehouse",
    task: "Security System Upgrade",
    priority: "Low",
    status: "Completed",
    assignedTo: "SecureTech",
    dueDate: "2024-01-15",
    estimatedCost: "$5,200"
  }
];

const mockOperationalMetrics = {
  totalProperties: 12,
  totalRevenue: "$138,000",
  totalExpenses: "$35,500",
  netIncome: "$102,500",
  averageOccupancy: "94%",
  maintenanceEfficiency: "87%"
};

const OperatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  return (
    <PageTemplate 
      title="Property Operations" 
      subtitle="Manage day-to-day operations and maintenance of your properties"
      showAuthContent={true}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Dashboard" />
          <Tab label="Properties" />
          <Tab label="Maintenance" />
          <Tab label="Financial" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Operational Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Real-time overview of your property operations and performance.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockOperationalMetrics.totalProperties}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Properties
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockOperationalMetrics.totalRevenue}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Revenue
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockOperationalMetrics.netIncome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Net Income
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ color: '#1a365d' }}>
                        {mockOperationalMetrics.averageOccupancy}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Occupancy
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <DashboardCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText primary="Schedule Maintenance" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AssessmentIcon /></ListItemIcon>
                    <ListItemText primary="Generate Reports" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><NotificationIcon /></ListItemIcon>
                    <ListItemText primary="Send Notifications" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarIcon /></ListItemIcon>
                    <ListItemText primary="View Calendar" />
                  </ListItem>
                </List>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  View All Actions
                </Button>
              </CardContent>
            </DashboardCard>
          </Grid>
        </Grid>
      )}

      {/* Properties Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Property Operations
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Monitor and manage operations for each property in your portfolio.
          </Typography>

          <Grid container spacing={3}>
            {mockProperties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <OperationCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {property.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.address}
                        </Typography>
                      </Box>
                      <Chip 
                        label={property.type} 
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Occupancy:</strong> {property.occupancy}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Monthly Revenue:</strong> {property.monthlyRevenue}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Monthly Expenses:</strong> {property.monthlyExpenses}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Net Income:</strong> {property.netIncome}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Maintenance Status:</strong> {property.maintenanceStatus}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Next Inspection:</strong> {property.nextInspection}
                      </Typography>
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
                </OperationCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Maintenance Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Maintenance Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track and manage maintenance tasks across all properties.
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Task</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell align="right">Cost</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockMaintenanceTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {task.property}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {task.task}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={task.priority} 
                              color={
                                task.priority === 'High' ? 'error' : 
                                task.priority === 'Medium' ? 'warning' : 
                                'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={task.status} 
                              color={
                                task.status === 'Completed' ? 'success' : 
                                task.status === 'In Progress' ? 'primary' : 
                                'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {task.dueDate}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {task.estimatedCost}
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Maintenance Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Tasks:</strong> 15
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>High Priority:</strong> 3
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>In Progress:</strong> 5
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Completed:</strong> 7
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Budget:</strong> $25,700
                  </Typography>
                </Box>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Schedule New Task
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Financial Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Operations
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track operational costs, revenue, and profitability.
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ color: '#4caf50' }}>
                        $138,000
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Monthly Revenue
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ color: '#f44336' }}>
                        $35,500
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Monthly Expenses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ color: '#1a365d' }}>
                        $102,500
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Net Monthly Income
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ color: '#ff9800' }}>
                        74.3%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Profit Margin
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Breakdown
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><BuildIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Maintenance & Repairs" 
                      secondary="$12,500"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Property Management" 
                      secondary="$8,200"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><MoneyIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Utilities" 
                      secondary="$6,800"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Insurance & Taxes" 
                      secondary="$5,000"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TimelineIcon /></ListItemIcon>
                    <ListItemText 
                      primary="Other Expenses" 
                      secondary="$3,000"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Placeholder Operation Cards */}
        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Operations
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 10 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`operate-placeholder-${index}`}>
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
                  image={`https://via.placeholder.com/300x200/1a365d/ffffff?text=Operation+${index + 1}`}
                  alt={`Operation ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                    Operation #{index + 1}
                  </Typography>
                  
                  <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                    ${(8500 + index * 1200)}/month
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
                        {(98 + index)}% efficiency
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        ${(3200 + index * 200)} expenses
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {(15 + index)}% profit
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
                    Manage Operation
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

export default OperatePage; 