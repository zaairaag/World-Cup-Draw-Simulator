import type { Confederation, ConfederationPolicy, Group, Team } from '../../../types';

export function getConfederationLimit(
  policy: ConfederationPolicy,
  confederation: Confederation
): number | null {
  if (policy === 'none') {
    return null;
  }

  return confederation === 'UEFA' ? 2 : 1;
}

export function isTeamAllowedInGroup(
  team: Team,
  group: Group,
  policy: ConfederationPolicy
): boolean {
  const limit = getConfederationLimit(policy, team.confederation);

  if (limit === null) {
    return true;
  }

  const currentCount = group.teams.filter(
    (candidate) => candidate.confederation === team.confederation
  ).length;

  return currentCount < limit;
}

export function isGroupValidForPolicy(group: Group, policy: ConfederationPolicy): boolean {
  const confederationCounts = new Map<string, number>();

  for (const team of group.teams) {
    const nextCount = (confederationCounts.get(team.confederation) ?? 0) + 1;
    confederationCounts.set(team.confederation, nextCount);

    const limit = getConfederationLimit(policy, team.confederation);

    if (limit !== null && nextCount > limit) {
      return false;
    }
  }

  return true;
}
