import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  calculateTaxImplications,
  calculateInflationAdjustments,
  calculateSensitivityAnalysis,
  calculateStressTest,
  calculateRefinanceScenarios,
  TaxImplications,
  RefinanceScenario,
} from "../utils/advancedCalculations";
import {
  EnhancedNumberInput,
  EnhancedSelectWithValidation,
  EnhancedTextFieldWithValidation,
} from "./EnhancedFormComponents";
import { HelpTooltip, CompletionProgress, StatusChip } from "./UXComponents";
import { brandColors } from "../theme";

// Tax Implications Calculator (Production)
export const TaxImplicationsCalculator: React.FC<{
  onResultsChange?: (results: any) => void;
}> = ({ onResultsChange }) => {
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [imp, setImp] = useState<TaxImplications>({
    propertyTaxDeduction: true,
    mortgageInterestDeduction: true,
    depreciationDeduction: true,
    repairExpenseDeduction: true,
    taxBracket: 24,
  });
  const [expenses, setExpenses] = useState({
    mortgageInterest: 12000,
    propertyTax: 6000,
    depreciation: 8000,
    repairs: 3000,
  });
  const results = useMemo(
    () => calculateTaxImplications(annualIncome, expenses, imp),
    [annualIncome, expenses, imp],
  );
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
            Tax Implications
          </Typography>
          <HelpTooltip title="Configure deductions and income for after-tax results" />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          }}
        >
          <EnhancedNumberInput
            label="Annual Income"
            value={annualIncome}
            onChange={setAnnualIncome}
            format="currency"
            min={0}
          />
          <EnhancedNumberInput
            label="Tax Bracket (%)"
            value={imp.taxBracket}
            onChange={(v) => setImp((p) => ({ ...p, taxBracket: v }))}
            format="percentage"
            min={0}
            max={50}
          />
          <EnhancedNumberInput
            label="Mortgage Interest"
            value={expenses.mortgageInterest}
            onChange={(v) =>
              setExpenses((p) => ({ ...p, mortgageInterest: v }))
            }
            format="currency"
          />
          <EnhancedNumberInput
            label="Property Tax"
            value={expenses.propertyTax}
            onChange={(v) => setExpenses((p) => ({ ...p, propertyTax: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Depreciation"
            value={expenses.depreciation}
            onChange={(v) => setExpenses((p) => ({ ...p, depreciation: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Repairs"
            value={expenses.repairs}
            onChange={(v) => setExpenses((p) => ({ ...p, repairs: v }))}
            format="currency"
          />
          <FormControlLabel
            control={
              <Switch
                checked={imp.propertyTaxDeduction}
                onChange={(e) =>
                  setImp((p) => ({
                    ...p,
                    propertyTaxDeduction: e.target.checked,
                  }))
                }
              />
            }
            label="Property Tax Deduction"
          />
          <FormControlLabel
            control={
              <Switch
                checked={imp.mortgageInterestDeduction}
                onChange={(e) =>
                  setImp((p) => ({
                    ...p,
                    mortgageInterestDeduction: e.target.checked,
                  }))
                }
              />
            }
            label="Mortgage Interest Deduction"
          />
          <FormControlLabel
            control={
              <Switch
                checked={imp.depreciationDeduction}
                onChange={(e) =>
                  setImp((p) => ({
                    ...p,
                    depreciationDeduction: e.target.checked,
                  }))
                }
              />
            }
            label="Depreciation Deduction"
          />
          <FormControlLabel
            control={
              <Switch
                checked={imp.repairExpenseDeduction}
                onChange={(e) =>
                  setImp((p) => ({
                    ...p,
                    repairExpenseDeduction: e.target.checked,
                  }))
                }
              />
            }
            label="Repair Expense Deduction"
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: brandColors.backgrounds.secondary,
            borderRadius: 1,
            border: "1px solid brandColors.borders.secondary",
          }}
        >
          <Typography variant="body2">
            Taxable Income: ${results.taxableIncome.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Tax Savings: ${results.taxSavings.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Effective Tax Rate: {(results.effectiveTaxRate * 100).toFixed(1)}%
          </Typography>
          <Typography variant="body2">
            Net Income: ${results.netIncome.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Refinance Scenarios Calculator (Production)
export const RefinanceScenariosCalculator: React.FC<{
  onResultsChange?: (results: any) => void;
}> = ({ onResultsChange }) => {
  const [currentLoan, setCurrentLoan] = useState({
    balance: 250000,
    rate: 6.5,
    term: 30,
    monthlyPayment: 1580,
  });
  const [propertyValue, setPropertyValue] = useState(350000);
  const [scenarios, setScenarios] = useState<RefinanceScenario[]>([
    {
      timing: 2,
      newRate: 5.5,
      newTerm: 30,
      refinanceCosts: 5000,
      cashOutAmount: 0,
    },
    {
      timing: 5,
      newRate: 5.0,
      newTerm: 25,
      refinanceCosts: 5000,
      cashOutAmount: 25000,
    },
  ]);
  const results = useMemo(
    () => calculateRefinanceScenarios(currentLoan, scenarios, propertyValue),
    [currentLoan, scenarios, propertyValue],
  );
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
            Refinance Scenarios
          </Typography>
          <HelpTooltip title="Compare different refi timing and terms" />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          }}
        >
          <EnhancedNumberInput
            label="Current Balance"
            value={currentLoan.balance}
            onChange={(v) => setCurrentLoan((p) => ({ ...p, balance: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Current Rate (%)"
            value={currentLoan.rate}
            onChange={(v) => setCurrentLoan((p) => ({ ...p, rate: v }))}
            format="percentage"
            min={0}
            max={20}
            step={0.125}
          />
          <EnhancedNumberInput
            label="Current Term (yrs)"
            value={currentLoan.term}
            onChange={(v) => setCurrentLoan((p) => ({ ...p, term: v }))}
            min={1}
            max={50}
          />
          <EnhancedNumberInput
            label="Property Value"
            value={propertyValue}
            onChange={setPropertyValue}
            format="currency"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          {results.map((r: any, idx: number) => (
            <Box
              key={idx}
              sx={{ p: 1, border: "1px solid brandColors.borders.secondary", borderRadius: 1, mb: 1 }}
            >
              <Typography variant="body2">
                Timing: {r.timing} yrs, New Pmt: $
                {r.newMonthlyPayment.toLocaleString()}, Monthly Savings: $
                {r.monthlySavings.toLocaleString()}, Break-even:{" "}
                {r.breakEvenMonths.toFixed(1)} mo, Cash Out: $
                {r.cashOutAmount.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Sensitivity Analysis Calculator (Production)
export const SensitivityAnalysisCalculator: React.FC<{
  onResultsChange?: (results: any) => void;
}> = ({ onResultsChange }) => {
  const [base, setBase] = useState({
    monthlyRent: 2500,
    monthlyExpenses: 1500,
    propertyValue: 350000,
    monthlyCashFlow: 1000,
  });
  const [variations, setVariations] = useState([
    { rentChange: -10, expenseChange: 10, valueChange: -5 },
    { rentChange: 0, expenseChange: 0, valueChange: 0 },
    { rentChange: 10, expenseChange: -5, valueChange: 5 },
  ]);
  const results = useMemo(
    () => calculateSensitivityAnalysis(base, variations),
    [base, variations],
  );
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
            Sensitivity Analysis
          </Typography>
          <HelpTooltip title="See cash flow changes with rent/expense/value shifts" />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          }}
        >
          <EnhancedNumberInput
            label="Base Rent"
            value={base.monthlyRent}
            onChange={(v) => setBase((p) => ({ ...p, monthlyRent: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Base Expenses"
            value={base.monthlyExpenses}
            onChange={(v) => setBase((p) => ({ ...p, monthlyExpenses: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Property Value"
            value={base.propertyValue}
            onChange={(v) => setBase((p) => ({ ...p, propertyValue: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Base Cash Flow"
            value={base.monthlyCashFlow}
            onChange={(v) => setBase((p) => ({ ...p, monthlyCashFlow: v }))}
            format="currency"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          {results.map((r: any, i: number) => (
            <Box
              key={i}
              sx={{ p: 1, border: "1px solid brandColors.borders.secondary", borderRadius: 1, mb: 1 }}
            >
              <Typography variant="body2">
                {r.scenario}: Cash Flow {r.adjustedCashFlow.toFixed(0)} (
                {r.cashFlowChangePercent.toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Stress Testing Calculator (Production)
export const StressTestingCalculator: React.FC<{
  onResultsChange?: (results: any) => void;
}> = ({ onResultsChange }) => {
  const [base, setBase] = useState({
    monthlyRent: 2500,
    monthlyExpenses: 1500,
    propertyValue: 350000,
    monthlyCashFlow: 1000,
    annualRoi: 3.4,
  });
  const [stress, setStress] = useState({
    rentDrop: 20,
    expenseIncrease: 25,
    valueDrop: 15,
    vacancyIncrease: 30,
  });
  const results = useMemo(
    () => calculateStressTest(base, stress),
    [base, stress],
  );
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
            Stress Testing
          </Typography>
          <HelpTooltip title="Worst-case impacts to cash flow and ROI" />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          }}
        >
          <EnhancedNumberInput
            label="Rent Drop (%)"
            value={stress.rentDrop}
            onChange={(v) => setStress((p) => ({ ...p, rentDrop: v }))}
            format="percentage"
            min={0}
            max={50}
            step={5}
          />
          <EnhancedNumberInput
            label="Expense Increase (%)"
            value={stress.expenseIncrease}
            onChange={(v) => setStress((p) => ({ ...p, expenseIncrease: v }))}
            format="percentage"
            min={0}
            max={100}
            step={5}
          />
          <EnhancedNumberInput
            label="Value Drop (%)"
            value={stress.valueDrop}
            onChange={(v) => setStress((p) => ({ ...p, valueDrop: v }))}
            format="percentage"
            min={0}
            max={50}
            step={5}
          />
          <EnhancedNumberInput
            label="Vacancy Increase (%)"
            value={stress.vacancyIncrease}
            onChange={(v) => setStress((p) => ({ ...p, vacancyIncrease: v }))}
            format="percentage"
            min={0}
            max={100}
            step={5}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <StatusChip
            status={
              results.riskLevel === "Low"
                ? "success"
                : results.riskLevel === "Critical"
                  ? "error"
                  : "warning"
            }
            label={`Risk: ${results.riskLevel}`}
          />
          <Typography variant="body2">
            Stress Cash Flow: ${results.stressTestCashFlow.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Stress ROI: {results.stressTestRoi.toFixed(1)}%
          </Typography>
          <Typography variant="body2">
            Cash Flow Buffer: {(results.cashFlowBuffer * 100).toFixed(1)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Inflation Adjustments Calculator (Production)
export const InflationAdjustmentsCalculator: React.FC<{
  onResultsChange?: (results: any) => void;
}> = ({ onResultsChange }) => {
  const [base, setBase] = useState({
    rent: 2500,
    expenses: 1500,
    propertyValue: 350000,
  });
  const [rate, setRate] = useState(2.5);
  const [years, setYears] = useState(10);
  const results = useMemo(
    () => calculateInflationAdjustments(base, rate, years),
    [base, rate, years],
  );
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.primary }}>
            Inflation Adjustments
          </Typography>
          <HelpTooltip title="Project forward with inflation for key amounts" />
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          <EnhancedNumberInput
            label="Monthly Rent"
            value={base.rent}
            onChange={(v) => setBase((p) => ({ ...p, rent: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Monthly Expenses"
            value={base.expenses}
            onChange={(v) => setBase((p) => ({ ...p, expenses: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Property Value"
            value={base.propertyValue}
            onChange={(v) => setBase((p) => ({ ...p, propertyValue: v }))}
            format="currency"
          />
          <EnhancedNumberInput
            label="Inflation Rate (%)"
            value={rate}
            onChange={setRate}
            format="percentage"
            min={0}
            max={20}
            step={0.1}
          />
          <EnhancedNumberInput
            label="Years"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
          />
        </Box>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: brandColors.backgrounds.secondary,
            borderRadius: 1,
            border: "1px solid brandColors.borders.secondary",
          }}
        >
          <Typography variant="body2">
            Adjusted Rent: ${results.adjustedRent.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Adjusted Expenses: ${results.adjustedExpenses.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Adjusted Property Value: $
            {results.adjustedPropertyValue.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
