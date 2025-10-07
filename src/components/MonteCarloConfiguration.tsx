/**
 * Monte Carlo Configuration Component
 * 
 * Allows users to configure uncertainty parameters for Monte Carlo simulation
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Alert,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore,
  PlayArrow,
  Settings,
  TrendingUp,
  Home,
  AttachMoney,
  ShowChart
} from '@mui/icons-material';
import {
  MonteCarloInputs,
  Distribution,
  DistributionType,
  CashFlowProjectionParams
} from '../utils/monteCarloSimulation';

// ============================================================================
// Types
// ============================================================================

interface MonteCarloConfigurationProps {
  baseParams: CashFlowProjectionParams;
  onRunSimulation: (inputs: MonteCarloInputs, simulationCount: number, seed?: number) => void;
  isRunning: boolean;
  progress?: number;
}

// ============================================================================
// Component
// ============================================================================

export const MonteCarloConfiguration: React.FC<MonteCarloConfigurationProps> = ({
  baseParams,
  onRunSimulation,
  isRunning,
  progress
}) => {
  const [simulationCount, setSimulationCount] = useState(10000);
  const [useRandomSeed, setUseRandomSeed] = useState(false);
  const [randomSeed, setRandomSeed] = useState(12345);
  
  // Rent uncertainty
  const [rentGrowthMean, setRentGrowthMean] = useState(3);
  const [rentGrowthStdDev, setRentGrowthStdDev] = useState(2);
  const [initialRentMin, setInitialRentMin] = useState(baseParams.initialMonthlyRent * 0.9);
  const [initialRentMode, setInitialRentMode] = useState(baseParams.initialMonthlyRent);
  const [initialRentMax, setInitialRentMax] = useState(baseParams.initialMonthlyRent * 1.1);
  
  // Expense uncertainty
  const [expenseGrowthMean, setExpenseGrowthMean] = useState(2.5);
  const [expenseGrowthStdDev, setExpenseGrowthStdDev] = useState(1.5);
  const [maintenanceMin, setMaintenanceMin] = useState(0.8);
  const [maintenanceMode, setMaintenanceMode] = useState(1.0);
  const [maintenanceMax, setMaintenanceMax] = useState(1.5);
  
  // Property value uncertainty
  const [appreciationMean, setAppreciationMean] = useState(4);
  const [appreciationStdDev, setAppreciationStdDev] = useState(2);
  const [purchasePriceMin, setPurchasePriceMin] = useState(baseParams.purchasePrice * 0.95);
  const [purchasePriceMode, setPurchasePriceMode] = useState(baseParams.purchasePrice);
  const [purchasePriceMax, setPurchasePriceMax] = useState(baseParams.purchasePrice * 1.05);
  
  // Vacancy uncertainty
  const [vacancyMin, setVacancyMin] = useState(Math.max(0, (baseParams.vacancyRate || 0.05) - 0.03));
  const [vacancyMode, setVacancyMode] = useState(baseParams.vacancyRate || 0.05);
  const [vacancyMax, setVacancyMax] = useState(Math.min(1, (baseParams.vacancyRate || 0.05) + 0.03));

  const handleRunSimulation = () => {
    const inputs: MonteCarloInputs = {
      rentGrowthDistribution: {
        type: DistributionType.NORMAL,
        mean: rentGrowthMean / 100,
        stdDev: rentGrowthStdDev / 100
      },
      initialRentDistribution: {
        type: DistributionType.TRIANGULAR,
        min: initialRentMin,
        mode: initialRentMode,
        max: initialRentMax
      },
      expenseGrowthDistribution: {
        type: DistributionType.NORMAL,
        mean: expenseGrowthMean / 100,
        stdDev: expenseGrowthStdDev / 100
      },
      maintenanceDistribution: {
        type: DistributionType.TRIANGULAR,
        min: maintenanceMin,
        mode: maintenanceMode,
        max: maintenanceMax
      },
      appreciationDistribution: {
        type: DistributionType.NORMAL,
        mean: appreciationMean / 100,
        stdDev: appreciationStdDev / 100
      },
      purchasePriceDistribution: {
        type: DistributionType.TRIANGULAR,
        min: purchasePriceMin,
        mode: purchasePriceMode,
        max: purchasePriceMax
      },
      vacancyRateDistribution: {
        type: DistributionType.TRIANGULAR,
        min: vacancyMin,
        mode: vacancyMode,
        max: vacancyMax
      }
    };

    onRunSimulation(inputs, simulationCount, useRandomSeed ? randomSeed : undefined);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShowChart color="primary" />
          <Typography variant="h6">Monte Carlo Configuration</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={handleRunSimulation}
          disabled={isRunning}
          size="large"
        >
          {isRunning ? 'Running...' : 'Run Simulation'}
        </Button>
      </Box>

      {/* Progress */}
      {isRunning && progress !== undefined && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {progress.toFixed(1)}% complete
          </Typography>
        </Box>
      )}

      {/* Simulation Settings */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Simulation Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Number of Simulations</InputLabel>
              <Select
                value={simulationCount}
                onChange={(e) => setSimulationCount(Number(e.target.value))}
                label="Number of Simulations"
              >
                <MenuItem value={1000}>1,000 (Fast)</MenuItem>
                <MenuItem value={5000}>5,000 (Balanced)</MenuItem>
                <MenuItem value={10000}>10,000 (Recommended)</MenuItem>
                <MenuItem value={25000}>25,000 (High Precision)</MenuItem>
                <MenuItem value={50000}>50,000 (Very High Precision)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Random Seed (Optional)"
              type="number"
              value={randomSeed}
              onChange={(e) => {
                setRandomSeed(Number(e.target.value));
                setUseRandomSeed(true);
              }}
              helperText="For reproducible results"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Rent Growth Uncertainty */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="primary" />
            <Typography>Rent Growth Uncertainty</Typography>
            <Chip label={`${rentGrowthMean}% ± ${rentGrowthStdDev}%`} size="small" />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Normal distribution: Most likely {rentGrowthMean}%, with variability of ±{rentGrowthStdDev}%
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mean Rent Growth"
                type="number"
                value={rentGrowthMean}
                onChange={(e) => setRentGrowthMean(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Standard Deviation"
                type="number"
                value={rentGrowthStdDev}
                onChange={(e) => setRentGrowthStdDev(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Initial Rent (Min)"
                type="number"
                value={initialRentMin}
                onChange={(e) => setInitialRentMin(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Initial Rent (Most Likely)"
                type="number"
                value={initialRentMode}
                onChange={(e) => setInitialRentMode(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Initial Rent (Max)"
                type="number"
                value={initialRentMax}
                onChange={(e) => setInitialRentMax(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Expense Uncertainty */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="error" />
            <Typography>Expense Uncertainty</Typography>
            <Chip label={`${expenseGrowthMean}% ± ${expenseGrowthStdDev}%`} size="small" color="error" />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Models inflation and unexpected expense variations
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mean Expense Growth"
                type="number"
                value={expenseGrowthMean}
                onChange={(e) => setExpenseGrowthMean(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Standard Deviation"
                type="number"
                value={expenseGrowthStdDev}
                onChange={(e) => setExpenseGrowthStdDev(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Maintenance Cost Multiplier
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Min (Best Case)"
                type="number"
                value={maintenanceMin}
                onChange={(e) => setMaintenanceMin(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">x</InputAdornment>,
                  inputProps: { step: 0.1, min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Most Likely"
                type="number"
                value={maintenanceMode}
                onChange={(e) => setMaintenanceMode(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">x</InputAdornment>,
                  inputProps: { step: 0.1, min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max (Worst Case)"
                type="number"
                value={maintenanceMax}
                onChange={(e) => setMaintenanceMax(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">x</InputAdornment>,
                  inputProps: { step: 0.1, min: 0 }
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Property Value Uncertainty */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Home color="success" />
            <Typography>Property Value Uncertainty</Typography>
            <Chip label={`${appreciationMean}% ± ${appreciationStdDev}%`} size="small" color="success" />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Market appreciation and purchase price variability
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mean Appreciation Rate"
                type="number"
                value={appreciationMean}
                onChange={(e) => setAppreciationMean(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Standard Deviation"
                type="number"
                value={appreciationStdDev}
                onChange={(e) => setAppreciationStdDev(Number(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Purchase Price Range
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Min"
                type="number"
                value={purchasePriceMin}
                onChange={(e) => setPurchasePriceMin(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Most Likely"
                type="number"
                value={purchasePriceMode}
                onChange={(e) => setPurchasePriceMode(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max"
                type="number"
                value={purchasePriceMax}
                onChange={(e) => setPurchasePriceMax(Number(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Vacancy Uncertainty */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings color="warning" />
            <Typography>Vacancy Rate Uncertainty</Typography>
            <Chip 
              label={`${(vacancyMode * 100).toFixed(1)}% (${(vacancyMin * 100).toFixed(1)}%-${(vacancyMax * 100).toFixed(1)}%)`} 
              size="small" 
              color="warning" 
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Triangular distribution for vacancy rate variations
              </Alert>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Min Vacancy"
                type="number"
                value={vacancyMin * 100}
                onChange={(e) => setVacancyMin(Number(e.target.value) / 100)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0, max: 100 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Most Likely Vacancy"
                type="number"
                value={vacancyMode * 100}
                onChange={(e) => setVacancyMode(Number(e.target.value) / 100)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0, max: 100 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max Vacancy"
                type="number"
                value={vacancyMax * 100}
                onChange={(e) => setVacancyMax(Number(e.target.value) / 100)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { step: 0.1, min: 0, max: 100 }
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MonteCarloConfiguration;

