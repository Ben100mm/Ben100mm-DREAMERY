import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
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
  Notifications as NotificationsIcon,
  Person,
  Support as SupportIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { brandColors } from "../theme";

const SellListPage: React.FC = () => {
  const location = useLocation();
  const address = location.state?.address || "";

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

  // Simple form state
  const [propertyAddress, setPropertyAddress] = useState(address);
  const [sellChecked, setSellChecked] = useState(false);
  const [listChecked, setListChecked] = useState(false);

  const handleNext = () => {
    console.log('Next clicked with:', { propertyAddress, sellChecked, listChecked });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.backgrounds.secondary }}>
      {/* CLEAN, SIMPLE HEADER */}
      <Box
        sx={{
          backgroundColor: brandColors.primary,
          color: 'white',
          py: 3,
          px: 4,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Dreamery - Sell Properties
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
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

      {/* SIMPLE CONTENT */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, color: brandColors.primary }}>
          Tell us a bit about your home
        </Typography>
        
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4, color: brandColors.text.secondary }}>
          Discover your home's potential selling price with our Showcase listing in just 3 minutes. 
          Start by entering your property's address below.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Enter your address"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            variant="outlined"
            size="medium"
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sellChecked}
                  onChange={(e) => setSellChecked(e.target.checked)}
                  sx={{ color: brandColors.primary }}
                />
              }
              label="Sell"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={listChecked}
                  onChange={(e) => setListChecked(e.target.checked)}
                  sx={{ color: brandColors.primary }}
                />
              }
              label="List"
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              sx={{
                backgroundColor: brandColors.primary,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: brandColors.secondary }
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SellListPage;
