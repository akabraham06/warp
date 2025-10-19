import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import ParallaxBackground from './ParallaxBackground';

const HorizontalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const HorizontalScrollContainer = styled.div`
  display: flex;
  width: 300vw; /* 3 sections */
  height: 100vh;
  transform: translateX(${props => props.scrollX}px);
  transition: transform 0.1s ease-out;
`;

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
`;

const SectionContent = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(20, calc(25vw - 50px)) 40px;
  grid-column-gap: 40px;
  background-color: ${props => props.theme.colors.background};
  grid-auto-flow: column;
  height: calc(100vh - 216px);
  padding: 104px 0 117px 40px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20px;
    grid-auto-flow: row;
    height: auto;
    width: calc(100vw - 40px);
    padding: 0 20px;
  }
`;

const HorizontalParallax = () => {
  const containerRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrollX(scrollLeft);
      setScrollY(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      // Section 1: Speed & Performance
      title: "Lightning Fast",
      subtitle: "Sub-second settlement",
      description: "Experience the future of cross-border payments with our optimized stablecoin infrastructure.",
      gridLayout: {
        title: { gridColumn: "1/3", gridRow: "1" },
        subtitle: { gridColumn: "3/5", gridRow: "1" },
        description: { gridColumn: "1/4", gridRow: "2" },
        visual: { gridColumn: "5/8", gridRow: "1/3" },
        stats: { gridColumn: "8/12", gridRow: "1/3" }
      },
      visual: (
        <div style={{ 
          gridColumn: "5/8", 
          gridRow: "1/3",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpkaWZmZXJlbmNlIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTUwIiBmaWxsPSJibGFjayIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjEwMCIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSI1MCIgZmlsbD0iYmxhY2siLz4KPC9nPgo8L3N2Zz4K" 
            alt="Speed Visualization"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),
      stats: (
        <div style={{ 
          gridColumn: "8/12", 
          gridRow: "1/3",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#000' }}>&lt;2s</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Transaction Time</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>99.9%</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Uptime</div>
        </div>
      )
    },
    {
      // Section 2: Transparency & Openness
      title: "Transparent",
      subtitle: "Open protocols",
      description: "Built on open protocols with complete transparency. Every transaction is verifiable on-chain.",
      gridLayout: {
        title: { gridColumn: "1/3", gridRow: "1" },
        subtitle: { gridColumn: "3/5", gridRow: "1" },
        description: { gridColumn: "1/4", gridRow: "2" },
        visual: { gridColumn: "5/8", gridRow: "1/3" },
        stats: { gridColumn: "8/12", gridRow: "1/3" }
      },
      visual: (
        <div style={{ 
          gridColumn: "5/8", 
          gridRow: "1/3",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpkaWZmZXJlbmNlIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMDAgNTBMMjUwIDE1MEwyMDAgMjUwTDE1MCAxNTBMMjAwIDUwWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTIwMCAxMDBMMjAwIDIwMEwyMDAgMzAwTDIwMCAyMDBMMjAwIDEwMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMDAgMjAwTDIwMCAyMDBMMzAwIDIwMEwyMDAgMjAwTDEwMCAyMDBaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+Cjwvc3ZnPgo=" 
            alt="Transparency Visualization"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),
      stats: (
        <div style={{ 
          gridColumn: "8/12", 
          gridRow: "1/3",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#000' }}>100%</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Transparency</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>24/7</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Verification</div>
        </div>
      )
    },
    {
      // Section 3: Customization & Flexibility
      title: "Customizable",
      subtitle: "Multiple routes",
      description: "Our intelligent routing system finds the best path through multiple exchange methods.",
      gridLayout: {
        title: { gridColumn: "1/3", gridRow: "1" },
        subtitle: { gridColumn: "3/5", gridRow: "1" },
        description: { gridColumn: "1/4", gridRow: "2" },
        visual: { gridColumn: "5/8", gridRow: "1/3" },
        stats: { gridColumn: "8/12", gridRow: "1/3" }
      },
      visual: (
        <div style={{ 
          gridColumn: "5/8", 
          gridRow: "1/3",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpkaWZmZXJlbmNlIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTgwIiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjAwIiByPSIxNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iNjAiIGZpbGw9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjwvZz4KPC9zdmc+Cg==" 
            alt="Customization Visualization"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ),
      stats: (
        <div style={{ 
          gridColumn: "8/12", 
          gridRow: "1/3",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#000' }}>4</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Exchange Methods</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>12+</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Supported Chains</div>
        </div>
      )
    }
  ];

  return (
    <HorizontalContainer ref={containerRef}>
      <ParallaxBackground scrollX={scrollX} scrollY={scrollY} />
      <HorizontalScrollContainer scrollX={-scrollX * 0.5}>
        {sections.map((section, index) => (
          <Section key={index}>
            <SectionContent>
              {/* Title */}
              <div style={{
                gridColumn: section.gridLayout.title.gridColumn,
                gridRow: section.gridLayout.title.gridRow,
                alignSelf: 'end',
                marginBottom: '-3px'
              }}>
                <h1 style={{
                  fontSize: 'clamp(48px, 8vw, 72px)',
                  lineHeight: 'clamp(44px, 7vw, 68px)',
                  letterSpacing: '-2px',
                  fontWeight: 700,
                  color: '#000',
                  margin: 0
                }}>
                  {section.title}
                </h1>
              </div>

              {/* Subtitle */}
              <div style={{
                gridColumn: section.gridLayout.subtitle.gridColumn,
                gridRow: section.gridLayout.subtitle.gridRow,
                alignSelf: 'end',
                marginBottom: '-3px'
              }}>
                <h2 style={{
                  fontSize: 'clamp(28px, 4.5vw, 48px)',
                  lineHeight: 'clamp(28px, 4.5vw, 48px)',
                  letterSpacing: '-2px',
                  fontWeight: 600,
                  color: '#000',
                  margin: 0
                }}>
                  {section.subtitle}
                </h2>
              </div>

              {/* Description */}
              <div style={{
                gridColumn: section.gridLayout.description.gridColumn,
                gridRow: section.gridLayout.description.gridRow,
                alignSelf: 'start',
                marginTop: '8px'
              }}>
                <p style={{
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  lineHeight: 'clamp(20px, 3vw, 24px)',
                  letterSpacing: '-1px',
                  fontWeight: 400,
                  color: '#767676',
                  margin: 0
                }}>
                  {section.description}
                </p>
              </div>

              {/* Visual Component */}
              {section.visual}

              {/* Stats */}
              {section.stats}
            </SectionContent>
          </Section>
        ))}
      </HorizontalScrollContainer>
    </HorizontalContainer>
  );
};

export default HorizontalParallax;
