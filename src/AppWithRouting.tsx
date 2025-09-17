import React, { Suspense, lazy } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider, RoleContext } from './context/RoleContext';
import { ProfessionalSupportProvider } from './context/ProfessionalSupportContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { theme } from "./theme";
import Header from './components/HeaderWithRouting';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfessionalSignupPage = lazy(() => import('./pages/ProfessionalSignupPage'));
const BusinessSignupPage = lazy(() => import('./pages/BusinessSignupPage'));
const LuminaPage = lazy(() => import('./pages/LuminaPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const BuyPage = lazy(() => import('./pages/BuyPage'));
const RentPage = lazy(() => import('./pages/RentPage'));

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
const CloseBuyerPage = lazy(() => import('./pages/CloseBuyerPageNew'));
const CloseAgentPage = lazy(() => import('./pages/CloseAgentPage'));
const CloseBrokeragesPage = lazy(() => import('./pages/CloseBrokeragesPage'));
const CloseProfessionalSupportPage = lazy(() => import('./pages/CloseProfessionalSupportPage'));
const PartnerPage = lazy(() => import('./pages/partner'));
const PartnerProfileCompletionPage = lazy(() => import('./pages/PartnerProfileCompletionPage'));
const OtherProfessionalPage = lazy(() => import('./pages/OtherProfessionalPage'));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage'));

const CloseBusinessesPage = lazy(() => import('./pages/CloseBusinessesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PerformanceDashboardPage = lazy(() => import('./pages/PerformanceDashboardPage'));

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
      <Route path="/lumina" element={<LuminaPage />} />
      <Route path="/marketplace" element={<MarketplacePage />}>
        <Route index element={<Navigate to="buy" replace />} />
        <Route path="buy" element={<BuyPage />} />
        <Route path="rent" element={<RentPage />} />
      </Route>
      <Route path="/buy" element={<Navigate to="/marketplace/buy" replace />} />
      <Route path="/rent" element={<Navigate to="/marketplace/rent" replace />} />

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
      <Route path="/analyze" element={<AnalysisProvider><AnalyzePage /></AnalysisProvider>} />
      <Route path="/manage" element={<Navigate to="/close/buyer?workspace=manage" replace />} />
      <Route path="/invest" element={<Navigate to="/close/buyer?workspace=invest" replace />} />
      <Route path="/fund" element={<Navigate to="/close/buyer?workspace=fund" replace />} />
      <Route path="/operate" element={<Navigate to="/close/buyer?workspace=operate" replace />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/advertise" element={<AdvertisePage />} />
      <Route path="/partner" element={<PartnerPage />} />
      <Route path="/partner-profile" element={<PartnerProfileCompletionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/ux-demo" element={<UXDemoPage />} />
      <Route path="/performance-dashboard" element={<PerformanceDashboardPage />} />
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
