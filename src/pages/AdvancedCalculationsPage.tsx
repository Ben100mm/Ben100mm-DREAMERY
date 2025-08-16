import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Divider,
  Card,
  CardContent,
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
  CircularProgress,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { brandColors } from "../theme";
import MuiAlert from "@mui/material/Alert";
import {
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Calculate as CalculateIcon,
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon,
  SwapHoriz as SwapHorizIcon,
  ShowChart as ShowChartIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Person as PersonIcon,
  HelpOutline as HelpIcon,
  Undo as UndoIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
import {
  AdvancedAnalysisDashboard,
  SeasonalAdjustmentsCalculator,
  MarketConditionsCalculator,
  ExitStrategiesCalculator,
  RiskAnalysisCalculator,
  TaxImplicationsCalculator,
  RefinanceScenariosCalculator,
  SensitivityAnalysisCalculator,
  StressTestingCalculator,
  InflationAdjustmentsCalculator,
  CompletionProgress,
  HelpTooltip,
  StatusChip,
} from "../components";
import { useNavigate } from "react-router-dom";
import {
  calculateExitStrategies,
  calculateTaxImplications,
  calculateConfidenceIntervals,
  calculateRiskScore,
  calculateInflationAdjustments,
  defaultMarketConditions,
  defaultSeasonalFactors,
  defaultLocationFactors,
  defaultMarketConditionsSimple,
  defaultRiskFactors,
  defaultTaxImplications,
  defaultPropertyAgeFactors,
  defaultExitStrategies,
} from "../utils/advancedCalculations";
import { type DealState } from "../types/deal";
import { formatCurrency } from "../components/UXComponents";
import {
  LineChart,
  LineSeriesType,
  BarChart,
  BarSeriesType,
  PieChart,
  PieSeriesType,
} from "@mui/x-charts";
import { useAuth } from "../contexts/AuthContext";
import {
  saveDealToCloud,
  loadDealsFromCloud,
  deleteDealFromCloud,
} from "../firebase/services";
import { AuthModal } from "../components/AuthModal";
import { GuidedTour } from "../components/GuidedTour";
import { GlobalConfigTab } from "../components/GlobalConfigTab";
import { ResultsSummary } from "../components/ResultsSummary";
import { FeaturesOverview } from "../components/FeaturesOverview";
import { ExitStrategiesTab } from "../components/ExitStrategiesTab";
import { RiskAnalysisTab } from "../components/RiskAnalysisTab";
import { ScenarioComparisonTab } from "../components/ScenarioComparisonTab";
import { OverviewTab } from "../components/OverviewTab";
import {
  CalculatorResults,
  PartialCalculatorResults,
} from "../types/calculations";
import {
  createTabConfig,
  DEFAULT_COLOR,
  DEFAULT_SPACING,
  CARD_BACKGROUND,
  ALERT_BACKGROUND,
} from "../constants/advancedCalcConstants";

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`advanced-calc-tabpanel-${index}`}
      aria-labelledby={`advanced-calc-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AdvancedCalculationsPage: React.FC = () => {
  // ============================================================================
  // STATE AND HOOKS
  // ============================================================================

  const [tabValue, setTabValue] = useState(0);
  const [configsComplete, setConfigsComplete] = useState(false);
  const [showConfigSuccess, setShowConfigSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showTour, setShowTour] = useState(true);
  const [allResults, setAllResults] = useState<PartialCalculatorResults>({});
  const [dealState, setDealState] = useState<DealState | null>(null);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [scenarios, setScenarios] = useState<
    {
      name: string;
      results: PartialCalculatorResults;
      timestamp?: string;
      dealState?: DealState | null;
    }[]
  >([]);

  // ============================================================================
  // ONBOARDING TOUR STEPS
  // ============================================================================

  const tourSteps = [
    {
      target: "config-status-alert",
      content:
        "Welcome to Advanced Analysis. Begin by completing the Global Configuration to unlock comprehensive financial modeling capabilities.",
      placement: "bottom",
    },
    {
      target: "guided-tour-button",
      content:
        "Access comprehensive guidance and support through our interactive tour system.",
      placement: "bottom",
    },
    {
      target: "completion-progress",
      content:
        "Monitor your analysis completion status and track progress across all modules.",
      placement: "top",
    },
    {
      target: "stepper-navigation",
      content:
        "Navigate seamlessly between analysis modules using our intuitive step-by-step interface.",
      placement: "bottom",
    },
    {
      target: "floating-config-button",
      content:
        "Efficiently access configuration settings from any analysis module.",
      placement: "left",
    },
    {
      target: "undo-button",
      content:
        "Maintain data integrity with our comprehensive undo and reset functionality.",
      placement: "top",
    },
  ];

  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [showTourTooltip, setShowTourTooltip] = useState(false);

  // Undo/Reset functionality
  const [dealHistory, setDealHistory] = useState<DealState[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [cloudDeals, setCloudDeals] = useState<Record<string, any>>({});
  const [cloudLoading, setCloudLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentDealId, setCurrentDealId] = useState<string | null>(null);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  // ============================================================================
  // EFFECTS AND SIDE EFFECTS
  // ============================================================================

  // Load saved deal state, results, and scenarios from sessionStorage on component mount
  useEffect(() => {
    // Load saved deal state
    const savedDeal = sessionStorage.getItem("advancedDeal");
    if (savedDeal) {
      try {
        const parsedDeal = JSON.parse(savedDeal);
        setDealState(parsedDeal);
        setShowConfiguration(true);
        // Initialize history with the loaded state
        setDealHistory([{ ...parsedDeal }]);
        setCanUndo(false);
        setCanReset(false);
        console.log("Deal state loaded from sessionStorage");
      } catch (error) {
        console.error("Failed to parse saved deal state:", error);
        sessionStorage.removeItem("advancedDeal"); // Clear invalid data
      }
    }

    // Load saved calculation results
    const savedResults = sessionStorage.getItem("advancedResults");
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setAllResults(parsedResults);
        console.log("Calculation results loaded from sessionStorage");
      } catch (error) {
        console.error("Failed to parse saved calculation results:", error);
        sessionStorage.removeItem("advancedResults"); // Clear invalid data
      }
    }

    // Load saved scenarios
    const savedScenarios = sessionStorage.getItem("advancedScenarios");
    if (savedScenarios) {
      try {
        const parsedScenarios = JSON.parse(savedScenarios);
        setScenarios(parsedScenarios);
        console.log("Scenarios loaded from sessionStorage");
      } catch (error) {
        console.error("Failed to parse saved scenarios:", error);
        sessionStorage.removeItem("advancedScenarios"); // Clear invalid data
      }
    }
  }, []);

  // Auto-calculate Exit Strategies when exit strategies or purchase price changes
  useEffect(() => {
    if (dealState) {
      const results = calculateExitStrategies(
        dealState?.purchasePrice || 300000,
        dealState?.exitStrategies || defaultExitStrategies,
        dealState?.purchasePrice || 300000,
      );
      updateDealState({ exitStrategyResults: results });
      handleResultsChange("exit", results);
    }
  }, [dealState?.exitStrategies, dealState?.purchasePrice]);

  // Auto-calculate Risk Score when risk factors, market conditions, or property age changes
  useEffect(() => {
    if (dealState) {
      const financingDetails = getFinancingDetails() || undefined;
      const results = calculateRiskScore(
        dealState?.riskFactors || defaultRiskFactors,
        dealState?.marketConditions || defaultMarketConditionsSimple,
        dealState?.propertyAge || defaultPropertyAgeFactors,
        financingDetails,
      );
      updateDealState({ riskScoreResults: results });
      handleResultsChange("risk", results);
    }
  }, [
    dealState?.riskFactors,
    dealState?.marketConditions,
    dealState?.propertyAge,
    dealState?.offerType,
    dealState?.loan,
    dealState?.subjectTo,
    dealState?.hybrid,
  ]);

  // Auto-calculate Tax Implications when tax implications, purchase price, or revenue inputs change
  useEffect(() => {
    if (dealState) {
      // Calculate annual income from revenue inputs or estimate from purchase price
      let annualIncome = 0;
      if (
        dealState.revenueInputs &&
        dealState.revenueInputs.totalRooms > 0 &&
        dealState.revenueInputs.averageDailyRate > 0
      ) {
        // Use actual revenue inputs for hotels/STR
        annualIncome =
          dealState.revenueInputs.totalRooms *
          dealState.revenueInputs.averageDailyRate *
          (dealState.revenueInputs.occupancyRate / 100) *
          365;
      } else {
        // Estimate from purchase price (typical 1% rule)
        annualIncome = (dealState.purchasePrice || 0) * 0.12; // 12% annual return estimate
      }

      // Estimate property expenses for tax calculations
      const propertyExpenses = {
        mortgageInterest: (dealState.loan?.monthlyPayment || 0) * 12 * 0.7, // Assume 70% of payment is interest
        propertyTax: (dealState.proForma?.taxes || 0) * 12,
        depreciation: (dealState.purchasePrice || 0) * 0.036, // 3.6% annual depreciation for residential
        repairs: (dealState.proForma?.maintenance || 0) * 12,
      };

      const results = calculateTaxImplications(
        annualIncome,
        propertyExpenses,
        dealState.taxImplications,
      );
      updateDealState({ taxImplicationResults: results });
      handleResultsChange("tax", results);
    }
  }, [
    dealState?.taxImplications,
    dealState?.purchasePrice,
    dealState?.revenueInputs,
    dealState?.loan?.monthlyPayment,
    dealState?.proForma?.taxes,
    dealState?.proForma?.maintenance,
  ]);

  // Automated backup: Auto-save dealState to sessionStorage whenever it changes
  useEffect(() => {
    if (dealState) {
      try {
        sessionStorage.setItem("advancedDeal", JSON.stringify(dealState));
        console.log("Deal state automatically saved to sessionStorage");
      } catch (error) {
        console.error("Failed to auto-save deal state:", error);
      }
    }
  }, [dealState]);

  // Helper function to check configuration status
  const checkConfigurationStatus = (state: DealState | null) => {
    if (!state) return { isComplete: false, status: {} };

    const hasMarketConditions =
      !!state.marketConditions &&
      Object.keys(state.marketConditions).length > 0;
    const hasRiskFactors =
      !!state.riskFactors && Object.keys(state.riskFactors).length > 0;
    const hasExitStrategies =
      !!state.exitStrategies && state.exitStrategies.length > 0;
    const hasTaxImplications =
      !!state.taxImplications && Object.keys(state.taxImplications).length > 0;

    const isComplete =
      hasMarketConditions &&
      hasRiskFactors &&
      hasExitStrategies &&
      hasTaxImplications;

    return {
      isComplete,
      status: {
        hasMarketConditions,
        hasRiskFactors,
        hasExitStrategies,
        hasTaxImplications,
      },
    };
  };

  // Helper function to get financing details including balloon payment terms
  const getFinancingDetails = () => {
    if (!dealState) return null;

    const hasBalloonPayment = (loan: any) => {
      return loan?.balloonDue && loan.balloonDue > 0;
    };

    switch (dealState.offerType) {
      case "Seller Finance":
        return {
          type: "Seller Finance",
          monthlyPayment: dealState.loan?.monthlyPayment || 0,
          annualPayment: (dealState.loan?.monthlyPayment || 0) * 12,
          balloonPayment: hasBalloonPayment(dealState.loan)
            ? dealState.loan.loanAmount
            : 0,
          balloonDueYears: dealState.loan?.balloonDue || 0,
          interestOnly: dealState.loan?.interestOnly || false,
          totalLoanAmount: dealState.loan?.loanAmount || 0,
        };

      case "Subject To Existing Mortgage":
        const subjectToLoans = dealState.subjectTo?.loans || [];
        const totalBalloonPayment = subjectToLoans.reduce((total, loan) => {
          return total + (hasBalloonPayment(loan) ? loan.balance : 0);
        }, 0);
        const maxBalloonDueYears = Math.max(
          ...subjectToLoans.map((loan) => loan.balloonDue || 0),
        );

        return {
          type: "Subject To Existing Mortgage",
          monthlyPayment: dealState.subjectTo?.totalMonthlyPayment || 0,
          annualPayment: (dealState.subjectTo?.totalMonthlyPayment || 0) * 12,
          balloonPayment: totalBalloonPayment,
          balloonDueYears: maxBalloonDueYears,
          interestOnly: false, // Subject to loans are typically amortizing
          totalLoanAmount: dealState.subjectTo?.totalBalance || 0,
        };

      case "Hybrid":
        const hybridLoans = dealState.hybrid?.subjectToLoans || [];
        const hybridBalloonPayment =
          dealState.hybrid?.balloonDue && dealState.hybrid.balloonDue > 0
            ? dealState.hybrid.loanAmount
            : 0;
        const hybridMaxBalloonDueYears = Math.max(
          ...hybridLoans.map((loan: any) => loan.balloonDue || 0),
          dealState.hybrid?.balloonDue || 0,
        );

        return {
          type: "Hybrid",
          monthlyPayment:
            dealState.hybrid?.totalMonthlyPayment ||
            dealState.hybrid?.monthlyPayment ||
            0,
          annualPayment:
            (dealState.hybrid?.totalMonthlyPayment ||
              dealState.hybrid?.monthlyPayment ||
              0) * 12,
          balloonPayment: hybridBalloonPayment,
          balloonDueYears: hybridMaxBalloonDueYears,
          interestOnly: dealState.hybrid?.interestOnly || false,
          totalLoanAmount:
            dealState.hybrid?.totalLoanBalance ||
            dealState.hybrid?.loanAmount ||
            0,
        };

      default:
        return null;
    }
  };

  // Simple notification for configuration completion
  const showConfigurationSuccess = () => {
    // Just log the success - no visual effects
    console.log("Configuration completed successfully!");
  };

  // Check if basic configurations are complete to enable progressive disclosure
  useEffect(() => {
    const { isComplete, status } = checkConfigurationStatus(dealState);
    setConfigsComplete(isComplete);

    console.log("Configuration status:", status);
  }, [dealState]);

  // Auto-show onboarding tour on first load
  useEffect(() => {
    if (showTour) {
      // Delay showing the tour to ensure components are rendered
      const timer = setTimeout(() => {
        setShowTourTooltip(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showTour]);

  // Keyboard shortcuts for quick navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + 1: Go to Overview
      if ((event.ctrlKey || event.metaKey) && event.key === "1") {
        event.preventDefault();
        setTabValue(0);
      }
      // Ctrl/Cmd + 2: Go to Global Configuration
      if ((event.ctrlKey || event.metaKey) && event.key === "2") {
        event.preventDefault();
        setTabValue(1);
      }
      // Ctrl/Cmd + 3: Go to Seasonal & Market (if unlocked)
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "3" &&
        configsComplete
      ) {
        event.preventDefault();
        setTabValue(2);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [configsComplete]);

  // Automated backup: Auto-save calculation results to sessionStorage whenever they change
  useEffect(() => {
    if (Object.keys(allResults).length > 0) {
      try {
        sessionStorage.setItem("advancedResults", JSON.stringify(allResults));
        console.log(
          "Calculation results automatically saved to sessionStorage",
        );
      } catch (error) {
        console.error("Failed to auto-save calculation results:", error);
      }
    }
  }, [allResults]);

  // Automated backup: Auto-save scenarios to sessionStorage whenever they change
  useEffect(() => {
    if (scenarios.length > 0) {
      try {
        sessionStorage.setItem("advancedScenarios", JSON.stringify(scenarios));
        console.log("Scenarios automatically saved to sessionStorage");
      } catch (error) {
        console.error("Failed to auto-save scenarios:", error);
      }
    }
  }, [scenarios]);

  // ============================================================================
  // MARKET DATA AND API INTEGRATION
  // ============================================================================

  // Fetch real market data from API when deal state is available
  useEffect(() => {
    if (dealState) {
      const fetchMarketData = async () => {
        try {
          // Show loading state for market data
          updateDealState({
            marketDataLoading: true,
            marketDataError: null,
          });

          // Fetch market data from real estate data API
          // For now, using mock data since the real API endpoint doesn't exist
          // In production, this would be a real API call
          const mockData = {
            inflationRate: 0.025, // 2.5%
            appreciationRate: 0.04, // 4%
            rentGrowthRate: 0.03, // 3%
            capRate: 0.06, // 6%
            marketVolatility: 5,
          };

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Update market conditions with mock data
          updateDealState({
            marketConditions: {
              ...(dealState.marketConditions || defaultMarketConditionsSimple),
              inflationRate: mockData.inflationRate,
              appreciationRate: mockData.appreciationRate,
              rentGrowthRate: mockData.rentGrowthRate,
              capRate: mockData.capRate,
              marketVolatility: mockData.marketVolatility,
            },
            marketDataLoading: false,
            marketDataError: null,
            lastMarketDataUpdate: new Date().toISOString(),
          });

          console.log("Market data updated successfully:", mockData);
        } catch (error) {
          console.error("Failed to fetch market data:", error);

          // Fall back to defaults and show error state
          updateDealState({
            marketDataLoading: false,
            marketDataError:
              "Failed to fetch live market data. Using default values.",
            lastMarketDataUpdate: null,
          });
        }
      };

      // Fetch market data immediately
      fetchMarketData();

      // Set up interval to refresh market data every 30 minutes
      const intervalId = setInterval(fetchMarketData, 30 * 60 * 1000);

      // Cleanup interval on unmount or deal state change
      return () => clearInterval(intervalId);
    }
  }, [dealState?.city, dealState?.state, dealState?.propertyType]);

  // ============================================================================
  // HANDLERS AND EVENT FUNCTIONS
  // ============================================================================

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("Tab change requested:", {
      currentTab: tabValue,
      newTab: newValue,
    });
    setTabValue(newValue);
    console.log("Tab value set to:", newValue);
  };

  const handleResultsChange = <K extends keyof CalculatorResults>(
    calculatorType: K,
    results: CalculatorResults[K],
  ) => {
    setAllResults((prev) => ({
      ...prev,
      [calculatorType]: results,
    }));

    // Show success snackbar for calculation completion
    const calculatorNames: Record<string, string> = {
      exit: "Exit Strategies",
      risk: "Risk Analysis",
      tax: "Tax Implications",
      refinance: "Refinance Analysis",
      seasonal: "Seasonal Adjustments",
      market: "Market Conditions",
      sensitivity: "Sensitivity Analysis",
      inflation: "Inflation Adjustments",
      "comprehensive-refinance": "Comprehensive Refinance",
      scenario: "Scenario Comparison",
    };

    const calculatorName =
      calculatorNames[calculatorType as string] || calculatorType;
    setSnackbar({
      open: true,
      message: `${calculatorName} calculation completed`,
      severity: "success",
    });
  };

  const handleBackToUnderwrite = () => {
    console.log("handleBackToUnderwrite called");
    // Save any updated configuration back to sessionStorage
    if (dealState) {
      console.log("Saving dealState to sessionStorage");
      sessionStorage.setItem("advancedDeal", JSON.stringify(dealState));
    } else {
      console.log("No dealState to save");
    }
    console.log("Navigating to /underwrite");
    try {
      navigate("/underwrite");
    } catch (error) {
      console.error(
        "React Router navigation failed, trying direct navigation:",
        error,
      );
      window.location.href = "/underwrite";
    }
  };

  const updateDealState = (updates: Partial<DealState>) => {
    if (!dealState) return;

    // Save current state to history before updating
    setDealHistory((prev) => [...prev, { ...dealState }]);
    setCanUndo(true);
    setCanReset(true);

    // Add timestamp for when the deal was last modified
    const timestampedUpdates = {
      ...updates,
      lastModified: new Date().toISOString(),
    };

    // Update the deal state
    setDealState({ ...dealState, ...timestampedUpdates });

    // Check if configurations are now complete after update
    const updatedState = { ...dealState, ...timestampedUpdates };
    const { isComplete } = checkConfigurationStatus(updatedState);
    setConfigsComplete(isComplete);

    if (isComplete && !configsComplete) {
      console.log("All configurations complete! Advanced features unlocked.");
      // Show success notification and switch to first unlocked tab
      setTabValue(2); // Switch to first unlocked tab (Exit Strategies)

      // Show a temporary success message
      setTimeout(() => {
        // You could add a toast notification here
        console.log("Advanced analysis features are now available!");

        // Add a visual celebration effect
        const header = document.querySelector(
          '[data-testid="config-status-alert"]',
        ) as HTMLElement | null;
        if (header) {
          header.style.animation = "bounce 1s ease-in-out";
          setTimeout(() => {
            header.style.animation = "";
          }, 1000);
        }

        // Show confetti effect (you could add a confetti library here)
        console.log("Configuration complete! Time to celebrate!");

        // Auto-scroll to show the success message
        setTimeout(() => {
          const successAlert = document.querySelector(
            '[data-testid="config-status-alert"]',
          ) as HTMLElement | null;
          if (successAlert) {
            successAlert.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 1000);

        // Show success notification
        setShowConfigSuccess(true);
        setTimeout(() => setShowConfigSuccess(false), 5000); // Hide after 5 seconds

        // Show simple configuration success notification
        showConfigurationSuccess();

        // Show success snackbar
        setSnackbar({
          open: true,
          message: "All configurations complete! Advanced features unlocked.",
          severity: "success",
        });
      }, 500);
    }
  };

  // ============================================================================
  // UNDO/RESET FUNCTIONALITY
  // ============================================================================

  // Undo functionality
  const handleUndo = () => {
    if (dealHistory.length > 0) {
      const previousState = dealHistory[dealHistory.length - 1];
      setDealHistory(dealHistory.slice(0, -1));
      setDealState(previousState);
      setCanUndo(dealHistory.length > 1);
      setCanReset(true);

      setSnackbar({
        open: true,
        message: "Last change undone",
        severity: "info",
      });
    }
  };

  // Reset functionality
  const handleReset = () => {
    if (dealHistory.length > 0) {
      const initialState = dealHistory[0];
      setDealState(initialState);
      setDealHistory([initialState]);
      setCanUndo(false);
      setCanReset(false);

      setSnackbar({
        open: true,
        message: "Reset to initial state",
        severity: "info",
      });
    }
  };

  // Clear history when loading new deal
  const clearHistory = () => {
    setDealHistory([]);
    setCanUndo(false);
    setCanReset(false);
  };

  // ============================================================================
  // CLOUD FUNCTIONALITY
  // ============================================================================

  // Cloud save functionality
  const handleSaveToCloud = async () => {
    if (!dealState || !isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please sign in to save to cloud",
        severity: "error",
      });
      return;
    }

    setCloudLoading(true);
    try {
      const result = await saveDealToCloud(
        dealState,
        currentDealId || undefined,
      );
      if (result.success) {
        setCurrentDealId(result.dealId || null);
        await loadCloudDeals();
        setSnackbar({
          open: true,
          message: "Deal saved to cloud successfully",
          severity: "success",
        });
      } else {
        throw new Error(result.error || "Failed to save");
      }

      setSnackbar({
        open: true,
        message: "Deal saved to cloud successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to save to cloud:", error);
      setSnackbar({
        open: true,
        message: "Failed to save to cloud. Please try again.",
        severity: "error",
      });
    } finally {
      setCloudLoading(false);
    }
  };

  const loadCloudDeals = async () => {
    if (!isAuthenticated) return;

    setCloudLoading(true);
    try {
      const result = await loadDealsFromCloud();
      if (result.success) {
        setCloudDeals(result.deals || {});
      } else {
        console.error("Failed to load cloud deals:", result.error);
      }
    } catch (error: any) {
      console.error("Error loading cloud deals:", error);
    } finally {
      setCloudLoading(false);
    }
  };

  const handleLoadFromCloud = async (dealId: string) => {
    if (!isAuthenticated) return;

    setCloudLoading(true);
    try {
      const dealData = cloudDeals[dealId];
      if (dealData) {
        setDealState(dealData);
        setCurrentDealId(dealId);
        // Clear history and initialize with new deal
        clearHistory();
        setDealHistory([{ ...dealData }]);
        // Save to sessionStorage for persistence
        sessionStorage.setItem("advancedDeal", JSON.stringify(dealData));
        alert("Deal loaded from cloud successfully!");
      }
    } catch (error: any) {
      alert(`Error loading deal: ${error.message}`);
    } finally {
      setCloudLoading(false);
    }
  };

  const handleDeleteFromCloud = async (dealId: string) => {
    if (!isAuthenticated) return;

    if (
      window.confirm(
        "Are you sure you want to delete this deal from the cloud?",
      )
    ) {
      setCloudLoading(true);
      try {
        const result = await deleteDealFromCloud(dealId);
        if (result.success) {
          if (currentDealId === dealId) {
            setCurrentDealId(null);
          }
          await loadCloudDeals();
          alert("Deal deleted from cloud successfully!");
        } else {
          alert(`Failed to delete deal: ${result.error}`);
        }
      } catch (error: any) {
        alert(`Error deleting deal: ${error.message}`);
      } finally {
        setCloudLoading(false);
      }
    }
  };

  // Load cloud deals when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCloudDeals();
    }
  }, [isAuthenticated]);

  // ============================================================================
  // RENDER CONFIGURATION
  // ============================================================================

  // Tab configuration for the main interface
  const tabConfig = createTabConfig(
    dealState,
    updateDealState,
    handleResultsChange,
    isCalculating,
    setIsCalculating,
    scenarios,
    setScenarios,
    allResults,
    setAllResults,
    setTabValue,
    setSnackbar,
  );

  console.log(
    "Tab config created:",
    tabConfig.length,
    "tabs, current tabValue:",
    tabValue,
  );

  // ============================================================================
  // COMPLETION TRACKING
  // ============================================================================

  const completedCalculators = Object.keys(allResults).length;
  const totalCalculators = 9; // Total number of available calculators (including Scenario Comparison)

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: brandColors.backgrounds.primary,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ py: 2, minHeight: "100vh", transition: "all 0.3s ease-in-out" }}
      >
        {/* ============================================================================
           HEADER AND NAVIGATION
           ============================================================================ */}

        {/* Header with Back Button */}
        <Box sx={{ mb: 3 }}>
          {/* Main Header Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            {/* Left side: Title and Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: brandColors.primary }}
              >
                Advanced Analysis
              </Typography>
              {dealState && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    bgcolor: configsComplete ? brandColors.backgrounds.success : brandColors.backgrounds.warning,
                    borderRadius: 1,
                    border: `1px solid ${configsComplete ? brandColors.accent.success : brandColors.accent.warning}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: configsComplete ? brandColors.accent.success : brandColors.neutral.dark,
                      fontWeight: 600,
                    }}
                  >
                    {(() => {
                      const { status } = checkConfigurationStatus(dealState);
                      const completed =
                        Object.values(status).filter(Boolean).length;
                      return configsComplete
                        ? "Ready"
                        : `${completed}/4 Config`;
                    })()}
                  </Typography>

                  {/* Configuration Shortcut Button */}
                  {!configsComplete && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => setTabValue(1)}
                      sx={{
                        color: brandColors.neutral.dark,
                        textDecoration: "underline",
                        fontSize: "0.75rem",
                        minWidth: "auto",
                        px: 0.5,
                        ml: 1,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      Configure
                    </Button>
                  )}
                </Box>
              )}
            </Box>
            {/* Right side: Primary Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Last Market Data Update Indicator */}
              {dealState?.lastMarketDataUpdate && (
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
                    px: 2,
                    py: 0.75,
                    fontSize: "0.75rem",
                    "&.Mui-disabled": {
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      opacity: 0.8,
                    },
                  }}
                  startIcon={<span>-</span>}
                >
                  Market Data:{" "}
                  {new Date(dealState.lastMarketDataUpdate).toLocaleString()}
                </Button>
              )}

              {/* Market Data Loading Indicator */}
              {dealState?.marketDataLoading && (
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  sx={{
                    borderColor: brandColors.accent.warning,
                    color: brandColors.accent.warning,
                    px: 2,
                    py: 0.75,
                    fontSize: "0.75rem",
                    "&.Mui-disabled": {
                      borderColor: brandColors.accent.warning,
                      color: brandColors.accent.warning,
                      opacity: 0.8,
                    },
                  }}
                  startIcon={<span>-</span>}
                >
                  Updating Market Data...
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={() => setShowGuidedTour(true)}
                startIcon={<HelpIcon aria-label="Help" />}
                aria-label="Start Guided Tour"
                data-testid="guided-tour-button"
                sx={{
                  borderColor: brandColors.primary,
                  color: brandColors.primary,
                  px: 2,
                  py: 0.75,
                  "&:hover": { borderColor: brandColors.secondary, bgcolor: brandColors.backgrounds.hover },
                }}
              >
                Guided Tour
              </Button>

              <Button
                variant="outlined"
                disabled={false}
                onClick={() => {
                  console.log("Back to Underwrite button clicked");
                  // Save dealState if it exists
                  if (dealState) {
                    console.log("Saving dealState to sessionStorage");
                    sessionStorage.setItem(
                      "advancedDeal",
                      JSON.stringify(dealState),
                    );
                  }
                  // Use direct navigation since React Router navigate isn't working
                  console.log("Using direct navigation to /underwrite");
                  window.location.href = "/underwrite";
                }}
                aria-label="Return to Underwrite page"
                data-testid="back-to-underwrite-button"
                sx={{
                  borderColor: brandColors.primary,
                  color: brandColors.primary,
                  px: 2,
                  py: 0.75,
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 10,
                  "&:hover": {
                    borderColor: brandColors.secondary,
                    backgroundColor: brandColors.backgrounds.hover,
                  },
                  "&:active": {
                    backgroundColor: brandColors.backgrounds.selected,
                  },
                }}
              >
                Back to Underwrite
              </Button>
            </Box>
          </Box>

          {/* Secondary Actions Row */}
          {dealState && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* History Indicator */}
              {dealHistory.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    backgroundColor: brandColors.backgrounds.hover,
                    borderRadius: 1.5,
                    border: `1px solid ${brandColors.primary}`,
                    minHeight: 36,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: brandColors.primary, fontWeight: 500 }}
                  >
                    History: {dealHistory.length - 1} step
                    {dealHistory.length > 2 ? "s" : ""} available
                  </Typography>
                </Box>
              )}

              {/* Undo/Reset Controls */}
              <Button
                variant="outlined"
                onClick={handleUndo}
                disabled={!canUndo}
                startIcon={<UndoIcon aria-label="Undo" />}
                aria-label={
                  canUndo
                    ? `Undo last change (${dealHistory.length - 1} steps available)`
                    : "No changes to undo"
                }
                data-testid="undo-button"
                sx={{
                  borderColor: canUndo ? brandColors.primary : "#ccc",
                  color: canUndo ? brandColors.primary : "#ccc",
                  "&:hover": canUndo
                    ? { borderColor: brandColors.secondary, bgcolor: brandColors.backgrounds.hover }
                    : {},
                  minWidth: 80,
                  px: 2,
                  py: 0.75,
                  minHeight: 36,
                }}
              >
                Undo
              </Button>

              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={!canReset}
                startIcon={<RestartAltIcon aria-label="Reset" />}
                aria-label={
                  canReset
                    ? "Reset to initial state"
                    : "No initial state to reset to"
                }
                data-testid="reset-button"
                sx={{
                  borderColor: canReset ? brandColors.actions.error : "#ccc",
                  color: canReset ? brandColors.actions.error : "#ccc",
                  "&:hover": canReset
                    ? { borderColor: brandColors.actions.error, bgcolor: brandColors.backgrounds.error }
                    : {},
                  minWidth: 80,
                  px: 2,
                  py: 0.75,
                  minHeight: 36,
                }}
              >
                Reset
              </Button>
            </Box>
          )}
        </Box>

        {/* ============================================================================
           DEAL STATE STATUS
           ============================================================================ */}

        {/* Deal State Status */}
        {dealState ? (
          <Box>
            <Alert
              severity="success"
              sx={{ mb: 2, bgcolor: brandColors.backgrounds.hover, borderColor: brandColors.primary }}
              data-testid="deal-loaded-alert"
            >
              <Typography variant="body2" sx={{ color: brandColors.primary }}>
                <strong>Deal Loaded:</strong> {dealState.propertyType} property
                in {dealState.city}, {dealState.state} - $
                {dealState.purchasePrice?.toLocaleString()}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: brandColors.primary,
                  opacity: 0.8,
                  display: "block",
                  mt: 0.5,
                }}
              >
                Auto-save enabled - All changes are automatically backed up
              </Typography>
            </Alert>

            {/* Configuration Status Indicator */}
            {!configsComplete && (
              <Alert
                severity="info"
                sx={{ mb: 2, bgcolor: brandColors.backgrounds.hover, borderColor: brandColors.primary }}
                data-testid="config-status-alert"
              >
                <Typography variant="body2" sx={{ color: brandColors.primary, mb: 1 }}>
                  <strong>Configuration Required:</strong> Complete the Global
                  Configuration tab to unlock advanced analysis features.
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setTabValue(1)}
                    sx={{
                      ml: 1,
                      color: brandColors.primary,
                      textDecoration: "underline",
                      "&:hover": { bgcolor: "transparent" },
                    }}
                  >
                    Go to Configuration
                  </Button>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: brandColors.primary,
                    opacity: 0.8,
                    display: "block",
                    mb: 1,
                  }}
                >
                  Use Ctrl/Cmd + 2 to quickly jump to the Global Configuration
                  tab.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {(() => {
                    const { status } = checkConfigurationStatus(dealState);
                    return (
                      <>
                        <Chip
                          label="Market Conditions"
                          size="small"
                          color={
                            status.hasMarketConditions ? "success" : "default"
                          }
                          variant={
                            status.hasMarketConditions ? "filled" : "outlined"
                          }
                        />
                        <Chip
                          label="Risk Factors"
                          size="small"
                          color={status.hasRiskFactors ? "success" : "default"}
                          variant={
                            status.hasRiskFactors ? "filled" : "outlined"
                          }
                        />
                        <Chip
                          label="Exit Strategies"
                          size="small"
                          color={
                            status.hasExitStrategies ? "success" : "default"
                          }
                          variant={
                            status.hasExitStrategies ? "filled" : "outlined"
                          }
                        />
                        <Chip
                          label="Tax Implications"
                          size="small"
                          color={
                            status.hasTaxImplications ? "success" : "default"
                          }
                          variant={
                            status.hasTaxImplications ? "filled" : "outlined"
                          }
                        />
                      </>
                    );
                  })()}
                </Box>
              </Alert>
            )}

            {/* Configuration Success Notification */}
            {showConfigSuccess && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  bgcolor: brandColors.backgrounds.success,
                  borderColor: brandColors.accent.success,
                  animation: "slideIn 0.5s ease-out",
                  "@keyframes slideIn": {
                    "0%": { transform: "translateY(-20px)", opacity: 0 },
                    "100%": { transform: "translateY(0)", opacity: 1 },
                  },
                }}
                onClose={() => setShowConfigSuccess(false)}
              >
                <Typography variant="body2" sx={{ color: brandColors.accent.success }}>
                  <strong>Configuration Complete!</strong> All advanced analysis
                  features are now unlocked and ready to use.
                </Typography>
              </Alert>
            )}

            {/* Configuration Progress Indicator */}
            {!configsComplete && dealState && (
              <Box
                sx={{
                  mb: 2,
                  p: { xs: 1.5, md: 2 },
                  bgcolor: brandColors.backgrounds.secondary,
                  borderRadius: 2,
                  border: `1px solid ${brandColors.borders.secondary}`,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 2, sm: 2 },
                }}
              >
                <Box sx={{ flex: 1, width: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: brandColors.neutral.dark,
                      mb: 1,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    <strong>Configuration Progress:</strong> Complete these
                    steps to unlock advanced features
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: { xs: 1, sm: 1.5 },
                      flexWrap: "wrap",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "1fr 1fr 1fr 1fr",
                      },
                    }}
                  >
                    {(() => {
                      const { status } = checkConfigurationStatus(dealState);
                      return (
                        <>
                          <Chip
                            label="Market"
                            size="small"
                            color={
                              status.hasMarketConditions ? "success" : "default"
                            }
                            variant={
                              status.hasMarketConditions ? "filled" : "outlined"
                            }
                            icon={
                              status.hasMarketConditions ? (
                                <span>Complete</span>
                              ) : (
                                <span>LOCK</span>
                              )
                            }
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          />
                          <Chip
                            label="Risk"
                            size="small"
                            color={
                              status.hasRiskFactors ? "success" : "default"
                            }
                            variant={
                              status.hasRiskFactors ? "filled" : "outlined"
                            }
                            icon={
                              status.hasRiskFactors ? (
                                <span>Complete</span>
                              ) : (
                                <span>LOCK</span>
                              )
                            }
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          />
                          <Chip
                            label="Exit"
                            size="small"
                            color={
                              status.hasExitStrategies ? "success" : "default"
                            }
                            variant={
                              status.hasExitStrategies ? "filled" : "outlined"
                            }
                            icon={
                              status.hasExitStrategies ? (
                                <span>Complete</span>
                              ) : (
                                <span>LOCK</span>
                              )
                            }
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          />
                          <Chip
                            label="Tax"
                            size="small"
                            color={
                              status.hasTaxImplications ? "success" : "default"
                            }
                            variant={
                              status.hasTaxImplications ? "filled" : "outlined"
                            }
                            icon={
                              status.hasTaxImplications ? (
                                <span>Complete</span>
                              ) : (
                                <span>LOCK</span>
                              )
                            }
                            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                          />
                        </>
                      );
                    })()}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setTabValue(1)}
                  sx={{
                    bgcolor: brandColors.primary,
                    "&:hover": { bgcolor: brandColors.secondary },
                    minWidth: { xs: "100%", sm: "120px" },
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Complete Config
                </Button>
              </Box>
            )}

            {/* ============================================================================
               DESCRIPTION CARD
               ============================================================================ */}

            {/* Rest of the content: Card for description, CompletionProgress, Alert for new features, Tabs, Summary, Features, Integration */}
            <Card
              sx={{
                borderRadius: 2,
                border: "1px solid brandColors.borders.secondary",
                transition: "all 0.3s ease-in-out",
                minHeight: "fit-content",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* ============================================================================
                   DESCRIPTION TEXT
                   ============================================================================ */}

                <Typography variant="body1" sx={{ mb: 4, color: brandColors.neutral.dark }}>
                  Comprehensive financial analysis tools with seasonal
                  adjustments, market factors, exit strategies, tax
                  implications, refinance scenarios, sensitivity analysis,
                  stress testing, and inflation adjustments.
                </Typography>

                {/* Financing Details Section */}
                {dealState && getFinancingDetails() && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: brandColors.backgrounds.warning,
                      borderRadius: 1,
                      border: "1px solid brandColors.accent.warning",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: brandColors.neutral.dark, mb: 2 }}
                    >
                      Financing Details & Balloon Payment Integration
                    </Typography>
                    {(() => {
                      const financing = getFinancingDetails();
                      if (!financing) return null;

                      return (
                        <Box
                          sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: brandColors.neutral.dark }}
                            >
                              {financing.type}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: brandColors.neutral.dark }}
                            >
                              <strong>Monthly Payment:</strong> $
                              {financing.monthlyPayment.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: brandColors.neutral.dark }}
                            >
                              <strong>Total Loan Amount:</strong> $
                              {financing.totalLoanAmount.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box>
                            {financing.balloonPayment > 0 && (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 600, color: "#d32f2f" }}
                                >
                                  ⚠️ Balloon Payment Due
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#d32f2f" }}
                                >
                                  <strong>Balloon Amount:</strong> $
                                  {financing.balloonPayment.toLocaleString()}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#d32f2f" }}
                                >
                                  <strong>Due In:</strong>{" "}
                                  {financing.balloonDueYears} years
                                </Typography>
                              </>
                            )}
                            {financing.interestOnly && (
                              <Typography
                                variant="body2"
                                sx={{ color: brandColors.neutral.dark }}
                              >
                                <strong>Interest Only:</strong> Yes
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })()}
                    <Typography
                      variant="caption"
                      sx={{
                        color: brandColors.neutral.dark,
                        fontStyle: "italic",
                        display: "block",
                        mt: 1,
                      }}
                    >
                      Balloon payment terms are now fully integrated for
                      advanced financial modeling, risk analysis, and exit
                      strategy planning.
                    </Typography>
                  </Box>
                )}

                {/* Configuration Guide */}
                {!configsComplete && (
                  <Alert
                    severity="info"
                    sx={{ mb: 3, bgcolor: brandColors.backgrounds.hover, borderColor: brandColors.primary }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: brandColors.primary, mb: 1 }}
                    >
                      <strong>Getting Started:</strong> Complete the Global
                      Configuration tab to unlock advanced analysis features.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: brandColors.primary, opacity: 0.8, display: "block" }}
                    >
                      - Configure Market Conditions (inflation, appreciation,
                      rent growth rates)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: brandColors.primary, opacity: 0.8, display: "block" }}
                    >
                      - Set Risk Factors (market volatility, tenant quality,
                      property age)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: brandColors.primary, opacity: 0.8, display: "block" }}
                    >
                      - Define Exit Strategies (timeline, selling costs, ROI
                      targets)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: brandColors.primary, opacity: 0.8, display: "block" }}
                    >
                      - Configure Tax Implications (bracket, deductions,
                      property expenses)
                    </Typography>
                  </Alert>
                )}

                {/* ============================================================================
                   COMPLETION PROGRESS
                   ============================================================================ */}

                <CompletionProgress
                  completed={completedCalculators}
                  total={totalCalculators}
                  label="Calculation Completion"
                  data-testid="completion-progress"
                />

                {/* Configuration Progress */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: brandColors.backgrounds.secondary,
                    borderRadius: 1,
                    border: `1px solid ${brandColors.borders.secondary}`,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
                  >
                    Configuration Progress
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: brandColors.neutral.dark }}>
                        {(() => {
                          const { status } =
                            checkConfigurationStatus(dealState);
                          const completed =
                            Object.values(status).filter(Boolean).length;
                          return `${completed}/4 configurations complete`;
                        })()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandColors.neutral.dark }}>
                        {(() => {
                          const { status } =
                            checkConfigurationStatus(dealState);
                            const completed =
                              Object.values(status).filter(Boolean).length;
                            return `${Math.round((completed / 4) * 100)}%`;
                        })()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 8,
                        bgcolor: brandColors.borders.secondary,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(() => {
                            const { status } =
                              checkConfigurationStatus(dealState);
                            const completed =
                              Object.values(status).filter(Boolean).length;
                            return (completed / 4) * 100;
                          })()}%`,
                          height: "100%",
                          bgcolor: configsComplete ? brandColors.accent.success : brandColors.actions.primary,
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "1fr 1fr 1fr 1fr",
                      },
                    }}
                  >
                    {(() => {
                      const { status } = checkConfigurationStatus(dealState);
                      return (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                              Market Conditions
                            </Typography>
                            <Chip
                              label={
                                status.hasMarketConditions
                                  ? "Complete"
                                  : "Required"
                              }
                              size="small"
                              color={
                                status.hasMarketConditions
                                  ? "success"
                                  : "default"
                              }
                              variant={
                                status.hasMarketConditions
                                  ? "filled"
                                  : "outlined"
                              }
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                              Risk Factors
                            </Typography>
                            <Chip
                              label={
                                status.hasRiskFactors ? "Complete" : "Required"
                              }
                              size="small"
                              color={
                                status.hasRiskFactors ? "success" : "default"
                              }
                              variant={
                                status.hasRiskFactors ? "filled" : "outlined"
                              }
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                              Exit Strategies
                            </Typography>
                            <Chip
                              label={
                                status.hasExitStrategies
                                  ? "Complete"
                                  : "Required"
                              }
                              size="small"
                              color={
                                status.hasExitStrategies ? "success" : "default"
                              }
                              variant={
                                status.hasExitStrategies ? "filled" : "outlined"
                              }
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                              Tax Implications
                            </Typography>
                            <Chip
                              label={
                                status.hasTaxImplications
                                  ? "Complete"
                                  : "Required"
                              }
                              size="small"
                              color={
                                status.hasTaxImplications
                                  ? "success"
                                  : "default"
                              }
                              variant={
                                status.hasTaxImplications
                                  ? "filled"
                                  : "outlined"
                              }
                            />
                          </Box>
                        </>
                      );
                    })()}
                  </Box>
                  {configsComplete && (
                    <Alert
                      severity="success"
                      sx={{
                        mt: 2,
                        bgcolor: brandColors.backgrounds.success,
                        borderColor: brandColors.accent.success,
                        animation: "pulse 2s ease-in-out",
                        "@keyframes pulse": {
                          "0%": { transform: "scale(1)" },
                          "50%": { transform: "scale(1.02)" },
                          "100%": { transform: "scale(1)" },
                        },
                        "@keyframes bounce": {
                          "0%, 20%, 53%, 80%, 100%": {
                            transform: "translate3d(0,0,0)",
                          },
                          "40%, 43%": { transform: "translate3d(0,-8px,0)" },
                          "70%": { transform: "translate3d(0,-4px,0)" },
                          "90%": { transform: "translate3d(0,-2px,0)" },
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: brandColors.accent.success }}>
                        All configurations complete! Advanced analysis features
                        are now unlocked.
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: brandColors.accent.success,
                          opacity: 0.8,
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        You can now access all tabs and advanced analysis
                        features.
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: brandColors.accent.success,
                          opacity: 0.8,
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        Pro tip: Use Ctrl/Cmd + 3 to jump to the first unlocked
                        tab.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* ============================================================================
               NEW FEATURES ALERT
               ============================================================================ */}

            {/* New Features Alert */}
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <CardContent sx={{ p: 3 }}>
                <Alert
                  severity="info"
                  sx={{ bgcolor: brandColors.backgrounds.hover, borderColor: brandColors.primary }}
                >
                  <Typography variant="body2" sx={{ color: brandColors.primary }}>
                    <strong>Enhanced Capabilities:</strong> Our comprehensive
                    analysis suite provides sophisticated financial modeling and
                    risk assessment tools. Leverage advanced algorithms for
                    deeper insights into your real estate investment strategies.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* ============================================================================
               MAIN TABS CARD
               ============================================================================ */}

            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              {/* ============================================================================
                 CARD CONTENT
                 ============================================================================ */}

              <CardContent sx={{ p: 0 }}>
                {/* ============================================================================
                   CONFIGURATION STATUS INDICATOR
                   ============================================================================ */}

                {!configsComplete && (
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      bgcolor: brandColors.backgrounds.warning,
                      borderBottom: "1px solid brandColors.accent.warning",
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: brandColors.neutral.dark,
                          fontWeight: 500,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                      >
                        Complete Global Configuration to unlock comprehensive
                        analysis capabilities
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: brandColors.neutral.dark,
                          fontWeight: 600,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                      >
                        {(() => {
                          const { status } =
                            checkConfigurationStatus(dealState);
                          const completed =
                            Object.values(status).filter(Boolean).length;
                          return `${completed}/4`;
                        })()}
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setTabValue(1)}
                        sx={{
                          color: brandColors.neutral.dark,
                          textDecoration: "underline",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          minWidth: "auto",
                          px: { xs: 0.5, sm: 1 },
                          "&:hover": { bgcolor: "transparent" },
                        }}
                      >
                        Configure
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* ============================================================================
                   TABS CONTAINER
                   ============================================================================ */}

                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: brandColors.borders.secondary,
                    bgcolor: brandColors.backgrounds.secondary,
                  }}
                >
                  {/* ============================================================================
                     TABS STYLING
                     ============================================================================ */}

                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="Advanced calculation tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    onClick={() =>
                      console.log("Tabs clicked, current tabValue:", tabValue)
                    }
                    sx={{
                      "& .MuiTab-root": {
                        color: brandColors.neutral.dark,
                        fontWeight: 600,
                        textTransform: "none",
                        minHeight: { xs: 48, md: 64 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        px: { xs: 1, sm: 1.5, md: 2 },
                        "&.Mui-selected": {
                          color: brandColors.primary,
                          fontWeight: 700,
                        },
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: brandColors.primary,
                        height: 3,
                      },
                      "& .MuiTabs-scrollButtons": {
                        "&.Mui-disabled": {
                          opacity: 0.3,
                        },
                      },
                    }}
                  >
                    {/* ============================================================================
                       TAB HEADERS
                       ============================================================================ */}

                    {tabConfig.map((tab, index) => (
                      <Tab
                        key={index}
                        className={tab.className || ""}
                        disabled={false}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {tab.icon}
                            {tab.label}
                          </Box>
                        }
                        id={`advanced-calc-tab-${index}`}
                        aria-controls={`advanced-calc-tabpanel-${index}`}
                        data-testid={`tab-${index}-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
                        sx={{}}
                        onClick={() =>
                          console.log(
                            `Tab ${index} (${tab.label}) clicked directly`,
                          )
                        }
                      />
                    ))}
                  </Tabs>
                </Box>

                {/* ============================================================================
                   TAB PANELS
                   ============================================================================ */}

                {tabConfig.map((tab, index) => (
                  <TabPanel key={index} value={tabValue} index={index}>
                    <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                      {tab.component as unknown as React.ReactNode}
                    </Box>
                  </TabPanel>
                ))}
              </CardContent>
            </Card>

            {/* ============================================================================
               RESULTS SUMMARY
               ============================================================================ */}

            {/* Summary of All Results */}
            <ResultsSummary allResults={allResults} />

            {/* ============================================================================
               FEATURES OVERVIEW
               ============================================================================ */}

            {/* Features Overview */}
            <FeaturesOverview dealState={dealState} />

            {/* ============================================================================
               INTEGRATION INSTRUCTIONS
               ============================================================================ */}

            {/* Integration Instructions */}
            <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, color: brandColors.primary }}
                >
                  How to Integrate with Existing Calculations
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: brandColors.neutral.dark }}>
                  Our sophisticated analysis tools seamlessly integrate with
                  your existing mortgage and underwriting workflows to provide
                  more sophisticated analysis without breaking current
                  functionality.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: brandColors.backgrounds.secondary,
                        borderRadius: 1,
                        border: "1px solid brandColors.borders.secondary",
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: brandColors.primary }}
                      >
                        For Mortgage Calculations
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: brandColors.neutral.dark }}>
                        - Use seasonal adjustments to modify vacancy rates in
                        your DSCR calculations
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: brandColors.neutral.dark }}>
                        - Apply market conditions to adjust rent growth and
                        appreciation rates
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: brandColors.neutral.dark }}>
                        - Include tax implications to show net income after
                        deductions
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: brandColors.backgrounds.secondary,
                        borderRadius: 1,
                        border: "1px solid brandColors.borders.secondary",
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: brandColors.primary }}
                      >
                        For Underwriting Analysis
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: brandColors.neutral.dark }}>
                        - Use risk scoring to evaluate deal quality
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: brandColors.neutral.dark }}>
                        - Apply stress testing to assess worst-case scenarios
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{ color: brandColors.neutral.dark }}
                      >
                        - Include exit strategies to show different ROI
                        timelines
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>No Deal Data:</strong> Please go back to the Underwrite
                page and click "Open Advanced Analysis" to load your deal data.
                Advanced features are disabled until a deal is loaded.
              </Typography>
            </Alert>
          </Box>
        )}
      </Container>

      {/* ============================================================================
         AUTHENTICATION MODAL
         ============================================================================ */}

      {/* Authentication Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Optionally refresh cloud deals after successful auth
          if (isAuthenticated) {
            loadCloudDeals();
          }
        }}
      />

      {/* ============================================================================
         GUIDED TOUR
         ============================================================================ */}

      {/* Guided Tour */}
      <GuidedTour
        isOpen={showGuidedTour}
        onClose={() => setShowGuidedTour(false)}
      />

      {/* Floating Configuration Button */}
      {!configsComplete && dealState && (
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 20, md: 24 },
            right: { xs: 16, sm: 20, md: 24 },
            zIndex: 1000,
            animation: "bounce 2s infinite",
          }}
          data-testid="floating-config-button"
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => setTabValue(1)}
            startIcon={<span>-</span>}
            sx={{
              bgcolor: brandColors.primary,
              color: brandColors.backgrounds.primary,
              borderRadius: "50px",
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 1, sm: 1.25, md: 1.5 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              boxShadow: "0 4px 20px rgba(26, 54, 93, 0.3)",
              "&:hover": {
                bgcolor: brandColors.secondary,
                boxShadow: "0 6px 25px rgba(26, 54, 93, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Complete Configuration
          </Button>
        </Box>
      )}

      {/* ============================================================================
         ONBOARDING TOOLTIP
         ============================================================================ */}

      {/* Custom Onboarding Tooltip */}
      {showTour && showTourTooltip && currentTourStep < tourSteps.length && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            if (currentTourStep < tourSteps.length - 1) {
              setCurrentTourStep((prev) => prev + 1);
            } else {
              setShowTour(false);
              setShowTourTooltip(false);
              setCurrentTourStep(0);
            }
          }}
        >
          <Card
            sx={{
              maxWidth: 400,
              mx: 2,
              bgcolor: "#fff",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              borderRadius: 2,
              overflow: "visible",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: brandColors.primary, fontWeight: 600 }}
              >
                Welcome to Advanced Analysis
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 3, color: brandColors.neutral.dark, lineHeight: 1.6 }}
              >
                {tourSteps[currentTourStep].content}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowTour(false);
                    setShowTourTooltip(false);
                    setCurrentTourStep(0);
                  }}
                  sx={{ borderColor: brandColors.neutral.dark, color: brandColors.neutral.dark }}
                >
                  Dismiss
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (currentTourStep < tourSteps.length - 1) {
                      setCurrentTourStep((prev) => prev + 1);
                    } else {
                      setShowTour(false);
                      setShowTourTooltip(false);
                      setCurrentTourStep(0);
                    }
                  }}
                  sx={{ bgcolor: brandColors.primary, "&:hover": { bgcolor: brandColors.secondary } }}
                >
                  {currentTourStep < tourSteps.length - 1 ? "Next" : "Finish"}
                </Button>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {tourSteps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: index === currentTourStep ? brandColors.primary : "#ccc",
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Global Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbar-root": {
            zIndex: 9999,
          },
          // Mobile responsiveness
          "& .MuiAlert-root": {
            width: { xs: "90vw", sm: "auto", md: "auto" },
            maxWidth: { xs: "90vw", sm: "400px", md: "500px" },
          },
        }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={
            snackbar.severity as "success" | "info" | "warning" | "error"
          }
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: 500,
            },
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedCalculationsPage;
