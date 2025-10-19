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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as ProjectIcon,
  AttachMoney as MoneyIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

const OperateProjects: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: '3-Bed Fix & Flip - Oak Ave',
      description: 'Complete renovation of 3-bedroom single-family home for resale',
      budget: 45000,
      spent: 38000,
      progress: 85,
      status: 'in_progress',
      priority: 'high',
      contractor: 'ABC Renovations',
      startDate: '2023-12-01',
      endDate: '2024-02-28',
      location: '123 Oak Ave',
      category: 'fix-flip',
      strategy: 'fix-flip',
      arv: 285000,
      purchasePrice: 185000,
      projectedProfit: 42000,
      holdingPeriod: 4,
      image: '/P4.jpg',
      tasks: [
        { id: 1, name: 'Kitchen Renovation', completed: true, dueDate: '2024-01-10' },
        { id: 2, name: 'Bathroom Remodel', completed: true, dueDate: '2024-01-20' },
        { id: 3, name: 'Flooring Installation', completed: true, dueDate: '2024-02-05' },
        { id: 4, name: 'Paint & Finishes', completed: false, dueDate: '2024-02-20' },
        { id: 5, name: 'Final Inspection & Listing', completed: false, dueDate: '2024-02-28' },
      ],
    },
    {
      id: 2,
      name: '4-Unit BRRR - Maple St',
      description: 'Four-unit multi-family renovation with refinance strategy',
      budget: 65000,
      spent: 52000,
      progress: 80,
      status: 'in_progress',
      priority: 'high',
      contractor: 'Elite Construction',
      startDate: '2023-11-15',
      endDate: '2024-03-15',
      location: '456 Maple St',
      category: 'brrr',
      strategy: 'brrr',
      arv: 520000,
      purchasePrice: 380000,
      refinanceLTV: 75,
      cashOut: 110000,
      monthlyRent: 6800,
      image: '/P7.jpg',
      tasks: [
        { id: 1, name: 'Unit Renovations', completed: true, dueDate: '2024-02-10' },
        { id: 2, name: 'Tenant Placement', completed: false, dueDate: '2024-02-28' },
        { id: 3, name: 'Seasoning Period', completed: false, dueDate: '2024-03-10' },
        { id: 4, name: 'Appraisal', completed: false, dueDate: '2024-03-12' },
        { id: 5, name: 'Refinance Closing', completed: false, dueDate: '2024-03-15' },
      ],
    },
    {
      id: 3,
      name: 'New Construction - Pine Ridge',
      description: 'Ground-up construction of 4-bedroom modern home on 0.5-acre lot',
      budget: 380000,
      spent: 145000,
      progress: 38,
      status: 'in_progress',
      priority: 'medium',
      contractor: 'Premier Builders',
      startDate: '2023-11-01',
      endDate: '2024-08-30',
      location: 'Lot 14, Pine Ridge Estates',
      category: 'construction',
      strategy: 'construction',
      landCost: 95000,
      projectedValue: 625000,
      projectedProfit: 150000,
      image: '/P12.jpg',
      tasks: [
        { id: 1, name: 'Permits & Site Prep', completed: true, dueDate: '2023-12-01' },
        { id: 2, name: 'Foundation', completed: true, dueDate: '2024-01-15' },
        { id: 3, name: 'Framing', completed: false, dueDate: '2024-04-15' },
        { id: 4, name: 'MEP & Drywall', completed: false, dueDate: '2024-06-30' },
        { id: 5, name: 'Finishes & Landscaping', completed: false, dueDate: '2024-08-30' },
      ],
    },
    {
      id: 4,
      name: 'Duplex BRRR - Cedar Ln',
      description: 'Duplex rehab with rental and refinance strategy',
      budget: 48000,
      spent: 15000,
      progress: 31,
      status: 'in_progress',
      priority: 'medium',
      contractor: 'Quality Rehab Co',
      startDate: '2024-01-05',
      endDate: '2024-04-20',
      location: '789 Cedar Ln',
      category: 'brrr',
      strategy: 'brrr',
      arv: 385000,
      purchasePrice: 285000,
      refinanceLTV: 80,
      cashOut: 85000,
      monthlyRent: 3400,
      image: '/P8.jpg',
      tasks: [
        { id: 1, name: 'Unit A Renovation', completed: false, dueDate: '2024-02-28' },
        { id: 2, name: 'Unit B Renovation', completed: false, dueDate: '2024-03-30' },
        { id: 3, name: 'Tenant Placement', completed: false, dueDate: '2024-04-10' },
        { id: 4, name: 'Appraisal', completed: false, dueDate: '2024-04-15' },
        { id: 5, name: 'Refinance', completed: false, dueDate: '2024-04-20' },
      ],
    },
    {
      id: 5,
      name: 'Ranch Fix & Flip - Willow Dr',
      description: 'Complete modernization of dated ranch-style home',
      budget: 55000,
      spent: 12000,
      progress: 22,
      status: 'in_progress',
      priority: 'medium',
      contractor: 'Modern Renovations LLC',
      startDate: '2024-01-10',
      endDate: '2024-05-15',
      location: '234 Willow Dr',
      category: 'fix-flip',
      strategy: 'fix-flip',
      arv: 365000,
      purchasePrice: 245000,
      projectedProfit: 48000,
      holdingPeriod: 5,
      image: '/P5.jpg',
      tasks: [
        { id: 1, name: 'Demolition & Clean-out', completed: true, dueDate: '2024-01-20' },
        { id: 2, name: 'Kitchen & Bath Gut', completed: false, dueDate: '2024-02-28' },
        { id: 3, name: 'Systems Update', completed: false, dueDate: '2024-03-30' },
        { id: 4, name: 'Finishes & Staging', completed: false, dueDate: '2024-05-01' },
        { id: 5, name: 'List & Sell', completed: false, dueDate: '2024-05-15' },
      ],
    },
    {
      id: 6,
      name: 'Land Development - Sunset Hills',
      description: '5-lot subdivision development with infrastructure',
      budget: 425000,
      spent: 85000,
      progress: 20,
      status: 'planning',
      priority: 'low',
      contractor: 'Infrastructure Group',
      startDate: '2024-02-01',
      endDate: '2025-01-30',
      location: 'Sunset Hills Rd',
      category: 'construction',
      strategy: 'construction',
      landCost: 180000,
      projectedValue: 850000,
      projectedProfit: 245000,
      image: '/P14.jpg',
      tasks: [
        { id: 1, name: 'Zoning & Permits', completed: false, dueDate: '2024-04-01' },
        { id: 2, name: 'Site Development', completed: false, dueDate: '2024-08-30' },
        { id: 3, name: 'Utilities Installation', completed: false, dueDate: '2024-11-15' },
        { id: 4, name: 'Roads & Drainage', completed: false, dueDate: '2024-12-30' },
        { id: 5, name: 'Lot Sales', completed: false, dueDate: '2025-01-30' },
      ],
    },
  ];

  const categories = [
    { value: 'all', label: 'All Deals' },
    { value: 'fix-flip', label: 'Fix & Flip' },
    { value: 'brrr', label: 'BRRR' },
    { value: 'construction', label: 'Construction/Development' },
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fix-flip': return <BuildIcon />;
      case 'brrr': return <TrendingUpIcon />;
      case 'construction': return <BuildIcon />;
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

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const filteredProjects = selectedTab === 0 
    ? projects 
    : selectedTab === 1 
      ? projects.filter(project => project.status === 'in_progress')
      : selectedTab === 2
        ? projects.filter(project => project.status === 'completed')
        : projects.filter(project => project.status === 'planning');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Deal & Project Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Strategy Filter</InputLabel>
            <Select label="Strategy Filter" defaultValue="all">
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{ bgcolor: brandColors.primary }}
          >
            Start New Deal
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="All Deals" />
          <Tab label="Active" />
          <Tab label="Completed" />
          <Tab label="Planning" />
        </Tabs>
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
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                  <Chip
                    label={getStrategyLabel(project.strategy)}
                    size="small"
                    sx={{
                      backgroundColor: getStrategyColor(project.strategy),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={project.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                    <Chip
                      label={project.priority.toUpperCase()}
                      color={getPriorityColor(project.priority) as any}
                      size="small"
                    />
                  </Box>
                </Box>
                <IconButton
                  sx={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', '&:hover': { backgroundColor: 'rgba(255,255,255,1)' } }}
                  onClick={(e) => handleMenuClick(e, project.id)}
                >
                  <MoreVertIcon />
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
                      {project.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      project.spent.toLocaleString() spent
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      project.budget.toLocaleString() budget
                    </Typography>
                  </Box>
                </Box>

                {/* Strategy-Specific Metrics */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {project.strategy === 'fix-flip' && (
                    <>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">ARV</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.arv?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Purchase</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.purchasePrice?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Projected Profit</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                          ${project.projectedProfit?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Hold Period</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {project.holdingPeriod} months
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {project.strategy === 'brrr' && (
                    <>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">ARV</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.arv?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Refi LTV</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {project.refinanceLTV}%
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Cash-Out</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                          ${project.cashOut?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Monthly Rent</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.monthlyRent?.toLocaleString()}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {project.strategy === 'construction' && (
                    <>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Land Cost</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.landCost?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Build Budget</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.budget?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Proj. Value</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ${project.projectedValue?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" color="text.secondary">Proj. Profit</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandColors.accent.success }}>
                          ${project.projectedProfit?.toLocaleString()}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* Timeline & Contractor */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {calculateDaysLeft(project.endDate)} days left
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {project.contractor}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Tasks Progress */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tasks: {project.tasks.filter(t => t.completed).length}/{project.tasks.length} completed
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(project.tasks.filter(t => t.completed).length / project.tasks.length) * 100}
                  />
                </Box>

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
        <DialogTitle>Start a New Deal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Investment Strategy</InputLabel>
              <Select label="Investment Strategy" defaultValue="fix-flip">
                <MenuItem value="fix-flip">Fix & Flip</MenuItem>
                <MenuItem value="brrr">BRRR (Buy, Rehab, Rent, Refinance)</MenuItem>
                <MenuItem value="construction">Land Development / Construction</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Deal/Project Name"
              fullWidth
              placeholder="e.g., 3-Bed Fix & Flip - Main St"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              placeholder="Describe the deal scope, property type, and strategy..."
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Purchase Price ($)"
                  type="number"
                  fullWidth
                  placeholder="250000"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Rehab Budget ($)"
                  type="number"
                  fullWidth
                  placeholder="50000"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="ARV / Projected Value ($)"
                  type="number"
                  fullWidth
                  placeholder="350000"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Target Completion Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              label="Property Address"
              fullWidth
              placeholder="123 Main St, City, State"
            />
            <TextField
              label="General Contractor"
              fullWidth
              placeholder="Contractor or construction company name"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: brandColors.primary }}>Start Deal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperateProjects;
