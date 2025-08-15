import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
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

const PreApprovalSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answers = location.state?.answers || {};

  const handleBack = () => {
    navigate("/pre-approval-additional-questions");
  };

  const handleSubmit = () => {
    navigate("/pre-approval-results", { state: { answers } });
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
                value={87.5}
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
                Get a Verified Pre-approval
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#666", mb: 4, textAlign: "center" }}
              >
                You'll get connected with a dedicated loan officer to verify
                you're on track, explore your loan options and upgrade to a
                Verified Pre-approval.
              </Typography>

              {/* Information Summary Preview */}
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
                  Application Summary:
                </Typography>
                <Box sx={{ display: "grid", gap: 1.5 }}>
                  {answers.firstName && answers.lastName && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Name:</strong> {answers.firstName}{" "}
                      {answers.lastName}
                    </Typography>
                  )}
                  {answers.emailAddress && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Email:</strong> {answers.emailAddress}
                    </Typography>
                  )}
                  {answers.phoneNumber && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Phone:</strong> {answers.phoneNumber}
                    </Typography>
                  )}
                  {answers.streetAddress && answers.city && answers.state && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Current Address:</strong> {answers.streetAddress},{" "}
                      {answers.city}, {answers.state} {answers.zipCode}
                    </Typography>
                  )}
                  {answers.income && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Annual Income:</strong> $
                      {(() => {
                        const num = parseInt(
                          answers.income.replace(/[^0-9]/g, ""),
                        );
                        return isNaN(num) ? "0" : num.toLocaleString();
                      })()}
                    </Typography>
                  )}
                  {answers.credit && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Credit Score:</strong> {answers.credit}
                    </Typography>
                  )}
                  {answers.journey && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Home-buying Journey:</strong> {answers.journey}
                    </Typography>
                  )}
                  {answers.timeline && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Timeline:</strong> {answers.timeline}
                    </Typography>
                  )}
                  {answers.location && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Target Location:</strong> {answers.location}
                    </Typography>
                  )}
                  {answers.homeType && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Home Type:</strong> {answers.homeType}
                    </Typography>
                  )}
                  {answers.homeUse && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Home Use:</strong> {answers.homeUse}
                    </Typography>
                  )}
                  {answers.homePrice && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Target Home Price:</strong> $
                      {(() => {
                        const num = parseInt(
                          answers.homePrice.replace(/[^0-9]/g, ""),
                        );
                        return isNaN(num) ? "0" : num.toLocaleString();
                      })()}
                    </Typography>
                  )}
                  {answers.monthlyPayment && (
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      <strong>Target Monthly Payment:</strong> $
                      {(() => {
                        const num = parseInt(
                          answers.monthlyPayment.replace(/[^0-9]/g, ""),
                        );
                        return isNaN(num) ? "0" : num.toLocaleString();
                      })()}
                      /month
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Next Steps */}
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: 2,
                  mb: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1a365d", mb: 1 }}
                >
                  Next Steps:
                </Typography>
                <Box component="ul" sx={{ pl: 2, color: "#666", m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Upload income documents
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Verify identity
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Connect bank statements
                  </Typography>
                  <Typography component="li" variant="body2">
                    Get connected with a loan officer
                  </Typography>
                </Box>
              </Box>

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
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: "#1a365d",
                    color: "white",
                    textTransform: "none",
                    flex: 1,
                  }}
                >
                  Submit Application
                </Button>
              </Box>
            </CardContent>
          </QuestionCard>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalSummaryPage;
