import { describe, expect, it } from 'vitest';

import type { DrawState } from '../types';
import { DRAW_DEFAULTS } from '../constants';
import { localTeamRepository } from '../features/teams/repositories/localTeamRepository';

import { createHydratedAppState } from './createHydratedAppState';

function loadCatalog() {
  const result = localTeamRepository.loadCatalog();

  if (!result.ok) {
    throw new Error('Expected catalog to load during hydration tests.');
  }

  return result.data;
}

function createPersistedDrawState(): DrawState {
  const catalog = loadCatalog();
  const canada = catalog.find((team) => team.id === 'CAN');
  const ecuador = catalog.find((team) => team.id === 'ECU');
  const senegal = catalog.find((team) => team.id === 'SEN');
  const netherlands = catalog.find((team) => team.id === 'NED');

  if (!canada || !ecuador || !senegal || !netherlands) {
    throw new Error('Expected base teams to exist in the local catalog.');
  }

  return {
    settings: {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    },
    status: 'drawn',
    lastError: 'ignore me',
    undoResult: null,
    result: {
      settings: {
        numberOfGroups: 2,
        teamsPerGroup: 2,
        confederationPolicy: 'none'
      },
      seed: 12345,
      timestamp: 123,
      groups: [
        {
          id: 'group-a',
          teams: [ecuador, senegal]
        },
        {
          id: 'group-b',
          teams: [netherlands, canada]
        }
      ]
    }
  };
}

describe('createHydratedAppState', () => {
  it('filters orphaned selected ids and keeps a coherent restored draw', () => {
    const catalog = loadCatalog();
    const hydratedState = createHydratedAppState(
      catalog,
      ['CAN', 'ECU', 'SEN', 'NED', 'MISSING'],
      createPersistedDrawState()
    );

    expect(hydratedState.teamsState.selectedIds).toEqual(['CAN', 'ECU', 'SEN', 'NED']);
    expect(hydratedState.drawState.status).toBe('drawn');
    expect(hydratedState.drawState.lastError).toBeNull();
    expect(hydratedState.drawState.result?.groups).toHaveLength(2);
  });

  it('hydrates legacy restored draws even when the persisted result has no seed', () => {
    const catalog = loadCatalog();
    const persistedState = createPersistedDrawState();
    const legacyDrawState = {
      ...persistedState,
      result: persistedState.result
        ? {
            groups: persistedState.result.groups,
            settings: persistedState.result.settings,
            timestamp: persistedState.result.timestamp
          }
        : null
    };

    const hydratedState = createHydratedAppState(
      catalog,
      ['CAN', 'ECU', 'SEN', 'NED'],
      legacyDrawState
    );

    expect(hydratedState.drawState.status).toBe('drawn');
    expect(hydratedState.drawState.result?.seed).toBe(123);
  });

  it('drops a stale restored result and keeps the saved settings', () => {
    const catalog = loadCatalog();
    const hydratedState = createHydratedAppState(
      catalog,
      ['CAN', 'ECU'],
      createPersistedDrawState()
    );

    expect(hydratedState.drawState.result).toBeNull();
    expect(hydratedState.drawState.status).toBe('configured');
    expect(hydratedState.drawState.settings).toEqual({
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });
  });

  it('falls back to defaults when the persisted draw state is invalid', () => {
    const catalog = loadCatalog();
    const hydratedState = createHydratedAppState(catalog, 'invalid', {
      settings: {
        numberOfGroups: 1,
        teamsPerGroup: 0
      }
    });

    expect(hydratedState.teamsState.selectedIds).toEqual([]);
    expect(hydratedState.drawState).toEqual({
      settings: DRAW_DEFAULTS,
      result: null,
      status: 'configured',
      lastError: null,
      undoResult: null
    });
  });
});
