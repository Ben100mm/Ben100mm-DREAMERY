import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
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

const OptionCard = styled(Box)<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? brandColors.primary : brandColors.borders.secondary};
  background-color: ${props => props.$selected ? brandColors.primary50 : brandColors.backgrounds.primary};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;

  &:hover {
    border-color: ${brandColors.primary};
    background-color: ${props => props.$selected ? brandColors.primary50 : brandColors.backgrounds.secondary};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: 50px;
  }
`;

const PreApprovalHomePreferencesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    homeUse: "",
    homeType: "",
  });

  const questions = [
    {
      id: "homeUse",
      title: "How will you use your new home?",
      description:
        "Additional loan options may be available depending on the home's use.",
      options: [
        "Primary residence",
        "Secondary residence",
        "Investment property",
      ],
    },
    {
      id: "homeType",
      title: "What kind of home are you looking for?",
      options: ["Single family", "Townhome or condo", "Mobile or manufactured"],
    },
  ];

  const handleBack = () => {
    navigate("/pre-approval-questions");
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to the financial page with accumulated answers
      const allAnswers = {
        ...((location.state as any)?.answers || {}),
        ...answers,
      };
      navigate("/pre-approval-financial", { state: { answers: allAnswers } });
    }
  };

  const handleBackStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const currentQuestion = questions[step];
  const isNextDisabled = !answers[currentQuestion.id as keyof typeof answers];

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
                value={37.5}
                sx={{
                  mb: 2,
                  height: 6,
                  borderRadius: 1,
                  backgroundColor: brandColors.borders.secondary,
                }}
              />

              {/* Question */}
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: brandColors.primary, mb: 2 }}
              >
                {currentQuestion.title} *
              </Typography>

              {/* Description */}
              {currentQuestion.description && (
                <Typography variant="body2" sx={{ color: brandColors.neutral[800], mb: 3 }}>
                  {currentQuestion.description}
                </Typography>
              )}

              {/* Options */}
              <RadioGroup
                value={answers[currentQuestion.id as keyof typeof answers]}
                onChange={(e) =>
                  handleOptionSelect(currentQuestion.id, e.target.value)
                }
                sx={{ mb: 4 }}
              >
                {currentQuestion.options?.map((option, index) => (
                  <OptionCard
                    key={index}
                    $selected={answers[currentQuestion.id as keyof typeof answers] === option}
                    onClick={() =>
                      handleOptionSelect(currentQuestion.id, option)
                    }
                  >
                    <FormControlLabel
                      value={option}
                      control={<Radio sx={{ color: brandColors.primary }} />}
                      label={option}
                      sx={{
                        width: "100%",
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: brandColors.text.primary,
                        },
                      }}
                    />
                  </OptionCard>
                ))}
              </RadioGroup>

              {/* Navigation Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                {step > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBackStep}
                    sx={{
                      borderColor: brandColors.primary,
                      color: brandColors.primary,
                      textTransform: "none",
                    }}
                  >
                    Back
                  </Button>
                )}
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

export default PreApprovalHomePreferencesPage;
