import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Search as SearchIcon,
  DocumentScanner as DocumentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Gavel as GavelIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

const StatusChip = styled(Chip)<{ status: 'completed' | 'in-progress' | 'pending' | 'error' }>`
  background-color: ${({ status }) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#ff9800';
      case 'pending': return '#2196f3';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  }};
  color: white;
  font-weight: 600;
`;

// Mock data types
interface DueDiligenceItem {
  id: string;
  type: 'property' | 'legal' | 'financial' | 'environmental';
  name: string;
  propertyAddress: string;
  status: 'completed' | 'in-progress' | 'pending' | 'error';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignedTo: string;
  findings: string[];
  documents: string[];
  riskScore: number;
}

interface ResearchTool {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance';
  lastUsed: string;
  usageCount: number;
}

const DueDiligenceTools: React.FC = () => {
  const [dueDiligenceItems, setDueDiligenceItems] = useState<DueDiligenceItem[]>([]);
  const [researchTools, setResearchTools] = useState<ResearchTool[]>([]);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock data initialization
    const mockDueDiligenceItems: DueDiligenceItem[] = [
      {
        id: '1',
        type: 'property',
        name: 'Property Condition Assessment',
        propertyAddress: '123 Main St, San Francisco, CA',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-15',
        assignedTo: 'Sarah Johnson',
        findings: ['Property in good condition', 'Minor repairs needed', 'No structural issues'],
        documents: ['Assessment Report.pdf', 'Photos.zip', 'Repair Estimates.pdf'],
        riskScore: 15,
      },
      {
        id: '2',
        type: 'legal',
        name: 'Zoning Compliance Review',
        propertyAddress: '456 Oak Ave, Los Angeles, CA',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-01-18',
        assignedTo: 'Mike Chen',
        findings: ['Zoning allows residential use', 'Building permits verified'],
        documents: ['Zoning Report.pdf', 'Permit History.pdf'],
        riskScore: 25,
      },
      {
        id: '3',
        type: 'financial',
        name: 'Tax Assessment Review',
        propertyAddress: '789 Pine St, Seattle, WA',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-01-20',
        assignedTo: 'Lisa Rodriguez',
        findings: [],
        documents: [],
        riskScore: 0,
      },
      {
        id: '4',
        type: 'environmental',
        name: 'Environmental Site Assessment',
        propertyAddress: '123 Main St, San Francisco, CA',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-10',
        assignedTo: 'David Kim',
        findings: ['No environmental hazards detected', 'Soil testing completed'],
        documents: ['Phase I ESA Report.pdf', 'Soil Test Results.pdf'],
        riskScore: 10,
      },
    ];

    const mockResearchTools: ResearchTool[] = [
      {
        id: '1',
        name: 'Property Records Database',
        description: 'Access to county property records, deeds, and liens',
        status: 'available',
        lastUsed: '2024-01-15',
        usageCount: 45,
      },
      {
        id: '2',
        name: 'Legal Research Portal',
        description: 'Case law, statutes, and regulatory compliance tools',
        status: 'available',
        lastUsed: '2024-01-14',
        usageCount: 32,
      },
      {
        id: '3',
        name: 'Financial Data Aggregator',
        description: 'Tax records, assessments, and financial history',
        status: 'in-use',
        lastUsed: '2024-01-16',
        usageCount: 28,
      },
      {
        id: '4',
        name: 'Environmental Database',
        description: 'Environmental reports, permits, and compliance data',
        status: 'available',
        lastUsed: '2024-01-12',
        usageCount: 19,
      },
    ];

    setDueDiligenceItems(mockDueDiligenceItems);
    setResearchTools(mockResearchTools);
  }, []);

  const handleOpenItemDialog = (item?: DueDiligenceItem) => {
    setSelectedItem(item || null);
    setOpenItemDialog(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property': return <LocationIcon />;
      case 'legal': return <GavelIcon />;
      case 'financial': return <BusinessIcon />;
      case 'environmental': return <AssessmentIcon />;
      default: return <InfoIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'property': return '#2196f3';
      case 'legal': return '#ff9800';
      case 'financial': return '#4caf50';
      case 'environmental': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return '#4caf50';
    if (score <= 40) return '#ff9800';
    return '#f44336';
  };

  const filteredItems = dueDiligenceItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Due Diligence Tools
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenItemDialog()}
            sx={{ backgroundColor: '#1976d2' }}
          >
            New Due Diligence Item
          </Button>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          >
            Advanced Search
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search due diligence items by name, property address, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <DocumentIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Items
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceItems.filter(item => item.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceItems.filter(item => item.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard>
            <CardContent sx={{ textAlign: 'center' }}>
              <InfoIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {researchTools.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Research Tools
              </Typography>
            </CardContent>
          </FeatureCard>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Due Diligence Items */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Due Diligence Items
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenItemDialog()}
                >
                  Add Item
                </Button>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Risk Score</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: getTypeColor(item.type) }}>
                            {getTypeIcon(item.type)}
                          </Box>
                          <Chip
                            label={item.type}
                            size="small"
                            sx={{
                              backgroundColor: getTypeColor(item.type),
                              color: 'white',
                              textTransform: 'capitalize',
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 150 }}>
                          {item.propertyAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={item.status}
                          status={item.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.riskScore}
                          size="small"
                          sx={{
                            backgroundColor: getRiskColor(item.riskScore),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Item">
                            <IconButton size="small" onClick={() => handleOpenItemDialog(item)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Documents">
                            <IconButton size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Research Tools */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Research Tools
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {researchTools.map((tool) => (
                  <Card key={tool.id} variant="outlined">
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {tool.name}
                        </Typography>
                        <Chip
                          label={tool.status}
                          size="small"
                          color={tool.status === 'available' ? 'success' : tool.status === 'in-use' ? 'warning' : 'error'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {tool.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Last used: {new Date(tool.lastUsed).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Used {tool.usageCount} times
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mt: 1, width: '100%' }}
                        disabled={tool.status !== 'available'}
                      >
                        {tool.status === 'available' ? 'Launch Tool' : 'Tool Unavailable'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Assessment Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Risk Assessment Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Overall Risk Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, dueDiligenceItems.reduce((sum, item) => sum + item.riskScore, 0) / dueDiligenceItems.length)}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #4caf50 0%, #ff9800 50%, #f44336 100%)',
                    },
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {Math.round(dueDiligenceItems.reduce((sum, item) => sum + item.riskScore, 0) / dueDiligenceItems.length)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Risk Distribution by Type
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['property', 'legal', 'financial', 'environmental'].map((type) => {
                  const typeItems = dueDiligenceItems.filter(item => item.type === type);
                  const avgRisk = typeItems.length > 0 
                    ? Math.round(typeItems.reduce((sum, item) => sum + item.riskScore, 0) / typeItems.length)
                    : 0;
                  return (
                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {type}
                      </Typography>
                      <Chip
                        label={avgRisk}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(avgRisk),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Due Diligence Item Dialog */}
      <Dialog open={openItemDialog} onClose={() => setOpenItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Due Diligence Item' : 'New Due Diligence Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select defaultValue={selectedItem?.type || 'property'}>
                  <MenuItem value="property">Property</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="environmental">Environmental</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select defaultValue={selectedItem?.priority || 'medium'}>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                defaultValue={selectedItem?.name || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Address"
                defaultValue={selectedItem?.propertyAddress || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                defaultValue={selectedItem?.dueDate || ''}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assigned To"
                defaultValue={selectedItem?.assignedTo || ''}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenItemDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            {selectedItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { DueDiligenceTools };
