// Mortgage calculation data and constants
export const LENDER_TYPES = [
  'Conventional',
  'FHA',
  'VA',
  'USDA',
  'Jumbo',
  'Portfolio'
] as const;

export const PROPERTY_TYPES = [
  'Single Family',
  'Townhouse',
  'Condo',
  'Multi-Family',
  'Commercial',
  'Land'
] as const;

export const LOAN_PURPOSES = [
  'Purchase',
  'Refinance',
  'Cash-Out Refinance',
  'Construction',
  'Renovation'
] as const;

export const CREDIT_SCORE_RANGES = [
  { min: 300, max: 579, label: 'Poor (300-579)' },
  { min: 580, max: 669, label: 'Fair (580-669)' },
  { min: 670, max: 739, label: 'Good (670-739)' },
  { min: 740, max: 799, label: 'Very Good (740-799)' },
  { min: 800, max: 850, label: 'Excellent (800-850)' }
] as const;

export const DOWN_PAYMENT_OPTIONS = [
  { percentage: 3.5, label: '3.5% (FHA)' },
  { percentage: 5, label: '5% (Conventional)' },
  { percentage: 10, label: '10% (Conventional)' },
  { percentage: 15, label: '15% (Conventional)' },
  { percentage: 20, label: '20% (No PMI)' },
  { percentage: 25, label: '25% (Better rates)' }
] as const;
