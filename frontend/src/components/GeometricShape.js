import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function GeometricMesh({ scrollProgress, isInHorizontalSection }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Rotate based on scroll progress
      meshRef.current.rotation.y = scrollProgress * Math.PI * 2;
      meshRef.current.rotation.x = scrollProgress * Math.PI * 0.5;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main geometric shape - octahedron */}
      <mesh>
        <octahedronGeometry args={[4, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe={true}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner solid shape */}
      <mesh>
        <octahedronGeometry args={[2.4, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Corner spheres */}
      {[
        [4, 0, 0], [-4, 0, 0], [0, 4, 0], [0, -4, 0], [0, 0, 4], [0, 0, -4]
      ].map((position, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Floating rings */}
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={i}
          position={[0, 0, 0]}
          rotation={[0, (i / 6) * Math.PI * 2, 0]}
        >
          <torusGeometry args={[5, 0.1, 8, 100]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

const GeometricShape = ({ scrollProgress = 0, isInHorizontalSection = true }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '800px' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#ffffff" />
        <GeometricMesh scrollProgress={scrollProgress} isInHorizontalSection={isInHorizontalSection} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default GeometricShape;
