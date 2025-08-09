import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Container,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';

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

const OptionCard = styled(Box)<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? '#1a365d' : '#e0e0e0'};
  background-color: ${props => props.$selected ? '#f0f4f8' : 'white'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;

  &:hover {
    border-color: #1a365d;
    background-color: ${props => props.$selected ? '#f0f4f8' : '#f8f9fa'};
  }
`;

const PreApprovalQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    journey: '',
    timeline: '',
    location: ''
  });

  const questions = [
    {
      id: 'timeline',
      title: 'When are you looking to buy?',
      description: 'This helps us understand your urgency and timeline for the loan process.',
      options: [
        '0-3 months',
        '4-6 months',
        '7+ months',
        'Not sure'
      ]
    },
    {
      id: 'journey',
      title: 'Where are you in your home-buying journey?',
      description: "We'll work to find you the right mortgage to fit your unique needs.",
      options: [
        'I\'m thinking about buying',
        'Touring open houses',
        'Making offers on a property',
        'I\'ve signed a purchase contract'
      ]
    },
    {
      id: 'location',
      title: 'In which zip code or city are you looking to buy?',
      description: 'This helps us provide location-specific rates and programs.',
      type: 'text'
    }
  ];

  const handleBack = () => {
    navigate('/pre-approval-basic-info', { state: { answers: (location.state as any)?.answers } });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to the home preferences page with accumulated answers
      const allData = {
        ...(location.state as any)?.answers || (location.state as any)?.basicInfo || {},
        ...answers
      };
      navigate('/pre-approval-home-preferences', { state: { answers: allData } });
    }
  };

  const handleBackStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleLocationChange = (value: string) => {
    setAnswers(prev => ({ ...prev, location: value }));
  };

  const currentQuestion = questions[step];
  const isNextDisabled = !answers[currentQuestion.id as keyof typeof answers];

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
                value={25} 
                sx={{ mb: 2, height: 6, borderRadius: 1, backgroundColor: '#e0e0e0' }}
              />

              {/* Question */}
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 2 }}>
                {currentQuestion.title} *
              </Typography>

              {/* Description */}
              {currentQuestion.description && (
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  {currentQuestion.description}
                </Typography>
              )}

              {/* Options */}
              {currentQuestion.type === 'text' ? (
                <TextField
                  fullWidth
                  placeholder="Los Angeles, CA"
                  value={answers.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  sx={{ mb: 4 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ color: '#666' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <RadioGroup
                  value={answers[currentQuestion.id as keyof typeof answers]}
                  onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                  sx={{ mb: 4 }}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <OptionCard
                      key={index}
                      $selected={answers[currentQuestion.id as keyof typeof answers] === option}
                      onClick={() => handleOptionSelect(currentQuestion.id, option)}
                    >
                      <FormControlLabel
                        value={option}
                        control={<Radio sx={{ color: '#1a365d' }} />}
                        label={option}
                        sx={{ 
                          width: '100%',
                          margin: 0,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#333'
                          }
                        }}
                      />
                    </OptionCard>
                  ))}
                </RadioGroup>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {step > 0 && (
                  <Button 
                    variant="outlined" 
                    onClick={handleBackStep}
                    sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none' }}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id as keyof typeof answers]}
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

export default PreApprovalQuestionsPage; 