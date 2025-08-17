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
  LinearProgress,
  Alert,
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
  Grid,
  Divider,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Schedule as ScheduleIcon,
  Calculate as CalculateIcon,
  Description as DocumentIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import jsPDF from 'jspdf';
import { brandColors } from "../../../theme";
import ProfileHeader from '../../ProfileHeader';

// Types
interface LoanStatus {
  id: string;
  status: 'pre-approved' | 'approved' | 'conditional' | 'funded' | 'closed';
  progress: number;
  lastUpdated: string;
  nextMilestone: string;
  estimatedCompletion: string;
}

interface CostBreakdown {
  id: string;
  category: string;
  amount: number;
  description: string;
  required: boolean;
  status: 'pending' | 'paid' | 'waived';
}

interface LoanData {
  status: LoanStatus;
  costs: CostBreakdown[];
  documents: Document[];
  rateLock: RateLockInfo;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  encrypted: boolean;
  size: string;
}

interface RateLockInfo {
  rate: number;
  lockedUntil: string;
  daysRemaining: number;
  lockFee: number;
}

// Mock data
const mockLoanStatus: LoanStatus = {
  id: '1',
  status: 'approved',
  progress: 75,
  lastUpdated: '2024-01-24',
  nextMilestone: 'Document Review',
  estimatedCompletion: '2024-02-14',
};

const mockCosts: CostBreakdown[] = [
  {
    id: '1',
    category: 'Origination Fee',
    amount: 2500,
    description: 'Loan processing and underwriting',
    required: true,
    status: 'paid',
  },
  {
    id: '2',
    category: 'Appraisal Fee',
    amount: 450,
    description: 'Property valuation',
    required: true,
    status: 'paid',
  },
  {
    id: '3',
    category: 'Title Insurance',
    amount: 1200,
    description: 'Owner and lender policies',
    required: true,
    status: 'pending',
  },
  {
    id: '4',
    category: 'Recording Fees',
    amount: 150,
    description: 'County recording charges',
    required: true,
    status: 'pending',
  },
  {
    id: '5',
    category: 'Escrow Setup',
    amount: 800,
    description: 'Initial escrow deposit',
    required: true,
    status: 'pending',
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Loan Application.pdf',
    type: 'application',
    uploadedAt: '2024-01-20',
    encrypted: true,
    size: '2.3 MB',
  },
  {
    id: '2',
    name: 'Income Verification.pdf',
    type: 'income',
    uploadedAt: '2024-01-21',
    encrypted: true,
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'Bank Statements.pdf',
    type: 'financial',
    uploadedAt: '2024-01-22',
    encrypted: true,
    size: '3.1 MB',
  },
];

const mockRateLock: RateLockInfo = {
  rate: 6.25,
  lockedUntil: '2024-02-14',
  daysRemaining: 21,
  lockFee: 500,
};

