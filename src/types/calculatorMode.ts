/**
 * Calculator Mode Types
 * 
 * Defines the three-tier progressive disclosure system for the Dreamery Calculator
 */

export type CalculatorMode = 'essential' | 'standard' | 'professional';

export interface CalculatorModeConfig {
  id: CalculatorMode;
  label: string;
  description: string;
  shortDescription: string;
  features: string[];
  accordionVisibility: AccordionVisibilityConfig;
}

export interface AccordionVisibilityConfig {
  // Core sections (always visible but may be simplified)
  basicInfo: 'full' | 'simplified';
  propertyDetails: 'full' | 'simplified';
  financing: 'full' | 'simplified' | 'minimal';
  income: 'full' | 'simplified';
  operatingExpenses: 'full' | 'simplified' | 'preset-only';
  
  // Advanced financing (conditional visibility)
  subjectTo: boolean;
  sellerFinance: boolean;
  hybridFinancing: boolean;
  
  // Strategy sections (conditional visibility)
  rentalArbitrage: boolean;
  fixFlip: boolean;
  brrrr: boolean;
  
  // Advanced features (conditional visibility)
  capitalEvents: boolean;
  exchange1031: boolean;
  advancedModeling: boolean;
  uncertaintyAnalysis: boolean;
  cashFlowProjections: boolean;
  proFormaAnalysis: boolean;
  
  // Results detail level
  atAGlance: 'basic' | 'standard' | 'comprehensive';
  amortization: 'summary' | 'full';
}

export const CALCULATOR_MODES: Record<CalculatorMode, CalculatorModeConfig> = {
  essential: {
    id: 'essential',
    label: 'Essential',
    description: 'Quick analysis with simplified inputs for fast deal evaluation',
    shortDescription: 'Quick analysis',
    features: [
      'Basic property inputs (price, down payment, rate, term)',
      'Simple financing options (Cash, Conventional, FHA)',
      'Preset operating expenses',
      'Buy & Hold strategy only',
      'Key metrics (cash flow, CoC, ROI, Cap Rate)',
      'Basic amortization schedule',
      'Break-even analysis',
      'Property type support (SFR, Multi-family)',
      'Simple rent input (monthly/yearly)',
      'Basic expense categories'
    ],
    accordionVisibility: {
      basicInfo: 'simplified',
      propertyDetails: 'simplified',
      financing: 'minimal',
      income: 'simplified',
      operatingExpenses: 'preset-only',
      subjectTo: false,
      sellerFinance: false,
      hybridFinancing: false,
      rentalArbitrage: false,
      fixFlip: false,
      brrrr: false,
      capitalEvents: false,
      exchange1031: false,
      advancedModeling: false,
      uncertaintyAnalysis: false,
      cashFlowProjections: false,
      proFormaAnalysis: false,
      atAGlance: 'basic',
      amortization: 'summary'
    }
  },
  
  standard: {
    id: 'standard',
    label: 'Standard',
    description: 'Comprehensive analysis with detailed inputs and all property strategies',
    shortDescription: 'Comprehensive',
    features: [
      'All Essential features',
      'All financing types (Subject-To, Seller Finance, Hybrid, Hard Money, Private, Line of Credit)',
      'Detailed expense breakdown with custom categories',
      'All property strategies (Buy & Hold, Fix & Flip, BRRRR, Rental Arbitrage, Short Term Rental)',
      'All property types (SFR, Multi-family, Commercial, Land, Hotel)',
      'Industry benchmarks and regional adjustments',
      'Advanced risk assessment',
      'Full amortization schedule with detailed breakdown',
      'Multiple exit strategy analysis',
      'Appreciation calculations',
      'IRR and MOIC calculations',
      'Tax implications (basic)',
      'Refinance scenarios',
      'Sensitivity analysis',
      'Stress testing',
      'Pro forma analysis'
    ],
    accordionVisibility: {
      basicInfo: 'full',
      propertyDetails: 'full',
      financing: 'full',
      income: 'full',
      operatingExpenses: 'full',
      subjectTo: true,
      sellerFinance: true,
      hybridFinancing: true,
      rentalArbitrage: true,
      fixFlip: true,
      brrrr: true,
      capitalEvents: false,
      exchange1031: false,
      advancedModeling: false,
      uncertaintyAnalysis: false,
      cashFlowProjections: false,
      proFormaAnalysis: false,
      atAGlance: 'standard',
      amortization: 'full'
    }
  },
  
  professional: {
    id: 'professional',
    label: 'Professional',
    description: 'Complete professional toolkit with advanced modeling and scenario analysis',
    shortDescription: 'Full featured',
    features: [
      'All Standard features',
      'Capital events planning and management',
      'Tax-Deferred Exchanges (1031 & 721)',
      'Advanced modeling (seasonal adjustments, market conditions, property age factors)',
      'Monte Carlo simulations with 10,000+ iterations',
      'Scenario comparison and optimization',
      'Cloud sync & save with unlimited deals',
      'Confidence intervals and uncertainty analysis',
      'ML-powered risk predictions',
      'Comprehensive tax implications (all deductions, brackets)',
      'Multiple refinance scenarios with break-even analysis',
      'Exit strategy optimization',
      'Inflation adjustments and projections',
      'Market volatility analysis',
      'Property age and location factor adjustments',
      'Seasonal rent and expense variations',
      'Advanced cash flow projections (10+ years)',
      'Comprehensive pro forma analysis',
      'Risk scoring and recommendations',
      'Data export and reporting',
      'API integrations and automation'
    ],
    accordionVisibility: {
      basicInfo: 'full',
      propertyDetails: 'full',
      financing: 'full',
      income: 'full',
      operatingExpenses: 'full',
      subjectTo: true,
      sellerFinance: true,
      hybridFinancing: true,
      rentalArbitrage: true,
      fixFlip: true,
      brrrr: true,
      capitalEvents: true,
      exchange1031: true,
      advancedModeling: true,
      uncertaintyAnalysis: true,
      cashFlowProjections: true,
      proFormaAnalysis: true,
      atAGlance: 'comprehensive',
      amortization: 'full'
    }
  }
};

/**
 * Get calculator mode configuration
 */
export function getModeConfig(mode: CalculatorMode): CalculatorModeConfig {
  return CALCULATOR_MODES[mode];
}

/**
 * Check if an accordion section should be visible in the current mode
 */
export function isAccordionVisible(
  mode: CalculatorMode,
  section: keyof AccordionVisibilityConfig
): boolean {
  const config = getModeConfig(mode);
  const visibility = config.accordionVisibility[section];
  
  // For boolean values, return directly
  if (typeof visibility === 'boolean') {
    return visibility;
  }
  
  // For string values (simplified/full/etc), it's visible but may be simplified
  return true;
}

/**
 * Get the detail level for an accordion section
 */
export function getAccordionDetailLevel(
  mode: CalculatorMode,
  section: keyof AccordionVisibilityConfig
): string {
  const config = getModeConfig(mode);
  return config.accordionVisibility[section] as string;
}

/**
 * Check if user should see upgrade prompt for a feature
 */
export function shouldShowUpgradePrompt(
  currentMode: CalculatorMode,
  requiredMode: CalculatorMode
): boolean {
  const modeOrder: CalculatorMode[] = ['essential', 'standard', 'professional'];
  const currentIndex = modeOrder.indexOf(currentMode);
  const requiredIndex = modeOrder.indexOf(requiredMode);
  
  return currentIndex < requiredIndex;
}