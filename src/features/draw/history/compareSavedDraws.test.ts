import { describe, expect, it } from 'vitest';

import type { SavedDrawHistoryEntry } from './savedDrawHistory';
import { compareSavedDraws } from './compareSavedDraws';

function buildSavedDraw(id: string, groups: string[][]): SavedDrawHistoryEntry {
  return {
    id,
    savedAt: 1700000000000,
    label: `Sorteio ${id}`,
    summary: `${groups.length} grupos`,
    selectedTeamIds: groups.flat(),
    drawState: {
      settings: {
        numberOfGroups: groups.length,
        teamsPerGroup: groups[0]?.length ?? 0,
        confederationPolicy: 'none'
      },
      status: 'drawn',
      lastError: null,
      undoResult: null,
      result: {
        seed: 12345,
        timestamp: 1700000000000,
        settings: {
          numberOfGroups: groups.length,
          teamsPerGroup: groups[0]?.length ?? 0,
          confederationPolicy: 'none'
        },
        groups: groups.map((teamIds, index) => ({
          id: `group-${String.fromCharCode(97 + index)}`,
          teams: teamIds.map((teamId) => ({
            id: teamId,
            name: teamId,
            code: teamId.toUpperCase(),
            confederation: 'UEFA'
          }))
        }))
      }
    }
  };
}

describe('compareSavedDraws', () => {
  it('marks groups as changed when the compared composition differs', () => {
    const left = buildSavedDraw('left', [
      ['brazil', 'spain'],
      ['japan', 'morocco']
    ]);
    const right = buildSavedDraw('right', [
      ['brazil', 'japan'],
      ['spain', 'morocco']
    ]);

    expect(compareSavedDraws(left, right).groups).toEqual([
      expect.objectContaining({ groupId: 'group-a', changed: true }),
      expect.objectContaining({ groupId: 'group-b', changed: true })
    ]);
  });

  it('treats group identity as equal when the same teams are present', () => {
    const left = buildSavedDraw('left', [['brazil', 'spain']]);
    const right = buildSavedDraw('right', [['spain', 'brazil']]);

    expect(compareSavedDraws(left, right).groups[0]?.changed).toBe(false);
  });
});
