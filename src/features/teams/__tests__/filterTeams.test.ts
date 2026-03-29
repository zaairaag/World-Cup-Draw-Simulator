import { describe, expect, it } from 'vitest';

import { filterTeams } from '../utils/filterTeams';
import { normalizeSearch } from '../utils/normalizeSearch';
import { localTeamRepository } from '../repositories/localTeamRepository';

describe('normalizeSearch', () => {
  it('normalizes case and accents', () => {
    expect(normalizeSearch('MéXíCo')).toBe('mexico');
  });
});

describe('filterTeams', () => {
  it('matches by name or code and excludes selected teams', () => {
    const result = localTeamRepository.loadCatalog();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(filterTeams(result.data, 'bra', [])).toEqual([
      expect.objectContaining({ code: 'BRA', name: 'Brazil' })
    ]);

    expect(filterTeams(result.data, 'mex', ['MEX'])).toEqual([]);
  });

  it('filters by confederation and search query together', () => {
    const result = localTeamRepository.loadCatalog();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(
      filterTeams(result.data, 'ca', ['CAN'], { mode: 'UEFA' }).map((team) => team.code)
    ).toEqual([]);
  });

  it('returns the currently selected teams when the selected filter is active', () => {
    const result = localTeamRepository.loadCatalog();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(
      filterTeams(result.data, '', ['CAN', 'ECU'], { mode: 'selected' })
        .map((team) => team.code)
        .sort()
    ).toEqual(['CAN', 'ECU']);
  });
});
