export const theme = {
  colors: {
    bg: '#080811',
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHover: 'rgba(255, 255, 255, 0.07)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderStrong: 'rgba(255, 255, 255, 0.14)',
    accent: '#7c3aed',
    accentLight: '#a78bfa',
    accentGlow: 'rgba(124, 58, 237, 0.2)',
    text: '#f1f5f9',
    textMuted: '#64748b',
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.08)',
    successBorder: 'rgba(16, 185, 129, 0.25)',
    logText: '#86efac',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
} as const

export type AppTheme = typeof theme
