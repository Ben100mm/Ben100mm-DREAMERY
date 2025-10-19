import React from 'react';
import styled from 'styled-components';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { brandColors } from "../theme";


const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px brandColors.shadows.light;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px brandColors.shadows.light;
`;

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showAuthContent?: boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  subtitle,
  children,
  showAuthContent = false
}) => {
  const { isAuthenticated, isEmailVerified } = useAuth();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: '/' + pathSegments.slice(0, index + 1).join('/')
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/" color="inherit">
              Home
            </MuiLink>
            {breadcrumbs.map((crumb, index) => (
              <MuiLink
                key={index}
                component={Link}
                to={crumb.path}
                color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {crumb.name}
              </MuiLink>
            ))}
          </Breadcrumbs>
        </Box>

        {/* Page Header */}
        <PageHeader>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: brandColors.primary, fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              {subtitle}
            </Typography>
          )}
        </PageHeader>

        {/* Authentication Notice */}
        {showAuthContent && !isAuthenticated && (
          <ContentCard>
            <Typography variant="h6" color="warning.main" gutterBottom>
              🔒 Authentication Required
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              This page requires you to be signed in. Please sign in to access all features.
            </Typography>
            <MuiLink component={Link} to="/auth" variant="button" sx={{ textDecoration: 'none' }}>
              Sign In
            </MuiLink>
          </ContentCard>
        )}

        {/* Main Content */}
        {(!showAuthContent || isAuthenticated) && children}
      </Container>
    </PageContainer>
  );
};

export default PageTemplate; 