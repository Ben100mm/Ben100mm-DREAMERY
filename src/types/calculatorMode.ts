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
      'Basic property inputs',
      'Simple financing (down payment, rate, term)',
      'Preset operating expenses',
      'Key metrics (cash flow, CoC, ROI)',
      'Break-even analysis'
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
      'All financing types (Subject-To, Seller Finance, Hybrid)',
      'Detailed expense breakdown',
      'All property strategies (Fix & Flip, BRRRR, Arbitrage)',
      'Industry benchmarks',
      'Regional adjustments',
      'Risk assessment',
      'Full amortization schedule'
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
      'Capital events planning',
      '1031 Exchange calculator',
      'Advanced modeling (seasonal, exit strategies, tax, refinance)',
      'Monte Carlo simulations',
      'Scenario comparison',
      'Cloud sync & save',
      'Confidence intervals',
      'ML-powered risk predictions'
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

