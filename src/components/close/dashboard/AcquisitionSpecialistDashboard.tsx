import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Paper,
  Divider,
  Badge,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AttachFile as FileIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MoneyIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { brandColors } from '../../../theme';

interface DashboardStats {
  totalDeals: number;
  activeDeals: number;
  closedDeals: number;
  pendingDeals: number;
  totalValue: number;
  monthlyTarget: number;
  conversionRate: number;
  avgDealSize: number;
  responseTime: number;
  clientSatisfaction: number;
}

interface Deal {
  id: string;
  property: string;
  address: string;
  type: 'residential' | 'commercial' | 'land' | 'multifamily';
  status: 'lead' | 'qualified' | 'negotiating' | 'under-contract' | 'closed' | 'lost';
  value: number;
  commission: number;
  client: string;
  agent: string;
  createdDate: string;
  lastActivity: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  notes: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  dealId?: string;
  type: 'follow-up' | 'inspection' | 'negotiation' | 'documentation' | 'closing';
}

interface RecentActivity {
  id: string;
  type: 'deal' | 'task' | 'communication' | 'document';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  dealId?: string;
}

const AcquisitionSpecialistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stats: DashboardStats = {
    totalDeals: 47,
    activeDeals: 12,
    closedDeals: 28,
    pendingDeals: 7,
    totalValue: 12500000,
    monthlyTarget: 15000000,
    conversionRate: 68.5,
    avgDealSize: 266000,
    responseTime: 2.3,
    clientSatisfaction: 4.8,
  };

  const deals: Deal[] = [
    {
      id: 'D-001',
      property: '123 Main Street',
      address: '123 Main St, San Francisco, CA 94102',
      type: 'residential',
      status: 'under-contract',
      value: 850000,
      commission: 25500,
      client: 'John Smith',
      agent: 'Sarah Johnson',
      createdDate: '2024-01-15',
      lastActivity: '2024-01-20',
      priority: 'high',
      source: 'MLS',
      notes: 'Waiting for inspection results',
    },
    {
      id: 'D-002',
      property: '456 Oak Avenue',
      address: '456 Oak Ave, Oakland, CA 94601',
      type: 'commercial',
      status: 'negotiating',
      value: 2100000,
      commission: 63000,
      client: 'ABC Corporation',
      agent: 'Mike Chen',
      createdDate: '2024-01-18',
      lastActivity: '2024-01-21',
      priority: 'urgent',
      source: 'Referral',
      notes: 'Price negotiation in progress',
    },
    {
      id: 'D-003',
      property: '789 Pine Street',
      address: '789 Pine St, Berkeley, CA 94704',
      type: 'multifamily',
      status: 'qualified',
      value: 1800000,
      commission: 54000,
      client: 'Jane Doe',
      agent: 'Alex Rodriguez',
      createdDate: '2024-01-20',
      lastActivity: '2024-01-21',
      priority: 'medium',
      source: 'Website',
      notes: 'Initial consultation completed',
    },
  ];

  const tasks: Task[] = [
    {
      id: 'T-001',
      title: 'Follow up with John Smith',
      description: 'Call to discuss inspection results and next steps',
      dueDate: '2024-01-22',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Sarah Johnson',
      dealId: 'D-001',
      type: 'follow-up',
    },
    {
      id: 'T-002',
      title: 'Schedule property inspection',
      description: 'Arrange inspection for 456 Oak Avenue',
      dueDate: '2024-01-23',
      priority: 'urgent',
      status: 'in-progress',
      assignedTo: 'Mike Chen',
      dealId: 'D-002',
      type: 'inspection',
    },
    {
      id: 'T-003',
      title: 'Prepare purchase agreement',
      description: 'Draft purchase agreement for 789 Pine Street',
      dueDate: '2024-01-25',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Alex Rodriguez',
      dealId: 'D-003',
      type: 'documentation',
    },
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: 'A-001',
      type: 'deal',
      title: 'New deal added',
      description: '456 Oak Avenue - Commercial property',
      timestamp: '2024-01-21 14:30',
      user: 'Mike Chen',
      dealId: 'D-002',
    },
    {
      id: 'A-002',
      type: 'task',
      title: 'Task completed',
      description: 'Property inspection scheduled for 123 Main Street',
      timestamp: '2024-01-21 11:15',
      user: 'Sarah Johnson',
      dealId: 'D-001',
    },
    {
      id: 'A-003',
      type: 'communication',
      title: 'Client communication',
      description: 'Email sent to John Smith regarding inspection',
      timestamp: '2024-01-21 09:45',
      user: 'Sarah Johnson',
      dealId: 'D-001',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return brandColors.accent.info;
      case 'qualified': return brandColors.accent.warning;
      case 'negotiating': return brandColors.accent.warning;
      case 'under-contract': return brandColors.accent.success;
      case 'closed': return brandColors.primary;
      case 'lost': return brandColors.accent.error;
      default: return brandColors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return brandColors.accent.error;
      case 'high': return brandColors.accent.warning;
      case 'medium': return brandColors.accent.info;
      case 'low': return brandColors.accent.success;
      default: return brandColors.neutral[500];
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return brandColors.accent.success;
      case 'in-progress': return brandColors.accent.info;
      case 'pending': return brandColors.accent.warning;
      case 'overdue': return brandColors.accent.error;
      default: return brandColors.neutral[500];
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return <HomeIcon />;
      case 'commercial': return <BusinessIcon />;
      case 'multifamily': return <ApartmentIcon />;
      case 'land': return <LocationIcon />;
      default: return <HomeIcon />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDeals = deals.filter(deal =>
    deal.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ color: brandColors.primary, fontWeight: 600, mb: 1 }}>
            Acquisition Specialist Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track deals, manage tasks, and monitor performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: brandColors.primary,
              color: brandColors.primary,
              '&:hover': {
                borderColor: brandColors.primaryDark,
                backgroundColor: brandColors.backgrounds.hover,
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: brandColors.primary,
              '&:hover': {
                backgroundColor: brandColors.primaryDark,
              },
            }}
          >
            New Deal
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.primary, mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Deals
                  </Typography>
                  <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 'bold' }}>
                    {stats.totalDeals}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  +12% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.success, mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Active Deals
                  </Typography>
                  <Typography variant="h4" sx={{ color: brandColors.accent.success, fontWeight: 'bold' }}>
                    {stats.activeDeals}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  +3 this week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.warning, mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="h4" sx={{ color: brandColors.accent.warning, fontWeight: 'bold' }}>
                    {formatCurrency(stats.totalValue)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  +8% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.info, mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" sx={{ color: brandColors.accent.info, fontWeight: 'bold' }}>
                    {stats.conversionRate}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  +2.5% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Monthly Target Progress</AlertTitle>
        You're at {Math.round((stats.totalValue / stats.monthlyTarget) * 100)}% of your monthly target. 
        Keep up the great work!
        <LinearProgress 
          variant="determinate" 
          value={(stats.totalValue / stats.monthlyTarget) * 100} 
          sx={{ mt: 1, height: 8, borderRadius: 4 }}
        />
      </Alert>

      {/* Main Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Deals" icon={<HomeIcon />} />
          <Tab label="Tasks" icon={<AssignmentIcon />} />
          <Tab label="Activity" icon={<TimelineIcon />} />
          <Tab label="Analytics" icon={<AssessmentIcon />} />
        </Tabs>
      </Box>

      {/* Deals Tab */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: brandColors.primary }}>
              Recent Deals
            </Typography>
            <TextField
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ width: 300 }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((deal) => (
                    <TableRow key={deal.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {deal.property}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {deal.address}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getPropertyTypeIcon(deal.type)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {deal.type.charAt(0).toUpperCase() + deal.type.slice(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={deal.status.replace('-', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(deal.status),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(deal.value)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Commission: {formatCurrency(deal.commission)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{deal.client}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{deal.agent}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={deal.priority.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(deal.priority),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDeals.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      )}

      {/* Tasks Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ color: brandColors.primary, mb: 3 }}>
            Active Tasks
          </Typography>
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} md={6} lg={4} key={task.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.status.replace('-', ' ').toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getTaskStatusColor(task.status),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Due: {formatDate(task.dueDate)}
                      </Typography>
                      <Chip
                        label={task.priority.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Assigned to: {task.assignedTo}
                      </Typography>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Activity Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ color: brandColors.primary, mb: 3 }}>
            Recent Activity
          </Typography>
          <List>
            {recentActivity.map((activity) => (
              <ListItem key={activity.id} divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: brandColors.primary }}>
                    {activity.type === 'deal' && <HomeIcon />}
                    {activity.type === 'task' && <AssignmentIcon />}
                    {activity.type === 'communication' && <EmailIcon />}
                    {activity.type === 'document' && <FileIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.timestamp} • {activity.user}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Analytics Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ color: brandColors.primary, mb: 3 }}>
            Performance Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Deal Pipeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Leads</Typography>
                        <Typography variant="body2">5</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={20} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Qualified</Typography>
                        <Typography variant="body2">8</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Negotiating</Typography>
                        <Typography variant="body2">3</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Under Contract</Typography>
                        <Typography variant="body2">4</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={80} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Closed</Typography>
                        <Typography variant="body2">12</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Key Performance Indicators
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Response Time</Typography>
                      <Typography variant="h6" sx={{ color: brandColors.accent.success }}>
                        {stats.responseTime}h
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Client Satisfaction</Typography>
                      <Typography variant="h6" sx={{ color: brandColors.accent.success }}>
                        {stats.clientSatisfaction}/5
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Avg Deal Size</Typography>
                      <Typography variant="h6" sx={{ color: brandColors.accent.info }}>
                        {formatCurrency(stats.avgDealSize)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Conversion Rate</Typography>
                      <Typography variant="h6" sx={{ color: brandColors.accent.warning }}>
                        {stats.conversionRate}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AcquisitionSpecialistDashboard;
