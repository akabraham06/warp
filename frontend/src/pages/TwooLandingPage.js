import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import QuickConverter from '../components/QuickConverter';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #000000;
  overflow-x: hidden;
  overflow-y: ${props => props.allowVerticalScroll ? 'auto' : 'hidden'};
`;

// Main horizontal scrolling container
const HorizontalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: ${props => props.isInHorizontalSection ? '#000000' : '#ffffff'};
  color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
  overflow: hidden;
  transition: background-color 0.8s ease, color 0.8s ease;
`;

// Horizontal scroll wrapper
const HorizontalScrollWrapper = styled.div`
  display: flex;
  width: 500vw; /* 5 sections */
  height: 100vh;
  will-change: transform;
  transition: transform 0.1s ease-out;
`;

// Individual section
const Section = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  padding: 0 5vw;
  box-sizing: border-box;
`;

// Section content wrapper
const SectionContent = styled.div`
  max-width: 1200px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

// Left content area
const LeftContent = styled.div`
  flex: 1;
  max-width: 50%;
  padding-right: 5vw;
`;

// Right content area
const RightContent = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

// Typography components
const SectionTitle = styled.h1`
  font-size: clamp(48px, 8vw, 96px);
  line-height: clamp(44px, 7vw, 88px);
  letter-spacing: -2px;
  font-weight: 700;
  color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
  margin-bottom: 2rem;
  transition: color 0.8s ease;
`;

const SectionSubtitle = styled.h2`
  font-size: clamp(28px, 4.5vw, 48px);
  line-height: clamp(28px, 4.5vw, 48px);
  letter-spacing: -2px;
  font-weight: 600;
  color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
  margin-bottom: 1.5rem;
  transition: color 0.8s ease;
`;

const SectionDescription = styled.p`
  font-size: clamp(16px, 2.5vw, 20px);
  line-height: clamp(20px, 3vw, 24px);
  letter-spacing: -0.5px;
  font-weight: 400;
  color: #767676;
  margin-bottom: 2rem;
`;

const BrandDescription = styled.p`
  font-size: clamp(14px, 2vw, 16px);
  line-height: clamp(18px, 2.5vw, 20px);
  letter-spacing: -0.5px;
  font-weight: 400;
  color: #767676;
  margin-bottom: 2rem;
`;

const ContactLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  li {
    a {
      color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
      text-decoration: none;
      font-size: clamp(14px, 2vw, 16px);
      position: relative;
      transition: color 0.8s ease;
      
      &:hover {
        color: #767676;
      }
      
      .underline {
        background-color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
        bottom: -2px;
        height: 1px;
        left: 0;
        position: absolute;
        width: 0;
        transition: width 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955), background-color 0.8s ease;
      }
      
      &:hover .underline {
        width: 100%;
      }
    }
  }
`;

const TimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  font-size: clamp(14px, 2vw, 16px);
  color: #767676;
`;

const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Visual elements
const LargeNumber = styled.div`
  font-size: clamp(200px, 30vw, 400px);
  font-weight: 700;
  color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
  opacity: 0.1;
  line-height: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: color 0.8s ease;
`;

const CircularGraphic = styled.div`
  width: clamp(200px, 25vw, 400px);
  height: clamp(200px, 25vw, 400px);
  border: 2px solid #767676;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    border: 2px solid #767676;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const SquareGraphic = styled.div`
  width: clamp(200px, 25vw, 400px);
  height: clamp(200px, 25vw, 400px);
  border: 2px solid #767676;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    background: #767676;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    font-size: clamp(16px, 2.5vw, 20px);
    line-height: clamp(20px, 3vw, 24px);
    color: #767676;
    margin-bottom: 1rem;
    position: relative;
    padding-left: 1.5rem;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
      transition: color 0.8s ease;
    }
  }
`;

const ProcessBlock = styled.div`
  margin-bottom: 2rem;
`;

const ProcessTitle = styled.h3`
  font-size: clamp(20px, 3vw, 24px);
  line-height: clamp(24px, 3.5vw, 30px);
  letter-spacing: -1px;
  font-weight: 600;
  color: #767676;
  margin-bottom: 1rem;
