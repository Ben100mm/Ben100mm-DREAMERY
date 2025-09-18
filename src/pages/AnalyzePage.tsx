import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem as MenuItemComponent,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  Button,
  Divider as DividerComponent,
  LinearProgress,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Tabs,
  Tab,
  IconButton as IconButtonComponent,
  Chip,
  Slider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  ModelTraining as ModelTrainingIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Undo as UndoIcon,
  RestartAlt as RestartAltIcon,
  HelpOutline,
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { AnalysisProvider, useAnalysis } from '../context/AnalysisContext';
import { brandColors } from '../theme';
import { useNavigate } from 'react-router-dom';
import { calculateRiskScore, defaultMarketConditions } from '../utils/advancedCalculations';
import AdvancedModelingTab from './AdvancedModelingTab';
import { GuidedTour } from '../components/GuidedTour';

const drawerWidth = 280;

const AnalyzePage: React.FC = () => {
  const { dealState } = useAnalysis();
  const [activeSection, setActiveSection] = useState<string>('station');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();



  // Pro Forma Analysis State
  const [activeProFormaTab, setActiveProFormaTab] = useState('presets');
  const [proFormaPreset, setProFormaPreset] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [customProFormaPresets, setCustomProFormaPresets] = useState<Array<{
    id: string;
    name: string;
    description?: string;
    maintenance: number;
    vacancy: number;
    management: number;
    capEx: number;
    opEx: number;
  }>>([]);
  const [selectedCustomPreset, setSelectedCustomPreset] = useState<string | null>(null);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState({
    sensitivityRange: 90,
    sensitivitySteps: 14,
  });

  // Advanced Modeling – local tab selection
  const [advancedModelingTab, setAdvancedModelingTab] = useState<
    'overview' | 'global' | 'seasonal' | 'exit' | 'tax' | 'refi' | 'risk' | 'sensitivity' | 'scenarios'
  >('overview');

  // Live Market Data State
  const [marketDataLastUpdated, setMarketDataLastUpdated] = useState<string>('8/25/2025, 5:20:24 AM');
  const [isUpdatingMarketData, setIsUpdatingMarketData] = useState<boolean>(false);

  // Guided Tour State
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState<boolean>(false);

  // Guided Tour Handler
  const handleGuidedTour = () => {
    setIsGuidedTourOpen(true);
  };

  // Market Data Update Function
  const updateMarketData = useCallback(() => {
    setIsUpdatingMarketData(true);
    // Simulate API call to fetch live market data
    setTimeout(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setMarketDataLastUpdated(`${formattedDate}, ${formattedTime}`);
      setIsUpdatingMarketData(false);
    }, 1000);
  }, []);

  // Auto-update market data every 5 minutes
  useEffect(() => {
    const interval = setInterval(updateMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updateMarketData]);
  const [revenueInputs, setRevenueInputs] = useState({
    totalRooms: 33,
    averageDailyRate: 150,
    occupancyRate: 75,
    fixedAnnualCosts: 120000,
    fixedMonthlyCosts: 10000,
    seasonalVariations: {
      q1: 0.8,
      q2: 1.0,
      q3: 1.3,
      q4: 0.9,
    },
  });

  // Mock operations data for Pro Forma
  const [ops, setOps] = useState({
    maintenance: 6,
    vacancy: 4,
    management: 9,
    capEx: 4,
    opEx: 3,
  });

  // Risk Assessment State
  const [riskFactors, setRiskFactors] = useState({
    marketVolatility: 5,
    tenantQuality: 7,
    propertyCondition: 6,
    locationStability: 8,
    financingRisk: 4,
  });
  const [marketConditions, setMarketConditions] = useState(defaultMarketConditions.stable);
  const [propertyAge, setPropertyAge] = useState({ age: 15, maintenanceCostMultiplier: 1.2, utilityEfficiencyMultiplier: 1.0, insuranceCostMultiplier: 1.0, expectedLifespan: 50 });
  const [riskScoreResults, setRiskScoreResults] = useState<ReturnType<typeof calculateRiskScore> | undefined>(undefined);

  // Pro Forma Analysis Helper Functions
  const applyProFormaPreset = (preset: 'conservative' | 'moderate' | 'aggressive') => {
    const presets = {
      conservative: { maintenance: 8, vacancy: 6, management: 12, capEx: 6, opEx: 4 },
      moderate: { maintenance: 6, vacancy: 4, management: 9, capEx: 4, opEx: 3 },
      aggressive: { maintenance: 4, vacancy: 2, management: 6, capEx: 2, opEx: 2 },
    };
    setOps(presets[preset]);
    setProFormaPreset(preset);
  };

  const saveCustomPreset = (name: string, description?: string) => {
    const newPreset = {
      id: Date.now().toString(),
      name,
      description,
      ...ops,
    };
    setCustomProFormaPresets(prev => [...prev, newPreset]);
  };

  const deleteCustomPreset = (id: string) => {
    setCustomProFormaPresets(prev => prev.filter(p => p.id !== id));
    if (selectedCustomPreset === id) {
      setSelectedCustomPreset(null);
    }
  };

  const applyCustomPreset = (id: string) => {
    const preset = customProFormaPresets.find(p => p.id === id);
    if (preset) {
      setOps({
        maintenance: preset.maintenance,
        vacancy: preset.vacancy,
        management: preset.management,
        capEx: preset.capEx,
        opEx: preset.opEx,
      });
      setSelectedCustomPreset(id);
    }
  };

  const updateOps = (key: keyof typeof ops, value: number) => {
    setOps(prev => ({ ...prev, [key]: value }));
  };

  const calculateSensitivityAnalysis = () => {
    const baseMonthlyCF = 2500; // Mock value
    const results = [];
    
    for (let i = 0; i < sensitivityAnalysis.sensitivitySteps; i++) {
      const multiplier = ((i / (sensitivityAnalysis.sensitivitySteps - 1)) * 2 - 1) * (sensitivityAnalysis.sensitivityRange / 100);
      const scenario = 1 + multiplier;
      const maintenance = ops.maintenance * scenario;
      const vacancy = ops.vacancy * scenario;
      const management = ops.management * scenario;
      const capEx = ops.capEx * scenario;
      const opEx = ops.opEx * scenario;
      
      results.push({
        multiplier: `${(scenario * 100).toFixed(0)}%`,
        maintenance: maintenance.toFixed(1),
        vacancy: vacancy.toFixed(1),
        management: management.toFixed(1),
        capEx: capEx.toFixed(1),
        opEx: opEx.toFixed(1),
        monthlyCashFlow: baseMonthlyCF * (1 - multiplier * 0.1),
        annualCashFlow: baseMonthlyCF * 12 * (1 - multiplier * 0.1),
        cashOnCash: `${((baseMonthlyCF * 12 * (1 - multiplier * 0.1)) / 100000 * 100).toFixed(1)}%`,
      });
    }
    
    return results;
  };

  const compareToBenchmarks = () => {
    const benchmarks = {
      maintenance: { current: ops.maintenance, benchmark: 6, variance: ops.maintenance - 6, variancePct: ((ops.maintenance - 6) / 6 * 100).toFixed(1) },
      vacancy: { current: ops.vacancy, benchmark: 4, variance: ops.vacancy - 4, variancePct: ((ops.vacancy - 4) / 4 * 100).toFixed(1) },
      management: { current: ops.management, benchmark: 9, variance: ops.management - 9, variancePct: ((ops.management - 9) / 9 * 100).toFixed(1) },
      capEx: { current: ops.capEx, benchmark: 4, variance: ops.capEx - 4, variancePct: ((ops.capEx - 4) / 4 * 100).toFixed(1) },
      opEx: { current: ops.opEx, benchmark: 3, variance: ops.opEx - 3, variancePct: ((ops.opEx - 3) / 3 * 100).toFixed(1) },
    };
    return benchmarks;
  };

  const shouldShowAdrTabs = () => {
    // Mock function - in real implementation this would check property type and operation type
    return true;
  };

  const getAdrTabsVisibilityReason = () => {
    return "ADR tabs are only available for Short Term Rental, Hotel properties, or Rental Arbitrage on Single Family/Multi Family properties.";
  };

  const calculateBreakEvenOccupancy = () => {
    // Mock calculation
    return 65.5;
  };

  const calculateBreakEvenADR = () => {
    // Mock calculation
    return 125;
  };

  const calculateMarginOfSafety = () => {
    // Mock calculation
    return 14.5;
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationsMenuAnchor(null);
    setUserMenuAnchor(null);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'pro-forma', label: 'Pro Forma Analysis', icon: <AccountBalanceIcon /> },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: <SecurityIcon /> },
    { id: 'advanced-modeling', label: 'Advanced Modeling', icon: <ModelTrainingIcon /> },
  ];

  // Lightweight Deal/Loan state for Dashboard (At a Glance)
  const [propertyType, setPropertyType] = useState<'Single Family' | 'Multi Family' | 'Hotel' | 'Land' | 'Office' | 'Retail'>('Single Family');
  const [operationType, setOperationType] = useState<'Buy & Hold' | 'Fix & Flip' | 'Short Term Rental' | 'Rental Arbitrage' | 'BRRRR'>('Buy & Hold');
  const [offerType, setOfferType] = useState<'Cash' | 'FHA' | 'Seller Finance' | 'Conventional' | 'SBA' | 'DSCR' | 'Hard Money'>('Conventional');
  const [listedPrice, setListedPrice] = useState<number>(350000);
  const [purchasePrice, setPurchasePrice] = useState<number>(325000);
  const [squareFootage, setSquareFootage] = useState<number>(1800);
  const [units, setUnits] = useState<number>(1);
  const [arv, setArv] = useState<number | undefined>(undefined);

  const [loan, setLoan] = useState({
    downPayment: 65000,
    closingCosts: 8000,
    rehabCosts: 15000,
    monthlyPayment: 1800,
    annualInterestRate: 6.5,
  });

  // Dashboard State for Editing
  const [dashboardForm, setDashboardForm] = useState({
    propertyAddress: '',
    agentOwner: '',
    propertyType: propertyType || 'Single Family',
    operationType: operationType || 'Buy & Hold',
    financeType: offerType || 'Conventional',
    listedPrice: listedPrice || 0,
    purchasePrice: purchasePrice || 0,
    downPayment: (loan.downPayment || 0),
    closingCosts: (loan.closingCosts || 0),
    rehabCosts: (loan.rehabCosts || 0),
    interestRate: (loan.annualInterestRate || 0),
    monthlyPayment: (loan.monthlyPayment || 0),
    maintenance: (ops.maintenance || 0),
    vacancy: (ops.vacancy || 0),
    management: (ops.management || 0),
    capEx: (ops.capEx || 0),
    opEx: (ops.opEx || 0),
    squareFootage: squareFootage || 0,
    units: units || 1,
    monthlyIncome: 0
  });

  const [dashboardErrors, setDashboardErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save function
  const autoSave = useCallback(async (updates: Partial<typeof dashboardForm>) => {
    setIsSaving(true);
    try {
      // Simulate auto-save delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setDashboardForm(prev => ({ ...prev, ...updates }));
      
      // Clear any previous errors for this field
      const fieldName = Object.keys(updates)[0];
      if (dashboardErrors[fieldName]) {
        setDashboardErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
      
      // Here you would typically save to backend/database
      console.log('Auto-saved:', updates);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [dashboardErrors]);

  // Validation function
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'purchasePrice':
      case 'listedPrice':
      case 'downPayment':
      case 'closingCosts':
      case 'rehabCosts':
      case 'monthlyPayment':
      case 'squareFootage':
        return value < 0 ? 'Value cannot be negative' : '';
      case 'interestRate':
        return value < 0 || value > 100 ? 'Interest rate must be between 0-100%' : '';
      case 'maintenance':
      case 'vacancy':
      case 'management':
      case 'capEx':
      case 'opEx':
        return value < 0 || value > 100 ? 'Percentage must be between 0-100%' : '';
      case 'units':
        return value < 1 ? 'Must have at least 1 unit' : '';
      case 'monthlyIncome':
        return value < 0 ? 'Monthly income cannot be negative' : '';
      default:
        return '';
    }
  };

  // Handle field changes with validation
  const handleDashboardChange = (field: string, value: any) => {
    const error = validateField(field, value);
    setDashboardErrors(prev => ({ ...prev, [field]: error }));
    
    if (!error) {
      autoSave({ [field]: value });
    }
  };

  // Helpers for Dashboard
  const currency = (n: number) => `$${Number.isFinite(n) ? Math.round(n).toLocaleString() : '0'}`;
  const computeLoanAmountSimple = () => Math.max(0, purchasePrice - (loan.downPayment || 0));
  const computeMonthlyIncome = (): number => {
    // If STR/Hotel, use ADR-based monthly revenue; else estimate from rooms or placeholder
    if (operationType === 'Short Term Rental' || propertyType === 'Hotel') {
      const rooms = revenueInputs.totalRooms || 1;
      const adr = revenueInputs.averageDailyRate || 0;
      const occ = (revenueInputs.occupancyRate || 0) / 100;
      return Math.max(0, rooms * adr * occ * 30);
    }
    // Otherwise, basic placeholder monthly income (can be wired to rent inputs later)
    return 2500; // conservative default
  };
  const variableMonthlyFromPercentages = (income: number) =>
    income * ((ops.vacancy + ops.management + ops.capEx + ops.opEx) / 100);

  const computeFixedMonthlyOps = (ops: any) => {
    return (ops.maintenance + ops.vacancy + ops.management + ops.capEx + ops.opEx) * 1000;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Save Status Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {isSaving ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Saving...
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2" color="success.main">
                    All changes saved
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Property & Deal Info */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Property & Deal Info
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Property Address"
                  value={dashboardForm.propertyAddress}
                  onChange={(e) => handleDashboardChange('propertyAddress', e.target.value)}
                  error={!!dashboardErrors.propertyAddress}
                  helperText={dashboardErrors.propertyAddress}
                />
                <TextField
                  fullWidth
                  label="Agent/Owner"
                  value={dashboardForm.agentOwner}
                  onChange={(e) => handleDashboardChange('agentOwner', e.target.value)}
                  error={!!dashboardErrors.agentOwner}
                  helperText={dashboardErrors.agentOwner}
                />
                <TextField
                  fullWidth
                  label="Analysis Date"
                  value={new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  label="Property Type"
                  value={dashboardForm.propertyType}
                  onChange={(e) => handleDashboardChange('propertyType', e.target.value)}
                  error={!!dashboardErrors.propertyType}
                  helperText={dashboardErrors.propertyType}
                />
                <TextField
                  fullWidth
                  label="Operation Type"
                  value={dashboardForm.operationType}
                  onChange={(e) => handleDashboardChange('operationType', e.target.value)}
                  error={!!dashboardErrors.operationType}
                  helperText={dashboardErrors.operationType}
                />
                <TextField
                  fullWidth
                  label="Finance Type"
                  value={dashboardForm.financeType}
                  onChange={(e) => handleDashboardChange('financeType', e.target.value)}
                  error={!!dashboardErrors.financeType}
                  helperText={dashboardErrors.financeType}
                />
              </Box>
            </Box>

            {/* Property Details */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Property Details
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Square Footage"
                  value={dashboardForm.squareFootage}
                  onChange={(e) => handleDashboardChange('squareFootage', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.squareFootage}
                  helperText={dashboardErrors.squareFootage || 'Enter total square footage'}
                />
                <TextField
                  fullWidth
                  label="Number of Units"
                  value={dashboardForm.units}
                  onChange={(e) => handleDashboardChange('units', parseInt(e.target.value) || 1)}
                  type="number"
                  error={!!dashboardErrors.units}
                  helperText={dashboardErrors.units || 'Enter number of units'}
                />
                <TextField
                  fullWidth
                  label="Price per SF"
                  value={dashboardForm.squareFootage > 0 ? (dashboardForm.purchasePrice / dashboardForm.squareFootage).toFixed(2) : 'N/A'}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated automatically"
                />
                <TextField
                  fullWidth
                  label="Price per Unit"
                  value={dashboardForm.units > 0 ? (dashboardForm.purchasePrice / dashboardForm.units).toFixed(0) : 'N/A'}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated automatically"
                />
              </Box>
            </Box>

            {/* Key Financial Metrics */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Key Financial Metrics
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Total Acquisition Cost"
                  value={formatCurrency(
                    purchasePrice +
                      (loan.closingCosts || 0) +
                      (loan.rehabCosts || 0),
                  )}
                  InputProps={{ readOnly: true }}
                  helperText="Purchase + Closing + Immediate CapEx"
                />
                <TextField
                  fullWidth
                  label="Total Project Cost"
                  value={formatCurrency(
                    purchasePrice +
                      (loan.closingCosts || 0) +
                      (loan.rehabCosts || 0) +
                      (loan.rehabCosts || 0),
                  )}
                  InputProps={{ readOnly: true }}
                  helperText="Acquisition + Rehab"
                />
                <TextField
                  fullWidth
                  label="Price per Unit"
                  value="N/A"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  label="Price per SF"
                  value={squareFootage > 0 ? formatCurrency(purchasePrice / squareFootage) : 'N/A'}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  label="ARV (if value-add/flip)"
                  value="N/A"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  label="Equity at Purchase"
                  value="N/A"
                  InputProps={{ readOnly: true }}
                  helperText="ARV - Total Project Cost"
                />
                <TextField
                  fullWidth
                  label="LTV"
                  value={purchasePrice > 0 ? ((computeLoanAmountSimple() / purchasePrice) * 100).toFixed(1) + '%' : 'N/A'}
                  InputProps={{ readOnly: true }}
                  helperText="Loan Amount ÷ Purchase Price"
                />
                <TextField
                  fullWidth
                  label="LTC"
                  value={(() => {
                    const totalProjectCost = purchasePrice + (loan.closingCosts || 0) + (loan.rehabCosts || 0) + (loan.rehabCosts || 0);
                    return totalProjectCost > 0 ? ((computeLoanAmountSimple() / totalProjectCost) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Loan Amount ÷ Total Project Cost"
                />
                <TextField
                  fullWidth
                  label="Debt Yield"
                  value={(() => {
                    const annualNOI = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - variableMonthlyFromPercentages(computeMonthlyIncome())) * 12;
                    const loanAmount = computeLoanAmountSimple();
                    return loanAmount > 0 ? ((annualNOI / loanAmount) * 100).toFixed(2) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="NOI ÷ Loan Amount"
                />
                <TextField
                  fullWidth
                  label="DSCR (Y1)"
                  value={(() => {
                    const annualNOI = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - variableMonthlyFromPercentages(computeMonthlyIncome())) * 12;
                    const annualDebtService = (loan.monthlyPayment || 0) * 12;
                    return annualDebtService > 0 ? (annualNOI / annualDebtService).toFixed(2) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="NOI ÷ Annual Debt Service"
                />
                <TextField
                  fullWidth
                  label="DSCR (Stabilized)"
                  value={(() => {
                    const stabilizedAnnualNOI = (computeMonthlyIncome() * 1.05 - computeFixedMonthlyOps(ops as any) * 1.03 - variableMonthlyFromPercentages(computeMonthlyIncome() * 1.05)) * 12;
                    const annualDebtService = (loan.monthlyPayment || 0) * 12;
                    return annualDebtService > 0 ? (stabilizedAnnualNOI / annualDebtService).toFixed(2) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Stabilized NOI ÷ Annual Debt Service"
                />
                <TextField
                  fullWidth
                  label="Expense Ratio"
                  value={(() => {
                    const grossIncome = computeMonthlyIncome() * 12;
                    const operatingExpenses = (computeFixedMonthlyOps(ops as any) + variableMonthlyFromPercentages(computeMonthlyIncome())) * 12;
                    return grossIncome > 0 ? ((operatingExpenses / grossIncome) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Operating Expenses ÷ EGI"
                />
                <TextField
                  fullWidth
                  label="NOI Margin"
                  value={(() => {
                    const grossIncome = computeMonthlyIncome() * 12;
                    const annualNOI = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - variableMonthlyFromPercentages(computeMonthlyIncome())) * 12;
                    return grossIncome > 0 ? ((annualNOI / grossIncome) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="NOI ÷ EGI"
                />
                <TextField
                  fullWidth
                  label="GRM"
                  value={(() => {
                    const grossAnnualIncome = computeMonthlyIncome() * 12;
                    return grossAnnualIncome > 0 ? (purchasePrice / grossAnnualIncome).toFixed(2) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Purchase Price ÷ Gross Annual Income"
                />
                <TextField
                  fullWidth
                  label="Break-even Occupancy (No Debt)"
                  value={(() => {
                    try {
                      const monthlyRevenue = computeMonthlyIncome();
                      if (monthlyRevenue > 0) {
                        const expenses = computeFixedMonthlyOps(ops as any) + variableMonthlyFromPercentages(monthlyRevenue);
                        return ((expenses / monthlyRevenue) * 100).toFixed(1) + '%';
                      } else {
                        return '0.0%';
                      }
                    } catch (error) {
                      return '0.0%';
                    }
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Expenses ÷ GPR"
                />
                <TextField
                  fullWidth
                  label="Break-even Occupancy (With Debt)"
                  value={(() => {
                    try {
                      const monthlyRevenue = computeMonthlyIncome();
                      if (monthlyRevenue > 0) {
                        const expenses = computeFixedMonthlyOps(ops as any) + variableMonthlyFromPercentages(monthlyRevenue);
                        const debtService = loan.monthlyPayment || 0;
                        return (((expenses + debtService) / monthlyRevenue) * 100).toFixed(1) + '%';
                      } else {
                        return '0.0%';
                      }
                    } catch (error) {
                      return '0.0%';
                    }
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="(Expenses + Debt Service) ÷ GPR"
                />
                <TextField
                  fullWidth
                  label="Payback Period (Years)"
                  value={(() => {
                    const totalCashInvested = (loan.downPayment || 0) + (loan.closingCosts || 0) + (loan.rehabCosts || 0);
                    const annualCashFlow = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0)) * 12;
                    return annualCashFlow > 0 ? (totalCashInvested / annualCashFlow).toFixed(1) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Total Cash Invested ÷ Annual Cash Flow"
                />
                <TextField
                  fullWidth
                  label="Equity Multiple (MOIC)"
                  value={(() => {
                    const totalCashInvested = (loan.downPayment || 0) + (loan.closingCosts || 0) + (loan.rehabCosts || 0);
                    const annualCashFlow = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0)) * 12;
                    const totalDistributions = annualCashFlow * 5;
                    return totalCashInvested > 0 ? (totalDistributions / totalCashInvested).toFixed(2) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Total Distributions ÷ Total Cash Invested"
                />
                <TextField
                  fullWidth
                  label="IRR (Levered)"
                  value={(() => {
                    const totalCashInvested = (loan.downPayment || 0) + (loan.closingCosts || 0) + (loan.rehabCosts || 0);
                    const annualCashFlow = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0)) * 12;
                    const futureValue = purchasePrice * Math.pow(1.03, 5);
                    const totalReturn = annualCashFlow * 5 + futureValue - totalCashInvested;
                    const irr = totalCashInvested > 0 ? Math.pow((totalReturn + totalCashInvested) / totalCashInvested, 1 / 5) - 1 : 0;
                    return (irr * 100).toFixed(1) + '%';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Internal Rate of Return (Levered)"
                />
                <TextField
                  fullWidth
                  label="IRR (Unlevered)"
                  value={(() => {
                    const totalCashInvested = purchasePrice + (loan.closingCosts || 0) + (loan.rehabCosts || 0);
                    const annualCashFlow = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any)) * 12;
                    const futureValue = purchasePrice * Math.pow(1.03, 5);
                    const totalReturn = annualCashFlow * 5 + futureValue - totalCashInvested;
                    const irr = totalCashInvested > 0 ? Math.pow((totalReturn + totalCashInvested) / totalCashInvested, 1 / 5) - 1 : 0;
                    return (irr * 100).toFixed(1) + '%';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Internal Rate of Return (Unlevered)"
                />
                <TextField
                  fullWidth
                  label="Return on Equity (Current)"
                  value={(() => {
                    const equity = purchasePrice - computeLoanAmountSimple();
                    const annualCashFlow = (computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0)) * 12;
                    return equity > 0 ? ((annualCashFlow / equity) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Annual Cash Flow ÷ Current Equity"
                />
                <TextField
                  fullWidth
                  label="Return on Equity (Stabilized)"
                  value={(() => {
                    const equity = purchasePrice - computeLoanAmountSimple();
                    const stabilizedAnnualCashFlow = (computeMonthlyIncome() * 1.05 - computeFixedMonthlyOps(ops as any) * 1.03 - (loan.monthlyPayment || 0)) * 12;
                    return equity > 0 ? ((stabilizedAnnualCashFlow / equity) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Stabilized Annual Cash Flow ÷ Current Equity"
                />
                <TextField
                  fullWidth
                  label="Cash Reserve Months on Hand"
                  value={(() => {
                    const monthlyCashFlow = computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0);
                    const cashReserve = monthlyCashFlow * 6;
                    return monthlyCashFlow > 0 ? (cashReserve / monthlyCashFlow).toFixed(1) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Cash Reserve ÷ Monthly Cash Flow"
                />
              </Box>
            </Box>

            {/* Financial Terms */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Financial Terms
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Listed Price"
                  value={dashboardForm.listedPrice}
                  onChange={(e) => handleDashboardChange('listedPrice', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.listedPrice}
                  helperText={dashboardErrors.listedPrice || 'Enter the listed price'}
                />
                <TextField
                  fullWidth
                  label="Purchase Price"
                  value={dashboardForm.purchasePrice}
                  onChange={(e) => handleDashboardChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.purchasePrice}
                  helperText={dashboardErrors.purchasePrice || 'Enter the purchase price'}
                />
                <TextField
                  fullWidth
                  label="Down Payment"
                  value={dashboardForm.downPayment}
                  onChange={(e) => handleDashboardChange('downPayment', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.downPayment}
                  helperText={dashboardErrors.downPayment || 'Enter the down payment amount'}
                />
                <TextField
                  fullWidth
                  label="Loan Amount"
                  value={dashboardForm.purchasePrice - dashboardForm.downPayment}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated automatically"
                />
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  value={dashboardForm.interestRate}
                  onChange={(e) => handleDashboardChange('interestRate', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.interestRate}
                  helperText={dashboardErrors.interestRate || 'Enter annual interest rate'}
                />
                <TextField
                  fullWidth
                  label="Total Monthly Debt Service"
                  value={dashboardForm.monthlyPayment}
                  onChange={(e) => handleDashboardChange('monthlyPayment', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.monthlyPayment}
                  helperText={dashboardErrors.monthlyPayment || 'Enter monthly payment amount'}
                />
              </Box>
            </Box>

            {/* Income & Performance */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Income & Performance
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Monthly Income"
                  value={dashboardForm.monthlyIncome}
                  onChange={(e) => handleDashboardChange('monthlyIncome', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.monthlyIncome}
                  helperText={dashboardErrors.monthlyIncome || 'Enter monthly income amount'}
                />
                <TextField
                  fullWidth
                  label="Monthly Operating Expenses"
                  value={dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated from percentages below"
                />
                <TextField
                  fullWidth
                  label="Monthly Cash Flow"
                  value={dashboardForm.monthlyIncome - (dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx) - dashboardForm.monthlyPayment}
                  InputProps={{ readOnly: true }}
                  helperText="Monthly Income - Operating Expenses - Debt Service"
                />
                <TextField
                  fullWidth
                  label="Annual Cash Flow"
                  value={(dashboardForm.monthlyIncome - (dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx) - dashboardForm.monthlyPayment) * 12}
                  InputProps={{ readOnly: true }}
                  helperText="Monthly Cash Flow × 12"
                />
                <TextField
                  fullWidth
                  label="Cash on Cash Return"
                  value={(() => {
                    const annualCashFlow = (dashboardForm.monthlyIncome - (dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx) - dashboardForm.monthlyPayment) * 12;
                    const totalCashInvested = dashboardForm.downPayment + dashboardForm.closingCosts + dashboardForm.rehabCosts;
                    return totalCashInvested > 0 ? ((annualCashFlow / totalCashInvested) * 100).toFixed(1) + '%' : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Annual Cash Flow ÷ Total Cash Invested"
                />
                <TextField
                  fullWidth
                  label="Break Even Occupancy"
                  value={(() => {
                    try {
                      const monthlyRevenue = dashboardForm.monthlyIncome;
                      if (monthlyRevenue > 0) {
                        const expenses = dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx;
                        return ((expenses / monthlyRevenue) * 100).toFixed(1) + '%';
                      } else {
                        return '0.0%';
                      }
                    } catch (error) {
                      return '0.0%';
                    }
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="Operating Expenses ÷ Monthly Revenue"
                />
              </Box>
            </Box>

            {/* Operating Expenses */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Operating Expenses (% of Monthly Income)
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Maintenance (%)"
                  value={dashboardForm.maintenance}
                  onChange={(e) => handleDashboardChange('maintenance', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.maintenance}
                  helperText={dashboardErrors.maintenance || 'Enter maintenance percentage'}
                />
                <TextField
                  fullWidth
                  label="Vacancy (%)"
                  value={dashboardForm.vacancy}
                  onChange={(e) => handleDashboardChange('vacancy', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.vacancy}
                  helperText={dashboardErrors.vacancy || 'Enter vacancy percentage'}
                />
                <TextField
                  fullWidth
                  label="Management (%)"
                  value={dashboardForm.management}
                  onChange={(e) => handleDashboardChange('management', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.management}
                  helperText={dashboardErrors.management || 'Enter management percentage'}
                />
                <TextField
                  fullWidth
                  label="CapEx (%)"
                  value={dashboardForm.capEx}
                  onChange={(e) => handleDashboardChange('capEx', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.capEx}
                  helperText={dashboardErrors.capEx || 'Enter CapEx percentage'}
                />
                <TextField
                  fullWidth
                  label="Other Operating Expenses (%)"
                  value={dashboardForm.opEx}
                  onChange={(e) => handleDashboardChange('opEx', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.opEx}
                  helperText={dashboardErrors.opEx || 'Enter other expenses percentage'}
                />
                <TextField
                  fullWidth
                  label="Total Operating Expenses (%)"
                  value={dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx}
                  InputProps={{ readOnly: true }}
                  helperText="Sum of all operating expense percentages"
                />
              </Box>
            </Box>

            {/* Costs & Expenses */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Costs & Expenses
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="Total Project Cost"
                  value={dashboardForm.purchasePrice + dashboardForm.closingCosts + dashboardForm.rehabCosts}
                  InputProps={{ readOnly: true }}
                  helperText="Purchase Price + Closing Costs + Rehab Costs"
                />
                <TextField
                  fullWidth
                  label="Closing Costs"
                  value={dashboardForm.closingCosts}
                  onChange={(e) => handleDashboardChange('closingCosts', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.closingCosts}
                  helperText={dashboardErrors.closingCosts || 'Enter closing costs'}
                />
                <TextField
                  fullWidth
                  label="Rehab Costs"
                  value={dashboardForm.rehabCosts}
                  onChange={(e) => handleDashboardChange('rehabCosts', parseFloat(e.target.value) || 0)}
                  type="number"
                  error={!!dashboardErrors.rehabCosts}
                  helperText={dashboardErrors.rehabCosts || 'Enter rehab costs'}
                />
                <TextField
                  fullWidth
                  label="Variable Monthly Expenses"
                  value={dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx}
                  InputProps={{ readOnly: true }}
                  helperText="Calculated from percentages above"
                />
                <TextField
                  fullWidth
                  label="Total Monthly Expenses"
                  value={dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx}
                  InputProps={{ readOnly: true }}
                  helperText="Sum of all operating expenses"
                />
                <TextField
                  fullWidth
                  label="Total Annual Expenses"
                  value={(dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx) * 12}
                  InputProps={{ readOnly: true }}
                  helperText="Monthly Expenses × 12"
                />
              </Box>
            </Box>

            {/* Sensitivities */}
            <Box
              sx={{
                p: 2,
                bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 2,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: brandColors.primary,
                  fontSize: '0.9rem',
                }}
              >
                Sensitivities
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
              >
                <TextField
                  fullWidth
                  label="DSCR at -10% Rent"
                  value={(() => {
                    const reducedIncome = dashboardForm.monthlyIncome * 0.9;
                    const annualNOI = (reducedIncome - (dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx)) * 12;
                    const annualDebtService = dashboardForm.monthlyPayment * 12;
                    return annualDebtService > 0 ? (annualNOI / annualDebtService).toFixed(2) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="DSCR with 10% rent reduction"
                />
                <TextField
                  fullWidth
                  label="DSCR at +10% Expenses"
                  value={(() => {
                    const increasedExpenses = (dashboardForm.maintenance + dashboardForm.vacancy + dashboardForm.management + dashboardForm.capEx + dashboardForm.opEx) * 1.1;
                    const annualNOI = (dashboardForm.monthlyIncome - increasedExpenses) * 12;
                    const annualDebtService = dashboardForm.monthlyPayment * 12;
                    return annualDebtService > 0 ? (annualNOI / annualDebtService).toFixed(2) : 'N/A';
                  })()}
                  InputProps={{ readOnly: true }}
                  helperText="DSCR with 10% expense increase"
                />
              </Box>
            </Box>
          </Box>
        );
      case 'pro-forma':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Section Description */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f0f4ff",
                borderRadius: 1,
                border: "1px solid",
                borderColor: brandColors.primary,
                fontSize: "0.875rem",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: brandColors.primary, fontWeight: 500 }}
              >
                <strong>
                  Financial Projections & Cash Flow Analysis:
                </strong>{" "}
                Create detailed pro forma statements, analyze cash flow
                scenarios, perform sensitivity analysis, and compare
                against industry benchmarks.
              </Typography>
            </Box>

            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeProFormaTab}
                onChange={(_, newValue) => {
                  setActiveProFormaTab(newValue);
                  // If switching to presets tab, apply moderate preset
                  if (newValue === "presets") {
                    applyProFormaPreset("moderate");
                  }
                }}
                sx={{
                  minHeight: "auto",
                  "& .MuiTab-root": {
                    minWidth: "auto",
                    px: 2,
                    py: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    color: brandColors.neutral[800] || "#333",
                    "&.Mui-selected": {
                      color: brandColors.primary,
                      fontWeight: 700,
                      backgroundColor: "#f0f4ff",
                      borderRadius: "4px 4px 0 0",
                    },
                    "&:hover": {
                      backgroundColor: brandColors.backgrounds?.secondary || brandColors.neutral[100],
                      color: brandColors.primary,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: brandColors.primary,
                    height: 3,
                  },
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Presets" value="presets" />
                <Tab label="Custom" value="custom" />
                <Tab label="Sensitivity" value="sensitivity" />
                <Tab label="Benchmarks" value="benchmarks" />
                {shouldShowAdrTabs() && (
                  <>
                    <Tab
                      label="Revenue"
                      value="revenue"
                      onClick={() => {
                        setActiveProFormaTab("revenue");
                      }}
                    />
                    <Tab
                      label="Break-Even"
                      value="breakEven"
                      onClick={() => {
                        setActiveProFormaTab("breakEven");
                      }}
                    />
                  </>
                )}
              </Tabs>

              {/* Guidance message when ADR tabs are not visible */}
              {!shouldShowAdrTabs() && getAdrTabsVisibilityReason() && (
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    backgroundColor: brandColors.backgrounds?.secondary || brandColors.neutral[100],
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: brandColors.borders?.secondary || "#ddd",
                    fontSize: "0.875rem",
                    color: brandColors.neutral[800] || "#333",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic" }}
                  >
                    {getAdrTabsVisibilityReason()}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Presets Tab */}
            {activeProFormaTab === "presets" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Pro Forma:
                  </Typography>

                  {["conservative", "moderate", "aggressive"].map(
                    (preset) => (
                      <Button
                        key={preset}
                        size="small"
                        variant={
                          proFormaPreset === preset
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          applyProFormaPreset(
                            preset as
                              | "conservative"
                              | "moderate"
                              | "aggressive",
                          )
                        }
                        sx={{
                          minWidth: "auto",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.75rem",
                        }}
                      >
                        {preset === "moderate" ? "Moderate" : preset}
                      </Button>
                    ),
                  )}
                </Box>

                {/* Current Values Display */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: "0.8rem",
                    color: brandColors.neutral[800] || "#333",
                  }}
                >
                  <Typography>
                    <strong>M:</strong> {ops.maintenance}% |
                    <strong> V:</strong> {ops.vacancy}% |
                    <strong> Mgmt:</strong> {ops.management}% |
                    <strong> CapEx:</strong> {ops.capEx}% |
                    <strong> OpEx:</strong> {ops.opEx}%
                  </Typography>
                </Box>

                {/* Property Type & Operation Type Info */}
                <Box
                  sx={{
                    fontSize: "0.75rem",
                    color: "#888",
                    fontStyle: "italic",
                  }}
                >
                  Based on Single Family + Buy & Hold |
                  {proFormaPreset === "conservative"
                    ? " Conservative"
                    : proFormaPreset === "moderate"
                      ? " Moderate"
                      : " Aggressive"}{" "}
                  preset applied
                </Box>
              </Box>
            )}

            {/* Custom Tab */}
            {activeProFormaTab === "custom" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Custom Pro Forma Values:
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const name = prompt("Enter preset name:");
                      if (name && name.trim()) {
                        const description = prompt(
                          "Enter description (optional):",
                        );
                        saveCustomPreset(
                          name.trim(),
                          description || undefined,
                        );
                        // Show success message
                        alert(
                          `Preset name.trim() saved successfully!`,
                        );
                      }
                    }}
                  >
                    Save Current
                  </Button>
                </Box>

                {/* Pro Forma Input Fields */}
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(auto-fit, minmax(200px, 1fr))",
                    },
                    mb: 3,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Maintenance %"
                    type="number"
                    value={ops.maintenance}
                    onChange={(e) =>
                      updateOps(
                        "maintenance",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                  <TextField
                    fullWidth
                    label="Vacancy %"
                    type="number"
                    value={ops.vacancy}
                    onChange={(e) =>
                      updateOps(
                        "vacancy",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                  <TextField
                    fullWidth
                    label="Management %"
                    type="number"
                    value={ops.management}
                    onChange={(e) =>
                      updateOps(
                        "management",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                  <TextField
                    fullWidth
                    label="CapEx %"
                    type="number"
                    value={ops.capEx}
                    onChange={(e) =>
                      updateOps("capEx", parseFloat(e.target.value) || 0)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                  <TextField
                    fullWidth
                    label="OpEx %"
                    type="number"
                    value={ops.opEx}
                    onChange={(e) =>
                      updateOps("opEx", parseFloat(e.target.value) || 0)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                </Box>

                {/* Current Values Summary */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: brandColors.neutral[100] || brandColors.neutral[100],
                    borderRadius: 1,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.neutral[800] || "#333", mb: 1 }}
                  >
                    <strong>Current Pro Forma Values:</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    Total Variable: {(ops.maintenance + ops.vacancy + ops.management + ops.capEx + ops.opEx).toFixed(1)}% | Fixed: $
                    {(ops.maintenance + ops.vacancy + ops.management + ops.capEx + ops.opEx) * 1000}
                    /month
                  </Typography>
                </Box>

                {/* Custom Presets List */}
                {customProFormaPresets.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                    >
                      Saved Custom Presets:
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 1,
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(auto-fit, minmax(250px, 1fr))",
                        },
                      }}
                    >
                      {customProFormaPresets.map((preset) => (
                        <Card
                          key={preset.id}
                          variant="outlined"
                          sx={{ p: 2, position: "relative" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              {preset.name}
                            </Typography>
                            <IconButtonComponent
                              size="small"
                              onClick={() =>
                                deleteCustomPreset(preset.id)
                              }
                              sx={{ color: "#d32f2f" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButtonComponent>
                          </Box>
                          {preset.description && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: brandColors.neutral[800] || "#333",
                                mb: 1,
                                display: "block",
                              }}
                            >
                              {preset.description}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            sx={{ color: "#888" }}
                          >
                            M: {preset.maintenance}% | V: {preset.vacancy}
                            % | Mgmt: {preset.management}% | CapEx:{" "}
                            {preset.capEx}% | OpEx: {preset.opEx}%
                          </Typography>
                          <Button
                            size="small"
                            variant={
                              selectedCustomPreset === preset.id
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => applyCustomPreset(preset.id)}
                            sx={{ mt: 1, fontSize: "0.7rem" }}
                          >
                            {selectedCustomPreset === preset.id
                              ? "Applied"
                              : "Apply"}
                          </Button>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {customProFormaPresets.length === 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.neutral[800] || "#333", fontStyle: "italic" }}
                    >
                      No custom presets saved yet. Adjust the values above
                      and use the "Save Current" button to save your
                      custom Pro Forma settings.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#999", mt: 1, display: "block" }}
                    >
                      Debug: {customProFormaPresets.length} presets
                      in state
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Sensitivity Analysis Tab */}
            {activeProFormaTab === "sensitivity" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Sensitivity Analysis:
                  </Typography>
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2">
                      Range: ±{sensitivityAnalysis.sensitivityRange}
                      %
                    </Typography>
                    <Slider
                      value={sensitivityAnalysis.sensitivityRange}
                      onChange={(_, value) =>
                        setSensitivityAnalysis(prev => ({
                          ...prev,
                          sensitivityRange: value as number,
                        }))
                      }
                      min={10}
                      max={90}
                      step={5}
                      sx={{ width: 100 }}
                    />
                    <Typography variant="body2">
                      Steps: {sensitivityAnalysis.sensitivitySteps}
                    </Typography>
                    <Slider
                      value={sensitivityAnalysis.sensitivitySteps}
                      onChange={(_, value) =>
                        setSensitivityAnalysis(prev => ({
                          ...prev,
                          sensitivitySteps: value as number,
                        }))
                      }
                      min={3}
                      max={20}
                      step={1}
                      sx={{ width: 100 }}
                    />
                  </Box>

                  <Table
                    size="small"
                    sx={{ border: 1, borderColor: brandColors.borders?.secondary || "#ddd" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Scenario</TableCell>
                        <TableCell>Maintenance</TableCell>
                        <TableCell>Vacancy</TableCell>
                        <TableCell>Management</TableCell>
                        <TableCell>CapEx</TableCell>
                        <TableCell>OpEx</TableCell>
                        <TableCell>Monthly CF</TableCell>
                        <TableCell>Annual CF</TableCell>
                        <TableCell>CoC Return</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculateSensitivityAnalysis().map((row, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            backgroundColor:
                              row.multiplier === "100%"
                                ? brandColors.neutral[100] || brandColors.neutral[100]
                                : "inherit",
                            fontWeight:
                              row.multiplier === "100%"
                                ? "bold"
                                : "normal",
                          }}
                        >
                          <TableCell>{row.multiplier}</TableCell>
                          <TableCell>{row.maintenance}%</TableCell>
                          <TableCell>{row.vacancy}%</TableCell>
                          <TableCell>{row.management}%</TableCell>
                          <TableCell>{row.capEx}%</TableCell>
                          <TableCell>{row.opEx}%</TableCell>
                          <TableCell>
                            {formatCurrency(row.monthlyCashFlow)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(row.annualCashFlow)}
                          </TableCell>
                          <TableCell>{row.cashOnCash}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}

            {/* Benchmark Comparison Tab */}
            {activeProFormaTab === "benchmarks" && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: brandColors.primary }}>
                    Industry Benchmarks:
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.neutral[800] || "#333", mb: 2 }}
                  >
                    Comparing your assumptions to industry averages for Single Family + Buy & Hold
                  </Typography>

                  <Table
                    size="small"
                    sx={{ border: 1, borderColor: brandColors.borders?.secondary || "#ddd" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Your %</TableCell>
                        <TableCell>Industry Avg</TableCell>
                        <TableCell>Variance</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(compareToBenchmarks()).map(
                        ([category, data]) => (
                          <TableRow key={category}>
                            <TableCell
                              sx={{ textTransform: "capitalize" }}
                            >
                              {category}
                            </TableCell>
                            <TableCell>{data.current}%</TableCell>
                            <TableCell>{data.benchmark}%</TableCell>
                            <TableCell
                              sx={{
                                color:
                                  data.variance > 0
                                    ? "#d32f2f"
                                    : brandColors.accent?.success || brandColors.accent.success,
                                fontWeight: "bold",
                              }}
                            >
                              {data.variance > 0 ? "+" : ""}
                              {data.variancePct}%
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  data.variance > 0
                                    ? "Above Avg"
                                    : "Below Avg"
                                }
                                size="small"
                                color={
                                  data.variance > 0
                                    ? "warning"
                                    : "success"
                                }
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: brandColors.neutral[100] || brandColors.neutral[100],
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: brandColors.neutral[800] || "#333" }}>
                      <strong>Note:</strong> Industry benchmarks are based
                      on aggregated data from real estate professionals.
                      Your specific market conditions may vary
                      significantly.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Revenue Analysis Tab - gated by ADR predicate */}
            {shouldShowAdrTabs() &&
              activeProFormaTab === "revenue" && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, color: brandColors.primary }}
                    >
                      Revenue Projections:
                    </Typography>
                  </Box>

                  {/* Revenue Input Fields */}
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(auto-fit, minmax(200px, 1fr))",
                      },
                      mb: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Total Rooms"
                      type="number"
                      value={revenueInputs.totalRooms}
                      onChange={(e) =>
                        setRevenueInputs(prev => ({
                          ...prev,
                          totalRooms: parseInt(e.target.value) || 1,
                        }))
                      }
                      inputProps={{ min: 1, max: 1000 }}
                    />
                    <TextField
                      fullWidth
                      label="Average Daily Rate ($)"
                      type="number"
                      value={revenueInputs.averageDailyRate}
                      onChange={(e) =>
                        setRevenueInputs(prev => ({
                          ...prev,
                          averageDailyRate:
                            parseFloat(e.target.value) || 0,
                        }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            $
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0, step: 1 }}
                    />
                    <TextField
                      fullWidth
                      label="Base Occupancy Rate (%)"
                      type="number"
                      value={revenueInputs.occupancyRate}
                      onChange={(e) =>
                        setRevenueInputs(prev => ({
                          ...prev,
                          occupancyRate:
                            parseFloat(e.target.value) || 0,
                        }))
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            %
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                    <TextField
                      fullWidth
                      label="Fixed Annual Costs ($)"
                      type="number"
                      value={revenueInputs.fixedAnnualCosts}
                      onChange={(e) =>
                        setRevenueInputs(prev => ({
                          ...prev,
                          fixedAnnualCosts:
                            parseFloat(e.target.value) || 0,
                          fixedMonthlyCosts:
                            (parseFloat(e.target.value) || 0) / 12,
                        }))
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            $
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0, step: 1000 }}
                    />
                  </Box>

                  {/* Seasonal Variations */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                    >
                      Seasonal Occupancy Multipliers:
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "repeat(auto-fit, minmax(150px, 1fr))",
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Q1 (Winter)"
                        type="number"
                        value={revenueInputs.seasonalVariations.q1}
                        onChange={(e) =>
                          setRevenueInputs(prev => ({
                            ...prev,
                            seasonalVariations: {
                              ...prev.seasonalVariations,
                              q1: parseFloat(e.target.value) || 1,
                            },
                          }))
                        }
                        inputProps={{ min: 0, max: 3, step: 0.1 }}
                      />
                      <TextField
                        fullWidth
                        label="Q2 (Spring)"
                        type="number"
                        value={revenueInputs.seasonalVariations.q2}
                        onChange={(e) =>
                          setRevenueInputs(prev => ({
                            ...prev,
                            seasonalVariations: {
                              ...prev.seasonalVariations,
                              q2: parseFloat(e.target.value) || 1,
                            },
                          }))
                        }
                        inputProps={{ min: 0, max: 3, step: 0.1 }}
                      />
                      <TextField
                        fullWidth
                        label="Q3 (Summer)"
                        type="number"
                        value={revenueInputs.seasonalVariations.q3}
                        onChange={(e) =>
                          setRevenueInputs(prev => ({
                            ...prev,
                            seasonalVariations: {
                              ...prev.seasonalVariations,
                              q3: parseFloat(e.target.value) || 1,
                            },
                          }))
                        }
                        inputProps={{ min: 0, max: 3, step: 0.1 }}
                      />
                      <TextField
                        fullWidth
                        label="Q4 (Fall)"
                        type="number"
                        value={revenueInputs.seasonalVariations.q4}
                        onChange={(e) =>
                          setRevenueInputs(prev => ({
                            ...prev,
                            seasonalVariations: {
                              ...prev.seasonalVariations,
                              q4: parseFloat(e.target.value) || 1,
                            },
                          }))
                        }
                        inputProps={{ min: 0, max: 3, step: 0.1 }}
                      />
                    </Box>
                  </Box>

                  {/* Revenue Projections Table */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                    >
                      Revenue Projections (33 Rooms):
                    </Typography>
                    <Table
                      size="small"
                      sx={{ border: 1, borderColor: brandColors.borders?.secondary || "#ddd" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Occupancy</TableCell>
                          <TableCell>ADR $50</TableCell>
                          <TableCell>ADR $100</TableCell>
                          <TableCell>ADR $150</TableCell>
                          <TableCell>ADR $200</TableCell>
                          <TableCell>ADR $250</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          10, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95,
                          100,
                        ].map((occupancy) => (
                          <TableRow key={occupancy}>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {occupancy}%
                            </TableCell>
                            {[50, 100, 150, 200, 250].map((adr) => {
                              const annualRevenue =
                                ((revenueInputs.totalRooms *
                                  adr *
                                  occupancy) /
                                  100) *
                                365;
                              const monthlyRevenue = annualRevenue / 12;
                              return (
                                <TableCell key={adr}>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      annualRevenue.toLocaleString()
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: brandColors.neutral[800] || "#333" }}
                                    >
                                      monthlyRevenue.toLocaleString()
                                      /mo
                                    </Typography>
                                  </Box>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>

                  {/* Fixed Costs Summary */}
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: brandColors.neutral[100] || brandColors.neutral[100],
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.neutral[800] || "#333", mb: 1 }}
                    >
                      <strong>Fixed Costs Summary:</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      Annual: $
                      {revenueInputs.fixedAnnualCosts.toLocaleString()}{" "}
                      | Monthly: $
                      {(
                        revenueInputs.fixedAnnualCosts / 12
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              )}

            {/* Break-Even Analysis Tab - gated by ADR predicate */}
            {shouldShowAdrTabs() &&
              activeProFormaTab === "breakEven" && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, color: brandColors.primary }}
                    >
                      Break-Even Analysis:
                    </Typography>
                  </Box>

                  {/* Break-Even Calculations */}
                  <Box
                    sx={{
                      display: "grid",
                      gap: 3,
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(auto-fit, minmax(250px, 1fr))",
                      },
                      mb: 3,
                    }}
                  >
                    <Card sx={{ p: 2, backgroundColor: brandColors.neutral[100] }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: brandColors.neutral[800], mb: 1 }}
                      >
                        Break-Even Occupancy
                      </Typography>
                      <Typography variant="h6" sx={{ color: brandColors.neutral[800] }}>
                        {calculateBreakEvenOccupancy().toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.neutral[800] || "#333" }}
                      >
                        Minimum occupancy needed to cover costs
                      </Typography>
                    </Card>

                    <Card sx={{ p: 2, backgroundColor: brandColors.neutral[300] }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: brandColors.neutral[700], mb: 1 }}
                      >
                        Break-Even ADR
                      </Typography>
                      <Typography variant="h6" sx={{ color: brandColors.neutral[700] }}>
                        calculateBreakEvenADR().toFixed(0)
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.neutral[800] || "#333" }}
                      >
                        Minimum daily rate needed to cover costs
                      </Typography>
                    </Card>

                    <Card sx={{ p: 2, backgroundColor: "#d5d5d5" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: brandColors.neutral[600], mb: 1 }}
                      >
                        Margin of Safety
                      </Typography>
                      <Typography variant="h6" sx={{ color: brandColors.neutral[600] }}>
                        {calculateMarginOfSafety().toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.neutral[800] || "#333" }}
                      >
                        Current occupancy above break-even
                      </Typography>
                    </Card>
                  </Box>

                  {/* Break-Even Table */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                    >
                      Break-Even Analysis by Occupancy:
                    </Typography>
                    <Table
                      size="small"
                      sx={{ border: 1, borderColor: brandColors.borders?.secondary || "#ddd" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Occupancy %</TableCell>
                          <TableCell>Daily Revenue</TableCell>
                          <TableCell>Monthly Revenue</TableCell>
                          <TableCell>Annual Revenue</TableCell>
                          <TableCell>Profit/Loss</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[50, 60, 65, 70, 75, 80, 85, 90, 95, 100].map((occupancy) => {
                          const dailyRevenue = (revenueInputs.totalRooms * revenueInputs.averageDailyRate * occupancy) / 100;
                          const monthlyRevenue = dailyRevenue * 30;
                          const annualRevenue = dailyRevenue * 365;
                          const profitLoss = annualRevenue - revenueInputs.fixedAnnualCosts;
                          
                          return (
                            <TableRow
                              key={occupancy}
                              sx={{
                                backgroundColor: occupancy === 65.5 ? brandColors.backgrounds?.selected || "#e3f2fd" : "inherit",
                                fontWeight: occupancy === 65.5 ? "bold" : "normal",
                              }}
                            >
                              <TableCell>{occupancy}%</TableCell>
                              <TableCell>dailyRevenue.toFixed(0)</TableCell>
                              <TableCell>monthlyRevenue.toFixed(0)</TableCell>
                              <TableCell>annualRevenue.toFixed(0)</TableCell>
                              <TableCell
                                sx={{
                                  color: profitLoss >= 0 ? brandColors.accent.successDark : "#d32f2f",
                                  fontWeight: "bold",
                                }}
                              >
                                {profitLoss >= 0 ? "+" : ""}profitLoss.toFixed(0)
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              )}
          </Box>
        );
      case 'risk-assessment':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Section Description */}
            <Box
              sx={{
                p: 2,
                backgroundColor: '#fff3e0',
                borderRadius: 1,
                border: '1px solid brandColors.accent.warningLight',
                fontSize: '0.875rem',
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#e65100', fontWeight: 500 }}
              >
                <strong>Risk Scoring & Mitigation:</strong> Comprehensive
                risk assessment across market, property, tenant, and
                financing factors with actionable recommendations for risk
                mitigation.
              </Typography>
            </Box>

            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Overall Risk Score:
              </Typography>
              {riskScoreResults ? (
                <>
                  <Chip
                    label={`${riskScoreResults.overallRiskScore}/10`}
                    color={
                      riskScoreResults.overallRiskScore <= 3
                        ? 'success'
                        : riskScoreResults.overallRiskScore <= 5
                          ? 'warning'
                          : riskScoreResults.overallRiskScore <= 7
                            ? 'error'
                            : 'error'
                    }
                    variant="filled"
                    sx={{ fontSize: '1.1rem', fontWeight: 600 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: brandColors.neutral[800] || '#333', fontWeight: 500 }}
                  >
                    {riskScoreResults.riskCategory}
                  </Typography>
                </>
              ) : (
                <Chip
                  label="Not Calculated"
                  color="default"
                  variant="outlined"
                />
              )}
            </Box>

            {riskScoreResults && (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: brandColors.primary, mb: 1 }}
                    >
                      Market Risk
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#e65100' }}
                    >
                      {riskScoreResults.riskBreakdown.marketRisk}/10
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: brandColors.primary, mb: 1 }}
                    >
                      Property Risk
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#e65100' }}
                    >
                      {riskScoreResults.riskBreakdown.propertyRisk}/10
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: brandColors.primary, mb: 1 }}
                    >
                      Tenant Risk
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#e65100' }}
                    >
                      {riskScoreResults.riskBreakdown.tenantRisk}/10
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: brandColors.primary, mb: 1 }}
                    >
                      Financing Risk
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600, color: '#e65100' }}
                    >
                      {riskScoreResults.riskBreakdown.financingRisk}
                      /10
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#fff3e0',
                    borderRadius: 1,
                    border: '1px solid brandColors.accent.warningLight',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#e65100', mb: 1 }}
                  >
                    Key Recommendations:
                  </Typography>
                  {riskScoreResults.recommendations
                    .slice(0, 3)
                    .map((rec, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{ mb: 0.5, color: '#bf360c' }}
                      >
                        - {rec}
                      </Typography>
                    ))}
                </Box>
              </>
            )}

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => {
                  const results = calculateRiskScore(
                    riskFactors,
                    marketConditions,
                    propertyAge,
                  );
                  setRiskScoreResults(results);
                }}
                sx={{
                  backgroundColor: brandColors.primary,
                  '&:hover': { backgroundColor: '#2d3748' },
                }}
              >
                {riskScoreResults
                  ? 'Recalculate Risk Score'
                  : 'Calculate Risk Score'}
              </Button>
            </Box>
          </Box>
        );
      case 'advanced-analysis':
        // Removed: Advanced Analysis merged into Advanced Modeling
        return null;
      case 'advanced-modeling':
        // Local tabs for Advanced Modeling section
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Banner */}
            <Box
              sx={{
                p: 2,
                backgroundColor: brandColors.backgrounds?.selected || '#e8f2ff',
                borderRadius: 1,
                border: '1px solid',
                borderColor: brandColors.accent?.info || '#90caf9',
                fontSize: '0.875rem',
              }}
            >
              <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 500 }}>
                <strong>Advanced Modeling Suite:</strong> Full toolset from Advanced Calculations, including seasonal & market adjustments, exit strategies, tax implications, refinance, sensitivity, stress testing, and inflation.
              </Typography>
            </Box>

            {/* Tabs (styled to match Documents page) */}
            <Box sx={{ borderBottom: '1px solid', borderColor: brandColors.borders?.secondary || '#e5e7eb' }}>
              <Tabs
                value={advancedModelingTab}
                onChange={(_, v) => setAdvancedModelingTab(v as typeof advancedModelingTab)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  minHeight: 44,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: 44,
                    fontWeight: 500,
                    color: brandColors.text?.secondary || '#6b7280',
                  },
                  '& .Mui-selected': {
                    color: brandColors.primary,
                    fontWeight: 700,
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 3,
                    backgroundColor: brandColors.primary,
                  },
                }}
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Global Configuration" value="global" />
                <Tab label="Seasonal & Market" value="seasonal" />
                <Tab label="Exit Strategies" value="exit" />
                <Tab label="Tax" value="tax" />
                <Tab label="Refinance" value="refi" />
                <Tab label="Risk Analysis" value="risk" />
                <Tab label="Sensitivity & Inflation" value="sensitivity" />
                <Tab label="Scenario Comparison" value="scenarios" />
              </Tabs>
            </Box>

            {/* Tab Panels - placeholders for now */}
            <Box sx={{ pt: 2 }}>
              {advancedModelingTab === 'overview' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Advanced Calculations Overview
                    </Typography>
                    <Typography variant="body1" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                      Welcome to the Advanced Calculations Suite. This comprehensive tool provides sophisticated analysis for your real estate investments.
                    </Typography>
                  </Box>

                  {/* Top Row Cards */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {/* Deal Information Card */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#e3f2fd',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                        Deal Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Property Type:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            Single Family
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Location:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            , 
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Purchase Price:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $160,000
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Operation Type:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            Buy & Hold
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Financing Type:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            Conventional
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Quick Actions Card */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#e3f2fd',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                        Quick Actions
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, color: brandColors.text?.primary || '#111827' }}>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                          Configure market conditions in Global Configuration
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                          Set up exit strategies for different timeframes
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                          Analyze risk factors and get scoring
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                          Save scenarios for comparison
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Bottom Row - Advanced Analysis Dashboard Card */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Advanced Analysis Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280', mb: 3 }}>
                      Configure market and seasonal inputs, then review calculated outputs.
                    </Typography>
                    
                    {/* Calculation Completion Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                        Calculation Completion
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={0}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e5e7eb',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: brandColors.primary,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280', minWidth: 'fit-content' }}>
                          0 of 4 sections completed
                        </Typography>
                      </Box>
                    </Box>

                    {/* Quick Export Results Button */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: brandColors.primary,
                        color: brandColors.text.inverse,
                        '&:hover': { backgroundColor: brandColors.accent.infoDark },
                      }}
                    >
                      Quick Export Results
                    </Button>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'global' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Global Configuration
                    </Typography>
                    <Typography variant="body1" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                      Configure market conditions, exit strategies, risk factors, and manage scenarios.
                    </Typography>
                  </Box>

                  {/* Configuration Sections */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {/* Market Conditions */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                        Market Conditions
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Inflation Rate (%)"
                            type="number"
                            defaultValue="2.5"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            %
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Appreciation Rate (%)"
                            type="number"
                            defaultValue="4.0"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            %
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Rent Growth Rate (%)"
                            type="number"
                            defaultValue="3.0"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            %
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Exit Strategy Configuration */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                        Exit Strategy Configuration
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Market Appreciation (%)"
                            type="number"
                            defaultValue="4.0"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            %
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Selling Costs (%)"
                            type="number"
                            defaultValue="6"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            %
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Bottom Row - Risk Factors and Scenario Management */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {/* Risk Factor Configuration */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                        Risk Factor Configuration
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Market Volatility"
                            type="number"
                            defaultValue="5"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            label="Tenant Quality"
                            type="number"
                            defaultValue="7"
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Scenario Management */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                        Scenario Management
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#10b981',
                          color: brandColors.text.inverse,
                          '&:hover': { backgroundColor: '#059669' },
                        }}
                      >
                        Save Current Scenario
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'seasonal' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Seasonal & Market Analysis
                    </Typography>
                    <Typography variant="body1" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                      Configure seasonal adjustments and market conditions for accurate financial modeling.
                    </Typography>
                  </Box>

                  {/* Content Cards */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    {/* Seasonal Adjustments Card */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Seasonal Adjustments
                        </Typography>
                        <IconButton size="small" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          <HelpOutline />
                        </IconButton>
                      </Box>
                      
                      {/* Month Input */}
                      <Box sx={{ mb: 3 }}>
                        <TextField
                          label="Month (1-12)"
                          type="number"
                          defaultValue="8"
                          size="small"
                          fullWidth
                          inputProps={{ min: 1, max: 12 }}
                        />
                        <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                          Min: 1 | Max: 12
                        </Typography>
                      </Box>

                      {/* Read-only Values */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Adjusted Vacancy:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            5.50%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Maintenance Multiplier:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            1.20
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Market Conditions Card */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Market Conditions
                        </Typography>
                        <IconButton size="small" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          <HelpOutline />
                        </IconButton>
                      </Box>
                      
                      {/* Market Dropdown */}
                      <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Market</InputLabel>
                          <Select
                            defaultValue="stable"
                            label="Market"
                          >
                            <MenuItem value="stable">Stable</MenuItem>
                            <MenuItem value="growing">Growing</MenuItem>
                            <MenuItem value="declining">Declining</MenuItem>
                            <MenuItem value="volatile">Volatile</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Read-only Values */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Adj Vacancy:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            5.00%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Adj Rent Growth:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            3.09%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Adj Appreciation:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            4.16%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Adj Cap Rate:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            6.00%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'exit' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Exit Strategy Configuration
                    </Typography>
                    <Typography variant="body1" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                      Configure exit strategy parameters and view projected returns over different timeframes.
                    </Typography>
                  </Box>

                  {/* Input Fields Card */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Input Fields */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                      {/* Market Appreciation */}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                          Market Appreciation (%)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="number"
                            defaultValue="4.0"
                            size="small"
                            sx={{ flex: 1 }}
                            inputProps={{ step: 0.1, min: 0 }}
                          />
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              backgroundColor: '#f3f4f6',
                              border: '1px solid',
                              borderColor: brandColors.borders?.secondary || '#e5e7eb',
                              borderRadius: 1,
                              minWidth: 32,
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              %
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Selling Costs */}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                          Selling Costs (%)
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="number"
                            defaultValue="6"
                            size="small"
                            sx={{ flex: 1 }}
                            inputProps={{ step: 0.1, min: 0 }}
                          />
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              backgroundColor: '#f3f4f6',
                              border: '1px solid',
                              borderColor: brandColors.borders?.secondary || '#e5e7eb',
                              borderRadius: 1,
                              minWidth: 32,
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              %
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: brandColors.primary,
                        color: brandColors.text.inverse,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1.5,
                        '&:hover': { backgroundColor: brandColors.accent.infoDark },
                      }}
                    >
                      Recalculate Exit Strategies
                    </Button>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'tax' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary }}>
                      Tax Implications
                    </Typography>
                    <IconButton size="small" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                      <HelpOutline />
                    </IconButton>
                  </Box>

                  {/* Input Fields Card */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    {/* Input Fields - Two Columns */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                      {/* Left Column */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Annual Income */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Annual Income
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="120000"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                            Min: 0
                          </Typography>
                        </Box>

                        {/* Mortgage Interest */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Mortgage Interest
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="12000"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Box>

                        {/* Depreciation */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Depreciation
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="8000"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Right Column */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Tax Bracket */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Tax Bracket (%)
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="24"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0, max: 50 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                            Min: 0 | Max: 50
                          </Typography>
                        </Box>

                        {/* Property Tax */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Property Tax
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="6000"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Box>

                        {/* Repairs */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Repairs
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="3000"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Deduction Toggles */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 2 }}>
                        Deduction Toggles
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Property Tax Deduction"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Depreciation Deduction"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Mortgage Interest Deduction"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Repair Expense Deduction"
                        />
                      </Box>
                    </Box>

                    {/* Calculated Results Section */}
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#f8fafc',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 2 }}>
                        Calculated Results
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Taxable Income:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $91,000
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Tax Savings:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $6,960
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Effective Tax Rate:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            18.2%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Net Income:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $105,120
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'refi' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Comprehensive Refinance Analysis
                    </Typography>
                  </Box>

                  {/* Current Loan & Property Details Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Current Loan & Property Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      {/* Left Column */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Current Loan Balance:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $200,000
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Current Interest Rate (%):
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            6.5%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Credit Score:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            750
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', fontStyle: 'italic' }}>
                          Auto-updates new interest rate
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Refinance LTV (%):
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            70%
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', fontStyle: 'italic' }}>
                          Maximum loan-to-value ratio
                        </Typography>
                      </Box>

                      {/* Right Column */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Property Value:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $250,000
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Current Monthly Payment:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            $1,264
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            New Interest Rate (%):
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            5.5%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                            Closing Costs (%):
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                            3%
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', fontStyle: 'italic' }}>
                          Typical range: 2-5%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Refinance Scenarios Comparison Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Refinance Scenarios Comparison
                    </Typography>
                    
                    {/* Scenario Tabs */}
                    <Box sx={{ mb: 3 }}>
                      <Tabs value="rate-term" sx={{ minHeight: 40 }}>
                        <Tab 
                          label="Rate & Term Refinance" 
                          value="rate-term"
                          sx={{ backgroundColor: brandColors.primary,
                            color: brandColors.text.inverse,
                            borderRadius: '8px 8px 0 0', }}
                        />
                        <Tab 
                          label="Cash-Out Refinance" 
                          value="cash-out"
                          sx={{ color: brandColors.text?.secondary || '#6b7280' }}
                        />
                        <Tab 
                          label="Cash-In Refinance" 
                          value="cash-in"
                          sx={{ color: brandColors.text?.secondary || '#6b7280' }}
                        />
                      </Tabs>
                      <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 1 }}>
                        Lower your interest rate and/or change your loan term
                      </Typography>
                    </Box>

                    {/* Key Metrics */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                          $128.42
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Monthly Savings
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fffbeb', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                          46.7 months
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Break-even
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef2f2', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 600 }}>
                          80.0%
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          New LTV
                        </Typography>
                      </Box>
                    </Box>

                    {/* Pros and Cons */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#10b981', mb: 1 }}>
                          Pros:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                            ✓ Lower monthly payment
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                            ✓ Lower total interest paid
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                            ✓ No cash required
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#ef4444', mb: 1 }}>
                          Cons:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                            ⚠ No equity access
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                            ⚠ Closing costs to consider
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Financial Metrics Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Financial Metrics
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                          $17,922.66
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Net Present Value
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                          $46,231.92
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Total Savings (30 years)
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef2f2', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 600 }}>
                          $6,000
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Closing Costs
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Risk Analysis Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Risk Analysis
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                          2/10
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Risk Score
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef2f2', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 600 }}>
                          80.0%
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Current LTV
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 600 }}>
                          Good
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Credit Rating
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Market Intelligence & Strategy Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Market Intelligence & Strategy
                    </Typography>
                    
                    {/* Current Market Rates Table */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                        Current Market Rates by Credit Score:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, maxWidth: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, backgroundColor: '#f9fafb' }}>
                          <Typography variant="body2">800+ (Excellent):</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>5.25%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, backgroundColor: '#f9fafb' }}>
                          <Typography variant="body2">740-799 (Good):</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>5.5%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, backgroundColor: '#f9fafb' }}>
                          <Typography variant="body2">670-739 (Fair):</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>6%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, backgroundColor: '#f9fafb' }}>
                          <Typography variant="body2">Below 670 (Poor):</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>7%</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Strategy Recommendations */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: 1, border: '1px solid #0ea5e9', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#0ea5e9', fontWeight: 600 }}>
                          ✓ Excellent refinance candidate - proceed with confidence
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                        Refinance Strategy Recommendations:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, color: brandColors.text?.primary || '#111827' }}>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Best time to refinance: When rates are 0.5%+ lower than current
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Seasonal timing: Rates typically lowest in winter months
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Rate lock strategy: Lock rates when you're 30-45 days from closing
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Documentation & Compliance Checklist Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Documentation & Compliance Checklist
                    </Typography>
                    
                    {/* Required Documents */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                        Required Documents:
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
                        <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                          ✓ Income verification (W-2s, pay stubs)
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                          ✓ Asset statements (bank accounts, investments)
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                          ✓ Property insurance information
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                          ✓ Current mortgage statement
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                          ✓ Property tax information
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                          ✓ Credit report authorization
                        </Typography>
                      </Box>
                    </Box>

                    {/* Timeline Planning */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                        Timeline Planning:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, color: brandColors.text?.primary || '#111827' }}>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Application to approval: 2-3 weeks
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Rate lock period: 30-60 days
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Closing preparation: 1-2 weeks
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Total timeline: 4-6 weeks
                        </Typography>
                      </Box>
                    </Box>

                    {/* Compliance Requirements */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                        Compliance Requirements:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, color: brandColors.text?.primary || '#111827' }}>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Owner-occupied: 6-month seasoning requirement
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Investment properties: 12-month seasoning requirement
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Maximum LTV: 80% for investment properties
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'risk' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Risk Analysis
                    </Typography>
                  </Box>

                  {/* Risk Factor Configuration Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 1 }}>
                      Risk Factor Configuration
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280', mb: 3 }}>
                      Configure risk factors to assess investment risk and generate risk scores.
                    </Typography>
                    
                    {/* Input Fields */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                          Market Volatility
                        </Typography>
                        <TextField
                          type="number"
                          defaultValue="5"
                          size="small"
                          fullWidth
                          inputProps={{ min: 1, max: 10, step: 1 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: brandColors.borders?.secondary || '#e5e7eb',
                              },
                              '&:hover fieldset': {
                                borderColor: brandColors.primary,
                              },
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                          Scale: 1 (Low) to 10 (High)
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                          Tenant Quality
                        </Typography>
                        <TextField
                          type="number"
                          defaultValue="7"
                          size="small"
                          fullWidth
                          inputProps={{ min: 1, max: 10, step: 1 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: brandColors.borders?.secondary || '#e5e7eb',
                              },
                              '&:hover fieldset': {
                                borderColor: brandColors.primary,
                              },
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                          Scale: 1 (Poor) to 10 (Excellent)
                        </Typography>
                      </Box>
                    </Box>

                    {/* Recalculate Button */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: brandColors.primary,
                        color: brandColors.text.inverse,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1.5,
                        '&:hover': { backgroundColor: brandColors.accent.infoDark },
                      }}
                    >
                      Recalculate Risk Analysis
                    </Button>
                  </Box>

                  {/* Risk Analysis Results Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Risk Analysis Results
                    </Typography>
                    
                    {/* Risk Score Display */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f9ff', borderRadius: 1, border: '1px solid #0ea5e9' }}>
                        <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                          4.4/10
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Overall Risk Score
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fffbeb', borderRadius: 1, border: '1px solid #f59e0b' }}>
                        <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
                          Medium
                        </Typography>
                        <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          Risk Level
                        </Typography>
                      </Box>
                    </Box>

                    {/* Recommendation */}
                    <Box sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: 1, border: '1px solid #0ea5e9' }}>
                      <Typography variant="body2" sx={{ color: '#0ea5e9', fontWeight: 600 }}>
                        Recommendation: Implement stricter tenant screening and lease terms
                      </Typography>
                    </Box>
                  </Box>

                  {/* Confidence Intervals Section */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: '#fefce8',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: '#f59e0b',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#92400e', mb: 2 }}>
                      Confidence Intervals (95%)
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 500 }}>
                        Based on market volatility of 5/10
                      </Typography>
                      
                      <Box component="ul" sx={{ m: 0, pl: 2, color: '#92400e' }}>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Higher volatility = wider confidence intervals
                        </Typography>
                        <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                          Lower volatility = more precise projections
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'sensitivity' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Sensitivity & Inflation Analysis
                    </Typography>
                  </Box>

                  {/* Two Column Layout */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                    
                    {/* Left Section: Sensitivity Analysis */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Sensitivity Analysis
                        </Typography>
                        <IconButton size="small" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          <HelpOutline />
                        </IconButton>
                      </Box>
                      
                      {/* Input Fields */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Base Rent
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="2500"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Base Expenses
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="1500"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Property Value
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="350000"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Base Cash Flow
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="1000"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Scenario Results */}
                      <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1, border: '1px solid', borderColor: brandColors.borders?.secondary || '#e5e7eb' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                          Scenario Results:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              Scenario 1:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#ef4444' }}>
                              Cash Flow 600 (-40.0%)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              Scenario 2:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#10b981' }}>
                              Cash Flow 1000 (0.0%)
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              Scenario 3:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#10b981' }}>
                              Cash Flow 1325 (+32.5%)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Right Section: Inflation Adjustments */}
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: brandColors.borders?.secondary || '#e5e7eb',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          Inflation Adjustments
                        </Typography>
                        <IconButton size="small" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                          <HelpOutline />
                        </IconButton>
                      </Box>
                      
                      {/* Input Fields */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Monthly Rent
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="2500"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Monthly Expenses
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="1500"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Property Value
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="350000"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Inflation Rate (%)
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="2.5"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0, max: 20, step: 0.1 }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                            Min: 0 | Max: 20
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827', mb: 1 }}>
                            Years
                          </Typography>
                          <TextField
                            type="number"
                            defaultValue="10"
                            size="small"
                            fullWidth
                            inputProps={{ min: 1, max: 50, step: 1 }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                  borderColor: brandColors.borders?.secondary || '#e5e7eb',
                                },
                                '&:hover fieldset': {
                                  borderColor: brandColors.primary,
                                },
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: brandColors.text?.secondary || '#6b7280', mt: 0.5, display: 'block' }}>
                            Min: 1 | Max: 50
                          </Typography>
                        </Box>
                      </Box>

                      {/* Calculated Adjusted Values */}
                      <Box sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: 1, border: '1px solid #0ea5e9' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#0ea5e9', mb: 1 }}>
                          Calculated Adjusted Values:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              Adjusted Rent:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                              $3,200.21
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280' }}>
                              Adjusted Expenses:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                              $1,920.13
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: brandColors.text?.primary || '#111827' }}>
                              Adjusted Property Value:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: brandColors.text?.primary || '#111827' }}>
                              $448,029.59
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              {advancedModelingTab === 'scenarios' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Heading */}
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: brandColors.primary, mb: 1 }}>
                      Scenario Comparison
                    </Typography>
                  </Box>

                  {/* Information Message Box */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: '#e3f2fd',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: '#90caf9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {/* Information Icon */}
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: brandColors.accent.infoDark,
                        color: brandColors.text.inverse,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}
                    >
                      i
                    </Box>
                    
                    {/* Information Text */}
                    <Typography variant="body1" sx={{ color: '#1565c0', fontWeight: 500 }}>
                      No scenarios saved yet. Go to the Global Configuration tab to save your first scenario.
                    </Typography>
                  </Box>

                  {/* Future Content Placeholder */}
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: brandColors.borders?.secondary || '#e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}>
                      Scenario Management Features
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text?.secondary || '#6b7280', mb: 2 }}>
                      Once you've saved scenarios in Global Configuration, you'll be able to:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, color: brandColors.text?.primary || '#111827' }}>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Compare multiple investment scenarios side-by-side
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Analyze the impact of different market conditions
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        View sensitivity analysis across various parameters
                      </Typography>
                      <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                        Export scenario comparison reports
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography>Select an analysis type from the sidebar.</Typography>
          </Box>
        );
    }
  };

  return (
    <AnalysisProvider>
      <PageAppBar title="Dreamery – Analyse" />
      <Box sx={{ display: 'flex', height: '100vh', pt: '64px' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            background: brandColors.backgrounds.secondary,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <List sx={{ py: 2 }}>
              {/* Station Header */}
              <Box sx={{ px: 3, py: 2, mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: brandColors.primary,
                    color: brandColors.text.inverse,
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Station
                </Box>
              </Box>

              {/* Live Market Data Update Indicator */}
              <Box sx={{ px: 3, py: 1, mb: 2 }}>
                <Box
                  onClick={updateMarketData}
                  sx={{
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: brandColors.primary,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.primary, fontWeight: 600, mb: 0.5 }}>
                    Live Market Data
                  </Typography>
                  <Typography variant="caption" sx={{ color: brandColors.primary, display: 'block' }}>
                    {isUpdatingMarketData ? 'Updating...' : marketDataLastUpdated}
                  </Typography>
                  {isUpdatingMarketData && (
                    <Box sx={{ mt: 1 }}>
                      <CircularProgress size={16} sx={{ color: brandColors.primary }} />
                    </Box>
                  )}
                </Box>
              </Box>


              
              {/* Navigation Items */}
              {sections.map((section) => (
              <Box
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: activeSection === section.id ? brandColors.backgrounds.selected : 'transparent',
                  '&:hover': { backgroundColor: brandColors.backgrounds.hover },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: brandColors.actions.primary }}>{section.icon}</Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: activeSection === section.id ? 'bold' : 'normal', color: activeSection === section.id ? brandColors.primary : brandColors.text.primary }}
                  >
                    {section.label}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Action Buttons */}
            <Box sx={{ px: 3, py: 2, mt: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: brandColors.primary,
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  Export PDF
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: brandColors.primary,
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  Email PDF
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: brandColors.primary,
                    color: brandColors.text.inverse,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: brandColors.primary,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </List>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 3,
            pl: 3,
            pr: 3,
            pb: 3,
            overflow: 'auto',
          }}
        >
          <Paper elevation={0} sx={{ mb: 4, p: 3, backgroundColor: brandColors.primary, borderRadius: '16px 16px 0 0', color: brandColors.text.inverse, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {activeSection === 'dashboard' && <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />}
              {activeSection === 'pro-forma' && <AccountBalanceIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />}
              {activeSection === 'risk-assessment' && <SecurityIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />}
              {activeSection === 'advanced-analysis' && <TrendingUpIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />}
              {activeSection === 'advanced-modeling' && <ModelTrainingIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />}
              <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                {sections.find(s => s.id === activeSection)?.label}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {activeSection === 'dashboard' && 'At-a-glance summary of your analysis workspace. Quick stats, recent analyses, and shortcuts.'}
              {activeSection === 'pro-forma' && 'Overview and financial projections. We will organize key components from Advanced Calculations here.'}
              {activeSection === 'risk-assessment' && 'Risk factors and scoring will be surfaced here from Advanced Calculations.'}
              {activeSection === 'advanced-analysis' && 'Seasonal & Market, Exit Strategies, Tax, Refinance, Sensitivity, and Scenario Comparison content will be organized here.'}
              {activeSection === 'advanced-modeling' && 'Machine learning models, predictive analytics, and statistical modeling for real estate investment decisions.'}
            </Typography>
            
            {/* Guided Tour Button positioned in top right corner - only visible for Advanced Modeling */}
            {activeSection === 'advanced-modeling' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<HelpOutline />}
                  onClick={handleGuidedTour}
                  sx={{
                    borderColor: 'white',
                    color: brandColors.text.inverse,
                    py: 0.5,
                    px: 1.5,
                    fontSize: '0.75rem',
                    minWidth: 'auto',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: brandColors.text.inverse
                    },
                  }}
                >
                  Guided Tour
                </Button>
              </Box>
            )}
          </Paper>

          {/* Content Area */}
          {renderContent()}
        </Box>
      </Box>
      
      {/* Guided Tour Modal */}
      <GuidedTour
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
      />
    </AnalysisProvider>
  );
};

export default AnalyzePage;
