export const twooTheme = {
  colors: {
    // Base Twoo colors with subtle space accents
    primary: '#000000', // Pure black
    secondary: '#ffffff', // Pure white
    background: '#ffffff', // White background
    surface: '#f4f4f4', // Light gray
    text: '#000000', // Black text
    textSecondary: '#767676', // Medium gray
    textMuted: '#a0a0a0', // Light gray
    accent: '#4facfe', // Subtle space blue accent
    accentSecondary: '#00f2fe', // Subtle space cyan
    border: '#e8e8e8', // Light border
    borderLight: '#f0f0f0', // Very light border
    
    // Space-themed accents (very subtle)
    spaceAccent: 'rgba(79, 172, 254, 0.05)', // Very subtle blue tint
    spaceAccentSecondary: 'rgba(0, 242, 254, 0.03)', // Very subtle cyan tint
    
    // Gradients (minimal, mostly solid colors)
    gradient: {
      subtle: 'linear-gradient(135deg, rgba(79,172,254,0.02) 0%, rgba(0,242,254,0.01) 100%)',
      space: 'linear-gradient(135deg, rgba(79,172,254,0.03) 0%, rgba(0,242,254,0.02) 100%)',
    }
  },
  
  fonts: {
    primary: '"Untitled", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: '"Untitled", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    }
  },
  
  // Typography scale matching Twoo
  typography: {
    h1: {
      fontSize: 'clamp(48px, 8vw, 72px)',
      lineHeight: 'clamp(44px, 7vw, 68px)',
      letterSpacing: '-2px',
      fontWeight: 700,
    },
    h2: {
      fontSize: 'clamp(28px, 4.5vw, 48px)',
      lineHeight: 'clamp(28px, 4.5vw, 48px)',
      letterSpacing: '-2px',
      fontWeight: 600,
    },
    h3: {
      fontSize: 'clamp(20px, 3vw, 24px)',
      lineHeight: 'clamp(24px, 3.5vw, 30px)',
      letterSpacing: '-1px',
      fontWeight: 600,
    },
    h4: {
      fontSize: 'clamp(18px, 2.5vw, 20px)',
      lineHeight: 'clamp(22px, 3vw, 24px)',
      letterSpacing: '-0.5px',
      fontWeight: 600,
    },
    body: {
      fontSize: 'clamp(14px, 2vw, 16px)',
      lineHeight: 'clamp(18px, 2.5vw, 20px)',
      letterSpacing: '-0.5px',
      fontWeight: 400,
    },
    bodyBig: {
      fontSize: 'clamp(16px, 2.5vw, 20px)',
      lineHeight: 'clamp(20px, 3vw, 24px)',
      letterSpacing: '-1px',
      fontWeight: 400,
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
    section: 'clamp(64px, 12vw, 160px)', // Section padding
    gutter: 'clamp(16px, 6vw, 80px)', // Side gutters
  },
  
  layout: {
    maxWidth: '1200px', // Max content width
    containerPadding: 'clamp(16px, 6vw, 80px)',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
  },
  
  shadows: {
    none: 'none',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  },
  
  transitions: {
    fast: '0.15s ease-out',
    normal: '0.25s ease-out',
    slow: '0.4s ease-out',
  },
  
  // Twoo-specific animations
  animations: {
    fadeIn: 'fadein 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
    fadeInSlideUp: 'fadein-slideup 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
    underline: '0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  }
};
