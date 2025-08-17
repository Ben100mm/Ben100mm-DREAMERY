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
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { 
  ArrowBack, 
  AttachMoney,
  Notifications as NotificationsIcon,
  Person,
  Support as SupportIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import housesImage from "../houses-watercolor.png";
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

  // AppBar state
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setNotificationsMenuAnchor(null);
    setUserMenuAnchor(null);
  };

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



  return (
    <PageContainer>
      {/* APP BAR */}
      <Box
        sx={{
          backgroundColor: brandColors.primary,
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Dreamery - Sell Properties
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleNotificationsClick}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton
            onClick={handleUserMenuClick}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              J
            </Avatar>
          </IconButton>
          
          <IconButton
            onClick={() => window.history.back()}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsMenuAnchor}
          open={Boolean(notificationsMenuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: { mt: 1, minWidth: 300 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${brandColors.borders.secondary}` }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          <MenuItem onClick={handleCloseMenu}>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: { mt: 1, minWidth: 200 }
          }}
        >
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <SupportIcon fontSize="small" />
            </ListItemIcon>
            Support
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseMenu}>
            <ListItemIcon>
              <CloseIcon fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Box>

      {/* Header with Progress Bar */}
      <HeaderSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 200 }}>
            <Typography variant="body2" sx={{ color: brandColors.neutral.dark, mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={7}
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
                color: brandColors.primary,
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Tell us a bit about your home
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: brandColors.neutral.dark,
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
                    backgroundColor: brandColors.backgrounds.hover,
                    border: "2px solid brandColors.borders.secondary",
                    fontSize: "1.1rem",
                    padding: "12px 16px",
                    "&:hover": {
                      borderColor: brandColors.primary,
                    },
                    "&.Mui-focused": {
                      borderColor: brandColors.primary,
                      backgroundColor: brandColors.backgrounds.primary,
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
                        color: brandColors.primary,
                        "&.Mui-checked": {
                          color: brandColors.primary,
                        },
                      }}
                    />
                  }
                  label="Sell"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                      color: brandColors.text.primary,
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
                        color: brandColors.primary,
                        "&.Mui-checked": {
                          color: brandColors.primary,
                        },
                      }}
                    />
                  }
                  label="List"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "16px",
                      color: brandColors.text.primary,
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
          borderTop: "1px solid brandColors.borders.secondary",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!address.trim()}
          sx={{
            backgroundColor: brandColors.primary,
            color: brandColors.backgrounds.primary,
            px: 4,
            py: 1.5,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "1.1rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: brandColors.secondary,
            },
            "&:disabled": {
              backgroundColor: brandColors.borders.secondary,
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