const FinancingCoordination: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loanData, setLoanData] = useState<LoanData>({
    status: mockLoanStatus,
    costs: mockCosts,
    documents: mockDocuments,
    rateLock: mockRateLock,
  });
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);

  // Check rate lock status and show reminders
  useEffect(() => {
    if (loanData.rateLock.daysRemaining <= 7) {
      toast.error(`Rate lock expires in ${loanData.rateLock.daysRemaining} days!`, {
        duration: 5000,
        icon: '⚠️',
      });
    } else if (loanData.rateLock.daysRemaining <= 14) {
      toast(`Rate lock expires in ${loanData.rateLock.daysRemaining} days`, {
        duration: 4000,
        icon: '🔒',
      });
    }
  }, [loanData.rateLock.daysRemaining]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pre-approved':
        return brandColors.accent.warning;
      case 'approved':
        return brandColors.accent.success;
      case 'conditional':
        return brandColors.accent.info;
      case 'funded':
        return '#9c27b0';
      case 'closed':
        return '#607d8b';
      default:
        return brandColors.text.disabled;
    }
  };

  const getCostStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return brandColors.accent.success;
      case 'pending':
        return brandColors.accent.warning;
      case 'waived':
        return brandColors.accent.info;
      default:
        return brandColors.text.disabled;
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !documentType) {
      toast.error('Please select a file and document type');
      return;
    }

    try {
      // Encrypt file content
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        const encryptedContent = CryptoJS.AES.encrypt(
          fileContent,
          'loan-document-key'
        ).toString();

        // Mock API call
        const response = await fetch('/api/loan/documents/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedFile.name,
            type: documentType,
            encryptedContent,
            size: selectedFile.size,
          }),
        });

        if (response.ok) {
          toast.success('Document uploaded and encrypted successfully!');
          setUploadDialogOpen(false);
          setSelectedFile(null);
          setDocumentType('');
          
          // Update documents list
          const newDocument: Document = {
            id: Date.now().toString(),
            name: selectedFile.name,
            type: documentType,
            uploadedAt: new Date().toISOString().split('T')[0],
            encrypted: true,
            size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
          };
          
          setLoanData(prev => ({
            ...prev,
            documents: [...prev.documents, newDocument],
          }));
        } else {
          throw new Error('Upload failed');
        }
      };
      fileReader.readAsText(selectedFile);
    } catch (error) {
      toast.error('Failed to upload document');
      console.error('Upload error:', error);
    }
  };

  const generateLoanPackage = async () => {
    try {
      // Mock API call to generate loan package
      const response = await fetch('/api/loan/package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanId: loanData.status.id,
          includeDocuments: true,
        }),
      });

      if (response.ok) {
        // Generate PDF using jsPDF
        const doc = new jsPDF();
        
        // Add content to PDF
        doc.setFontSize(20);
        doc.text('Loan Package Summary', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Loan Status: ${loanData.status.status}`, 20, 40);
        doc.text(`Progress: ${loanData.status.progress}%`, 20, 50);
        doc.text(`Next Milestone: ${loanData.status.nextMilestone}`, 20, 60);
        doc.text(`Estimated Completion: ${loanData.status.estimatedCompletion}`, 20, 70);
        
        doc.text('Closing Costs:', 20, 90);
        let yPosition = 100;
        loanData.costs.forEach((cost, index) => {
          doc.text(`${cost.category}: $${cost.amount.toLocaleString()}`, 30, yPosition);
          yPosition += 10;
          if (index < loanData.costs.length - 1) yPosition += 5;
        });

        // Save PDF
        doc.save('loan-package.pdf');
        toast.success('Loan package PDF generated successfully!');
        setPackageDialogOpen(false);
      } else {
        throw new Error('Failed to generate package');
      }
    } catch (error) {
      toast.error('Failed to generate loan package');
      console.error('Package generation error:', error);
    }
  };

  const fetchLoanStatus = async () => {
    try {
      const response = await fetch('/api/loan/status');
      if (response.ok) {
        const data = await response.json();
        setLoanData(prev => ({ ...prev, status: data }));
      }
    } catch (error) {
      console.error('Failed to fetch loan status:', error);
    }
  };

  const fetchClosingCosts = async () => {
    try {
      const response = await fetch('/api/loan/costs');
      if (response.ok) {
        const data = await response.json();
        setLoanData(prev => ({ ...prev, costs: data }));
      }
    } catch (error) {
      console.error('Failed to fetch closing costs:', error);
    }
  };

  useEffect(() => {
    fetchLoanStatus();
    fetchClosingCosts();
  }, []);

  return (
    <>
      <ProfileHeader title="Financing Coordination" subtitle="Manage loan processing and closing cost coordination" />
      <Box sx={{ p: 3, marginTop: '80px' }}>
        {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Financing Coordination
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage loan processing, document collection, and closing cost coordination
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
            <Typography variant="h6" component="div">
              {loanData.status.status.charAt(0).toUpperCase() + loanData.status.status.slice(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Loan Status
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <LockIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
            <Typography variant="h6" component="div">
              {loanData.rateLock.rate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rate Lock
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
            <Typography variant="h6" component="div">
              {loanData.rateLock.daysRemaining}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Days Remaining
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CalculateIcon sx={{ fontSize: 40, color: brandColors.accent.info, mb: 1 }} />
            <Typography variant="h6" component="div">
              ${loanData.costs.reduce((sum, cost) => sum + cost.amount, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Costs
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Rate Lock Alert */}
      {loanData.rateLock.daysRemaining <= 14 && (
        <Alert severity={loanData.rateLock.daysRemaining <= 7 ? 'error' : 'warning'} sx={{ mb: 3 }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          Rate lock expires on {loanData.rateLock.lockedUntil} ({loanData.rateLock.daysRemaining} days remaining)
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: brandColors.neutral.light }}>
          <Tab label="Loan Status" />
          <Tab label="Document Management" />
          <Tab label="Closing Costs" />
          <Tab label="Loan Package" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Loan Status Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Loan Progress Tracking
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {loanData.status.nextMilestone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loanData.status.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={loanData.status.progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: brandColors.borders.secondary,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStatusColor(loanData.status.status),
                    }
                  }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated: {loanData.status.lastUpdated}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Est. Completion: {loanData.status.estimatedCompletion}
                  </Typography>
                </Box>
              </Box>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Status: {loanData.status.status.charAt(0).toUpperCase() + loanData.status.status.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Next milestone: {loanData.status.nextMilestone}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={fetchLoanStatus}
                    sx={{ mt: 1 }}
                  >
                    Refresh Status
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Document Management Tab */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Document Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Upload Document
                </Button>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Document Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Security</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loanData.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>
                        <Chip label={doc.type} size="small" />
                      </TableCell>
                      <TableCell>{doc.uploadedAt}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={<SecurityIcon />} 
                          label={doc.encrypted ? 'Encrypted' : 'Unencrypted'} 
                          size="small"
                          color={doc.encrypted ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Document">
                          <IconButton size="small">
                            <ViewIcon />
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

          {/* Closing Costs Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Closing Cost Breakdown
              </Typography>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Required</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loanData.costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {cost.category}
                        </Typography>
                      </TableCell>
                      <TableCell>{cost.description}</TableCell>
                      <TableCell align="right">
                        ${cost.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={cost.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: getCostStatusColor(cost.status),
                            color: brandColors.backgrounds.primary
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={cost.required ? 'Yes' : 'No'} 
                          size="small"
                          color={cost.required ? 'primary' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ mt: 2, p: 2, backgroundColor: brandColors.neutral.light, borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Total Closing Costs: ${loanData.costs.reduce((sum, cost) => sum + cost.amount, 0).toLocaleString()}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={fetchClosingCosts}
                  sx={{ mt: 1 }}
                >
                  Refresh Costs
                </Button>
              </Box>
            </Box>
          )}

          {/* Loan Package Tab */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Loan Package Preparation
              </Typography>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    Generate a comprehensive loan package PDF containing all loan information, 
                    documents, and closing cost breakdown.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DocumentIcon />}
                    onClick={() => setPackageDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    Generate Loan Package
                  </Button>
                </CardContent>
              </Card>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                <Box>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Package Contents
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Loan application and approval details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • All uploaded documents
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Closing cost breakdown
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Rate lock information
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Export Options
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • PDF format for printing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Secure document sharing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Email integration ready
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Document Type</InputLabel>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              label="Document Type"
            >
              <MenuItem value="application">Loan Application</MenuItem>
              <MenuItem value="income">Income Verification</MenuItem>
              <MenuItem value="financial">Financial Documents</MenuItem>
              <MenuItem value="property">Property Documents</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            type="file"
            fullWidth
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setSelectedFile(target.files?.[0] || null);
            }}
            inputProps={{
              accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
            }}
          />
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <SecurityIcon sx={{ mr: 1 }} />
            All documents are encrypted using AES-256 encryption for security.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFileUpload} variant="contained" disabled={!selectedFile || !documentType}>
            Upload & Encrypt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Package Dialog */}
      <Dialog open={packageDialogOpen} onClose={() => setPackageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Loan Package</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            This will generate a comprehensive PDF package containing:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            • Current loan status and progress
            • All uploaded documents (encrypted)
            • Complete closing cost breakdown
            • Rate lock information and expiration
            • Estimated completion timeline
          </Typography>
          <Alert severity="info">
            The package will be generated and downloaded automatically.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPackageDialogOpen(false)}>Cancel</Button>
          <Button onClick={generateLoanPackage} variant="contained">
            Generate Package
          </Button>
        </DialogActions>
      </Dialog>
        </Box>
      </>
    );
  };

export default FinancingCoordination;
