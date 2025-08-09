import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
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

const QuestionCard = styled(Card)`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${props => props.$selected ? '#1a365d' : '#e0e0e0'};
  background-color: ${props => props.$selected ? '#1a365d' : 'white'};
  color: ${props => props.$selected ? 'white' : '#333'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;

  &:hover {
    background-color: ${props => props.$selected ? '#1a365d' : '#f5f5f5'};
    border-color: ${props => props.$selected ? '#1a365d' : '#1a365d'};
  }
`;

const PreApprovalAdditionalQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    hasRealEstateAgent: '',
    hasCoBorrower: '',
    isUSCitizen: '',
    hasForeclosure: '',
    hasBankruptcy: '',
    interestedInVALoan: '',
    isFirstTimeBuyer: ''
  });

  const questions = [
    {
      id: 'isUSCitizen',
      title: 'Are you a US citizen?',
      options: ['Yes', 'No']
    },
    {
      id: 'hasCoBorrower',
      title: 'Are you buying this home on your own or with someone?',
      options: ['I\'m the borrower', 'I have a co-borrower']
    },
    {
      id: 'isFirstTimeBuyer',
      title: 'Are you a first time home buyer?',
      options: ['Yes', 'No']
    },
    {
      id: 'interestedInVALoan',
      title: 'Are you interested in a VA loan for veterans?',
      options: ['Yes', 'No']
    },
    {
      id: 'hasRealEstateAgent',
      title: 'Do you have a real estate agent?',
      options: ['Yes', 'No']
    },
    {
      id: 'hasForeclosure',
      title: 'Have you had a foreclosure within the past 7 years?',
      options: ['Yes', 'No']
    },
    {
      id: 'hasBankruptcy',
      title: 'Have you had a bankruptcy or short sale in the past 4 years?',
      options: ['Yes', 'No']
    }
  ];

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate('/pre-approval-property-financial', { state: { answers: location.state?.answers } });
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to summary page with all answers
      const allAnswers = {
        ...location.state?.answers,
        ...answers
      };
      navigate('/pre-approval-summary', { state: { answers: allAnswers } });
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const currentQuestion = questions[step];
  const isNextDisabled = !answers[currentQuestion.id];

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
            Back
          </Button>
        </Box>
      </HeaderSection>

      {/* Main Content */}
      <ContentSection>
        <Container maxWidth="md" sx={{ width: '100%', py: { xs: 0.5, md: 1 } }}>
          <QuestionCard>
            <CardContent sx={{ p: { xs: 1.5, md: 3 }, flex: 1, overflow: 'auto' }}>
              {/* Progress Bar */}
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ mb: 2, height: 6, borderRadius: 1, backgroundColor: '#e0e0e0' }}
              />

              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d', mb: 2, textAlign: 'center', fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
                Additional Information
              </Typography>
              
              <Typography variant="body2" sx={{ color: '#666', mb: 4, textAlign: 'center' }}>
                Help us understand your situation better to provide the most accurate pre-approval.
              </Typography>

              {/* Current Question */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a365d', mb: 3, textAlign: 'center' }}>
                  {currentQuestion.title} *
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  {currentQuestion.options.map((option) => (
                    <OptionButton
                      key={option}
                      $selected={answers[currentQuestion.id] === option}
                      onClick={() => handleOptionSelect(currentQuestion.id, option)}
                    >
                      {option}
                    </OptionButton>
                  ))}
                </Box>
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBack}
                  sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none' }}
                >
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  sx={{ 
                    backgroundColor: '#1a365d', 
                    color: 'white', 
                    textTransform: 'none',
                    flex: 1,
                    '&:disabled': {
                      backgroundColor: '#e0e0e0',
                      color: '#999'
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </QuestionCard>
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default PreApprovalAdditionalQuestionsPage; 