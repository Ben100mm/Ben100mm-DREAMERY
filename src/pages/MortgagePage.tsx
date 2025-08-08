import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
  Avatar,
  Divider,
  Link
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Calculate as CalculateIcon,
  Description as DescriptionIcon,
  Flag as FlagIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Percent as PercentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  height: 100vh;
  background: white;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* Ensure scrollbar appears on the far right */
  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const HeaderSection = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeroSection = styled.div`
  background: white;
  color: #1a365d;
  padding: 3rem 1.5rem;
  text-align: center;
`;

const BuyAbilityCard = styled(Card)`
  background: white;
  border-radius: 12px;
  border: 1px solid #e6eaf2;
  box-shadow: 0 4px 16px rgba(26, 54, 93, 0.08);
  margin: 0;
  max-width: 400px;
  position: relative;
  z-index: 10;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ProcessSection = styled.div`
  background: white;
  color: #1a365d;
  padding: 3rem 1.5rem;
`;

const ProcessCard = styled(Card)`
  background: white;
  color: #333;
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 4px solid #1a365d;
`;

const MortgageOptionCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const TestimonialCard = styled(Card)`
  background: ${props => props.color || '#1a365d'};
  color: white;
  border-radius: 12px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
`;

const LearningCard = styled(Card)`
  width: 320px;
  height: 280px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex-shrink: 0;
`;

// New layout building blocks
const SplitSection = styled.section`
  background: white;
  padding: 2rem 1.5rem 2.5rem;
`;

const SplitWrap = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  max-width: 1100px;
  margin: 0 auto;
  
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const LeftCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const RightCol = styled.div`
  width: 380px;
  max-width: 100%;
  position: sticky;
  top: 88px; /* below sticky header */
`;

const TimelineWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const TimelineDot = styled.div`
  width: 36px;
  height: 36px;
  background: #1a365d;
  color: white;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex: 0 0 auto;
