import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Header: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pt: 3,
        pb: 2,
        zIndex: 9999,
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          px: 3,
        }}
      >
        <Button
          variant="text"
          sx={{
            color: '#1a365d',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            position: 'absolute',
            right: 32,
            top: -8,
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          Sign Up / Sign In
        </Button>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0,
            margin: '0 auto',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Dreamery Logo"
            sx={{ 
              height: 110,
              width: 'auto',
              marginRight: '-20px',
              transform: 'translateY(-2px)',
              filter: 'contrast(1.2) brightness(0.95)'
            }}
          />
          <Typography
            variant="h4"
            sx={{
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              fontSize: '3.2rem',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
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