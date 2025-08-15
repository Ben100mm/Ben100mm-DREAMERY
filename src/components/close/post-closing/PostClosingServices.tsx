import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { brandColors } from "../../../theme";

// Types
interface Exemption {
  id: string;
  type: 'homestead' | 'veteran' | 'senior' | 'disability' | 'agricultural';
  status: 'pending' | 'approved' | 'denied' | 'expired';
  filingDate: string;
  effectiveDate?: string;
  expiryDate?: string;
  annualSavings: number;
  documents: Document[];
  notes: string;
}

interface Document {
  id: string;
  name: string;
  type: 'application' | 'proof' | 'certificate' | 'other';
  url: string;
  uploadedAt: string;
  required: boolean;
}

interface MortgagePayment {
  id: string;
  lender: string;
  accountNumber: string;
  monthlyPayment: number;
  dueDate: number;
  autoPay: boolean;
  paymentMethod: 'checking' | 'savings' | 'credit-card' | 'manual';
  reminders: Reminder[];
  nextPayment: string;
}

interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'push';
  daysBefore: number;
  enabled: boolean;
}

interface Warranty {
  id: string;
  provider: string;
  plan: string;
  coverage: string[];
  annualPremium: number;
  deductible: number;
  term: number;
  features: string[];
  rating: number;
  reviewCount: number;
  status: 'available' | 'purchased' | 'expired';
  logo: string;
}

interface PropertyManagement {
  id: string;
  company: string;
  contact: Contact;
  services: string[];
  fees: Fee[];
  status: 'evaluating' | 'contracted' | 'active' | 'terminated';
  contractStart?: string;
  contractEnd?: string;
  notes: string;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Fee {
  type: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  description: string;
}

interface PostClosingData {
  exemptions: Exemption[];
  warranties: Warranty[];
  mortgagePayments: MortgagePayment[];
  propertyManagement: PropertyManagement[];
}

// Mock data
const mockExemptions: Exemption[] = [
  {
    id: '1',
    type: 'homestead',
    status: 'pending',
    filingDate: '2024-02-14',
    annualSavings: 1200,
    documents: [
      {
        id: '1',
        name: 'Homestead Exemption Application',
        type: 'application',
        url: '/documents/homestead-app.pdf',
        uploadedAt: '2024-02-14',
        required: true,
      },
      {
        id: '2',
        name: 'Driver License',
        type: 'proof',
        url: '/documents/drivers-license.pdf',
        uploadedAt: '2024-02-14',
        required: true,
      },
    ],
    notes: 'Filed on closing date, awaiting county approval',
  },
];

const mockWarranties: Warranty[] = [
  {
    id: '1',
    provider: 'American Home Shield',
    plan: 'ShieldComplete',
    coverage: ['HVAC', 'Electrical', 'Plumbing', 'Appliances', 'Roof Leaks'],
    annualPremium: 600,
    deductible: 100,
    term: 12,
    features: ['24/7 Customer Service', 'Nationwide Coverage', 'Flexible Payment Plans'],
    rating: 4.6,
    reviewCount: 15420,
    status: 'available',
    logo: 'https://via.placeholder.com/60x60/1976d2/ffffff?text=AHS',
  },
  {
    id: '2',
    provider: 'Choice Home Warranty',
    plan: 'Total Home Protection',
    coverage: ['HVAC', 'Electrical', 'Plumbing', 'Kitchen Appliances'],
    annualPremium: 500,
    deductible: 75,
    term: 12,
    features: ['30-Day Workmanship Guarantee', '24/7 Claims', 'No Hidden Fees'],
    rating: 4.4,
    reviewCount: 8920,
    status: 'available',
    logo: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=CHW',
  },
  {
    id: '3',
    provider: 'First American Home Warranty',
    plan: 'Premium Plan',
    coverage: ['HVAC', 'Electrical', 'Plumbing', 'Appliances', 'Pool & Spa'],
    annualPremium: 700,
    deductible: 125,
    term: 12,
    features: ['Comprehensive Coverage', 'Fast Claims Processing', 'Expert Technicians'],
    rating: 4.7,
    reviewCount: 11250,
    status: 'available',
    logo: 'https://via.placeholder.com/60x60/ff9800/ffffff?text=FAH',
  },
];

const mockMortgagePayments: MortgagePayment[] = [
  {
    id: '1',
    lender: 'Wells Fargo',
    accountNumber: '****1234',
    monthlyPayment: 3200,
    dueDate: 1,
    autoPay: true,
    paymentMethod: 'checking',
    reminders: [
      { id: '1', type: 'email', daysBefore: 7, enabled: true },
      { id: '2', type: 'sms', daysBefore: 3, enabled: true },
      { id: '3', type: 'push', daysBefore: 1, enabled: true },
    ],
    nextPayment: '2024-03-01',
  },
];

const mockPropertyManagement: PropertyManagement[] = [
  {
    id: '1',
    company: 'ABC Property Management',
    contact: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@abcpm.com',
      address: '123 Management St, San Francisco, CA 94102',
    },
    services: ['Tenant Screening', 'Rent Collection', 'Maintenance', 'Financial Reporting'],
    fees: [
      { type: 'Management Fee', amount: 8, frequency: 'monthly', description: 'Percentage of monthly rent' },
      { type: 'Leasing Fee', amount: 500, frequency: 'one-time', description: 'New tenant placement' },
      { type: 'Maintenance Fee', amount: 50, frequency: 'monthly', description: 'Maintenance coordination' },
    ],
    status: 'evaluating',
    notes: 'Evaluating multiple property management companies',
  },
];

const PostClosingServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [postClosingData, setPostClosingData] = useState<PostClosingData>({
    exemptions: mockExemptions,
    warranties: mockWarranties,
    mortgagePayments: mockMortgagePayments,
    propertyManagement: mockPropertyManagement,
  });
  const [exemptionForm, setExemptionForm] = useState({
    type: 'homestead',
    filingDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [mortgageForm, setMortgageForm] = useState({
    lender: '',
    accountNumber: '',
    monthlyPayment: '',
    dueDate: 1,
    autoPay: false,
    paymentMethod: 'checking' as 'checking' | 'savings' | 'credit-card' | 'manual',
  });
  const [exemptionDialogOpen, setExemptionDialogOpen] = useState(false);
  const [mortgageDialogOpen, setMortgageDialogOpen] = useState(false);
  const [warrantyDialogOpen, setWarrantyDialogOpen] = useState(false);
  const [propertyManagementDialogOpen, setPropertyManagementDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleExemptionFiling = async () => {
    try {
      const response = await fetch('/api/homestead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exemptionForm),
      });

      if (response.ok) {
        toast.success('Homestead exemption filed successfully!');
        setExemptionDialogOpen(false);
        // Add new exemption to list
        const newExemption: Exemption = {
          id: Date.now().toString(),
          type: exemptionForm.type as Exemption['type'],
          status: 'pending',
          filingDate: exemptionForm.filingDate,
          annualSavings: 1200, // Mock value
          documents: [],
          notes: exemptionForm.notes,
        };
        setPostClosingData(prev => ({
          ...prev,
          exemptions: [...prev.exemptions, newExemption],
        }));
      } else {
        throw new Error('Failed to file exemption');
      }
    } catch (error) {
      toast.error('Failed to file homestead exemption');
      console.error('Exemption filing error:', error);
    }
  };

  const handleMortgageSetup = async () => {
    try {
      const response = await fetch('/api/mortgage/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mortgageForm),
      });

      if (response.ok) {
        toast.success('Mortgage payment setup completed!');
        setMortgageDialogOpen(false);
        // Add new mortgage payment to list
        const newMortgage: MortgagePayment = {
          id: Date.now().toString(),
          lender: mortgageForm.lender,
          accountNumber: mortgageForm.accountNumber,
          monthlyPayment: parseFloat(mortgageForm.monthlyPayment),
          dueDate: mortgageForm.dueDate,
          autoPay: mortgageForm.autoPay,
          paymentMethod: mortgageForm.paymentMethod,
          reminders: [
            { id: '1', type: 'email', daysBefore: 7, enabled: true },
            { id: '2', type: 'sms', daysBefore: 3, enabled: true },
          ],
          nextPayment: '2024-03-01', // Mock value
        };
        setPostClosingData(prev => ({
          ...prev,
          mortgagePayments: [...prev.mortgagePayments, newMortgage],
        }));
      } else {
        throw new Error('Failed to setup mortgage payment');
      }
    } catch (error) {
      toast.error('Failed to setup mortgage payment');
      console.error('Mortgage setup error:', error);
    }
    };
    
    const handleWarrantyPurchase = async (warrantyId: string) => {
      try {
        const response = await fetch('/api/warranties/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ warrantyId }),
        });

        if (response.ok) {
          toast.success('Home warranty purchased successfully!');
          // Update warranty status
          setPostClosingData(prev => ({
            ...prev,
            warranties: prev.warranties.map(warranty =>
              warranty.id === warrantyId ? { ...warranty, status: 'purchased' } : warranty
            ),
          }));
        } else {
          throw new Error('Failed to purchase warranty');
        }
      } catch (error) {
        toast.error('Failed to purchase home warranty');
        console.error('Warranty purchase error:', error);
      }
    };

    const handlePropertyManagementContract = async () => {
      try {
        const response = await fetch('/api/property-management', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postClosingData.propertyManagement[0]),
        });

        if (response.ok) {
          toast.success('Property management contract created!');
          setPropertyManagementDialogOpen(false);
        } else {
          throw new Error('Failed to create contract');
        }
      } catch (error) {
        toast.error('Failed to create property management contract');
        console.error('Contract creation error:', error);
      }
    };

    const fetchWarranties = async () => {
      try {
        const response = await fetch('/api/warranties');
        if (response.ok) {
          const warranties = await response.json();
          setPostClosingData(prev => ({ ...prev, warranties }));
        }
      } catch (error) {
        console.error('Failed to fetch warranties:', error);
      }
    };

    useEffect(() => {
      fetchWarranties();
    }, []);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return brandColors.accent.warning;
        case 'approved':
          return brandColors.accent.success;
        case 'denied':
          return brandColors.actions.error;
        case 'expired':
          return brandColors.text.disabled;
        case 'available':
          return brandColors.accent.info;
        case 'purchased':
          return brandColors.accent.success;
        case 'evaluating':
          return brandColors.accent.warning;
        case 'contracted':
          return brandColors.accent.info;
        case 'active':
          return brandColors.accent.success;
        case 'terminated':
          return brandColors.actions.error;
        default:
          return brandColors.text.disabled;
      }
    };

    const getExemptionTypeIcon = (type: string) => {
      switch (type) {
        case 'homestead':
          return <HomeIcon />;
        case 'veteran':
          return <SecurityIcon />;
        case 'senior':
          return <InfoIcon />;
        case 'disability':
          return <InfoIcon />;
        case 'agricultural':
          return <HomeIcon />;
        default:
          return <HomeIcon />;
      }
    };

    return (
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Post-Closing Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage exemptions, mortgage payments, warranties, and property management services
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
              <Typography variant="h6" component="div">
                {postClosingData.exemptions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exemptions Filed
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PaymentIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
              <Typography variant="h6" component="div">
                {postClosingData.mortgagePayments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mortgage Payments
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
              <Typography variant="h6" component="div">
                {postClosingData.warranties.filter(w => w.status === 'purchased').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Warranties
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SettingsIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" component="div">
                {postClosingData.propertyManagement.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Management Services
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Tabs */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: brandColors.neutral.light }}>
            <Tab label="Tax Exemptions" />
            <Tab label="Mortgage Payments" />
            <Tab label="Home Warranties" />
            <Tab label="Property Management" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {/* Tax Exemptions Tab */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Tax Exemptions
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setExemptionDialogOpen(true)}
                  >
                    File Exemption
                  </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {postClosingData.exemptions.map((exemption) => (
                    <Box key={exemption.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar sx={{ backgroundColor: brandColors.actions.primary }}>
                              {getExemptionTypeIcon(exemption.type)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {exemption.type.charAt(0).toUpperCase() + exemption.type.slice(1)} Exemption
                              </Typography>
                              <Chip 
                                label={exemption.status} 
                                size="small"
                                sx={{ 
                                  backgroundColor: getStatusColor(exemption.status),
                                  color: brandColors.backgrounds.primary
                                }}
                              />
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" color="primary" gutterBottom>
                              ${exemption.annualSavings.toLocaleString()}/year
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Filed: {exemption.filingDate}
                            </Typography>
                            {exemption.effectiveDate && (
                              <Typography variant="body2" color="text.secondary">
                                Effective: {exemption.effectiveDate}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Documents ({exemption.documents.length})
                            </Typography>
                            {exemption.documents.map((doc) => (
                              <Chip 
                                key={doc.id} 
                                label={doc.name} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>

                          {exemption.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {exemption.notes}
                            </Typography>
                          )}

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              fullWidth
                            >
                              Update
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<InfoIcon />}
                              fullWidth
                            >
                              Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Mortgage Payments Tab */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Mortgage Payment Setup
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setMortgageDialogOpen(true)}
                  >
                    Add Payment
                  </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {postClosingData.mortgagePayments.map((payment) => (
                    <Box key={payment.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <PaymentIcon sx={{ fontSize: 40, color: '#1976d0' }} />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {payment.lender}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Account: {payment.accountNumber}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" color="primary" gutterBottom>
                              ${payment.monthlyPayment.toLocaleString()}/month
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {payment.dueDate} of each month
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Next Payment: {payment.nextPayment}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Payment Method
                            </Typography>
                            <Chip 
                              label={payment.autoPay ? 'Auto-Pay Enabled' : 'Manual Payment'} 
                              size="small"
                              color={payment.autoPay ? 'success' : 'warning'}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Method: {payment.paymentMethod.replace('-', ' ').toUpperCase()}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Reminders ({payment.reminders.filter(r => r.enabled).length})
                            </Typography>
                            {payment.reminders.filter(r => r.enabled).map((reminder) => (
                              <Chip 
                                key={reminder.id} 
                                label={`${reminder.type.toUpperCase()} - ${reminder.daysBefore} days before`} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              fullWidth
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<NotificationsIcon />}
                              fullWidth
                            >
                              Reminders
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Home Warranties Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Home Warranty Options
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {postClosingData.warranties.map((warranty) => (
                    <Box key={warranty.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar src={warranty.logo} sx={{ width: 60, height: 60 }} />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {warranty.provider}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {warranty.plan}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" color="primary" gutterBottom>
                              ${warranty.annualPremium}/year
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Deductible: ${warranty.deductible}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Term: {warranty.term} months
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Coverage
                            </Typography>
                            {warranty.coverage.slice(0, 3).map((item, index) => (
                              <Chip 
                                key={index} 
                                label={item} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {warranty.coverage.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{warranty.coverage.length - 3} more
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CheckCircleIcon sx={{ color: brandColors.accent.success }} />
                            <Typography variant="body2" color="text.secondary">
                              {warranty.rating} ({warranty.reviewCount} reviews)
                            </Typography>
                          </Box>

                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleWarrantyPurchase(warranty.id)}
                            disabled={warranty.status === 'purchased'}
                          >
                            {warranty.status === 'purchased' ? 'Purchased' : 'Purchase Warranty'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Property Management Tab */}
            {activeTab === 3 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Property Management Services
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setPropertyManagementDialogOpen(true)}
                  >
                    Add Service
                  </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {postClosingData.propertyManagement.map((service) => (
                    <Box key={service.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <SettingsIcon sx={{ fontSize: 40, color: '#1976d0' }} />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {service.company}
                              </Typography>
                              <Chip 
                                label={service.status} 
                                size="small"
                                sx={{ 
                                  backgroundColor: getStatusColor(service.status),
                                  color: brandColors.backgrounds.primary
                                }}
                              />
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Contact
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {service.contact.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {service.contact.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {service.contact.email}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Services
                            </Typography>
                            {service.services.map((item, index) => (
                              <Chip 
                                key={index} 
                                label={item} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                              Fees
                            </Typography>
                            {service.fees.map((fee, index) => (
                              <Box key={index} sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {fee.type}: ${fee.amount} ({fee.frequency})
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {fee.description}
                                </Typography>
                              </Box>
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              fullWidth
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handlePropertyManagementContract()}
                              fullWidth
                            >
                              Contract
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Exemption Filing Dialog */}
        <Dialog open={exemptionDialogOpen} onClose={() => setExemptionDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>File Tax Exemption</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Exemption Type</InputLabel>
                <Select
                  value={exemptionForm.type}
                  onChange={(e) => setExemptionForm(prev => ({ ...prev, type: e.target.value }))}
                  label="Exemption Type"
                >
                  <MenuItem value="homestead">Homestead Exemption</MenuItem>
                  <MenuItem value="veteran">Veteran Exemption</MenuItem>
                  <MenuItem value="senior">Senior Exemption</MenuItem>
                  <MenuItem value="disability">Disability Exemption</MenuItem>
                  <MenuItem value="agricultural">Agricultural Exemption</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Filing Date"
                type="date"
                value={exemptionForm.filingDate}
                onChange={(e) => setExemptionForm(prev => ({ ...prev, filingDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={exemptionForm.notes}
                onChange={(e) => setExemptionForm(prev => ({ ...prev, notes: e.target.value }))}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExemptionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExemptionFiling} variant="contained">
              File Exemption
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mortgage Setup Dialog */}
        <Dialog open={mortgageDialogOpen} onClose={() => setMortgageDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Setup Mortgage Payment</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Lender"
                value={mortgageForm.lender}
                onChange={(e) => setMortgageForm(prev => ({ ...prev, lender: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Account Number"
                value={mortgageForm.accountNumber}
                onChange={(e) => setMortgageForm(prev => ({ ...prev, accountNumber: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Monthly Payment"
                type="number"
                value={mortgageForm.monthlyPayment}
                onChange={(e) => setMortgageForm(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Due Date"
                type="number"
                value={mortgageForm.dueDate}
                onChange={(e) => setMortgageForm(prev => ({ ...prev, dueDate: parseInt(e.target.value) }))}
                inputProps={{ min: 1, max: 31 }}
              />
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={mortgageForm.paymentMethod}
                  onChange={(e) => setMortgageForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  label="Payment Method"
                >
                  <MenuItem value="checking">Checking Account</MenuItem>
                  <MenuItem value="savings">Savings Account</MenuItem>
                  <MenuItem value="credit-card">Credit Card</MenuItem>
                  <MenuItem value="manual">Manual Payment</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mortgageForm.autoPay}
                    onChange={(e) => setMortgageForm(prev => ({ ...prev, autoPay: e.target.checked }))}
                  />
                }
                label="Enable Auto-Pay"
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMortgageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMortgageSetup} variant="contained">
              Setup Payment
            </Button>
          </DialogActions>
        </Dialog>

        {/* Warranty Details Dialog */}
        <Dialog open={warrantyDialogOpen} onClose={() => setWarrantyDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Warranty Details</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Warranty details and purchase form will be implemented here.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWarrantyDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Property Management Dialog */}
        <Dialog open={propertyManagementDialogOpen} onClose={() => setPropertyManagementDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Property Management Service</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Property management service form will be implemented here.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPropertyManagementDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  export default PostClosingServices;