`;

const TimelineCard = styled(Card)`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
`;

const MortgagePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  // Carousel sizing constants
  const CARDS_PER_SLIDE = 3;
  const CARD_WIDTH_PX = 320; // must match LearningCard width
  const GAP_PX = 16; // must match the gap used between cards
  const SLIDE_WIDTH_PX = CARD_WIDTH_PX * CARDS_PER_SLIDE + GAP_PX * (CARDS_PER_SLIDE - 1);

  const handleBack = () => {
    navigate('/');
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(learningArticles.length / 3));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = Math.ceil(learningArticles.length / 3);
      return prev === 0 ? maxSlides - 1 : prev - 1;
    });
  };

  const mortgageOptions = [
    {
      title: "30-Year Fixed",
      tag: "Most popular",
      rate: "6.375%",
      apr: "6.553%",
      points: "1.844 ($5,071.00)",
      features: ["3% min down payment", "Lower payments due to longer term"],
      color: "#4caf50"
    },
    {
      title: "30-Year FHA",
      tag: "Lower credit profiles",
      rate: "6.000%",
      apr: "6.678%",
      points: "1.607 ($4,419.25)",
      features: ["3.5% min down payment", "Looser credit/debt requirements"],
      color: "#4caf50"
    },
    {
      title: "30-Year VA",
      tag: "Eligible military",
      rate: "6.125%",
      apr: "6.419%",
      points: "1.816 ($4,994.00)",
      features: ["0% down payment", "No private mortgage insurance"],
      color: "#4caf50"
    },
    {
      title: "20-Year Fixed",
      tag: "Save on interest",
      rate: "6.125%",
      apr: "6.339%",
      points: "1.696 ($4,664.00)",
      features: ["5% min down payment"],
      color: "#4caf50"
    },
    {
      title: "15-Year Fixed",
      tag: "Faster payoff",
      rate: "5.500%",
      apr: "5.780%",
      points: "1.792 ($4,928.00)",
      features: ["5% min down payment", "Pay less interest due to shorter term"],
      color: "#4caf50"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Calculate your DreamAbility™",
      description: "Get a real-time estimate of what you can afford with Zillow Home Loans.",
      icon: <CalculateIcon />
    },
    {
      step: "2",
      title: "Get pre-approved",
      description: "Make strong offers on homes with a Verified Pre-approval letter from us.",
      icon: <DescriptionIcon />
    },
    {
      step: "3",
      title: "Make an offer",
      description: "Confirm that a home fits your budget with us and determine a fair offer price.",
      icon: <FlagIcon />
    },
    {
      step: "4",
      title: "Apply for a mortgage",
      description: "After your offer is accepted, you'll complete your full loan application.",
      icon: <MoneyIcon />
    },
    {
      step: "5",
      title: "Close on your home",
      description: "Congrats, homeowner! Sign the closing paperwork and we'll finalize the sale.",
      icon: <HomeIcon />
    }
  ];

  const testimonials = [
    {
      quote: "As a first time home buyer, my loan officer made me feel at ease and welcomed all questions I had with so much patience.",
      author: "Michelle",
      location: "Arizona",
      color: "#9c27b0"
    },
    {
      quote: "My loan officer was incredibly professional, knowledgeable, and genuinely committed to helping me find the best financial solution.",
      author: "Ruslan",
      location: "New Jersey",
      color: "#4caf50"
    }
  ];

  const learningArticles = [
    {
      title: "Pre-qualified vs. pre-approved: What's the difference?",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "How your credit score is calculated",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "How are mortgage rates determined?",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Understanding closing costs",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "First-time homebuyer guide",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Down payment assistance programs",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Mortgage insurance explained",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Refinancing your mortgage",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Home inspection checklist",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      link: "#"
    },
    {
      title: "Property tax considerations",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      link: "#"
    }
  ];

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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleBack}
              sx={{ color: '#666666', textTransform: 'none' }}
            >
              Back to Home
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1a365d',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#0d2340',
                }
              }}
            >
              Get pre-approved
            </Button>
          </Box>
        </Box>
      </HeaderSection>

      {/* Split Hero with Sticky DreamAbility */}
      <SplitSection>
        <SplitWrap>
          <LeftCol>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#1a365d' }}>
              Get a mortgage from Dreamery Home Loans
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
              Competitive rates, clear fees, and guidance at every step. Get your DreamAbility™ to see what you can afford in real time.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}
              >
                Start DreamAbility
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600 }}
              >
                Talk to a loan officer
              </Button>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Already working with us? <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>Access your dashboard</Link>
            </Typography>
          </LeftCol>
          <RightCol>
            <BuyAbilityCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#1a365d', fontWeight: 700 }}>
                  Your DreamAbility™ today
                </Typography>
                
                {/* Primary metrics row */}
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1.25, backgroundColor: '#f9fbff', borderRadius: 1, border: '1px solid #edf1f7' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.25 }}>
                          $--
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b778c', fontWeight: 500, letterSpacing: 0.2 }}>
                          Target price
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1.25, backgroundColor: '#f9fbff', borderRadius: 1, border: '1px solid #edf1f7' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.25 }}>
                          $--
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b778c', fontWeight: 500, letterSpacing: 0.2 }}>
                          DreamAbility™
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Secondary metrics row */}
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={1.5}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f9fbff', borderRadius: 1, border: '1px solid #edf1f7' }}>
                        <MoneyIcon sx={{ color: '#1a365d', mb: 0.25, fontSize: 18 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a365d', mb: 0 }}>
                          $--
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b778c', fontWeight: 500 }}>
                          Mo. payment
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f9fbff', borderRadius: 1, border: '1px solid #edf1f7' }}>
                        <PercentIcon sx={{ color: '#1a365d', mb: 0.25, fontSize: 18 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a365d', mb: 0 }}>
                          --%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b778c', fontWeight: 500 }}>
                          Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f9fbff', borderRadius: 1, border: '1px solid #edf1f7' }}>
                        <PercentIcon sx={{ color: '#1a365d', mb: 0.25, fontSize: 18 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a365d', mb: 0 }}>
                          --%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b778c', fontWeight: 500 }}>
                          APR
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#1a365d', 
                    color: 'white', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    py: 1.25,
                    fontSize: '0.95rem',
                    borderRadius: 1.5,
                    '&:hover': {
                      backgroundColor: '#0d2340',
                    }
                  }}
                >
                  Get your DreamAbility
                </Button>
              </CardContent>
            </BuyAbilityCard>
          </RightCol>
        </SplitWrap>
      </SplitSection>

      {/* Rates first, then Why Choose Us */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}>
          Find the right mortgage with Dreamery Home Loans
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 4 }}>
          Explore programs and compare rates. Get pre-approved with confidence.
        </Typography>
        <Grid container spacing={4}>
          {mortgageOptions.map((option, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <MortgageOptionCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {option.title}
                    </Typography>
                    <Chip label={option.tag} size="small" sx={{ backgroundColor: option.color, color: 'white', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'baseline' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>{option.rate}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>Rate</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'baseline' }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a365d' }}>{option.apr}</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>APR</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>Points (cost) {option.points}</Typography>
                  <Box sx={{ mb: 2 }}>
                    {option.features.map((feature, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: '#666' }}>• {feature}</Typography>
                    ))}
                  </Box>
                  <Button fullWidth variant="outlined" sx={{ borderColor: '#1a365d', color: '#1a365d', textTransform: 'none', fontWeight: 600, mb: 1 }}>
                    Get pre-approved
                  </Button>
                  <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none', fontSize: '0.875rem' }}>See sample loan terms</Link>
                </CardContent>
              </MortgageOptionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section removed per request */}

      {/* Vertical Timeline */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1a365d', textAlign: 'center' }}>
          Your path to homeownership
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {processSteps.map((s, i) => (
            <TimelineCard key={i}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', py: 2 }}>
                <TimelineDot>{s.step}</TimelineDot>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a365d', mb: 0.5 }}>{s.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>{s.description}</Typography>
                </Box>
              </CardContent>
            </TimelineCard>
          ))}
        </Box>
      </Container>

      {/* Process Steps Section removed - duplicate of horizontal timeline */}

      {/* Personalized CTA */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Get a personalized rate in minutes
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Mortgage rates aren't one size fits all. We'll estimate based on your unique details.
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#1a365d', color: 'white', textTransform: 'none', fontWeight: 600 }}>
              Get your personalized rate
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', height: 260, borderRadius: 2, backgroundColor: '#f5f5f5' }} />
          </Grid>
        </Grid>
      </Container>

      {/* Personalized Rate Section removed per request */}

      {/* Testimonials Section removed per request */}

      {/* Learning Center Carousel */}
      <Box sx={{ backgroundColor: 'white', color: '#1a365d', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 4 }}>
            Learn more about home financing
          </Typography>
          
          <Box sx={{ position: 'relative', mb: 4 }}>
            {/* Viewport strictly clamps the visible area to exactly 3 cards */}
            <Box sx={{
              width: `${SLIDE_WIDTH_PX}px`,
              mx: 'auto',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                width: 'max-content',
                scrollBehavior: 'smooth',
                transform: `translateX(-${currentSlide * SLIDE_WIDTH_PX}px)`,
                transition: 'transform 0.3s ease-in-out'
              }}>
              {learningArticles.map((article, index) => (
                <LearningCard key={index}>
                  <Box sx={{ 
                    height: 160, 
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      [Article Image]
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
                      {article.title}
                    </Typography>
                    <Link href={article.link} sx={{ color: '#1a365d', textDecoration: 'none', fontSize: '0.875rem' }}>
                      Read article
                    </Link>
                  </CardContent>
                </LearningCard>
              ))}
              </Box>
            </Box>
            
            {/* Carousel Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
              <Button
                onClick={handlePrevSlide}
                sx={{ 
                  minWidth: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  backgroundColor: '#1a365d',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
                }}
              >
                ‹
              </Button>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {Array.from({ length: Math.ceil(learningArticles.length / 3) }, (_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: i === currentSlide ? '#1a365d' : '#e0e0e0',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </Box>
              <Button
                onClick={handleNextSlide}
                sx={{ 
                  minWidth: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  backgroundColor: '#1a365d',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0d2340',
                  }
                }}
              >
                ›
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Looking for additional resources? 
              <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none', ml: 1 }}>
                Visit our Learning Center
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 3, minHeight: '160px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>
                  Terms of use
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none' }}>
                  Privacy policy
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Dreamery Home Loans
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                1500 Dreamery Boulevard, Suite 500
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Austin, TX 78701
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                855-372-6337
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HomeIcon sx={{ mr: 1, color: '#1a365d' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  EQUAL HOUSING LENDER
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                © Dreamery Home Loans, LLC
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                An Equal Housing Lender
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                NMLS ID#: 10287
              </Typography>
              <Link href="#" sx={{ color: '#1a365d', textDecoration: 'none', fontSize: '0.875rem' }}>
                www.nmlsconsumeraccess.org
              </Link>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
            Dreamery Group is committed to ensuring digital accessibility for individuals with disabilities. 
            We are continuously working to improve the accessibility of our website and digital services.
          </Typography>
        </Container>
      </Box>
      {/* Removed filler; content is now compact without empty space */}
    </PageContainer>
  );
};

export default MortgagePage; 