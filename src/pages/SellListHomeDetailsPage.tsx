import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
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
  gap: 4rem;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ImageContainer = styled.div`
  width: 560px;
  height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 900px) {
    width: 360px;
    height: 360px;
  }
`;

const CounterRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Typography sx={{ color: "#333333", fontWeight: 600 }}>{label}</Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <IconButton
        onClick={() => onChange(Math.max(0, value - 1))}
        sx={{
          width: 36,
          height: 36,
          border: "1px solid #cbd5e1",
          borderRadius: "50%",
          color: "#1a365d",
        }}
      >
        <Remove />
      </IconButton>
      <Box
        sx={{
          width: 36,
          textAlign: "center",
          fontWeight: 700,
          color: "#1a365d",
        }}
      >
        {value}
      </Box>
      <IconButton
        onClick={() => onChange(value + 1)}
        sx={{
          width: 36,
          height: 36,
          border: "1px solid #cbd5e1",
          borderRadius: "50%",
          color: "#1a365d",
        }}
      >
        <Add />
      </IconButton>
    </Box>
  </Box>
);

const SellListHomeDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    address,
    sellChecked,
    listChecked,
    movingDetails,
    sellTiming,
    listTiming,
  } = location.state || {};

  const [homeType, setHomeType] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [fullBaths, setFullBaths] = useState(0);
  const [threeQuarterBaths, setThreeQuarterBaths] = useState(0);
  const [halfBaths, setHalfBaths] = useState(0);
  const [floors, setFloors] = useState(0);

  const handleNext = () => {
    navigate("/sell-home-details-2", {
      state: {
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming,
        listTiming,
        homeDetails: {
          homeType,
          squareFeet,
          yearBuilt,
          bedrooms,
          fullBaths,
          threeQuarterBaths,
          halfBaths,
          floors,
        },
      },
    });
  };

  const handleBack = () => {
    navigate("/sell-moving-details-2", {
      state: {
        address,
        sellChecked,
        listChecked,
        movingDetails,
        sellTiming,
        listTiming,
      },
    });
  };

  const handleExit = () => navigate("/");

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
          <Box sx={{ width: 260 }}>
            <Typography variant="body2" sx={{ color: "#666666", mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={27}
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
            sx={{ fontWeight: 800, color: "#1a365d", mb: 1 }}
          >
            Review your home details
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
            Update any missing or incorrect info.
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="home-type-label">Home type</InputLabel>
            <Select
              labelId="home-type-label"
              value={homeType}
              label="Home type"
              onChange={(e) => setHomeType(e.target.value)}
            >
              <MenuItem value={""}></MenuItem>
              <MenuItem value={"Single-family"}>Single-family</MenuItem>
              <MenuItem value={"Condo"}>Condo</MenuItem>
              <MenuItem value={"Townhouse"}>Townhouse</MenuItem>
              <MenuItem value={"Multi-family"}>Multi-family</MenuItem>
              <MenuItem value={"Manufactured"}>Manufactured</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="Square footage (above ground)"
            placeholder=""
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value)}
            sx={{ mb: 1.5 }}
          />
          <Typography
            variant="caption"
            sx={{ color: "#6b7280", display: "block", mb: 2 }}
          >
            Tip: Don’t include basements, non‑permitted additions, or non‑heated
            square footage.
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Year built"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            sx={{ mb: 3 }}
          />

          <CounterRow
            label="Bedrooms"
            value={bedrooms}
            onChange={setBedrooms}
          />
          <CounterRow
            label="Full bathrooms"
            value={fullBaths}
            onChange={setFullBaths}
          />
          <CounterRow
            label="3/4 bathrooms"
            value={threeQuarterBaths}
            onChange={setThreeQuarterBaths}
          />
          <CounterRow
            label="1/2 bathrooms"
            value={halfBaths}
            onChange={setHalfBaths}
          />
          <CounterRow
            label="Floors (above ground)"
            value={floors}
            onChange={setFloors}
          />
        </ContentWrapper>

        <ImageContainer>
          <img
            src={process.env.PUBLIC_URL + "/home-details-1.png"}
            alt="Home details"
          />
        </ImageContainer>
      </MainContent>

      {/* Footer with Navigation Buttons */}
      <Box
        sx={{
          px: { xs: "1rem", md: "2rem" },
          py: { xs: "1rem", md: "2rem" },
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #e0e0e0",
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

export default SellListHomeDetailsPage;
