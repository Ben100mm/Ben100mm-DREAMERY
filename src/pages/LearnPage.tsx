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
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  Assignment as CaseStudiesIcon,
  QuestionAnswer as QAIcon,
  LiveTv as LiveSessionsIcon,
  TrendingUp as InvestorIcon,
  Home as BuyerIcon,
  Business as BusinessIcon,
  Handshake as AgentIcon,
  AutoStories as LibraryIcon,
  Psychology as AIIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageAppBar } from '../components/Header';
import { brandColors } from '../theme/theme';

const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'courses', label: 'Courses', icon: <CoursesIcon /> },
    { id: 'casestudies', label: 'Case Studies', icon: <CaseStudiesIcon /> },
    { id: 'qa', label: 'Q&A', icon: <QAIcon /> },
    { id: 'livesessions', label: 'Live Sessions', icon: <LiveSessionsIcon /> },
    { id: 'aitutor', label: 'Lumina', icon: null } // Will be handled specially
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

  const learningPaths = [
    {
      id: 'buyer',
      title: 'Home Buyers',
      icon: <BuyerIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Navigate the home buying process with confidence',
      courses: ['First-Time Homebuyer Essentials', 'Understanding Mortgage Options', 'Home Inspection Mastery'],
      level: 'Beginner to Intermediate'
    },
    {
      id: 'investor',
      title: 'Real Estate Investors',
      icon: <InvestorIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Build and scale your real estate investment portfolio',
      courses: ['Property Analysis & Valuation', 'Rental Property Management', 'Tax Strategies for Investors'],
      level: 'Intermediate to Advanced'
    },
    {
      id: 'agent',
      title: 'Real Estate Agents',
      icon: <AgentIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Grow your business and serve clients better',
      courses: ['Digital Marketing for Agents', 'Negotiation Mastery', 'Building Your Personal Brand'],
      level: 'All Levels'
    },
    {
      id: 'broker',
      title: 'Brokers & Teams',
      icon: <BusinessIcon sx={{ fontSize: 40, color: brandColors.primary }} />,
      description: 'Scale your brokerage and lead high-performing teams',
      courses: ['Team Leadership', 'Brokerage Operations', 'Compliance & Risk Management'],
      level: 'Advanced'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              Learning Paths for Every Professional
            </Typography>
            <Grid container spacing={3}>
              {learningPaths.map((path) => (
                <Grid item xs={12} md={6} key={path.id}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {path.icon}
                        <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                          {path.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {path.description}
                      </Typography>
                      <Chip 
                        label={path.level} 
                        size="small" 
                        sx={{ mb: 2, backgroundColor: brandColors.surfaces.elevated }}
                      />
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Featured Courses:
                      </Typography>
                      <List dense>
                        {path.courses.map((course, idx) => (
                          <ListItem key={idx} sx={{ pl: 0 }}>
                            <Typography variant="body2" color="text.secondary">
                              • {course}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => setActiveTab('courses')}
                        sx={{ 
                          backgroundColor: brandColors.primary,
                          '&:hover': { backgroundColor: brandColors.interactive.hover }
                        }}
                      >
                        Explore Courses
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Additional Learning Resources Section */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Additional Learning Resources
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={1}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                    }}
                    onClick={() => setActiveTab('casestudies')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CaseStudiesIcon sx={{ color: brandColors.primary, mr: 1 }} />
                        <Typography variant="h6">Case Studies</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Real success stories and deal breakdowns
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={1}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                    }}
                    onClick={() => setActiveTab('livesessions')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LiveSessionsIcon sx={{ color: brandColors.primary, mr: 1 }} />
                        <Typography variant="h6">Live Sessions</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Interactive webinars with industry experts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={1}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                    }}
                    onClick={() => navigate('/lumina')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AIIcon sx={{ color: brandColors.primary, mr: 1 }} />
                        <Typography variant="h6">Lumina AI Tutor</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        24/7 personalized AI-powered guidance
            </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      case 'courses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Courses
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Access comprehensive courses covering real estate investing, financing strategies, and property management best practices.
            </Typography>
            <Grid container spacing={3}>
              {learningPaths.map((path) => (
                <Grid item xs={12} key={path.id}>
                  <Paper elevation={1} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {path.icon}
                      <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
                        {path.title} Courses
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {path.courses.map((course, idx) => (
                        <Grid item xs={12} md={4} key={idx}>
                          <Card elevation={0} sx={{ backgroundColor: brandColors.surfaces.elevated }}>
                            <CardContent>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                {course}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Comprehensive training module
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 'casestudies':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Case Studies
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Learn from real-world examples, success stories, and lessons learned from experienced real estate professionals.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="First-Time Buyer" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      From Renting to Owning: A Success Story
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      How Sarah navigated the home buying process and built $100K in equity in 3 years.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Investor" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Building a 10-Property Portfolio
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Learn how Mike scaled from one rental to ten properties in 5 years using strategic financing.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Agent" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      From 5 to 50 Transactions Per Year
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      How Jennifer used digital marketing to 10x her real estate business.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Broker" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Scaling a Boutique Brokerage
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      How Tom grew his team from 3 to 25 agents while maintaining culture and quality.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 'qa':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Q&A Community
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Ask questions and get expert answers from industry professionals and the Dreamery community.
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Popular Questions This Week
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="What's the best strategy for house hacking in 2024?"
                    secondary="12 expert answers • Real Estate Investing"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="How do I calculate ROI on a fix-and-flip property?"
                    secondary="8 expert answers • Property Analysis"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="What closing costs should I expect as a first-time buyer?"
                    secondary="15 expert answers • Home Buying"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="How can I generate more leads as a new agent?"
                    secondary="20 expert answers • Real Estate Marketing"
                  />
                </ListItem>
              </List>
            </Paper>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: brandColors.primary,
                '&:hover': { backgroundColor: brandColors.interactive.hover }
              }}
            >
              Ask a Question
            </Button>
          </Box>
        );
      case 'livesessions':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Live Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join interactive webinars, workshops, and live Q&A sessions with industry leaders and mentors.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Upcoming" color="success" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Market Analysis Workshop
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Learn how to analyze local market trends and identify investment opportunities.
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Thursday, 2:00 PM EST
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Register</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Upcoming" color="success" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Negotiation Masterclass
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Advanced negotiation tactics for agents and investors with industry veteran Lisa Chen.
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Friday, 4:00 PM EST
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Register</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Recording Available" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Tax Strategies for 2024
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Maximize your returns with expert tax planning strategies for real estate investors.
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Recorded: Last Week
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Watch Recording</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Chip label="Recording Available" size="small" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Building Your Agent Brand
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Create a powerful personal brand that attracts clients and builds trust.
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Recorded: 2 Weeks Ago
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Watch Recording</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 'aitutor':
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Lumina AI Tutor
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Get personalized AI-powered learning assistance, real-time guidance, and adaptive learning recommendations.
            </Typography>
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mb: 3 }}>
              <Box 
                component="img" 
                src="/lumina-logo.png" 
                alt="Lumina logo" 
                sx={{ width: 80, height: 80, mb: 2 }} 
              />
              <Typography variant="h6" gutterBottom>
                24/7 Personalized Learning Support
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Lumina adapts to your learning style and provides instant answers to your real estate questions.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/lumina')}
                sx={{ 
                  backgroundColor: brandColors.primary,
                  '&:hover': { backgroundColor: brandColors.interactive.hover }
                }}
              >
                Start Learning with Lumina
              </Button>
            </Paper>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Instant Answers</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get immediate responses to your real estate questions, any time of day.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Personalized Path</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lumina creates a custom learning journey based on your goals and experience.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Practice Scenarios</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Role-play negotiations, property analysis, and client conversations.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
                    backgroundColor: activeTab === item.id ? brandColors.primary : 'transparent',
                    '& .MuiListItemIcon-root': {
                      color: activeTab === item.id ? brandColors.text.inverse : brandColors.text.primary,
                    },
                    '& .MuiListItemText-primary': {
                      color: activeTab === item.id ? brandColors.text.inverse : brandColors.text.primary,
                      fontWeight: activeTab === item.id ? 600 : 500,
                    },
                    '&:hover': {
                      backgroundColor: activeTab === item.id ? brandColors.primary : brandColors.interactive.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.id === 'aitutor' ? (
                      <Box 
                        component="img" 
                        src="/lumina-logo.png" 
                        alt="Lumina logo" 
                        sx={{ 
                          width: 24, 
                          height: 24,
                          filter: activeTab === item.id ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%)'
                        }} 
                      />
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem'
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
