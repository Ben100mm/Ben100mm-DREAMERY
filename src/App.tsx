import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import AuthPage from './pages/auth/AuthPage';
import Dashboard from './pages/Dashboard';
import SecuritySettings from './pages/SecuritySettings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/" element={
              <AppContainer>
                <Header />
                <Hero />
                <Navigation />
              </AppContainer>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;