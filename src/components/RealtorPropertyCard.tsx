/**
 * Property card component that uses realtor.com data
 * Replaces static property data with dynamic data from the API
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  CalendarToday,
  AttachMoney
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PropertyData } from '../types/realtor';
import { realtorService } from '../services/realtorService';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.2s ease',
  width: '100%',
  minHeight: '200px',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  
  '@media (max-width: 768px)': {
    minHeight: '250px',
  },
}));

const PropertyImage = styled('div')(({ theme }) => ({
  height: '200px',
  background: 'linear-gradient(45deg, #eeeeee 25%, transparent 25%), linear-gradient(-45deg, #eeeeee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eeeeee 75%), linear-gradient(-45deg, transparent 75%, #eeeeee 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  position: 'relative',
  overflow: 'hidden',
}));

const ImageOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '16px',
});

const StatusChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const PriceText = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontWeight: 700,
  fontSize: '1.5rem',
  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
}));

const PropertyInfo = styled(Box)(({ theme }) => ({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}));

const AddressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.9rem',
  lineHeight: 1.3,
  marginBottom: '8px',
}));

const DetailsRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
});

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
}));

const PricePerSqft = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  marginTop: '4px',
}));

const LoadingSkeleton = () => (
  <StyledCard>
    <Skeleton variant="rectangular" height={200} />
    <PropertyInfo>
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="60%" height={20} />
      <DetailsRow>
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="text" width={80} height={20} />
      </DetailsRow>
    </PropertyInfo>
  </StyledCard>
);

interface RealtorPropertyCardProps {
  property: PropertyData;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  onPropertyClick?: (property: PropertyData) => void;
  loading?: boolean;
}

const RealtorPropertyCard: React.FC<RealtorPropertyCardProps> = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  onPropertyClick,
  loading = false
}) => {
  const formattedProperty = realtorService.formatPropertyForDisplay(property);

  const handleCardClick = () => {
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.property_id);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <PropertyImage>
        {formattedProperty.image && formattedProperty.image !== 'P1' ? (
          <>
            <img
              src={formattedProperty.image}
              alt={formattedProperty.address}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <ImageOverlay>
              <PriceText>{formattedProperty.price}</PriceText>
            </ImageOverlay>
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No Image Available
            </Typography>
            <PriceText sx={{ color: 'text.primary', mt: 1 }}>
              {formattedProperty.price}
            </PriceText>
          </Box>
        )}
        
        {property.status && (
          <StatusChip
            label={property.status.replace('_', ' ').toUpperCase()}
            size="small"
          />
        )}
        
        {onToggleFavorite && (
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
              },
            }}
          >
            {isFavorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder color="action" />
            )}
          </IconButton>
        )}
      </PropertyImage>

      <PropertyInfo>
        <AddressText>{formattedProperty.address}</AddressText>
        
        <DetailsRow>
          <DetailItem>
            <Bed fontSize="small" />
            <Typography variant="body2">
              {formattedProperty.beds} bed{formattedProperty.beds !== 1 ? 's' : ''}
            </Typography>
          </DetailItem>
          
          <DetailItem>
            <Bathtub fontSize="small" />
            <Typography variant="body2">
              {formattedProperty.baths} bath{formattedProperty.baths !== 1 ? 's' : ''}
            </Typography>
          </DetailItem>
          
          {formattedProperty.sqft > 0 && (
            <DetailItem>
              <SquareFoot fontSize="small" />
              <Typography variant="body2">
                {formattedProperty.sqft.toLocaleString()} sqft
              </Typography>
            </DetailItem>
          )}
        </DetailsRow>

        {formattedProperty.daysOnMarket > 0 && (
          <DetailItem>
            <CalendarToday fontSize="small" />
            <Typography variant="body2">
              {formattedProperty.daysOnMarket} days on market
            </Typography>
          </DetailItem>
        )}

        {formattedProperty.pricePerSqft > 0 && (
          <PricePerSqft>
            ${formattedProperty.pricePerSqft}/sqft
          </PricePerSqft>
        )}

        {property.description?.type && (
          <Chip
            label={property.description.type}
            size="small"
            variant="outlined"
            sx={{ mt: 1, alignSelf: 'flex-start' }}
          />
        )}
      </PropertyInfo>
    </StyledCard>
  );
};

export default RealtorPropertyCard;
