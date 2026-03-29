import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import { DrawProvider } from '../features/draw/context/DrawContext';
import { TeamsProvider } from '../features/teams/context/TeamsContext';
import { GlobalStyles } from '../theme/globalStyles';
import { appTheme } from '../theme/theme';

import { restoreAppState } from './persistence/restoreAppState';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const restoredState = useMemo(() => restoreAppState(), []);

  return (
    <ThemeProvider theme={appTheme}>
      <GlobalStyles />
      <TeamsProvider initialState={restoredState.teamsState}>
        <DrawProvider initialState={restoredState.drawState}>{children}</DrawProvider>
      </TeamsProvider>
    </ThemeProvider>
  );
}
