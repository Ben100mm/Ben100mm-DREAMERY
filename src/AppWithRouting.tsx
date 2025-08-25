import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
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
import MortgagePage from './pages/MortgagePage';
import PreApprovalPage from './pages/PreApprovalPage';
import PreApprovalBasicInfoPage from './pages/PreApprovalBasicInfoPage';
import PreApprovalQuestionsPage from './pages/PreApprovalQuestionsPage';
import PreApprovalHomePreferencesPage from './pages/PreApprovalHomePreferencesPage';
import PreApprovalFinancialPage from './pages/PreApprovalFinancialPage';
import PreApprovalPropertyFinancialPage from './pages/PreApprovalPropertyFinancialPage';
import PreApprovalAdditionalQuestionsPage from './pages/PreApprovalAdditionalQuestionsPage';
import PreApprovalSummaryPage from './pages/PreApprovalSummaryPage';
import PreApprovalResultsPage from './pages/PreApprovalResultsPage';
import UnderwritePage from './pages/UnderwritePage';
import UXDemoPage from './pages/UXDemoPage';
import AdvancedCalculationsPage from './pages/AdvancedCalculationsPage';
import ClosePage from './pages/ClosePage';
import CloseBuyerPage from './pages/CloseBuyerPage';
import CloseAgentPage from './pages/CloseAgentPage';
import CloseBrokeragesPage from './pages/CloseBrokeragesPage';
import CloseProfessionalSupportPage from './pages/CloseProfessionalSupportPage';
import PartnerPage from './pages/partner';
import PartnerProfileCompletionPage from './pages/PartnerProfileCompletionPage';
import OtherProfessionalPage from './pages/OtherProfessionalPage';
import AnalyzePage from './pages/AnalyzePage';
import ManagePage from './pages/manage';
import InvestPage from './pages/InvestPage';
import FundPage from './pages/FundPage';
import OperatePage from './pages/OperatePage';
import LearnPage from './pages/LearnPage';
import AdvertisePage from './pages/AdvertisePage';
import CloseBusinessesPage from './pages/CloseBusinessesPage';
import ProfilePage from './pages/ProfilePage';
import { RoleProvider, RoleContext } from './context/RoleContext';
import { ProfessionalSupportProvider } from './context/ProfessionalSupportContext';

import { theme } from "./theme";

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

const AppContent = () => {
  const { userRole } = React.useContext(RoleContext);

  const getRouteForRole = (role: string) => {
    if ([
      'Retail Buyer', 'Investor Buyer', 'iBuyer', 'Property Flipper'
    ].includes(role)) return '/close/buyer';
    if ([
      'Real Estate Agent', 'Real Estate Broker', 'Realtor', "Buyer’s Agent",
      'Listing Agent', 'Commercial Agent', 'Luxury Agent', 'New Construction Agent',
      'Wholesaler', 'Disposition Agent'
    ].includes(role)) return '/close/agent';
    if (['Real Estate Broker'].includes(role)) return '/close/brokerages';
    return '/close/other';
  };

  return (
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
      <Route path="/mortgage" element={<MortgagePage />} />
      <Route path="/pre-approval" element={<PreApprovalPage />} />
      <Route path="/pre-approval-basic-info" element={<PreApprovalBasicInfoPage />} />
      <Route path="/pre-approval-questions" element={<PreApprovalQuestionsPage />} />
      <Route path="/pre-approval-home-preferences" element={<PreApprovalHomePreferencesPage />} />
      <Route path="/pre-approval-financial" element={<PreApprovalFinancialPage />} />
      <Route path="/pre-approval-property-financial" element={<PreApprovalPropertyFinancialPage />} />
      <Route path="/pre-approval-additional-questions" element={<PreApprovalAdditionalQuestionsPage />} />
      <Route path="/pre-approval-summary" element={<PreApprovalSummaryPage />} />
      <Route path="/pre-approval-results" element={<PreApprovalResultsPage />} />
      <Route path="/underwrite" element={<UnderwritePage />} />
      <Route path="/close" element={<ClosePage />} />
      <Route path="/close/buyer" element={<CloseBuyerPage />} />
      <Route path="/close/agent" element={<CloseAgentPage />} />
      <Route path="/close/brokerages" element={<CloseBrokeragesPage />} />
      <Route path="/close/other" element={<OtherProfessionalPage />} />
      <Route path="/close/professional-support" element={<CloseProfessionalSupportPage />} />
      <Route path="/close/businesses" element={<CloseBusinessesPage />} />
      <Route path="/analyze" element={<AnalyzePage />} />
      <Route path="/manage" element={<ManagePage />} />
      <Route path="/invest" element={<InvestPage />} />
      <Route path="/fund" element={<FundPage />} />
      <Route path="/operate" element={<OperatePage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/advertise" element={<AdvertisePage />} />
      <Route path="/partner" element={<PartnerPage />} />
      <Route path="/partner-profile" element={<PartnerProfileCompletionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/ux-demo" element={<UXDemoPage />} />
      <Route path="/advanced-calculations" element={<Navigate to="/analyze" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <RoleProvider>
          <ProfessionalSupportProvider>
            <Router>
              <AppContent />
            </Router>
          </ProfessionalSupportProvider>
        </RoleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;