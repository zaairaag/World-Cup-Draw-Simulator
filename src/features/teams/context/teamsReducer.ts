import type { TeamAction, TeamState } from '../../../types';

export const initialTeamsState: TeamState = {
  catalog: [],
  selectedIds: []
};

export function teamsReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case 'LOAD_CATALOG':
      return {
        ...state,
        catalog: action.payload
      };
    case 'SELECT_TEAM':
      if (state.selectedIds.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        selectedIds: [...state.selectedIds, action.payload]
      };
    case 'DESELECT_TEAM':
      return {
        ...state,
        selectedIds: state.selectedIds.filter((id) => id !== action.payload)
      };
    case 'FILL_SELECTION':
      return {
        ...state,
        selectedIds: action.payload
      };
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedIds: []
      };
    case 'RESTORE_SELECTION':
      return {
        ...state,
        selectedIds: action.payload
      };
    default:
      return state;
  }
}
