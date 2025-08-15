import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

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

const PreApprovalBasicInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: "",
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [softCheck, setSoftCheck] = useState(false);

  const handleBack = () => {
    navigate("/pre-approval");
  };

  const handleNext = () => {
    // Navigate to questions page with basic info
    const allAnswers = {
      ...((location.state as any)?.answers || {}),
      ...form,
      softCheck,
    };
    navigate("/pre-approval-questions", { state: { answers: allAnswers } });
  };

  const setFormField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isNextDisabled =
    !form.firstName ||
    !form.lastName ||
    !form.phoneNumber ||
    !form.emailAddress ||
    !form.streetAddress ||
    !form.city ||
    !form.state ||
    !form.zipCode;

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
                value={12.5}
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
                Basic Information
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#666", mb: 4, textAlign: "center" }}
              >
                Let's start with your basic contact information and current
                address.
              </Typography>

              {/* Personal Contact Information */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a365d", mb: 2, mt: 3 }}
              >
                Personal Contact Information
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="First name *"
                  value={form.firstName}
                  onChange={(e) => setFormField("firstName", e.target.value)}
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Last name *"
                  value={form.lastName}
                  onChange={(e) => setFormField("lastName", e.target.value)}
                  required
                  size="small"
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  mb: 4,
                }}
              >
                <TextField
                  fullWidth
                  label="Phone number *"
                  value={form.phoneNumber}
                  onChange={(e) => setFormField("phoneNumber", e.target.value)}
                  required
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Email address *"
                  type="email"
                  value={form.emailAddress}
                  onChange={(e) => setFormField("emailAddress", e.target.value)}
                  required
                  size="small"
                />
              </Box>

              {/* Current Address */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a365d", mb: 2, mt: 4 }}
              >
                Your current address
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Street address *"
                  value={form.streetAddress}
                  onChange={(e) =>
                    setFormField("streetAddress", e.target.value)
                  }
                  required
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Unit"
                  value={form.unit}
                  onChange={(e) => setFormField("unit", e.target.value)}
                  size="small"
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  mb: 4,
                }}
              >
                <TextField
                  fullWidth
                  label="City *"
                  value={form.city}
                  onChange={(e) => setFormField("city", e.target.value)}
                  required
                  size="small"
                />
                <Select
                  fullWidth
                  value={form.state}
                  onChange={(e) =>
                    setFormField("state", String(e.target.value))
                  }
                  displayEmpty
                  required
                  size="small"
                  sx={{ minHeight: "40px" }}
                >
                  <MenuItem value="" disabled>
                    State *
                  </MenuItem>
                  <MenuItem value="AL">Alabama</MenuItem>
                  <MenuItem value="AK">Alaska</MenuItem>
                  <MenuItem value="AZ">Arizona</MenuItem>
                  <MenuItem value="AR">Arkansas</MenuItem>
                  <MenuItem value="CA">California</MenuItem>
                  <MenuItem value="CO">Colorado</MenuItem>
                  <MenuItem value="CT">Connecticut</MenuItem>
                  <MenuItem value="DE">Delaware</MenuItem>
                  <MenuItem value="FL">Florida</MenuItem>
                  <MenuItem value="GA">Georgia</MenuItem>
                  <MenuItem value="HI">Hawaii</MenuItem>
                  <MenuItem value="ID">Idaho</MenuItem>
                  <MenuItem value="IL">Illinois</MenuItem>
                  <MenuItem value="IN">Indiana</MenuItem>
                  <MenuItem value="IA">Iowa</MenuItem>
                  <MenuItem value="KS">Kansas</MenuItem>
                  <MenuItem value="KY">Kentucky</MenuItem>
                  <MenuItem value="LA">Louisiana</MenuItem>
                  <MenuItem value="ME">Maine</MenuItem>
                  <MenuItem value="MD">Maryland</MenuItem>
                  <MenuItem value="MA">Massachusetts</MenuItem>
                  <MenuItem value="MI">Michigan</MenuItem>
                  <MenuItem value="MN">Minnesota</MenuItem>
                  <MenuItem value="MS">Mississippi</MenuItem>
                  <MenuItem value="MO">Missouri</MenuItem>
                  <MenuItem value="MT">Montana</MenuItem>
                  <MenuItem value="NE">Nebraska</MenuItem>
                  <MenuItem value="NV">Nevada</MenuItem>
                  <MenuItem value="NH">New Hampshire</MenuItem>
                  <MenuItem value="NJ">New Jersey</MenuItem>
                  <MenuItem value="NM">New Mexico</MenuItem>
                  <MenuItem value="NY">New York</MenuItem>
                  <MenuItem value="NC">North Carolina</MenuItem>
                  <MenuItem value="ND">North Dakota</MenuItem>
                  <MenuItem value="OH">Ohio</MenuItem>
                  <MenuItem value="OK">Oklahoma</MenuItem>
                  <MenuItem value="OR">Oregon</MenuItem>
                  <MenuItem value="PA">Pennsylvania</MenuItem>
                  <MenuItem value="RI">Rhode Island</MenuItem>
                  <MenuItem value="SC">South Carolina</MenuItem>
                  <MenuItem value="SD">South Dakota</MenuItem>
                  <MenuItem value="TN">Tennessee</MenuItem>
                  <MenuItem value="TX">Texas</MenuItem>
                  <MenuItem value="UT">Utah</MenuItem>
                  <MenuItem value="VT">Vermont</MenuItem>
                  <MenuItem value="VA">Virginia</MenuItem>
                  <MenuItem value="WA">Washington</MenuItem>
                  <MenuItem value="WV">West Virginia</MenuItem>
                  <MenuItem value="WI">Wisconsin</MenuItem>
                  <MenuItem value="WY">Wyoming</MenuItem>
                </Select>
                <TextField
                  fullWidth
                  label="ZIP Code *"
                  value={form.zipCode}
                  onChange={(e) => setFormField("zipCode", e.target.value)}
                  required
                  size="small"
                />
              </Box>
              <Box sx={{ mt: 2, mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={softCheck}
                      onChange={(e) => setSoftCheck(e.target.checked)}
                      sx={{ color: "#1a365d" }}
                    />
                  }
                  label="Soft credit check (no impact on credit score)"
                />
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
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  sx={{
                    backgroundColor: "#1a365d",
                    color: "white",
                    textTransform: "none",
                    flex: 1,
                    "&:disabled": {
                      backgroundColor: "#e0e0e0",
                      color: "#999",
                    },
                  }}
                >
                  Continue
                </Button>
              </Box>
            </CardContent>
          </QuestionCard>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalBasicInfoPage;
