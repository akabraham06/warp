import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import QuickConverter from './QuickConverter';

const VerticalContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  padding: clamp(64px, 12vw, 160px) 0;
`;

const Block = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem clamp(16px, 6vw, 80px);
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 1.5rem 1rem;
  }
`;

const BlockContent = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
`;

const BlockTitle = styled.h2`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(48px, 8vw, 72px);
  line-height: clamp(44px, 7vw, 68px);
  letter-spacing: -2px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2rem;
`;

const BlockSubtitle = styled.h3`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(28px, 4.5vw, 48px);
  line-height: clamp(28px, 4.5vw, 48px);
  letter-spacing: -2px;
  font-weight: 600;
  color: #767676;
  margin-bottom: 2.5rem;
`;

const BlockDescription = styled.p`
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(16px, 2.5vw, 20px);
  line-height: clamp(20px, 3vw, 24px);
  letter-spacing: -1px;
  font-weight: 400;
  color: #767676;
  max-width: 800px;
  margin: 0 auto 2.5rem;
`;

const ConverterWrapper = styled.div`
  background-color: #f4f4f4;
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e8e8e8;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  margin-top: 2.5rem;
`;

const StatCard = styled.div`
  background-color: #f4f4f4;
  border-radius: 0.5rem;
  padding: 2.5rem;
  text-align: center;
  border: 1px solid #e8e8e8;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: clamp(14px, 2vw, 16px);
  color: #767676;
`;

const LocomotiveVerticalParallax = () => {
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
          direction: 'vertical',
          multiplier: 1,
          class: 'is-revealed',
          scrollbarContainer: false,
          touchMultiplier: 2,
          firefoxMultiplier: 50,
          lerp: 0.1,
          tablet: {
            smooth: true,
            direction: 'vertical',
            breakpoint: 1024
          },
          smartphone: {
            smooth: true,
            direction: 'vertical',
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

  const blocks = [
    {
      title: "Start Converting",
      subtitle: "Experience seamless cross-currency transactions",
      description: "Our intelligent routing system finds the best rates across multiple exchanges and blockchains, ensuring you get the most value for your money.",
      content: (
        <ConverterWrapper>
          <QuickConverter />
        </ConverterWrapper>
      )
    },
    {
      title: "Why Choose Warp",
      subtitle: "Built for the future of finance",
      description: "We combine cutting-edge technology with institutional-grade security to deliver a platform that's both powerful and accessible.",
      content: (
        <StatsGrid>
          <StatCard>
            <StatValue>&lt;2s</StatValue>
            <StatLabel>Transaction Time</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>99.9%</StatValue>
            <StatLabel>Uptime</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>100%</StatValue>
            <StatLabel>Transparency</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>12+</StatValue>
            <StatLabel>Supported Chains</StatLabel>
          </StatCard>
        </StatsGrid>
      )
    },
    {
      title: "Enterprise Ready",
      subtitle: "Scale with confidence",
      description: "From individual users to large institutions, Warp provides the infrastructure and support you need to succeed in the global economy.",
      content: (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '300px'
        }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDYwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpkaWZmZXJlbmNlIj4KPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSI3MCIgeT0iNzAiIHdpZHRoPSI0NjAiIGhlaWdodD0iMTYwIiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iOTAiIHk9IjkwIiB3aWR0aD0iNDIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjExMCIgeT0iMTEwIiB3aWR0aD0iMzgwIiBoZWlnaHQ9IjgwIiBmaWxsPSJibGFjayIvPgo8L2c+Cjwvc3ZnPgo=" 
            alt="Enterprise Infrastructure"
            style={{ width: '100%', height: 'auto', maxWidth: '500px' }}
            loading="lazy"
            decoding="async"
          />
        </div>
      )
    }
  ];

  return (
    <VerticalContainer ref={containerRef} data-scroll-container>
      {blocks.map((block, index) => (
        <Block key={index}>
          <BlockContent>
            <div data-scroll data-scroll-speed="0.5">
              <BlockTitle>{block.title}</BlockTitle>
            </div>
            <div data-scroll data-scroll-speed="0.3">
              <BlockSubtitle>{block.subtitle}</BlockSubtitle>
            </div>
            <div data-scroll data-scroll-speed="0.2">
              <BlockDescription>{block.description}</BlockDescription>
            </div>
            <div data-scroll data-scroll-speed="0.1">
              {block.content}
            </div>
          </BlockContent>
        </Block>
      ))}
    </VerticalContainer>
  );
};

export default LocomotiveVerticalParallax;
