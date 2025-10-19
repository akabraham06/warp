import React, { useRef } from 'react';
import { Canvas, useFrame as useFrameThree } from '@react-three/fiber';

function RotatingCircle({ isVerticalSection }) {
  const meshRef = useRef();

  useFrameThree((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.5; // Rotate continuously on Z-axis
      if (isVerticalSection) {
        meshRef.current.rotation.x += delta * 0.3; // Add 3D rotation on X-axis when vertical
        meshRef.current.rotation.y += delta * 0.2; // Add 3D rotation on Y-axis when vertical
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[9.375, 0.2, 16, 100]} /> {/* 1.25x the original radius */}
      <meshStandardMaterial 
        color={isVerticalSection ? "#000000" : "#ffffff"} 
        metalness={0.1}
        roughness={0.2}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

const RotatingBackgroundCircle = ({ isVerticalSection }) => {
  return (
    <div style={{ 
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '625px', // 1.25x the original size
      height: '625px',
      zIndex: 10, // Higher z-index to ensure it's above other elements
      overflow: 'visible' // Allow overflow so entire ring is visible
    }}>
      <Canvas 
        camera={{ position: [0, 0, 18.75], fov: 60 }} // 1.25x the original camera distance
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RotatingCircle isVerticalSection={isVerticalSection} />
      </Canvas>
    </div>
  );
};

export default RotatingBackgroundCircle;
