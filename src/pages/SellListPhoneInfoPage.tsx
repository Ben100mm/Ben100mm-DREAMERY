import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Link,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { brandColors } from "../theme";

const PageContainer = styled.div`
  min-height: 100vh;
  background: brandColors.backgrounds.primary;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid brandColors.borders.secondary;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
`;

const SellListPhoneInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleNext = () => {
    if (!phoneNumber.trim()) return;
    navigate("/sell-summary", {
      state: {
        ...prevState,
        phoneNumber: phoneNumber.trim(),
      },
    });
  };
  const handleBack = () => {
    navigate("/sell-contact-info", { state: prevState });
  };
  const handleExit = () => navigate("/");

  return (
    <PageContainer>
      <HeaderSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: brandColors.borders.secondary,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: brandColors.primary,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Button
            onClick={handleExit}
            sx={{ color: brandColors.neutral.dark, textTransform: "none" }}
          >
            Exit
          </Button>
        </Box>
      </HeaderSection>

      <MainContent>
        <ContentWrapper>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: brandColors.primary,
              mb: 2,
              textAlign: "center",
            }}
          >
            What's your phone number?
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: brandColors.neutral.dark, mb: 4, textAlign: "center" }}
          >
            We'll send you a text so you can get help when you're ready. You
            don't need to reply.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="(555) 123-4567"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: brandColors.borders.secondary,
                  },
                  "&:hover fieldset": {
                    borderColor: brandColors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: brandColors.primary,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: brandColors.neutral.dark,
                  "&.Mui-focused": {
                    color: brandColors.primary,
                  },
                },
              }}
            />

            <Typography
              variant="body2"
              sx={{ color: brandColors.neutral.dark, fontSize: "0.875rem", lineHeight: 1.5 }}
            >
              By tapping "Next", you agree that Dreamery Group and its
              affiliates, and other real estate professionals may call/text you
              about your inquiry, which may involve use of automated means and
              prerecorded/artificial voices. You don't need to consent as a
              condition of buying any property, goods or services. Message/data
              rates may apply. You also agree to our{" "}
              <Link
                href="#"
                sx={{
                  color: brandColors.primary,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Terms of Use
              </Link>
              . We may share information about your recent and future site
              activity with your agent to help them understand what you're
              looking for in a home.
            </Typography>
          </Box>
        </ContentWrapper>
      </MainContent>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: brandColors.backgrounds.primary,
          px: { xs: "1rem", md: "2rem" },
          py: { xs: "0.75rem", md: "1rem" },
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid brandColors.borders.secondary",
          zIndex: 5,
        }}
      >
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderColor: brandColors.primary,
            color: brandColors.primary,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!phoneNumber.trim()}
          variant="contained"
          sx={{
            backgroundColor: brandColors.primary,
            color: brandColors.backgrounds.primary,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Next
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SellListPhoneInfoPage;
