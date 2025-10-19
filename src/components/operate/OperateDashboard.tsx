import React, { useState } from 'react';

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
  Tabs,
  Tab,
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
  HomeWork as HomeWorkIcon,
  Autorenew as AutorenewIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const OperateDashboard: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(0); // 0: All, 1: Fix & Flip, 2: BRRR, 3: Construction

  // Mock data - in real app this would come from API
  const stats = {
    activeFlips: 5,
    activeBRRR: 3,
    activeConstruction: 2,
    totalARV: 3250000,
    projectedProfit: 485000,
    contractors: 12,
    upcomingMilestones: 8,
    completedDeals: 18,
  };

  const recentActivity = [
    { id: 1, type: 'refinance_approved', project: '4-Unit BRRR - Maple St', contractor: 'Regional Bank', amount: 320000, time: '1 hour ago', strategy: 'brrr' },
    { id: 2, type: 'deal_closed', project: '3-Bed Fix & Flip - Oak Ave', contractor: 'Valley Title', amount: 185000, time: '3 hours ago', strategy: 'fix-flip' },
    { id: 3, type: 'construction_milestone', project: 'New Construction - Pine Ridge', contractor: 'Premier Builders', amount: 0, time: '5 hours ago', strategy: 'construction' },
    { id: 4, type: 'appraisal_completed', project: 'Duplex BRRR - Cedar Ln', contractor: 'AAA Appraisers', amount: 285000, time: '1 day ago', strategy: 'brrr' },
  ];

  const activeProjects = [
    {
      id: 1,
      name: '3-Bed Fix & Flip - Oak Ave',
      strategy: 'fix-flip',
      budget: 45000,
      spent: 38000,
      progress: 85,
      status: 'in_progress',
      contractor: 'ABC Renovations',
      deadline: '2024-02-28',
      daysLeft: 15,
      arv: 285000,
      purchasePrice: 185000,
      projectedProfit: 42000,
    },
    {
      id: 2,
      name: '4-Unit BRRR - Maple St',
      strategy: 'brrr',
      budget: 65000,
      spent: 52000,
      progress: 80,
      status: 'in_progress',
      contractor: 'Elite Construction',
      deadline: '2024-03-15',
      daysLeft: 30,
      arv: 520000,
      purchasePrice: 380000,
      refinanceLTV: 75,
      cashOut: 110000,
    },
    {
      id: 3,
      name: 'New Construction - Pine Ridge',
      strategy: 'construction',
      budget: 380000,
      spent: 145000,
      progress: 38,
      status: 'in_progress',
      contractor: 'Premier Builders',
      deadline: '2024-08-30',
      daysLeft: 180,
      landCost: 95000,
      projectedValue: 625000,
      projectedProfit: 150000,
    },
    {
      id: 4,
      name: 'Duplex BRRR - Cedar Ln',
      strategy: 'brrr',
      budget: 48000,
      spent: 15000,
      progress: 31,
      status: 'in_progress',
      contractor: 'Quality Rehab Co',
      deadline: '2024-04-20',
      daysLeft: 60,
      arv: 385000,
      purchasePrice: 285000,
      refinanceLTV: 80,
      cashOut: 85000,
    },
  ];

  const upcomingMilestones = [
    { id: 1, project: '3-Bed Fix & Flip - Oak Ave', task: 'Final inspection & listing', deadline: '2024-02-28', priority: 'high', strategy: 'fix-flip' },
    { id: 2, project: '4-Unit BRRR - Maple St', task: 'Refinance closing', deadline: '2024-03-10', priority: 'high', strategy: 'brrr' },
    { id: 3, project: 'New Construction - Pine Ridge', task: 'Framing completion', deadline: '2024-04-15', priority: 'medium', strategy: 'construction' },
    { id: 4, project: 'Duplex BRRR - Cedar Ln', task: 'Appraisal appointment', deadline: '2024-03-25', priority: 'medium', strategy: 'brrr' },
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
      case 'refinance_approved': return <AutorenewIcon sx={{ color: brandColors.accent.success }} />;
      case 'deal_closed': return <CheckCircleIcon sx={{ color: brandColors.accent.success }} />;
      case 'construction_milestone': return <ConstructionIcon sx={{ color: brandColors.accent.info }} />;
      case 'appraisal_completed': return <HomeWorkIcon sx={{ color: brandColors.accent.info }} />;
      case 'project_completed': return <CheckCircleIcon sx={{ color: brandColors.accent.success }} />;
      case 'expense_approved': return <MoneyIcon sx={{ color: brandColors.accent.info }} />;
      default: return <ProjectIcon />;
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'fix-flip': return brandColors.actions.error;
      case 'brrr': return brandColors.actions.info;
      case 'construction': return brandColors.actions.warning;
      default: return brandColors.text.secondary;
    }
  };

  const getStrategyLabel = (strategy: string) => {
    switch (strategy) {
      case 'fix-flip': return 'Fix & Flip';
      case 'brrr': return 'BRRR';
      case 'construction': return 'Construction';
      default: return strategy;
    }
  };

  const filteredProjects = selectedStrategy === 0 
    ? activeProjects 
    : selectedStrategy === 1
      ? activeProjects.filter(p => p.strategy === 'fix-flip')
      : selectedStrategy === 2
        ? activeProjects.filter(p => p.strategy === 'brrr')
        : activeProjects.filter(p => p.strategy === 'construction');

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
                <Avatar sx={{ bgcolor: brandColors.actions.error, mr: 2 }}>
                  <HomeWorkIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.activeFlips}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Fix & Flips
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats.completedDeals} deals completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.actions.info, mr: 2 }}>
                  <AutorenewIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.activeBRRR}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    BRRR Properties
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                In refinance pipeline
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.actions.warning, mr: 2 }}>
                  <ConstructionIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.activeConstruction}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Construction Projects
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {stats.contractors} active contractors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.success, mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    ${(stats.projectedProfit / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Projected Profit
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                ${(stats.totalARV / 1000000).toFixed(2)}M total ARV
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Strategy Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedStrategy} onChange={(e, newValue) => setSelectedStrategy(newValue)}>
          <Tab label="All Deals" />
          <Tab label="Fix & Flip" />
          <Tab label="BRRR" />
          <Tab label="Construction" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {/* Active Projects */}
        <Grid size={{ md: 8, xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Active Deals & Projects
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Deal/Project</TableCell>
                      <TableCell>Strategy</TableCell>
                      <TableCell align="right">Key Metrics</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Timeline</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {project.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {project.contractor}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStrategyLabel(project.strategy)}
                            size="small"
                            sx={{
                              backgroundColor: getStrategyColor(project.strategy),
                              color: 'white',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {project.strategy === 'fix-flip' && (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                ARV: ${project.arv?.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Profit: ${project.projectedProfit?.toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                          {project.strategy === 'brrr' && (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                ARV: ${project.arv?.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Cash-Out: ${project.cashOut?.toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                          {project.strategy === 'construction' && (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Value: ${project.projectedValue?.toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Profit: ${project.projectedProfit?.toLocaleString()}
                              </Typography>
                            </Box>
                          )}
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
                          <Typography variant="caption" color="text.secondary">
                            ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                          </Typography>
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

        {/* Recent Activity & Milestones */}
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {activity.project}
                            </Typography>
                            <Chip
                              label={getStrategyLabel(activity.strategy)}
                              size="small"
                              sx={{
                                backgroundColor: getStrategyColor(activity.strategy),
                                color: 'white',
                                height: 18,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.contractor}
                              {activity.amount > 0 && (
                                <span style={{ fontWeight: 'bold', color: brandColors.primary }}>
                                  {' '}• ${activity.amount.toLocaleString()}
                                </span>
                              )}
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
                Upcoming Milestones
              </Typography>
              <List>
                {upcomingMilestones.map((milestone, index) => (
                  <React.Fragment key={milestone.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {milestone.task}
                            </Typography>
                            <Chip
                              label={milestone.priority}
                              size="small"
                              color={getPriorityColor(milestone.priority) as any}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {milestone.project}
                              </Typography>
                              <Chip
                                label={getStrategyLabel(milestone.strategy)}
                                size="small"
                                sx={{
                                  backgroundColor: getStrategyColor(milestone.strategy),
                                  color: 'white',
                                  height: 16,
                                  fontSize: '0.65rem',
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Due: {new Date(milestone.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingMilestones.length - 1 && <Divider />}
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
