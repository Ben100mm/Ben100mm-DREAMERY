import React, { useState, useMemo, Suspense } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { formatCurrency } from "./UXComponents";
import { brandColors } from "../theme";

// Lazy load icons to reduce initial bundle size
const LazyExpandMoreIcon = React.lazy(() => import('@mui/icons-material/ExpandMore'));
const LazyTrendingUpIcon = React.lazy(() => import('@mui/icons-material/TrendingUp'));
const LazyAccountBalanceIcon = React.lazy(() => import('@mui/icons-material/AccountBalance'));
const LazySecurityIcon = React.lazy(() => import('@mui/icons-material/Security'));
const LazyTimelineIcon = React.lazy(() => import('@mui/icons-material/Timeline'));
const LazyShowChartIcon = React.lazy(() => import('@mui/icons-material/ShowChart'));
const LazySwapHorizIcon = React.lazy(() => import('@mui/icons-material/SwapHoriz'));
const LazyInfoIcon = React.lazy(() => import('@mui/icons-material/Info'));
const LazyWarningIcon = React.lazy(() => import('@mui/icons-material/Warning'));
const LazyCheckCircleIcon = React.lazy(() => import('@mui/icons-material/CheckCircle'));
const LazyHelpIcon = React.lazy(() => import('@mui/icons-material/HelpOutline'));

// Icon wrapper component with fallback
const IconWrapper: React.FC<{ icon: React.ComponentType<any>; sx?: any }> = ({ icon: Icon, sx }) => (
  <Suspense fallback={<Box sx={{ width: 24, height: 24, ...sx }} />}>
    <Icon sx={sx} />
  </Suspense>
);

interface RefinanceInputs {
  currentLoanBalance: number;
  currentInterestRate: number;
  currentMonthlyPayment: number;
  remainingTerm: number;
  propertyValue: number;
  creditScore: number;
  refinanceLtv: number;
  newInterestRate: number;
  newTerm: number;
  closingCostsPercent: number;
  cashOutAmount: number;
  cashInAmount: number;
}

interface RefinanceScenario {
  type: "rate-and-term" | "cash-out" | "cash-in";
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  newMonthlyPayment: number;
  monthlySavings: number;
  totalSavings: number;
  breakEvenMonths: number;
  cashFlow: number;
  ltv: number;
}

interface MarketRates {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

const ComprehensiveRefinanceCalculator: React.FC<{
  onResultsChange?: (results: any) => void;
}> = ({ onResultsChange = () => {} }) => {
  const [inputs, setInputs] = useState<RefinanceInputs>({
    currentLoanBalance: 200000,
    currentInterestRate: 6.5,
    currentMonthlyPayment: 1264,
    remainingTerm: 300,
    propertyValue: 250000,
    creditScore: 750,
    refinanceLtv: 70,
    newInterestRate: 5.5,
    newTerm: 30,
    closingCostsPercent: 3,
    cashOutAmount: 0,
    cashInAmount: 0,
  });

  const [activeTab, setActiveTab] = useState(0);

  // Simplified calculations for demo
  const monthlySavings = inputs.currentMonthlyPayment - (inputs.currentLoanBalance * (inputs.newInterestRate / 100) / 12);
  const totalSavings = monthlySavings * 12;
  const closingCosts = inputs.currentLoanBalance * (inputs.closingCostsPercent / 100);
  const breakEvenMonths = closingCosts / monthlySavings;

  const handleInputChange = (field: keyof RefinanceInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <IconWrapper icon={LazySwapHorizIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
        Refinance Calculator
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <IconWrapper icon={LazyAccountBalanceIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
              Current Loan Details
            </Typography>
            
            <TextField
              fullWidth
              label="Current Loan Balance"
              type="number"
              value={inputs.currentLoanBalance}
              onChange={(e) => handleInputChange('currentLoanBalance', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Current Interest Rate"
              type="number"
              value={inputs.currentInterestRate}
              onChange={(e) => handleInputChange('currentInterestRate', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Current Monthly Payment"
              type="number"
              value={inputs.currentMonthlyPayment}
              onChange={(e) => handleInputChange('currentMonthlyPayment', Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <IconWrapper icon={LazyTrendingUpIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
              New Loan Details
            </Typography>
            
            <TextField
              fullWidth
              label="New Interest Rate"
              type="number"
              value={inputs.newInterestRate}
              onChange={(e) => handleInputChange('newInterestRate', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="New Term (years)"
              type="number"
              value={inputs.newTerm}
              onChange={(e) => handleInputChange('newTerm', Number(e.target.value))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Closing Costs (%)"
              type="number"
              value={inputs.closingCostsPercent}
              onChange={(e) => handleInputChange('closingCostsPercent', Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>
      </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <IconWrapper icon={LazyShowChartIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
              Refinance Analysis
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {formatCurrency(monthlySavings.toString())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Savings
                </Typography>
              </Box>
              
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {formatCurrency(totalSavings.toString())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual Savings
                </Typography>
              </Box>
              
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {formatCurrency(closingCosts.toString())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Closing Costs
                </Typography>
              </Box>
              
              <Box textAlign="center">
                <Typography variant="h6" color="primary">
                  {breakEvenMonths.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Break-Even (months)
                </Typography>
              </Box>
            </Box>

              {breakEvenMonths > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <IconWrapper icon={LazyInfoIcon} sx={{ mr: 1, verticalAlign: 'middle' }} />
                  You'll break even on closing costs in {breakEvenMonths.toFixed(1)} months.
                </Alert>
              )}
            </CardContent>
          </Card>
      </Box>
  );
};

export default ComprehensiveRefinanceCalculator;
