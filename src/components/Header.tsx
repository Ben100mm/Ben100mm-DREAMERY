import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { brandColors, colorUtils } from "../theme";
import { Person, Notifications, Close } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { 
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  Help as SupportIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";

const Header: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleUserMenuClose = () => {
    setUserMenuOpen(false);
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleNotificationsClick = () => {
    handleUserMenuClose();
    navigate('/profile?tab=notifications');
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
        <Box
          sx={{
            position: "absolute",
            right: 32,
            top: -8,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
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
          onClick={handleUserMenuClick}
        >
          <Avatar sx={{ bgcolor: brandColors.secondary, width: 24, height: 24 }}>
            <Person sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography
            sx={{
              color: brandColors.secondary,
              fontWeight: 700,
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.95rem",
              letterSpacing: "0.3px",
              textShadow: "0 1px 1px rgba(255, 255, 255, 0.5)",
            }}
          >
            User Account
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            margin: "0 auto",
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

      {/* User Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
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
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleNotificationsClick}>
          <ListItemIcon>
            <Notifications fontSize="small" />
          </ListItemIcon>
          Notifications
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <Close fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

// New AppBar component for pages
export const PageAppBar: React.FC<{ 
  title: string; 
  showBackButton?: boolean; 
  onBackClick?: () => void;
  showMessages?: boolean;
  onToggleMessages?: () => void;
}> = ({ 
  title, 
  showBackButton = true, 
  onBackClick,
  showMessages = false,
  onToggleMessages
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
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

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 9999,
        backgroundColor: brandColors.primary,
        borderRadius: 0,
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: brandColors.text.inverse }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onToggleMessages && (
            <Tooltip title={showMessages ? "Hide Messages" : "Show Messages"}>
              <IconButton
                color="inherit"
                onClick={onToggleMessages}
                sx={{ 
                  backgroundColor: showMessages ? 'rgba(255, 255, 255, 0.2)' : 'transparent' 
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationsClick}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                J
              </Avatar>
            </IconButton>
          </Tooltip>

          {showBackButton && (
            <Tooltip title="Back to Home">
              <IconButton
                color="inherit"
                onClick={handleBackClick}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsMenuAnchor}
          open={Boolean(notificationsMenuAnchor)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 300,
            }
          }}
        >
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
            sx: {
              mt: 1,
              minWidth: 200,
            }
          }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SupportIcon fontSize="small" />
            </ListItemIcon>
            Support
          </MenuItem>
          <Divider />
                      <MenuItem onClick={() => navigate('/')}>
              <ListItemIcon>
                <Close fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
