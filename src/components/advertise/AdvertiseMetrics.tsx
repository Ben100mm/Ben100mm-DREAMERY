import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  TouchApp as ClickIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';

interface AdvertiseMetricsProps {
  workspaceType: 'rent' | 'manage' | 'fund' | 'operate';
  adId?: string;
}

const AdvertiseMetrics: React.FC<AdvertiseMetricsProps> = ({ workspaceType, adId }) => {
  const [dateRange, setDateRange] = useState('30');

  // Mock data - in real app this would come from API
  const mockMetrics = {
    totalImpressions: 12500,
    totalClicks: 340,
    totalConversions: 28,
    clickThroughRate: 2.7,
    conversionRate: 8.2,
    costPerClick: 2.45,
    costPerConversion: 29.85,
    totalSpend: 833,
    averagePosition: 3.2,
    weeklyData: [
      { week: 'Week 1', impressions: 2800, clicks: 76, conversions: 6 },
      { week: 'Week 2', impressions: 3200, clicks: 89, conversions: 7 },
      { week: 'Week 3', impressions: 2900, clicks: 78, conversions: 8 },
      { week: 'Week 4', impressions: 3600, clicks: 97, conversions: 7 },
    ],
    topPerformingKeywords: [
      { keyword: workspaceType === 'rent' ? 'apartment for rent' : 
                 workspaceType === 'manage' ? 'property management' :
                 workspaceType === 'fund' ? 'real estate investment' :
                 'home renovation', 
        clicks: 45, ctr: 3.2 },
      { keyword: workspaceType === 'rent' ? '2 bedroom apartment' :
                 workspaceType === 'manage' ? 'rental property management' :
                 workspaceType === 'fund' ? 'investment opportunity' :
                 'contractor services', 
        clicks: 38, ctr: 2.8 },
      { keyword: workspaceType === 'rent' ? 'pet friendly rental' :
                 workspaceType === 'manage' ? 'tenant screening' :
                 workspaceType === 'fund' ? 'real estate crowdfunding' :
                 'home improvement', 
        clicks: 32, ctr: 2.5 },
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 45, clicks: 153 },
      { device: 'Mobile', percentage: 40, clicks: 136 },
      { device: 'Tablet', percentage: 15, clicks: 51 },
    ],
  };

  const getContextualLabels = () => {
    switch (workspaceType) {
      case 'rent':
        return {
          impressions: 'Property Views',
          clicks: 'Inquiries',
          conversions: 'Applications',
          ctr: 'Inquiry Rate',
          conversionRate: 'Application Rate',
        };
      case 'manage':
        return {
          impressions: 'Profile Views',
          clicks: 'Lead Inquiries',
          conversions: 'Service Requests',
          ctr: 'Lead Rate',
          conversionRate: 'Conversion Rate',
        };
      case 'fund':
        return {
          impressions: 'Opportunity Views',
          clicks: 'Investor Inquiries',
          conversions: 'Investment Commitments',
          ctr: 'Interest Rate',
          conversionRate: 'Commitment Rate',
        };
      case 'operate':
        return {
          impressions: 'Service Views',
          clicks: 'Service Inquiries',
          conversions: 'Project Requests',
          ctr: 'Inquiry Rate',
          conversionRate: 'Project Rate',
        };
    }
  };

  const labels = getContextualLabels();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.text.primary }}>
          Advertising Metrics
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            label="Date Range"
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
            <MenuItem value="365">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ViewIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {labels.impressions}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockMetrics.totalImpressions.toLocaleString()}
              </Typography>
              <Chip 
                label="+12.5%" 
                size="small" 
                color="success" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ClickIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {labels.clicks}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockMetrics.totalClicks}
              </Typography>
              <Chip 
                label="+8.3%" 
                size="small" 
                color="success" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {labels.conversions}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockMetrics.totalConversions}
              </Typography>
              <Chip 
                label="+15.2%" 
                size="small" 
                color="success" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: brandColors.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {labels.ctr}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: brandColors.primary }}>
                {mockMetrics.clickThroughRate}%
              </Typography>
              <Chip 
                label="+0.3%" 
                size="small" 
                color="success" 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Data */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Weekly Performance
              </Typography>
              
              {mockMetrics.weeklyData.map((week, index) => (
                <Box key={week.week} sx={{ mb: 2, p: 2, backgroundColor: brandColors.backgrounds.secondary, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {week.week}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                      {week.conversions} {labels.conversions.toLowerCase()}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          {week.impressions.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                          {labels.impressions}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          {week.clicks}
                        </Typography>
                        <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                          {labels.clicks}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          {((week.clicks / week.impressions) * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                          {labels.ctr}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Top Keywords
              </Typography>
              
              {mockMetrics.topPerformingKeywords.map((keyword, index) => (
                <Box key={keyword.keyword} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {keyword.keyword}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                      {keyword.clicks} clicks
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                      CTR: {keyword.ctr}%
                    </Typography>
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: brandColors.primary, 
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20,
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Device Breakdown
              </Typography>
              
              {mockMetrics.deviceBreakdown.map((device) => (
                <Box key={device.device} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {device.device}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                      {device.percentage}%
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 6, 
                      backgroundColor: brandColors.backgrounds.secondary,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: `${device.percentage}%`, 
                        height: '100%', 
                        backgroundColor: brandColors.primary,
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: brandColors.text.secondary, mt: 0.5 }}>
                    {device.clicks} clicks
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvertiseMetrics;