`;

const ProcessDescription = styled.p`
  font-size: clamp(14px, 2vw, 16px);
  line-height: clamp(18px, 2.5vw, 20px);
  letter-spacing: -0.5px;
  font-weight: 400;
  color: #767676;
`;

// Single Navigation component
const FixedNavigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.isInHorizontalSection ? '#000000' : '#ffffff'};
  backdrop-filter: ${props => props.isInHorizontalSection ? 'none' : 'blur(10px)'};
  z-index: 1000;
  padding: 1rem 2rem;
  border-bottom: ${props => props.isInHorizontalSection ? 'none' : '1px solid #e8e8e8'};
  transition: background 0.8s ease, backdrop-filter 0.8s ease, border-bottom 0.8s ease;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
  transition: color 0.8s ease;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.8s ease;
    
    &:hover {
      color: #767676;
    }
  }
`;

// Vertical parallax section
const VerticalSection = styled.div`
  min-height: 100vh;
  background: #ffffff;
  position: relative;
`;

const ConverterSection = styled.div`
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const ConverterTitle = styled.h2`
  font-size: clamp(48px, 8vw, 72px);
  line-height: clamp(44px, 7vw, 68px);
  letter-spacing: -2px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2rem;
`;

const ConverterDescription = styled.p`
  font-size: clamp(16px, 2.5vw, 20px);
  line-height: clamp(20px, 3vw, 24px);
  color: #767676;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ConverterWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 0.5rem;
