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
import BuyPage from './pages/buy';
import RentPage from './pages/rent';
import SellPage from './pages/sell';
import MortgagePage from './pages/mortgage';
import AnalyzePage from './pages/analyze';
import UnderwritePage from './pages/underwrite';
import ClosePage from './pages/close';
import ManagePage from './pages/manage';
import InvestPage from './pages/invest';
import FundPage from './pages/fund';
import OperatePage from './pages/operate';
import PartnerPage from './pages/partner';
import LearnPage from './pages/learn';
import AdvertisePage from './pages/advertise';

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
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/mortgage" element={<MortgagePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/underwrite" element={<UnderwritePage />} />
            <Route path="/close" element={<ClosePage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/invest" element={<InvestPage />} />
            <Route path="/fund" element={<FundPage />} />
            <Route path="/operate" element={<OperatePage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
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