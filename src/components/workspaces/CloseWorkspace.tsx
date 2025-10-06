import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { brandColors } from '../../theme';
import ClosingDashboard from '../close/closing-dashboard/ClosingDashboard';
import EscrowTitleHub from '../close/escrow-title-hub/EscrowTitleHub';
import LazyDueDiligenceTools from '../lazy/DueDiligenceToolsLazy';
import FinancingCoordination from '../close/financing/FinancingCoordination';
import LegalCompliance from '../close/legal-compliance/LegalCompliance';
import SettlementClosingCosts from '../close/settlement/SettlementClosingCosts';
import InsuranceUtilities from '../close/insurance-utilities/InsuranceUtilities';
import FinalWalkthroughHandover from '../close/walkthrough/FinalWalkthroughHandover';
import PostClosingServices from '../close/post-closing/PostClosingServices';
import AIClosingAssistant from '../close/assistant/ClosingAssistant';
import PartnerIntegrations from '../close/integrations/PartnerIntegrations';
import CloseMessages from '../close/CloseMessages';
import ClosingAssistantIcon from '../close/ai-closing-assistant/ClosingAssistantIcon';
import Calendar from '../common/Calendar';
import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Calculate as CalculateIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Support as SupportIcon,
  IntegrationInstructions as IntegrationIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface CloseWorkspaceProps {
  activeTab: string;
}

const CloseWorkspace: React.FC<CloseWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Closing Dashboard',
          subtitle: 'Centralized overview of all closing activities and progress tracking',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'escrow-title':
        return {
          title: 'Escrow & Title Hub',
          subtitle: 'Manage escrow accounts, title searches, and title insurance',
          icon: <SecurityIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'due-diligence':
        return {
          title: 'Due Diligence Tools',
          subtitle: 'Comprehensive property and legal research tools',
          icon: <SearchIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'financing':
        return {
          title: 'Financing Coordination',
          subtitle: 'Coordinate with lenders and manage funding processes',
          icon: <AccountBalanceIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'legal':
        return {
          title: 'Legal & Compliance',
          subtitle: 'Legal document preparation and regulatory compliance',
          icon: <GavelIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'settlement':
        return {
          title: 'Settlement & Closing Costs',
          subtitle: 'Calculate and track all closing costs and settlement amounts',
          icon: <CalculateIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'insurance':
        return {
          title: 'Insurance & Utilities',
          subtitle: 'Manage property insurance and utility transfers',
          icon: <HomeIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'walkthrough':
        return {
          title: 'Final Walkthrough & Handover',
          subtitle: 'Final property inspection and key handover process',
          icon: <CheckCircleIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'post-closing':
        return {
          title: 'Post-Closing Services',
          subtitle: 'Ongoing support and services after closing',
          icon: <SupportIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'assistant':
        return {
          title: 'Lumina',
          subtitle: 'Intelligent assistance for closing processes and decision making',
          icon: <ClosingAssistantIcon size={28} color="white" />,
        };
      case 'messages':
        return {
          title: 'Closing Communications',
          subtitle: 'Stay connected with everyone involved in your closing process',
          icon: <ChatIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'integrations':
        return {
          title: 'Partner Integrations',
          subtitle: 'Connect with third-party services and platforms',
          icon: <IntegrationIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Closing Dashboard',
          subtitle: 'Centralized overview of all closing activities and progress tracking',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
    }
  };

  const renderContent = () => {
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
      case 'messages':
        return (
          <Box>
            <Calendar workspaceType="close" />
            <Box sx={{ mt: 4 }}>
              <CloseMessages />
            </Box>
          </Box>
        );
      case 'integrations':
        return <PartnerIntegrations />;
      default:
        return <ClosingDashboard />;
    }
  };

  const banner = getBanner();

  return (
    <Box>
      {/* Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 3, 
          backgroundColor: brandColors.primary,
          borderRadius: '16px 16px 0 0',
          color: brandColors.text.inverse
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {banner.icon}
          <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
            {banner.title}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {banner.subtitle}
        </Typography>
      </Paper>

      {/* Content */}
      <Box sx={{ pl: 0, ml: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default CloseWorkspace;
