import { useMemo } from 'react';

import type { Team } from '../../../types';
import { useTeamsContext } from '../context/useTeamsContext';

function isTeam(team: Team | undefined): team is Team {
  return team !== undefined;
}

export function useTeamSelection() {
  const { state, dispatch } = useTeamsContext();

  const selectedTeams = useMemo(
    () =>
      state.selectedIds
        .map((teamId) => state.catalog.find((team) => team.id === teamId))
        .filter(isTeam),
    [state.catalog, state.selectedIds]
  );

  function selectTeam(teamId: string) {
    dispatch({ type: 'SELECT_TEAM', payload: teamId });
  }

  function deselectTeam(teamId: string) {
    dispatch({ type: 'DESELECT_TEAM', payload: teamId });
  }

  function clearSelection() {
    dispatch({ type: 'CLEAR_SELECTION' });
  }

  function restoreSelection(selectedTeamIds: string[]) {
    dispatch({ type: 'RESTORE_SELECTION', payload: selectedTeamIds });
  }

  function fillSelection(targetCount: number) {
    if (state.selectedIds.length >= targetCount) {
      return;
    }

    const remainingIds = state.catalog
      .map((team) => team.id)
      .filter((teamId) => !state.selectedIds.includes(teamId));

    dispatch({
      type: 'FILL_SELECTION',
      payload: [
        ...state.selectedIds,
        ...remainingIds.slice(0, targetCount - state.selectedIds.length)
      ]
    });
  }

  return {
    catalog: state.catalog,
    selectedIds: state.selectedIds,
    selectedTeams,
    selectTeam,
    deselectTeam,
    fillSelection,
    clearSelection,
    restoreSelection
  };
}
