import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  padding: 0.75rem 0;
  position: absolute;
  bottom: 5%;
  left: 0;
  z-index: 9999;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
`;

const NavItem = styled.li`
  a {
    color: #0d2340;
    text-decoration: none;
    font-weight: 800;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 1rem;
    text-shadow: 0 2px 4px rgba(255, 255, 255, 0.9);
    letter-spacing: 0.5px;
    &:hover {
      background: rgba(255, 255, 255, 0.6);
      color: #000000;
      text-shadow: 0 2px 4px rgba(255, 255, 255, 1);
      font-weight: 900;
    }
  }
`;

const Navigation: React.FC = () => {
  const navItems = [
    'Buy', 'Rent', 'Sell', 'Mortgage', 'Underwrite', 'Analyze',
    'Close', 'Manage', 'Invest', 'Fund', 'Operate', 'Partner',
    'Learn', 'Advertise'
  ];

  return (
    <NavContainer>
      <NavList>
        {navItems.map((item, index) => (
          <NavItem key={index}>
            <a href={`#${item.toLowerCase()}`}>{item}</a>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;