import React, { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as ProjectIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const FundProjects: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      description: 'Modern office building in the heart of downtown with premium amenities',
      targetAmount: 2000000,
      raisedAmount: 1500000,
      investors: 45,
      status: 'active',
      type: 'commercial',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      minInvestment: 10000,
      expectedReturn: 12.5,
      riskLevel: 'medium',
      location: 'Downtown, City',
      image: '/placeholder-project-1.jpg',
    },
    {
      id: 2,
      name: 'Residential Development',
      description: 'Luxury residential complex with 200 units and resort-style amenities',
      targetAmount: 1500000,
      raisedAmount: 1200000,
      investors: 32,
      status: 'active',
      type: 'residential',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      minInvestment: 5000,
      expectedReturn: 15.0,
      riskLevel: 'low',
      location: 'Suburbs, City',
      image: '/placeholder-project-2.jpg',
    },
    {
      id: 3,
      name: 'Retail Plaza',
      description: 'Mixed-use retail and office space with prime street frontage',
      targetAmount: 800000,
      raisedAmount: 800000,
      investors: 28,
      status: 'funded',
      type: 'retail',
      startDate: '2023-12-01',
      endDate: '2024-02-29',
      minInvestment: 15000,
      expectedReturn: 18.0,
      riskLevel: 'high',
      location: 'Shopping District',
      image: '/placeholder-project-3.jpg',
    },
    {
      id: 4,
      name: 'Industrial Park',
      description: 'Large-scale industrial development with warehouse and manufacturing facilities',
      targetAmount: 3000000,
      raisedAmount: 500000,
      investors: 15,
      status: 'active',
      type: 'industrial',
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      minInvestment: 25000,
      expectedReturn: 10.0,
      riskLevel: 'low',
      location: 'Industrial Zone',
      image: '/placeholder-project-4.jpg',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'funded': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commercial': return <ProjectIcon />;
      case 'residential': return <ProjectIcon />;
      case 'retail': return <ProjectIcon />;
      case 'industrial': return <ProjectIcon />;
      default: return <ProjectIcon />;
    }
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, projectId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleCreateProject = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = () => {
    console.log('Edit project:', selectedProject);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete project:', selectedProject);
    handleMenuClose();
  };

  const handleView = () => {
    console.log('View project:', selectedProject);
    handleMenuClose();
  };

  const filteredProjects = projects.filter(project => 
    filterStatus === 'all' || project.status === filterStatus
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Fundraising Projects
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="funded">Funded</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{ bgcolor: brandColors.primary }}
          >
            Create Project
          </Button>
        </Box>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid size={{ sm: 6, md: 4, xs: 12 }} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Project Image */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(project.image)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <Chip
                    label={project.status.toUpperCase()}
                    color={getStatusColor(project.status) as any}
                    size="small"
                  />
                </Box>
                <IconButton
                  sx={{ position: 'absolute', top: 8, left: 8 }}
                  onClick={(e) => handleMenuClick(e, project.id)}
                >
                  <MoreVertIcon sx={{ color: brandColors.text.inverse }} />
                </IconButton>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                {/* Project Details */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {project.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {calculateProgress(project.raisedAmount, project.targetAmount).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(project.raisedAmount, project.targetAmount)}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      project.raisedAmount.toLocaleString() raised
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      project.targetAmount.toLocaleString() target
                    </Typography>
                  </Box>
                </Box>

                {/* Project Stats */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {project.investors} investors
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {project.expectedReturn}% return
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        Min: project.minInvestment.toLocaleString()
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SecurityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Chip
                        label={project.riskLevel}
                        size="small"
                        color={getRiskColor(project.riskLevel) as any}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Location */}
                <Typography variant="caption" color="text.secondary">
                  📍 {project.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Project
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Project
        </MenuItem>
      </Menu>

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Fundraising Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              placeholder="e.g., Downtown Office Complex"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              placeholder="Describe the project, its benefits, and investment opportunity..."
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Target Amount"
                  type="number"
                  fullWidth
                  placeholder="2000000"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Minimum Investment"
                  type="number"
                  fullWidth
                  placeholder="10000"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Project Type</InputLabel>
                  <Select label="Project Type">
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="retail">Retail</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Risk Level</InputLabel>
                  <Select label="Risk Level">
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Expected Return (%)"
                  type="number"
                  fullWidth
                  placeholder="12.5"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Location"
                  fullWidth
                  placeholder="City, State"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">Create Project</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FundProjects;
