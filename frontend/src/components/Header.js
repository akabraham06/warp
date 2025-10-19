import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Zap } from 'lucide-react';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.8rem;
  font-weight: ${props => props.theme.fonts.weights.extraBold};
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  letter-spacing: -0.02em;

  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: scale(1.02);
  }
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.background};
  font-weight: ${props => props.theme.fonts.weights.bold};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: ${props => props.theme.fonts.weights.medium};
  font-size: 0.95rem;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  padding: ${props => props.theme.spacing.sm} 0;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  &.active {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${props => props.theme.colors.primary};
      border-radius: 1px;
    }
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fonts.weights.medium};
  font-size: 0.9rem;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.fast};
  border: 1px solid transparent;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    
    &:hover {
      background: ${props => props.theme.colors.secondary};
      transform: translateY(-1px);
    }
  }

  &.secondary {
    color: ${props => props.theme.colors.textSecondary};
    border-color: ${props => props.theme.colors.border};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.surfaceLight};
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fonts.weights.medium};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.error};
    border-color: ${props => props.theme.colors.error};
    background: rgba(255, 68, 68, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
  transform: translateY(${props => props.isOpen ? '0' : '-100%'});
  transition: transform ${props => props.theme.transitions.normal};
  z-index: 999;
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: ${props => props.theme.fonts.weights.medium};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const MobileAuthSection = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

export default function Header() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo to="/">
            <LogoIcon>
              <Zap size={20} />
            </LogoIcon>
            Warp
          </Logo>

          <Nav>
            <NavLink to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                  Dashboard
                </NavLink>
                <NavLink to="/history" className={isActive('/history') ? 'active' : ''}>
                  History
                </NavLink>
              </>
            )}
          </Nav>

          <AuthSection>
            {currentUser ? (
              <>
                <UserInfo>
                  <User size={16} />
                  {currentUser.displayName || currentUser.email}
                </UserInfo>
                <LogoutButton onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </LogoutButton>
              </>
            ) : (
              <>
                <AuthButton to="/login" className="secondary">
                  Login
                </AuthButton>
                <AuthButton to="/login" className="primary">
                  Get Started
                </AuthButton>
              </>
            )}
          </AuthSection>

          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </MobileNavLink>
        {currentUser && (
          <>
            <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/history" onClick={() => setIsMobileMenuOpen(false)}>
              History
            </MobileNavLink>
          </>
        )}
        
        <MobileAuthSection>
          {currentUser ? (
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </LogoutButton>
          ) : (
            <>
              <AuthButton to="/login" className="secondary" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </AuthButton>
              <AuthButton to="/login" className="primary" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </AuthButton>
            </>
          )}
        </MobileAuthSection>
      </MobileMenu>
    </>
  );
}