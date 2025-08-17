import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import ProfileHeader from '../../ProfileHeader';
import {
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import { brandColors } from "../../../theme";

// Types
interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  category: 'contract' | 'inspection' | 'financing' | 'closing';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'completed' | 'overdue' | 'upcoming' | 'in-progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
}

interface StatusUpdate {
  id: string;
  property: string;
  buyer: string;
  seller: string;
  contractDate: string;
  closingDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed';
  lastUpdate: string;
}

interface ClosingData {
  timeline: TimelineEvent[];
  milestones: Milestone[];
  status: StatusUpdate[];
}

// Styled components
const DashboardContainer = styled.div`
  padding: 1rem;
  margin-top: 80px; /* Account for fixed header */
`;

const MetricCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
`;

const StatusChip = styled(Chip)<{ status: 'completed' | 'in-progress' | 'pending' | 'blocked' | 'on-track' | 'at-risk' | 'delayed' | 'overdue' | 'upcoming' }>`
  background-color: ${({ status }) => {
    switch (status) {
      case 'completed':
      case 'on-track':
        return brandColors.accent.success;
      case 'in-progress':
      case 'upcoming':
        return brandColors.accent.info;
      case 'pending':
        return brandColors.accent.warning;
      case 'blocked':
      case 'at-risk':
      case 'delayed':
      case 'overdue':
        return brandColors.actions.error;
      default:
        return brandColors.text.disabled;
    }
  }};
  color: brandColors.backgrounds.primary;
  font-weight: 600;
`;

const TimelineCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const DocumentPortal = styled(Card)`
  border: 2px dashed brandColors.actions.primary;
  border-radius: 16px;
  background: brandColors.backgrounds.secondary;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #1565c0;
    background: brandColors.backgrounds.selected;
  }
