import { describe, expect, it } from 'vitest';

import type { Confederation, Group, Team } from '../../../types';
import type { DrawResult } from '../../../types';
import { DRAW_DEFAULTS } from '../../../constants';
import { drawReducer, initialDrawState } from '../context/drawReducer';

function createTeam(id: string, name: string, confederation: Confederation = 'AFC'): Team {
  return {
    id,
    name,
    code: id,
    confederation
  };
}

function createGroups(): Group[] {
  return [
    {
      id: 'group-a',
      teams: [createTeam('ECU', 'Ecuador'), createTeam('SEN', 'Senegal')]
    },
    {
      id: 'group-b',
      teams: [createTeam('NED', 'Netherlands'), createTeam('QAT', 'Qatar')]
    }
  ];
}

function createResult(overrides?: Partial<DrawResult>): DrawResult {
  return {
    groups: createGroups(),
    settings: {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    },
    timestamp: 1,
    ...overrides
  };
}

describe('drawReducer', () => {
  it('updates settings and keeps the slice configured', () => {
    const state = drawReducer(initialDrawState, {
      type: 'UPDATE_SETTINGS',
      payload: { numberOfGroups: 4 }
    });

    expect(state.settings).toEqual({
      ...DRAW_DEFAULTS,
      numberOfGroups: 4
    });
    expect(state.status).toBe('configured');
  });

  it('transitions through loading and drawn states', () => {
    const loadingState = drawReducer(initialDrawState, { type: 'SET_LOADING' });
    const resultState = drawReducer(loadingState, {
      type: 'SET_RESULT',
      payload: createResult()
    });

    expect(loadingState.status).toBe('loading');
    expect(resultState.status).toBe('drawn');
    expect(resultState.result?.settings).toEqual({
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });
  });

  it('invalidates a stale draw result without losing the current settings', () => {
    const drawnState = drawReducer(initialDrawState, {
      type: 'SET_RESULT',
      payload: createResult()
    });
    const resetState = drawReducer(drawnState, { type: 'RESET' });

    expect(resetState.result).toBeNull();
    expect(resetState.status).toBe('configured');
    expect(resetState.settings).toEqual(drawnState.settings);
  });

  it('invalidates a drawn result when the confederation policy changes', () => {
    const drawnState = drawReducer(initialDrawState, {
      type: 'SET_RESULT',
      payload: createResult()
    });

    const nextState = drawReducer(drawnState, {
      type: 'UPDATE_SETTINGS',
      payload: { confederationPolicy: 'fifa-like' }
    });

    expect(nextState.result).toBeNull();
    expect(nextState.status).toBe('configured');
    expect(nextState.settings.confederationPolicy).toBe('fifa-like');
  });

  it('swaps teams across groups and preserves group sizes', () => {
    const drawnState = drawReducer(initialDrawState, {
      type: 'SET_RESULT',
      payload: createResult()
    });

    const swappedState = drawReducer(drawnState, {
      type: 'SWAP_TEAMS',
      payload: {
        sourceGroupId: 'group-a',
        sourceTeamId: 'ECU',
        targetGroupId: 'group-b',
        targetTeamId: 'QAT'
      }
    });

    expect(swappedState.lastError).toBeNull();
    expect(swappedState.result?.groups[0]?.teams.map((team) => team.id)).toEqual(['QAT', 'SEN']);
    expect(swappedState.result?.groups[1]?.teams.map((team) => team.id)).toEqual(['NED', 'ECU']);
  });

  it('keeps state unchanged when the same team is submitted twice', () => {
    const drawnState = drawReducer(initialDrawState, {
      type: 'SET_RESULT',
      payload: createResult()
    });

    const nextState = drawReducer(drawnState, {
      type: 'SWAP_TEAMS',
      payload: {
        sourceGroupId: 'group-a',
        sourceTeamId: 'ECU',
        targetGroupId: 'group-a',
        targetTeamId: 'ECU'
      }
    });

    expect(nextState).toBe(drawnState);
  });

  it('surfaces an error when the swap tries to reuse the same group', () => {
    const drawnState = drawReducer(initialDrawState, {
      type: 'SET_RESULT',
      payload: createResult()
    });

    const nextState = drawReducer(drawnState, {
      type: 'SWAP_TEAMS',
      payload: {
        sourceGroupId: 'group-a',
        sourceTeamId: 'ECU',
        targetGroupId: 'group-a',
        targetTeamId: 'SEN'
      }
    });

    expect(nextState.result).toEqual(drawnState.result);
    expect(nextState.lastError).toBe('Escolha dois grupos diferentes para trocar equipes.');
  });

  it('stores an explicit draw error and leaves the slice configured', () => {
    const nextState = drawReducer(
      {
        ...initialDrawState,
        status: 'loading'
      },
      {
        type: 'SET_ERROR',
        payload: 'Não foi possível alocar Brazil sem violar a regra de confederação ativa.'
      }
    );

    expect(nextState.status).toBe('configured');
    expect(nextState.lastError).toBe(
      'Não foi possível alocar Brazil sem violar a regra de confederação ativa.'
    );
  });

  it('rejects swaps that would break the active confederation policy', () => {
    const state = drawReducer(initialDrawState, {
      type: 'SET_RESULT',
      payload: {
        groups: [
          {
            id: 'group-a',
            teams: [createTeam('ECU', 'Ecuador', 'CONMEBOL'), createTeam('GER', 'Germany', 'AFC')]
          },
          {
            id: 'group-b',
            teams: [createTeam('BRA', 'Brazil', 'CONMEBOL'), createTeam('QAT', 'Qatar', 'UEFA')]
          }
        ],
        settings: {
          numberOfGroups: 2,
          teamsPerGroup: 2,
          confederationPolicy: 'fifa-like'
        },
        timestamp: 1
      }
    });

    const nextState = drawReducer(state, {
      type: 'SWAP_TEAMS',
      payload: {
        sourceGroupId: 'group-a',
        sourceTeamId: 'GER',
        targetGroupId: 'group-b',
        targetTeamId: 'BRA'
      }
    });

    expect(nextState.result).toEqual(state.result);
    expect(nextState.lastError).toBe('A troca selecionada viola a regra de confederação ativa.');
  });

  it('stores the previous result after a successful swap and clears it after undo', () => {
    const previousResult: DrawResult = {
      groups: [
        {
          id: 'group-a',
          teams: [createTeam('CAN', 'Canada', 'CONCACAF'), createTeam('ECU', 'Ecuador')]
        },
        {
          id: 'group-b',
          teams: [createTeam('SEN', 'Senegal', 'CAF'), createTeam('NED', 'Netherlands', 'UEFA')]
        }
      ],
      settings: {
        numberOfGroups: 2,
        teamsPerGroup: 2,
        confederationPolicy: 'none'
      },
      timestamp: 1
    };

    const swappedState = drawReducer(
      {
        settings: previousResult.settings,
        result: previousResult,
        status: 'drawn',
        lastError: null,
        undoResult: null
      },
      {
        type: 'SWAP_TEAMS',
        payload: {
          sourceGroupId: 'group-a',
          sourceTeamId: 'CAN',
          targetGroupId: 'group-b',
          targetTeamId: 'SEN'
        }
      }
    );

    expect(swappedState.undoResult).toEqual(previousResult);

    const undoneState = drawReducer(swappedState, { type: 'UNDO_LAST_SWAP' });

    expect(undoneState.result).toEqual(previousResult);
    expect(undoneState.undoResult).toBeNull();
  });
});
