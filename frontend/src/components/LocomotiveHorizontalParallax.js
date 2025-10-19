import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const HorizontalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
`;

const HorizontalScrollContainer = styled.div`
  display: flex;
  width: 500vw; /* 5 sections for horizontal scroll */
  height: 100vh;
`;

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  flex-shrink: 0;
`;

const SectionContent = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(20, calc(25vw - 50px)) 40px;
  grid-column-gap: 40px;
  background-color: #ffffff;
  grid-auto-flow: column;
  height: calc(100vh - 216px);
  padding: 104px 0 117px 40px;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20px;
    grid-auto-flow: row;
    height: auto;
    width: calc(100vw - 40px);
    padding: 0 20px;
  }
`;

const StickyTarget = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const LocomotiveHorizontalParallax = () => {
  const containerRef = useRef(null);
  const locomotiveRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      return; // Skip Locomotive Scroll initialization
    }

    // Dynamic import for SSR safety
    const initLocomotive = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        if (locomotiveRef.current) {
          locomotiveRef.current.destroy();
        }

        locomotiveRef.current = new LocomotiveScroll({
          el: containerRef.current,
          smooth: true,
          direction: 'horizontal',
          multiplier: 1,
          class: 'is-revealed',
          scrollbarContainer: false,
          touchMultiplier: 2,
          firefoxMultiplier: 50,
          lerp: 0.1,
          tablet: {
            smooth: true,
            direction: 'horizontal',
            breakpoint: 1024
          },
          smartphone: {
            smooth: true,
            direction: 'horizontal',
            breakpoint: 768
          }
        });

        // Update on resize
        const handleResize = () => {
          if (locomotiveRef.current) {
            locomotiveRef.current.update();
          }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.warn('Locomotive Scroll failed to load:', error);
      }
    };

    initLocomotive();

    // Cleanup
    return () => {
      if (locomotiveRef.current) {
        locomotiveRef.current.destroy();
      }
    };
  }, []);

  const sections = [
    {
      title: "Lightning Fast",
      subtitle: "Sub-second settlement",
      description: "Experience the future of cross-border payments with our optimized stablecoin infrastructure.",
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
            loading="lazy"
            decoding="async"
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
      title: "Transparent",
      subtitle: "Open protocols",
      description: "Built on open protocols with complete transparency. Every transaction is verifiable on-chain.",
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
            loading="lazy"
            decoding="async"
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
      title: "Customizable",
      subtitle: "Multiple routes",
      description: "Our intelligent routing system finds the best path through multiple exchange methods.",
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
            loading="lazy"
            decoding="async"
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
    },
    {
      title: "Stablecoin Optimized",
      subtitle: "Minimal volatility",
      description: "Leverage stablecoins to eliminate currency risk while maintaining the speed of digital assets.",
      visual: (
        <div style={{ 
          gridColumn: "5/8", 
          gridRow: "1/3",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpkaWZmZXJlbmNlIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTIwIiB5PSIxMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxNDAiIHk9IjE0MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9ImJsYWNrIi8+CjwvZz4KPC9zdmc+Cg==" 
            alt="Stablecoin Visualization"
            style={{ width: '100%', height: 'auto' }}
            loading="lazy"
            decoding="async"
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
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#000' }}>$0</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Volatility Risk</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>3</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Stablecoins</div>
        </div>
      )
    },
    {
      title: "Enterprise Ready",
      subtitle: "Built for scale",
      description: "Enterprise-grade infrastructure with institutional-level security and compliance.",
      visual: (
        <div style={{ 
          gridColumn: "5/8", 
          gridRow: "1/3",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpkaWZmZXJlbmNlIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSI3MCIgeT0iNzAiIHdpZHRoPSIyNjAiIGhlaWdodD0iMjYwIiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iOTAiIHk9IjkwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjExMCIgeT0iMTEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iYmxhY2siLz4KPC9nPgo8L3N2Zz4K" 
            alt="Enterprise Visualization"
            style={{ width: '100%', height: 'auto' }}
            loading="lazy"
            decoding="async"
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
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#000' }}>256</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Bit Encryption</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>24/7</div>
          <div style={{ fontSize: '1.5rem', color: '#767676' }}>Support</div>
        </div>
      )
    }
  ];

  return (
    <HorizontalContainer ref={containerRef} data-scroll-container data-scroll-direction="horizontal">
      <StickyTarget className="target-sticky" data-scroll data-scroll-sticky data-scroll-target="#target-sticky" />
      <HorizontalScrollContainer>
        {sections.map((section, index) => (
          <Section key={index}>
            <SectionContent>
              {/* Title */}
              <div 
                style={{
                  gridColumn: "1/3",
                  gridRow: "1",
                  alignSelf: 'end',
                  marginBottom: '-3px'
                }}
                data-scroll 
                data-scroll-speed="1"
              >
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
              <div 
                style={{
                  gridColumn: "3/5",
                  gridRow: "1",
                  alignSelf: 'end',
                  marginBottom: '-3px'
                }}
                data-scroll 
                data-scroll-speed="0.5"
              >
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
              <div 
                style={{
                  gridColumn: "1/4",
                  gridRow: "2",
                  alignSelf: 'start',
                  marginTop: '8px'
                }}
                data-scroll 
                data-scroll-speed="0.8"
              >
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
              <div data-scroll data-scroll-speed="-0.5">
                {section.visual}
              </div>

              {/* Stats */}
              <div data-scroll data-scroll-speed="0.3">
                {section.stats}
              </div>
            </SectionContent>
          </Section>
        ))}
      </HorizontalScrollContainer>
    </HorizontalContainer>
  );
};

export default LocomotiveHorizontalParallax;
