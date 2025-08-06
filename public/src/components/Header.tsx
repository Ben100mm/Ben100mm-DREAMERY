import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  img {
    height: 40px;
    margin-right: 12px;
  }
  
  h1 {
    color: #1a365d;
    font-weight: 700;
    font-size: 1.5rem;
    margin: 0;
  }
`;

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleSecurityClick = () => {
    navigate('/security');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo onClick={handleLogoClick}>
          <img src="/logo.png" alt="Dreamery" />
          <Typography variant="h4" component="h1">
            DREAMERY
          </Typography>
        </Logo>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated && user?.isEmailVerified && (
            <Button
              variant="outlined"
              onClick={handleSecurityClick}
              sx={{
                color: '#1a365d',
                borderColor: '#1a365d',
                '&:hover': {
                  borderColor: '#0d2340',
                  backgroundColor: 'rgba(26, 54, 93, 0.04)',
                },
              }}
            >
              Security
            </Button>
          )}
          
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: '#1a365d', width: 32, height: 32 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Button
                variant="contained"
                onClick={handleAuthClick}
                sx={{
                  backgroundColor: '#1a365d',
                  '&:hover': { backgroundColor: '#0d2340' },
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  color: '#1a365d',
                  borderColor: '#1a365d',
                  '&:hover': {
                    borderColor: '#0d2340',
                    backgroundColor: 'rgba(26, 54, 93, 0.04)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleAuthClick}
              sx={{
                backgroundColor: '#1a365d',
                '&:hover': { backgroundColor: '#0d2340' },
              }}
            >
              Sign Up / Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 