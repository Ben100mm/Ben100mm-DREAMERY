import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { AdvancedAnalysisDashboard } from "./AdvancedCalculations";
import { brandColors } from "../theme";

interface OverviewTabProps {
  dealState: any;
  allResults: any;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  dealState,
  allResults,
}) => {
  if (!dealState) {
    return (
      <Box>
        <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
          No deal data found. Please go back to the Underwrite page and click
          "Open Advanced Analysis" to load your deal data.
        </Typography>
      </Box>
    );
  }

  // Helper function to render financing details
  const renderFinancingDetails = () => {
    if (!dealState.offerType) return null;

    const hasBalloonPayment = (loan: any) => {
      return loan?.balloonDue && loan.balloonDue > 0;
    };

    const getBalloonPaymentInfo = (loan: any, label: string) => {
      if (!hasBalloonPayment(loan)) return null;
      return (
        <Box
          key={label}
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <Chip
            label={`${label}: Balloon in loan.balloonDue years`}
            size="small"
            color="warning"
            variant="outlined"
          />
        </Box>
      );
    };

    switch (dealState.offerType) {
      case "Seller Finance":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Seller Finance Details
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography variant="body2">
                <strong>Loan Amount:</strong> $
                {dealState.loan?.loanAmount?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Interest Rate:</strong>{" "}
                {dealState.loan?.annualInterestRate || 0}%
              </Typography>
              <Typography variant="body2">
                <strong>Monthly Payment:</strong> $
                {dealState.loan?.monthlyPayment?.toLocaleString() || 0}
              </Typography>
              {dealState.loan?.interestOnly && (
                <Chip
                  label="Interest Only"
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
              {getBalloonPaymentInfo(dealState.loan, "Seller Finance")}
            </Box>
          </Box>
        );

      case "Subject To Existing Mortgage":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Subject-To Financing Details
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography variant="body2">
                <strong>Total Balance:</strong> $
                {dealState.subjectTo?.totalLoanBalance?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Total Monthly Payment:</strong> $
                {dealState.subjectTo?.totalMonthlyPayment?.toLocaleString() ||
                  0}
              </Typography>
              {dealState.subjectTo?.loans?.map((loan: any, index: number) =>
                getBalloonPaymentInfo(loan, `Loan ${index + 1}`),
              )}
            </Box>
          </Box>
        );

      case "Hybrid":
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Hybrid Financing Details
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography variant="body2">
                <strong>Total Loan Balance:</strong> $
                {dealState.hybrid?.totalLoanBalance?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Total Monthly Payment:</strong> $
                {dealState.hybrid?.totalMonthlyPayment?.toLocaleString() || 0}
              </Typography>
              {dealState.hybrid?.interestOnly && (
                <Chip
                  label="Interest Only"
                  size="small"
                  color="info"
                  variant="outlined"
                />
              )}
              {getBalloonPaymentInfo(dealState.hybrid, "Hybrid Loan 3")}
              {dealState.hybrid?.subjectToLoans?.map(
                (loan: any, index: number) =>
                  getBalloonPaymentInfo(loan, `Subject-To Loan ${index + 1}`),
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
      >
        Advanced Calculations Overview
      </Typography>
      <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
        Welcome to the Advanced Calculations Suite. This comprehensive tool
        provides sophisticated analysis for your real estate investments.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <Box>
          <Card sx={{ height: "100%", backgroundColor: brandColors.backgrounds.secondary }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
              >
                Deal Information
              </Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2">
                  <strong>Property Type:</strong> {dealState.propertyType}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {dealState.city}, {dealState.state}
                </Typography>
                <Typography variant="body2">
                  <strong>Purchase Price:</strong> $
                  {dealState.purchasePrice?.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Operation Type:</strong> {dealState.operationType}
                </Typography>
                {dealState.offerType && (
                  <Typography variant="body2">
                    <strong>Financing Type:</strong> {dealState.offerType}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: "100%", backgroundColor: brandColors.backgrounds.hover }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: brandColors.primary, mb: 2 }}
              >
                Quick Actions
              </Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography variant="body2">
                  - Configure market conditions in Global Configuration
                </Typography>
                <Typography variant="body2">
                  - Set up exit strategies for different timeframes
                </Typography>
                <Typography variant="body2">
                  - Analyze risk factors and get scoring
                </Typography>
                <Typography variant="body2">
                  - Save scenarios for comparison
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Financing Details Section */}
      {dealState.offerType &&
        ["Seller Finance", "Subject To Existing Mortgage", "Hybrid"].includes(
          dealState.offerType,
        ) && (
          <Box sx={{ mt: 3 }}>
            <Card
              sx={{ backgroundColor: brandColors.backgrounds.warning, border: "1px solid brandColors.accent.warning" }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.neutral[800], mb: 2 }}
                >
                  Financing Details & Balloon Payment Information
                </Typography>
                {renderFinancingDetails()}
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="caption"
                  sx={{ color: brandColors.neutral[800], fontStyle: "italic" }}
                >
                  Balloon payment terms are now integrated for advanced
                  financial modeling and risk analysis.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

      <Box sx={{ mt: 3 }}>
        <AdvancedAnalysisDashboard allResults={allResults} />
      </Box>
    </Box>
  );
};
