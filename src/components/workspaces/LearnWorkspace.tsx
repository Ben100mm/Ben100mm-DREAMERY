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
  School as CoursesIcon,
  Assignment as CaseStudiesIcon,
  QuestionAnswer as QAIcon,
  VideoCall as LiveSessionsIcon,
  AutoAwesome as LuminaIcon,
} from '@mui/icons-material';

interface LearnWorkspaceProps {
  activeTab: string;
}

const LearnWorkspace: React.FC<LearnWorkspaceProps> = ({ activeTab }) => {
  const getBanner = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Learning Dashboard',
          subtitle: 'Track your progress and access personalized learning recommendations',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'courses':
        return {
          title: 'Courses',
          subtitle: 'Comprehensive real estate courses covering all aspects of property investment',
          icon: <CoursesIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'casestudies':
        return {
          title: 'Case Studies',
          subtitle: 'Real-world examples and detailed analysis of successful real estate deals',
          icon: <CaseStudiesIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'qa':
        return {
          title: 'Q&A',
          subtitle: 'Ask questions and get answers from real estate experts and community members',
          icon: <QAIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'livesessions':
        return {
          title: 'Live Sessions',
          subtitle: 'Join live webinars, workshops, and interactive learning sessions',
          icon: <LiveSessionsIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      case 'aitutor':
        return {
          title: 'Lumina AI Tutor',
          subtitle: 'Personalized AI-powered learning assistant for real estate education',
          icon: <LuminaIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
      default:
        return {
          title: 'Learning Platform',
          subtitle: 'Master real estate investing through comprehensive education',
          icon: <DashboardIcon sx={{ fontSize: 28, color: brandColors.text.inverse }} />,
        };
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
            <Typography variant="body1" color="text.secondary" paragraph>
              Welcome to your personalized learning hub. Track your progress, access recommended courses, 
              and continue your real estate education journey.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Courses Completed</Typography>
                <Typography variant="h3" color="primary">12</Typography>
              </Paper>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Learning Streak</Typography>
                <Typography variant="h3" color="primary">7 days</Typography>
              </Paper>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Certificates Earned</Typography>
                <Typography variant="h3" color="primary">5</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'courses':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Real Estate Courses
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Comprehensive courses covering everything from basic concepts to advanced investment strategies.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Real Estate Fundamentals</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Learn the basics of real estate investing, market analysis, and property evaluation.
                </Typography>
                <Typography variant="body2" color="primary">Beginner • 8 hours</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Advanced Investment Strategies</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Master complex investment strategies including REITs, syndications, and commercial properties.
                </Typography>
                <Typography variant="body2" color="primary">Advanced • 12 hours</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Property Management</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Learn how to effectively manage rental properties and maximize returns.
                </Typography>
                <Typography variant="body2" color="primary">Intermediate • 6 hours</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'casestudies':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Case Studies
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Real-world examples of successful real estate deals with detailed analysis and lessons learned.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>San Francisco Multi-Family Deal</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Analysis of a successful 12-unit apartment building acquisition and renovation project.
                </Typography>
                <Typography variant="body2" color="primary">ROI: 18.5% • 2 years</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Commercial Office Space Investment</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Case study of a downtown office building purchase and lease-up strategy.
                </Typography>
                <Typography variant="body2" color="primary">ROI: 22.3% • 3 years</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'qa':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Q&A Community
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ask questions and get answers from real estate experts and experienced community members.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>How do I evaluate a rental property's cash flow potential?</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Answered by: Sarah Johnson, 15 years experience
                </Typography>
                <Typography variant="body2">
                  Start by calculating the gross rental income, then subtract all operating expenses...
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>What's the best way to finance a commercial property?</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Answered by: Michael Chen, Commercial Real Estate Expert
                </Typography>
                <Typography variant="body2">
                  Commercial properties typically require 20-30% down payment and have different loan terms...
                </Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'livesessions':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Live Learning Sessions
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Join live webinars, workshops, and interactive learning sessions with industry experts.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Market Trends Webinar</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Live discussion about current real estate market trends and investment opportunities.
                </Typography>
                <Typography variant="body2" color="primary">Today • 2:00 PM PST</Typography>
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Property Analysis Workshop</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Hands-on workshop on how to analyze and evaluate investment properties.
                </Typography>
                <Typography variant="body2" color="primary">Tomorrow • 10:00 AM PST</Typography>
              </Paper>
            </Box>
          </Box>
        );
      case 'aitutor':
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Lumina AI Tutor
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your personalized AI-powered learning assistant for real estate education. Get instant answers, 
              personalized study plans, and interactive learning experiences.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 3, mb: 3, backgroundColor: brandColors.backgrounds.secondary }}>
                <Typography variant="h6" gutterBottom>Ask Lumina Anything</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Type your question below and get instant, personalized answers about real estate investing.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "What's the difference between cap rate and cash-on-cash return?"
                  </Typography>
                </Box>
              </Paper>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Personalized Study Plan</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get a custom learning path based on your goals
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Practice Quizzes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Test your knowledge with AI-generated questions
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Progress Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor your learning journey and achievements
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              Select a learning option from the sidebar
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose from courses, case studies, Q&A, live sessions, or the AI tutor to continue your learning journey.
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
      {renderContent()}
    </Container>
  );
};

export default LearnWorkspace;
