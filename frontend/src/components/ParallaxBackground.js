import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

const ParallaxBackground = ({ scrollX = 0, scrollY = 0 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  // Create asterisk geometry
  const asteriskGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    
    // Create multiple asterisks
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      const size = Math.random() * 20 + 10;
      
      // Asterisk shape (5-pointed star)
      const centerIndex = vertices.length / 3;
      
      // Center point
      vertices.push(x, y, z);
      
      // 5 outer points
      for (let j = 0; j < 5; j++) {
        const angle = (j * Math.PI * 2) / 5;
        const outerX = x + Math.cos(angle) * size;
        const outerY = y + Math.sin(angle) * size;
        vertices.push(outerX, outerY, z);
        
        // Connect to center
        indices.push(centerIndex, centerIndex + j + 1);
      }
      
      // Connect outer points
      for (let j = 0; j < 5; j++) {
        indices.push(
          centerIndex + j + 1,
          centerIndex + ((j + 2) % 5) + 1
        );
      }
    }
    
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    return geometry;
  }, []);

  // Create line geometry for connecting elements
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Create flowing lines
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      
      // Create flowing line segments
      for (let j = 0; j < 10; j++) {
        vertices.push(
          x + j * 20,
          y + Math.sin(j * 0.5) * 30,
          z + Math.cos(j * 0.3) * 20
        );
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    return geometry;
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 500;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Materials
    const asteriskMaterial = new THREE.LineBasicMaterial({
      color: 0x4facfe,
      opacity: 0.3,
      transparent: true
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      opacity: 0.2,
      transparent: true
    });

    // Create meshes
    const asteriskMesh = new THREE.LineSegments(asteriskGeometry, asteriskMaterial);
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    
    scene.add(asteriskMesh);
    scene.add(lineMesh);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Parallax movement based on scroll
      asteriskMesh.rotation.x = scrollY * 0.001;
      asteriskMesh.rotation.y = scrollX * 0.001;
      asteriskMesh.position.x = scrollX * 0.1;
      asteriskMesh.position.y = scrollY * 0.1;

      lineMesh.rotation.z = scrollX * 0.0005;
      lineMesh.position.x = scrollX * 0.05;
      lineMesh.position.y = scrollY * 0.05;

      // Continuous rotation
      asteriskMesh.rotation.z += 0.002;
      lineMesh.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      asteriskGeometry.dispose();
      lineGeometry.dispose();
      asteriskMaterial.dispose();
      lineMaterial.dispose();
    };
  }, [asteriskGeometry, lineGeometry, scrollX, scrollY]);

  return <CanvasContainer ref={mountRef} />;
};

export default ParallaxBackground;
