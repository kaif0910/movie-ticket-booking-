/**
 * Design Tokens for Movie Booking Web
 * Cinema / Ticketing Brand Aesthetic (AMC / BookMyShow / Vue inspired)
 */

export const DESIGN_TOKENS = {
  colors: {
    brand: {
      red: '#E50914',
      redHover: '#C10712',
      redGlow: 'rgba(229, 9, 20, 0.25)',
      amber: '#F59E0B',
      amberMuted: 'rgba(245, 158, 11, 0.15)',
    },
    neutral: {
      bg: '#0A0B10',          // Theater dark background
      card: '#13151F',        // Movie card / container background
      surface: '#1B1E2C',     // Elevated surface / dropdown / navigation bar
      border: '#292D40',      // Border dividers
      borderLight: '#3A3F58',
      textPrimary: '#F3F4F6', // Primary high-contrast text
      textMuted: '#9CA3AF',   // Secondary text
      textDim: '#6B7280',     // Subtle details / timestamps
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    }
  },
  typography: {
    fontDisplay: 'var(--font-bebas)',
    fontBody: 'var(--font-jakarta)',
  },
  spacing: {
    containerMaxWidth: '1280px',
    navHeight: '72px',
  },
  borders: {
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '12px',
    radiusFull: '9999px',
  }
} as const;
