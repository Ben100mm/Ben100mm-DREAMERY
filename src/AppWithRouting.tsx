import React, { Suspense, lazy } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider, RoleContext } from './context/RoleContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ProfessionalSupportProvider } from './context/ProfessionalSupportContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { RouteProtection } from './components/RouteProtection';
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
const WorkspacesPage = lazy(() => import('./pages/WorkspacesPage'));
const WorkspacesPersonalPage = lazy(() => import('./pages/WorkspacesPersonalPage'));
const WorkspacesAgentPage = lazy(() => import('./pages/WorkspacesAgentPage'));
const WorkspacesBrokeragesPage = lazy(() => import('./pages/WorkspacesBrokeragesPage'));
const WorkspacesProfessionalSupportPage = lazy(() => import('./pages/WorkspacesProfessionalSupportPage'));
const WorkspacesBusinessesPage = lazy(() => import('./pages/WorkspacesBusinessesPage'));
const PartnerPage = lazy(() => import('./pages/partner'));
const PartnerProfileCompletionPage = lazy(() => import('./pages/PartnerProfileCompletionPage'));
const OtherProfessionalPage = lazy(() => import('./pages/OtherProfessionalPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PerformanceDashboardPage = lazy(() => import('./pages/PerformanceDashboardPage'));
const DataSourcesDashboard = lazy(() => import('./pages/DataSourcesDashboard'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage'));
const Advertise3DPage = lazy(() => import('./pages/Advertise3DPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));

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
    ].includes(role)) return '/workspaces/personal';
    if ([
      'Real Estate Agent', 'Real Estate Broker', 'Realtor', "Buyer's Agent",
      'Listing Agent', 'Commercial Agent', 'Luxury Agent', 'New Construction Agent',
      'Wholesaler', 'Disposition Agent'
    ].includes(role)) return '/workspaces/agent';
    if (['Real Estate Broker'].includes(role)) return '/workspaces/brokerages';
    return '/workspaces/other';
  };

  return (
    <Suspense fallback={<div>Loading…</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/professional-signup" element={<ProfessionalSignupPage />} />
      <Route path="/business-signup" element={<BusinessSignupPage />} />
      <Route path="/lumina" element={
        <RouteProtection>
          <LuminaPage />
        </RouteProtection>
      } />
      <Route path="/marketplace" element={
        <RouteProtection>
          <MarketplacePage />
        </RouteProtection>
      }>
        <Route index element={<Navigate to="buy" replace />} />
        <Route path="buy" element={<BuyPage />} />
        <Route path="rent" element={<RentPage />} />
      </Route>
      <Route path="/buy" element={<Navigate to="/marketplace/buy" replace />} />
      <Route path="/rent" element={<Navigate to="/marketplace/rent" replace />} />

      <Route path="/mortgage" element={
        <RouteProtection>
          <MortgagePage />
        </RouteProtection>
      } />
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
      
      {/* New Workspaces Routes */}
      <Route path="/workspaces" element={
        <RouteProtection>
          <WorkspacesPage />
        </RouteProtection>
      } />
      <Route path="/workspaces/personal" element={<WorkspacesPersonalPage />} />
      <Route path="/workspaces/buyer" element={<Navigate to="/workspaces/personal" replace />} />
      <Route path="/workspaces/agent" element={<WorkspacesAgentPage />} />
      <Route path="/workspaces/brokerages" element={<WorkspacesBrokeragesPage />} />
      <Route path="/workspaces/businesses" element={<WorkspacesBusinessesPage />} />
      <Route path="/workspaces/professional-support" element={<WorkspacesProfessionalSupportPage />} />
      <Route path="/workspaces/other" element={<OtherProfessionalPage />} />
      
      {/* Redirects from old /close/* routes to new /workspaces/* routes */}
      <Route path="/close" element={<Navigate to="/workspaces" replace />} />
      <Route path="/close/buyer" element={<Navigate to="/workspaces/personal?workspace=close" replace />} />
      <Route path="/close/personal" element={<Navigate to="/workspaces/personal?workspace=close" replace />} />
      <Route path="/close/agent" element={<Navigate to="/workspaces/agent" replace />} />
      <Route path="/close/brokerages" element={<Navigate to="/workspaces/brokerages" replace />} />
      <Route path="/close/businesses" element={<Navigate to="/workspaces/businesses" replace />} />
      <Route path="/close/professional-support" element={<Navigate to="/workspaces/professional-support" replace />} />
      
      <Route path="/rent" element={<Navigate to="/workspaces/personal?workspace=rent" replace />} />
      <Route path="/manage" element={<Navigate to="/workspaces/personal?workspace=manage" replace />} />
      <Route path="/invest" element={<Navigate to="/workspaces/personal?workspace=invest" replace />} />
      <Route path="/fund" element={<Navigate to="/workspaces/personal?workspace=fund" replace />} />
      <Route path="/operate" element={<Navigate to="/workspaces/personal?workspace=operate" replace />} />
      <Route path="/learn" element={
        <RouteProtection>
          <LearnPage />
        </RouteProtection>
      } />
      <Route path="/advertise" element={
        <RouteProtection>
          <AdvertisePage />
        </RouteProtection>
      } />
      <Route path="/advertise-3d" element={<Advertise3DPage />} />
      <Route path="/partner" element={
        <RouteProtection>
          <PartnerPage />
        </RouteProtection>
      } />
      <Route path="/partner-profile" element={<PartnerProfileCompletionPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/ux-demo" element={<UXDemoPage />} />
      <Route path="/performance-dashboard" element={<PerformanceDashboardPage />} />
      <Route path="/data-sources" element={<DataSourcesDashboard />} />
      <Route path="/developer" element={
        <RouteProtection>
          <DeveloperPage />
        </RouteProtection>
      } />
    </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <FeatureFlagProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <RoleProvider>
            <WorkspaceProvider>
              <ProfessionalSupportProvider>
                <Router>
                  <AppContent />
                </Router>
              </ProfessionalSupportProvider>
            </WorkspaceProvider>
          </RoleProvider>
        </ThemeProvider>
      </AuthProvider>
    </FeatureFlagProvider>
  );
}

export default App;
