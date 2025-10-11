import React from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  School as CoursesIcon,
  Assignment as CaseStudiesIcon,
  QuestionAnswer as QAIcon,
  LiveTv as LiveSessionsIcon,
  TrendingUp as InvestorIcon,
  Home as BuyerIcon,
  Business as BusinessIcon,
  Handshake as AgentIcon,
  Psychology as AIIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { brandColors } from '../theme/theme';

const LearnPage: React.FC = () => {
  const navigate = useNavigate();

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

        return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8, mt: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: brandColors.text.primary,
                mb: 2
              }}
            >
              Learn Real Estate with Dreamery
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              Master the skills you need to succeed in real estate – whether you're buying your first home, building an investment portfolio, or growing your business.
            </Typography>
          </Box>

          {/* Learning Paths Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Choose Your Learning Path
            </Typography>
            <Grid container spacing={4}>
              {learningPaths.map((path) => (
                <Grid item xs={12} md={6} key={path.id}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        {path.icon}
                        <Typography variant="h5" sx={{ ml: 2, fontWeight: 600 }}>
                          {path.title}
            </Typography>
          </Box>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {path.description}
                      </Typography>
                      <Chip 
                        label={path.level} 
                        size="small" 
                        sx={{ mb: 3, backgroundColor: brandColors.surfaces.elevated }}
                      />
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: brandColors.text.primary }}>
                        What You'll Learn:
            </Typography>
                      <List dense disablePadding>
                        {path.courses.map((course, idx) => (
                          <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              • {course}
            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button 
                        size="large" 
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          backgroundColor: brandColors.primary,
                          py: 1.5,
                          '&:hover': { backgroundColor: brandColors.interactive.hover }
                        }}
                      >
                        Start Learning
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Learning Resources Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Learning Resources
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <CoursesIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Courses
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comprehensive courses covering real estate investing, financing strategies, and property management best practices.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <CaseStudiesIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Case Studies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Learn from real-world examples and success stories from experienced real estate professionals.
            </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <LiveSessionsIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Live Sessions
            </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join interactive webinars, workshops, and live Q&A sessions with industry leaders.
            </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Case Studies Highlight Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
              Success Stories
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 3 }}>
                    <Chip label="First-Time Buyer" size="small" color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      From Renting to Owning: A Success Story
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      How Sarah navigated the home buying process and built $100K in equity in 3 years.
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3 }}>
                    <Button size="small" endIcon={<ArrowForwardIcon />}>
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 3 }}>
                    <Chip label="Investor" size="small" color="primary" sx={{ mb: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Building a 10-Property Portfolio
            </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Learn how Mike scaled from one rental to ten properties in 5 years using strategic financing.
            </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3 }}>
                    <Button size="small" endIcon={<ArrowForwardIcon />}>
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Lumina AI Section */}
          <Box sx={{ mb: 8 }}>
            <Card 
              elevation={4}
          sx={{ 
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.interactive.hover} 100%)`,
                color: 'white'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 6 }}>
                <AIIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                  Meet Lumina
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  Your 24/7 AI-Powered Real Estate Learning Assistant
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, maxWidth: '700px', mx: 'auto', opacity: 0.9 }}>
                  Get instant answers to your real estate questions, personalized learning recommendations, and practice scenarios – all powered by advanced AI technology.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/lumina')}
                  sx={{ 
                    backgroundColor: 'white',
                    color: brandColors.primary,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Learning with Lumina
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Q&A Community Section */}
          <Box sx={{ mb: 8 }}>
            <Card elevation={2}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <QAIcon sx={{ fontSize: 40, color: brandColors.primary, mr: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Q&A Community
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Ask questions and get expert answers from industry professionals and the Dreamery community.
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Popular Questions This Week:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="What's the best strategy for house hacking in 2024?"
                      secondary="12 expert answers • Real Estate Investing"
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="How do I calculate ROI on a fix-and-flip property?"
                      secondary="8 expert answers • Property Analysis"
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                  <ListItem>
                  <ListItemText 
                      primary="What closing costs should I expect as a first-time buyer?"
                      secondary="15 expert answers • Home Buying"
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
              </ListItem>
          </List>
                <Button 
                  variant="contained" 
                  size="large"
              sx={{ 
                    mt: 2,
                backgroundColor: brandColors.primary,
                    '&:hover': { backgroundColor: brandColors.interactive.hover }
                  }}
                >
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
              </Box>

          </Container>
      </Box>
  );
};

export default LearnPage;