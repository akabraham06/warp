import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Shield, Globe, TrendingUp, Users, Star, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConverterSection from '../components/ConverterSection';

gsap.registerPlugin(ScrollTrigger);

// Parallax Background with Space Particles
const ParallaxBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
`;

const SpaceParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  
  .particle {
    position: absolute;
    background: ${props => props.theme.colors.primary};
    border-radius: 50%;
    opacity: 0.6;
    
    &.small {
      width: 1px;
      height: 1px;
    }
    
    &.medium {
      width: 2px;
      height: 2px;
    }
    
    &.large {
      width: 3px;
      height: 3px;
    }
  }
`;

// Main Container
const LandingPageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  overflow-x: hidden;
`;

// Hero Section
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: ${props => props.theme.spacing.xxl} 0;
  background: ${props => props.theme.colors.gradient.hero};
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  text-align: center;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: ${props => props.theme.fonts.weights.extraBold};
  line-height: 1.1;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: ${props => props.theme.fonts.weights.regular};
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${props => props.theme.spacing.xxl};
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing.xxxl};
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  font-size: 1.1rem;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  
  &.primary {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.background};
    box-shadow: ${props => props.theme.shadows.glow};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.glowStrong};
    }
  }
  
  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.border};
    
    &:hover {
      background: ${props => props.theme.colors.surfaceLight};
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textMuted};
  font-size: 0.9rem;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing.xxxl} 0;
  background: ${props => props.theme.colors.surface};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: ${props => props.theme.fonts.weights.bold};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.text};
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surfaceLight};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.gradient.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.background};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: ${props => props.theme.fonts.weights.semiBold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

// Stats Section
const StatsSection = styled.section`
  padding: ${props => props.theme.spacing.xxxl} 0;
  background: ${props => props.theme.colors.background};
`;

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
`;

const StatNumber = styled.div`
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: ${props => props.theme.fonts.weights.extraBold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fonts.weights.medium};
`;

// Product Info Section
const ProductSection = styled.section`
  padding: ${props => props.theme.spacing.xxxl} 0;
  background: ${props => props.theme.colors.surface};
`;

const ProductContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xxxl};
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.xl};
  }
`;

const ProductText = styled.div`
  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: ${props => props.theme.fonts.weights.bold};
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.7;
    margin-bottom: ${props => props.theme.spacing.lg};
    font-size: 1.1rem;
  }
`;

const ProductVisual = styled.div`
  position: relative;
  height: 400px;
  background: ${props => props.theme.colors.surfaceLight};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// SVG Elements
const FloatingSVG = styled.div`
  position: absolute;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

export default function LandingPage() {
  const { currentUser } = useAuth();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const productRef = useRef(null);

  useEffect(() => {
    // Create space particles
    const createParticles = () => {
      const particlesContainer = document.querySelector('.space-particles');
      if (!particlesContainer) return;

      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small';
        particle.classList.add(size);
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();

    // Hero animations
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Features animation
    gsap.fromTo(featuresRef.current?.children,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Stats animation
    gsap.fromTo(statsRef.current?.children,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Product section animation
    gsap.fromTo(productRef.current?.children,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: productRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

  }, []);

  return (
    <LandingPageContainer>
      <ParallaxBackground>
        <SpaceParticles className="space-particles" />
      </ParallaxBackground>

      <HeroSection ref={heroRef}>
        <HeroContent>
          <HeroTitle>
            Warp
            <br />
            <span style={{ fontSize: '0.6em', fontWeight: '400' }}>
              Cross-Currency Transactions
            </span>
          </HeroTitle>
          <HeroSubtitle>
            Experience the future of global payments with our advanced quoting engine. 
            Get the best rates from 15+ exchanges with seamless fiat-to-fiat transactions.
          </HeroSubtitle>
          <CTAButtons>
            <CTAButton to="/" className="primary">
              Start Converting
              <ArrowRight size={20} />
            </CTAButton>
            {!currentUser && (
              <CTAButton to="/login" className="secondary">
                Get Started
                <Zap size={20} />
              </CTAButton>
            )}
          </CTAButtons>
          <ScrollIndicator>
            <span>Scroll to explore</span>
            <ChevronDown size={20} />
          </ScrollIndicator>
        </HeroContent>
      </HeroSection>

      <FeaturesSection ref={featuresRef}>
        <SectionTitle>Why Choose Warp</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <Zap size={24} />
            </FeatureIcon>
            <FeatureTitle>Lightning Fast</FeatureTitle>
            <FeatureDescription>
              Get real-time quotes in milliseconds with our advanced API integration across multiple exchanges.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <Shield size={24} />
            </FeatureIcon>
            <FeatureTitle>Secure & Reliable</FeatureTitle>
            <FeatureDescription>
              Bank-grade security with end-to-end encryption and compliance with international financial standards.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <Globe size={24} />
            </FeatureIcon>
            <FeatureTitle>Global Coverage</FeatureTitle>
            <FeatureDescription>
              Support for 50+ currencies and seamless transactions across borders with local payment methods.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection ref={statsRef}>
        <StatsGrid>
          <StatCard>
            <StatNumber>15+</StatNumber>
            <StatLabel>Exchange Partners</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>Supported Currencies</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>99.9%</StatNumber>
            <StatLabel>Uptime Guarantee</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Customer Support</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <ProductSection ref={productRef}>
        <ProductContent>
          <ProductText>
            <h2>Advanced Technology</h2>
            <p>
              Our proprietary algorithm analyzes real-time market data from multiple sources 
              to ensure you always get the best possible exchange rates.
            </p>
            <p>
              Built on cutting-edge blockchain technology with smart contract integration, 
              Warp provides transparent, secure, and efficient cross-currency transactions.
            </p>
          </ProductText>
          <ProductVisual>
            <FloatingSVG style={{ top: '20%', left: '20%' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </FloatingSVG>
            <FloatingSVG style={{ top: '60%', right: '30%' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
              </svg>
            </FloatingSVG>
            <FloatingSVG style={{ bottom: '30%', left: '60%' }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </FloatingSVG>
          </ProductVisual>
        </ProductContent>
      </ProductSection>

      <ConverterSection />
    </LandingPageContainer>
  );
}