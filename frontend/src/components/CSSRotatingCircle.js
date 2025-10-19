import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animations - removed arbitrary floating

// Styled components
const CircleContainer = styled.div`
  width: 800px;
  height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
`;

const Circle3D = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainCircle = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f8f8f8 30%, #f0f0f0 70%, #e8e8e8 100%);
  box-shadow: 
    0 0 80px rgba(0, 0, 0, 0.2),
    0 0 160px rgba(0, 0, 0, 0.15),
    inset 0 0 50px rgba(255, 255, 255, 0.9),
    inset 0 0 100px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
`;

const ShadowCircle = styled.div`
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle at 70% 70%, #a0a0a0 0%, #808080 30%, #606060 70%, #404040 100%);
  box-shadow: 
    0 0 100px rgba(0, 0, 0, 0.4),
    0 0 200px rgba(0, 0, 0, 0.3),
    inset 0 0 60px rgba(255, 255, 255, 0.1),
    inset 0 0 120px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -50%);
  z-index: 1;
  transition: transform 0.3s ease-in-out;
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%);
  box-shadow: 
    0 0 40px rgba(0, 0, 0, 0.1),
    inset 0 0 40px rgba(255, 255, 255, 0.9),
    inset 0 0 80px rgba(0, 0, 0, 0.05);
  z-index: 3;
`;

const CSSRotatingCircle = ({ scrollProgress = 0, isInHorizontalSection = true }) => {
  // Calculate scroll-to-right behavior
  const scrollToRight = Math.max(0, scrollProgress - 0.5) * 2; // Starts moving right after 50% scroll
  const horizontalMovement = -scrollProgress * 200 + scrollToRight * 100; // Move left initially, then right
  
  // Calculate shadow circle position based on rotation
  // When rotation completes half a turn (180 degrees), move shadow circle to touch main circle
  const rotationProgress = (scrollProgress * 900) % 360; // Get current rotation angle
  const isHalfRotation = rotationProgress >= 180; // Check if we've completed half a rotation
  
  // Calculate shadow circle translation
  // Start at -45% (left), move to -50% (touching) when half rotation is complete
  const shadowTranslateX = isHalfRotation ? -50 : -45;
  
  return (
    <CircleContainer>
      <Circle3D 
        style={{
          transform: `rotateY(${-scrollProgress * 900}deg) translateX(${horizontalMovement}px)`,
          filter: isInHorizontalSection ? 'brightness(1.2)' : 'brightness(1)'
        }}
      >
        <ShadowCircle 
          style={{
            transform: `translate(${shadowTranslateX}%, -50%)`
          }}
        />
        <MainCircle />
        <InnerCircle />
      </Circle3D>
    </CircleContainer>
  );
};

export default CSSRotatingCircle;
