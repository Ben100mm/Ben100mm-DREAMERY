import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Box,
  Tabs,
  Tab,
  Alert,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingIcon,
  Assessment as AssessmentIcon,
  Map as MapIcon,
  Timeline as TimelineIcon,
  Compare as CompareIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const AnalysisCard = styled(Card)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MetricCard = styled(Card)`
  background: linear-gradient(135deg, #1a365d 0%, #2d5a8b 100%);
  color: white;
  height: 100%;
`;

const mockMarketData = {
  averagePrice: "$485,000",
  pricePerSqFt: "$245",
  daysOnMarket: 45,
  inventoryLevel: "Low",
  marketTrend: "+3.2%",
  capRate: "5.8%",
  roi: "12.4%"
};

const mockComparableProperties = [
  {
    address: "123 Main St",
    price: "$450,000",
    sqft: 1200,
    pricePerSqFt: "$375",
    daysOnMarket: 42,
    status: "Sold"
  },
  {
    address: "456 Oak Ave",
    price: "$520,000",
    sqft: 1400,
    pricePerSqFt: "$371",
    daysOnMarket: 38,
    status: "Sold"
  },
  {
    address: "789 Pine Rd",
    price: "$480,000",
    sqft: 1250,
    pricePerSqFt: "$384",
    daysOnMarket: 45,
    status: "Active"
  },
  {
    address: "321 Elm St",
    price: "$495,000",
    sqft: 1300,
    pricePerSqFt: "$381",
    daysOnMarket: 52,
    status: "Sold"
  }
];

const mockInvestmentMetrics = [
  { metric: "Cash Flow", value: "$2,400/month", trend: "+5.2%" },
  { metric: "Cap Rate", value: "5.8%", trend: "+0.3%" },
  { metric: "ROI", value: "12.4%", trend: "+1.1%" },
  { metric: "Appreciation", value: "3.2%/year", trend: "+0.8%" }
];

const AnalyzePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [propertyAddress, setPropertyAddress] = useState('');

  return (
    <PageTemplate 
      title="Property Analysis" 
      subtitle="Get comprehensive insights and market data for informed decisions"
    >
      {/* Search Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analyze a Property
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
            gap: 2, 
            alignItems: 'center' 
          }}>
            <TextField
              fullWidth
              label="Enter property address"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="123 Main St, City, State"
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<AnalyticsIcon />}
              sx={{ height: '56px' }}
            >
              Analyze Property
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Market Overview" />
          <Tab label="Property Analysis" />
          <Tab label="Comparable Sales" />
          <Tab label="Investment Metrics" />
        </Tabs>
      </Box>

      {/* Market Overview Tab */}
      {activeTab === 0 && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3 
        }}>
          <MetricCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Average Sale Price: <strong>{mockMarketData.averagePrice}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Price per Sq Ft: <strong>{mockMarketData.pricePerSqFt}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Days on Market: <strong>{mockMarketData.daysOnMarket} days</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Inventory Level: <strong>{mockMarketData.inventoryLevel}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Market Trend: <strong style={{ color: '#4caf50' }}>{mockMarketData.marketTrend}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Cap Rate: <strong>{mockMarketData.capRate}</strong>
                </Typography>
                <Typography variant="body2">
                  Average ROI: <strong>{mockMarketData.roi}</strong>
                </Typography>
              </Box>
            </CardContent>
          </MetricCard>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Insights
              </Typography>
              <Typography variant="body2" paragraph>
                The current market shows strong fundamentals with increasing property values 
                and decreasing days on market. This indicates a seller's market with 
                strong buyer demand.
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                Market conditions are favorable for both buyers and sellers
              </Alert>
              <Button variant="outlined" startIcon={<TimelineIcon />}>
                View Historical Data
              </Button>
            </CardContent>
          </Card>

          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Market Trends
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
                  gap: 2 
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#1a365d' }}>
                      +3.2%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price Growth
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#1a365d' }}>
                      -12%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days on Market
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#1a365d' }}>
                      +8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sales Volume
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#1a365d' }}>
                      +15%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Buyer Demand
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Property Analysis Tab */}
      {activeTab === 1 && (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3 
        }}>
          <AnalysisCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Property Valuation
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Estimated Value Range
                </Typography>
                <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 'bold' }}>
                  $450,000 - $520,000
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on comparable sales and market conditions
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Confidence Level
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={85} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  85% confidence based on 12 comparable properties
                </Typography>
              </Box>

              <Button variant="contained" fullWidth startIcon={<AssessmentIcon />}>
                Get Detailed Report
              </Button>
            </CardContent>
          </AnalysisCard>

          <AnalysisCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Analysis
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
                gap: 2 
              }}>
                {mockInvestmentMetrics.map((metric, index) => (
                  <Box key={index} sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#1a365d' }}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.metric}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4caf50' }}>
                      {metric.trend}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </AnalysisCard>
        </Box>
      )}

      {/* Comparable Sales Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Comparable Properties
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Recent sales and active listings in the same area for comparison.
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Sq Ft</TableCell>
                  <TableCell align="right">Price/Sq Ft</TableCell>
                  <TableCell align="right">Days on Market</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockComparableProperties.map((property, index) => (
                  <TableRow key={index}>
                    <TableCell>{property.address}</TableCell>
                    <TableCell align="right">{property.price}</TableCell>
                    <TableCell align="right">{property.sqft.toLocaleString()}</TableCell>
                    <TableCell align="right">{property.pricePerSqFt}</TableCell>
                    <TableCell align="right">{property.daysOnMarket}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={property.status} 
                        color={property.status === 'Sold' ? 'success' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Export Data
            </Button>
          </Box>
        </Box>
      )}

      {/* Investment Metrics Tab */}
      {activeTab === 3 && (
        <>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 3 
        }}>
          <AnalysisCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Performance
              </Typography>
              <Typography variant="body2" paragraph>
                Track key investment metrics and performance indicators for your properties.
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
                gap: 3 
              }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#1a365d' }}>
                    $2,400
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Cash Flow
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#1a365d' }}>
                    12.4%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total ROI
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#1a365d' }}>
                    5.8%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cap Rate
                  </Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'rgba(26, 54, 93, 0.1)', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ color: '#1a365d' }}>
                    3.2%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Annual Appreciation
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </AnalysisCard>

          <AnalysisCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Investment Tips
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Consider properties with cap rates above 5% for better cash flow
                </Alert>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Properties in growing neighborhoods show higher appreciation potential
                </Alert>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Factor in maintenance costs when calculating ROI
                </Alert>
              </Box>
            </CardContent>
          </AnalysisCard>
        </Box>

        <Typography variant="h4" sx={{ color: '#1a365d', fontWeight: 700, mb: 3, mt: 4 }}>
          Featured Property Analysis
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
          gap: 3 
        }}>
          {Array.from({ length: 10 }, (_, index) => (
            <AnalysisCard key={`analyze-placeholder-${index}`}>
              <CardContent>
                <Typography variant="h6" component="h3" sx={{ color: '#1a365d', fontWeight: 600, mb: 1 }}>
                  Analysis Property #{index + 1}
                </Typography>
                
                <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 700, mb: 1 }}>
                  ${(450000 + index * 60000).toLocaleString()}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MapIcon sx={{ color: '#718096', fontSize: 20, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {['Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Phoenix, AZ', 'Portland, OR', 'Nashville, TN'][index]}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {(85 + index * 2)}% ROI
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {(12 + index)}% growth
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {(3 + index)} months
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#1a365d',
                    '&:hover': { backgroundColor: '#0d2340' }
                  }}
                >
                  View Analysis
                </Button>
              </CardContent>
            </AnalysisCard>
          ))}
        </Box>
        </>
      )}
    </PageTemplate>
  );
};

export default AnalyzePage; 