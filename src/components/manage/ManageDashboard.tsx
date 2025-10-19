import React from 'react';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
  Assignment as TaskIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const ManageDashboard: React.FC = () => {
  // Mock data - in real app this would come from API
  const stats = {
    totalProperties: 12,
    occupiedUnits: 10,
    vacantUnits: 2,
    monthlyRevenue: 45000,
    occupancyRate: 83.3,
    maintenanceRequests: 3,
    upcomingRenewals: 5,
  };

  const recentActivity = [
    { id: 1, type: 'rent_payment', property: '123 Main St', tenant: 'John Smith', amount: 2500, time: '2 hours ago' },
    { id: 2, type: 'maintenance', property: '456 Oak Ave', tenant: 'Sarah Johnson', issue: 'Plumbing leak', time: '4 hours ago' },
    { id: 3, type: 'renewal', property: '789 Pine St', tenant: 'Mike Davis', action: 'Lease renewed', time: '1 day ago' },
    { id: 4, type: 'application', property: '321 Elm St', tenant: 'Lisa Wilson', action: 'New application', time: '2 days ago' },
  ];

  const maintenanceRequests = [
    { id: 1, property: '123 Main St', unit: 'Apt 2B', issue: 'Broken AC', priority: 'High', daysOpen: 2 },
    { id: 2, property: '456 Oak Ave', unit: 'Apt 1A', issue: 'Leaky faucet', priority: 'Medium', daysOpen: 1 },
    { id: 3, property: '789 Pine St', unit: 'Apt 3C', issue: 'Broken lock', priority: 'High', daysOpen: 3 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.primary, mr: 2 }}>
                  <HomeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalProperties}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Properties
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.occupancyRate} 
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {stats.occupancyRate}% Occupancy Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.success, mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    ${stats.monthlyRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 0.5, fontSize: 16 }} />
                <Typography variant="caption" color="success.main">
                  +12% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.warning, mr: 2 }}>
                  <TaskIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.maintenanceRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Requests
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats.maintenanceRequests} urgent
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.info, mr: 2 }}>
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.upcomingRenewals}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Renewals
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Next 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid size={{ md: 8, xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: activity.type === 'rent_payment' ? brandColors.accent.success : 
                                  activity.type === 'maintenance' ? brandColors.accent.warning :
                                  activity.type === 'renewal' ? brandColors.accent.info : brandColors.accent.info
                        }}>
                          {activity.type === 'rent_payment' && <MoneyIcon />}
                          {activity.type === 'maintenance' && <WarningIcon />}
                          {activity.type === 'renewal' && <CheckCircleIcon />}
                          {activity.type === 'application' && <TaskIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {activity.tenant}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              - {activity.property}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.type === 'rent_payment' && `Rent payment: $${activity.amount}`}
                              {activity.type === 'maintenance' && `Maintenance: ${activity.issue}`}
                              {activity.type === 'renewal' && `Lease renewal completed`}
                              {activity.type === 'application' && `New rental application`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button variant="outlined" sx={{ mt: 2 }}>
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Requests */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Maintenance Requests
              </Typography>
              <List>
                {maintenanceRequests.map((request, index) => (
                  <React.Fragment key={request.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {request.property}
                            </Typography>
                            <Chip 
                              label={request.priority} 
                              size="small" 
                              color={getPriorityColor(request.priority) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {request.unit} - {request.issue}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.daysOpen} days open
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < maintenanceRequests.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageDashboard;
