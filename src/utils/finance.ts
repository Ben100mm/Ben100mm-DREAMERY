export type LoanSpec = {
  principal: number;           // loan amount
  annualRate: number;          // e.g. 0.075 for 7.5%
  termMonths: number;          // amortization length
  interestOnly?: boolean;      // default false
};

export function monthlyRate(annualRate: number) {
  return annualRate / 12;
}

// Standard PMT (positive number)
export function pmt(annualRate: number, nper: number, pv: number) {
  const r = monthlyRate(annualRate);
  if (nper <= 0) return 0;
  if (r === 0) return pv / nper;
  return (pv * r) / (1 - Math.pow(1 + r, -nper));
}

// Remaining principal after k payments on a fully-amortizing loan
// B_k = PV*(1+r)^k - PMT*[(1+r)^k - 1]/r
export function remainingPrincipalAfterPayments(spec: LoanSpec, paymentsMade: number) {
  const { principal: pv, annualRate, termMonths, interestOnly } = spec;
  if (pv <= 0) return 0;
  const k = Math.max(0, Math.min(termMonths, Math.floor(paymentsMade)));
  if (interestOnly) {
    return Math.max(0, pv);
  }
  const r = monthlyRate(annualRate);
  if (r === 0) {
    const principalPaid = (pv / termMonths) * k;
    return Math.max(0, pv - principalPaid);
  }
  const payment = pmt(annualRate, termMonths, pv);
  const pow = Math.pow(1 + r, k);
  const balance = pv * pow - payment * ((pow - 1) / r);
  return Math.max(0, balance);
}

// Total monthly debt service across new loan + Subject-To + Hybrid
export function totalMonthlyDebtService(params: {
  newLoanMonthly: number;
  subjectToMonthlyTotal?: number; // sum of all subj‑to payments
  hybridMonthly?: number;         // “loan 3” monthly pmt
}) {
  return (params.newLoanMonthly || 0)
    + (params.subjectToMonthlyTotal || 0)
    + (params.hybridMonthly || 0);
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
  const values: Array<number | undefined> = [
    i.taxes, i.insurance, i.hoa, i.gasElectric, i.internet, i.waterSewer,
    i.heat, i.lawnSnow, i.phone, i.cleaner, i.extras, i.baseRentForArbitrage
  ];
  return values.reduce((sum: number, val: number | undefined) => sum + (val ?? 0), 0);
}

export function computeVariableMonthlyOpsPct(i: OperatingInputs) {
  const pct = (i.mgmtPct || 0)
    + (i.repairsPct || 0)
    + (i.utilitiesPct || 0)
    + (i.capExPct || 0)
    + (i.opExPct || 0);
  return pct; // applied to revenue later
}

// Break‑even occupancy = (fixed + (includeVar ? var% * revenueAt100% : 0)) / revenueAt100%
export function breakEvenOccupancy({
  monthlyRevenueAt100,
  fixedMonthlyOps,
  variablePct,
  includeVariablePct
}: {
  monthlyRevenueAt100: number;
  fixedMonthlyOps: number;
  variablePct: number;
  includeVariablePct: boolean;
}) {
  if (monthlyRevenueAt100 <= 0) return 0;
  const varCost = includeVariablePct ? variablePct * monthlyRevenueAt100 : 0;
  return (fixedMonthlyOps + varCost) / monthlyRevenueAt100;
}

// BRRRR new CoC = (Annual CF post‑refi) / (Remaining cash in deal)
// Annual CF post‑refi = (post‑refi NOI * 12) - (new loan monthly * 12)
export function brrrrAnnualCashFlowPostRefi({
  monthlyRevenue,
  fixedMonthlyOps,
  variablePct,
  newLoanMonthly
}: {
  monthlyRevenue: number;
  fixedMonthlyOps: number;
  variablePct: number;
  newLoanMonthly: number;
}) {
  const monthlyNOI = monthlyRevenue - fixedMonthlyOps - (variablePct * monthlyRevenue);
  return (monthlyNOI * 12) - (newLoanMonthly * 12);
}


