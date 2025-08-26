import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Chip,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Chat as ChatIcon,
  Timeline as TimelineIcon,
  Description as DocumentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { brandColors } from '../theme';
import { PageAppBar } from '../components/Header';

const LuminaPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.backgrounds.primary }}>
      <PageAppBar title="Dreamery – Lumina" />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              backgroundColor: brandColors.primary,
              fontSize: '3rem',
            }}
          >
            <AIIcon sx={{ fontSize: '3rem' }} />
          </Avatar>
          <Typography variant="h2" component="h1" sx={{ mb: 2, color: brandColors.primary, fontWeight: 700 }}>
            Lumina
          </Typography>
          <Typography variant="h5" sx={{ color: brandColors.text.secondary, mb: 3 }}>
            Your AI Closing Assistant
          </Typography>
          <Typography variant="body1" sx={{ color: brandColors.text.secondary, maxWidth: 600, mx: 'auto' }}>
            Intelligent assistance for real estate closings with timeline predictions, document analysis, and personalized guidance.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4, 
          mb: 6 
        }}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <TimelineIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Timeline Predictions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered predictions for potential delays and issues in your closing process.
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <DocumentIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Document Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intelligent document summaries and analysis to help you understand complex closing documents.
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <NotificationsIcon sx={{ fontSize: 60, color: brandColors.primary, mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Personalized Reminders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Smart notifications and reminders tailored to your specific closing timeline and requirements.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Chat Interface Preview */}
        <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: brandColors.backgrounds.secondary }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ChatIcon sx={{ mr: 2, color: brandColors.primary }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Chat with Lumina
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Ask Lumina about your closing process..."
              variant="outlined"
              size="medium"
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: brandColors.primary }}
              startIcon={<ChatIcon />}
            >
              Send
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ backgroundColor: brandColors.primary, width: 40, height: 40 }}>
              <AIIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ backgroundColor: 'white', p: 2, borderRadius: 2, mb: 1 }}>
                Hello! I'm Lumina, your Closing Assistant. I can help you with timeline predictions, document summaries, and personalized reminders. What would you like to know about your closing process?
              </Typography>
              <Chip label="AI Assistant" size="small" sx={{ backgroundColor: brandColors.primary, color: 'white' }} />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LuminaPage;
