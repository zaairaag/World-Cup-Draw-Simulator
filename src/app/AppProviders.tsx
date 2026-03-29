import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { DrawProvider } from '../features/draw/context/DrawContext';
import { TeamsProvider } from '../features/teams/context/TeamsContext';
import { ThemeModeProvider } from '../theme/themeMode';

import { restoreAppState } from './persistence/restoreAppState';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const restoredState = useMemo(() => restoreAppState(), []);

  return (
    <ThemeModeProvider>
      <TeamsProvider initialState={restoredState.teamsState}>
        <DrawProvider initialState={restoredState.drawState}>{children}</DrawProvider>
      </TeamsProvider>
    </ThemeModeProvider>
  );
}
