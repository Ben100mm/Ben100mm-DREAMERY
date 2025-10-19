// Underwriting calculation data and constants
export const TIMEFRAMES = [1, 3, 5, 10, 15, 20, 30] as const;

export const MULTIPLIERS = {
  conservative: 1.2,
  moderate: 1.5,
  aggressive: 2.0
} as const;

export const PROPERTY_BENCHMARKS = {
  residential: {
    sfh: { capRate: 0.06, appreciation: 0.03 },
    mfh: { capRate: 0.07, appreciation: 0.035 },
    condo: { capRate: 0.065, appreciation: 0.025 }
  },
  commercial: {
    retail: { capRate: 0.08, appreciation: 0.02 },
    office: { capRate: 0.075, appreciation: 0.025 },
    industrial: { capRate: 0.085, appreciation: 0.03 }
  }
} as const;

export const OPERATION_BENCHMARKS = {
  buyAndHold: { managementFee: 0.08, vacancyRate: 0.05 },
  fixAndFlip: { holdingCosts: 0.15, profitMargin: 0.25 },
  shortTermRental: { managementFee: 0.12, vacancyRate: 0.15 }
} as const;
