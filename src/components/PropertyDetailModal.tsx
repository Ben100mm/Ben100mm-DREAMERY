import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Badge,
  Tooltip,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Garage as GarageIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  DirectionsCar as CarIcon,
  DirectionsWalk as WalkIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  PhotoLibrary as PhotoLibraryIcon,
  ViewInAr as VirtualTourIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
import { brandColors, colorUtils } from '../theme';
import { PropertyData } from '../types/realtor';

// Styled components
const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    max-width: 90vw;
    max-height: 90vh;
    width: 1200px;
    margin: 24px;
    border-radius: 16px;
    box-shadow: ${colorUtils.shadowColored(0.3, 24, 8)};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid ${brandColors.borders.secondary};
  background: ${brandColors.backgrounds.primary};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PhotoGallery = styled.div`
  position: relative;
  height: 400px;
  background: ${brandColors.neutral[100]};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const PhotoContainer = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: all 0.3s ease;
`;

const PhotoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
`;

const PhotoNavigation = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
  }
  
  &.prev {
    left: 16px;
  }
  
  &.next {
    right: 16px;
  }
`;

const PhotoCounter = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const FeatureCard = styled(Card)`
  border: 1px solid ${brandColors.borders.secondary};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${brandColors.primary};
    box-shadow: ${colorUtils.shadowColored(0.1, 8, 4)};
  }
`;

const FinancialCard = styled(Card)`
  background: ${brandColors.backgrounds.secondary};
  border: 1px solid ${brandColors.borders.secondary};
  margin-bottom: 16px;
`;

