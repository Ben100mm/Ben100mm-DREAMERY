import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const ContentSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 0;
`;

const QuestionCard = styled(Card)`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PreApprovalPropertyFinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    address: "",
    income: "",
    credit: "",
  });

  const handleBack = () => {
    navigate("/pre-approval-financial", {
      state: { answers: location.state?.answers },
    });
  };

  const handleNext = () => {
    // Navigate to additional questions page with all collected data
    const allData = {
      ...(location.state?.answers || {}),
      ...form,
    };
    navigate("/pre-approval-additional-questions", {
      state: { answers: allData },
    });
  };

  const setFormField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isNextDisabled = !form.income || !form.credit;

  return (
    <PageContainer>
      {/* Header */}
      <HeaderSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ color: "#1a365d", fontWeight: 600 }}>
              Dreamery Home Loans
            </Typography>
          </Box>
          <Button
            onClick={handleBack}
            sx={{ color: "#666666", textTransform: "none" }}
          >
            Back
          </Button>
        </Box>
      </HeaderSection>

      {/* Main Content */}
      <ContentSection>
        <Container maxWidth="md" sx={{ width: "100%", py: { xs: 0.5, md: 1 } }}>
          <QuestionCard>
            <CardContent
              sx={{ p: { xs: 1.5, md: 3 }, flex: 1, overflow: "auto" }}
            >
              {/* Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={62.5}
                sx={{
                  mb: 2,
                  height: 6,
                  borderRadius: 1,
                  backgroundColor: "#e0e0e0",
                }}
              />

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1a365d",
                  mb: 2,
                  textAlign: "center",
                  fontSize: { xs: "1.25rem", md: "1.75rem" },
                }}
              >
                Property and Financial Details
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#666", mb: 4, textAlign: "center" }}
              >
                Help us understand your property preferences and financial
                situation to provide accurate estimates.
              </Typography>

              {/* Property Information */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a365d", mb: 2, mt: 3 }}
              >
                Property Information
              </Typography>
              <TextField
                fullWidth
                label="Property address (if you have one in mind)"
                value={form.address}
                onChange={(e) => setFormField("address", e.target.value)}
                size="small"
                helperText="Optional - you can add this later if you don't have a specific property yet"
                sx={{ mb: 3 }}
              />

              {/* Financial Information */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a365d", mb: 2, mt: 4 }}
              >
                Financial Information
              </Typography>
              <TextField
                fullWidth
                label="Annual income ($) *"
                type="number"
                value={form.income}
                onChange={(e) => setFormField("income", e.target.value)}
                required
                size="small"
                helperText="Your gross annual income before taxes"
                sx={{ mb: 3 }}
              />
              <Select
                fullWidth
                value={form.credit}
                onChange={(e) => setFormField("credit", String(e.target.value))}
                displayEmpty
                required
                size="small"
                sx={{ minHeight: "40px", mb: 4 }}
              >
                <MenuItem value="" disabled>
                  Select credit score range *
                </MenuItem>
                <MenuItem value="740+">740+</MenuItem>
                <MenuItem value="670-739">670-739</MenuItem>
                <MenuItem value="580-669">580-669</MenuItem>
                <MenuItem value="<580">{"<"}580</MenuItem>
              </Select>

              {/* Navigation Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    borderColor: "#1a365d",
                    color: "#1a365d",
                    textTransform: "none",
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  sx={{
                    backgroundColor: "#1a365d",
                    color: "white",
                    textTransform: "none",
                    flex: 1,
                    "&:disabled": {
                      backgroundColor: "#e0e0e0",
                      color: "#999",
                    },
                  }}
                >
                  Continue
                </Button>
              </Box>
            </CardContent>
          </QuestionCard>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalPropertyFinancialPage;
