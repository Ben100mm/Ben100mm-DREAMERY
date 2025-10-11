import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TouchApp as ClickIcon,
  TrendingUp as TrendingUpIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { brandColors } from '../../theme';
import AdvertiseEditForm from './AdvertiseEditForm';

interface AdvertiseAdListProps {
  workspaceType: 'rent' | 'manage' | 'fund' | 'operate';
}

interface AdData {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  impressions: number;
  clicks: number;
  ctr: number;
  createdAt: string;
  image?: string;
}

const AdvertiseAdList: React.FC<AdvertiseAdListProps> = ({ workspaceType }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAd, setSelectedAd] = useState<string | null>(null);
  const [editingAd, setEditingAd] = useState<string | null>(null);

  // Mock data - in real app this would come from API
  const mockAds: AdData[] = [
    {
      id: '1',
      title: workspaceType === 'rent' ? 'Modern 2BR Apartment in Downtown' : 
             workspaceType === 'manage' ? 'Professional Property Management Services' :
             workspaceType === 'fund' ? 'Mixed-Use Development Opportunity' :
             'Complete Home Renovation Services',
      description: workspaceType === 'rent' ? 'Beautiful 2-bedroom apartment with modern amenities' :
                  workspaceType === 'manage' ? 'Full-service property management for residential and commercial properties' :
                  workspaceType === 'fund' ? 'Prime location mixed-use development with 12% projected returns' :
                  'Expert renovation services for residential properties',
      status: 'active',
      impressions: 2450,
      clicks: 67,
      ctr: 2.7,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: workspaceType === 'rent' ? 'Luxury Studio with City Views' :
             workspaceType === 'manage' ? 'Commercial Property Management' :
             workspaceType === 'fund' ? 'Retail Strip Center Investment' :
             'Kitchen & Bathroom Remodeling',
      description: workspaceType === 'rent' ? 'High-end studio apartment with panoramic city views' :
                  workspaceType === 'manage' ? 'Specialized commercial property management services' :
                  workspaceType === 'fund' ? 'Stable retail investment with established tenants' :
                  'Complete kitchen and bathroom renovation services',
      status: 'paused',
      impressions: 1800,
      clicks: 45,
      ctr: 2.5,
      createdAt: '2024-01-10',
    },
    {
      id: '3',
      title: workspaceType === 'rent' ? 'Family Home in Suburbs' :
             workspaceType === 'manage' ? 'HOA Management Services' :
             workspaceType === 'fund' ? 'Multi-Family Residential Project' :
             'Outdoor Living Space Design',
      description: workspaceType === 'rent' ? 'Spacious family home with backyard and garage' :
                  workspaceType === 'manage' ? 'Comprehensive HOA management and maintenance services' :
                  workspaceType === 'fund' ? '24-unit apartment complex with strong rental demand' :
                  'Custom outdoor living spaces and landscaping',
      status: 'active',
      impressions: 3200,
      clicks: 89,
      ctr: 2.8,
      createdAt: '2024-01-20',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { color: brandColors.success, label: 'Active' };
      case 'paused':
        return { color: brandColors.warning, label: 'Paused' };
      case 'draft':
        return { color: brandColors.text.secondary, label: 'Draft' };
      default:
        return { color: brandColors.text.secondary, label: 'Unknown' };
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, adId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAd(adId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAd(null);
  };

  const handleEdit = () => {
    if (selectedAd) {
      setEditingAd(selectedAd);
    }
    handleMenuClose();
  };

  const handlePauseResume = () => {
    // In real app, this would call API to update status
    console.log('Toggle pause/resume for ad:', selectedAd);
    handleMenuClose();
  };

  const handleDelete = () => {
    // In real app, this would call API to delete
    console.log('Delete ad:', selectedAd);
    handleMenuClose();
  };

  if (editingAd) {
    const adToEdit = mockAds.find(ad => ad.id === editingAd);
    return (
      <AdvertiseEditForm
        adData={adToEdit}
        workspaceType={workspaceType}
        onCancel={() => setEditingAd(null)}
        onSuccess={() => setEditingAd(null)}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Your Advertisements
      </Typography>

      {mockAds.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ImageIcon sx={{ fontSize: 64, color: brandColors.text.secondary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: brandColors.text.secondary, mb: 1 }}>
              No advertisements yet
            </Typography>
            <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
              Create your first advertisement to start reaching potential customers
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {mockAds.map((ad) => {
            const statusInfo = getStatusColor(ad.status);
            return (
              <Grid item xs={12} md={6} lg={4} key={ad.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: statusInfo.color,
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, ad.id)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, minHeight: '2.5em' }}>
                      {ad.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: brandColors.text.secondary, 
                        mb: 2, 
                        minHeight: '3em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {ad.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <ViewIcon sx={{ color: brandColors.primary, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                              Views
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {ad.impressions.toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <ClickIcon sx={{ color: brandColors.primary, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                              Clicks
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {ad.clicks}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <TrendingUpIcon sx={{ color: brandColors.primary, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                              CTR
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {ad.ctr}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    <Typography variant="caption" sx={{ color: brandColors.text.secondary }}>
                      Created {new Date(ad.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePauseResume}>
          <ListItemIcon>
            {mockAds.find(ad => ad.id === selectedAd)?.status === 'active' ? 
              <PauseIcon fontSize="small" /> : 
              <PlayIcon fontSize="small" />
            }
          </ListItemIcon>
          <ListItemText>
            {mockAds.find(ad => ad.id === selectedAd)?.status === 'active' ? 'Pause' : 'Resume'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: brandColors.error }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: brandColors.error }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdvertiseAdList;
