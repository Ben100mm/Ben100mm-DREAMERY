export type LoanSpec = {
  principal: number; // loan amount
  annualRate: number; // e.g. 0.075 for 7.5%
  termMonths: number; // amortization length
  interestOnly?: boolean; // default false
};

export function monthlyRate(annualRate: number) {
  if (annualRate < 0) {
    throw new Error("Annual interest rate cannot be negative.");
  }
  return annualRate / 12;
}

// Standard PMT (negative cashflow convention avoided; return positive number)
export function pmt(annualRate: number, nper: number, pv: number) {
  if (pv < 0 || nper <= 0 || annualRate < 0) {
    throw new Error(
      "Invalid inputs: principal, term, and rate must be non-negative, term must be positive.",
    );
  }
  const r = monthlyRate(annualRate);
  if (r === 0) return pv / nper;
  return (pv * r) / (1 - Math.pow(1 + r, -nper));
}

// Remaining principal after k payments on a fully-amortizing loan
// Formula: B_k = PV*(1+r)^k - PMT*[(1+r)^k - 1]/r
export function remainingPrincipalAfterPayments(
  spec: LoanSpec,
  paymentsMade: number,
) {
  if (spec.principal < 0 || spec.termMonths <= 0 || spec.annualRate < 0) {
    throw new Error(
      "Invalid loan specification: principal, term, and rate must be non-negative, term must be positive.",
    );
  }
  if (paymentsMade < 0) {
    throw new Error("Payments made cannot be negative.");
  }
  if (paymentsMade > spec.termMonths) {
    throw new Error("Payments made cannot exceed loan term.");
  }

  const { principal: pv, annualRate, termMonths, interestOnly } = spec;
  if (interestOnly) {
    // IO: principal doesn't change until IO period ends; if paymentsMade <= termMonths, balance == pv
    return Math.max(0, pv);
  }
  const r = monthlyRate(annualRate);
  if (r === 0) {
    const principalPaid = (pv / termMonths) * paymentsMade;
    return Math.max(0, pv - principalPaid);
  }
  const mPmt = pmt(annualRate, termMonths, pv);
  const pow = Math.pow(1 + r, paymentsMade);
  const balance = pv * pow - mPmt * ((pow - 1) / r);
  return Math.max(0, balance);
}

// Total monthly debt service across new loan + Subject-To + Hybrid
export function totalMonthlyDebtService(params: {
  newLoanMonthly: number;
  subjectToMonthlyTotal?: number; // sum of all subj‑to payments
  hybridMonthly?: number; // "loan 3" monthly pmt
}) {
  if (
    params.newLoanMonthly < 0 ||
    (params.subjectToMonthlyTotal && params.subjectToMonthlyTotal < 0) ||
    (params.hybridMonthly && params.hybridMonthly < 0)
  ) {
    throw new Error("Monthly debt service payments cannot be negative.");
  }

  return (
    (params.newLoanMonthly || 0) +
    (params.subjectToMonthlyTotal || 0) +
    (params.hybridMonthly || 0)
  );
}

// Operating expenses
export type OperatingInputs = {
  // fixed expenses (monthly)
  taxes?: number;
  insurance?: number;
  hoa?: number;
  gasElectric?: number;
  internet?: number;
  waterSewer?: number;
  heat?: number;
  lawnSnow?: number;
  phone?: number;
  cleaner?: number;
  extras?: number;
  baseRentForArbitrage?: number; // for arbitrage model

  // variable percentages of revenue (0..1)
  mgmtPct?: number;
  repairsPct?: number;
  utilitiesPct?: number; // if you model a revenue‑linked utilities bucket
  capExPct?: number;
  opExPct?: number;
};

export function computeFixedMonthlyOps(i: OperatingInputs): number {
  const values = [
    i.taxes || 0,
    i.insurance || 0,
    i.hoa || 0,
    i.gasElectric || 0,
    i.internet || 0,
    i.waterSewer || 0,
    i.heat || 0,
    i.lawnSnow || 0,
    i.phone || 0,
    i.cleaner || 0,
    i.extras || 0,
    i.baseRentForArbitrage || 0,
  ];

  // Validate that all values are non-negative
  for (const value of values) {
    if (value < 0) {
      throw new Error("Fixed monthly operating expenses cannot be negative.");
    }
  }

  return values.reduce((a, b) => a + b, 0);
}

/**
 * Calculates the total variable operating expense percentage.
 * @param i - Operating inputs with percentage values as decimals (e.g., 0.05 for 5%)
 * @returns Total variable expense percentage as a decimal (e.g., 0.15 for 15%)
 * @throws Error if percentages are negative or exceed 100%
 */
