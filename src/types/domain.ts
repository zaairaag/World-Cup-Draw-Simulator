export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export type QualificationType = 'host' | 'qualified';
export type ConfederationPolicy = 'none' | 'fifa-like';

export interface Team {
  id: string;
  name: string;
  code: string;
  confederation: Confederation;
  qualificationType?: QualificationType;
}

export interface TeamState {
  catalog: Team[];
  selectedIds: string[];
}

export type TeamAction =
  | { type: 'LOAD_CATALOG'; payload: Team[] }
  | { type: 'SELECT_TEAM'; payload: string }
  | { type: 'DESELECT_TEAM'; payload: string }
  | { type: 'FILL_SELECTION'; payload: string[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'RESTORE_SELECTION'; payload: string[] };

export interface DrawSettings {
  numberOfGroups: number;
  teamsPerGroup: number;
  confederationPolicy: ConfederationPolicy;
}

export interface Group {
  id: string;
  teams: Team[];
}

export interface DrawResult {
  groups: Group[];
  settings: DrawSettings;
  timestamp: number;
}

export type DrawStatus = 'idle' | 'configured' | 'loading' | 'drawn';
export type SimulatorPageState =
  | 'empty'
  | 'selecting'
  | 'ready'
  | 'drawing'
  | 'result'
  | 'swap_error';

export interface DrawState {
  settings: DrawSettings;
  result: DrawResult | null;
  status: DrawStatus;
  lastError: string | null;
  undoResult: DrawResult | null;
}

export interface SwapPayload {
  sourceGroupId: string;
  sourceTeamId: string;
  targetGroupId: string;
  targetTeamId: string;
}

export type DrawAction =
  | { type: 'UPDATE_SETTINGS'; payload: Partial<DrawSettings> }
  | { type: 'SET_RESULT'; payload: DrawResult }
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SWAP_TEAMS'; payload: SwapPayload }
  | { type: 'UNDO_LAST_SWAP' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' }
  | { type: 'RESTORE_STATE'; payload: DrawState };
