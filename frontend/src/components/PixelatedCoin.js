import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function PixelatedCoin({ scrollProgress, isInHorizontalSection }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on scroll progress - coin moves left as you scroll right
      meshRef.current.rotation.y = scrollProgress * Math.PI * 4; // 2 full rotations
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Move coin left as scroll progresses (negative X movement)
      meshRef.current.position.x = -scrollProgress * 2;
    }
  });

  // Create coin geometry - a cylinder with low segments for pixelated effect
  const coinGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(18, 18, 0.8, 32); // Much bigger coin with more segments
    return geometry;
  }, []);

  // Create "1" geometry
  const numberGeometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(3, 12, 0.05); // Much larger, very thin number
    return geometry;
  }, []);

  return (
    <group ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Main coin body - fully white */}
      <mesh geometry={coinGeometry}>
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Side ridges for coin-like appearance */}
      {[...Array(32)].map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * 18.1;
        const y = Math.sin(angle) * 18.1;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.1, 0.1, 0.8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        );
      })}
      
      {/* "1" on front face - white, very thin */}
      <mesh position={[0, 0, 0.42]}>
        <primitive object={numberGeometry} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* "1" on back face - white, very thin */}
      <mesh position={[0, 0, -0.42]} rotation={[0, Math.PI, 0]}>
        <primitive object={numberGeometry} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

const PixelatedCoinComponent = ({ scrollProgress = 0, isInHorizontalSection = true }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '2000px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'visible',
      position: 'relative',
      zIndex: 10
    }}>
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 40 }}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          zIndex: 10
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#ffffff" />
        <PixelatedCoin scrollProgress={scrollProgress} isInHorizontalSection={isInHorizontalSection} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default PixelatedCoinComponent;
