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

const PageContainer = styled.div`
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
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
            <Typography variant="body2" sx={{ color: "#666666", mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={93}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1a365d",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Button
            onClick={handleExit}
            sx={{ color: "#666666", textTransform: "none" }}
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
              color: "#1a365d",
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
                    borderColor: "#e5e7eb",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1a365d",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1a365d",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666666",
                  "&.Mui-focused": {
                    color: "#1a365d",
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
                    borderColor: "#e5e7eb",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1a365d",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1a365d",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666666",
                  "&.Mui-focused": {
                    color: "#1a365d",
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
          backgroundColor: "white",
          px: { xs: "1rem", md: "2rem" },
          py: { xs: "0.75rem", md: "1rem" },
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #e0e0e0",
          zIndex: 5,
        }}
      >
        <Button
          onClick={handleBack}
          variant="outlined"
          sx={{
            borderColor: "#1a365d",
            color: "#1a365d",
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
            backgroundColor: "#1a365d",
            color: "white",
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
