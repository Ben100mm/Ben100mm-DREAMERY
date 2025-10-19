import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import styled from 'styled-components';
import { brandColors } from "../theme";
import { Tooltip } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const NavContainer = styled.nav`
  width: 100%;
  background: brandColors.surfaces.glass;
  padding: 0.75rem 0;
  position: absolute;
  bottom: 5%;
  left: 0;
  z-index: 9999;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px brandColors.shadows.light;
  &:hover {
    background: brandColors.surfaces.glassHover;
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 2rem;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
`;

const NavItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-weight: 800;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.95rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
    letter-spacing: 0.3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover {
      background: brandColors.interactive.hover;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
      font-weight: 900;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: translateY(0);
      transition: transform 0.1s ease;
    }
  }
`;

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { isPageEnabled, currentPhase } = useFeatureFlags();

  const allNavItems = [
    { name: 'Lumina', path: '/lumina', phase: 3 },
    { name: 'Marketplace', path: '/marketplace', phase: 2 },
    { name: 'Mortgage', path: '/mortgage', phase: 2 },
    { name: 'Underwrite', path: '/underwrite', phase: 1 },
    { name: 'Workspaces', path: '/workspaces', phase: 3 },
    { name: 'Partners', path: '/partner', phase: 3 },
    { name: 'Learn', path: '/learn', phase: 3 },
    { name: 'Advertise', path: '/advertise', phase: 3 }
  ];

  // Filter and mark items based on current phase
  const navItems = allNavItems.map(item => ({
    ...item,
    isEnabled: isPageEnabled(item.path),
    isLocked: item.phase > currentPhase
  }));

  const handleNavClick = (path: string, isEnabled: boolean) => {
    if (isEnabled) {
      console.log('Navigating to:', path);
      navigate(path);
    } else {
      console.log('Page not available in current phase:', path);
    }
  };

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <Tooltip 
              title={item.isLocked ? `Available in Phase ${item.phase}` : ''}
              placement="top"
            >
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleNavClick(item.path, item.isEnabled); 
                }}
                style={{
                  opacity: item.isEnabled ? 1 : 0.5,
                  cursor: item.isEnabled ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {item.name}
                {item.isLocked && <LockIcon sx={{ fontSize: 12 }} />}
              </a>
            </Tooltip>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;