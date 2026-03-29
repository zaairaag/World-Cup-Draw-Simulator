import { describe, expect, it } from 'vitest';

import type { DrawResult } from '../../../types';
import { summarizeDrawResult } from './summarizeDrawResult';

describe('summarizeDrawResult', () => {
  it('derives factual metrics from a draw result', () => {
    const result: DrawResult = {
      seed: 12345,
      timestamp: 1700000000000,
      settings: {
        numberOfGroups: 2,
        teamsPerGroup: 2,
        confederationPolicy: 'fifa-like'
      },
      groups: [
        {
          id: 'group-a',
          teams: [
            { id: 'brazil', name: 'Brazil', code: 'BRA', confederation: 'CONMEBOL' },
            { id: 'spain', name: 'Spain', code: 'ESP', confederation: 'UEFA' }
          ]
        },
        {
          id: 'group-b',
          teams: [
            { id: 'germany', name: 'Germany', code: 'GER', confederation: 'UEFA' },
            { id: 'japan', name: 'Japan', code: 'JPN', confederation: 'AFC' }
          ]
        }
      ]
    };

    expect(summarizeDrawResult(result)).toEqual({
      totalGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'fifa-like',
      confederationCounts: {
        AFC: 1,
        CONMEBOL: 1,
        UEFA: 2
      },
      uefaDoubleGroupCount: 0,
      mostDiverseGroupIds: ['group-a', 'group-b']
    });
  });
});
