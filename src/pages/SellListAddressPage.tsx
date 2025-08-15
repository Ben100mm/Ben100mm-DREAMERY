import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { ArrowBack, AttachMoney } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import housesImage from "../houses-watercolor.png";

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
  max-width: 800px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4rem;
`;

const LeftSection = styled.div`
  flex: 1;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HousesIllustration = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const SellListAddressPage: React.FC = () => {
  const [address, setAddress] = useState("");
  const [sellChecked, setSellChecked] = useState(false);
  const [listChecked, setListChecked] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (address.trim()) {
      navigate("/sell-moving-details", {
        state: {
          address: address.trim(),
          sellChecked,
          listChecked,
        },
      });
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <PageContainer>
      {/* Header with Progress Bar and Exit Button */}
      <HeaderSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 200 }}>
            <Typography variant="body2" sx={{ color: "#666666", mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={7}
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
            sx={{
              color: "#1a365d",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Exit
          </Button>
        </Box>
      </HeaderSection>

      {/* Main Content */}
      <MainContent>
        <ContentWrapper>
          <LeftSection>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#1a365d",
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Tell us a bit about your home
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#666",
                mb: 3,
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              Discover your home's potential selling price with our Showcase
              listing in just 3 minutes. Start by entering your property's
              address below.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f0f8ff",
                    border: "2px solid #e0e0e0",
                    fontSize: "1.1rem",
                    padding: "12px 16px",
                    "&:hover": {
                      borderColor: "#1a365d",
                    },
                    "&.Mui-focused": {
                      borderColor: "#1a365d",
                      backgroundColor: "white",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 16px",
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleNext();
                  }
                }}
              />

              <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sellChecked}
                      onChange={(e) => setSellChecked(e.target.checked)}
                      sx={{
                        color: "#1a365d",
                        "&.Mui-checked": {
                          color: "#1a365d",
                        },
                      }}
                    />
                  }
                  label="Sell"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                      color: "#333333",
                      fontWeight: 500,
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={listChecked}
                      onChange={(e) => setListChecked(e.target.checked)}
                      sx={{
                        color: "#1a365d",
                        "&.Mui-checked": {
                          color: "#1a365d",
                        },
                      }}
                    />
                  }
                  label="List"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                      color: "#333333",
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>
            </Box>
          </LeftSection>

          <RightSection>
            <HousesIllustration>
              <img src={housesImage} alt="Watercolor houses illustration" />
            </HousesIllustration>
          </RightSection>
        </ContentWrapper>
      </MainContent>

      {/* Footer with Next Button */}
      <Box
        sx={{
          px: { xs: "1rem", md: "2rem" },
          py: { xs: "1rem", md: "2rem" },
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!address.trim()}
          sx={{
            backgroundColor: "#1a365d",
            color: "white",
            px: 4,
            py: 1.5,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "1.1rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0d2340",
            },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#999",
            },
          }}
        >
          Next
        </Button>
      </Box>
    </PageContainer>
  );
};

export default SellListAddressPage;
