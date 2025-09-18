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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as ProjectIcon,
  AttachMoney as MoneyIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const OperateDashboard: React.FC = () => {
  // Mock data - in real app this would come from API
  const stats = {
    activeProjects: 8,
    completedProjects: 24,
    totalBudget: 2500000,
    spentBudget: 1800000,
    contractors: 15,
    upcomingDeadlines: 5,
    overdueTasks: 2,
    monthlySavings: 45000,
  };

  const recentActivity = [
    { id: 1, type: 'project_completed', project: 'Kitchen Renovation', contractor: 'ABC Construction', amount: 25000, time: '2 hours ago' },
    { id: 2, type: 'expense_approved', project: 'Bathroom Remodel', contractor: 'XYZ Plumbing', amount: 8500, time: '4 hours ago' },
    { id: 3, type: 'deadline_approaching', project: 'Roof Replacement', contractor: 'Roof Masters', amount: 15000, time: '1 day ago' },
    { id: 4, type: 'contractor_added', project: 'Landscaping', contractor: 'Green Thumb Landscaping', amount: 0, time: '2 days ago' },
  ];

  const activeProjects = [
    {
      id: 1,
      name: 'Kitchen Renovation',
      budget: 50000,
      spent: 45000,
      progress: 90,
      status: 'in_progress',
      contractor: 'ABC Construction',
      deadline: '2024-01-15',
      daysLeft: 3,
    },
    {
      id: 2,
      name: 'Bathroom Remodel',
      budget: 25000,
      spent: 15000,
      progress: 60,
      status: 'in_progress',
      contractor: 'XYZ Plumbing',
      deadline: '2024-01-20',
      daysLeft: 8,
    },
    {
      id: 3,
      name: 'Roof Replacement',
      budget: 75000,
      spent: 0,
      progress: 0,
      status: 'planning',
      contractor: 'Roof Masters',
      deadline: '2024-01-25',
      daysLeft: 13,
    },
    {
      id: 4,
      name: 'Landscaping',
      budget: 15000,
      spent: 5000,
      progress: 33,
      status: 'in_progress',
      contractor: 'Green Thumb Landscaping',
      deadline: '2024-02-01',
      daysLeft: 20,
    },
  ];

  const upcomingDeadlines = [
    { id: 1, project: 'Kitchen Renovation', task: 'Final inspection', deadline: '2024-01-15', priority: 'high' },
    { id: 2, project: 'Bathroom Remodel', task: 'Tile installation', deadline: '2024-01-18', priority: 'medium' },
    { id: 3, project: 'Roof Replacement', task: 'Material delivery', deadline: '2024-01-20', priority: 'high' },
    { id: 4, project: 'Landscaping', task: 'Plant selection', deadline: '2024-01-22', priority: 'low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'planning': return 'warning';
      case 'on_hold': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_completed': return <CheckCircleIcon sx={{ color: brandColors.accent.success }} />;
      case 'expense_approved': return <MoneyIcon sx={{ color: brandColors.accent.info }} />;
      case 'deadline_approaching': return <WarningIcon sx={{ color: brandColors.accent.warning }} />;
      case 'contractor_added': return <PersonIcon sx={{ color: '#9c27b0' }} />;
      default: return <ProjectIcon />;
    }
  };

  const calculateBudgetProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
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
                  <ProjectIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.activeProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Projects
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats.completedProjects} completed this year
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
                    (stats.totalBudget / 1000000).toFixed(1)M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Budget
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  stats.spentBudget.toLocaleString() spent
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
                  <BuildIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.contractors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Contractors
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats.upcomingDeadlines} upcoming deadlines
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.info, mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    stats.monthlySavings.toLocaleString()
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Savings
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats.overdueTasks} overdue tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Projects */}
        <Grid size={{ md: 8, xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Active Projects
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell>Contractor</TableCell>
                      <TableCell align="right">Budget</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Deadline</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {project.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{project.contractor}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            project.budget.toLocaleString()
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            project.spent.toLocaleString() spent
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {project.progress}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.status.replace('_', ' ')}
                            color={getStatusColor(project.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(project.deadline).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {project.daysLeft} days left
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity & Deadlines */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'transparent' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {activity.project}
                            </Typography>
                            {activity.amount > 0 && (
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                                activity.amount.toLocaleString()
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.contractor}
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
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upcoming Deadlines
              </Typography>
              <List>
                {upcomingDeadlines.map((deadline, index) => (
                  <React.Fragment key={deadline.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {deadline.task}
                            </Typography>
                            <Chip
                              label={deadline.priority}
                              size="small"
                              color={getPriorityColor(deadline.priority) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {deadline.project}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Due: {new Date(deadline.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingDeadlines.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OperateDashboard;
