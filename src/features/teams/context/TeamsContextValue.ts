import type { Dispatch } from 'react';
import { createContext } from 'react';

import type { TeamAction, TeamState } from '../../../types';

export interface TeamsContextValue {
  state: TeamState;
  dispatch: Dispatch<TeamAction>;
}

export const TeamsContext = createContext<TeamsContextValue | null>(null);
