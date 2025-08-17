import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { brandColors } from "../theme";
import { type DealState } from "../types/deal";

interface FeaturesOverviewProps {
  dealState?: DealState | null;
}

export const FeaturesOverview: React.FC<FeaturesOverviewProps> = ({ dealState }) => {
  return (
    <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid brandColors.borders.secondary" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 700, color: brandColors.primary }}
        >
          Advanced Analysis Features
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: brandColors.neutral.dark }}>
          Comprehensive tools for sophisticated real estate investment analysis
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Box>
            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: brandColors.backgrounds.secondary },
                "& .MuiAccordionDetails-root": { bgcolor: brandColors.backgrounds.primary },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: brandColors.primary }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: brandColors.primary }}
                >
                  Advanced Scenarios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Multiple exit strategies (2, 5, 10 years)
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Refinance timing options and scenarios
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Tax benefits and deductions included
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Inflation adjustments over time
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: brandColors.backgrounds.secondary },
                "& .MuiAccordionDetails-root": { bgcolor: brandColors.backgrounds.primary },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: brandColors.primary }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ color: brandColors.primary, fontWeight: 600 }}
                >
                  Risk Analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Risk Score Display with Color Coding */}
                {dealState?.riskScoreResults && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                      p: 2,
                      bgcolor: brandColors.backgrounds.warning,
                      borderRadius: 1,
                      border: `1px solid ${brandColors.accent.warning}`,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.neutral.dark }}>
                      Overall Risk Score:
                    </Typography>
                    <Chip
                      label={`${dealState.riskScoreResults.overallRiskScore}/10`}
                      color={
                        dealState.riskScoreResults.overallRiskScore <= 3
                          ? "success"
                          : dealState.riskScoreResults.overallRiskScore <= 5
                            ? "warning"
                            : "error"
                      }
                      variant="filled"
                      sx={{
                        color:
                          dealState.riskScoreResults.overallRiskScore > 5
                            ? "#d32f2f"
                            : brandColors.accent.success,
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    />
                    <Typography variant="body2" sx={{ color: brandColors.neutral.dark }}>
                      {dealState.riskScoreResults.riskCategory}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Sensitivity analysis for key variables
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Stress testing with worst-case scenarios
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Confidence intervals for projections
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Risk scoring (1-10 scale) with recommendations
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box>
            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: brandColors.backgrounds.secondary },
                "& .MuiAccordionDetails-root": { bgcolor: brandColors.backgrounds.primary },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: brandColors.primary }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ color: brandColors.primary, fontWeight: 600 }}
                >
                  Market Intelligence
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Seasonal adjustment factors
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Local market condition analysis
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Live market data integration
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Comparative market analysis
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: brandColors.backgrounds.secondary },
                "& .MuiAccordionDetails-root": { bgcolor: brandColors.backgrounds.primary },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: brandColors.primary }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ color: brandColors.primary, fontWeight: 600 }}
                >
                  Data Management
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Scenario comparison and saving
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Export functionality (CSV, JSON, Reports)
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Cloud backup and sync
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: brandColors.neutral.dark }}>
                  - Auto-save and version control
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
