import React, { Suspense, lazy } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/HeaderWithRouting';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfessionalSignupPage = lazy(() => import('./pages/ProfessionalSignupPage'));
const BusinessSignupPage = lazy(() => import('./pages/BusinessSignupPage'));
const BuyPage = lazy(() => import('./pages/BuyPage'));
const RentPage = lazy(() => import('./pages/RentPage'));
const SellListAddressPage = lazy(() => import('./pages/SellListAddressPage'));
const SellListMovingDetailsPage = lazy(() => import('./pages/SellListMovingDetailsPage'));
const SellListMovingDetails2Page = lazy(() => import('./pages/SellListMovingDetails2Page'));
const SellListHomeDetailsPage = lazy(() => import('./pages/SellListHomeDetailsPage'));
const SellListHomeDetails2Page = lazy(() => import('./pages/SellListHomeDetails2Page'));
const SellListHomeDetails3Page = lazy(() => import('./pages/SellListHomeDetails3Page'));
const SellListHomeQualityPage = lazy(() => import('./pages/SellListHomeQualityPage'));
const SellListHomeQuality2Page = lazy(() => import('./pages/SellListHomeQuality2Page'));
const SellListHomeQuality3Page = lazy(() => import('./pages/SellListHomeQuality3Page'));
const SellListHomeQuality4Page = lazy(() => import('./pages/SellListHomeQuality4Page'));
const SellListAdditionalInfoPage = lazy(() => import('./pages/SellListAdditionalInfoPage'));
const SellListAdditionalInfo2Page = lazy(() => import('./pages/SellListAdditionalInfo2Page'));
const SellListAdditionalInfo3Page = lazy(() => import('./pages/SellListAdditionalInfo3Page'));
const SellListContactInfoPage = lazy(() => import('./pages/SellListContactInfoPage'));
const SellListPhoneInfoPage = lazy(() => import('./pages/SellListPhoneInfoPage'));
const SellListSummaryPage = lazy(() => import('./pages/SellListSummaryPage'));
const SellListServicesPage = lazy(() => import('./pages/SellListServicesPage'));
const SellListPage = lazy(() => import('./pages/SellListPage'));
const MortgagePage = lazy(() => import('./pages/MortgagePage'));
const PreApprovalPage = lazy(() => import('./pages/PreApprovalPage'));
const PreApprovalBasicInfoPage = lazy(() => import('./pages/PreApprovalBasicInfoPage'));
const PreApprovalQuestionsPage = lazy(() => import('./pages/PreApprovalQuestionsPage'));
const PreApprovalHomePreferencesPage = lazy(() => import('./pages/PreApprovalHomePreferencesPage'));
const PreApprovalFinancialPage = lazy(() => import('./pages/PreApprovalFinancialPage'));
const PreApprovalPropertyFinancialPage = lazy(() => import('./pages/PreApprovalPropertyFinancialPage'));
const PreApprovalAdditionalQuestionsPage = lazy(() => import('./pages/PreApprovalAdditionalQuestionsPage'));
const PreApprovalSummaryPage = lazy(() => import('./pages/PreApprovalSummaryPage'));
const PreApprovalResultsPage = lazy(() => import('./pages/PreApprovalResultsPage'));
const UnderwritePage = lazy(() => import('./pages/UnderwritePage'));
const UXDemoPage = lazy(() => import('./pages/UXDemoPage'));

const ClosePage = lazy(() => import('./pages/ClosePage'));
const CloseBuyerPage = lazy(() => import('./pages/CloseBuyerPage'));
const CloseAgentPage = lazy(() => import('./pages/CloseAgentPage'));
const CloseBrokeragesPage = lazy(() => import('./pages/CloseBrokeragesPage'));
const CloseProfessionalSupportPage = lazy(() => import('./pages/CloseProfessionalSupportPage'));
const PartnerPage = lazy(() => import('./pages/partner'));
const PartnerProfileCompletionPage = lazy(() => import('./pages/PartnerProfileCompletionPage'));
const OtherProfessionalPage = lazy(() => import('./pages/OtherProfessionalPage'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage'));
const ManagePage = lazy(() => import('./pages/manage'));
const InvestPage = lazy(() => import('./pages/InvestPage'));
const FundPage = lazy(() => import('./pages/FundPage'));
const OperatePage = lazy(() => import('./pages/OperatePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage'));
const CloseBusinessesPage = lazy(() => import('./pages/CloseBusinessesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
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
    <Suspense fallback={<div>Loading…</div>}>
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
    </Suspense>
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