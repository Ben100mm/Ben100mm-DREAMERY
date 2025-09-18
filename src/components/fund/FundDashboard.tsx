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
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Assignment as ProjectIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const FundDashboard: React.FC = () => {
  // Mock data - in real app this would come from API
  const stats = {
    totalRaised: 2500000,
    activeProjects: 8,
    totalInvestors: 156,
    averageInvestment: 16025,
    successRate: 87.5,
    pendingApprovals: 12,
    totalCommissions: 125000,
  };

  const recentInvestments = [
    { id: 1, investor: 'John Smith', project: 'Downtown Office Complex', amount: 50000, date: '2 hours ago' },
    { id: 2, investor: 'Sarah Johnson', project: 'Residential Development', amount: 25000, date: '4 hours ago' },
    { id: 3, investor: 'Mike Davis', project: 'Retail Plaza', amount: 75000, date: '1 day ago' },
    { id: 4, investor: 'Lisa Wilson', project: 'Industrial Park', amount: 100000, date: '2 days ago' },
  ];

  const activeProjects = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      targetAmount: 2000000,
      raisedAmount: 1500000,
      investors: 45,
      status: 'active',
      daysLeft: 15,
    },
    {
      id: 2,
      name: 'Residential Development',
      targetAmount: 1500000,
      raisedAmount: 1200000,
      investors: 32,
      status: 'active',
      daysLeft: 8,
    },
    {
      id: 3,
      name: 'Retail Plaza',
      targetAmount: 800000,
      raisedAmount: 800000,
      investors: 28,
      status: 'funded',
      daysLeft: 0,
    },
    {
      id: 4,
      name: 'Industrial Park',
      targetAmount: 3000000,
      raisedAmount: 500000,
      investors: 15,
      status: 'active',
      daysLeft: 22,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'funded': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
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
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    (stats.totalRaised / 1000000).toFixed(1)M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Raised
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: brandColors.accent.success, mr: 0.5, fontSize: 16 }} />
                <Typography variant="caption" color="success.main">
                  +23% this quarter
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.success, mr: 2 }}>
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
                {stats.pendingApprovals} pending approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ sm: 6, md: 3, xs: 12 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandColors.accent.warning, mr: 2 }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalInvestors}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Investors
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Avg: stats.averageInvestment.toLocaleString()
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
                    {stats.successRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Commission: stats.totalCommissions.toLocaleString()
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
                Active Fundraising Projects
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell align="right">Target</TableCell>
                      <TableCell align="right">Raised</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Investors</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Days Left</TableCell>
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
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            project.targetAmount.toLocaleString()
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            project.raisedAmount.toLocaleString()
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              value={calculateProgress(project.raisedAmount, project.targetAmount)}
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {calculateProgress(project.raisedAmount, project.targetAmount).toFixed(1)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{project.investors}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.status}
                            color={getStatusColor(project.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {project.daysLeft > 0 ? `${project.daysLeft} days` : 'Completed'}
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

        {/* Recent Investments */}
        <Grid size={{ md: 4, xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Investments
              </Typography>
              <List>
                {recentInvestments.map((investment, index) => (
                  <React.Fragment key={investment.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: brandColors.primary }}>
                          {investment.investor.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {investment.investor}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandColors.primary }}>
                              investment.amount.toLocaleString()
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {investment.project}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {investment.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentInvestments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Button variant="outlined" sx={{ mt: 2 }}>
                View All Investments
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FundDashboard;
