import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme';
import { useNavigate } from 'react-router-dom';
import { calculateRiskScore, defaultMarketConditions } from '../utils/advancedCalculations';
import AdvancedCalculationsPage from './AdvancedCalculationsPage';

const drawerWidth = 280;

const AnalyzePage: React.FC = () => {
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
    sensitivityRange: 20,
    sensitivitySteps: 5,
  });
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
    { id: 'advanced-analysis', label: 'Advanced Analysis', icon: <TrendingUpIcon /> },
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

  const computeFixedMonthlyOps = (ops: typeof this.ops) => {
    return (ops.maintenance + ops.vacancy + ops.management + ops.capEx + ops.opEx) * 1000;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Section Description */}
            <Box
              sx={{
                p: 2,
                backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                borderRadius: 1,
                border: '1px solid',
                borderColor: brandColors.borders?.secondary || '#e5e7eb',
                fontSize: '0.875rem',
              }}
            >
              <Typography variant="body2" sx={{ color: brandColors.primary, fontWeight: 500 }}>
                <strong>At a Glance:</strong> Key deal inputs and calculated financial metrics to connect Analyze with Underwrite. Read-only snapshot; values update as you change assumptions elsewhere.
              </Typography>
            </Box>

            {/* Property & Deal Info */}
            <Box sx={{ p: 2, bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb', borderRadius: 2, border: `1px solid ${brandColors.borders?.secondary || '#e5e7eb'}` }}>
              <Typography sx={{ fontWeight: 600, mb: 2, color: brandColors.primary, fontSize: '0.9rem' }}>Property & Deal Info</Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField fullWidth label="Property Type" value={propertyType} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Operation Type" value={operationType} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Finance Type" value={offerType} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Units" value={units} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Square Footage" value={squareFootage > 0 ? squareFootage.toLocaleString() : 'N/A'} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="ARV" value={arv ? currency(arv) : 'N/A'} InputProps={{ readOnly: true }} />
              </Box>
            </Box>

            {/* Key Financial Metrics */}
            <Box sx={{ p: 2, bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb', borderRadius: 2, border: `1px solid ${brandColors.borders?.secondary || '#e5e7eb'}` }}>
              <Typography sx={{ fontWeight: 600, mb: 2, color: brandColors.primary, fontSize: '0.9rem' }}>Key Financial Metrics</Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField fullWidth label="Listed Price" value={currency(listedPrice)} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Purchase Price" value={currency(purchasePrice)} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Total Acquisition Cost" value={currency(purchasePrice + (loan.closingCosts || 0) + (loan.rehabCosts || 0))} InputProps={{ readOnly: true }} helperText="Purchase + Closing + Immediate CapEx" />
                <TextField fullWidth label="Total Project Cost" value={currency(purchasePrice + (loan.closingCosts || 0) + (loan.rehabCosts || 0))} InputProps={{ readOnly: true }} helperText="Acquisition + Rehab" />
                <TextField fullWidth label="Loan Amount" value={currency(computeLoanAmountSimple())} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Interest Rate" value={`${(loan.annualInterestRate || 0).toFixed(2)}%`} InputProps={{ readOnly: true }} />
              </Box>
            </Box>

            {/* Income & Ratios */}
            <Box sx={{ p: 2, bgcolor: brandColors.backgrounds?.secondary || '#f5f7fb', borderRadius: 2, border: `1px solid ${brandColors.borders?.secondary || '#e5e7eb'}` }}>
              <Typography sx={{ fontWeight: 600, mb: 2, color: brandColors.primary, fontSize: '0.9rem' }}>Income & Performance</Typography>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField fullWidth label="Monthly Income" value={currency(computeMonthlyIncome())} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Monthly Operating Expenses" value={currency(computeFixedMonthlyOps(ops as any) + variableMonthlyFromPercentages(computeMonthlyIncome()))} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Monthly Cash Flow" value={currency(computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0))} InputProps={{ readOnly: true }} />
                <TextField fullWidth label="Annual Cash Flow" value={currency((computeMonthlyIncome() - computeFixedMonthlyOps(ops as any) - (loan.monthlyPayment || 0)) * 12)} InputProps={{ readOnly: true }} />
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
                    color: brandColors.neutral?.dark || "#333",
                    "&.Mui-selected": {
                      color: brandColors.primary,
                      fontWeight: 700,
                      backgroundColor: "#f0f4ff",
                      borderRadius: "4px 4px 0 0",
                    },
                    "&:hover": {
                      backgroundColor: brandColors.backgrounds?.secondary || "#f5f5f5",
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
                    backgroundColor: brandColors.backgrounds?.secondary || "#f5f5f5",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: brandColors.borders?.secondary || "#ddd",
                    fontSize: "0.875rem",
                    color: brandColors.neutral?.dark || "#333",
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
                    color: brandColors.neutral?.dark || "#333",
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
                          `Preset "${name.trim()}" saved successfully!`,
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
                    backgroundColor: brandColors.neutral?.light || "#f5f5f5",
                    borderRadius: 1,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.neutral?.dark || "#333", mb: 1 }}
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
                                color: brandColors.neutral?.dark || "#333",
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
                      sx={{ color: brandColors.neutral?.dark || "#333", fontStyle: "italic" }}
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
                      max={50}
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
                      max={9}
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
                                ? brandColors.neutral?.light || "#f5f5f5"
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
                    sx={{ color: brandColors.neutral?.dark || "#333", mb: 2 }}
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
                                    : brandColors.accent?.success || "#4caf50",
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
                      backgroundColor: brandColors.neutral?.light || "#f5f5f5",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: brandColors.neutral?.dark || "#333" }}>
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
                                      ${annualRevenue.toLocaleString()}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: brandColors.neutral?.dark || "#333" }}
                                    >
                                      ${monthlyRevenue.toLocaleString()}
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
                      backgroundColor: brandColors.neutral?.light || "#f5f5f5",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.neutral?.dark || "#333", mb: 1 }}
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
                    <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds?.selected || "#e3f2fd" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: brandColors.actions?.primary || "#1976d2", mb: 1 }}
                      >
                        Break-Even Occupancy
                      </Typography>
                      <Typography variant="h6" sx={{ color: brandColors.actions?.primary || "#1976d2" }}>
                        {calculateBreakEvenOccupancy().toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.neutral?.dark || "#333" }}
                      >
                        Minimum occupancy needed to cover costs
                      </Typography>
                    </Card>

                    <Card sx={{ p: 2, backgroundColor: "#f3e5f5" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#7b1fa2", mb: 1 }}
                      >
                        Break-Even ADR
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#7b1fa2" }}>
                        ${calculateBreakEvenADR().toFixed(0)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.neutral?.dark || "#333" }}
                      >
                        Minimum daily rate needed to cover costs
                      </Typography>
                    </Card>

                    <Card sx={{ p: 2, backgroundColor: brandColors.backgrounds?.success || "#e8f5e8" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, color: "#388e3c", mb: 1 }}
                      >
                        Margin of Safety
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#388e3c" }}>
                        {calculateMarginOfSafety().toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: brandColors.neutral?.dark || "#333" }}
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
                              <TableCell>${dailyRevenue.toFixed(0)}</TableCell>
                              <TableCell>${monthlyRevenue.toFixed(0)}</TableCell>
                              <TableCell>${annualRevenue.toFixed(0)}</TableCell>
                              <TableCell
                                sx={{
                                  color: profitLoss >= 0 ? "#388e3c" : "#d32f2f",
                                  fontWeight: "bold",
                                }}
                              >
                                {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(0)}
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
                border: '1px solid #ffb74d',
                fontSize: '0.875rem',
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500 }}>
                <strong>Risk Scoring & Mitigation:</strong> Comprehensive risk assessment across market, property, tenant, and financing factors with actionable recommendations for risk mitigation.
              </Typography>
            </Box>

            {/* Overall Risk Score */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
                  <Typography variant="body1" sx={{ color: brandColors.neutral?.dark || '#333', fontWeight: 500 }}>
                    {riskScoreResults.riskCategory}
                  </Typography>
                </>
              ) : (
                <Chip label="Not Calculated" color="default" variant="outlined" />
              )}
            </Box>

            {/* Breakdown */}
            {riskScoreResults && (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {[{ label: 'Market Risk', value: riskScoreResults.riskBreakdown.marketRisk },
                    { label: 'Property Risk', value: riskScoreResults.riskBreakdown.propertyRisk },
                    { label: 'Tenant Risk', value: riskScoreResults.riskBreakdown.tenantRisk },
                    { label: 'Financing Risk', value: riskScoreResults.riskBreakdown.financingRisk },
                  ].map(item => (
                    <Box key={item.label} sx={{ p: 2, backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: brandColors.primary, mb: 1 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: '#e65100' }}>
                        {item.value}/10
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Recommendations */}
                <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 1, border: '1px solid #ffb74d' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e65100', mb: 1 }}>
                    Key Recommendations:
                  </Typography>
                  {(riskScoreResults.recommendations || []).slice(0, 3).map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5, color: '#bf360c' }}>
                      - {rec}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

            {/* Recalculate Button */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={() => {
                  const results = calculateRiskScore(riskFactors, marketConditions, propertyAge);
                  setRiskScoreResults(results);
                }}
                sx={{ backgroundColor: brandColors.primary, '&:hover': { backgroundColor: '#2d3748' } }}
              >
                {riskScoreResults ? 'Recalculate Risk Score' : 'Calculate Risk Score'}
              </Button>
            </Box>
          </Box>
        );
      case 'advanced-analysis':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Section Description */}
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
                <strong>Advanced Modeling & Specialized Analysis:</strong> Access sophisticated tools for exit strategies, tax implications, seasonal adjustments, and market analysis beyond basic financial projections.
              </Typography>
            </Box>

            {/* Summary Tiles */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Exit Strategies Summary */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: brandColors.neutral?.dark || '#333', mb: 1 }}>
                  Exit Strategies
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                  Available
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral?.dark || '#333', fontSize: '0.8rem' }}>
                  Refinance, Sale, 1031 Exchange
                </Typography>
              </Box>

              {/* Tax Implications Summary */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: brandColors.neutral?.dark || '#333', mb: 1 }}>
                  Tax Analysis
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                  Available
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral?.dark || '#333', fontSize: '0.8rem' }}>
                  Depreciation, deductions, gains
                </Typography>
              </Box>

              {/* Seasonal Adjustments Summary */}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: brandColors.backgrounds?.secondary || '#f5f7fb',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: brandColors.neutral?.dark || '#333', mb: 1 }}>
                  Seasonal Analysis
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                  Available
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral?.dark || '#333', fontSize: '0.8rem' }}>
                  Monthly occupancy patterns
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 'advanced-modeling':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Section Description */}
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

            {/* Embedded Advanced Calculations Experience */}
            <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <AdvancedCalculationsPage />
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
    <div>
      <PageAppBar title="Dreamery – Analyze" />
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
                    color: 'white',
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
          <Paper elevation={0} sx={{ mb: 4, p: 3, backgroundColor: brandColors.primary, borderRadius: '16px 16px 0 0', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {activeSection === 'dashboard' && <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />}
              {activeSection === 'pro-forma' && <AccountBalanceIcon sx={{ fontSize: 28, color: 'white' }} />}
              {activeSection === 'risk-assessment' && <SecurityIcon sx={{ fontSize: 28, color: 'white' }} />}
              {activeSection === 'advanced-analysis' && <TrendingUpIcon sx={{ fontSize: 28, color: 'white' }} />}
              {activeSection === 'advanced-modeling' && <ModelTrainingIcon sx={{ fontSize: 28, color: 'white' }} />}
              <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
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
          </Paper>

          {/* Content Area */}
          {renderContent()}
        </Box>
      </Box>
    </div>
  );
};

export default AnalyzePage;
