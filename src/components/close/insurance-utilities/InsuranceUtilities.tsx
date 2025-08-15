import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Bolt as BoltIcon,
  LocalShipping as MovingIcon,
  CleaningServices as CleaningIcon,
  Lock as LocksmithIcon,
  Search as SearchIcon,
  Compare as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { brandColors } from "../../../theme";

// Types
interface InsuranceQuote {
  id: string;
  provider: string;
  policyType: 'homeowners' | 'condo' | 'renters' | 'flood' | 'umbrella';
  annualPremium: number;
  deductible: number;
  coverage: {
    dwelling: number;
    personalProperty: number;
    liability: number;
    medicalPayments: number;
    additionalLivingExpenses: number;
  };
  features: string[];
  rating: number;
  reviewCount: number;
  status: 'quoted' | 'bound' | 'expired';
  validUntil: string;
  logo: string;
}

interface UtilityProvider {
  id: string;
  name: string;
  type: 'electric' | 'gas' | 'water' | 'sewer' | 'trash' | 'internet' | 'cable';
  accountNumber: string;
  phone: string;
  website: string;
  transferFee: number;
  depositRequired: boolean;
  depositAmount: number;
  status: 'active' | 'pending' | 'transferred';
  contact?: {
    phone: string;
    email: string;
    address: string;
  };
}

interface ServiceProvider {
  id: string;
  name: string;
  type: 'mover' | 'cleaner' | 'locksmith' | 'handyman' | 'landscaper';
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  minimumHours: number;
  availability: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  services: string[];
  insurance: boolean;
  bonded: boolean;
  licensed: boolean;
  logo: string;
  specialties: string[];
}

interface InsuranceUtilitiesData {
  insuranceQuotes: InsuranceQuote[];
  utilityProviders: UtilityProvider[];
  serviceProviders: ServiceProvider[];
  selectedInsurance: InsuranceQuote | null;
  selectedServices: ServiceProvider[];
}

// Mock data
const mockInsuranceQuotes: InsuranceQuote[] = [
  {
    id: '1',
    provider: 'State Farm',
    policyType: 'homeowners',
    annualPremium: 1200,
    deductible: 1000,
    coverage: {
      dwelling: 850000,
      personalProperty: 425000,
      liability: 300000,
      medicalPayments: 5000,
      additionalLivingExpenses: 85000,
    },
    features: ['24/7 Claims Service', 'Multi-Policy Discount', 'Home Security Discount'],
    rating: 4.8,
    reviewCount: 127,
    status: 'quoted',
    validUntil: '2024-02-24',
    logo: 'https://via.placeholder.com/60x60/1976d2/ffffff?text=SF',
  },
  {
    id: '2',
    provider: 'Allstate',
    policyType: 'homeowners',
    annualPremium: 1350,
    deductible: 1500,
    coverage: {
      dwelling: 850000,
      personalProperty: 425000,
      liability: 500000,
      medicalPayments: 10000,
      additionalLivingExpenses: 85000,
    },
    features: ['Accident Forgiveness', 'New Home Discount', 'Claims-Free Discount'],
    rating: 4.6,
    reviewCount: 89,
    status: 'quoted',
    validUntil: '2024-02-24',
    logo: 'https://via.placeholder.com/60x60/ff9800/ffffff?text=AL',
  },
  {
    id: '3',
    provider: 'Liberty Mutual',
    policyType: 'homeowners',
    annualPremium: 1100,
    deductible: 1000,
    coverage: {
      dwelling: 850000,
      personalProperty: 425000,
      liability: 300000,
      medicalPayments: 5000,
      additionalLivingExpenses: 85000,
    },
    features: ['Multi-Policy Discount', 'Home Safety Features', 'Loyalty Discount'],
    rating: 4.4,
    reviewCount: 156,
    status: 'quoted',
    validUntil: '2024-02-24',
    logo: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=LM',
  },
];

