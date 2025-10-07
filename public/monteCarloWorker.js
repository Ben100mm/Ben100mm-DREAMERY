/**
 * Web Worker for Monte Carlo Simulation
 * 
 * Runs simulations in a separate thread to prevent UI blocking
 */

// Import is not supported in Web Workers directly, so we'll inline the necessary functions

// Seeded Random Number Generator
class SeededRandom {
  constructor(seed = Date.now()) {
    this.seed = seed;
  }
  
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

let random = new SeededRandom();

function setRandomSeed(seed) {
  random = new SeededRandom(seed);
}

// Distribution sampling functions
function uniform(min, max) {
  return min + random.next() * (max - min);
}

function normal(mean, stdDev) {
  const u1 = random.next();
  const u2 = random.next();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z0 * stdDev;
}

function triangular(min, mode, max) {
  const u = random.next();
  const f = (mode - min) / (max - min);
  
  if (u < f) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

function lognormal(meanLog, stdDevLog) {
  const normalValue = normal(meanLog, stdDevLog);
  return Math.exp(normalValue);
}

function sampleDistribution(dist) {
  switch (dist.type) {
    case 'normal':
      return normal(dist.mean, dist.stdDev);
    case 'triangular':
      return triangular(dist.min, dist.mode, dist.max);
    case 'uniform':
      return uniform(dist.min, dist.max);
    case 'lognormal':
      return lognormal(dist.mean, dist.stdDev);
    default:
      throw new Error(`Unknown distribution type: ${dist.type}`);
  }
}

// Simplified cash flow calculation (inline to avoid imports)
function calculateSimplifiedCashFlow(params, growthRates, vacancyRate) {
  const years = params.projectionYears;
  let totalCashFlow = 0;
  let finalPropertyValue = params.purchasePrice;
  let loanBalance = params.loanAmount;
  let totalPrincipalPaydown = 0;
  
  const monthlyRate = params.annualInterestRate / 12;
  const monthlyPayment = params.loanAmount > 0 
    ? (params.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, params.loanTermMonths)) / 
      (Math.pow(1 + monthlyRate, params.loanTermMonths) - 1)
    : 0;
  
  for (let year = 1; year <= years; year++) {
    // Calculate rent for this year
    const rent = params.initialMonthlyRent * Math.pow(1 + growthRates.rentGrowthRate, year - 1);
    const annualRent = rent * 12 * (1 - vacancyRate);
    
    // Calculate expenses for this year
    const expenses = (
      params.annualTaxes +
      params.annualInsurance +
      params.annualMaintenance +
      params.annualManagement +
      params.annualCapEx
    ) * Math.pow(1 + growthRates.expenseGrowthRate, year - 1);
    
    // NOI
    const noi = annualRent - expenses;
    
    // Debt service (simplified)
    const annualDebtService = monthlyPayment * 12;
    const annualInterest = loanBalance * params.annualInterestRate;
    const annualPrincipal = annualDebtService - annualInterest;
    
    // Cash flow
    const cashFlow = noi - annualDebtService;
    totalCashFlow += cashFlow;
    
    // Update loan balance
    loanBalance = Math.max(0, loanBalance - annualPrincipal);
    totalPrincipalPaydown += annualPrincipal;
  }
  
  // Final property value with appreciation
  finalPropertyValue = params.purchasePrice * Math.pow(1 + growthRates.propertyAppreciationRate, years);
  const totalAppreciation = finalPropertyValue - params.purchasePrice;
  const finalEquity = finalPropertyValue - loanBalance;
  const totalReturn = totalCashFlow + totalPrincipalPaydown + totalAppreciation;
  
  return {
    totalReturn,
    totalCashFlow,
    totalAppreciation,
    totalPrincipalPaydown,
    finalEquity,
    finalPropertyValue,
    annualizedReturn: params.initialInvestment > 0 
      ? (Math.pow(1 + (totalReturn / params.initialInvestment), 1 / years) - 1) * 100
      : 0,
    cashOnCashReturn: params.initialInvestment > 0
      ? (totalCashFlow / params.initialInvestment) * 100 / years
      : 0
  };
}

// Run a single simulation
function runSingleSimulation(baseParams, uncertaintyInputs) {
  const rentGrowth = sampleDistribution(uncertaintyInputs.rentGrowthDistribution);
  const initialRent = sampleDistribution(uncertaintyInputs.initialRentDistribution);
  const expenseGrowth = sampleDistribution(uncertaintyInputs.expenseGrowthDistribution);
  const appreciation = sampleDistribution(uncertaintyInputs.appreciationDistribution);
  const vacancyRate = Math.max(0, Math.min(1, sampleDistribution(uncertaintyInputs.vacancyRateDistribution)));
  const maintenanceMultiplier = sampleDistribution(uncertaintyInputs.maintenanceDistribution);
  const purchasePrice = sampleDistribution(uncertaintyInputs.purchasePriceDistribution);
  
  const simParams = {
    ...baseParams,
    purchasePrice,
    initialMonthlyRent: initialRent,
    annualMaintenance: baseParams.annualMaintenance * maintenanceMultiplier
  };
  
  const growthRates = {
    rentGrowthRate: rentGrowth,
    expenseGrowthRate: expenseGrowth,
    propertyAppreciationRate: appreciation
  };
  
  return calculateSimplifiedCashFlow(simParams, growthRates, vacancyRate);
}

// Message handler
self.addEventListener('message', (e) => {
  const { type, data } = e.data;
  
  if (type === 'RUN_SIMULATION') {
    const { baseParams, uncertaintyInputs, simulationCount, randomSeed } = data;
    
    if (randomSeed !== undefined) {
      setRandomSeed(randomSeed);
    }
    
    const results = [];
    const batchSize = 100;
    let completed = 0;
    
    // Run simulations in batches and report progress
    for (let batch = 0; batch < Math.ceil(simulationCount / batchSize); batch++) {
      const batchEnd = Math.min((batch + 1) * batchSize, simulationCount);
      
      for (let i = batch * batchSize; i < batchEnd; i++) {
        try {
          const result = runSingleSimulation(baseParams, uncertaintyInputs);
          results.push(result);
          completed++;
          
          // Report progress every 1000 simulations
          if (completed % 1000 === 0) {
            self.postMessage({
              type: 'PROGRESS',
              data: {
                completed,
                total: simulationCount,
                percentage: (completed / simulationCount) * 100
              }
            });
          }
        } catch (error) {
          console.error(`Simulation ${i} failed:`, error);
        }
      }
    }
    
    // Send completed results
    self.postMessage({
      type: 'COMPLETE',
      data: results
    });
  }
});

