import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

import { STORAGE_KEYS } from '../constants';

import { GlobalStyles } from './globalStyles';
import { ThemeModeContext } from './themeModeContext';
import { appThemes, type ThemeMode } from './theme';

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  let storedMode: string | null = null;

  try {
    storedMode = window.localStorage.getItem(STORAGE_KEYS.themeMode);
  } catch {
    storedMode = null;
  }

  if (isThemeMode(storedMode)) {
    return storedMode;
  }

  return 'light';
}

interface ThemeModeProviderProps {
  children: ReactNode;
}

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(getInitialThemeMode);
  const theme = appThemes[mode];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.themeMode = mode;
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEYS.themeMode, mode);
      } catch {
        void 0;
      }
    }
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
      }
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
