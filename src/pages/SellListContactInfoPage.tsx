import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  TextField,
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

const SellListContactInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    navigate("/sell-phone-info", {
      state: {
        ...prevState,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });
  };
  const handleBack = () => {
    navigate("/sell-additional-info-3", { state: prevState });
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
              value={93}
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
              mb: 4,
              textAlign: "center",
            }}
          >
            What's your name?
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              variant="outlined"
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

            <TextField
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              variant="outlined"
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
          disabled={!firstName.trim() || !lastName.trim()}
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

export default SellListContactInfoPage;
