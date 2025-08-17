import React, { useState, useMemo } from "react";
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
  Grid,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import { formatCurrency } from "./UXComponents";
import { brandColors } from "../theme";

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
}> = ({ onResultsChange }) => {
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

  const [activeScenario, setActiveScenario] = useState<
    "rate-and-term" | "cash-out" | "cash-in"
  >("rate-and-term");

  // Market rate data (mock - in production this would come from API)
  const marketRates: MarketRates = {
    excellent: 5.25,
    good: 5.5,
    fair: 6.0,
    poor: 7.0,
  };

  // Calculate monthly payment
  const calculateMonthlyPayment = (
    principal: number,
    rate: number,
    term: number,
  ): number => {
    if (rate === 0) return principal / term;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;
    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };

  // Calculate refinance scenarios
  const scenarios = useMemo((): RefinanceScenario[] => {
    const closingCosts =
      inputs.currentLoanBalance * (inputs.closingCostsPercent / 100);

    // Rate and term refinance
    const rateTermLoan = inputs.currentLoanBalance;
    const rateTermPayment = calculateMonthlyPayment(
      rateTermLoan,
      inputs.newInterestRate,
      inputs.newTerm * 12,
    );
    const rateTermSavings = inputs.currentMonthlyPayment - rateTermPayment;
    const rateTermBreakEven = closingCosts / rateTermSavings;

    // Cash-out refinance
    const cashOutLoan = Math.min(
      inputs.propertyValue * (inputs.refinanceLtv / 100),
      inputs.currentLoanBalance + inputs.cashOutAmount,
    );
    const cashOutPayment = calculateMonthlyPayment(
      cashOutLoan,
      inputs.newInterestRate,
      inputs.newTerm * 12,
    );
    const cashOutSavings = inputs.currentMonthlyPayment - cashOutPayment;
    const cashOutBreakEven = closingCosts / cashOutSavings;

    // Cash-in refinance
    const cashInLoan = Math.max(
      0,
      inputs.currentLoanBalance - inputs.cashInAmount,
    );
    const cashInPayment = calculateMonthlyPayment(
      cashInLoan,
      inputs.newInterestRate,
      inputs.newTerm * 12,
    );
    const cashInSavings = inputs.currentMonthlyPayment - cashInPayment;
    const cashInBreakEven = closingCosts / cashInSavings;

    return [
      {
        type: "rate-and-term",
        name: "Rate & Term Refinance",
        description: "Lower your interest rate and/or change your loan term",
        pros: [
          "Lower monthly payment",
          "Lower total interest paid",
          "No cash required",
        ],
        cons: ["No equity access", "Closing costs to consider"],
        newMonthlyPayment: rateTermPayment,
        monthlySavings: rateTermSavings,
        totalSavings: rateTermSavings * inputs.newTerm * 12,
        breakEvenMonths: rateTermBreakEven,
        cashFlow: rateTermSavings,
        ltv: (rateTermLoan / inputs.propertyValue) * 100,
      },
      {
        type: "cash-out",
        name: "Cash-Out Refinance",
        description:
          "Access your property equity for other investments or expenses",
        pros: [
          "Access to equity",
          "Lower rate possible",
          "Tax-deductible interest",
        ],
        cons: [
          "Higher loan balance",
          "Higher monthly payment",
          "Closing costs",
        ],
        newMonthlyPayment: cashOutPayment,
        monthlySavings: cashOutSavings,
        totalSavings: cashOutSavings * inputs.newTerm * 12,
        breakEvenMonths: cashOutBreakEven,
        cashFlow: cashOutSavings + inputs.cashOutAmount / (inputs.newTerm * 12),
        ltv: (cashOutLoan / inputs.propertyValue) * 100,
      },
      {
        type: "cash-in",
        name: "Cash-In Refinance",
        description:
          "Put money into your property to lower LTV and get better rates",
        pros: ["Lower LTV", "Better rates", "Lower monthly payment"],
        cons: ["Requires cash", "Opportunity cost", "Closing costs"],
        newMonthlyPayment: cashInPayment,
        monthlySavings: cashInSavings,
        totalSavings: cashInSavings * inputs.newTerm * 12,
        breakEvenMonths: cashInBreakEven,
        cashFlow: cashInSavings,
        ltv: (cashInLoan / inputs.propertyValue) * 100,
      },
    ];
  }, [inputs]);

  // Calculate NPV and IRR
  const npv = useMemo(() => {
    const closingCosts =
      inputs.currentLoanBalance * (inputs.closingCostsPercent / 100);
    const monthlySavings =
      scenarios.find((s) => s.type === activeScenario)?.monthlySavings || 0;
    const discountRate = 0.05; // 5% discount rate

    let npv = -closingCosts;
    for (let month = 1; month <= inputs.newTerm * 12; month++) {
      npv += monthlySavings / Math.pow(1 + discountRate / 12, month);
    }
    return npv;
  }, [inputs, scenarios, activeScenario]);

  // Calculate risk score
  const riskScore = useMemo(() => {
    let score = 0;

    // LTV risk
    if (inputs.refinanceLtv > 80) score += 3;
    else if (inputs.refinanceLtv > 70) score += 2;
    else if (inputs.refinanceLtv > 60) score += 1;

    // Credit score risk
    if (inputs.creditScore < 650) score += 3;
    else if (inputs.creditScore < 700) score += 2;
    else if (inputs.creditScore < 750) score += 1;

    // Rate difference risk
    const rateDiff = inputs.currentInterestRate - inputs.newInterestRate;
    if (rateDiff < 0.5) score += 2;
    else if (rateDiff < 1.0) score += 1;

    // Property value risk
    const currentLtv = (inputs.currentLoanBalance / inputs.propertyValue) * 100;
    if (currentLtv > 80) score += 2;
    else if (currentLtv > 70) score += 1;

    return Math.min(score, 10);
  }, [inputs]);

  const handleInputChange = (field: keyof RefinanceInputs, value: number) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);

    // Auto-update new interest rate based on credit score
    if (field === "creditScore") {
      let newRate = marketRates.poor;
      if (value >= 800) newRate = marketRates.excellent;
      else if (value >= 740) newRate = marketRates.good;
      else if (value >= 670) newRate = marketRates.fair;
      newInputs.newInterestRate = newRate;
      setInputs(newInputs);
    }
  };

  const selectedScenario = scenarios.find((s) => s.type === activeScenario);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: brandColors.primary, mb: 2 }}
      >
        Comprehensive Refinance Analysis
      </Typography>

      {/* Input Section */}
      <Card sx={{ borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 3 }}
          >
            Current Loan & Property Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Current Loan Balance"
                value={inputs.currentLoanBalance}
                onChange={(e) =>
                  handleInputChange(
                    "currentLoanBalance",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Property Value"
                value={inputs.propertyValue}
                onChange={(e) =>
                  handleInputChange(
                    "propertyValue",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Current Interest Rate (%)"
                value={inputs.currentInterestRate}
                onChange={(e) =>
                  handleInputChange(
                    "currentInterestRate",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Current Monthly Payment"
                value={inputs.currentMonthlyPayment}
                onChange={(e) =>
                  handleInputChange(
                    "currentMonthlyPayment",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Credit Score"
                value={inputs.creditScore}
                onChange={(e) =>
                  handleInputChange(
                    "creditScore",
                    parseInt(e.target.value) || 0,
                  )
                }
                helperText="Auto-updates new interest rate"
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="New Interest Rate (%)"
                value={inputs.newInterestRate}
                onChange={(e) =>
                  handleInputChange(
                    "newInterestRate",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Refinance LTV (%)"
                value={inputs.refinanceLtv}
                onChange={(e) =>
                  handleInputChange(
                    "refinanceLtv",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                helperText="Maximum loan-to-value ratio"
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Closing Costs (%)"
                value={inputs.closingCostsPercent}
                onChange={(e) =>
                  handleInputChange(
                    "closingCostsPercent",
                    parseFloat(e.target.value) || 0,
                  )
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                helperText="Typical range: 2-5%"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Refinance Scenarios */}
      <Card sx={{ borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 3 }}
          >
            Refinance Scenarios Comparison
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              mb: 3,
            }}
          >
            {scenarios.map((scenario) => (
              <Box key={scenario.type}>
                <Button
                  variant={
                    activeScenario === scenario.type ? "contained" : "outlined"
                  }
                  fullWidth
                  onClick={() => setActiveScenario(scenario.type)}
                  sx={{
                    height: 80,
                    flexDirection: "column",
                    gap: 1,
                    bgcolor:
                      activeScenario === scenario.type
                        ? brandColors.primary
                        : "transparent",
                    color:
                      activeScenario === scenario.type ? brandColors.backgrounds.primary : brandColors.primary,
                    "&:hover": {
                      bgcolor:
                        activeScenario === scenario.type
                          ? brandColors.primary
                          : brandColors.neutral.light,
                    },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {scenario.name}
                  </Typography>
                  <Typography variant="caption" sx={{ textAlign: "center" }}>
                    {scenario.description}
                  </Typography>
                </Button>
              </Box>
            ))}
          </Box>

          {selectedScenario && (
            <Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`Monthly Savings: ${formatCurrency(selectedScenario.monthlySavings.toString())}`}
                  color={
                    selectedScenario.monthlySavings > 0 ? "success" : "error"
                  }
                />
                <Chip
                  icon={<TimelineIcon />}
                  label={`Break-even: ${selectedScenario.breakEvenMonths.toFixed(1)} months`}
                  color={
                    selectedScenario.breakEvenMonths < 24
                      ? "success"
                      : "warning"
                  }
                />
                <Chip
                  icon={<AccountBalanceIcon />}
                  label={`New LTV: ${selectedScenario.ltv.toFixed(1)}%`}
                  color={
                    selectedScenario.ltv < 70
                      ? "success"
                      : selectedScenario.ltv < 80
                        ? "warning"
                        : "error"
                  }
                />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Pros:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {selectedScenario.pros.map((pro, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleIcon
                          sx={{ color: brandColors.accent.success, fontSize: 20 }}
                        />
                        <Typography variant="body2">{pro}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    Cons:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {selectedScenario.cons.map((con, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <WarningIcon sx={{ color: "#d32f2f", fontSize: 20 }} />
                        <Typography variant="body2">{con}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Advanced Analysis */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        {/* Financial Metrics */}
        <Box>
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid brandColors.borders.secondary",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: brandColors.primary, mb: 3 }}
              >
                Financial Metrics
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Net Present Value:</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: npv > 0 ? brandColors.accent.success : "#d32f2f",
                    }}
                  >
                    {formatCurrency(npv.toString())}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">
                    Total Savings (30 years):
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: brandColors.accent.success }}
                  >
                    {formatCurrency(
                      (selectedScenario?.totalSavings || 0).toString(),
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Closing Costs:</Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#d32f2f" }}
                  >
                    {formatCurrency(
                      (
                        inputs.currentLoanBalance *
                        (inputs.closingCostsPercent / 100)
                      ).toString(),
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Risk Analysis */}
        <Box>
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid brandColors.borders.secondary",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: brandColors.primary, mb: 3 }}
              >
                Risk Analysis
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Risk Score:</Typography>
                  <Chip
                    label={`${riskScore}/10`}
                    color={
                      riskScore <= 3
                        ? "success"
                        : riskScore <= 6
                          ? "warning"
                          : "error"
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Current LTV:</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color:
                        (inputs.currentLoanBalance / inputs.propertyValue) *
                          100 >
                        80
                          ? "#d32f2f"
                          : brandColors.accent.success,
                    }}
                  >
                    {(
                      (inputs.currentLoanBalance / inputs.propertyValue) *
                      100
                    ).toFixed(1)}
                    %
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">Credit Rating:</Typography>
                  <Chip
                    label={
                      inputs.creditScore >= 800
                        ? "Excellent"
                        : inputs.creditScore >= 740
                          ? "Good"
                          : inputs.creditScore >= 670
                            ? "Fair"
                            : "Poor"
                    }
                    color={
                      inputs.creditScore >= 740
                        ? "success"
                        : inputs.creditScore >= 670
                          ? "warning"
                          : "error"
                    }
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Market Intelligence & Strategy */}
      <Card sx={{ borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 3 }}
          >
            Market Intelligence & Strategy
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Current Market Rates by Credit Score:
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Credit Score</TableCell>
                    <TableCell>Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>800+ (Excellent)</TableCell>
                    <TableCell>{marketRates.excellent}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>740-799 (Good)</TableCell>
                    <TableCell>{marketRates.good}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>670-739 (Fair)</TableCell>
                    <TableCell>{marketRates.fair}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Below 670 (Poor)</TableCell>
                    <TableCell>{marketRates.poor}%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Refinance Strategy Recommendations:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {riskScore <= 3 && (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    Excellent refinance candidate - proceed with confidence
                  </Alert>
                )}
                {riskScore > 3 && riskScore <= 6 && (
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    Moderate risk - consider improving credit score or LTV first
                  </Alert>
                )}
                {riskScore > 6 && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    High risk - focus on improving financial position before
                    refinancing
                  </Alert>
                )}

                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Best time to refinance: When rates are 0.5%+ lower than
                  current
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Seasonal timing: Rates typically lowest in winter months
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Rate lock strategy: Lock rates when you're 30-45 days from
                  closing
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Documentation & Compliance */}
      <Card sx={{ borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: brandColors.primary, mb: 3 }}
          >
            Documentation & Compliance Checklist
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Required Documents:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  "Income verification (W-2s, pay stubs)",
                  "Asset statements (bank accounts, investments)",
                  "Property insurance information",
                  "Current mortgage statement",
                  "Property tax information",
                  "Credit report authorization",
                ].map((doc, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <CheckCircleIcon sx={{ color: brandColors.accent.success, fontSize: 20 }} />
                    <Typography variant="body2">{doc}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Timeline Planning:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Application to approval: 2-3 weeks
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Rate lock period: 30-60 days
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Closing preparation: 1-2 weeks
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Total timeline: 4-6 weeks
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Compliance Requirements:
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Owner-occupied: 6-month seasoning requirement
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Investment properties: 12-month seasoning requirement
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                  • Maximum LTV: 80% for investment properties
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComprehensiveRefinanceCalculator;
