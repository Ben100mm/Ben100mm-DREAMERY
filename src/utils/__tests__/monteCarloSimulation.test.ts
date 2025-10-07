/**
 * Tests for Monte Carlo Simulation
 */

import {
  uniform,
  normal,
  triangular,
  lognormal,
  setRandomSeed,
  percentile,
  mean,
  stdDev,
  calculateStatistics,
  createHistogram,
  runMonteCarloSimulation,
  DistributionType,
  createDefaultUncertaintyInputs
} from '../monteCarloSimulation';

describe('Monte Carlo Simulation', () => {
  beforeEach(() => {
    setRandomSeed(12345); // Use consistent seed for reproducible tests
  });

  describe('Random Number Generation', () => {
    it('uniform distribution should generate values in range', () => {
      const values = Array.from({ length: 1000 }, () => uniform(0, 10));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = mean(values);

      expect(min).toBeGreaterThanOrEqual(0);
      expect(max).toBeLessThanOrEqual(10);
      expect(avg).toBeGreaterThan(4);
      expect(avg).toBeLessThan(6);
    });

    it('normal distribution should approximate mean and stdDev', () => {
      setRandomSeed(12345);
      const values = Array.from({ length: 10000 }, () => normal(100, 15));
      const calculatedMean = mean(values);
      const calculatedStdDev = stdDev(values);

      expect(calculatedMean).toBeCloseTo(100, 0);
      expect(calculatedStdDev).toBeCloseTo(15, 0);
    });

    it('triangular distribution should respect min, mode, max', () => {
      const values = Array.from({ length: 1000 }, () => triangular(0, 5, 10));
      const min = Math.min(...values);
      const max = Math.max(...values);

      expect(min).toBeGreaterThanOrEqual(0);
      expect(max).toBeLessThanOrEqual(10);
    });

    it('lognormal distribution should generate positive values', () => {
      const values = Array.from({ length: 1000 }, () => lognormal(0, 1));
      
      expect(values.every(v => v > 0)).toBe(true);
    });
  });

  describe('Statistical Functions', () => {
    it('should calculate correct mean', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
      expect(mean([10, 20, 30])).toBe(20);
    });

    it('should calculate correct standard deviation', () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const sd = stdDev(values);
      expect(sd).toBeCloseTo(2, 0);
    });

    it('should calculate correct percentiles', () => {
      const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      expect(percentile(sorted, 0.5)).toBe(5.5); // 50th percentile (median)
      expect(percentile(sorted, 0.25)).toBe(3.25); // 25th percentile
      expect(percentile(sorted, 0.75)).toBe(7.75); // 75th percentile
      expect(percentile(sorted, 0)).toBe(1); // Min
      expect(percentile(sorted, 1)).toBe(10); // Max
    });

    it('should calculate complete statistics', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const stats = calculateStatistics(values);

      expect(stats.mean).toBe(5.5);
      expect(stats.median).toBe(5.5);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(10);
      expect(stats.percentile25).toBe(3.25);
      expect(stats.percentile75).toBe(7.75);
    });

    it('should create histogram', () => {
      const values = Array.from({ length: 1000 }, (_, i) => i);
      const histogram = createHistogram(values, 10);

      expect(histogram.bins.length).toBe(11); // 10 bins + 1 edge
      expect(histogram.frequencies.length).toBe(10);
      expect(histogram.frequencies.reduce((a, b) => a + b, 0)).toBe(1000);
    });
  });

  describe('Monte Carlo Simulation', () => {
    const baseParams = {
      purchasePrice: 500000,
      initialMonthlyRent: 3000,
      vacancyRate: 0.05,
      annualTaxes: 6000,
      annualInsurance: 1200,
      annualMaintenance: 3000,
      annualManagement: 3600,
      annualCapEx: 2400,
      loanAmount: 400000,
      annualInterestRate: 0.05,
      loanTermMonths: 360,
      growthRates: {
        rentGrowthRate: 0.03,
        expenseGrowthRate: 0.025,
        propertyAppreciationRate: 0.04
      },
      projectionYears: 10,
      initialInvestment: 100000
    };

    it('should run simulation and return results', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 100,
        randomSeed: 12345
      });

      expect(results.simulationCount).toBe(100);
      expect(results.results.length).toBe(100);
      expect(results.totalReturnStats).toBeDefined();
      expect(results.annualizedReturnStats).toBeDefined();
      expect(results.probabilityOfPositiveReturn).toBeGreaterThanOrEqual(0);
      expect(results.probabilityOfPositiveReturn).toBeLessThanOrEqual(1);
    });

    it('should produce different results without seed', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results1 = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 100
      });

      const results2 = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 100
      });

      // Results should be different (very unlikely to be exactly the same)
      const mean1 = results1.totalReturnStats.mean;
      const mean2 = results2.totalReturnStats.mean;
      
      // They might be close but shouldn't be exactly equal
      expect(mean1).not.toBe(mean2);
    });

    it('should produce consistent results with same seed', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results1 = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 100,
        randomSeed: 12345
      });

      const results2 = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 100,
        randomSeed: 12345
      });

      expect(results1.totalReturnStats.mean).toBe(results2.totalReturnStats.mean);
      expect(results1.totalReturnStats.median).toBe(results2.totalReturnStats.median);
    });

    it('should calculate probability of target return', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 1000,
        randomSeed: 12345
      });

      const probZero = results.probabilityOfTargetReturn(0);
      const probVeryHigh = results.probabilityOfTargetReturn(10000000);
      
      expect(probZero).toBeGreaterThanOrEqual(0);
      expect(probZero).toBeLessThanOrEqual(1);
      expect(probVeryHigh).toBeGreaterThanOrEqual(0);
      expect(probVeryHigh).toBeLessThan(probZero); // Fewer simulations achieve very high returns
    });

    it('should generate histogram data', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 1000,
        randomSeed: 12345
      });

      expect(results.histogramData.bins.length).toBeGreaterThan(0);
      expect(results.histogramData.frequencies.length).toBeGreaterThan(0);
      expect(results.histogramData.binWidth).toBeGreaterThan(0);
      
      const totalFrequency = results.histogramData.frequencies.reduce((a, b) => a + b, 0);
      expect(totalFrequency).toBe(1000);
    });

    it('should track execution time', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 100
      });

      expect(results.executionTimeMs).toBeGreaterThan(0);
      expect(results.executionTimeMs).toBeLessThan(10000); // Should complete in < 10s
    });

    it('should handle default uncertainty inputs', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      expect(uncertaintyInputs.rentGrowthDistribution.type).toBe(DistributionType.NORMAL);
      expect(uncertaintyInputs.rentGrowthDistribution.mean).toBe(0.03);
      
      expect(uncertaintyInputs.initialRentDistribution.type).toBe(DistributionType.TRIANGULAR);
      expect(uncertaintyInputs.initialRentDistribution.mode).toBe(baseParams.initialMonthlyRent);
      
      expect(uncertaintyInputs.appreciationDistribution.type).toBe(DistributionType.NORMAL);
      expect(uncertaintyInputs.appreciationDistribution.mean).toBe(0.04);
    });

    it('should calculate statistics with confidence intervals', () => {
      const uncertaintyInputs = createDefaultUncertaintyInputs(baseParams);
      
      const results = runMonteCarloSimulation({
        baseParams,
        uncertaintyInputs,
        simulationCount: 1000,
        randomSeed: 12345,
        confidenceLevel: 0.95
      });

      const ci = results.totalReturnStats.confidenceInterval95;
      expect(ci.lower).toBeLessThan(results.totalReturnStats.mean);
      expect(ci.upper).toBeGreaterThan(results.totalReturnStats.mean);
    });
  });
});

