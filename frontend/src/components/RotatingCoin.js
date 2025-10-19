import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Coin({ scrollProgress, isInHorizontalSection }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on scroll progress
      meshRef.current.rotation.y = scrollProgress * Math.PI * 4; // 2 full rotations
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Create coin geometry - a cylinder with rounded edges
  const coinGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
    return geometry;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Main coin body */}
      <mesh geometry={coinGeometry}>
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Coin edge/rim */}
      <mesh geometry={coinGeometry}>
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.9}
          roughness={0.1}
        />
        <mesh position={[0, 0, 0.15]} scale={[1.05, 1.05, 0.1]} />
        <mesh position={[0, 0, -0.15]} scale={[1.05, 1.05, 0.1]} />
      </mesh>
      
      {/* Front face design */}
      <mesh position={[0, 0, 0.16]}>
        <circleGeometry args={[1.4, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Back face design */}
      <mesh position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Center symbol/logo */}
      <mesh position={[0, 0, 0.17]}>
        <circleGeometry args={[0.3, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Floating particles around the coin */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 2.5,
            Math.sin((i / 8) * Math.PI * 2) * 2.5,
            (Math.random() - 0.5) * 0.5
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

const RotatingCoin = ({ scrollProgress = 0, isInHorizontalSection = true }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
        <Coin scrollProgress={scrollProgress} isInHorizontalSection={isInHorizontalSection} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default RotatingCoin;
