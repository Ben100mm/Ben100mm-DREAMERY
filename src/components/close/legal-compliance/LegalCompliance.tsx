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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Description as DocumentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { brandColors } from "../../../theme";

// Types
interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  description: string;
  required: boolean;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

interface Attorney {
  id: string;
  name: string;
  firm: string;
  specialization: string[];
  rating: number;
  experience: number;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  availability: string[];
  hourlyRate: number;
}

interface ComplianceData {
  checklist: ChecklistItem[];
  attorneys: Attorney[];
  documents: LegalDocument[];
  notarySessions: NotarySession[];
}

interface LegalDocument {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'pending' | 'signed' | 'completed';
  parties: string[];
  dueDate: string;
  lastModified: string;
}

interface NotarySession {
  id: string;
  date: string;
  time: string;
  type: 'remote' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  documents: string[];
  notary: string;
}

// Mock data
const mockChecklist: ChecklistItem[] = [
  {
    id: '1',
    category: 'Title & Deed',
    item: 'Title Search Verification',
    description: 'Verify property title is clear of liens and encumbrances',
    required: true,
    completed: true,
    dueDate: '2024-01-25',
    priority: 'critical',
    notes: 'Title search completed, no issues found',
  },
  {
    id: '2',
    category: 'Title & Deed',
    item: 'Deed Preparation',
    description: 'Prepare warranty deed for transfer',
    required: true,
    completed: false,
    dueDate: '2024-02-01',
    priority: 'high',
    notes: 'Pending seller approval',
  },
  {
    id: '3',
    category: 'Financing',
    item: 'Loan Documents Review',
    description: 'Review and approve all loan documentation',
    required: true,
    completed: false,
    dueDate: '2024-01-30',
    priority: 'high',
    notes: 'Under review by legal team',
  },
  {
    id: '4',
    category: 'Financing',
    item: 'Lender Approval',
    description: 'Obtain final lender approval for closing',
    required: true,
    completed: false,
    dueDate: '2024-02-05',
    priority: 'critical',
    notes: 'Conditional approval received',
  },
  {
    id: '5',
    category: 'Insurance',
    item: 'Title Insurance Policy',
    description: 'Secure title insurance for buyer and lender',
    required: true,
    completed: false,
    dueDate: '2024-02-10',
    priority: 'medium',
    notes: 'Quote received, policy pending',
  },
  {
    id: '6',
    category: 'Insurance',
    item: 'Homeowner Insurance',
    description: 'Verify homeowner insurance coverage',
    required: true,
    completed: true,
    dueDate: '2024-01-20',
    priority: 'medium',
    notes: 'Policy active and verified',
  },
  {
    id: '7',
    category: 'Compliance',
    item: 'RESPA Compliance',
    description: 'Ensure RESPA disclosure requirements met',
    required: true,
    completed: false,
    dueDate: '2024-01-28',
    priority: 'high',
    notes: 'Disclosures prepared, pending review',
  },
  {
    id: '8',
    category: 'Compliance',
    item: 'State-Specific Requirements',
    description: 'Verify compliance with state closing laws',
    required: true,
    completed: false,
    dueDate: '2024-02-01',
    priority: 'high',
    notes: 'California-specific requirements identified',
  },
];

