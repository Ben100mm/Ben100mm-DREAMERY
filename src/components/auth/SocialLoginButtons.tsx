import React from 'react';
import { Button, Grid } from '@mui/material';
import styled from 'styled-components';
import { ReactComponent as GoogleLogo } from '../../assets/social-logos/google.svg';
import { ReactComponent as AppleLogo } from '../../assets/social-logos/apple.svg';
import { ReactComponent as FacebookLogo } from '../../assets/social-logos/facebook.svg';
import { ReactComponent as MicrosoftLogo } from '../../assets/social-logos/microsoft.svg';
import { ReactComponent as TwitterLogo } from '../../assets/social-logos/twitter.svg';

const SocialButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  text-transform: none;
  font-weight: 500;
  border-radius: 8px;
  color: #1a365d;
  border-color: rgba(0, 0, 0, 0.12);
  
  .logo {
    margin-right: 1rem;
    width: 16px;
    height: 16px;
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
    <Grid container spacing={1}>
      <Grid item xs={12} component="div">
        <SocialButton variant="outlined" fullWidth>
          <GoogleLogo className="logo" />
          {actionText} Google
        </SocialButton>
      </Grid>
      <Grid item xs={12} component="div">
        <SocialButton variant="outlined" fullWidth>
          <AppleLogo className="logo" />
          {actionText} Apple
        </SocialButton>
      </Grid>
      <Grid item xs={12} component="div">
        <SocialButton variant="outlined" fullWidth>
          <MicrosoftLogo className="logo" />
          {actionText} Microsoft
        </SocialButton>
      </Grid>
      <Grid item xs={6} component="div">
        <SocialButton variant="outlined" fullWidth>
          <FacebookLogo className="logo" />
          Facebook
        </SocialButton>
      </Grid>
      <Grid item xs={6} component="div">
        <SocialButton variant="outlined" fullWidth>
          <TwitterLogo className="logo" />
          Twitter
        </SocialButton>
      </Grid>
    </Grid>
  );
};

export default SocialLoginButtons;