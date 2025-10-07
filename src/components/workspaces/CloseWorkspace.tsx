import React from 'react';
import { Box } from '@mui/material';
import ClosingDashboard from '../close/closing-dashboard/ClosingDashboard';
import EscrowTitleHub from '../close/escrow-title-hub/EscrowTitleHub';
import LazyDueDiligenceTools from '../lazy/DueDiligenceToolsLazy';
import FinancingCoordination from '../close/financing/FinancingCoordination';
import LegalCompliance from '../close/legal-compliance/LegalCompliance';
import SettlementClosingCosts from '../close/settlement/SettlementClosingCosts';
import InsuranceUtilities from '../close/insurance-utilities/InsuranceUtilities';
import FinalWalkthroughHandover from '../close/walkthrough/FinalWalkthroughHandover';
import PostClosingServices from '../close/post-closing/PostClosingServices';
import AIClosingAssistant from '../close/ai-closing-assistant/AIClosingAssistant';
import PartnerIntegrations from '../close/partner-integrations/PartnerIntegrations';

interface CloseWorkspaceProps {
  activeTab: string;
}

const CloseWorkspace: React.FC<CloseWorkspaceProps> = ({ activeTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ClosingDashboard />;
      case 'escrow-title':
        return <EscrowTitleHub />;
      case 'due-diligence':
        return <LazyDueDiligenceTools />;
      case 'financing':
        return <FinancingCoordination />;
      case 'legal':
        return <LegalCompliance />;
      case 'settlement':
        return <SettlementClosingCosts />;
      case 'insurance':
        return <InsuranceUtilities />;
      case 'walkthrough':
        return <FinalWalkthroughHandover />;
      case 'post-closing':
        return <PostClosingServices />;
      case 'assistant':
        return <AIClosingAssistant />;
      case 'integrations':
        return <PartnerIntegrations />;
      default:
        return <ClosingDashboard />;
    }
  };

  return (
    <Box>
      {renderTabContent()}
    </Box>
  );
};

export default CloseWorkspace;
