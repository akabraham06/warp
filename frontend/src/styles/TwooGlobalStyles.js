import { createGlobalStyle } from 'styled-components';

export const TwooGlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @import 'locomotive-scroll/dist/locomotive-scroll.css';

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    overflow-x: hidden;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  /* Custom scrollbar - minimal */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.textSecondary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.text};
  }

  /* Selection */
  ::selection {
    background: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.background};
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid ${props => props.theme.colors.accent};
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    border: none;
    outline: none;
  }

  /* Link reset */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* List reset */
  ul, ol {
    list-style: none;
  }

  /* Image reset */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Twoo-specific animations */
  @keyframes fadein {
    0% { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeout {
    0% { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes fadein-slideup {
    0% { 
      opacity: 0; 
      transform: translateY(400px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  /* Typography classes */
  .h1 {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.typography.h1.fontSize};
    line-height: ${props => props.theme.typography.h1.lineHeight};
    letter-spacing: ${props => props.theme.typography.h1.letterSpacing};
    font-weight: ${props => props.theme.typography.h1.fontWeight};
  }

  .h2 {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.typography.h2.fontSize};
    line-height: ${props => props.theme.typography.h2.lineHeight};
    letter-spacing: ${props => props.theme.typography.h2.letterSpacing};
    font-weight: ${props => props.theme.typography.h2.fontWeight};
  }

  .h3 {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.typography.h3.fontSize};
    line-height: ${props => props.theme.typography.h3.lineHeight};
    letter-spacing: ${props => props.theme.typography.h3.letterSpacing};
    font-weight: ${props => props.theme.typography.h3.fontWeight};
  }

  .p {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.typography.body.fontSize};
    line-height: ${props => props.theme.typography.body.lineHeight};
    letter-spacing: ${props => props.theme.typography.body.letterSpacing};
    font-weight: ${props => props.theme.typography.body.fontWeight};
  }

  .p-big {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.typography.bodyBig.fontSize};
    line-height: ${props => props.theme.typography.bodyBig.lineHeight};
    letter-spacing: ${props => props.theme.typography.bodyBig.letterSpacing};
    font-weight: ${props => props.theme.typography.bodyBig.fontWeight};
  }

  /* Color classes */
  .black { color: ${props => props.theme.colors.text}; }
  .white { color: ${props => props.theme.colors.secondary}; }
  .dark-gray { color: ${props => props.theme.colors.textSecondary}; }
  .light-gray { color: ${props => props.theme.colors.textMuted}; }

  /* Background classes */
  .bg-black { background-color: ${props => props.theme.colors.text}; }
  .bg-white { background-color: ${props => props.theme.colors.background}; }
  .bg-gray { background-color: ${props => props.theme.colors.surface}; }

  /* Container */
  .container {
    max-width: ${props => props.theme.layout.maxWidth};
    margin: 0 auto;
    padding: 0 ${props => props.theme.layout.containerPadding};
  }

  /* Utility classes */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  /* Underline animation for links */
  .underline {
    background-color: currentColor;
    bottom: -2px;
    height: 1px;
    left: 0;
    position: absolute;
    width: 0;
    transition: ${props => props.theme.animations.underline};
  }

  a:hover .underline {
    width: 100%;
  }

  /* Responsive utilities */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .container {
      padding: 0 ${props => props.theme.spacing.lg};
    }
    
    .h1 {
      font-size: 48px;
      line-height: 44px;
      letter-spacing: -2px;
    }
    
    .h2 {
      font-size: 36px;
      line-height: 36px;
    }
  }

  /* Locomotive Scroll Styles */
  html.has-scroll-smooth {
    overflow: hidden;
  }

  html.has-scroll-dragging {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .has-scroll-smooth body {
    overflow: hidden;
  }

  .has-scroll-smooth [data-scroll-container] {
    min-height: 100vh;
  }

  [data-scroll-direction="horizontal"] [data-scroll-container] {
    height: 100vh;
    display: inline-block;
    white-space: nowrap;
  }

  [data-scroll-direction="horizontal"] [data-scroll-section] {
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    height: 100%;
  }

  .c-scrollbar {
    position: absolute;
    right: 0;
    top: 0;
    width: 11px;
    height: 100%;
    transform-origin: center right;
    transition: transform 0.3s, opacity 0.3s;
    opacity: 0;
  }

  .c-scrollbar:hover {
    transform: scaleX(1.45);
  }

  .c-scrollbar.c-scrollbar_show {
    opacity: 1;
  }

  .c-scrollbar_thumb {
    position: absolute;
    top: 0;
    right: 0;
    background-color: black;
    opacity: 0.5;
    width: 7px;
    border-radius: 10px;
    margin: 2px;
    cursor: -webkit-grab;
    cursor: grab;
  }

  .has-scroll-dragging .c-scrollbar_thumb {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  /* Reduced motion fallback */
  @media (prefers-reduced-motion: reduce) {
    html.has-scroll-smooth {
      overflow: auto;
    }
    
    html.has-scroll-smooth body {
      overflow: auto;
    }
    
    [data-scroll-container] {
      min-height: auto !important;
    }
    
    [data-scroll-direction="horizontal"] [data-scroll-container] {
      height: auto !important;
      display: block !important;
      white-space: normal !important;
    }
    
    [data-scroll-direction="horizontal"] [data-scroll-section] {
      display: block !important;
      vertical-align: top !important;
      white-space: normal !important;
      height: auto !important;
    }
  }
`;
