import { useContext } from 'react';

import { TeamsContext, type TeamsContextValue } from './TeamsContextValue';

export function useTeamsContext(): TeamsContextValue {
  const context = useContext(TeamsContext);

  if (context === null) {
    throw new Error('useTeamsContext must be used within TeamsProvider.');
  }

  return context;
}
