import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.35);
  padding: 0.75rem 0;
  position: absolute;
  bottom: 5%;
  left: 0;
  z-index: 9999;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.5);
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
    color: #1a365d;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      color: #1a365d;
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