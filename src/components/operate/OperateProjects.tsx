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
      name: 'Kitchen Renovation',
      description: 'Complete kitchen remodel with modern appliances and custom cabinets',
      budget: 50000,
      spent: 45000,
      progress: 90,
      status: 'in_progress',
      priority: 'high',
      contractor: 'ABC Construction',
      startDate: '2023-12-01',
      endDate: '2024-01-15',
      location: '123 Main St',
      category: 'renovation',
      image: '/placeholder-project-1.jpg',
      tasks: [
        { id: 1, name: 'Demolition', completed: true, dueDate: '2023-12-05' },
        { id: 2, name: 'Electrical Work', completed: true, dueDate: '2023-12-10' },
        { id: 3, name: 'Plumbing', completed: true, dueDate: '2023-12-15' },
        { id: 4, name: 'Cabinetry Installation', completed: false, dueDate: '2024-01-10' },
        { id: 5, name: 'Final Inspection', completed: false, dueDate: '2024-01-15' },
      ],
    },
    {
      id: 2,
      name: 'Bathroom Remodel',
      description: 'Master bathroom renovation with luxury fixtures and tiling',
      budget: 25000,
      spent: 15000,
      progress: 60,
      status: 'in_progress',
      priority: 'medium',
      contractor: 'XYZ Plumbing',
      startDate: '2023-12-15',
      endDate: '2024-01-20',
      location: '456 Oak Ave',
      category: 'renovation',
      image: '/placeholder-project-2.jpg',
      tasks: [
        { id: 1, name: 'Design Planning', completed: true, dueDate: '2023-12-15' },
        { id: 2, name: 'Material Ordering', completed: true, dueDate: '2023-12-20' },
        { id: 3, name: 'Tile Installation', completed: false, dueDate: '2024-01-10' },
        { id: 4, name: 'Fixture Installation', completed: false, dueDate: '2024-01-15' },
        { id: 5, name: 'Final Cleanup', completed: false, dueDate: '2024-01-20' },
      ],
    },
    {
      id: 3,
      name: 'Roof Replacement',
      description: 'Complete roof replacement with new shingles and gutters',
      budget: 75000,
      spent: 0,
      progress: 0,
      status: 'planning',
      priority: 'high',
      contractor: 'Roof Masters',
      startDate: '2024-01-20',
      endDate: '2024-02-15',
      location: '789 Pine St',
      category: 'maintenance',
      image: '/placeholder-project-3.jpg',
      tasks: [
        { id: 1, name: 'Roof Inspection', completed: false, dueDate: '2024-01-20' },
        { id: 2, name: 'Material Delivery', completed: false, dueDate: '2024-01-25' },
        { id: 3, name: 'Old Roof Removal', completed: false, dueDate: '2024-01-30' },
        { id: 4, name: 'New Roof Installation', completed: false, dueDate: '2024-02-10' },
        { id: 5, name: 'Gutter Installation', completed: false, dueDate: '2024-02-15' },
      ],
    },
    {
      id: 4,
      name: 'Landscaping Project',
      description: 'Complete yard landscaping with new plants and irrigation system',
      budget: 15000,
      spent: 5000,
      progress: 33,
      status: 'in_progress',
      priority: 'low',
      contractor: 'Green Thumb Landscaping',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      location: '321 Elm St',
      category: 'landscaping',
      image: '/placeholder-project-4.jpg',
      tasks: [
        { id: 1, name: 'Site Preparation', completed: true, dueDate: '2024-01-05' },
        { id: 2, name: 'Plant Selection', completed: false, dueDate: '2024-01-15' },
        { id: 3, name: 'Planting', completed: false, dueDate: '2024-01-25' },
        { id: 4, name: 'Irrigation Setup', completed: false, dueDate: '2024-01-30' },
        { id: 5, name: 'Final Inspection', completed: false, dueDate: '2024-02-01' },
      ],
    },
  ];

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'construction', label: 'Construction' },
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
      case 'renovation': return <BuildIcon />;
      case 'maintenance': return <ScheduleIcon />;
      case 'landscaping': return <ProjectIcon />;
      case 'construction': return <BuildIcon />;
      default: return <ProjectIcon />;
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

  const filteredProjects = selectedTab === 0 ? projects : projects.filter(project => project.status === 'in_progress');

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Project Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category">
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
            Create Project
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="All Projects" />
          <Tab label="Active Projects" />
          <Tab label="Completed Projects" />
          <Tab label="Planning" />
        </Tabs>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
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
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
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
                <IconButton
                  sx={{ position: 'absolute', bottom: 8, right: 8 }}
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

                {/* Project Stats */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {project.contractor}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {calculateDaysLeft(project.endDate)} days left
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        project.budget.toLocaleString()
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getCategoryIcon(project.category)}
                      <Typography variant="caption">
                        {project.category}
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
                    size="small"
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
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              placeholder="e.g., Kitchen Renovation"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              placeholder="Describe the project scope and objectives..."
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Budget ($)"
                  type="number"
                  fullWidth
                  placeholder="50000"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category">
                    <MenuItem value="renovation">Renovation</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="landscaping">Landscaping</MenuItem>
                    <MenuItem value="construction">Construction</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              label="Location"
              fullWidth
              placeholder="Property address"
            />
            <TextField
              label="Contractor"
              fullWidth
              placeholder="Contractor name"
            />
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

export default OperateProjects;
