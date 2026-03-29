export const appTheme = {
  colors: {
    background: '#f3f3f3',
    surface: '#ffffff',
    surfaceAlt: '#f6f6f6',
    surfaceMuted: '#ececec',
    text: '#1a1c1c',
    textMuted: '#2e3830',
    secondary: '#595959',
    muted: '#4a5249',
    accent: '#07aa47',
    accentStrong: '#069039',
    accentDark: '#05712d',
    accentSoft: 'rgba(7, 170, 71, 0.1)',
    support: '#0058bd',
    supportSoft: 'rgba(0, 88, 189, 0.1)',
    line: 'rgba(26, 28, 28, 0.12)',
    focus: '#0058bd'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  radii: {
    sm: '8px',
    md: '16px',
    lg: '32px',
    xl: '48px'
  },
  typography: {
    body: '"Inter", "Helvetica Neue", Arial, sans-serif',
    heading: '"Inter", "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Cascadia Code", monospace'
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  shadows: {
    soft: '0 12px 28px rgba(0, 0, 0, 0.08)',
    panel: '0 24px 72px rgba(0, 0, 0, 0.12)'
  }
} as const;

export type AppTheme = typeof appTheme;
