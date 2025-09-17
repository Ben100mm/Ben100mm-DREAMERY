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
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import InfoIcon from "@mui/icons-material/Info";
import { brandColors } from "../theme";

const PageContainer = styled.div`
  height: 100vh;
  background: brandColors.backgrounds.primary;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  background: brandColors.backgrounds.primary;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid brandColors.borders.secondary;
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

const PreApprovalFinancialPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState({
    homePrice: "",
    monthlyPayment: "",
    upfrontCosts: "",
  });

  const questions = [
    {
      id: "homePrice",
      title: "How much are you planning to spend on your new home?",
      description: "If you're not sure, feel free to estimate.",
      type: "currency",
      required: true,
    },
    {
      id: "monthlyPayment",
      title: "How much are you willing to pay per month for a mortgage?",
      type: "currency",
      suffix: "/month",
      required: true,
      hasInfo: true,
      infoText:
        "This includes principal, interest, taxes, and insurance (PITI).",
    },
    {
      id: "upfrontCosts",
      title:
        "How much are you willing to spend upfront to cover your down payment and closing costs?",
      type: "currency",
      required: true,
      hasInfo: true,
      infoText:
        "This includes your down payment plus closing costs like appraisal, title insurance, and other fees.",
    },
  ];

  const handleBack = () => {
    navigate("/pre-approval-home-preferences", {
      state: { answers: location.state?.answers },
    });
  };

  const handleNext = () => {
    // Navigate to property financial page with all answers data
    const allAnswers = {
      ...location.state?.answers,
      ...answers,
    };
    navigate("/pre-approval-property-financial", {
      state: { answers: allAnswers },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setAnswers((prev) => ({ ...prev, [field]: numericValue }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const numValue = parseInt(value);
    if (isNaN(numValue)) return "";
    return numValue.toLocaleString("en-US");
  };

  const isNextDisabled =
    !answers.homePrice || !answers.monthlyPayment || !answers.upfrontCosts;

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
            <Typography variant="h6" sx={{ color: brandColors.primary, fontWeight: 600 }}>
              Dreamery Home Loans
            </Typography>
          </Box>
          <Button
            onClick={handleBack}
            sx={{ color: brandColors.neutral[800], textTransform: "none" }}
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
                value={50}
                sx={{
                  mb: 2,
                  height: 6,
                  borderRadius: 1,
                  backgroundColor: brandColors.borders.secondary,
                }}
              />

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: brandColors.primary,
                  mb: 2,
                  textAlign: "center",
                  fontSize: { xs: "1.25rem", md: "1.75rem" },
                }}
              >
                Financial Information
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: brandColors.neutral[800], mb: 4, textAlign: "center" }}
              >
                Help us understand your financial goals and budget.
              </Typography>

              {/* Questions */}
              <Box sx={{ display: "grid", gap: 3 }}>
                {questions.map((question, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: brandColors.primary }}
                      >
                        {question.title} *
                      </Typography>
                      {question.hasInfo && (
                        <Tooltip title={question.infoText} arrow>
                          <IconButton size="small" sx={{ color: brandColors.neutral[800] }}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    {question.description && (
                      <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 2 }}>
                        {question.description}
                      </Typography>
                    )}

                    <TextField
                      fullWidth
                      type="text"
                      value={
                        answers[question.id as keyof typeof answers]
                          ? `$ ${formatCurrency(answers[question.id as keyof typeof answers])}`
                          : ""
                      }
                      onChange={(e) => {
                        // Remove all non-numeric characters from the input
                        const rawValue = e.target.value.replace(/[^0-9]/g, "");
                        handleInputChange(question.id, rawValue);
                      }}
                      placeholder="$ 0"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: brandColors.neutral.light,
                          "&:hover": {
                            backgroundColor: brandColors.neutral[100],
                          },
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        endAdornment: question.suffix ? (
                          <InputAdornment position="end">
                            <Typography variant="body2" sx={{ color: brandColors.neutral[800] }}>
                              {question.suffix}
                            </Typography>
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    borderColor: brandColors.primary,
                    color: brandColors.primary,
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
                    backgroundColor: brandColors.primary,
                    color: brandColors.backgrounds.primary,
                    textTransform: "none",
                    flex: 1,
                    "&:disabled": {
                      backgroundColor: brandColors.borders.secondary,
                      color: "#999",
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </QuestionCard>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalFinancialPage;
