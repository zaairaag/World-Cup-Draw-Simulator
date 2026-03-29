import { useEffect, useMemo, useRef } from 'react';

import type { DrawSettings, DrawState, SwapPayload, Team } from '../../../types';
import { DRAW_DEFAULTS } from '../../../constants';
import { useDrawContext } from '../context/useDrawContext';
import { drawEngine } from '../domain/drawEngine';
import { drawValidator } from '../domain/drawValidator';

const DRAW_DELAY_IN_MS = 300;

export function useDrawFlow(selectedTeams: Team[]) {
  const { state, dispatch } = useDrawContext();
  const timeoutRef = useRef<number | null>(null);
  const skipNextSelectionResetRef = useRef(false);
  const selectedIdsKey = selectedTeams.map((team) => team.id).join('|');
  const previousSelectedIdsKeyRef = useRef(selectedIdsKey);

  const validationResult = useMemo(
    () => drawValidator(selectedTeams, state.settings),
    [selectedTeams, state.settings]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previousSelectedIdsKeyRef.current === selectedIdsKey) {
      return;
    }

    previousSelectedIdsKeyRef.current = selectedIdsKey;

    if (skipNextSelectionResetRef.current) {
      skipNextSelectionResetRef.current = false;
      return;
    }

    if (state.status === 'drawn' || state.status === 'loading') {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      dispatch({ type: 'RESET' });
      return;
    }

    if (state.lastError !== null) {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  }, [dispatch, selectedIdsKey, state.lastError, state.status]);

  function handleSettingsChange(patch: Partial<DrawSettings>) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    dispatch({ type: 'UPDATE_SETTINGS', payload: patch });
  }

  function runDraw() {
    if (!validationResult.ok) {
      return;
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    dispatch({ type: 'SET_LOADING' });

    const participantsSnapshot = [...validationResult.data.participants];
    const settingsSnapshot = { ...validationResult.data.settings };

    timeoutRef.current = window.setTimeout(() => {
      const result = drawEngine(participantsSnapshot, settingsSnapshot);

      if (result.ok) {
        dispatch({ type: 'SET_RESULT', payload: result.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      }

      timeoutRef.current = null;
    }, DRAW_DELAY_IN_MS);
  }

  function swapTeams(payload: SwapPayload) {
    dispatch({ type: 'SWAP_TEAMS', payload });
  }

  function undoLastSwap() {
    dispatch({ type: 'UNDO_LAST_SWAP' });
  }

  function clearError() {
    dispatch({ type: 'CLEAR_ERROR' });
  }

  function resetDrawSession() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    dispatch({ type: 'RESET' });
  }

  function restoreDrawState(nextState: DrawState) {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    skipNextSelectionResetRef.current = true;
    dispatch({ type: 'RESTORE_STATE', payload: nextState });
  }

  return {
    settings: state.settings,
    status: state.status,
    result: state.result,
    lastError: state.lastError,
    canUndoSwap: state.undoResult !== null,
    requiredTeamCount: state.settings.numberOfGroups * state.settings.teamsPerGroup,
    validationMessage: validationResult.ok ? null : validationResult.error,
    canRunDraw: validationResult.ok && state.status !== 'loading',
    handleSettingsChange,
    runDraw,
    swapTeams,
    undoLastSwap,
    clearError,
    resetDrawSession,
    restoreDrawState,
    defaults: DRAW_DEFAULTS
  };
}
