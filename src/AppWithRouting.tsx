import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/HeaderWithRouting';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import AuthPage from './pages/AuthPage';
import ProfessionalSignupPage from './pages/ProfessionalSignupPage';

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

const HomePage = () => (
  <AppContainer>
    <Header />
    <Hero />
    <Navigation />
  </AppContainer>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/professional-signup" element={<ProfessionalSignupPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 