import type { ReactNode } from 'react';
import { useEffect, useMemo, useReducer } from 'react';

import type { TeamState } from '../../../types';
import { STORAGE_KEYS } from '../../../constants';
import { localStorageRepository } from '../../../repositories';
import { localTeamRepository } from '../repositories/localTeamRepository';

import { initialTeamsState, teamsReducer } from './teamsReducer';
import { TeamsContext } from './TeamsContextValue';

interface TeamsProviderProps {
  children: ReactNode;
  initialState?: TeamState;
}

function createInitialTeamsState(): TeamState {
  const result = localTeamRepository.loadCatalog();

  if (!result.ok) {
    return initialTeamsState;
  }

  return {
    ...initialTeamsState,
    catalog: result.data
  };
}

export function TeamsProvider({ children, initialState }: TeamsProviderProps) {
  const [state, dispatch] = useReducer(teamsReducer, initialState ?? createInitialTeamsState());

  useEffect(() => {
    localStorageRepository.save(STORAGE_KEYS.selectedTeams, state.selectedIds);
  }, [state.selectedIds]);

  const value = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}
