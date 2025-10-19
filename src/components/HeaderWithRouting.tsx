import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { brandColors, colorUtils } from "../theme";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate("/auth");
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
            right: 32,
            top: -8,
            backgroundColor: brandColors.surfaces.glass,
            padding: "8px 20px",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            boxShadow: colorUtils.shadow('0, 0, 0', 0.1, 4, 2),
            "&:hover": {
              backgroundColor: brandColors.surfaces.glassHover,
              boxShadow: colorUtils.shadow('0, 0, 0', 0.15, 8, 4),
            },
          }}
        >
          Sign Up / Sign In
        </Button>
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
              color: brandColors.text.inverse,
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
