// UpStart theme — forest green + mint with gold accents
// Pulled directly from the brand icon palette.
export const colors = {
  // Backgrounds — deep forest green
  bg: '#04342C',           // primary background (matches icon background)
  bgElevated: '#0A4A3D',   // cards, sheets
  bgInput: '#0E5E4D',      // inputs, chips
  bgMuted: '#072E26',
  border: '#1A6E5B',
  borderLight: '#0E5446',

  // Text
  text: '#EAF6F0',         // off-white with green tint (matches icon "UP" text)
  textMuted: '#9CC8B8',    // muted mint
  textFaint: '#5E8A7C',
  textInverse: '#04342C',

  // Brand — mint primary
  primary: '#7FD1AE',          // mint (arrow / accent)
  primaryDark: '#4FA888',
  primarySoft: 'rgba(127,209,174,0.18)',

  // Accent — same mint family but slightly deeper (for invest / money / success)
  accent: '#5FC59A',
  accentDark: '#3FAA7C',
  accentSoft: 'rgba(95,197,154,0.18)',

  // Gold trim — for premium / borders / highlights (matches icon outlines)
  gold: '#D4A55B',
  goldSoft: 'rgba(212,165,91,0.18)',

  // Status
  success: '#5FC59A',
  warning: '#E6B85C',
  danger: '#E97072',
  info: '#7FD1AE',

  // Live / verified
  live: '#FF6B6B',
  liveSoft: 'rgba(255,107,107,0.16)',
  verified: '#5FC59A',

  // Tier colors (gamification) — still distinct but harmonize with brand
  tierBronze: '#CD7F32',
  tierSilver: '#C0D4CB',
  tierGold: '#D4A55B',
  tierPlatinum: '#A8E6D4',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(4,52,44,0.92)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text, lineHeight: 22 },
  bodyMuted: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  small: { fontSize: 13, color: colors.textMuted },
  tiny: { fontSize: 11, color: colors.textFaint, letterSpacing: 0.4 },
};
