export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceMuted: string;
  surfaceGlass: string;
  text: string;
  textMuted: string;
  secondary: string;
  muted: string;
  accent: string;
  accentStrong: string;
  accentDark: string;
  accentSoft: string;
  support: string;
  supportSoft: string;
  line: string;
  focus: string;
  headerText: string;
  overlay: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  dangerBg: string;
  dangerBorder: string;
  dangerText: string;
}

const sharedTheme = {
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
  motion: {
    fast: '160ms',
    base: '320ms',
    slow: '560ms',
    staggerStep: 90,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  }
} as const;

const lightColors = {
  background: '#f3f3f3',
  surface: '#ffffff',
  surfaceAlt: '#f6f6f6',
  surfaceMuted: '#ececec',
  surfaceGlass: 'rgba(255, 255, 255, 0.9)',
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
  focus: '#0058bd',
  headerText: '#ffffff',
  overlay: 'rgba(10, 18, 16, 0.58)',
  warningBg: 'rgba(255, 143, 58, 0.14)',
  warningBorder: 'rgba(255, 143, 58, 0.32)',
  warningText: '#8a4b00',
  dangerBg: '#fef2f2',
  dangerBorder: '#b91c1c',
  dangerText: '#b91c1c'
} as const satisfies ThemeColors;

const darkColors = {
  background: '#0d1213',
  surface: '#131a1b',
  surfaceAlt: '#182123',
  surfaceMuted: '#1f292b',
  surfaceGlass: 'rgba(19, 26, 27, 0.9)',
  text: '#f2f7f4',
  textMuted: '#cad7d1',
  secondary: '#a4b5ad',
  muted: '#7e9188',
  accent: '#0ab75a',
  accentStrong: '#078c45',
  accentDark: '#056b33',
  accentSoft: 'rgba(10, 183, 90, 0.18)',
  support: '#6eb1ff',
  supportSoft: 'rgba(110, 177, 255, 0.16)',
  line: 'rgba(226, 235, 230, 0.12)',
  focus: '#8cc0ff',
  headerText: '#ffffff',
  overlay: 'rgba(2, 6, 7, 0.78)',
  warningBg: 'rgba(255, 173, 90, 0.18)',
  warningBorder: 'rgba(255, 173, 90, 0.34)',
  warningText: '#ffd2a2',
  dangerBg: '#3a171b',
  dangerBorder: '#ff7d86',
  dangerText: '#ffd5d9'
} as const satisfies ThemeColors;

function createTheme(
  mode: ThemeMode,
  colors: ThemeColors,
  shadows: { soft: string; panel: string }
) {
  return {
    ...sharedTheme,
    meta: {
      mode,
      colorScheme: mode
    },
    colors,
    shadows
  } as const;
}

export const lightTheme = createTheme('light', lightColors, {
  soft: '0 12px 28px rgba(0, 0, 0, 0.08)',
  panel: '0 24px 72px rgba(0, 0, 0, 0.12)'
});

export const darkTheme = createTheme('dark', darkColors, {
  soft: '0 18px 42px rgba(0, 0, 0, 0.32)',
  panel: '0 30px 80px rgba(0, 0, 0, 0.42)'
});

export const appThemes = {
  light: lightTheme,
  dark: darkTheme
} as const;

export const appTheme = lightTheme;

export type AppTheme = (typeof appThemes)[ThemeMode];
