export const theme = {
  colors: {
    primary: '#ffffff',
    secondary: '#f8f8f8',
    background: '#000000',
    surface: '#111111',
    surfaceLight: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textMuted: '#888888',
    accent: '#ffffff',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    gradient: {
      primary: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
      secondary: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      dark: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
      space: 'linear-gradient(135deg, #000000 0%, #111111 50%, #1a1a1a 100%)',
      subtle: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      hero: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
    }
  },
  fonts: {
    primary: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(255, 255, 255, 0.1)',
    glowStrong: '0 0 30px rgba(255, 255, 255, 0.2)',
    subtle: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
    wide: '1400px',
  },
  transitions: {
    fast: '0.15s ease-out',
    normal: '0.25s ease-out',
    slow: '0.4s ease-out',
    spring: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};