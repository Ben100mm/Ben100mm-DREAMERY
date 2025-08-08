import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import AuthPage from './pages/AuthPage';
import ProfessionalSignupPage from './pages/ProfessionalSignupPage';
import BusinessSignupPage from './pages/BusinessSignupPage';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import SellListAddressPage from './pages/SellListAddressPage';
import SellListMovingDetailsPage from './pages/SellListMovingDetailsPage';
import SellListPage from './pages/SellListPage';

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
  <>
    <Header />
    <Hero />
    <Navigation />
  </>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/professional-signup" element={<ProfessionalSignupPage />} />
            <Route path="/business-signup" element={<BusinessSignupPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/sell" element={<SellListAddressPage />} />
            <Route path="/sell-moving-details" element={<SellListMovingDetailsPage />} />
            <Route path="/sell-services" element={<SellListPage />} />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;