const mockAttorneys: Attorney[] = [
  {
    id: '1',
    name: 'Sarah Johnson, Esq.',
    firm: 'Johnson Legal Group',
    specialization: ['Real Estate', 'Contract Law', 'Title Issues'],
    rating: 4.9,
    experience: 15,
    contact: {
      phone: '(555) 123-4567',
      email: 'sarah.johnson@johnsonlegal.com',
      address: '123 Legal Ave, San Francisco, CA 94102',
    },
    availability: ['Mon-Fri 9AM-6PM', 'Weekend appointments available'],
    hourlyRate: 350,
  },
  {
    id: '2',
    name: 'Michael Chen, Esq.',
    firm: 'Chen & Associates',
    specialization: ['Real Estate', 'Commercial Law', 'Escrow'],
    rating: 4.8,
    experience: 12,
    contact: {
      phone: '(555) 234-5678',
      email: 'mchen@chenassociates.com',
      address: '456 Business Blvd, San Francisco, CA 94105',
    },
    availability: ['Mon-Fri 8AM-7PM'],
    hourlyRate: 325,
  },
  {
    id: '3',
    name: 'Jennifer Martinez, Esq.',
    firm: 'Martinez Law Office',
    specialization: ['Real Estate', 'Family Law', 'Estate Planning'],
    rating: 4.7,
    experience: 18,
    contact: {
      phone: '(555) 345-6789',
      email: 'jmartinez@martinezlaw.com',
      address: '789 Court St, San Francisco, CA 94108',
    },
    availability: ['Mon-Fri 9AM-5PM', 'Evening consultations'],
    hourlyRate: 375,
  },
];

const mockDocuments: LegalDocument[] = [
  {
    id: '1',
    name: 'Purchase Agreement',
    type: 'contract',
    status: 'signed',
    parties: ['Buyer', 'Seller'],
    dueDate: '2024-01-15',
    lastModified: '2024-01-15',
  },
  {
    id: '2',
    name: 'Loan Application',
    type: 'financing',
    status: 'completed',
    parties: ['Buyer', 'Lender'],
    dueDate: '2024-01-20',
    lastModified: '2024-01-20',
  },
  {
    id: '3',
    name: 'Title Commitment',
    type: 'title',
    status: 'pending',
    parties: ['Title Company', 'Buyer', 'Lender'],
    dueDate: '2024-02-01',
    lastModified: '2024-01-22',
  },
  {
    id: '4',
    name: 'Closing Disclosure',
    type: 'disclosure',
    status: 'draft',
    parties: ['Lender', 'Buyer'],
    dueDate: '2024-02-10',
    lastModified: '2024-01-24',
  },
];

const mockNotarySessions: NotarySession[] = [
  {
    id: '1',
    date: '2024-02-05',
    time: '10:00 AM',
    type: 'remote',
    status: 'scheduled',
    documents: ['Purchase Agreement', 'Deed'],
    notary: 'Lisa Thompson',
  },
  {
    id: '2',
    date: '2024-02-12',
    time: '2:00 PM',
    type: 'in-person',
    status: 'scheduled',
    documents: ['Loan Documents', 'Title Documents'],
    notary: 'Robert Wilson',
  },
];

const LegalCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedState, setSelectedState] = useState('CA');
  const [complianceData, setComplianceData] = useState<ComplianceData>({
    checklist: mockChecklist,
    attorneys: mockAttorneys,
    documents: mockDocuments,
    notarySessions: mockNotarySessions,
  });
  const [attorneyReferralForm, setAttorneyReferralForm] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    description: '',
    urgency: 'medium',
  });
  const [notaryForm, setNotaryForm] = useState({
    date: null as Date | null,
    time: '',
    type: 'remote',
    documents: [] as string[],
    notes: '',
  });
  const [referralDialogOpen, setReferralDialogOpen] = useState(false);
  const [notaryDialogOpen, setNotaryDialogOpen] = useState(false);
  const [esignDialogOpen, setEsignDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStateChange = async (state: string) => {
    setSelectedState(state);
    try {
      // Fetch state-specific checklist
      const response = await fetch(`/api/checklists/${state}`);
      if (response.ok) {
        const data = await response.json();
        setComplianceData(prev => ({ ...prev, checklist: data }));
        toast.success(`Loaded state compliance checklist`);
      }
    } catch (error) {
      console.error('Failed to fetch checklist:', error);
      toast.error('Failed to load state-specific checklist');
    }
  };

  const handleChecklistItemToggle = (itemId: string) => {
    setComplianceData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return brandColors.accent.success;
      case 'pending':
        return brandColors.accent.warning;
      case 'draft':
        return brandColors.text.disabled;
      case 'signed':
        return brandColors.accent.info;
      default:
        return brandColors.text.disabled;
    }
  };

  const handleAttorneyReferral = async () => {
    try {
      const response = await fetch('/api/attorneys/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attorneyReferralForm),
      });

      if (response.ok) {
        toast.success('Attorney referral submitted successfully!');
        setReferralDialogOpen(false);
        setAttorneyReferralForm({
          name: '',
          email: '',
          phone: '',
          caseType: '',
          description: '',
          urgency: 'medium',
        });
      } else {
        throw new Error('Referral failed');
      }
    } catch (error) {
      toast.error('Failed to submit attorney referral');
      console.error('Referral error:', error);
    }
  };

  const handleNotaryScheduling = async () => {
    if (!notaryForm.date || !notaryForm.time) {
      toast.error('Please select date and time');
      return;
    }

    try {
      const response = await fetch('/api/notary/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...notaryForm,
          date: notaryForm.date.toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        toast.success('Notary session scheduled successfully!');
        setNotaryDialogOpen(false);
        setNotaryForm({
          date: null,
          time: '',
          type: 'remote',
          documents: [],
          notes: '',
        });
      } else {
        throw new Error('Scheduling failed');
      }
    } catch (error) {
      toast.error('Failed to schedule notary session');
      console.error('Scheduling error:', error);
    }
  };

  const handleEsignDocument = async (documentId: string) => {
    try {
      // Mock DocuSign API call
      const response = await fetch('/api/esign/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          parties: ['buyer@email.com', 'seller@email.com'],
          message: 'Please review and sign the attached document',
        }),
      });

      if (response.ok) {
        toast.success('E-signature request sent successfully!');
        setEsignDialogOpen(false);
        setSelectedDocument(null);
      } else {
        throw new Error('E-signature failed');
      }
    } catch (error) {
      toast.error('Failed to send e-signature request');
      console.error('E-signature error:', error);
    }
  };

  const fetchAttorneys = async () => {
    try {
      const response = await fetch('/api/attorneys');
      if (response.ok) {
        const data = await response.json();
        setComplianceData(prev => ({ ...prev, attorneys: data }));
      }
    } catch (error) {
      console.error('Failed to fetch attorneys:', error);
    }
  };

  useEffect(() => {
    fetchAttorneys();
  }, []);

  const completedItems = complianceData.checklist.filter(item => item.completed).length;
  const totalItems = complianceData.checklist.length;
  const completionPercentage = (completedItems / totalItems) * 100;

  return (
    <Box sx={{ p: 3 }}>

      {/* State Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocationIcon color="primary" />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select State</InputLabel>
              <Select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                label="Select State"
              >
                <MenuItem value="CA">California</MenuItem>
                <MenuItem value="NY">New York</MenuItem>
                <MenuItem value="TX">Texas</MenuItem>
                <MenuItem value="FL">Florida</MenuItem>
                <MenuItem value="IL">Illinois</MenuItem>
                <MenuItem value="PA">Pennsylvania</MenuItem>
                <MenuItem value="OH">Ohio</MenuItem>
                <MenuItem value="GA">Georgia</MenuItem>
                <MenuItem value="NC">North Carolina</MenuItem>
                <MenuItem value="MI">Michigan</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              State-specific compliance requirements will be loaded
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Compliance Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Compliance Progress: {completedItems}/{totalItems} items completed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completionPercentage.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: brandColors.borders.secondary,
            '& .MuiLinearProgress-bar': {
              backgroundColor: completionPercentage === 100 ? brandColors.accent.success : brandColors.accent.info,
            }
          }} 
        />
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: brandColors.neutral[100] }}>
          <Tab label="Compliance Checklist" />
          <Tab label="Document Management" />
          <Tab label="Attorney Referrals" />
          <Tab label="Notary Services" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Compliance Checklist Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedState} Compliance Checklist
              </Typography>
              
              {complianceData.checklist.map((category) => {
                const categoryItems = complianceData.checklist.filter(item => item.category === category.category);
                return (
                  <Accordion key={category.category} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          {category.category}
                        </Typography>
                        <Chip 
                          label={`${categoryItems.filter(item => item.completed).length}/${categoryItems.length}`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {categoryItems.map((item) => (
                          <ListItem key={item.id} sx={{ border: '1px solid brandColors.borders.secondary', borderRadius: 1, mb: 1 }}>
                            <ListItemIcon>
                              <Checkbox
                                checked={item.completed}
                                onChange={() => handleChecklistItemToggle(item.id)}
                                color="primary"
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {item.item}
                                  </Typography>
                                  <Chip 
                                    label={item.priority} 
                                    size="small"
                                    sx={{ 
                                      backgroundColor: getPriorityColor(item.priority),
                                      color: brandColors.backgrounds.primary,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                  {item.required && (
                                    <Chip label="Required" size="small" color="error" />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Due: {item.dueDate}
                                    </Typography>
                                    {item.notes && (
                                      <Typography variant="caption" color="text.secondary">
                                        Notes: {item.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          )}

          {/* Document Management Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Legal Document Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DocumentIcon />}
                  onClick={() => setEsignDialogOpen(true)}
                >
                  Send for E-Signature
                </Button>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Parties</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Last Modified</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceData.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {doc.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={doc.type} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={doc.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(doc.status),
                            color: brandColors.backgrounds.primary
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {doc.parties.join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell>{doc.dueDate}</TableCell>
                      <TableCell>{doc.lastModified}</TableCell>
                      <TableCell>
                        <Tooltip title="View Document">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Document">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Attorney Referrals Tab */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Attorney Referrals
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonIcon />}
                  onClick={() => setReferralDialogOpen(true)}
                >
                  Request Referral
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {complianceData.attorneys.map((attorney) => (
                  <Box key={attorney.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <PersonIcon color="primary" />
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {attorney.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: brandColors.accent.warning, fontSize: 20 }} />
                            <Typography variant="body2">{attorney.rating}</Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {attorney.firm}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          {attorney.specialization.map((spec, index) => (
                            <Chip 
                              key={index} 
                              label={spec} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Experience:</strong> {attorney.experience} years
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Rate:</strong> attorney.hourlyRate/hr
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {attorney.contact.phone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {attorney.contact.email}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => {
                            setAttorneyReferralForm(prev => ({
                              ...prev,
                              caseType: attorney.specialization[0],
                            }));
                            setReferralDialogOpen(true);
                          }}
                        >
                          Request Referral
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Notary Services Tab */}
          {activeTab === 3 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Digital Notary Services
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setNotaryDialogOpen(true)}
                >
                  Schedule Notary Session
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Scheduled Sessions
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Documents</TableCell>
                        <TableCell>Notary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complianceData.notarySessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {session.date} at {session.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={session.type} 
                              size="small"
                              color={session.type === 'remote' ? 'primary' : 'secondary'}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {session.documents.join(', ')}
                            </Typography>
                          </TableCell>
                          <TableCell>{session.notary}</TableCell>
                          <TableCell>
                            <Chip 
                              label={session.status} 
                              size="small"
                              color={session.status === 'scheduled' ? 'primary' : 
                                     session.status === 'completed' ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reschedule">
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                
                <Box>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Notary Services
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        We offer both remote and in-person notary services for your convenience.
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Remote Notary:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Secure video conferencing
                          • Real-time document signing
                          • Available 24/7
                          • $25 per session
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          In-Person Notary:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Traditional notary services
                          • Office visits available
                          • Mobile notary service
                          • $35 per session
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Attorney Referral Dialog */}
      <Dialog open={referralDialogOpen} onClose={() => setReferralDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Request Attorney Referral</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Your Name"
                value={attorneyReferralForm.name}
                onChange={(e) => setAttorneyReferralForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={attorneyReferralForm.email}
                onChange={(e) => setAttorneyReferralForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Phone"
                value={attorneyReferralForm.phone}
                onChange={(e) => setAttorneyReferralForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Case Type</InputLabel>
                <Select
                  value={attorneyReferralForm.caseType}
                  onChange={(e) => setAttorneyReferralForm(prev => ({ ...prev, caseType: e.target.value }))}
                  label="Case Type"
                >
                  <MenuItem value="Real Estate">Real Estate</MenuItem>
                  <MenuItem value="Contract Law">Contract Law</MenuItem>
                  <MenuItem value="Title Issues">Title Issues</MenuItem>
                  <MenuItem value="Commercial Law">Commercial Law</MenuItem>
                  <MenuItem value="Estate Planning">Estate Planning</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <FormControl fullWidth>
                <InputLabel>Urgency Level</InputLabel>
                <Select
                  value={attorneyReferralForm.urgency}
                  onChange={(e) => setAttorneyReferralForm(prev => ({ ...prev, urgency: e.target.value }))}
                  label="Urgency Level"
                >
                  <MenuItem value="low">Low - General consultation</MenuItem>
                  <MenuItem value="medium">Medium - Standard timeline</MenuItem>
                  <MenuItem value="high">High - Urgent matter</MenuItem>
                  <MenuItem value="critical">Critical - Immediate attention needed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                label="Case Description"
                multiline
                rows={4}
                value={attorneyReferralForm.description}
                onChange={(e) => setAttorneyReferralForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe your legal matter in detail..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReferralDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAttorneyReferral} variant="contained" disabled={!attorneyReferralForm.name || !attorneyReferralForm.email}>
            Submit Referral Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notary Scheduling Dialog */}
      <Dialog open={notaryDialogOpen} onClose={() => setNotaryDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule Notary Session</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Session Date"
                  value={notaryForm.date}
                  onChange={(newDate) => setNotaryForm(prev => ({ ...prev, date: newDate }))}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Preferred Time"
                type="time"
                value={notaryForm.time}
                onChange={(e) => setNotaryForm(prev => ({ ...prev, time: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Session Type</InputLabel>
                <Select
                  value={notaryForm.type}
                  onChange={(e) => setNotaryForm(prev => ({ ...prev, type: e.target.value }))}
                  label="Session Type"
                >
                  <MenuItem value="remote">Remote (Video)</MenuItem>
                  <MenuItem value="in-person">In-Person</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                label="Documents to Notarize"
                multiline
                rows={3}
                value={notaryForm.documents.join(', ')}
                onChange={(e) => setNotaryForm(prev => ({ ...prev, documents: e.target.value.split(',').map(d => d.trim()) }))}
                placeholder="Enter document names separated by commas..."
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
              <TextField
                fullWidth
                label="Additional Notes"
                multiline
                rows={2}
                value={notaryForm.notes}
                onChange={(e) => setNotaryForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotaryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNotaryScheduling} variant="contained" disabled={!notaryForm.date || !notaryForm.time}>
            Schedule Session
          </Button>
        </DialogActions>
      </Dialog>

      {/* E-Signature Dialog */}
      <Dialog open={esignDialogOpen} onClose={() => setEsignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Document for E-Signature</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Select Document</InputLabel>
            <Select
              value={selectedDocument?.id || ''}
              onChange={(e) => {
                const doc = complianceData.documents.find(d => d.id === e.target.value);
                setSelectedDocument(doc || null);
              }}
              label="Select Document"
            >
              {complianceData.documents.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name} ({doc.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {selectedDocument && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <SecurityIcon sx={{ mr: 1 }} />
              This document will be sent for electronic signature using DocuSign integration.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEsignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedDocument && handleEsignDocument(selectedDocument.id)} 
            variant="contained" 
            disabled={!selectedDocument}
          >
            Send for E-Signature
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LegalCompliance;
