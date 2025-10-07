import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import { brandColors } from '../../theme';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Campaign as AdsIcon,
  LocalOffer as PromotionsIcon,
  Add as CreateIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface AdvertiseWorkspaceProps {
  activeTab: string;
}

const AdvertiseWorkspace: React.FC<AdvertiseWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Marketing Dashboard',
          subtitle: 'Overview of your marketing campaigns and performance metrics',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'calendar':
        return {
          title: 'Marketing Calendar',
          subtitle: 'Schedule and manage your marketing campaigns and content',
          icon: <CalendarIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'ads':
        return {
          title: 'Ad Campaigns',
          subtitle: 'Create, manage, and optimize your advertising campaigns',
          icon: <AdsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'promotions':
        return {
          title: 'Promotions & Offers',
          subtitle: 'Design and manage special offers and promotional campaigns',
          icon: <PromotionsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'create':
        return {
          title: 'Create Content',
          subtitle: 'Design marketing materials, ads, and promotional content',
          icon: <CreateIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'analytics':
        return {
          title: 'Marketing Analytics',
          subtitle: 'Track performance, ROI, and campaign effectiveness',
          icon: <AnalyticsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'settings':
        return {
          title: 'Marketing Settings',
          subtitle: 'Configure your marketing tools and preferences',
          icon: <SettingsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Marketing Tools',
          subtitle: 'Comprehensive marketing platform for real estate professionals',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
    }
  };

  const renderContent = (activeTab: string) => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Welcome to your marketing command center. Monitor campaign performance, track leads, 
              and optimize your marketing efforts across all channels.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Active Campaigns</Typography>
                <Typography variant="h3" color="primary">8</Typography>
                <Typography variant="body2" color="text.secondary">Running this month</Typography>
              </Paper>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Total Leads</Typography>
                <Typography variant="h3" color="primary">247</Typography>
                <Typography variant="body2" color="text.secondary">Generated this month</Typography>
              </Paper>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Conversion Rate</Typography>
                <Typography variant="h3" color="primary">12.3%</Typography>
                <Typography variant="body2" color="text.secondary">Lead to client</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'calendar':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Calendar
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Plan and schedule your marketing activities, campaigns, and content releases.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>This Week</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Facebook ad campaign launch
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Email newsletter send
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Open house promotion
                </Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Next Week</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Google Ads optimization
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Social media content batch
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Client testimonial campaign
                </Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'ads':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Ad Campaigns
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Create and manage your advertising campaigns across multiple platforms.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Facebook Ads</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Target local homebuyers with property-specific ads and retargeting campaigns.
                </Typography>
                <Typography variant="body2" color="primary">Status: Active • Budget: $2,500/month</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Google Ads</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Search and display ads for real estate services and property listings.
                </Typography>
                <Typography variant="body2" color="primary">Status: Active • Budget: $1,800/month</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Instagram Ads</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Visual property showcases and lifestyle marketing content.
                </Typography>
                <Typography variant="body2" color="primary">Status: Paused • Budget: $1,200/month</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'promotions':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Promotions & Offers
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Design and manage special offers, discounts, and promotional campaigns.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>First-Time Buyer Special</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Free home inspection and closing cost assistance for first-time buyers.
                </Typography>
                <Typography variant="body2" color="primary">Valid until: Dec 31, 2024</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Referral Program</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  $500 cash bonus for successful referrals to new clients.
                </Typography>
                <Typography variant="body2" color="primary">Ongoing promotion</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Luxury Property Package</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Premium marketing package with professional photography and staging.
                </Typography>
                <Typography variant="body2" color="primary">20% off for properties over $1M</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'create':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Create Content
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Design marketing materials, social media content, and promotional assets.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Social Media Posts</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create engaging posts for Facebook, Instagram, and LinkedIn with property highlights.
                </Typography>
                <Typography variant="body2" color="primary">Templates available</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Email Campaigns</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Design and send newsletters, market updates, and property alerts.
                </Typography>
                <Typography variant="body2" color="primary">Drag & drop editor</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Print Materials</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Generate flyers, business cards, and promotional materials.
                </Typography>
                <Typography variant="body2" color="primary">High-resolution output</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'analytics':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Track performance metrics, ROI, and campaign effectiveness across all channels.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Campaign Performance</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Track clicks, impressions, conversions, and cost per lead for each campaign.
                </Typography>
                <Typography variant="body2" color="primary">Last 30 days: 1,247 clicks</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Lead Sources</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Analyze which marketing channels generate the highest quality leads.
                </Typography>
                <Typography variant="body2" color="primary">Top source: Google Ads (45%)</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>ROI Analysis</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Calculate return on investment for each marketing channel and campaign.
                </Typography>
                <Typography variant="body2" color="primary">Overall ROI: 340%</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'settings':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Marketing Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Configure your marketing tools, preferences, and integration settings.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Platform Integrations</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Connect your social media accounts, email platforms, and advertising networks.
                </Typography>
                <Typography variant="body2" color="primary">3 platforms connected</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Brand Guidelines</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Set up your brand colors, fonts, and logo for consistent marketing materials.
                </Typography>
                <Typography variant="body2" color="primary">Brand kit configured</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose how and when you want to receive marketing performance updates.
                </Typography>
                <Typography variant="body2" color="primary">Daily email reports enabled</Typography>
              </Paper>
            </Box>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a marketing tool from the sidebar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose from dashboard, calendar, ads, promotions, content creation, analytics, or settings to get started.
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Dynamic Banner */}
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

      {/* Tab Content */}
      {renderContent(activeTab)}
    </Container>
  );
};

export default AdvertiseWorkspace;
