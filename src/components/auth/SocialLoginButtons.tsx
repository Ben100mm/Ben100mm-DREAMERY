import React from 'react';
import { Button, Box } from '@mui/material';
import styled from 'styled-components';
import { ReactComponent as GoogleLogo } from '../../assets/social-logos/google.svg';
import { ReactComponent as AppleLogo } from '../../assets/social-logos/apple.svg';
import { ReactComponent as FacebookLogo } from '../../assets/social-logos/facebook.svg';
import { ReactComponent as MicrosoftLogo } from '../../assets/social-logos/microsoft.svg';
import { ReactComponent as TwitterLogo } from '../../assets/social-logos/twitter.svg';
import { brandColors } from "../../theme";


const SocialButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  text-transform: none;
  font-weight: 500;
  border-radius: 8px;
  color: brandColors.primary;
  border-color: rgba(0, 0, 0, 0.12);
  
  .logo {
    margin-right: 1rem;
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

interface SocialLoginButtonsProps {
  mode: 'signin' | 'signup';
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ mode }) => {
  const actionText = mode === 'signin' ? 'Continue with' : 'Sign up with';
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box>
        <SocialButton variant="outlined" fullWidth>
          <GoogleLogo className="logo" />
          {actionText} Google
        </SocialButton>
      </Box>
      <Box>
        <SocialButton variant="outlined" fullWidth>
          <AppleLogo className="logo" />
          {actionText} Apple
        </SocialButton>
      </Box>
      <Box>
        <SocialButton variant="outlined" fullWidth>
          <MicrosoftLogo className="logo" />
          {actionText} Microsoft
        </SocialButton>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <SocialButton variant="outlined" fullWidth>
            <FacebookLogo className="logo" />
            Facebook
          </SocialButton>
        </Box>
        <Box sx={{ flex: 1 }}>
          <SocialButton variant="outlined" fullWidth>
            <TwitterLogo className="logo" />
            Twitter
          </SocialButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SocialLoginButtons;