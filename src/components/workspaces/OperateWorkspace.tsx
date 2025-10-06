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
import {
  Dashboard as DashboardIcon,
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  Receipt as ExpenseIcon,
  Schedule as ContractorIcon,
  TrendingUp as OptimizationIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface OperateWorkspaceProps {
  activeTab: string;
}

const OperateWorkspace: React.FC<OperateWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Projects Dashboard',
          subtitle: 'Centralized overview of your property projects, performance metrics, and ongoing activities',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'projects':
        return {
          title: 'Projects',
          subtitle: 'Manage and track all your active operational projects and property improvements',
          icon: <ProjectsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'createproject':
        return {
          title: 'Create a New Project',
          subtitle: 'Start a new operational project, renovation, or property improvement initiative',
          icon: <CreateProjectIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'expenses':
        return {
          title: 'Expense Tracking',
          subtitle: 'Monitor and categorize all operational expenses, maintenance costs, and property expenditures',
          icon: <ExpenseIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'contractors':
        return {
          title: 'Contractor & Vendor Scheduling',
          subtitle: 'Schedule and manage contractors, vendors, and service providers for property projects',
          icon: <ContractorIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'optimization':
        return {
          title: 'Portfolio Optimization Suggestions',
          subtitle: 'AI-powered recommendations for improving property performance and portfolio returns',
          icon: <OptimizationIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'messages':
        return {
          title: 'Property Operations Communications',
          subtitle: 'Manage communications with project teams, contractors, and operations partners',
          icon: <ChatIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Property Projects',
          subtitle: 'Ongoing projects and tools for investment properties',
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
              Create a New Project
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start a new operational project with step-by-step setup for renovations, improvements, or maintenance.
            </Typography>
          </Box>
        );
      case 'expenses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Expense Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and categorize all operational expenses, maintenance costs, and property-related expenditures.
            </Typography>
          </Box>
        );
      case 'contractors':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Contractor & Vendor Scheduling
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule and manage contractors, vendors, and service providers for property projects and maintenance.
            </Typography>
          </Box>
        );
      case 'optimization':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Portfolio Optimization Suggestions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              AI-powered recommendations for improving property performance, reducing costs, and maximizing portfolio returns.
            </Typography>
          </Box>
        );
      case 'messages':
        return <OperateMessages />;
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a projects option from the sidebar
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
