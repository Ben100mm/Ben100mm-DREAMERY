import React from "react";
import { Box, Alert, Typography } from "@mui/material";
import { DealState } from "../types/deal";
import { ConfigCards } from "./ConfigCards";
import { brandColors } from "../theme";

interface GlobalConfigTabProps {
  dealState: DealState | null;
  updateDealState: (updates: Partial<DealState>) => void;
  handleResultsChange: <K extends keyof any>(
    calculatorType: K,
    results: any,
  ) => void;
  scenarios: any[];
  setScenarios: React.Dispatch<React.SetStateAction<any[]>>;
  allResults: any;
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }) => void;
}

export const GlobalConfigTab: React.FC<GlobalConfigTabProps> = ({
  dealState,
  updateDealState,
  handleResultsChange,
  scenarios,
  setScenarios,
  allResults,
  setSnackbar,
}) => {
  if (!dealState) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="body2">
          No deal data found. Please go back to the Underwrite page and click
          "Open Advanced Analysis" to load your deal data.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
      >
        Global Configuration
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
        Configure market conditions, exit strategies, risk factors, and manage
        scenarios
      </Typography>

      <ConfigCards
        dealState={dealState}
        updateDealState={updateDealState}
        scenarios={scenarios}
        setScenarios={setScenarios}
        allResults={allResults}
        setSnackbar={setSnackbar}
      />
    </Box>
  );
};
