import React from 'react';
import styled from 'styled-components';


const DecorativeCircle = styled.div`
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.1;
  transition: opacity 0.8s ease;
  
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
`;

const DecorativeSquare = styled.div`
  position: absolute;
  background: #ffffff;
  opacity: 0.08;
  transition: opacity 0.8s ease;
  
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  transform: rotate(${props => props.rotation}deg);
`;

const DecorativeTriangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: ${props => props.size/2}px solid transparent;
  border-right: ${props => props.size/2}px solid transparent;
  border-bottom: ${props => props.size}px solid #ffffff;
  opacity: 0.06;
  transition: opacity 0.8s ease;
  
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  transform: rotate(${props => props.rotation}deg);
`;

const FloatingText = styled.div`
  position: absolute;
  font-size: ${props => props.size}px;
  font-weight: 300;
  color: ${props => props.isInHorizontalSection ? '#ffffff' : '#000000'};
  opacity: 0.1;
  transition: color 0.8s ease, opacity 0.8s ease;
  pointer-events: none;
  user-select: none;
  
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  transform: rotate(${props => props.rotation}deg);
`;

const DecorativeElements = ({ isInHorizontalSection }) => {
  return (
    <>
      {/* Decorative circles - arbitrarily spaced */}
      <DecorativeCircle size={45} top={8} left={12} />
      <DecorativeCircle size={85} top={25} left={88} />
      <DecorativeCircle size={65} top={45} left={5} />
      <DecorativeCircle size={95} top={65} left={92} />
      <DecorativeCircle size={35} top={82} left={8} />
      <DecorativeCircle size={75} top={15} left={75} />
      <DecorativeCircle size={55} top={55} left={25} />
      <DecorativeCircle size={40} top={35} left={45} />
      
      {/* Decorative squares - arbitrarily spaced */}
      <DecorativeSquare size={30} top={18} left={18} rotation={45} />
      <DecorativeSquare size={50} top={38} left={82} rotation={-45} />
      <DecorativeSquare size={25} top={58} left={12} rotation={30} />
      <DecorativeSquare size={40} top={78} left={85} rotation={-30} />
      <DecorativeSquare size={35} top={28} left={65} rotation={60} />
      <DecorativeSquare size={20} top={48} left={35} rotation={-60} />
      
      {/* Decorative triangles - arbitrarily spaced */}
      <DecorativeTriangle size={40} top={12} left={35} rotation={0} />
      <DecorativeTriangle size={60} top={32} left={65} rotation={120} />
      <DecorativeTriangle size={35} top={52} left={15} rotation={240} />
      <DecorativeTriangle size={45} top={72} left={85} rotation={60} />
      <DecorativeTriangle size={25} top={22} left={55} rotation={180} />
      <DecorativeTriangle size={50} top={42} left={25} rotation={300} />
      
      {/* Floating text elements */}
      <FloatingText size={24} top={5} left={5} rotation={-15} isInHorizontalSection={isInHorizontalSection}>
        DESIGN
      </FloatingText>
      <FloatingText size={18} top={15} left={95} rotation={15} isInHorizontalSection={isInHorizontalSection}>
        CRAFT
      </FloatingText>
      <FloatingText size={20} top={75} left={5} rotation={-10} isInHorizontalSection={isInHorizontalSection}>
        INNOVATION
      </FloatingText>
      <FloatingText size={16} top={90} left={90} rotation={20} isInHorizontalSection={isInHorizontalSection}>
        FUTURE
      </FloatingText>
      <FloatingText size={22} top={45} left={2} rotation={-25} isInHorizontalSection={isInHorizontalSection}>
        CREATIVE
      </FloatingText>
      <FloatingText size={14} top={35} left={98} rotation={25} isInHorizontalSection={isInHorizontalSection}>
        VISION
      </FloatingText>
    </>
  );
};

export default DecorativeElements;
