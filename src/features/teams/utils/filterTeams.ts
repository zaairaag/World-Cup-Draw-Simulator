import type { Confederation, Team } from '../../../types';

import { normalizeSearch } from './normalizeSearch';

export type TeamQuickFilter = 'all' | 'selected' | Confederation;

interface FilterTeamsOptions {
  mode: TeamQuickFilter;
}

export function filterTeams(
  teams: Team[],
  query: string,
  selectedIds: string[],
  options: FilterTeamsOptions = { mode: 'all' }
): Team[] {
  const normalizedQuery = normalizeSearch(query);

  return teams.filter((team) => {
    const isSelected = selectedIds.includes(team.id);

    if (options.mode === 'selected' && !isSelected) {
      return false;
    }

    if (
      options.mode !== 'all' &&
      options.mode !== 'selected' &&
      team.confederation !== options.mode
    ) {
      return false;
    }

    if (options.mode !== 'selected' && isSelected) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const normalizedName = normalizeSearch(team.name);
    const normalizedCode = normalizeSearch(team.code);

    return normalizedName.includes(normalizedQuery) || normalizedCode.includes(normalizedQuery);
  });
}
