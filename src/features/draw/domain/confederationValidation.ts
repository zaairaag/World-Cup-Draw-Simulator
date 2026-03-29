import type { DrawSettings, Team } from '../../../types';
import type { Result } from '../../../types';

import { getConfederationLimit } from './confederationPolicy';

function buildConfederationDistributionError(
  confederation: Team['confederation'],
  count: number,
  numberOfGroups: number,
  limit: number
): string {
  return `Não é possível distribuir ${count} equipes da ${confederation} em ${numberOfGroups} grupos com limite de ${limit} por grupo.`;
}

export function validateConfederationDistribution(
  participants: Team[],
  settings: DrawSettings
): Result<true> {
  if (settings.confederationPolicy === 'none') {
    return { ok: true, data: true };
  }

  const counts = new Map<string, number>();

  for (const team of participants) {
    counts.set(team.confederation, (counts.get(team.confederation) ?? 0) + 1);
  }

  for (const [confederation, count] of counts.entries()) {
    const limit = getConfederationLimit(
      settings.confederationPolicy,
      confederation as Team['confederation']
    );
    const capacity = limit === null ? Number.POSITIVE_INFINITY : limit * settings.numberOfGroups;

    if (limit !== null && count > capacity) {
      return {
        ok: false,
        error: buildConfederationDistributionError(
          confederation as Team['confederation'],
          count,
          settings.numberOfGroups,
          limit
        )
      };
    }
  }

  return { ok: true, data: true };
}