const AgentCard = styled(Card)`
  background: ${brandColors.backgrounds.secondary};
  border: 1px solid ${brandColors.borders.secondary};
  padding: 16px;
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface PropertyDetailModalProps {
  open: boolean;
  onClose: () => void;
  property: PropertyData | null;
  onFavorite?: (propertyId: string) => void;
  favorites?: Set<string>;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  open,
  onClose,
  property,
  onFavorite,
  favorites = new Set(),
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!property) {
    return (
      <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading property details...</Typography>
          </Box>
        </DialogContent>
      </StyledDialog>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePhotoNavigation = (direction: 'prev' | 'next') => {
    const photos = property.photos || [];
    if (photos.length === 0) return;

    if (direction === 'prev') {
      setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    } else {
      setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft: number | undefined) => {
    if (!sqft) return 'N/A';
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const photos = property.photos || [];
  const currentPhoto = photos[currentPhotoIndex];
  const hasVirtualTour = photos.some(photo => (photo as any).is_virtual_tour);

  const isFavorited = favorites.has(property.property_id);

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose} 
      maxWidth={false}
      fullWidth
      fullScreen={isMobile}
    >
      <ModalHeader>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: brandColors.primary, mb: 1 }}>
            {formatPrice(property.list_price)}
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.text.secondary, mb: 1 }}>
            {property.address?.formatted_address || property.address?.full_line || 'Address not available'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<HomeIcon />}
              label={`${property.description?.beds || 0} beds`}
              size="small"
              color="primary"
            />
            <Chip
              icon={<BathtubIcon />}
              label={`${property.description?.baths_full || 0} baths`}
              size="small"
              color="primary"
            />
            <Chip
              icon={<SquareFootIcon />}
              label={`${formatSquareFeet(property.description?.sqft)} sqft`}
              size="small"
              color="primary"
            />
            {property.description?.garage && (
              <Chip
                icon={<GarageIcon />}
                label={`${property.description.garage} garage`}
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
          <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
            <IconButton
              onClick={() => onFavorite?.(property.property_id)}
              sx={{ color: isFavorited ? brandColors.accent.error : brandColors.neutral[400] }}
            >
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton sx={{ color: brandColors.neutral[600] }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} sx={{ color: brandColors.neutral[600] }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </ModalHeader>

      <DialogContent sx={{ p: 0, height: 'calc(90vh - 120px)', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          {/* Photo Gallery Section */}
          <Box sx={{ width: '50%', p: 3, borderRight: `1px solid ${brandColors.borders.secondary}` }}>
            <PhotoGallery>
              {currentPhoto ? (
                <PhotoContainer imageUrl={currentPhoto.href}>
                  <PhotoOverlay>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {hasVirtualTour && (
                        <Badge
                          badgeContent="3D Tour"
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.75rem',
                              height: '20px',
                              minWidth: '60px',
                            },
                          }}
                        >
                          <VirtualTourIcon sx={{ color: 'white' }} />
                        </Badge>
                      )}
                      <Tooltip title="View fullscreen">
                        <IconButton sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}>
                          <FullscreenIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </PhotoOverlay>
                  
                  {photos.length > 1 && (
                    <>
                      <PhotoNavigation 
                        className="prev"
                        onClick={() => handlePhotoNavigation('prev')}
                      >
                        <ChevronLeftIcon />
                      </PhotoNavigation>
                      <PhotoNavigation 
                        className="next"
                        onClick={() => handlePhotoNavigation('next')}
                      >
                        <ChevronRightIcon />
                      </PhotoNavigation>
                    </>
                  )}
                  
                  <PhotoCounter>
                    {currentPhotoIndex + 1} of {photos.length}
                  </PhotoCounter>
                </PhotoContainer>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: brandColors.neutral[500]
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PhotoLibraryIcon sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="body1">No photos available</Typography>
                  </Box>
                </Box>
              )}
            </PhotoGallery>

            {/* Photo Thumbnails */}
            {photos.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
                {photos.map((photo, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 1,
                      backgroundImage: `url(${photo.href})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      border: currentPhotoIndex === index ? `2px solid ${brandColors.primary}` : '2px solid transparent',
                      opacity: currentPhotoIndex === index ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                    onClick={() => setCurrentPhotoIndex(index)}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Content Section */}
          <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="property details tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Overview" />
                <Tab label="Details" />
                <Tab label="Financial" />
                <Tab label="Neighborhood" />
                <Tab label="Agent" />
              </Tabs>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              {/* Overview Tab */}
              <TabPanel value={activeTab} index={0}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                    Property Overview
                  </Typography>
                  
                  <FeatureGrid>
                    <FeatureCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <HomeIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Property Type
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                          {property.description?.type || 'Single Family'}
                        </Typography>
                      </CardContent>
                    </FeatureCard>

                    <FeatureCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Year Built
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                          {property.description?.year_built || 'N/A'}
                        </Typography>
                      </CardContent>
                    </FeatureCard>

                    <FeatureCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TrendingUpIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Days on Market
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                          {property.days_on_mls || 'N/A'}
                        </Typography>
                      </CardContent>
                    </FeatureCard>

                    <FeatureCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MoneyIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Price per Sq Ft
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                          {property.prc_sqft ? `$${property.prc_sqft.toLocaleString()}` : 'N/A'}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </FeatureGrid>
                </Box>

                {/* Property Status */}
                {property.flags && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                      Property Status
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {property.flags.is_new_listing && (
                        <Chip label="New Listing" color="success" size="small" />
                      )}
                      {property.flags.is_price_reduced && (
                        <Chip label="Price Reduced" color="warning" size="small" />
                      )}
                      {property.flags.is_pending && (
                        <Chip label="Pending" color="info" size="small" />
                      )}
                      {property.flags.is_contingent && (
                        <Chip label="Contingent" color="warning" size="small" />
                      )}
                      {property.flags.is_new_construction && (
                        <Chip label="New Construction" color="primary" size="small" />
                      )}
                      {property.flags.is_coming_soon && (
                        <Chip label="Coming Soon" color="info" size="small" />
                      )}
                    </Box>
                  </Box>
                )}

                {/* Open Houses */}
                {property.open_houses && property.open_houses.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                      Open Houses
                    </Typography>
                    {property.open_houses.map((openHouse, index) => (
                      <Card key={index} sx={{ mb: 2, bgcolor: brandColors.backgrounds.success }}>
                        <CardContent>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {openHouse.description || 'Open House'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                            {openHouse.start_date && new Date(openHouse.start_date).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </TabPanel>

              {/* Details Tab */}
              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Property Details & Features
                </Typography>
                
                {property.details && property.details.length > 0 ? (
                  <FeatureGrid>
                    {property.details.map((detail, index) => (
                      <FeatureCard key={index}>
                        <CardContent>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {detail.category || 'Features'}
                          </Typography>
                          {detail.text && detail.text.map((text, textIndex) => (
                            <Typography key={textIndex} variant="body2" sx={{ color: brandColors.text.secondary, mb: 0.5 }}>
                              • {text}
                            </Typography>
                          ))}
                        </CardContent>
                      </FeatureCard>
                    ))}
                  </FeatureGrid>
                ) : (
                  <Alert severity="info">
                    No detailed features available for this property.
                  </Alert>
                )}
              </TabPanel>

              {/* Financial Tab */}
              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Financial Information
                </Typography>
                
                <FinancialCard>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Property Estimates
                    </Typography>
                    {property.estimates?.current_values && property.estimates.current_values.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {property.estimates.current_values.map((estimate, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {estimate.source?.name || 'Estimate'}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatPrice(estimate.estimate_high || 0)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                        No estimates available
                      </Typography>
                    )}
                  </CardContent>
                </FinancialCard>

                {/* Market Intelligence Section */}
                <FinancialCard>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Market Intelligence
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Days on Market */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">Days on Market</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {property.days_on_mls || 'N/A'}
                        </Typography>
                      </Box>

                      {/* Price per Square Foot */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MoneyIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">Price per Sq Ft</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {property.prc_sqft ? `$${property.prc_sqft.toLocaleString()}` : 'N/A'}
                        </Typography>
                      </Box>

                      {/* Market Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Market Status</Typography>
                        <Chip
                          label={property.status || 'Unknown'}
                          size="small"
                          color={property.status === 'for_sale' ? 'primary' : 'default'}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </FinancialCard>

                {/* Popularity Metrics */}
                {property.popularity && (
                  <FinancialCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Popularity Metrics
                      </Typography>
                      {property.popularity.periods && property.popularity.periods.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {property.popularity.periods.map((period, index) => (
                            <Box key={index}>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Last {period.last_n_days} days:
                              </Typography>
                              <Grid container spacing={1}>
                                {period.views_total && (
                                  <Box sx={{ gridColumn: 'span 6' }}>
                                    <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                                      Views: {period.views_total.toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                                {period.saves_total && (
                                  <Box sx={{ gridColumn: 'span 6' }}>
                                    <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                                      Saves: {period.saves_total.toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                                {period.clicks_total && (
                                  <Box sx={{ gridColumn: 'span 6' }}>
                                    <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                                      Clicks: {period.clicks_total.toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                                {period.leads_total && (
                                  <Box sx={{ gridColumn: 'span 6' }}>
                                    <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                                      Leads: {period.leads_total.toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                          No popularity data available
                        </Typography>
                      )}
                    </CardContent>
                  </FinancialCard>
                )}

                {property.tax_record && (
                  <FinancialCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Tax Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Assessed Value:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatPrice(property.tax_record.assessed_value)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Annual Tax:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatPrice(property.tax_record.tax_amount)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </FinancialCard>
                )}

                {property.monthly_fees && (
                  <FinancialCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Monthly Fees
                      </Typography>
                      <Typography variant="body2">
                        {property.monthly_fees.description}: {property.monthly_fees.display_amount}
                      </Typography>
                    </CardContent>
                  </FinancialCard>
                )}

                {/* One-time Fees */}
                {property.one_time_fees && property.one_time_fees.length > 0 && (
                  <FinancialCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        One-time Fees
                      </Typography>
                      {property.one_time_fees.map((fee, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{fee.description}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {fee.display_amount}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </FinancialCard>
                )}
              </TabPanel>

              {/* Neighborhood Tab */}
              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Neighborhood & Location
                </Typography>
                
                <FeatureCard sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Location Details
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: brandColors.primary }} />
                        <Typography variant="body2">
                          {property.address?.formatted_address || 'Address not available'}
                        </Typography>
                      </Box>
                      {property.neighborhoods && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">
                            Neighborhood: {property.neighborhoods}
                          </Typography>
                        </Box>
                      )}
                      {property.county && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">
                            County: {property.county}
                          </Typography>
                        </Box>
                      )}
                      {property.coordinates && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">
                            Coordinates: {property.coordinates.lat.toFixed(6)}, {property.coordinates.lng.toFixed(6)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </FeatureCard>

                {/* Transportation & Walkability */}
                <FeatureCard sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Transportation & Walkability
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Walk Score */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WalkIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">Walk Score</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          {property.walk_score || 'N/A'}
                        </Typography>
                      </Box>
                      
                      {/* Bike Score */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CarIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">Bike Score</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          {property.bike_score || 'N/A'}
                        </Typography>
                      </Box>
                      
                      {/* Transit Score */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CarIcon sx={{ mr: 1, color: brandColors.primary }} />
                          <Typography variant="body2">Transit Score</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.primary }}>
                          {property.transit_score || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </FeatureCard>

                {property.nearby_schools && property.nearby_schools.length > 0 && (
                  <FeatureCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Nearby Schools
                      </Typography>
                      <List dense>
                        {property.nearby_schools.map((school, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <SchoolIcon sx={{ color: brandColors.primary }} />
                            </ListItemIcon>
                            <ListItemText primary={school} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </FeatureCard>
                )}

                {/* Neighborhood Amenities */}
                {property.amenities && property.amenities.length > 0 ? (
                  <FeatureCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Nearby Amenities
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {property.amenities.slice(0, 10).map((amenity, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">
                              {amenity.name} ({amenity.type})
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {amenity.rating && (
                                <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                                  ⭐ {amenity.rating}
                                </Typography>
                              )}
                              {amenity.distance_meters && (
                                <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                                  {Math.round(amenity.distance_meters)}m
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ))}
                        {property.amenities.length > 10 && (
                          <Typography variant="caption" sx={{ color: brandColors.text.secondary, fontStyle: 'italic' }}>
                            +{property.amenities.length - 10} more amenities
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </FeatureCard>
                ) : (
                  <FeatureCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Neighborhood Amenities
                      </Typography>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Amenity data will be available after external API integration.
                      </Alert>
                    </CardContent>
                  </FeatureCard>
                )}

                {/* Demographics */}
                {property.demographics && (
                  <FeatureCard>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Neighborhood Demographics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {property.demographics.population && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Population:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {property.demographics.population.toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                        {property.demographics.median_age && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Median Age:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {property.demographics.median_age} years
                            </Typography>
                          </Box>
                        )}
                        {property.demographics.median_income && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Median Income:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ${property.demographics.median_income.toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                        {property.demographics.employment_rate && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Employment Rate:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {(property.demographics.employment_rate * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </FeatureCard>
                )}
              </TabPanel>

              {/* Agent Tab */}
              <TabPanel value={activeTab} index={4}>
                <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary }}>
                  Agent & Contact Information
                </Typography>
                
                {property.advertisers?.agent ? (
                  <AgentCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: brandColors.primary, mr: 2 }}>
                        {property.advertisers.agent.name?.charAt(0) || 'A'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {property.advertisers.agent.name || 'Agent Name'}
                        </Typography>
                        {property.advertisers.agent.state_license && (
                          <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                            License: {property.advertisers.agent.state_license}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {property.advertisers.agent.email && (
                        <Button
                          startIcon={<EmailIcon />}
                          variant="outlined"
                          href={`mailto:${property.advertisers.agent.email}`}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          {property.advertisers.agent.email}
                        </Button>
                      )}
                      {property.advertisers.agent.phones && property.advertisers.agent.phones.length > 0 && (
                        <Button
                          startIcon={<PhoneIcon />}
                          variant="outlined"
                          href={`tel:${property.advertisers.agent.phones[0]}`}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          {property.advertisers.agent.phones[0]}
                        </Button>
                      )}
                    </Box>
                  </AgentCard>
                ) : (
                  <Alert severity="info">
                    No agent information available for this property.
                  </Alert>
                )}

                {property.advertisers?.office && (
                  <AgentCard sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Office Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {property.advertisers.office.name || 'Office Name'}
                    </Typography>
                    {property.advertisers.office.email && (
                      <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                        Email: {property.advertisers.office.email}
                      </Typography>
                    )}
                  </AgentCard>
                )}
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default PropertyDetailModal;