`;

const TwooLandingPage = () => {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVerticalSection, setIsVerticalSection] = useState(false);
  const [isInHorizontalSection, setIsInHorizontalSection] = useState(true);
  const [allowVerticalScroll, setAllowVerticalScroll] = useState(false);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [savedHorizontalProgress, setSavedHorizontalProgress] = useState(0);


  useEffect(() => {
    const handleScroll = (e) => {
      const currentScrollY = window.pageYOffset;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      setLastScrollY(currentScrollY);

      // If we're scrolling up and we're in vertical section, go back to horizontal
      if (scrollDirection === 'up' && isVerticalSection && currentScrollY < 100) {
        setIsVerticalSection(false);
        setIsInHorizontalSection(true);
        setAllowVerticalScroll(false);
        // Restore the saved horizontal progress instead of resetting to 0
        setHorizontalProgress(savedHorizontalProgress);
        
        // Restore the horizontal scroll position
        const translateX = -savedHorizontalProgress * (500 - 100);
        if (scrollWrapperRef.current) {
          scrollWrapperRef.current.style.transform = `translateX(${translateX}vw)`;
        }
        
        document.body.style.overflow = 'hidden';
        return;
      }

      // If we're still in horizontal mode, prevent vertical scrolling
      if (!allowVerticalScroll) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleWheel = (e) => {
      const currentScrollY = window.pageYOffset;
      const scrollDirection = e.deltaY > 0 ? 'down' : 'up';

      // If we're in vertical section and scrolling up near the top, go back to horizontal
      if (isVerticalSection && scrollDirection === 'up' && currentScrollY < 50) {
        setIsVerticalSection(false);
        setIsInHorizontalSection(true);
        setAllowVerticalScroll(false);
        // Restore the saved horizontal progress instead of resetting to 0
        setHorizontalProgress(savedHorizontalProgress);
        
        // Restore the horizontal scroll position
        const translateX = -savedHorizontalProgress * (500 - 100);
        if (scrollWrapperRef.current) {
          scrollWrapperRef.current.style.transform = `translateX(${translateX}vw)`;
        }
        
        document.body.style.overflow = 'hidden';
        return;
      }

      // If we're still in horizontal mode, convert vertical scroll to horizontal
      if (!allowVerticalScroll) {
        e.preventDefault();
        
        const delta = e.deltaY;
        const newProgress = Math.max(0, Math.min(1, horizontalProgress + (delta * 0.001)));
        setHorizontalProgress(newProgress);
        
        // Update horizontal scroll position
        const translateX = -newProgress * (500 - 100); // 500vw - 100vw
        if (scrollWrapperRef.current) {
          scrollWrapperRef.current.style.transform = `translateX(${translateX}vw)`;
        }
        
        // Start transition when we're 90% through horizontal scroll
        if (newProgress > 0.9 && !isTransitioning) {
          setIsTransitioning(true);
        }
        
        // Complete horizontal scroll and enable vertical
        if (newProgress >= 1 && !allowVerticalScroll) {
          // Save the current progress before switching to vertical
          setSavedHorizontalProgress(newProgress);
          
          setAllowVerticalScroll(true);
          setIsVerticalSection(true);
          setIsInHorizontalSection(false);
          
          // Ensure horizontal content is fully scrolled
          if (scrollWrapperRef.current) {
            scrollWrapperRef.current.style.transform = `translateX(-400vw)`;
          }
          
          // Allow normal scrolling to resume
          document.body.style.overflow = 'auto';
        }
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Prevent default scrolling behavior during horizontal mode
    if (!allowVerticalScroll) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      document.body.style.overflow = 'auto';
    };
  }, [allowVerticalScroll, horizontalProgress, isTransitioning, isVerticalSection, lastScrollY, savedHorizontalProgress]);

  return (
    <PageContainer allowVerticalScroll={allowVerticalScroll}>
      {/* Single Fixed Navigation - Only One Set of Elements */}
      <FixedNavigation isInHorizontalSection={isInHorizontalSection}>
        <NavContent>
          <Logo isInHorizontalSection={isInHorizontalSection}>WARP</Logo>
          <NavLinks isInHorizontalSection={isInHorizontalSection}>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </NavLinks>
        </NavContent>
      </FixedNavigation>

      {/* Horizontal parallax sections */}
      <HorizontalContainer ref={containerRef} isInHorizontalSection={isInHorizontalSection}>
        <HorizontalScrollWrapper ref={scrollWrapperRef}>
          {/* Section 1: Hero */}
          <Section>
            <SectionContent>
              <LeftContent>
                <BrandDescription>
                  With a multicultural and open-minded approach to international
                  financial technology, Warp designs and develops systems for cross-currency
                  transactions, combining strategic thinking with
                  refined user experience design.
                </BrandDescription>
                
                <SectionTitle isInHorizontalSection={isInHorizontalSection}>
                  We are a fintech platform based in Barcelona, enabling global transactions.
                </SectionTitle>
                
                <ContactLinks isInHorizontalSection={isInHorizontalSection}>
                  <li><Link to="mailto:hello@warp.com" target="_blank">
                    hello@warp.com
                    <span className="underline"></span></Link></li>
                  <li><Link to="https://www.instagram.com/warp" target="_blank">
                    Instagram
                    <span className="underline"></span></Link></li>
                  <li><Link to="https://www.behance.net/warp" target="_blank">
                    Behance
                    <span className="underline"></span></Link></li>
                  <li><Link to="https://www.linkedin.com/company/warp" target="_blank">
                    Linkedin
                    <span className="underline"></span></Link></li>
                </ContactLinks>
                
                <TimeInfo>
                  <TimeColumn>
                    <div>Based in Barcelona</div>
                    <div>7:20 AM</div>
                  </TimeColumn>
                  <TimeColumn>
                    <div>Working worldwide</div>
                    <div>12:20 AM</div>
                  </TimeColumn>
                </TimeInfo>
              </LeftContent>
              
              <RightContent>
                <LargeNumber isInHorizontalSection={isInHorizontalSection}>2</LargeNumber>
              </RightContent>
            </SectionContent>
          </Section>

          {/* Section 2: Philosophy */}
          <Section>
            <SectionContent>
              <LeftContent>
                <SectionSubtitle isInHorizontalSection={isInHorizontalSection}>
                  Technology, Functionality &amp; Aesthetics.
                  <br />
                  All Together.
                </SectionSubtitle>
                
                <SectionDescription>
                  For us, cross-currency transaction design is, above all, planning the product as a whole, and not
                  just its external appearance.
                  <br /> <br />
                  Our practice is based on a Multidisciplinary Integrated Fintech Approach, where functionality and aesthetics are developmental
                  criteria alongside technology, from the beginning.
                </SectionDescription>
              </LeftContent>
              
              <RightContent>
                <CircularGraphic />
              </RightContent>
            </SectionContent>
          </Section>

          {/* Section 3: Process */}
          <Section>
            <SectionContent>
              <LeftContent>
                <SectionTitle isInHorizontalSection={isInHorizontalSection}>
                  Multidisciplinary
                  <br />
                  Integrated Design
                  <br />
                  Approach.
                </SectionTitle>
                
                <ProcessBlock>
                  <ProcessTitle>Functionality</ProcessTitle>
                  <ProcessDescription>
                    We combine creativity with usability. We design by asking questions and looking for possible solutions to
                    them. It is a constructive process, we investigate and build by
                    testing out hypotheses.
                  </ProcessDescription>
                </ProcessBlock>
                
                <ProcessBlock>
                  <ProcessTitle>Aesthetics</ProcessTitle>
                  <ProcessDescription>
                    Forms that communicate an idea. Style is not a matter of appearance, it's a chosen medium to
                    communicate an idea. It's not just form as beauty but a thought, a
                    realization turned into visuals.
                  </ProcessDescription>
                </ProcessBlock>
              </LeftContent>
              
              <RightContent>
                <SquareGraphic />
              </RightContent>
            </SectionContent>
          </Section>

          {/* Section 4: Services */}
          <Section>
            <SectionContent>
              <LeftContent>
                <SectionSubtitle isInHorizontalSection={isInHorizontalSection}>What we offer</SectionSubtitle>
                <SectionDescription>
                  We help companies to design and build first-class products and
                  services that connect with people. Focusing on digital, we work on a
                  variety of projects ranging from brand identity systems to product
                  design and development.
                </SectionDescription>
                
                <ServiceList isInHorizontalSection={isInHorizontalSection}>
                  <li>Global FX Transfers</li>
                  <li>Stablecoin Integration</li>
                  <li>Multi-Chain DEX Aggregation</li>
                  <li>Hybrid Routing</li>
                </ServiceList>
              </LeftContent>
              
              <RightContent>
                <SectionTitle isInHorizontalSection={isInHorizontalSection}>
                  Smart craft
                  <br />
                  for digital products
                  <br />
                  and services.
                </SectionTitle>
              </RightContent>
            </SectionContent>
          </Section>

          {/* Section 5: Contact */}
          <Section>
            <SectionContent>
              <LeftContent>
                <SectionSubtitle isInHorizontalSection={isInHorizontalSection}>Contact</SectionSubtitle>
                <SectionDescription>
                  Warp is available for commissioned projects and collaborations.
                  No geographical restrictions, from local projects to global
                  clients.
                </SectionDescription>
                
                <ContactLinks isInHorizontalSection={isInHorizontalSection}>
                  <li>For work inquires</li>
                  <li><Link to="mailto:hello@warp.com" target="_blank">
                    hello@warp.com
                    <span className="underline"></span></Link></li>
                </ContactLinks>
              </LeftContent>
              
              <RightContent>
                <LargeNumber isInHorizontalSection={isInHorizontalSection}>2</LargeNumber>
              </RightContent>
            </SectionContent>
          </Section>
        </HorizontalScrollWrapper>
      </HorizontalContainer>
      
      {/* Vertical parallax section with converter */}
      <VerticalSection>
        <ConverterSection>
          <ConverterTitle>Start Converting Now</ConverterTitle>
          <ConverterDescription>
            Experience seamless cross-currency transactions with our intelligent routing system.
            Get the best rates across multiple exchanges and chains.
          </ConverterDescription>
          
          <ConverterWrapper>
            <QuickConverter />
          </ConverterWrapper>
          
          <div style={{ marginTop: '2rem' }}>
            <Link 
              to="/login" 
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '0.25rem',
                fontWeight: '600',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
            >
              Get Started
            </Link>
          </div>
        </ConverterSection>
      </VerticalSection>
    </PageContainer>
  );
};

export default TwooLandingPage;