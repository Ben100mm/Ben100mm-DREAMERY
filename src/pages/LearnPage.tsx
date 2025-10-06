import React, { useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  Assignment as CaseStudiesIcon,
  QuestionAnswer as QAIcon,
  LiveTv as LiveSessionsIcon
} from '@mui/icons-material';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const LearnPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'courses', label: 'Courses', icon: <CoursesIcon /> },
    { id: 'casestudies', label: 'Case Studies', icon: <CaseStudiesIcon /> },
    { id: 'qa', label: 'Q&A', icon: <QAIcon /> },
    { id: 'livesessions', label: 'Live Sessions', icon: <LiveSessionsIcon /> },
    { id: 'aitutor', label: 'Lumina', icon: <Box component="img" src="/lumina-logo.png" alt="Lumina logo" sx={{ width: 24, height: 24 }} /> }
  ];

  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Learning Dashboard',
          subtitle: 'Track your educational progress, completed courses, and upcoming learning opportunities'
        };
      case 'courses':
        return {
          title: 'Courses',
          subtitle: 'Comprehensive courses on real estate investing, financing, and property management'
        };
      case 'casestudies':
        return {
          title: 'Case Studies',
          subtitle: 'Real-world examples and success stories from experienced real estate professionals'
        };
      case 'qa':
        return {
          title: 'Q&A',
          subtitle: 'Ask questions and get answers from industry experts and the Dreamery community'
        };
      case 'livesessions':
        return {
          title: 'Live Sessions',
          subtitle: 'Interactive webinars, workshops, and live Q&A sessions with industry leaders'
        };
      case 'aitutor':
        return {
          title: 'Lumina',
          subtitle: 'Personalized AI-powered learning assistance and real-time guidance'
        };
      default:
        return { title: 'Education & Mentorship', subtitle: 'Learn from experts and advance your real estate knowledge' };
    }
  };

  const getBannerIcon = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />;
      case 'courses':
        return <CoursesIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />;
      case 'casestudies':
        return <CaseStudiesIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />;
      case 'qa':
        return <QAIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />;
      case 'livesessions':
        return <LiveSessionsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />;
      case 'aitutor':
        return <Box component="img" src="/lumina-logo.png" alt="Lumina logo" sx={{ width: 28, height: 28 }} />;
      default:
        return <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Learning Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your educational progress, track completed courses, and discover new learning opportunities.
            </Typography>
          </Box>
        );
      case 'courses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Courses
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access comprehensive courses covering real estate investing, financing strategies, and property management best practices.
            </Typography>
          </Box>
        );
      case 'casestudies':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Case Studies
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Learn from real-world examples, success stories, and lessons learned from experienced real estate professionals.
            </Typography>
          </Box>
        );
      case 'qa':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Q&A
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ask questions and get expert answers from industry professionals and the Dreamery community.
            </Typography>
          </Box>
        );
      case 'livesessions':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Live Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join interactive webinars, workshops, and live Q&A sessions with industry leaders and mentors.
            </Typography>
          </Box>
        );
      case 'aitutor':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Lumina
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get personalized AI-powered learning assistance, real-time guidance, and adaptive learning recommendations.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a learning option from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  const banner = getBanner();

  return (
    <>
      <PageAppBar title="Dreamery – Education & Mentorship" />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', mt: '64px' }}>
        {/* Left Sidebar */}
        <Paper 
          elevation={3} 
          sx={{ 
            width: 280, 
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid brandColors.neutral[300]',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Station Header */}
          <Box sx={{ px: 3, py: 2, mb: 1, flexShrink: 0 }}>
            <Box
              sx={{
                backgroundColor: brandColors.primary,
                color: brandColors.text.inverse,
                borderRadius: 2,
                py: 1.5,
                px: 2,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Station
            </Box>
          </Box>

          {/* Sidebar Navigation */}
          <List sx={{ px: 2, pt: 0, flex: 1, overflow: 'auto' }}>
            {sidebarItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => setActiveTab(item.id)}
                  sx={{ 
                    borderRadius: 2, 
                    '& .MuiListItemIcon-root': {
                      color: brandColors.text.inverse,
                    },
                    '& .MuiListItemText-primary': {
                      color: brandColors.text.inverse,
                      fontWeight: 600,
                    },
                    '&:hover': {
                      backgroundColor: brandColors.interactive.hover,
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 40,
                      color: activeTab === item.id ? 'white' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: activeTab === item.id ? 600 : 400,
                      color: activeTab === item.id ? 'white' : 'inherit'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: 3, backgroundColor: brandColors.neutral[50], overflow: 'auto' }}>
          <Container maxWidth="lg">
            {/* Top Banner (matches other pages) */}
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
                {getBannerIcon()}
                <Typography variant="h4" component="h1" sx={{ color: brandColors.text.inverse, fontWeight: 600 }}>
                  {banner.title}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {banner.subtitle}
              </Typography>
            </Paper>

            {renderContent()}
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default LearnPage;
