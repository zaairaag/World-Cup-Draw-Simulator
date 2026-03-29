import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import type { DrawState, Team } from '../../../types';
import { DrawContext } from '../context/DrawContextValue';
import { useDrawFlow } from '../hooks/useDrawFlow';
import { localTeamRepository } from '../../teams/repositories/localTeamRepository';

const catalogResult = localTeamRepository.loadCatalog();

if (!catalogResult.ok) {
  throw new Error(catalogResult.error);
}

const selectedTeams = catalogResult.data.slice(0, 4);

if (selectedTeams.length < 4) {
  throw new Error('Expected at least four teams in the catalog.');
}

const baseState: DrawState = {
  settings: {
    numberOfGroups: 2,
    teamsPerGroup: 2,
    confederationPolicy: 'none'
  },
  result: null,
  status: 'configured',
  lastError: null,
  undoResult: null
};

function createWrapper(state: DrawState, dispatch = vi.fn()) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <DrawContext.Provider value={{ state, dispatch }}>{children}</DrawContext.Provider>;
  };
}

describe('useDrawFlow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('clears a pending timeout before resetting the draw session', () => {
    const dispatch = vi.fn();
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const { result } = renderHook(() => useDrawFlow(selectedTeams), {
      wrapper: createWrapper(baseState, dispatch)
    });

    act(() => {
      result.current.runDraw();
    });

    dispatch.mockClear();

    act(() => {
      result.current.resetDrawSession();
    });

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'RESET' });
  });

  it('clears a pending timeout before restoring saved draw state', () => {
    const dispatch = vi.fn();
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    const restoredState: DrawState = {
      ...baseState,
      status: 'drawn'
    };
    const { result } = renderHook(() => useDrawFlow(selectedTeams), {
      wrapper: createWrapper(baseState, dispatch)
    });

    act(() => {
      result.current.runDraw();
    });

    dispatch.mockClear();

    act(() => {
      result.current.restoreDrawState(restoredState);
    });

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESTORE_STATE',
      payload: restoredState
    });
  });

  it('skips the next selection reset immediately after restoring draw state', () => {
    const dispatch = vi.fn();
    const alternativeTeams: Team[] = catalogResult.data.slice(4, 8);
    const { result, rerender } = renderHook(({ teams }) => useDrawFlow(teams), {
      initialProps: {
        teams: selectedTeams
      },
      wrapper: createWrapper(
        {
          ...baseState,
          status: 'drawn'
        },
        dispatch
      )
    });

    act(() => {
      result.current.restoreDrawState({
        ...baseState,
        status: 'drawn'
      });
    });

    dispatch.mockClear();

    rerender({
      teams: alternativeTeams
    });

    expect(dispatch).not.toHaveBeenCalled();
  });
});
