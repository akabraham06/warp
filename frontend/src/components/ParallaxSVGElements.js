import React from 'react';
import styled from 'styled-components';

const SVGContainer = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 1;
  opacity: 0.1;
  transition: opacity 0.8s ease;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const FloatingSVG = styled(SVGContainer)`
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  animation: float ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const ParallaxSVGElements = ({ isInHorizontalSection }) => {
  return (
    <>
      {/* Geometric shapes scattered across sections */}
      <FloatingSVG top={20} left={10} size={60} duration={8} delay={0}>
        <svg viewBox="0 0 100 100" fill="none">
          <polygon 
            points="50,10 90,90 10,90" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="2" 
            fill="none"
          />
        </svg>
      </FloatingSVG>

      <FloatingSVG top={60} left={85} size={40} duration={6} delay={1}>
        <svg viewBox="0 0 100 100" fill="none">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1" 
            fill="none"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="20" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1" 
            fill="none"
          />
        </svg>
      </FloatingSVG>

      <FloatingSVG top={30} left={75} size={50} duration={10} delay={2}>
        <svg viewBox="0 0 100 100" fill="none">
          <rect 
            x="20" 
            y="20" 
            width="60" 
            height="60" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="2" 
            fill="none"
            transform="rotate(45 50 50)"
          />
        </svg>
      </FloatingSVG>

      <FloatingSVG top={70} left={15} size={35} duration={7} delay={0.5}>
        <svg viewBox="0 0 100 100" fill="none">
          <path 
            d="M50,10 Q90,50 50,90 Q10,50 50,10" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="2" 
            fill="none"
          />
        </svg>
      </FloatingSVG>

      <FloatingSVG top={15} left={60} size={45} duration={9} delay={1.5}>
        <svg viewBox="0 0 100 100" fill="none">
          <polygon 
            points="50,5 75,35 65,70 35,70 25,35" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1.5" 
            fill="none"
          />
        </svg>
      </FloatingSVG>

      <FloatingSVG top={80} left={70} size={30} duration={5} delay={3}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse 
            cx="50" 
            cy="50" 
            rx="40" 
            ry="20" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1" 
            fill="none"
          />
        </svg>
      </FloatingSVG>

      {/* Abstract line elements */}
      <SVGContainer style={{ top: '25%', left: '5%', width: '200px', height: '2px' }}>
        <svg viewBox="0 0 200 2" fill="none">
          <path 
            d="M0,1 Q50,0 100,1 T200,1" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1"
          />
        </svg>
      </SVGContainer>

      <SVGContainer style={{ top: '45%', right: '8%', width: '150px', height: '2px' }}>
        <svg viewBox="0 0 150 2" fill="none">
          <path 
            d="M0,1 Q75,0 150,1" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1"
          />
        </svg>
      </SVGContainer>

      <SVGContainer style={{ top: '65%', left: '12%', width: '180px', height: '2px' }}>
        <svg viewBox="0 0 180 2" fill="none">
          <path 
            d="M0,1 Q45,0 90,1 Q135,2 180,1" 
            stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
            strokeWidth="1"
          />
        </svg>
      </SVGContainer>

      {/* Grid pattern elements */}
      <SVGContainer style={{ top: '10%', right: '15%', width: '80px', height: '80px' }}>
        <svg viewBox="0 0 80 80" fill="none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M 20 0 L 0 0 0 20" 
                stroke={isInHorizontalSection ? "#ffffff" : "#000000"} 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="80" height="80" fill="url(#grid)" />
        </svg>
      </SVGContainer>

      <SVGContainer style={{ bottom: '20%', left: '8%', width: '60px', height: '60px' }}>
        <svg viewBox="0 0 60 60" fill="none">
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle 
                cx="5" 
                cy="5" 
                r="1" 
                fill={isInHorizontalSection ? "#ffffff" : "#000000"}
              />
            </pattern>
          </defs>
          <rect width="60" height="60" fill="url(#dots)" />
        </svg>
      </SVGContainer>
    </>
  );
};

export default ParallaxSVGElements;