`;

const ClosingDashboard: React.FC = () => {
  const [closingData, setClosingData] = useState<ClosingData>({
    timeline: [],
    milestones: [],
    status: [],
  });
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');

  // Mock API calls
  useEffect(() => {
    const fetchClosingData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        const mockTimeline: TimelineEvent[] = [
          {
            id: '1',
            date: '2024-01-15',
            title: 'Contract Signed',
            description: 'Purchase agreement executed by all parties',
            status: 'completed',
            category: 'contract',
          },
          {
            id: '2',
            date: '2024-01-20',
            title: 'Home Inspection',
            description: 'Property inspection scheduled and completed',
            status: 'completed',
            category: 'inspection',
          },
          {
            id: '3',
            date: '2024-01-25',
            title: 'Loan Approval',
            description: 'Mortgage pre-approval received from lender',
            status: 'in-progress',
            category: 'financing',
          },
          {
            id: '4',
            date: '2024-02-01',
            title: 'Title Search',
            description: 'Title company conducting property research',
            status: 'pending',
            category: 'closing',
          },
          {
            id: '5',
            date: '2024-02-15',
            title: 'Closing Date',
            description: 'Final settlement and property transfer',
            status: 'pending',
            category: 'closing',
          },
        ];

        const mockMilestones: Milestone[] = [
          {
            id: '1',
            title: 'Complete Home Inspection',
            description: 'Schedule and complete property inspection',
            dueDate: '2024-01-20',
            status: 'completed',
            priority: 'high',
          },
          {
            id: '2',
            title: 'Obtain Loan Approval',
            description: 'Secure final mortgage approval',
            dueDate: '2024-01-30',
            status: 'in-progress',
            priority: 'high',
          },
          {
            id: '3',
            title: 'Title Search & Insurance',
            description: 'Complete title research and secure insurance',
            dueDate: '2024-02-05',
            status: 'pending',
            priority: 'medium',
          },
          {
            id: '4',
            title: 'Final Walkthrough',
            description: 'Conduct final property inspection',
            dueDate: '2024-02-10',
            status: 'pending',
            priority: 'medium',
          },
        ];

        const mockStatus: StatusUpdate[] = [
          {
            id: '1',
            property: '123 Main St, San Francisco, CA',
            buyer: 'John & Sarah Smith',
            seller: 'Michael Johnson',
            contractDate: '2024-01-15',
            closingDate: '2024-02-15',
            progress: 65,
            status: 'on-track',
            lastUpdate: '2024-01-25',
          },
          {
            id: '2',
            property: '456 Oak Ave, Los Angeles, CA',
            buyer: 'David Wilson',
            seller: 'Lisa Brown',
            contractDate: '2024-01-10',
            closingDate: '2024-02-10',
            progress: 45,
            status: 'at-risk',
            lastUpdate: '2024-01-24',
          },
          {
            id: '3',
            property: '789 Pine St, Seattle, WA',
            buyer: 'Robert Davis',
            seller: 'Jennifer Lee',
            contractDate: '2024-01-20',
            closingDate: '2024-02-20',
            progress: 25,
            status: 'delayed',
            lastUpdate: '2024-01-23',
          },
        ];

        setClosingData({
          timeline: mockTimeline,
          milestones: mockMilestones,
          status: mockStatus,
        });
      } catch (error) {
        console.error('Error fetching closing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClosingData();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadDialogOpen(true);
    }
  };

  const handleDocumentUpload = async () => {
    if (selectedFile && documentType) {
      try {
        // Mock API call to /api/esign
        console.log('Uploading document:', selectedFile.name, 'Type:', documentType);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message (would use react-hot-toast in production)
        alert(`Document "${selectedFile.name}" uploaded successfully!`);
        
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setDocumentType('');
      } catch (error) {
        console.error('Error uploading document:', error);
        alert('Error uploading document. Please try again.');
      }
    }
  };

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <InfoIcon color="info" />;
      case 'pending':
        return <TimelineIcon color="action" />;
      case 'blocked':
        return <WarningIcon color="warning" />;
      default:
        return <TimelineIcon />;
    }
  };

  const getTimelineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'default';
      case 'blocked':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </DashboardContainer>
    );
  }

  return (
    <>
      <ProfileHeader title="Closing Dashboard" subtitle="Track your closing progress and milestones" />
      <DashboardContainer>
        {/* Key Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <MetricCard>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1, color: brandColors.actions.primary }}>
                {closingData.status.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Active Closings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label="On Track"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </MetricCard>
        </Box>
        <Box>
          <MetricCard>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1, color: brandColors.actions.primary }}>
                {closingData.milestones.filter(m => m.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Milestones Completed
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label="65%"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </MetricCard>
        </Box>
        <Box>
          <MetricCard>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1, color: brandColors.actions.primary }}>
                {closingData.timeline.filter(t => t.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Timeline Events
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label="2/5"
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </MetricCard>
        </Box>
        <Box>
          <MetricCard>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1, color: brandColors.actions.primary }}>
                {closingData.status.filter(s => s.status === 'at-risk' || s.status === 'delayed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                At Risk
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label="2"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </MetricCard>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
        {/* Timeline */}
        <Box>
          <TimelineCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                  Closing Timeline
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  variant="outlined"
                  sx={{ color: brandColors.actions.primary, borderColor: brandColors.actions.primary }}
                >
                  Add Event
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {closingData.timeline.map((event, index) => (
                  <Box key={event.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: 60 
                    }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getTimelineColor(event.status) === 'success' ? brandColors.accent.success : 
                                       getTimelineColor(event.status) === 'info' ? brandColors.accent.info : 
                                       getTimelineColor(event.status) === 'warning' ? brandColors.accent.warning : brandColors.text.disabled,
                        color: brandColors.backgrounds.primary,
                        mb: 1
                      }}>
                        {getTimelineIcon(event.status)}
                      </Box>
                      {index < closingData.timeline.length - 1 && (
                        <Box sx={{ 
                          width: 2, 
                          height: 40, 
                          backgroundColor: brandColors.borders.secondary,
                          borderRadius: 1
                        }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {event.description}
                      </Typography>
                      <StatusChip
                        label={event.status}
                        status={event.status}
                        size="small"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </TimelineCard>
        </Box>

        {/* Milestones */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: brandColors.actions.primary }}>
                Key Milestones
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {closingData.milestones.map((milestone) => (
                  <Box key={milestone.id} sx={{ p: 2, border: '1px solid brandColors.borders.secondary', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {milestone.title}
                      </Typography>
                      <StatusChip
                        label={milestone.status}
                        status={milestone.status}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {milestone.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={milestone.priority}
                        size="small"
                        color={milestone.priority === 'high' ? 'error' : milestone.priority === 'medium' ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Status Updates Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: brandColors.actions.primary }}>
            Closing Status Updates
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Contract Date</TableCell>
                <TableCell>Closing Date</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Update</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {closingData.status.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 200 }}>
                      {item.property}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.buyer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.seller}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(item.contractDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(item.closingDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 35 }}>
                        {item.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={item.status}
                      status={item.status}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(item.lastUpdate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Status">
                        <IconButton size="small">
                          <EditIcon />
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

      {/* Document Portal */}
      <DocumentPortal>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <DescriptionIcon sx={{ fontSize: 60, color: brandColors.actions.primary, mb: 2 }} />
            <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2, color: brandColors.actions.primary }}>
              Document Portal & E-Sign
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Upload documents and manage electronic signatures for your closing process
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                component="label"
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Upload Document
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<SendIcon />}
                sx={{ color: brandColors.actions.primary, borderColor: brandColors.actions.primary }}
              >
                Send for E-Sign
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ color: brandColors.actions.primary, borderColor: brandColors.actions.primary }}
              >
                Download All
              </Button>
            </Box>
          </Box>
        </CardContent>
      </DocumentPortal>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Document Type</InputLabel>
              <Select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                label="Document Type"
              >
                <MenuItem value="contract">Purchase Contract</MenuItem>
                <MenuItem value="inspection">Inspection Report</MenuItem>
                <MenuItem value="financing">Financing Documents</MenuItem>
                <MenuItem value="title">Title Documents</MenuItem>
                <MenuItem value="closing">Closing Documents</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            {selectedFile && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid brandColors.borders.secondary', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Selected File: {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDocumentUpload}
            variant="contained"
            disabled={!selectedFile || !documentType}
            sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
        </DashboardContainer>
      </>
    );
  };

export default ClosingDashboard;
