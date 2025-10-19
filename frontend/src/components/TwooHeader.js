import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999999;
  background: transparent;
  mix-blend-mode: difference;
`;

const Logo = styled(Link)`
  position: fixed;
  left: 40px;
  top: 36px;
  z-index: 999999999;
  mix-blend-mode: difference;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    left: 20px;
    top: 24px;
  }
`;

const LogoFill = styled.svg`
  fill: #fff;
  width: 120px;
  height: 24px;
`;

const Nav = styled.nav`
  position: fixed;
  right: 40px;
  top: 36px;
  z-index: 999999999;
  mix-blend-mode: difference;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    right: 20px;
    top: 24px;
  }
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-family: ${props => props.theme.fonts.primary};
  font-size: 16px;
  letter-spacing: -0.5px;
  margin-left: 24px;
  position: relative;
  
  &:hover {
    .underline {
      width: 100%;
    }
  }
`;

const Underline = styled.span`
  background-color: #fff;
  bottom: -2px;
  height: 1px;
  left: 0;
  position: absolute;
  width: 0;
  transition: 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
`;

const TwooHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <LogoFill viewBox="0 0 120 24">
          {/* Warp asterisk logo */}
          <g transform="translate(0, 12)">
            {/* Central asterisk */}
            <path d="M12,0 L12,8 M8,4 L16,4 M6.5,1.5 L17.5,6.5 M17.5,1.5 L6.5,6.5" 
                  stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            {/* W text */}
            <text x="24" y="6" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="#fff">WARP</text>
          </g>
        </LogoFill>
      </Logo>
      
      <Nav>
        {currentUser ? (
          <>
            <NavLink to="/dashboard">
              Dashboard
              <Underline className="underline" />
            </NavLink>
            <NavLink as="button" onClick={handleLogout}>
              Logout
              <Underline className="underline" />
            </NavLink>
          </>
        ) : (
          <NavLink to="/login">
            Login
            <Underline className="underline" />
          </NavLink>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default TwooHeader;
