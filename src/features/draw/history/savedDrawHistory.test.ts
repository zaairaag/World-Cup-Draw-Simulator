import { describe, expect, it } from 'vitest';

import type { DrawState } from '../../../types';
import { createSavedDrawEntry, sanitizeSavedDrawHistory } from './savedDrawHistory';

describe('saved draw history', () => {
  it('creates a saved entry with a provided label and preserves summary metadata', () => {
    const drawState: DrawState = {
      settings: { numberOfGroups: 2, teamsPerGroup: 2, confederationPolicy: 'none' },
      result: {
        groups: [
          { id: 'group-a', teams: [] },
          { id: 'group-b', teams: [] }
        ],
        settings: { numberOfGroups: 2, teamsPerGroup: 2, confederationPolicy: 'none' },
        seed: 12345,
        timestamp: 1700000000000
      },
      status: 'drawn',
      lastError: null,
      undoResult: null
    };

    const entry = createSavedDrawEntry({
      label: 'Cenário FIFA-like',
      selectedTeamIds: ['canada', 'ecuador', 'senegal', 'netherlands'],
      drawState
    });

    expect(entry.label).toBe('Cenário FIFA-like');
    expect(entry.selectedTeamIds).toEqual(['canada', 'ecuador', 'senegal', 'netherlands']);
    expect(entry.drawState.result?.groups).toHaveLength(2);
    expect(entry.summary).toContain('2 grupos');
  });

  it('hydrates legacy entries without label using a readable fallback', () => {
    const sanitized = sanitizeSavedDrawHistory([
      {
        id: 'legacy-1',
        savedAt: 1700000000000,
        selectedTeamIds: [],
        drawState: { result: null },
        summary: '2 grupos · 2 por grupo'
      }
    ]);

    expect(sanitized[0]?.label).toMatch(/sorteio/i);
  });

  it('drops malformed history records during sanitization', () => {
    const sanitized = sanitizeSavedDrawHistory([
      {
        id: 'ok',
        savedAt: 1700000000000,
        selectedTeamIds: [],
        drawState: { result: null },
        label: 'Sorteio existente',
        summary: '2 grupos · 2 por grupo'
      },
      { broken: true }
    ]);

    expect(sanitized).toHaveLength(1);
    expect(sanitized[0]?.id).toBe('ok');
  });
});
