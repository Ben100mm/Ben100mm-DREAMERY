/**
 * Results Section Component
 * Displays calculated deal metrics and results
 */

import React from "react";
import {
  Box,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatCurrency } from "./utils";

interface ResultsSectionProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  annualNOI: number;
  capRate: number;
  cocReturn: number;
  dscr: number;
  loanAmount: number;
  totalCashInvested: number;
  equity: number;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  monthlyIncome,
  monthlyExpenses,
  monthlyCashFlow,
  annualCashFlow,
  annualNOI,
  capRate,
  cocReturn,
  dscr,
  loanAmount,
  totalCashInvested,
  equity,
}) => {
  return (
    <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 700 }}>Deal Metrics & Results</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <TextField
              fullWidth
              label="Monthly Income"
              value={formatCurrency(monthlyIncome)}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Monthly Expenses"
              value={formatCurrency(monthlyExpenses)}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Monthly Cash Flow"
              value={formatCurrency(monthlyCashFlow)}
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input": {
                  color: monthlyCashFlow >= 0 ? "success.main" : "error.main",
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              fullWidth
              label="Annual Cash Flow"
              value={formatCurrency(annualCashFlow)}
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input": {
                  color: annualCashFlow >= 0 ? "success.main" : "error.main",
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              fullWidth
              label="Annual NOI"
              value={formatCurrency(annualNOI)}
              InputProps={{ readOnly: true }}
              helperText="Net Operating Income (before debt service)"
            />
            <TextField
              fullWidth
              label="Cap Rate"
              value={`${capRate.toFixed(2)}%`}
              InputProps={{ readOnly: true }}
              helperText="NOI ÷ Purchase Price"
            />
            <TextField
              fullWidth
              label="Cash on Cash Return"
              value={`${cocReturn.toFixed(2)}%`}
              InputProps={{ readOnly: true }}
              helperText="Annual Cash Flow ÷ Total Cash Invested"
              sx={{
                "& .MuiInputBase-input": {
                  color: cocReturn >= 0 ? "success.main" : "error.main",
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              fullWidth
              label="DSCR"
              value={dscr > 0 ? dscr.toFixed(2) : "N/A"}
              InputProps={{ readOnly: true }}
              helperText="Debt Service Coverage Ratio"
            />
            <TextField
              fullWidth
              label="Total Loan Amount"
              value={formatCurrency(loanAmount)}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Total Cash Invested"
              value={formatCurrency(totalCashInvested)}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Equity"
              value={formatCurrency(equity)}
              InputProps={{ readOnly: true }}
              helperText="Purchase Price - Loan Amount"
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

