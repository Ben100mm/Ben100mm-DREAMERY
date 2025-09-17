import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { brandColors } from '../../theme';
import FundDashboard from '../fund/FundDashboard';
import FundProjects from '../fund/FundProjects';
import FundCreateProject from '../fund/FundCreateProject';
import FundMessages from '../fund/FundMessages';
import {
  Dashboard as DashboardIcon,
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  PersonAdd as InvestorIcon,
  Security as ComplianceIcon,
  Calculate as CalculatorIcon,
  AccountBox as PortalIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface FundWorkspaceProps {
  activeTab: string;
}

const FundWorkspace: React.FC<FundWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Fundraising Dashboard',
          subtitle: 'Centralized overview of your capital raising activities and project performance',
          icon: <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'projects':
        return {
          title: 'Projects',
          subtitle: 'Manage and track all your real estate fundraising projects',
          icon: <ProjectsIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'createproject':
        return {
          title: 'Create New Project',
          subtitle: 'Start a new real estate investment opportunity and fundraising campaign',
          icon: <CreateProjectIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'investor':
        return {
          title: 'Investor Onboarding',
          subtitle: 'Streamlined process for bringing new investors into your projects',
          icon: <InvestorIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'compliance':
        return {
          title: 'Capital Raise Compliance Tools',
          subtitle: 'Ensure regulatory compliance and proper documentation for fundraising activities',
          icon: <ComplianceIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'calculator':
        return {
          title: 'Waterfall & ROI Calculators',
          subtitle: 'Advanced financial modeling tools for project returns and investor distributions',
          icon: <CalculatorIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'portal':
        return {
          title: 'Secure Investor Portal',
          subtitle: 'Protected access for investors to view project updates and manage investments',
          icon: <PortalIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      case 'messages':
        return {
          title: 'Fundraising Communications',
          subtitle: 'Manage communications with investors, advisors, and fundraising partners',
          icon: <ChatIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
      default:
        return {
          title: 'Fundraising Platform',
          subtitle: 'Raise capital for real estate projects',
          icon: <DashboardIcon sx={{ fontSize: 28, color: 'white' }} />,
        };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FundDashboard />;
      case 'projects':
        return <FundProjects />;
      case 'createproject':
        return <FundCreateProject />;
      case 'investor':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Investor Onboarding
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Streamlined process for bringing new investors into your projects with compliance checks.
            </Typography>
          </Box>
        );
      case 'compliance':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Capital Raise Compliance Tools
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ensure regulatory compliance with built-in tools and documentation templates.
            </Typography>
          </Box>
        );
      case 'calculator':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Waterfall & ROI Calculators
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Advanced financial modeling for project returns, investor distributions, and scenario analysis.
            </Typography>
          </Box>
        );
      case 'portal':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Secure Investor Portal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Protected access for investors to view project updates, documents, and manage their investments.
            </Typography>
          </Box>
        );
      case 'messages':
        return <FundMessages />;
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a fundraising option from the sidebar
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
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {banner.icon}
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 600 }}>
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

export default FundWorkspace;
