import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const ContentSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 0;
`;

const PreApprovalPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/mortgage');
  };

  const handleStart = () => {
    navigate('/pre-approval-basic-info');
  };

  return (
    <PageContainer>
      {/* Header */}
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
              Dreamery Home Loans
            </Typography>
          </Box>
          <Button
            onClick={handleBack}
            sx={{ color: '#666666', textTransform: 'none' }}
          >
            Back to Mortgage
          </Button>
        </Box>
      </HeaderSection>

      {/* Main Content */}
      <ContentSection>
        <Container maxWidth="md" sx={{ width: '100%', py: { xs: 0.5, md: 1 } }}>
          <Card sx={{ maxWidth: 600, width: '100%', mx: 'auto', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}>
            <CardContent sx={{ p: { xs: 1.5, md: 3 }, height: '100%', overflow: 'auto' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d', mb: 1, textAlign: 'center', fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
                Get pre-approved for a mortgage with Dreamery Home Loans
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2, textAlign: 'center' }}>
                Pre-qualification is the first step toward a pre-approval with us.
              </Typography>

              {/* Progress Bar */}
              <LinearProgress 
                variant="determinate" 
                value={6.25} 
                sx={{ mb: 2, height: 6, borderRadius: 1, backgroundColor: '#e0e0e0' }}
              />

              {/* Content */}
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 2 }}>
                  Ready to get started?
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                  Our pre-approval process takes just a few minutes and will help you understand your borrowing power and loan options.
                </Typography>
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBack}
                  sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none' }}
                >
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleStart}
                  sx={{ 
                    backgroundColor: '#1a365d', 
                    color: 'white', 
                    textTransform: 'none',
                    flex: 1
                  }}
                >
                  Continue
                </Button>
              </Box>

              {/* Additional Information */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Your information is safe and secure with us.
                </Typography>
                <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>
                  Learn more about our privacy policy
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalPage; 