import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Chip,
  Divider,
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

const PreApprovalResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || {};

  const handleBack = () => {
    navigate("/pre-approval-summary");
  };

  const handleComplete = () => {
    navigate("/mortgage");
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const num = parseInt(value.replace(/[^0-9]/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString();
  };

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
                value={100}
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
                Thank you for your information!
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#666", mb: 4, textAlign: "center" }}
              >
                We've received your pre-approval application and will be in
                touch soon.
              </Typography>

              {/* Information Summary */}
              <Box
                sx={{
                  backgroundColor: "#f8f9fa",
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a365d", mb: 2 }}
                >
                  Your Information Summary:
                </Typography>
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  {answers.firstName && answers.lastName && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Name:
                      </Typography>
                      <Chip
                        label={`${answers.firstName} ${answers.lastName}`}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.emailAddress && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Email:
                      </Typography>
                      <Chip
                        label={answers.emailAddress}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.phoneNumber && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Phone:
                      </Typography>
                      <Chip
                        label={answers.phoneNumber}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.streetAddress && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Current Address:
                      </Typography>
                      <Chip
                        label={`${answers.streetAddress}, ${answers.city}, ${answers.state} ${answers.zipCode}`}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.income && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Annual Income:
                      </Typography>
                      <Chip
                        label={`$${formatCurrency(answers.income)}`}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.credit && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Credit Score:
                      </Typography>
                      <Chip
                        label={answers.credit}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.journey && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Home-buying Journey:
                      </Typography>
                      <Chip
                        label={answers.journey}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.timeline && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Timeline:
                      </Typography>
                      <Chip
                        label={answers.timeline}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.location && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Location:
                      </Typography>
                      <Chip
                        label={answers.location}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.homeType && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Home Type:
                      </Typography>
                      <Chip
                        label={answers.homeType}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.homeUse && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Home Use:
                      </Typography>
                      <Chip
                        label={answers.homeUse}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.homePrice && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Target Home Price:
                      </Typography>
                      <Chip
                        label={`$${formatCurrency(answers.homePrice)}`}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.monthlyPayment && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Target Monthly Payment:
                      </Typography>
                      <Chip
                        label={`$${formatCurrency(answers.monthlyPayment)}/month`}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.upfrontCosts && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        Upfront Costs:
                      </Typography>
                      <Chip
                        label={`$${formatCurrency(answers.upfrontCosts)}`}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.isFirstTimeBuyer && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        First-time Buyer:
                      </Typography>
                      <Chip
                        label={answers.isFirstTimeBuyer}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                  {answers.isUSCitizen && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        US Citizen:
                      </Typography>
                      <Chip
                        label={answers.isUSCitizen}
                        size="small"
                        sx={{ backgroundColor: "#1a365d", color: "white" }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Next Steps */}
              <Box
                sx={{
                  backgroundColor: "#f0f4f8",
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a365d", mb: 2 }}
                >
                  Next Steps:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: "#666", m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Our team will review your information within 24 hours
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    You'll receive a personalized pre-approval letter
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    A loan officer will contact you to discuss your options
                  </Typography>
                  <Typography component="li" variant="body2">
                    You can start shopping for homes with confidence
                  </Typography>
                </Box>
              </Box>

              {/* Additional Information (What to Expect) */}
              <Box
                sx={{
                  backgroundColor: "#f8f9fa",
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a365d", mb: 2 }}
                >
                  What to Expect:
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  - Your pre-approval letter will include your maximum loan
                  amount and estimated monthly payment
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  - You'll receive personalized rate quotes based on your
                  financial profile
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  - Our loan officers are available to answer questions and
                  guide you through the process
                </Typography>
              </Box>

              {/* Action Button */}
              <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleComplete}
                  sx={{
                    backgroundColor: "#1a365d",
                    color: "white",
                    textTransform: "none",
                    flex: 1,
                  }}
                >
                  Return to Mortgage Page
                </Button>
              </Box>
            </CardContent>
          </QuestionCard>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalResultsPage;
