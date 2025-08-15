import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import additionalInfo3Image from "../Additional Info-3.png";
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
  max-height: calc(100vh - 200px);
  overflow-y: auto;
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

const propertyConditions = [
  {
    value: "leased_solar",
    label: "Leased or financed solar panels",
    description:
      "Solar panels that are leased or financed through a third-party company",
  },
  {
    value: "foundation_issues",
    label: "Foundation issues",
    description:
      "Structural problems with the home's foundation that may affect stability",
  },
  {
    value: "fire_damage",
    label: "Fire damage",
    description: "Any damage to the property caused by fire, smoke, or heat",
  },
  {
    value: "septic_system",
    label: "Septic system",
    description:
      "On-site wastewater treatment system instead of municipal sewer connection",
  },
  {
    value: "asbestos_siding",
    label: "Asbestos siding",
    description: "Exterior siding containing asbestos, a hazardous material",
  },
  {
    value: "horse_property",
    label: "Horse property",
    description:
      "Property with facilities for keeping horses, including stables or pastures",
  },
  {
    value: "mobile_home",
    label: "Mobile or manufactured home",
    description: "Home that was built in a factory and transported to the site",
  },
  {
    value: "unique_ownership",
    label: "Unique ownership structure",
    description:
      "Unusual ownership arrangement such as co-ops, land trusts, or shared ownership",
  },
  {
    value: "bmr_program",
    label: "Part of a Below Market Rate (BMR) Ownership Program",
    description:
      "Affordable housing program with income restrictions and resale limitations",
  },
  {
    value: "rent_controlled",
    label: "Rent-controlled and has a tenant",
    description: "Property subject to rent control laws with existing tenants",
  },
  {
    value: "fuel_tanks",
    label: "Existing active or inactive underground fuel oil tanks",
    description:
      "Underground storage tanks for heating oil that may require environmental assessment",
  },
  {
    value: "cesspool",
    label: "Cesspool on property",
    description:
      "Underground pit for sewage disposal, older than septic systems",
  },
  {
    value: "none",
    label: "None of these apply to my home",
    description:
      "No special conditions or circumstances apply to this property",
  },
  {
    value: "other",
    label: "Other",
    description:
      "Any other special conditions or circumstances not listed above",
  },
];

const SellListAdditionalInfo3Page: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state || {};
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherDetails, setOtherDetails] = useState<string>("");

  const handleNext = () => {
    const state = {
      ...prevState,
      propertyConditions: selectedConditions,
      ...(selectedConditions.includes("other") && { otherDetails }),
    };
    navigate("/sell-contact-info", { state });
  };
  const handleBack = () => {
    navigate("/sell-additional-info-2", { state: prevState });
  };
  const handleExit = () => navigate("/");

  const handleConditionChange = (value: string) => {
    if (value === "none") {
      // If "None" is selected, clear all other selections
      setSelectedConditions(["none"]);
      setOtherDetails("");
    } else {
      setSelectedConditions((prev) => {
        // Remove 'none' if it was previously selected
        const withoutNone = prev.filter((item) => item !== "none");

        if (prev.includes(value)) {
          // Remove the condition if it was already selected
          const newSelection = withoutNone.filter((item) => item !== value);
          if (value === "other") {
            setOtherDetails("");
          }
          return newSelection;
        } else {
          // Add the condition
          return [...withoutNone, value];
        }
      });
    }
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
            <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
              Additional info
            </Typography>
            <LinearProgress
              variant="determinate"
              value={87}
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
              sx={{ fontWeight: 800, color: brandColors.primary, mb: 2 }}
            >
              To the best of your knowledge, do any of these apply to your home?
            </Typography>

            <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 3 }}>
              Select all that apply.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {propertyConditions.map((condition) => (
                <Box key={condition.value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedConditions.includes(condition.value)}
                        onChange={() => handleConditionChange(condition.value)}
                        sx={{
                          color: brandColors.primary,
                          "&.Mui-checked": { color: brandColors.primary },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography sx={{ color: brandColors.text.primary }}>
                          {condition.label}
                        </Typography>
                        <Tooltip title={condition.description} arrow>
                          <IconButton
                            size="small"
                            sx={{ color: brandColors.primary, p: 0 }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    sx={{
                      margin: 0,
                      padding: "0.75rem",
                      borderRadius: 1,
                      border: selectedConditions.includes(condition.value)
                        ? "2px solid brandColors.primary"
                        : "1px solid brandColors.borders.secondary",
                      backgroundColor: selectedConditions.includes(
                        condition.value,
                      )
                        ? "#f8fafc"
                        : "transparent",
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                        borderColor: brandColors.primary,
                      },
                    }}
                  />
                  {condition.value === "other" &&
                    selectedConditions.includes("other") && (
                      <Box sx={{ ml: 4, mt: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Please provide details about your specific situation..."
                          value={otherDetails}
                          onChange={(e) => setOtherDetails(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderColor: brandColors.borders.secondary,
                              "&:hover": {
                                borderColor: brandColors.primary,
                              },
                              "&.Mui-focused": {
                                borderColor: brandColors.primary,
                              },
                            },
                          }}
                        />
                      </Box>
                    )}
                </Box>
              ))}
            </Box>
          </LeftSection>

          <RightSection>
            <ImageContainer>
              <img src={additionalInfo3Image} alt="Additional Info 3" />
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
          disabled={
            selectedConditions.includes("other") && !otherDetails.trim()
          }
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

export default SellListAdditionalInfo3Page;