const mockUtilityProviders: UtilityProvider[] = [
  {
    id: '1',
    name: 'Pacific Gas & Electric',
    type: 'electric',
    accountNumber: 'PG&E-123456789',
    phone: '(800) 743-5000',
    website: 'www.pge.com',
    transferFee: 0,
    depositRequired: false,
    depositAmount: 0,
    status: 'active',
    contact: {
      phone: '(800) 743-5000',
      email: 'info@pge.com',
      address: '1900 Powell St, San Francisco, CA 94103',
    },
  },
  {
    id: '2',
    name: 'San Francisco Water',
    type: 'water',
    accountNumber: 'SFW-987654321',
    phone: '(415) 551-3000',
    website: 'www.sfwater.org',
    transferFee: 25,
    depositRequired: true,
    depositAmount: 150,
    status: 'pending',
    contact: {
      phone: '(415) 551-3000',
      email: 'info@sfwater.org',
      address: '101 8th St, San Francisco, CA 94103',
    },
  },
  {
    id: '3',
    name: 'Recology San Francisco',
    type: 'trash',
    accountNumber: 'REC-456789123',
    phone: '(415) 626-4000',
    website: 'www.recology.com',
    transferFee: 0,
    depositRequired: false,
    depositAmount: 0,
    status: 'active',
    contact: {
      phone: '(415) 626-4000',
      email: 'info@recology.com',
      address: '101 8th St, San Francisco, CA 94103',
    },
  },
  {
    id: '4',
    name: 'Comcast Xfinity',
    type: 'internet',
    accountNumber: 'COM-789123456',
    phone: '(800) 934-6489',
    website: 'www.xfinity.com',
    transferFee: 50,
    depositRequired: false,
    depositAmount: 0,
    status: 'pending',
    contact: {
      phone: '(800) 934-6489',
      email: 'info@xfinity.com',
      address: '101 8th St, San Francisco, CA 94103',
    },
  },
];

const mockServiceProviders: ServiceProvider[] = [
  {
    id: '1',
    name: 'ABC Moving Company',
    type: 'mover',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 85,
    minimumHours: 2,
    availability: ['Mon-Fri 8AM-6PM', 'Sat 9AM-5PM'],
    contact: {
      phone: '(555) 123-4567',
      email: 'info@abcmoving.com',
      address: '123 Moving St, San Francisco, CA 94102',
    },
    services: ['Local Moving', 'Long Distance', 'Packing Services', 'Storage'],
    insurance: true,
    bonded: true,
    licensed: true,
    logo: 'https://via.placeholder.com/60x60/1976d2/ffffff?text=ABC',
    specialties: ['Residential', 'Commercial', 'Piano Moving'],
  },
  {
    id: '2',
    name: 'Sparkle Clean Services',
    type: 'cleaner',
    rating: 4.7,
    reviewCount: 89,
    hourlyRate: 45,
    minimumHours: 3,
    availability: ['Mon-Sat 8AM-8PM'],
    contact: {
      phone: '(555) 234-5678',
      email: 'hello@sparkleclean.com',
      address: '456 Clean Ave, San Francisco, CA 94105',
    },
    services: ['Deep Cleaning', 'Move-in/out Cleaning', 'Regular Maintenance', 'Carpet Cleaning'],
    insurance: true,
    bonded: true,
    licensed: true,
    logo: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=SC',
    specialties: ['Eco-friendly', 'Pet-friendly', 'Allergen-free'],
  },
  {
    id: '3',
    name: 'Quick Lock & Key',
    type: 'locksmith',
    rating: 4.8,
    reviewCount: 156,
    hourlyRate: 75,
    minimumHours: 1,
    availability: ['24/7 Emergency Service'],
    contact: {
      phone: '(555) 345-6789',
      email: 'service@quicklock.com',
      address: '789 Lock Blvd, San Francisco, CA 94108',
    },
    services: ['Lock Installation', 'Key Duplication', 'Emergency Unlocking', 'Security Systems'],
    insurance: true,
    bonded: true,
    licensed: true,
    logo: 'https://via.placeholder.com/60x60/ff9800/ffffff?text=QL',
    specialties: ['Residential', 'Commercial', 'Automotive', 'Emergency'],
  },
  {
    id: '4',
    name: 'Green Thumb Landscaping',
    type: 'landscaper',
    rating: 4.6,
    reviewCount: 73,
    hourlyRate: 55,
    minimumHours: 4,
    availability: ['Mon-Fri 7AM-5PM', 'Sat 8AM-4PM'],
    contact: {
      phone: '(555) 456-7890',
      email: 'info@greenthumb.com',
      address: '321 Garden Way, San Francisco, CA 94110',
    },
    services: ['Lawn Maintenance', 'Garden Design', 'Tree Trimming', 'Irrigation'],
    insurance: true,
    bonded: true,
    licensed: true,
    logo: 'https://via.placeholder.com/60x60/4caf50/ffffff?text=GT',
    specialties: ['Sustainable', 'Native Plants', 'Water Conservation'],
  },
];

