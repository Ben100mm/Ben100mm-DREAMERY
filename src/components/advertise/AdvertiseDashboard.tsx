import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Visibility as VisibilityIcon,
  TouchApp as ClickIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import { useNavigate } from 'react-router-dom';
import AdvertiseAdList from './AdvertiseAdList';
import AdvertiseCreateForm from './AdvertiseCreateForm';

interface AdvertiseDashboardProps {
  workspaceType: 'rent' | 'manage' | 'fund' | 'operate';
}

const AdvertiseDashboard: React.FC<AdvertiseDashboardProps> = ({ workspaceType }) => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - in real app this would come from API
  const mockData = {
    activeAds: 3,
    totalImpressions: 12500,
    totalClicks: 340,
    clickThroughRate: 2.7,
    recentPerformance: [
      { day: 'Mon', impressions: 1200, clicks: 32 },
      { day: 'Tue', impressions: 1500, clicks: 41 },
      { day: 'Wed', impressions: 1800, clicks: 48 },
      { day: 'Thu', impressions: 1600, clicks: 43 },
      { day: 'Fri', impressions: 2200, clicks: 59 },
    ],
  };

  const getContextualContent = () => {
    switch (workspaceType) {
      case 'rent':
        return {
          title: 'Advertise Your Rental Properties',
          subtitle: 'Showcase your rental properties to qualified tenants',
          createButtonText: 'Create Rental Ad',
          packageButtonText: 'View Rental Advertising Packages',
          metrics: {
            impressions: 'Property Views',
            clicks: 'Inquiries',
            ctr: 'Inquiry Rate',
          },
        };
      case 'manage':
        return {
          title: 'Advertise Your Management Services',
          subtitle: 'Promote your property management expertise',
          createButtonText: 'Create Service Ad',
          packageButtonText: 'View Service Advertising Packages',
          metrics: {
            impressions: 'Profile Views',
            clicks: 'Lead Inquiries',
            ctr: 'Lead Rate',
          },
        };
      case 'fund':
        return {
          title: 'Advertise Your Fundraising Opportunities',
          subtitle: 'Attract investors to your real estate projects',
          createButtonText: 'Create Fundraising Ad',
          packageButtonText: 'View Fundraising Advertising Packages',
          metrics: {
            impressions: 'Opportunity Views',
            clicks: 'Investor Inquiries',
            ctr: 'Interest Rate',
          },
        };
      case 'operate':
        return {
          title: 'Advertise Your Operational Services',
          subtitle: 'Connect with property owners needing services',
          createButtonText: 'Create Service Ad',
          packageButtonText: 'View Service Advertising Packages',
          metrics: {
            impressions: 'Service Views',
            clicks: 'Service Inquiries',
            ctr: 'Inquiry Rate',
          },
        };
    }
  };

  const content = getContextualContent();

  const handleCreateAd = () => {
    setShowCreateForm(true);
  };

  const handleViewPackages = () => {
    navigate('/advertise');
  };

  if (showCreateForm) {
    return (
      <AdvertiseCreateForm 
        workspaceType={workspaceType}
        onCancel={() => setShowCreateForm(false)}
        onSuccess={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: brandColors.text.primary }}>
          {content.title}
        </Typography>
        <Typography variant="body1" sx={{ color: brandColors.text.secondary, mb: 3 }}>
          {content.subtitle}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateAd}
            sx={{
              backgroundColor: brandColors.primary,
              '&:hover': {
                backgroundColor: brandColors.actions.primary,
              },
            }}
          >
            {content.createButtonText}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<InfoIcon />}
            onClick={handleViewPackages}
            sx={{
              borderColor: brandColors.primary,
              color: brandColors.primary,
              '&:hover': {
                borderColor: brandColors.actions.primary,
                backgroundColor: brandColors.backgrounds.hover,
              },
            }}
          >
            {content.packageButtonText}
          </Button>
        </Box>
      </Box>

      {/* Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CampaignIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Active Ads
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockData.activeAds}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VisibilityIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {content.metrics.impressions}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockData.totalImpressions.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ClickIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {content.metrics.clicks}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockData.totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {content.metrics.ctr}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockData.clickThroughRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Performance */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Performance (5 days)
            </Typography>
            <Chip 
              label="+12.5%" 
              color="success" 
              size="small"
              sx={{ backgroundColor: brandColors.success, color: 'white' }}
            />
          </Box>
          
          {mockData.recentPerformance.map((day, index) => (
            <Box key={day.day} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {day.day}
                </Typography>
                <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                  {day.impressions} views • {day.clicks} clicks
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(day.clicks / day.impressions) * 100} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: brandColors.backgrounds.secondary,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: brandColors.primary,
                  },
                }}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Ad List */}
      <AdvertiseAdList workspaceType={workspaceType} />
    </Box>
  );
};

export default AdvertiseDashboard;
