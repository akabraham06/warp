import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollAnimations = ({ children, animationType = 'fadeIn', delay = 0 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animation;

    switch (animationType) {
      case 'fadeIn':
        animation = gsap.fromTo(element, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
        break;

      case 'slideInLeft':
        animation = gsap.fromTo(element,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
        break;

      case 'slideInRight':
        animation = gsap.fromTo(element,
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
        break;

      case 'scaleIn':
        animation = gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: delay,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
        break;

      case 'rotateIn':
        animation = gsap.fromTo(element,
          { opacity: 0, rotation: -180, scale: 0.5 },
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 1.5,
            delay: delay,
            ease: "elastic.out(1, 0.3)",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
        break;

      default:
        animation = gsap.fromTo(element,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            delay: delay,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
    }

    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [animationType, delay]);

  return <div ref={elementRef}>{children}</div>;
};

export default ScrollAnimations;