export function computeVariableExpensePct(i: OperatingInputs): number {
  const values = [
    i.mgmtPct || 0,
    i.repairsPct || 0,
    i.utilitiesPct || 0,
    i.capExPct || 0,
    i.opExPct || 0,
  ];

  // Validate that all values are non-negative and within reasonable bounds
  for (const value of values) {
    if (value < 0) {
      throw new Error(
        "Variable operating expense percentages cannot be negative.",
      );
    }
    if (value > 1) {
      throw new Error(
        "Variable operating expense percentages cannot exceed 100%.",
      );
    }
  }

  const pct = values.reduce((a, b) => a + b, 0);
  return pct;
}

/**
 * Calculates variable operating expenses in dollar amounts.
 * @param grossIncome - Gross income to apply percentage against (typically GPI)
 * @param i - Operating inputs with percentage values as decimals (e.g., 0.05 for 5%)
 * @returns Variable expenses in dollars
 * @throws Error if grossIncome is negative or percentages are invalid
 */
export function computeVariableExpenseDollars(
  grossIncome: number,
  i: OperatingInputs
): number {
  if (grossIncome < 0) {
    throw new Error("Gross income cannot be negative.");
  }
  
  const pct = computeVariableExpensePct(i);
  return grossIncome * pct;
}

/**
 * Calculates variable operating expenses from percentage inputs (0-100 format).
 * This is a convenience function for components that store percentages as 0-100 values.
 * @param grossIncome - Gross income to apply percentage against (typically GPI)
 * @param percentages - Object with percentage values in 0-100 format
 * @returns Variable expenses in dollars
 */
export function computeVariableExpenseFromPercentages(
  grossIncome: number,
  percentages: {
    management?: number;
    maintenance?: number;
    utilitiesPct?: number;
    capEx?: number;
    opEx?: number;
  }
): number {
  if (grossIncome < 0) {
    throw new Error("Gross income cannot be negative.");
  }

  const mgmt = (percentages.management || 0) / 100;
  const repairs = (percentages.maintenance || 0) / 100;
  const utilities = (percentages.utilitiesPct || 0) / 100;
  const capex = (percentages.capEx || 0) / 100;
  const opex = (percentages.opEx || 0) / 100;

  // Validate values
  const values = [mgmt, repairs, utilities, capex, opex];
  for (const value of values) {
    if (value < 0) {
      throw new Error("Variable expense percentages cannot be negative.");
    }
    if (value > 1) {
      throw new Error("Variable expense percentages cannot exceed 100%.");
    }
  }

  const pct = mgmt + repairs + utilities + capex + opex;
  return grossIncome * pct;
}

// Deprecated: Use computeVariableExpensePct instead
// Kept for backwards compatibility
export function computeVariableMonthlyOpsPct(i: OperatingInputs): number {
  return computeVariableExpensePct(i);
}

// Break‑even occupancy = (fixed + (includeVar ? var% * revenueAt100% : 0)) / revenueAt100%
export function breakEvenOccupancy({
  monthlyRevenueAt100,
  fixedMonthlyOps,
  variablePct,
  includeVariablePct,
}: {
  monthlyRevenueAt100: number;
  fixedMonthlyOps: number;
  variablePct: number;
  includeVariablePct: boolean;
}) {
  if (monthlyRevenueAt100 <= 0) {
    throw new Error(
      "Monthly revenue must be positive for break-even calculation.",
    );
  }
  const varCost = includeVariablePct ? variablePct * monthlyRevenueAt100 : 0;
  const breakEven = (fixedMonthlyOps + varCost) / monthlyRevenueAt100;
  return Math.max(0, Math.min(1, breakEven));
}

// BRRRR new CoC = (Annual CF post‑refi) / (Remaining cash in deal)
// Annual CF post‑refi = (post‑refi NOI * 12) - (new loan monthly * 12)
export function brrrrAnnualCashFlowPostRefi({
  monthlyRevenue,
  fixedMonthlyOps,
  variablePct,
  newLoanMonthly,
}: {
  monthlyRevenue: number;
  fixedMonthlyOps: number;
  variablePct: number;
  newLoanMonthly: number;
}) {
  if (
    monthlyRevenue < 0 ||
    fixedMonthlyOps < 0 ||
    variablePct < 0 ||
    newLoanMonthly < 0
  ) {
    throw new Error("Invalid inputs: all parameters must be non-negative.");
  }
  if (variablePct > 1) {
    throw new Error("Variable percentage cannot exceed 100%.");
  }

  const monthlyNOI =
    monthlyRevenue - fixedMonthlyOps - variablePct * monthlyRevenue;
  return monthlyNOI * 12 - newLoanMonthly * 12;
}
