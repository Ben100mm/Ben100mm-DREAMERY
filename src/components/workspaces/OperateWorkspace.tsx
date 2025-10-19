import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { brandColors } from '../../theme';
import OperateDashboard from '../operate/OperateDashboard';
import OperateProjects from '../operate/OperateProjects';
import OperateMessages from '../operate/OperateMessages';
import OperateAssistant from '../operate/ai-operate-assistant/OperateAssistant';
import OperateAssistantIcon from '../operate/ai-operate-assistant/OperateAssistantIcon';
import {
  Dashboard as DashboardIcon,
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  Receipt as ExpenseIcon,
  Schedule as ContractorIcon,
  TrendingUp as OptimizationIcon,
  Chat as ChatIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';

interface OperateWorkspaceProps {
  activeTab: string;
}

const OperateWorkspace: React.FC<OperateWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Fix & Flip, BRRR, and Construction Dashboard',
          subtitle: 'Overview of active deals, renovation progress, and project metrics across all your investment strategies',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'projects':
        return {
          title: 'Active Deals & Projects',
          subtitle: 'Track Fix & Flip properties, BRRR refinance progress, and Construction/Development projects',
          icon: <ProjectsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'createproject':
        return {
          title: 'Start a New Deal',
          subtitle: 'Initiate a Fix & Flip, BRRR property, or Land Development project',
          icon: <CreateProjectIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'expenses':
        return {
          title: 'Deal Expense Tracking',
          subtitle: 'Monitor renovation costs, construction expenses, and holding costs across all your deals',
          icon: <ExpenseIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'contractors':
        return {
          title: 'Contractor & Vendor Management',
          subtitle: 'Schedule contractors for renovations, flips, and construction projects',
          icon: <ContractorIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'optimization':
        return {
          title: 'Deal Optimization Insights',
          subtitle: 'AI recommendations for maximizing profits on flips, refinancing strategies, and construction efficiency',
          icon: <OptimizationIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'messages':
        return {
          title: 'Project Communications',
          subtitle: 'Coordinate with contractors, inspectors, and construction teams across all your deals',
          icon: <ChatIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'assistant':
        return {
          title: 'Lumina Operations Assistant',
          subtitle: 'Specialized assistance for Fix & Flip, BRRR, and Construction projects',
          icon: <OperateAssistantIcon size={28} sx={{ color: brandColors.text.inverse }} />,
        };
      case 'advertise':
        return {
          title: 'Advertise Your Services',
          subtitle: 'Connect with investors needing Fix & Flip, BRRR, or Construction expertise',
          icon: <CampaignIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Fix & Flip, BRRR & Construction Projects',
          subtitle: 'Manage your active deals and investment projects',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OperateDashboard />;
      case 'projects':
        return <OperateProjects />;
      case 'createproject':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Start a New Deal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Initiate a Fix & Flip property, BRRR investment, or Land Development/Construction project with complete deal analysis and tracking.
            </Typography>
          </Box>
        );
      case 'expenses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Deal Expense Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and categorize renovation costs, construction expenses, holding costs, and all deal-related expenditures across Fix & Flip, BRRR, and Construction projects.
            </Typography>
          </Box>
        );
      case 'contractors':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Contractor & Vendor Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule and manage contractors, vendors, and construction teams for your Fix & Flip renovations, BRRR rehabs, and development projects.
            </Typography>
          </Box>
        );
      case 'optimization':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Deal Optimization Insights
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AI-powered recommendations for maximizing profits on flips, optimizing refinancing strategies, reducing construction costs, and improving deal efficiency.
            </Typography>
          </Box>
        );
      case 'messages':
        return <OperateMessages />;
      case 'assistant':
        return <OperateAssistant />;
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a deal management option from the sidebar
            </Typography>
          </Box>
        );
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

export default OperateWorkspace;
