import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { brandColors } from "../theme";

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

  const navItems = [
    { name: 'Lumina', path: '/lumina' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Mortgage', path: '/mortgage' },
    { name: 'Underwrite', path: '/underwrite' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Workspaces', path: '/workspaces' },
    { name: 'Data Sources', path: '/data-sources' },
    { name: 'Partners', path: '/partner' },
    { name: 'Learn', path: '/learn' },
    { name: 'Advertise', path: '/advertise' }
  ];

  const handleNavClick = (path: string) => {
    console.log('Navigation clicked:', path); // Debug log
    // Navigate to any declared route; non-declared paths will log for now
    switch (path) {
      case '/lumina':
      case '/marketplace':
      case '/mortgage':
      case '/underwrite':
      case '/analyze':
      case '/workspaces':
      case '/data-sources':
      case '/learn':
      case '/advertise':
      case '/partner':
        console.log('Navigating to:', path); // Debug log
        navigate(path);
        break;
      default:
        console.log('Route not implemented:', path); // Debug log
        // Route not implemented yet
        break;
    }
  };

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}>
              {item.name}
            </a>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;