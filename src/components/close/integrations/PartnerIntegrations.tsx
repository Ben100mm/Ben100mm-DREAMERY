import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  AccountBalance as LenderIcon,
  Description as TitleIcon,
  Security as InsuranceIcon,
  Build as ServiceIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
  Sync as SyncingIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  BookOnline as BookingIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  LocalShipping as MovingIcon,
  CleaningServices as CleaningIcon,
  Lock as LocksmithIcon,
  Pool as PoolIcon,
  Yard as YardIcon,
  Wifi as WifiIcon,
  ElectricBolt as ElectricIcon,
  WaterDrop as WaterIcon,
  LocalGasStation as GasIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { brandColors } from "../../../theme";

// Types
interface LenderStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  loanCount: number;
  activeLoans: number;
  apiVersion: string;
  features: string[];
  connectionHealth: number;
  lastError?: string;
}

interface TitleUpdate {
  id: string;
  type: 'search' | 'insurance' | 'closing' | 'recording';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  estimatedCompletion?: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: 'search' | 'insurance' | 'closing' | 'recording';
  status: 'pending' | 'uploaded' | 'processed' | 'completed';
  uploadedAt: string;
  processedAt?: string;
  url: string;
}

interface InsuranceStatus {
  id: string;
  provider: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  policyNumber: string;
  effectiveDate: string;
  expiryDate: string;
  coverage: string[];
  premium: number;
  deductible: number;
  lastUpdated: string;
  nextRenewal: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  category: 'moving' | 'cleaning' | 'locksmith' | 'pool' | 'landscaping' | 'utilities';
  status: 'available' | 'busy' | 'offline';
  rating: number;
  reviewCount: number;
  pricing: Pricing;
  availability: Availability[];
  specialties: string[];
  contact: Contact;
  logo: string;
}

interface Pricing {
  baseRate: number;
  hourlyRate?: number;
  packageRates?: PackageRate[];
  currency: string;
}

interface PackageRate {
  name: string;
  description: string;
  price: number;
  duration: string;
  includes: string[];
}

