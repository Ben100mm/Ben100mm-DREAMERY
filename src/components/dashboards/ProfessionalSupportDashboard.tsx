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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Folder as FolderIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignee: string;
  dueDate: string;
  category: string;
  client: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'appointment' | 'deadline' | 'reminder';
  client: string;
  location: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: string;
  client: string;
  status: 'active' | 'archived' | 'pending';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

const ProfessionalSupportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    client: '',
    dueDate: '',
  });

  // Sample data
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Review closing documents for 123 Main St',
      description: 'Verify all signatures and notarizations are complete',
      priority: 'high',
      status: 'in-progress',
      assignee: 'John Smith',
      dueDate: '2024-01-15',
      category: 'Title Review',
      client: 'ABC Realty',
    },
    {
      id: '2',
      title: 'Schedule property inspection',
      description: 'Coordinate with inspector for next week',
      priority: 'medium',
      status: 'pending',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-18',
      category: 'Inspection',
      client: 'XYZ Properties',
    },
    {
      id: '3',
      title: 'Prepare escrow instructions',
      description: 'Draft detailed escrow instructions for new transaction',
      priority: 'high',
      status: 'overdue',
      assignee: 'Mike Wilson',
      dueDate: '2024-01-12',
      category: 'Escrow',
      client: 'DEF Investments',
    },
  ];

  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Client Meeting - Property Closing',
      startTime: '2024-01-15T10:00:00',
      endTime: '2024-01-15T11:00:00',
      type: 'meeting',
      client: 'ABC Realty',
      location: 'Conference Room A',
      status: 'confirmed',
    },
    {
      id: '2',
      title: 'Property Inspection',
      startTime: '2024-01-16T14:00:00',
      endTime: '2024-01-16T16:00:00',
      type: 'appointment',
      client: 'XYZ Properties',
      location: '123 Oak Street',
      status: 'confirmed',
    },
    {
      id: '3',
      title: 'Document Review Deadline',
      startTime: '2024-01-18T17:00:00',
      endTime: '2024-01-18T17:00:00',
      type: 'deadline',
      client: 'DEF Investments',
      location: 'Office',
      status: 'tentative',
    },
  ];

  const files: File[] = [
    {
      id: '1',
      name: 'Purchase Agreement - 123 Main St.pdf',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-01-10',
      category: 'Contracts',
      client: 'ABC Realty',
      status: 'active',
    },
    {
      id: '2',
      name: 'Title Report - 456 Oak Ave.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-09',
      category: 'Title',
      client: 'XYZ Properties',
      status: 'active',
    },
    {
      id: '3',
      name: 'Inspection Report - 789 Pine St.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-01-08',
      category: 'Inspections',
      client: 'DEF Investments',
      status: 'archived',
    },
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Task Assigned',
      message: 'You have been assigned to review closing documents for 123 Main St',
      type: 'info',
      timestamp: '2024-01-14T09:30:00',
      read: false,
    },
    {
      id: '2',
      title: 'Deadline Approaching',
      message: 'Escrow instructions for DEF Investments are due tomorrow',
      type: 'warning',
      timestamp: '2024-01-14T08:15:00',
      read: false,
    },
    {
      id: '3',
      title: 'Document Approved',
      message: 'Title report for 456 Oak Ave has been approved by client',
      type: 'success',
      timestamp: '2024-01-14T07:45:00',
      read: true,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return brandColors.actions.error;
      case 'medium': return brandColors.actions.warning;
      case 'low': return brandColors.actions.success;
      default: return brandColors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return brandColors.actions.success;
      case 'in-progress': return brandColors.actions.info;
      case 'pending': return brandColors.actions.warning;
      case 'overdue': return brandColors.actions.error;
      default: return brandColors.neutral[500];
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <NotificationsIcon sx={{ color: brandColors.actions.info }} />;
      case 'warning': return <WarningIcon sx={{ color: brandColors.actions.warning }} />;
      case 'error': return <ErrorIcon sx={{ color: brandColors.actions.error }} />;
      case 'success': return <CheckCircleIcon sx={{ color: brandColors.actions.success }} />;
      default: return <NotificationsIcon sx={{ color: brandColors.neutral[500] }} />;
    }
  };

  const handleTaskSubmit = () => {
    // Handle task creation
    console.log('Creating task:', newTask);
    setTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      client: '',
      dueDate: '',
    });
  };

  const TabPanel = ({ children, value, index, ...other }: any) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: brandColors.primary, fontWeight: 600, mb: 1 }}>
          Professional Support Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage tasks, calendar, files, and client communications
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryDark} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {tasks.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Active Tasks
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: `linear-gradient(135deg, ${brandColors.actions.success} 0%, ${brandColors.actions.successHover} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {calendarEvents.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Upcoming Events
                  </Typography>
                </Box>
                <CalendarIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: `linear-gradient(135deg, ${brandColors.actions.warning} 0%, ${brandColors.actions.warningHover} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {files.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Files
                  </Typography>
                </Box>
                <FolderIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{ background: `linear-gradient(135deg, ${brandColors.actions.info} 0%, ${brandColors.actions.infoHover} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {notifications.filter(n => !n.read).length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Unread Notifications
                  </Typography>
                </Box>
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                  <NotificationsIcon sx={{ color: 'white', fontSize: 40 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Tasks" icon={<AssignmentIcon />} />
          <Tab label="Calendar" icon={<CalendarIcon />} />
          <Tab label="Files" icon={<FolderIcon />} />
          <Tab label="Notifications" icon={<NotificationsIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
        </Tabs>
      </Box>

      {/* Tasks Tab */}
      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: brandColors.primary }}>
            Task Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTaskDialogOpen(true)}
            sx={{
              backgroundColor: brandColors.primary,
              '&:hover': { backgroundColor: brandColors.primaryDark },
            }}
          >
            New Task
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {tasks.map((task) => (
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }} key={task.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: brandColors.text.primary, fontWeight: 600 }}>
                      {task.title}
                    </Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(task.status),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.client}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </TabPanel>

      {/* Calendar Tab */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" sx={{ color: brandColors.primary, mb: 3 }}>
          Upcoming Events
        </Typography>
        <List>
          {calendarEvents.map((event) => (
            <ListItem key={event.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: brandColors.primary }}>
                  <CalendarIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={event.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.startTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.location} • {event.client}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={event.status}
                  size="small"
                  sx={{
                    backgroundColor: event.status === 'confirmed' ? brandColors.actions.success : brandColors.actions.warning,
                    color: 'white',
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </TabPanel>

      {/* Files Tab */}
      <TabPanel value={activeTab} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: brandColors.primary }}>
            File Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
            >
              Upload
            </Button>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              sx={{ borderColor: brandColors.primary, color: brandColors.primary }}
            >
              Search
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon sx={{ color: brandColors.primary }} />
                      {file.name}
                    </Box>
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.uploadDate}</TableCell>
                  <TableCell>{file.client}</TableCell>
                  <TableCell>
                    <Chip
                      label={file.status}
                      size="small"
                      sx={{
                        backgroundColor: file.status === 'active' ? brandColors.actions.success : brandColors.neutral[500],
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" sx={{ color: brandColors.primary, mb: 3 }}>
          Notifications
        </Typography>
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: brandColors.backgrounds.secondary }}>
                  {getNotificationIcon(notification.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </Typography>
                    {!notification.read && (
                      <Chip label="New" size="small" color="primary" />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={activeTab} index={4}>
        <Typography variant="h6" sx={{ color: brandColors.primary, mb: 3 }}>
          Analytics & Reports
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>
                  Task Completion Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: brandColors.neutral[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: brandColors.actions.success,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: brandColors.primary }}>
                    75%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ color: brandColors.primary, mb: 2 }}>
                  Client Satisfaction
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: brandColors.neutral[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: brandColors.actions.success,
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: brandColors.primary }}>
                    92%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </TabPanel>

      {/* New Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                >
                  <MenuItem value="title-review">Title Review</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                  <MenuItem value="escrow">Escrow</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Client"
                value={newTask.client}
                onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
              />
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleTaskSubmit}
            variant="contained"
            sx={{
              backgroundColor: brandColors.primary,
              '&:hover': { backgroundColor: brandColors.primaryDark },
            }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfessionalSupportDashboard;
