import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import additionalInfoImage from "../Additional Info.png";
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
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;

const LeftSection = styled.div`
  flex: 1;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ImageContainer = styled.div`
  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    object-fit: contain;
  }
`;

const countertopOptions = [
  { value: "solid_stone", label: "Solid stone slab (granite, quartz, marble)" },
  {
    value: "engineered_quartz",
    label: "Engineered quartz (Caesarstone, Silestone)",
  },
  { value: "granite_tile", label: "Granite tile" },
  { value: "corian", label: "Corian" },
  { value: "laminate", label: "Laminate/formica" },
  { value: "other_tile", label: "Other tile" },
  { value: "none", label: "None of the above" },
];

const SellListAdditionalInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [selected, setSelected] = useState<string>("");

  const handleNext = () => {
    if (!selected) return;
    navigate("/sell-additional-info-2", {
      state: { ...prevState, countertops: selected },
    });
  };
  const handleBack = () => {
    navigate("/sell-home-quality-4", { state: prevState });
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
              Additional info
            </Typography>
            <LinearProgress
              variant="determinate"
              value={73}
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
          <LeftSection>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: brandColors.primary, mb: 3 }}
            >
              What type of countertops are in the kitchen?
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <RadioGroup
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                {countertopOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        sx={{
                          color: brandColors.primary,
                          "&.Mui-checked": { color: brandColors.primary },
                        }}
                      />
                    }
                    label={option.label}
                    sx={{
                      margin: 0,
                      padding: "0.75rem",
                      borderRadius: 1,
                      border:
                        selected === option.value
                          ? "2px solid brandColors.primary"
                          : "1px solid brandColors.borders.secondary",
                      backgroundColor:
                        selected === option.value ? "#f8fafc" : "transparent",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                        borderColor: brandColors.primary,
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </LeftSection>

          <RightSection>
            <ImageContainer>
              <img src={additionalInfoImage} alt="Additional Info" />
            </ImageContainer>
          </RightSection>
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
          disabled={!selected}
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

export default SellListAdditionalInfoPage;