interface Availability {
  day: string;
  slots: TimeSlot[];
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Contact {
  phone: string;
  email: string;
  address: string;
  website?: string;
}

interface IntegrationData {
  lender: LenderStatus[];
  title: TitleUpdate[];
  insurance: InsuranceStatus[];
  services: ServiceProvider[];
}

// Mock data
const mockLenderStatus: LenderStatus[] = [
  {
    id: '1',
    name: 'Wells Fargo',
    status: 'connected',
    lastSync: '2024-02-14T10:30:00Z',
    loanCount: 45,
    activeLoans: 23,
    apiVersion: 'v2.1',
    features: ['Rate Lock', 'Document Upload', 'Status Tracking', 'Payment Processing'],
    connectionHealth: 98,
  },
  {
    id: '2',
    name: 'Chase Bank',
    status: 'syncing',
    lastSync: '2024-02-14T10:25:00Z',
    loanCount: 32,
    activeLoans: 18,
    apiVersion: 'v2.0',
    features: ['Rate Lock', 'Document Upload', 'Status Tracking'],
    connectionHealth: 85,
  },
  {
    id: '3',
    name: 'Bank of America',
    status: 'error',
    lastSync: '2024-02-14T09:45:00Z',
    loanCount: 28,
    activeLoans: 15,
    apiVersion: 'v1.9',
    features: ['Rate Lock', 'Document Upload'],
    connectionHealth: 45,
    lastError: 'API authentication failed',
  },
];

const mockTitleUpdates: TitleUpdate[] = [
  {
    id: '1',
    type: 'search',
    status: 'completed',
    description: 'Title search completed for 123 Main St',
    timestamp: '2024-02-14T10:00:00Z',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    estimatedCompletion: '2024-02-14T10:00:00Z',
    documents: [
      {
        id: '1',
        name: 'Title Search Report',
        type: 'search',
        status: 'completed',
        uploadedAt: '2024-02-14T09:30:00Z',
        processedAt: '2024-02-14T10:00:00Z',
        url: '/documents/title-search-report.pdf',
      },
    ],
  },
  {
    id: '2',
    type: 'insurance',
    status: 'in-progress',
    description: 'Title insurance policy processing',
    timestamp: '2024-02-14T09:30:00Z',
    priority: 'medium',
    assignedTo: 'Mike Wilson',
    estimatedCompletion: '2024-02-14T14:00:00Z',
    documents: [
      {
        id: '2',
        name: 'Insurance Application',
        type: 'insurance',
        status: 'uploaded',
        uploadedAt: '2024-02-14T09:00:00Z',
        url: '/documents/insurance-application.pdf',
      },
    ],
  },
];

const mockInsuranceStatus: InsuranceStatus[] = [
  {
    id: '1',
    provider: 'State Farm',
    status: 'active',
    policyNumber: 'SF-123456789',
    effectiveDate: '2024-02-01',
    expiryDate: '2025-02-01',
    coverage: ['Dwelling', 'Personal Property', 'Liability', 'Medical Payments'],
    premium: 1200,
    deductible: 1000,
    lastUpdated: '2024-02-14T10:00:00Z',
    nextRenewal: '2025-02-01',
  },
  {
    id: '2',
    provider: 'Allstate',
    status: 'pending',
    policyNumber: 'AL-987654321',
    effectiveDate: '2024-02-15',
    expiryDate: '2025-02-15',
    coverage: ['Dwelling', 'Personal Property', 'Liability'],
    premium: 1100,
    deductible: 1500,
    lastUpdated: '2024-02-14T09:00:00Z',
    nextRenewal: '2025-02-15',
  },
];

const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'ABC Moving Company',
    category: 'moving',
    status: 'available',
    rating: 4.8,
    reviewCount: 156,
    pricing: {
      baseRate: 150,
      hourlyRate: 75,
      packageRates: [
        {
          name: 'Studio Apartment',
          description: '1-2 rooms, small furniture',
          price: 300,
          duration: '2-3 hours',
          includes: ['Packing materials', 'Furniture protection', 'Loading/unloading'],
        },
        {
          name: '2-Bedroom Home',
          description: '3-4 rooms, standard furniture',
          price: 500,
          duration: '4-6 hours',
          includes: ['Packing materials', 'Furniture protection', 'Loading/unloading', 'Assembly'],
        },
      ],
      currency: 'USD',
    },
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '08:00', end: '12:00', available: true },
          { start: '13:00', end: '17:00', available: true },
        ],
      },
      {
        day: 'Tuesday',
        slots: [
          { start: '08:00', end: '12:00', available: true },
          { start: '13:00', end: '17:00', available: false },
        ],
      },
    ],
    specialties: ['Residential moves', 'Office relocations', 'Long-distance moves'],
    contact: {
      phone: '(555) 123-4567',
      email: 'info@abcmoving.com',
      address: '123 Moving St, San Francisco, CA 94102',
      website: 'https://abcmoving.com',
    },
    logo: 'https://via.placeholder.com/60x60/1976d2/ffffff?text=ABC',
  },
  {
    id: '2',
    name: 'Sparkle Clean Services',
    category: 'cleaning',
    status: 'available',
    rating: 4.6,
    reviewCount: 89,
    pricing: {
      baseRate: 80,
      hourlyRate: 45,
      packageRates: [
        {
          name: 'Move-In Cleaning',
          description: 'Deep cleaning for new homeowners',
          price: 200,
          duration: '4-5 hours',
          includes: ['Kitchen deep clean', 'Bathroom sanitization', 'Floor cleaning', 'Window cleaning'],
        },
      ],
      currency: 'USD',
    },
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '14:00', end: '18:00', available: true },
        ],
      },
    ],
    specialties: ['Move-in cleaning', 'Deep cleaning', 'Post-construction cleaning'],
    contact: {
      phone: '(555) 234-5678',
      email: 'info@sparkleclean.com',
      address: '456 Clean Ave, San Francisco, CA 94103',
    },
    logo: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=SCS',
  },
  {
    id: '3',
    name: 'Secure Locksmith Pro',
    category: 'locksmith',
    status: 'available',
    rating: 4.9,
    reviewCount: 234,
    pricing: {
      baseRate: 100,
      hourlyRate: 60,
      packageRates: [
        {
          name: 'New Home Security',
          description: 'Complete lock replacement and security upgrade',
          price: 350,
          duration: '2-3 hours',
          includes: ['Lock replacement', 'Key duplication', 'Security assessment', 'Smart lock installation'],
        },
      ],
      currency: 'USD',
    },
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '08:00', end: '12:00', available: true },
          { start: '13:00', end: '17:00', available: true },
          { start: '18:00', end: '22:00', available: true },
        ],
      },
    ],
    specialties: ['Emergency locksmith', 'Smart lock installation', 'Security systems'],
    contact: {
      phone: '(555) 345-6789',
      email: 'info@securelocksmith.com',
      address: '789 Security Blvd, San Francisco, CA 94104',
    },
    logo: 'https://via.placeholder.com/60x60/ff9800/ffffff?text=SLP',
  },
];

