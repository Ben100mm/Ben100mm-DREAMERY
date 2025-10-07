/**
 * Monte Carlo Simulation Tab Component
 * 
 * Main tab for running and displaying Monte Carlo simulations
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Button,
  Divider
} from '@mui/material';
import {
  Download,
  Refresh
} from '@mui/icons-material';
import {
  MonteCarloInputs,
  MonteCarloResults,
  CashFlowProjectionParams,
  runMonteCarloSimulation,
  MonteCarloConfig,
  exportSimulationResultsToCSV
} from '../utils/monteCarloSimulation';
import MonteCarloConfiguration from './MonteCarloConfiguration';
import MonteCarloVisualization from './MonteCarloVisualization';

// ============================================================================
// Types
// ============================================================================

interface MonteCarloSimulationTabProps {
  baseParams: CashFlowProjectionParams;
}

// ============================================================================
// Component
// ============================================================================

export const MonteCarloSimulationTab: React.FC<MonteCarloSimulationTabProps> = ({
  baseParams
}) => {
  const [results, setResults] = useState<MonteCarloResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [targetReturn, setTargetReturn] = useState(0);
  
  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleRunSimulation = (
    inputs: MonteCarloInputs,
    simulationCount: number,
    seed?: number
  ) => {
    setIsRunning(true);
    setProgress(0);
    setError(null);

    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      // Fallback to synchronous execution
      runSimulationSync(inputs, simulationCount, seed);
      return;
    }

    try {
      // Terminate existing worker if any
      if (workerRef.current) {
        workerRef.current.terminate();
      }

      // Create new worker
      workerRef.current = new Worker('/monteCarloWorker.js');

      // Handle messages from worker
      workerRef.current.onmessage = (e) => {
        const { type, data } = e.data;

        if (type === 'PROGRESS') {
          setProgress(data.percentage);
        } else if (type === 'COMPLETE') {
          // Process results
          processWorkerResults(data, inputs, simulationCount);
          setIsRunning(false);
          setProgress(100);
          
          // Terminate worker
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }
        }
      };

      // Handle errors
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setError('Simulation failed. Please try again.');
        setIsRunning(false);
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
      };

      // Start simulation
      workerRef.current.postMessage({
        type: 'RUN_SIMULATION',
        data: {
          baseParams,
          uncertaintyInputs: inputs,
          simulationCount,
          randomSeed: seed
        }
      });
    } catch (err) {
      console.error('Failed to start worker:', err);
      setError('Failed to start simulation. Falling back to synchronous mode.');
      runSimulationSync(inputs, simulationCount, seed);
    }
  };

  // Synchronous fallback
  const runSimulationSync = (
    inputs: MonteCarloInputs,
    simulationCount: number,
    seed?: number
  ) => {
    try {
      const config: MonteCarloConfig = {
        baseParams,
        uncertaintyInputs: inputs,
        simulationCount,
        randomSeed: seed
      };

      const simulationResults = runMonteCarloSimulation(config);
      setResults(simulationResults);
      setIsRunning(false);
      setProgress(100);
    } catch (err) {
      console.error('Simulation failed:', err);
      setError(err instanceof Error ? err.message : 'Simulation failed');
      setIsRunning(false);
    }
  };

  // Process results from Web Worker
  const processWorkerResults = (
    workerResults: any[],
    inputs: MonteCarloInputs,
    simulationCount: number
  ) => {
    try {
      // Import statistical functions
      const { calculateStatistics, createHistogram } = require('../utils/monteCarloSimulation');
      
      // Extract metrics
      const totalReturns = workerResults.map(r => r.totalReturn || 0);
      const annualizedReturns = workerResults.map(r => r.annualizedReturn || 0);
      const cashFlows = workerResults.map(r => r.totalCashFlow || 0);
      const finalEquities = workerResults.map(r => r.finalEquity || 0);
      
      // Calculate statistics
      const totalReturnStats = calculateStatistics(totalReturns);
      const annualizedReturnStats = calculateStatistics(annualizedReturns);
      const cashFlowStats = calculateStatistics(cashFlows);
      const finalEquityStats = calculateStatistics(finalEquities);
      
      // Calculate probabilities
      const positiveReturns = totalReturns.filter(r => r > 0).length;
      const probabilityOfPositiveReturn = positiveReturns / workerResults.length;
      
      const probabilityOfTargetReturn = (target: number) => {
        const achieving = totalReturns.filter(r => r >= target).length;
        return achieving / workerResults.length;
      };
      
      // Create histogram
      const histogramData = createHistogram(totalReturns);
      
      const results: MonteCarloResults = {
        simulationCount: workerResults.length,
        results: workerResults,
        totalReturnStats,
        annualizedReturnStats,
        cashFlowStats,
        finalEquityStats,
        probabilityOfPositiveReturn,
        probabilityOfTargetReturn,
        histogramData,
        executionTimeMs: 0 // Worker doesn't track this
      };
      
      setResults(results);
    } catch (err) {
      console.error('Failed to process results:', err);
      setError('Failed to process simulation results');
    }
  };

  const handleExportCSV = () => {
    if (!results) return;

    const csv = exportSimulationResultsToCSV(results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MonteCarlo_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setProgress(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Monte Carlo Simulation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Probabilistic analysis using {results?.simulationCount?.toLocaleString() || '10,000'} simulations to model uncertainty and risk
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Configuration */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <MonteCarloConfiguration
          baseParams={baseParams}
          onRunSimulation={handleRunSimulation}
          isRunning={isRunning}
          progress={progress}
        />
      </Paper>

      {/* Results */}
      {results && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Simulation Results
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportCSV}
                size="small"
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReset}
                size="small"
              >
                Reset
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <MonteCarloVisualization
            results={results}
            targetReturn={targetReturn}
            onTargetReturnChange={setTargetReturn}
          />
        </>
      )}

      {/* Instructions */}
      {!results && !isRunning && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            How Monte Carlo Simulation Works
          </Typography>
          <Typography variant="body2" paragraph>
            Monte Carlo simulation runs thousands of scenarios with randomized inputs to model uncertainty in real estate investments.
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Key Benefits:</strong>
            <ul>
              <li>Understand the range of possible outcomes</li>
              <li>Quantify risk with probability distributions</li>
              <li>Make more informed decisions with confidence intervals</li>
              <li>Identify which variables have the most impact</li>
            </ul>
          </Typography>
          <Typography variant="body2" paragraph>
            Configure the uncertainty parameters above and click "Run Simulation" to begin. The simulation will run in the background without freezing your browser.
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Tip:</strong> Start with 10,000 simulations for a good balance between accuracy and speed. 
              Use higher counts (25,000+) for final analysis and decision-making.
            </Typography>
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default MonteCarloSimulationTab;

