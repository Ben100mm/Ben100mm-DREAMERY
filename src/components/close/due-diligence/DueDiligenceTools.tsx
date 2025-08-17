import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { brandColors } from '../../../theme';

import {
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Types
interface Inspector {
  id: string;
  name: string;
  company: string;
  specialties: string[];
  rating: number;
  hourlyRate: number;
  availability: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}

interface Appraisal {
  id: string;
  propertyAddress: string;
  appraiserName: string;
  orderDate: string;
  estimatedValue: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  cost: number;
  notes: string;
}

interface HOADocument {
  id: string;
  propertyAddress: string;
  documentType: 'covenants' | 'bylaws' | 'rules' | 'financials' | 'meetings' | 'other';
  title: string;
  status: 'requested' | 'received' | 'reviewed' | 'approved' | 'rejected';
  requestDate: string;
  receivedDate?: string;
  fileUrl?: string;
  notes: string;
}

interface Issue {
  id: string;
  propertyAddress: string;
  category: 'inspection' | 'appraisal' | 'hoa' | 'legal' | 'environmental' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  resolution?: string;
  resolutionDate?: string;
}

interface DueDiligence {
  inspectors: Inspector[];
  appraisals: Appraisal[];
  hoaDocuments: HOADocument[];
  issues: Issue[];
}

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'approved':
    case 'resolved':
    case 'closed':
      return brandColors.accent.success;
    case 'pending':
    case 'in-progress':
    case 'requested':
    case 'received':
      return brandColors.accent.info;
    case 'cancelled':
    case 'rejected':
      return brandColors.actions.error;
    case 'reviewed':
      return brandColors.accent.warning;
    default:
      return brandColors.text.disabled;
  }
};

// Helper function for priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return brandColors.actions.error;
    case 'high':
      return brandColors.accent.warning;
    case 'medium':
      return brandColors.accent.info;
    case 'low':
      return brandColors.accent.success;
    default:
      return brandColors.text.disabled;
  }
};

// Tab interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanelComponent(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`due-diligence-tabpanel-${index}`}
      aria-labelledby={`due-diligence-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: '2rem', '@media (max-width: 600px)': { padding: '1rem' } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DueDiligenceTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dueDiligenceData, setDueDiligenceData] = useState<DueDiligence>({
    inspectors: [],
    appraisals: [],
    hoaDocuments: [],
    issues: [],
  });
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [openInspectionDialog, setOpenInspectionDialog] = useState(false);
  const [openAppraisalDialog, setOpenAppraisalDialog] = useState(false);
  const [openHOADialog, setOpenHOADialog] = useState(false);
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  
  // Form states
  const [inspectionForm, setInspectionForm] = useState({
    propertyAddress: '',
    inspectorId: '',
    inspectionDate: '',
    inspectionType: 'general',
    notes: ''
  });
  
  const [appraisalForm, setAppraisalForm] = useState({
    propertyAddress: '',
    appraiserName: '',
    estimatedValue: '',
    dueDate: '',
    cost: '',
    notes: ''
  });
  
  const [hoaForm, setHoaForm] = useState({
    propertyAddress: '',
    documentType: 'covenants',
    title: '',
    notes: ''
  });
  
  const [issueForm, setIssueForm] = useState({
    propertyAddress: '',
    category: 'inspection',
    priority: 'medium',
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  // API Integration Functions
  const handleInspectionBooking = async (formData: typeof inspectionForm) => {
    try {
      // API call to /api/inspections/book
      console.log('Booking inspection:', formData);
      setOpenInspectionDialog(false);
      setInspectionForm({
        propertyAddress: '',
        inspectorId: '',
        inspectionDate: '',
        inspectionType: 'general',
        notes: ''
      });
    } catch (error) {
      console.error('Error booking inspection:', error);
    }
  };

  const handleAppraisalOrder = async (formData: typeof appraisalForm) => {
    try {
      // API call to /api/appraisals
      console.log('Ordering appraisal:', formData);
      setOpenAppraisalDialog(false);
      setAppraisalForm({
        propertyAddress: '',
        appraiserName: '',
        estimatedValue: '',
        dueDate: '',
        cost: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error ordering appraisal:', error);
    }
  };

  const handleHOADocumentRequest = async (formData: typeof hoaForm) => {
    try {
      // API call to /api/hoa/docs
      console.log('Requesting HOA document:', formData);
      setOpenHOADialog(false);
      setHoaForm({
        propertyAddress: '',
        documentType: 'covenants',
        title: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error requesting HOA document:', error);
    }
  };

  const handleIssueCreation = async (formData: typeof issueForm) => {
    try {
      // API call to /api/issues
      console.log('Creating issue:', formData);
      setOpenIssueDialog(false);
      setIssueForm({
        propertyAddress: '',
        category: 'inspection',
        priority: 'medium',
        title: '',
        description: '',
        assignedTo: '',
        dueDate: ''
      });
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Mock API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API calls to /api/inspectors, /api/appraisals, /api/hoa/docs, /api/issues
        const mockInspectors: Inspector[] = [
          {
            id: '1',
            name: 'John Smith',
            company: 'ABC Inspections',
            specialties: ['Residential', 'Structural', 'Electrical'],
            rating: 4.8,
            hourlyRate: 85,
            availability: ['2024-02-01', '2024-02-02', '2024-02-05'],
            contactInfo: {
              phone: '(555) 123-4567',
              email: 'john@abcinspections.com'
            }
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            company: 'Quality Home Inspections',
            specialties: ['Residential', 'Plumbing', 'HVAC'],
            rating: 4.9,
            hourlyRate: 90,
            availability: ['2024-02-03', '2024-02-06', '2024-02-07'],
            contactInfo: {
              phone: '(555) 234-5678',
              email: 'sarah@qualityinspections.com'
            }
          },
          {
            id: '3',
            name: 'Mike Chen',
            company: 'Pro Inspection Services',
            specialties: ['Commercial', 'Industrial', 'Environmental'],
            rating: 4.7,
            hourlyRate: 120,
            availability: ['2024-02-04', '2024-02-08', '2024-02-09'],
            contactInfo: {
              phone: '(555) 345-6789',
              email: 'mike@proinspections.com'
            }
          }
        ];

        const mockAppraisals: Appraisal[] = [
          {
            id: '1',
            propertyAddress: '123 Main St, San Francisco, CA',
            appraiserName: 'Lisa Rodriguez',
            orderDate: '2024-01-20',
            estimatedValue: 750000,
            status: 'in-progress',
            dueDate: '2024-02-05',
            cost: 450,
            notes: 'Standard residential appraisal with interior access'
          },
          {
            id: '2',
            propertyAddress: '456 Oak Ave, Los Angeles, CA',
            appraiserName: 'David Kim',
            orderDate: '2024-01-22',
            estimatedValue: 650000,
            status: 'pending',
            dueDate: '2024-02-08',
            cost: 400,
            notes: 'Drive-by appraisal requested'
          }
        ];

        const mockHOADocuments: HOADocument[] = [
          {
            id: '1',
            propertyAddress: '123 Main St, San Francisco, CA',
            documentType: 'covenants',
            title: 'HOA Covenants and Restrictions',
            status: 'received',
            requestDate: '2024-01-15',
            receivedDate: '2024-01-18',
            fileUrl: 'hoa_covenants.pdf',
            notes: 'Standard HOA covenants document'
          },
          {
            id: '2',
            propertyAddress: '456 Oak Ave, Los Angeles, CA',
            documentType: 'financials',
            title: 'HOA Financial Statements 2023',
            status: 'requested',
            requestDate: '2024-01-20',
            notes: 'Annual financial statements for HOA review'
          }
        ];

        const mockIssues: Issue[] = [
          {
            id: '1',
            propertyAddress: '123 Main St, San Francisco, CA',
            category: 'inspection',
            priority: 'high',
            status: 'open',
            title: 'Foundation Crack Found',
            description: 'Inspector identified a 2-inch crack in the foundation that needs structural engineer evaluation',
            assignedTo: 'John Smith',
            createdDate: '2024-01-25',
            dueDate: '2024-02-02'
          },
          {
            id: '2',
            propertyAddress: '456 Oak Ave, Los Angeles, CA',
            category: 'hoa',
            priority: 'medium',
            status: 'in-progress',
            title: 'HOA Approval Pending',
            description: 'Waiting for HOA board approval of property modifications',
            assignedTo: 'Sarah Johnson',
            createdDate: '2024-01-20',
            dueDate: '2024-02-10'
          }
        ];

        setDueDiligenceData({
          inspectors: mockInspectors,
          appraisals: mockAppraisals,
          hoaDocuments: mockHOADocuments,
          issues: mockIssues,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ padding: '1rem' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading Due Diligence Tools...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '1rem' }}>
        {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceData.inspectors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Inspectors
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceData.appraisals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Appraisals
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <BusinessIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceData.hoaDocuments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                HOA Documents
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ 
            height: '100%',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {dueDiligenceData.issues.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Issues
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: brandColors.neutral.light }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="Due Diligence Tools"
            sx={{
              '& .MuiTab-root': {
                minHeight: '64px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'none',
                color: brandColors.neutral.dark,
                '&.Mui-selected': {
                  color: brandColors.actions.primary,
                  backgroundColor: brandColors.backgrounds.primary,
                },
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SearchIcon />
                  Inspections
                </Box>
              }
              id="due-diligence-tab-0"
              aria-controls="due-diligence-tabpanel-0"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon />
                  Appraisals
                </Box>
              }
              id="due-diligence-tab-1"
              aria-controls="due-diligence-tabpanel-1"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  HOA Documents
                </Box>
              }
              id="due-diligence-tab-2"
              aria-controls="due-diligence-tabpanel-2"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon />
                  Issue Tracking
                </Box>
              }
              id="due-diligence-tab-3"
              aria-controls="due-diligence-tabpanel-3"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanelComponent value={activeTab} index={0}>
          {/* Inspections Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                Inspection Booking
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenInspectionDialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Book Inspection
              </Button>
            </Box>

            {/* Available Inspectors */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Available Inspectors
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {dueDiligenceData.inspectors.map((inspector) => (
                    <Card key={inspector.id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {inspector.name}
                        </Typography>
                        <Chip
                          label={`${inspector.rating}★`}
                          size="small"
                          sx={{ backgroundColor: brandColors.accent.success, color: brandColors.backgrounds.primary }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {inspector.company}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {inspector.specialties.map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Rate:</strong> ${inspector.hourlyRate}/hr
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <strong>Contact:</strong> {inspector.contactInfo.phone}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setInspectionForm({ ...inspectionForm, inspectorId: inspector.id });
                          setOpenInspectionDialog(true);
                        }}
                        sx={{ width: '100%' }}
                      >
                        Book This Inspector
                      </Button>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanelComponent>

        <TabPanelComponent value={activeTab} index={1}>
          {/* Appraisals Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                Appraisal Orders
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAppraisalDialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Order Appraisal
              </Button>
            </Box>

            {/* Appraisals Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Appraisal Orders
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Appraiser</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Estimated Value</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dueDiligenceData.appraisals.map((appraisal) => (
                      <TableRow key={appraisal.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {appraisal.propertyAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {appraisal.appraiserName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(appraisal.orderDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatCurrency(appraisal.estimatedValue)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(appraisal.dueDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appraisal.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(appraisal.status),
                              color: brandColors.backgrounds.primary,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Appraisal">
                              <IconButton size="small" onClick={() => setOpenAppraisalDialog(true)}>
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
          </Box>
        </TabPanelComponent>

        <TabPanelComponent value={activeTab} index={2}>
          {/* HOA Documents Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                HOA Document Portal
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenHOADialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Request Document
              </Button>
            </Box>

            {/* HOA Documents Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  HOA Document Requests
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Document Type</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Request Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dueDiligenceData.hoaDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {document.propertyAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={document.documentType}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {document.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(document.requestDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={document.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(document.status),
                              color: brandColors.backgrounds.primary,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {document.fileUrl && (
                              <Tooltip title="Download">
                                <IconButton size="small">
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Edit Request">
                              <IconButton size="small" onClick={() => setOpenHOADialog(true)}>
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
          </Box>
        </TabPanelComponent>

        <TabPanelComponent value={activeTab} index={3}>
          {/* Issue Tracking Tab */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: brandColors.actions.primary }}>
                Issue Tracking
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenIssueDialog(true)}
                sx={{ backgroundColor: brandColors.actions.primary, '&:hover': { backgroundColor: '#1565c0' } }}
              >
                Create Issue
              </Button>
            </Box>

            {/* Issue Tracking Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                  Active Issues
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dueDiligenceData.issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 150 }}>
                            {issue.propertyAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={issue.category}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 200 }}>
                            {issue.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={issue.priority}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(issue.priority),
                              color: brandColors.backgrounds.primary,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={issue.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(issue.status),
                              color: brandColors.backgrounds.primary,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {issue.assignedTo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(issue.dueDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Issue">
                              <IconButton size="small" onClick={() => setOpenIssueDialog(true)}>
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
          </Box>
        </TabPanelComponent>
      </Paper>

      {/* Dialogs */}
      {/* Inspection Booking Dialog */}
      <Dialog open={openInspectionDialog} onClose={() => setOpenInspectionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Book Inspection</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Property Address"
                value={inspectionForm.propertyAddress}
                onChange={(e) => setInspectionForm({ ...inspectionForm, propertyAddress: e.target.value })}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Inspector</InputLabel>
                <Select
                  value={inspectionForm.inspectorId}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, inspectorId: e.target.value })}
                  label="Inspector"
                >
                  {dueDiligenceData.inspectors.map((inspector) => (
                    <MenuItem key={inspector.id} value={inspector.id}>
                      {inspector.name} - {inspector.company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Inspection Date"
                type="date"
                value={inspectionForm.inspectionDate}
                onChange={(e) => setInspectionForm({ ...inspectionForm, inspectionDate: e.target.value })}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Inspection Type</InputLabel>
                <Select
                  value={inspectionForm.inspectionType}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, inspectionType: e.target.value })}
                  label="Inspection Type"
                >
                  <MenuItem value="general">General Home Inspection</MenuItem>
                  <MenuItem value="structural">Structural Inspection</MenuItem>
                  <MenuItem value="electrical">Electrical Inspection</MenuItem>
                  <MenuItem value="plumbing">Plumbing Inspection</MenuItem>
                  <MenuItem value="hvac">HVAC Inspection</MenuItem>
                  <MenuItem value="roof">Roof Inspection</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Notes"
                value={inspectionForm.notes}
                onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInspectionDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleInspectionBooking(inspectionForm)}
            disabled={!inspectionForm.propertyAddress || !inspectionForm.inspectorId || !inspectionForm.inspectionDate}
          >
            Book Inspection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Appraisal Order Dialog */}
      <Dialog open={openAppraisalDialog} onClose={() => setOpenAppraisalDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Appraisal</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Property Address"
                value={appraisalForm.propertyAddress}
                onChange={(e) => setAppraisalForm({ ...appraisalForm, propertyAddress: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Appraiser Name"
                value={appraisalForm.appraiserName}
                onChange={(e) => setAppraisalForm({ ...appraisalForm, appraiserName: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Estimated Value"
                type="number"
                value={appraisalForm.estimatedValue}
                onChange={(e) => setAppraisalForm({ ...appraisalForm, estimatedValue: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={appraisalForm.dueDate}
                onChange={(e) => setAppraisalForm({ ...appraisalForm, dueDate: e.target.value })}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={appraisalForm.cost}
                onChange={(e) => setAppraisalForm({ ...appraisalForm, cost: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Notes"
                value={appraisalForm.notes}
                onChange={(e) => setAppraisalForm({ ...appraisalForm, notes: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAppraisalDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleAppraisalOrder(appraisalForm)}
            disabled={!appraisalForm.propertyAddress || !appraisalForm.appraiserName || !appraisalForm.dueDate}
          >
            Order Appraisal
          </Button>
        </DialogActions>
      </Dialog>

      {/* HOA Document Request Dialog */}
      <Dialog open={openHOADialog} onClose={() => setOpenHOADialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Request HOA Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Property Address"
                value={hoaForm.propertyAddress}
                onChange={(e) => setHoaForm({ ...hoaForm, propertyAddress: e.target.value })}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={hoaForm.documentType}
                  onChange={(e) => setHoaForm({ ...hoaForm, documentType: e.target.value })}
                  label="Document Type"
                >
                  <MenuItem value="covenants">Covenants & Restrictions</MenuItem>
                  <MenuItem value="bylaws">Bylaws</MenuItem>
                  <MenuItem value="rules">Rules & Regulations</MenuItem>
                  <MenuItem value="financials">Financial Statements</MenuItem>
                  <MenuItem value="meetings">Meeting Minutes</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Document Title"
                value={hoaForm.title}
                onChange={(e) => setHoaForm({ ...hoaForm, title: e.target.value })}
                margin="normal"
                required
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                label="Notes"
                value={hoaForm.notes}
                onChange={(e) => setHoaForm({ ...hoaForm, notes: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHOADialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleHOADocumentRequest(hoaForm)}
            disabled={!hoaForm.propertyAddress || !hoaForm.title}
          >
            Request Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Issue Creation Dialog */}
      <Dialog open={openIssueDialog} onClose={() => setOpenIssueDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Issue</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Property Address"
                value={issueForm.propertyAddress}
                onChange={(e) => setIssueForm({ ...issueForm, propertyAddress: e.target.value })}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={issueForm.category}
                  onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                  label="Category"
                >
                  <MenuItem value="inspection">Inspection</MenuItem>
                  <MenuItem value="appraisal">Appraisal</MenuItem>
                  <MenuItem value="hoa">HOA</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                  <MenuItem value="environmental">Environmental</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={issueForm.priority}
                  onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={issueForm.dueDate}
                onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Title"
                value={issueForm.title}
                onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                margin="normal"
                required
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                label="Description"
                value={issueForm.description}
                onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
                required
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                label="Assigned To"
                value={issueForm.assignedTo}
                onChange={(e) => setIssueForm({ ...issueForm, assignedTo: e.target.value })}
                margin="normal"
                required
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIssueDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleIssueCreation(issueForm)}
            disabled={!issueForm.propertyAddress || !issueForm.title || !issueForm.description || !issueForm.assignedTo || !issueForm.dueDate}
          >
            Create Issue
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    );
  };

export default DueDiligenceTools;
