import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/HeaderWithRouting';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import AuthPage from './pages/AuthPage';
import ProfessionalSignupPage from './pages/ProfessionalSignupPage';
import BusinessSignupPage from './pages/BusinessSignupPage';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import SellListAddressPage from './pages/SellListAddressPage';
import SellListMovingDetailsPage from './pages/SellListMovingDetailsPage';
import SellListMovingDetails2Page from './pages/SellListMovingDetails2Page';
import SellListHomeDetailsPage from './pages/SellListHomeDetailsPage';
import SellListHomeDetails2Page from './pages/SellListHomeDetails2Page';
import SellListHomeDetails3Page from './pages/SellListHomeDetails3Page';
import SellListHomeQualityPage from './pages/SellListHomeQualityPage';
import SellListHomeQuality2Page from './pages/SellListHomeQuality2Page';
import SellListHomeQuality3Page from './pages/SellListHomeQuality3Page';
import SellListHomeQuality4Page from './pages/SellListHomeQuality4Page';
import SellListAdditionalInfoPage from './pages/SellListAdditionalInfoPage';
import SellListAdditionalInfo2Page from './pages/SellListAdditionalInfo2Page';
import SellListAdditionalInfo3Page from './pages/SellListAdditionalInfo3Page';
import SellListContactInfoPage from './pages/SellListContactInfoPage';
import SellListPhoneInfoPage from './pages/SellListPhoneInfoPage';
import SellListSummaryPage from './pages/SellListSummaryPage';
import SellListServicesPage from './pages/SellListServicesPage';
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
          <Route path="/business-signup" element={<BusinessSignupPage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/sell" element={<SellListAddressPage />} />
          <Route path="/sell-moving-details" element={<SellListMovingDetailsPage />} />
          <Route path="/sell-moving-details-2" element={<SellListMovingDetails2Page />} />
          <Route path="/sell-home-details" element={<SellListHomeDetailsPage />} />
          <Route path="/sell-home-details-2" element={<SellListHomeDetails2Page />} />
          <Route path="/sell-home-details-3" element={<SellListHomeDetails3Page />} />
          <Route path="/sell-home-quality" element={<SellListHomeQualityPage />} />
          <Route path="/sell-home-quality-2" element={<SellListHomeQuality2Page />} />
          <Route path="/sell-home-quality-3" element={<SellListHomeQuality3Page />} />
          <Route path="/sell-home-quality-4" element={<SellListHomeQuality4Page />} />
          <Route path="/sell-additional-info" element={<SellListAdditionalInfoPage />} />
          <Route path="/sell-additional-info-2" element={<SellListAdditionalInfo2Page />} />
          <Route path="/sell-additional-info-3" element={<SellListAdditionalInfo3Page />} />
          <Route path="/sell-contact-info" element={<SellListContactInfoPage />} />
          <Route path="/sell-phone-info" element={<SellListPhoneInfoPage />} />
          <Route path="/sell-summary" element={<SellListSummaryPage />} />
          <Route path="/sell-services" element={<SellListServicesPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;