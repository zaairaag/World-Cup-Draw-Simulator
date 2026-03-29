import { createContext, useContext } from 'react';

import type { ThemeMode } from './theme';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (context === null) {
    throw new Error('useThemeMode must be used within ThemeModeProvider.');
  }

  return context;
}
