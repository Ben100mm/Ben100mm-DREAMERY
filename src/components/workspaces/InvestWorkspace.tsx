import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import { brandColors } from '../../theme';
import InvestCrowdfunding from '../invest/InvestCrowdfunding';
import InvestJointVenture from '../invest/InvestJointVenture';
import InvestMessages from '../invest/InvestMessages';
import Calendar from '../common/Calendar';
import {
  Group as CrowdfundingIcon,
  Handshake as JointVentureIcon,
  PieChart as FractionalIcon,
  Business as PrivateMarketIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface InvestWorkspaceProps {
  activeTab: string;
}

const InvestWorkspace: React.FC<InvestWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'crowdfunding':
        return {
          title: 'Crowdfunded Deals',
          subtitle: 'Access to vetted real estate investment opportunities through crowdfunding platforms',
          icon: <CrowdfundingIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'jointventure':
        return {
          title: 'Joint Venture',
          subtitle: 'Partner with experienced developers and investors on larger projects',
          icon: <JointVentureIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'fractional':
        return {
          title: 'Fractional Ownership',
          subtitle: 'Own a portion of premium properties with lower capital requirements',
          icon: <FractionalIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'privatemarket':
        return {
          title: 'Private Market Investment Listings',
          subtitle: 'Exclusive access to off-market investment opportunities and private placements',
          icon: <PrivateMarketIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'messages':
        return {
          title: 'Investment Communications',
          subtitle: 'Manage communications with investment opportunities and portfolio partners',
          icon: <ChatIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Investment Opportunities',
          subtitle: 'Connect to real estate investment opportunities',
          icon: <CrowdfundingIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'crowdfunding':
        return <InvestCrowdfunding />;
      case 'jointventure':
        return <InvestJointVenture />;
      case 'fractional':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Fractional Ownership
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Own a portion of premium properties with lower capital requirements and shared benefits.
            </Typography>
          </Box>
        );
      case 'privatemarket':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Private Market Investment Listings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access exclusive off-market investment opportunities and private placements.
            </Typography>
          </Box>
        );
      case 'messages':
        return (
          <Box>
            <Calendar workspaceType="invest" />
            <Box sx={{ mt: 4 }}>
              <InvestMessages />
            </Box>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select an investment option from the sidebar
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

export default InvestWorkspace;