const PartnerIntegrations: React.FC = () => {
  const [integrationData, setIntegrationData] = useState<IntegrationData>({
    lender: mockLenderStatus,
    title: mockTitleUpdates,
    insurance: mockInsuranceStatus,
    services: mockServiceProviders,
  });
  const [selectedService, setSelectedService] = useState<ServiceProvider | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Initial data fetch
    fetchIntegrationData();
    
    // Set up real-time updates
    const interval = setInterval(fetchIntegrationData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchIntegrationData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch lender status
      const lenderResponse = await fetch('/api/lender/status');
      if (lenderResponse.ok) {
        const lenderData = await lenderResponse.json();
        setIntegrationData(prev => ({ ...prev, lender: lenderData }));
      }

      // Fetch title updates
      const titleResponse = await fetch('/api/title/updates');
      if (titleResponse.ok) {
        const titleData = await titleResponse.json();
        setIntegrationData(prev => ({ ...prev, title: titleData }));
      }

      // Fetch insurance status
      const insuranceResponse = await fetch('/api/insurance/status');
      if (insuranceResponse.ok) {
        const insuranceData = await insuranceResponse.json();
        setIntegrationData(prev => ({ ...prev, insurance: insuranceData }));
      }

      // Fetch service providers
      const servicesResponse = await fetch('/api/services/book');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setIntegrationData(prev => ({ ...prev, services: servicesData }));
      }
    } catch (error) {
      console.error('Failed to fetch integration data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleServiceBooking = async (serviceId: string) => {
    try {
      const response = await fetch('/api/services/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId }),
      });

      if (response.ok) {
        toast.success('Service booked successfully!');
        setBookingDialogOpen(false);
      } else {
        throw new Error('Failed to book service');
      }
    } catch (error) {
      toast.error('Failed to book service');
      console.error('Booking error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'completed':
      case 'active':
        return brandColors.accent.success;
      case 'syncing':
      case 'in-progress':
      case 'pending':
        return brandColors.accent.warning;
      case 'disconnected':
      case 'failed':
      case 'expired':
      case 'cancelled':
        return brandColors.actions.error;
      case 'error':
        return '#9c27b0';
      default:
        return brandColors.text.disabled;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'completed':
      case 'active':
        return <ConnectedIcon />;
      case 'syncing':
      case 'in-progress':
      case 'pending':
        return <SyncingIcon />;
      case 'disconnected':
      case 'failed':
      case 'expired':
      case 'cancelled':
        return <ErrorIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return brandColors.accent.success;
      case 'medium':
        return brandColors.accent.warning;
      case 'high':
        return brandColors.actions.error;
      case 'critical':
        return '#9c27b0';
      default:
        return brandColors.text.disabled;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'moving':
        return <MovingIcon />;
      case 'cleaning':
        return <CleaningIcon />;
      case 'locksmith':
        return <LocksmithIcon />;
      case 'pool':
        return <PoolIcon />;
      case 'landscaping':
        return <YardIcon />;
      case 'utilities':
        return <WifiIcon />;
      default:
        return <ServiceIcon />;
    }
  };

  const getUtilityIcon = (utility: string) => {
    switch (utility.toLowerCase()) {
      case 'electric':
        return <ElectricIcon />;
      case 'water':
        return <WaterIcon />;
      case 'gas':
        return <GasIcon />;
      default:
        return <WifiIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <LenderIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
            <Typography variant="h6" component="div">
              {integrationData.lender.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lender Integrations
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TitleIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
            <Typography variant="h6" component="div">
              {integrationData.title.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Title Updates
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <InsuranceIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
            <Typography variant="h6" component="div">
              {integrationData.insurance.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insurance Policies
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <ServiceIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
            <Typography variant="h6" component="div">
              {integrationData.services.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service Providers
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Integration Status Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* Lender Integrations */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LenderIcon sx={{ fontSize: 32, color: brandColors.actions.primary }} />
                <Typography variant="h6">
                  Lender Integrations
                </Typography>
                <IconButton onClick={fetchIntegrationData} disabled={isRefreshing }>
                  <RefreshIcon />
                </IconButton>
              </Box>

              <List dense>
                {integrationData.lender.map((lender) => (
                  <ListItem key={lender.id} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: getStatusColor(lender.status) }}>
                        {getStatusIcon(lender.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={lender.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Status: {lender.status} | API v{lender.apiVersion}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Loans: {lender.activeLoans}/{lender.loanCount} | Last Sync: {new Date(lender.lastSync).toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={lender.connectionHealth}
                              sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption">
                              {lender.connectionHealth}%
                            </Typography>
                          </Box>
                          {lender.lastError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {lender.lastError}
                            </Alert>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Title Updates */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TitleIcon sx={{ fontSize: 32, color: brandColors.accent.success }} />
                <Typography variant="h6">
                  Title Updates
                </Typography>
              </Box>

              <List dense>
                {integrationData.title.map((update) => (
                  <ListItem key={update.id} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: getStatusColor(update.status) }}>
                        {getStatusIcon(update.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={update.description}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip 
                              label={update.type} 
                              size="small" 
                              color="primary"
                            />
                            <Chip 
                              label={update.status} 
                              size="small"
                              sx={{ 
                                backgroundColor: getStatusColor(update.status),
                                color: brandColors.backgrounds.primary
                              }}
                            />
                            <Chip 
                              label={update.priority} 
                              size="small"
                              sx={{ 
                                backgroundColor: getPriorityColor(update.priority),
                                color: brandColors.backgrounds.primary
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {update.assignedTo && `Assigned to: ${update.assignedTo}`}
                            {update.estimatedCompletion && ` | Est. completion: ${new Date(update.estimatedCompletion).toLocaleString()}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(update.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Insurance Status */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <InsuranceIcon sx={{ fontSize: 32, color: brandColors.accent.warning }} />
                <Typography variant="h6">
                  Insurance Status
                </Typography>
              </Box>

              <List dense>
                {integrationData.insurance.map((policy) => (
                  <ListItem key={policy.id} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: getStatusColor(policy.status) }}>
                        {getStatusIcon(policy.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={policy.provider}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Policy: {policy.policyNumber} | Status: {policy.status}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Premium: policy.premium/year | Deductible: policy.deductible
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Effective: {policy.effectiveDate} | Expires: {policy.expiryDate}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {policy.coverage.slice(0, 3).map((item, index) => (
                              <Chip 
                                key={index} 
                                label={item} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {policy.coverage.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{policy.coverage.length - 3} more
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Service Providers */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <ServiceIcon sx={{ fontSize: 32, color: '#9c27b0' }} />
                <Typography variant="h6">
                  Service Providers
                </Typography>
              </Box>

              <List dense>
                {integrationData.services.map((service) => (
                  <ListItem key={service.id} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={service.logo} sx={{ width: 50, height: 50 }}>
                        {getCategoryIcon(service.category)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={service.name}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip 
                              label={service.category} 
                              size="small" 
                              color="primary"
                            />
                            <Chip 
                              label={service.status} 
                              size="small"
                              color={service.status === 'available' ? 'success' : 'warning'}
                            />
                            <Chip 
                              label={`${service.rating} ⭐`} 
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Starting at service.pricing.baseRate
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {service.specialties.slice(0, 2).join(', ')}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<BookingIcon />}
                            onClick={() => {
                              setSelectedService(service);
                              setBookingDialogOpen(true);
                            }}
                            sx={{ mt: 1 }}
                            fullWidth
                          >
                            Book Service
                          </Button>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Service Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Book Service - {selectedService?.name}
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedService.logo} sx={{ width: 60, height: 60 }}>
                  {getCategoryIcon(selectedService.category)}
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedService.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedService.category} • {selectedService.rating} ⭐ ({selectedService.reviewCount} reviews)
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Available Packages
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                {selectedService.pricing.packageRates?.map((pkg, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {pkg.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {pkg.description}
                      </Typography>
                      <Typography variant="h5" color="primary" gutterBottom>
                        pkg.price
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Duration: {pkg.duration}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        {pkg.includes.map((item, idx) => (
                          <Chip 
                            key={idx} 
                            label={item} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone: {selectedService.contact.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {selectedService.contact.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {selectedService.contact.address}
                </Typography>
                {selectedService.contact.website && (
                  <Typography variant="body2" color="text.secondary">
                    Website: {selectedService.contact.website}
                  </Typography>
                )}
              </Box>

              <Alert severity="info">
                Click "Book Now" to proceed with service booking. You'll be contacted by the service provider to confirm details and schedule.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedService && handleServiceBooking(selectedService.id)} 
            variant="contained"
            startIcon={<BookingIcon />}
          >
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartnerIntegrations;
