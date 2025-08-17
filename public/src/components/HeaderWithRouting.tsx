import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { brandColors } from "../theme";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAuthClick = () => {
    navigate("/auth");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pt: 3,
        pb: 2,
        zIndex: 9999,
        borderRadius: 0,
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          px: 3,
        }}
      >
        {/* Left side - Auth button */}
        <Button
          onClick={handleAuthClick}
          variant="text"
          sx={{
            color: brandColors.secondary,
            fontWeight: 700,
            textTransform: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.95rem",
            letterSpacing: "0.3px",
            textShadow: "0 1px 1px rgba(255, 255, 255, 0.5)",
            position: "absolute",
            left: 32,
            top: -8,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            padding: "8px 20px",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          Sign Up / Sign In
        </Button>

        {/* Center - Logo */}
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            margin: "0 auto",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
            transition: "opacity 0.2s ease",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Dreamery Logo"
            sx={{
              height: 110,
              width: "auto",
              marginRight: "-20px",
              transform: "translateY(-2px)",
              filter: "brightness(0) invert(1)",
            }}
          />
          <Typography
            variant="h4"
            sx={{
              color: "#FFFFFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 900,
              letterSpacing: "-1px",
              fontSize: "3.2rem",
              textTransform: "uppercase",
              textShadow: "2px 2px 8px rgba(0, 0, 0, 0.4)",
              filter: "brightness(1.1)",
            }}
          >
            DREAMERY
          </Typography>
        </Box>

        {/* Right side - Profile Avatar */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: "absolute",
            right: 32,
            top: -8,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            padding: "12px",
            borderRadius: "50%",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: brandColors.primary,
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            JH
          </Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              minWidth: 200,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: 2,
            }
          }}
        >
          <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Profile Settings
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <Typography variant="body2">
              Account Preferences
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <Typography variant="body2">
              Help & Support
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <Typography variant="body2" color="error">
              Sign Out
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
