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
  Checkbox,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import additionalInfo2Image from "../Additional Info-2.png";

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

const hoaOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const communityOptions = [
  { value: "age_restricted", label: "Age-restricted community" },
  { value: "gated", label: "Gated community" },
];

const guardOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const SellListAdditionalInfo2Page: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [hoaSelected, setHoaSelected] = useState<string>("");
  const [communityTypes, setCommunityTypes] = useState<string[]>([]);
  const [guardSelected, setGuardSelected] = useState<string>("");

  const handleNext = () => {
    if (!hoaSelected) return;
    const state = {
      ...prevState,
      hoa: hoaSelected,
      ...(hoaSelected === "yes" && {
        communityTypes,
        guard: guardSelected,
      }),
    };
    navigate("/sell-additional-info-3", { state });
  };
  const handleBack = () => {
    navigate("/sell-additional-info", { state: prevState });
  };
  const handleExit = () => navigate("/");

  const handleCommunityChange = (value: string) => {
    setCommunityTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

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
              Additional info
            </Typography>
            <LinearProgress
              variant="determinate"
              value={80}
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
          <LeftSection>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#1a365d", mb: 3 }}
            >
              Is your home part of a home owner's association (HOA)?
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
              <RadioGroup
                value={hoaSelected}
                onChange={(e) => setHoaSelected(e.target.value)}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                {hoaOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={
                      <Radio
                        sx={{
                          color: "#1a365d",
                          "&.Mui-checked": { color: "#1a365d" },
                        }}
                      />
                    }
                    label={option.label}
                    sx={{
                      margin: 0,
                      padding: "0.75rem",
                      borderRadius: 1,
                      border:
                        hoaSelected === option.value
                          ? "2px solid #1a365d"
                          : "1px solid #e5e7eb",
                      backgroundColor:
                        hoaSelected === option.value
                          ? "#f8fafc"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                        borderColor: "#1a365d",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {hoaSelected === "yes" && (
              <>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1a365d", mb: 2 }}
                >
                  Do any of these apply to your home?
                </Typography>

                <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
                  {communityOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={communityTypes.includes(option.value)}
                          onChange={() => handleCommunityChange(option.value)}
                          sx={{
                            color: "#1a365d",
                            "&.Mui-checked": { color: "#1a365d" },
                          }}
                        />
                      }
                      label={option.label}
                      sx={{
                        margin: 0,
                        padding: "0.75rem",
                        borderRadius: 1,
                        border: communityTypes.includes(option.value)
                          ? "2px solid #1a365d"
                          : "1px solid #e5e7eb",
                        backgroundColor: communityTypes.includes(option.value)
                          ? "#f8fafc"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                          borderColor: "#1a365d",
                        },
                      }}
                    />
                  ))}
                </FormControl>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#1a365d", mb: 2 }}
                >
                  Is there a guard at the entrance?
                </Typography>

                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <RadioGroup
                    value={guardSelected}
                    onChange={(e) => setGuardSelected(e.target.value)}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    {guardOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                          <Radio
                            sx={{
                              color: "#1a365d",
                              "&.Mui-checked": { color: "#1a365d" },
                            }}
                          />
                        }
                        label={option.label}
                        sx={{
                          margin: 0,
                          padding: "0.75rem",
                          borderRadius: 1,
                          border:
                            guardSelected === option.value
                              ? "2px solid #1a365d"
                              : "1px solid #e5e7eb",
                          backgroundColor:
                            guardSelected === option.value
                              ? "#f8fafc"
                              : "transparent",
                          "&:hover": {
                            backgroundColor: "#f8fafc",
                            borderColor: "#1a365d",
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </>
            )}
          </LeftSection>

          <RightSection>
            <ImageContainer>
              <img src={additionalInfo2Image} alt="Additional Info 2" />
            </ImageContainer>
          </RightSection>
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
          disabled={!hoaSelected || (hoaSelected === "yes" && !guardSelected)}
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

export default SellListAdditionalInfo2Page;
