import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  useTheme,
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { brandColors } from "../theme";
import { PageAppBar } from "../components/Header";
import { RoleContext } from '../context/RoleContext';

// Types
interface CloseOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const ClosePage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const navigate = useNavigate();
  const theme = useTheme();
  const { setUserRole, userRole, allowRoleSelector } = (React.useContext(RoleContext) as any) || {};

  const closeOptions: CloseOption[] = [
    {
      value: 'buyer',
    label: 'Buyer',
      description: 'Complete your real estate purchase with our closing tools',
      icon: <PersonIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />,
      route: '/close/buyer'
    },
    {
      value: 'agent',
      label: 'Agent',
      description: 'Manage your client closings and transactions',
      icon: <PersonIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />,
      route: '/close/agent'
    },
    {
      value: 'brokerages',
      label: 'Brokerages',
      description: 'Enterprise solutions for brokerage operations',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />,
      route: '/close/brokerages'
    },
    {
      value: 'professional-support',
      label: 'Professional Support',
      description: 'Legal, title, and escrow professional tools',
      icon: <SupportIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />,
      route: '/close/professional-support'
    },
    {
      value: 'businesses',
      label: 'Businesses',
      description: 'Corporate real estate and investment solutions',
      icon: <BusinessIcon sx={{ fontSize: 40, color: brandColors.actions.primary }} />,
      route: '/close/businesses'
    }
  ];

  const handleOptionSelect = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleContinue = () => {
    if (selectedOption) {
      const option = closeOptions.find(opt => opt.value === selectedOption);
      if (option) {
        // Map selection to a role that passes the RBAC guard
        const optionToRole: Record<string, string> = {
          buyer: 'Retail Buyer',
          agent: 'Real Estate Agent',
          brokerages: 'Real Estate Broker',
          'professional-support': 'Title Agent',
          businesses: 'Real Estate Agent'
        };
        const intendedRole = optionToRole[selectedOption];
        console.log('Setting role to:', intendedRole, 'for option:', selectedOption);
        if (setUserRole && intendedRole) {
          setUserRole(intendedRole);
          console.log('Role set in context, waiting a moment before navigating to:', option.route);
          // Wait a moment for the role to be set in context before navigating
          setTimeout(() => {
            navigate(option.route, { state: { intendedRole } });
          }, 100);
        } else {
          navigate(option.route, { state: { intendedRole } });
        }
      }
    }
  };

  // If selector is disabled, auto-redirect based on current role
  React.useEffect(() => {
    if (!allowRoleSelector && userRole) {
      const roleToRoute: Record<string, string> = {
        'Retail Buyer': '/close/buyer',
        'Investor Buyer': '/close/buyer',
        'iBuyer': '/close/buyer',
        'Property Flipper': '/close/buyer',
        'Real Estate Agent': '/close/agent',
        'Buyer’s Agent': '/close/agent',
        'Listing Agent': '/close/agent',
        'Commercial Agent': '/close/agent',
        'Luxury Agent': '/close/agent',
        'New Construction Agent': '/close/agent',
        'Wholesaler': '/close/agent',
        'Disposition Agent': '/close/agent',
        'Real Estate Broker': '/close/brokerages',
        'Title Agent': '/close/professional-support'
      };
      const next = roleToRoute[userRole];
      if (next) navigate(next);
    }
  }, [allowRoleSelector, userRole, navigate]);

  const selectedOptionData = closeOptions.find(opt => opt.value === selectedOption);

    return (
      <>
        <PageAppBar title="Dreamery Closing Hub" showBackButton={true} />
        <Container maxWidth="md" sx={{ py: 8, marginTop: "64px" }}>


      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
        sx={{ 
            color: brandColors.primary,
            fontWeight: 'bold',
            mb: 2
          }}
        >
            Dreamery Closing Hub
            </Typography>
        <Typography 
          variant="h5" 
                sx={{
            color: brandColors.text.secondary,
            mb: 4
          }}
        >
          Choose your role to access the right closing tools
                        </Typography>
          </Box>

      <Paper 
        elevation={3} 
        sx={{
          p: 4, 
          borderRadius: 3,
          background: brandColors.backgrounds.gradient,
                color: brandColors.text.inverse
        }}
      >
        <Typography 
          variant="h6" 
                        sx={{ 
            mb: 3, 
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Select Your Role
                      </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <Select
            value={selectedOption}
            onChange={handleOptionSelect}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
                      sx={{ 
                backgroundColor: 'white',
              color: brandColors.text.primary,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Choose your role...</em>
            </MenuItem>
            {closeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {option.icon}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {option.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
                      {option.description}
                    </Typography>
                  </Box>
                  </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedOptionData && (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              {selectedOptionData.icon}
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                {selectedOptionData.label}
                      </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {selectedOptionData.description}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
              size="large"
              onClick={handleContinue}
                      sx={{ 
                  backgroundColor: 'white',
                          color: brandColors.primary,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                            '&:hover': {
                  backgroundColor: brandColors.backgrounds.hover,
                },
              }}
            >
              Continue to {selectedOptionData.label} Tools
                        </Button>
                      </Box>
        )}
                  </Paper>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: brandColors.text.secondary }}>
          Need help? Contact our support team for assistance
                        </Typography>
                      </Box>
        </Container>
      </>
    );
  };

export default ClosePage;
