import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

export const FeaturesOverview: React.FC = () => {
  return (
    <Card sx={{ mt: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1a365d" }}
        >
          Advanced Analysis Features
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
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
                "& .MuiAccordionSummary-root": { bgcolor: "#fafbfc" },
                "& .MuiAccordionDetails-root": { bgcolor: "#ffffff" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#1a365d" }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a365d" }}
                >
                  Advanced Scenarios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Multiple exit strategies (2, 5, 10 years)
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Refinance timing options and scenarios
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Tax benefits and deductions included
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Inflation adjustments over time
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: "#fafbfc" },
                "& .MuiAccordionDetails-root": { bgcolor: "#ffffff" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#1a365d" }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#1a365d", fontWeight: 600 }}
                >
                  Risk Analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Sensitivity analysis for key variables
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Stress testing with worst-case scenarios
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Confidence intervals for projections
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Risk scoring (1-10 scale) with recommendations
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box>
            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: "#fafbfc" },
                "& .MuiAccordionDetails-root": { bgcolor: "#ffffff" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#1a365d" }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#1a365d", fontWeight: 600 }}
                >
                  Market Intelligence
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Seasonal adjustment factors
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Local market condition analysis
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Live market data integration
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Comparative market analysis
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{
                "& .MuiAccordionSummary-root": { bgcolor: "#fafbfc" },
                "& .MuiAccordionDetails-root": { bgcolor: "#ffffff" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#1a365d" }} />}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#1a365d", fontWeight: 600 }}
                >
                  Data Management
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Scenario comparison and saving
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Export functionality (CSV, JSON, Reports)
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
                  - Cloud backup and sync
                </Typography>
                <Typography variant="body2" paragraph sx={{ color: "#666" }}>
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