const InsuranceUtilities: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [insuranceUtilitiesData, setInsuranceUtilitiesData] = useState<InsuranceUtilitiesData>({
    insuranceQuotes: mockInsuranceQuotes,
    utilityProviders: mockUtilityProviders,
    serviceProviders: mockServiceProviders,
    selectedInsurance: null,
    selectedServices: [],
  });
  const [insuranceForm, setInsuranceForm] = useState({
    propertyAddress: '',
    propertyType: 'single-family',
    constructionYear: '',
    squareFootage: '',
    coverageAmount: '',
    policyType: 'homeowners',
  });
  const [utilityForm, setUtilityForm] = useState({
    providerName: '',
    accountNumber: '',
    transferDate: '',
    newOwnerName: '',
    newOwnerPhone: '',
    newOwnerEmail: '',
  });
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [bindingDialogOpen, setBindingDialogOpen] = useState(false);
  const [utilityDialogOpen, setUtilityDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const requestInsuranceQuotes = async () => {
    try {
      const response = await fetch('/api/insurance/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insuranceForm),
      });

      if (response.ok) {
        const quotes = await response.json();
        setInsuranceUtilitiesData(prev => ({ ...prev, insuranceQuotes: quotes }));
        toast.success('Insurance quotes requested successfully!');
        setQuoteDialogOpen(false);
      } else {
        throw new Error('Failed to request quotes');
      }
    } catch (error) {
      toast.error('Failed to request insurance quotes');
      console.error('Quote request error:', error);
    }
  };

  const bindInsurancePolicy = async (quoteId: string) => {
    try {
      const response = await fetch('/api/insurance/bind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId }),
      });

      if (response.ok) {
        toast.success('Insurance policy bound successfully!');
        setBindingDialogOpen(false);
        // Update quote status
        setInsuranceUtilitiesData(prev => ({
          ...prev,
          insuranceQuotes: prev.insuranceQuotes.map(quote =>
            quote.id === quoteId ? { ...quote, status: 'bound' } : quote
          ),
        }));
      } else {
        throw new Error('Failed to bind policy');
      }
    } catch (error) {
      toast.error('Failed to bind insurance policy');
      console.error('Binding error:', error);
    }
  };

  const transferUtility = async (providerId: string) => {
    try {
      const response = await fetch('/api/utilities/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          ...utilityForm,
        }),
      });

      if (response.ok) {
        toast.success('Utility transfer initiated successfully!');
        setUtilityDialogOpen(false);
        // Update utility status
        setInsuranceUtilitiesData(prev => ({
          ...prev,
          utilityProviders: prev.utilityProviders.map(provider =>
            provider.id === providerId ? { ...provider, status: 'transferred' } : provider
          ),
        }));
      } else {
        throw new Error('Failed to transfer utility');
      }
    } catch (error) {
      toast.error('Failed to transfer utility');
      console.error('Transfer error:', error);
    }
  };

  const fetchServiceProviders = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const providers = await response.json();
        setInsuranceUtilitiesData(prev => ({ ...prev, serviceProviders: providers }));
      }
    } catch (error) {
      console.error('Failed to fetch service providers:', error);
    }
  };

  const fetchUtilityProviders = async () => {
    try {
      const response = await fetch('/api/utilities');
      if (response.ok) {
        const providers = await response.json();
        setInsuranceUtilitiesData(prev => ({ ...prev, utilityProviders: providers }));
      }
    } catch (error) {
      console.error('Failed to fetch utility providers:', error);
    }
  };

  useEffect(() => {
    fetchServiceProviders();
    fetchUtilityProviders();
  }, []);

  const filteredServiceProviders = insuranceUtilitiesData.serviceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesType = filterType === 'all' || provider.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted':
        return brandColors.accent.info;
      case 'bound':
        return brandColors.accent.success;
      case 'expired':
        return brandColors.actions.error;
      case 'active':
        return brandColors.accent.success;
      case 'pending':
        return brandColors.accent.warning;
      case 'transferred':
        return '#9c27b0';
      default:
        return brandColors.text.disabled;
    }
  };

  const getUtilityTypeIcon = (type: string) => {
    switch (type) {
      case 'electric':
        return <BoltIcon />;
      case 'gas':
        return <BoltIcon />;
      case 'water':
        return <BoltIcon />;
      case 'sewer':
        return <BoltIcon />;
      case 'trash':
        return <BoltIcon />;
      case 'internet':
        return <BoltIcon />;
      case 'cable':
        return <BoltIcon />;
      default:
        return <BoltIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Insurance & Utilities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage insurance policies, utility transfers, and service provider connections
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <SecurityIcon sx={{ fontSize: 40, color: brandColors.actions.primary, mb: 1 }} />
            <Typography variant="h6" component="div">
              {insuranceUtilitiesData.insuranceQuotes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insurance Quotes
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <BoltIcon sx={{ fontSize: 40, color: brandColors.accent.success, mb: 1 }} />
            <Typography variant="h6" component="div">
              {insuranceUtilitiesData.utilityProviders.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Utility Providers
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <MovingIcon sx={{ fontSize: 40, color: brandColors.accent.warning, mb: 1 }} />
            <Typography variant="h6" component="div">
              {insuranceUtilitiesData.serviceProviders.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Service Providers
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
            <Typography variant="h6" component="div">
              {insuranceUtilitiesData.insuranceQuotes.filter(q => q.status === 'bound').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Policies
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: brandColors.neutral.light }}>
          <Tab label="Insurance Quotes" />
          <Tab label="Utility Transfers" />
          <Tab label="Service Providers" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Insurance Quotes Tab */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Insurance Quotes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => setQuoteDialogOpen(true)}
                >
                  Request Quotes
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {insuranceUtilitiesData.insuranceQuotes.map((quote) => (
                  <Box key={quote.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar src={quote.logo} sx={{ width: 60, height: 60 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {quote.provider}
                            </Typography>
                            <Chip 
                              label={quote.status} 
                              size="small"
                              sx={{ 
                                backgroundColor: getStatusColor(quote.status),
                                color: brandColors.backgrounds.primary
                              }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h5" color="primary" gutterBottom>
                            ${quote.annualPremium.toLocaleString()}/year
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Deductible: ${quote.deductible.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Coverage:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dwelling: ${quote.coverage.dwelling.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Personal Property: ${quote.coverage.personalProperty.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Liability: ${quote.coverage.liability.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Features:
                          </Typography>
                          {quote.features.map((feature, index) => (
                            <Chip 
                              key={index} 
                              label={feature} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Rating value={quote.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({quote.reviewCount} reviews)
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CompareIcon />}
                            fullWidth
                          >
                            Compare
                          </Button>
                          {quote.status === 'quoted' && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => {
                                setInsuranceUtilitiesData(prev => ({ ...prev, selectedInsurance: quote }));
                                setBindingDialogOpen(true);
                              }}
                            >
                              Bind Policy
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Utility Transfers Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Utility Transfer Management
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {insuranceUtilitiesData.utilityProviders.map((provider) => (
                  <Box key={provider.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ backgroundColor: brandColors.actions.primary }}>
                            {getUtilityTypeIcon(provider.type)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {provider.name}
                            </Typography>
                            <Chip 
                              label={provider.type} 
                              size="small" 
                              color="primary"
                            />
                          </Box>
                          <Chip 
                            label={provider.status} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(provider.status),
                              color: brandColors.backgrounds.primary
                            }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Account: {provider.accountNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Phone: {provider.contact?.phone || provider.phone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Website: {provider.website}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Transfer Fee: ${provider.transferFee}
                          </Typography>
                          {provider.depositRequired && (
                            <Typography variant="body2" color="text.secondary">
                              Deposit Required: ${provider.depositAmount}
                            </Typography>
                          )}
                        </Box>

                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            setUtilityForm(prev => ({
                              ...prev,
                              providerName: provider.name,
                              accountNumber: provider.accountNumber,
                            }));
                            setUtilityDialogOpen(true);
                          }}
                          disabled={provider.status === 'transferred'}
                        >
                          {provider.status === 'transferred' ? 'Transferred' : 'Transfer Service'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Service Providers Tab */}
          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Service Provider Marketplace
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => setServiceDialogOpen(true)}
                >
                  Find Services
                </Button>
              </Box>

              {/* Search and Filter */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <Box>
                    <TextField
                      fullWidth
                      placeholder="Search providers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Box>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Service Type</InputLabel>
                      <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        label="Service Type"
                      >
                        <MenuItem value="all">All Services</MenuItem>
                        <MenuItem value="mover">Moving</MenuItem>
                        <MenuItem value="cleaner">Cleaning</MenuItem>
                        <MenuItem value="locksmith">Locksmith</MenuItem>
                        <MenuItem value="handyman">Handyman</MenuItem>
                        <MenuItem value="landscaper">Landscaping</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                {filteredServiceProviders.map((provider) => (
                  <Box key={provider.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar src={provider.logo} sx={{ width: 60, height: 60 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {provider.name}
                            </Typography>
                            <Chip 
                              label={provider.type} 
                              size="small" 
                              color="primary"
                            />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Rating value={provider.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({provider.reviewCount} reviews)
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <MoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            ${provider.hourlyRate}/hr (min {provider.minimumHours} hrs)
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {provider.availability.join(', ')}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Services:
                          </Typography>
                          {provider.services.slice(0, 3).map((service, index) => (
                            <Chip 
                              key={index} 
                              label={service} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                          {provider.services.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{provider.services.length - 3} more
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} gutterBottom>
                            Credentials:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {provider.insurance && <Chip label="Insured" size="small" color="success" />}
                            {provider.bonded && <Chip label="Bonded" size="small" color="primary" />}
                            {provider.licensed && <Chip label="Licensed" size="small" color="secondary" />}
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<PhoneIcon />}
                            fullWidth
                          >
                            Contact
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ScheduleIcon />}
                            onClick={() => {
                              setSelectedProvider(provider);
                              setServiceDialogOpen(true);
                            }}
                          >
                            Book
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

      {/* Request Insurance Quotes Dialog */}
      <Dialog open={quoteDialogOpen} onClose={() => setQuoteDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Request Insurance Quotes</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Property Address"
                value={insuranceForm.propertyAddress}
                onChange={(e) => setInsuranceForm(prev => ({ ...prev, propertyAddress: e.target.value }))}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={insuranceForm.propertyType}
                  onChange={(e) => setInsuranceForm(prev => ({ ...prev, propertyType: e.target.value }))}
                  label="Property Type"
                >
                  <MenuItem value="single-family">Single Family</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                  <MenuItem value="townhouse">Townhouse</MenuItem>
                  <MenuItem value="multi-family">Multi-Family</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Construction Year"
                value={insuranceForm.constructionYear}
                onChange={(e) => setInsuranceForm(prev => ({ ...prev, constructionYear: e.target.value }))}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Square Footage"
                value={insuranceForm.squareFootage}
                onChange={(e) => setInsuranceForm(prev => ({ ...prev, squareFootage: e.target.value }))}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Coverage Amount"
                value={insuranceForm.coverageAmount}
                onChange={(e) => setInsuranceForm(prev => ({ ...prev, coverageAmount: e.target.value }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>Policy Type</InputLabel>
                <Select
                  value={insuranceForm.policyType}
                  onChange={(e) => setInsuranceForm(prev => ({ ...prev, policyType: e.target.value }))}
                  label="Policy Type"
                >
                  <MenuItem value="homeowners">Homeowners</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                  <MenuItem value="renters">Renters</MenuItem>
                  <MenuItem value="flood">Flood</MenuItem>
                  <MenuItem value="umbrella">Umbrella</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={requestInsuranceQuotes} variant="contained">
            Request Quotes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bind Insurance Policy Dialog */}
      <Dialog open={bindingDialogOpen} onClose={() => setBindingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bind Insurance Policy</DialogTitle>
        <DialogContent>
          {insuranceUtilitiesData.selectedInsurance && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {insuranceUtilitiesData.selectedInsurance.provider}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Annual Premium: ${insuranceUtilitiesData.selectedInsurance.annualPremium.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Deductible: ${insuranceUtilitiesData.selectedInsurance.deductible.toLocaleString()}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                By binding this policy, you agree to the terms and conditions of the insurance provider.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBindingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => insuranceUtilitiesData.selectedInsurance && bindInsurancePolicy(insuranceUtilitiesData.selectedInsurance.id)} 
            variant="contained"
          >
            Bind Policy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Utility Transfer Dialog */}
      <Dialog open={utilityDialogOpen} onClose={() => setUtilityDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transfer Utility Service</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box>
              <TextField
                fullWidth
                label="Provider Name"
                value={utilityForm.providerName}
                onChange={(e) => setUtilityForm(prev => ({ ...prev, providerName: e.target.value }))}
                disabled
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Account Number"
                value={utilityForm.accountNumber}
                onChange={(e) => setUtilityForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                disabled
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Transfer Date"
                type="date"
                value={utilityForm.transferDate}
                onChange={(e) => setUtilityForm(prev => ({ ...prev, transferDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="New Owner Name"
                value={utilityForm.newOwnerName}
                onChange={(e) => setUtilityForm(prev => ({ ...prev, newOwnerName: e.target.value }))}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="New Owner Phone"
                value={utilityForm.newOwnerPhone}
                onChange={(e) => setUtilityForm(prev => ({ ...prev, newOwnerPhone: e.target.value }))}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="New Owner Email"
                type="email"
                value={utilityForm.newOwnerEmail}
                onChange={(e) => setUtilityForm(prev => ({ ...prev, newOwnerEmail: e.target.value }))}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUtilityDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => transferUtility('')} variant="contained">
            Transfer Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Provider Details Dialog */}
      <Dialog open={serviceDialogOpen} onClose={() => setServiceDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProvider ? `${selectedProvider.name} - Service Details` : 'Find Services'}
        </DialogTitle>
        <DialogContent>
          {selectedProvider ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedProvider.logo} sx={{ width: 80, height: 80 }} />
                <Box>
                  <Typography variant="h6">{selectedProvider.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedProvider.type}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={selectedProvider.rating} readOnly />
                    <Typography variant="body2">({selectedProvider.reviewCount} reviews)</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Typography variant="body2">
                  <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
                  {selectedProvider.contact.phone}
                </Typography>
                <Typography variant="body2">
                  <EmailIcon sx={{ fontSize: 16, mr: 1 }} />
                  {selectedProvider.contact.email}
                </Typography>
                <Typography variant="body2">
                  <LocationIcon sx={{ fontSize: 16, mr: 1 }} />
                  {selectedProvider.contact.address}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Services & Specialties</Typography>
                <Box sx={{ mb: 1 }}>
                  {selectedProvider.services.map((service, index) => (
                    <Chip key={index} label={service} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
                <Box>
                  {selectedProvider.specialties.map((specialty, index) => (
                    <Chip key={index} label={specialty} size="small" color="primary" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Pricing & Availability</Typography>
                <Typography variant="body2">
                  Hourly Rate: ${selectedProvider.hourlyRate}/hr
                </Typography>
                <Typography variant="body2">
                  Minimum Hours: {selectedProvider.minimumHours} hrs
                </Typography>
                <Typography variant="body2">
                  Availability: {selectedProvider.availability.join(', ')}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">
              Select a service provider to view detailed information and book services.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialogOpen(false)}>Close</Button>
          {selectedProvider && (
            <Button variant="contained" startIcon={<PhoneIcon />}>
              Contact Provider
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InsuranceUtilities;
