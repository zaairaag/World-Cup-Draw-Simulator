import type { Confederation, DrawResult } from '../../../types';

export interface ExecutiveDrawSummary {
  totalGroups: number;
  teamsPerGroup: number;
  confederationPolicy: DrawResult['settings']['confederationPolicy'];
  confederationCounts: Partial<Record<Confederation, number>>;
  uefaDoubleGroupCount: number;
  mostDiverseGroupIds: string[];
}

export function summarizeDrawResult(result: DrawResult): ExecutiveDrawSummary {
  const confederationCounts: Partial<Record<Confederation, number>> = {};
  let highestDiversity = 0;

  const diversityMap = result.groups.map((group) => {
    const confederations = new Set(group.teams.map((team) => team.confederation));
    const diversity = confederations.size;

    group.teams.forEach((team) => {
      confederationCounts[team.confederation] = (confederationCounts[team.confederation] ?? 0) + 1;
    });

    if (diversity > highestDiversity) {
      highestDiversity = diversity;
    }

    return {
      groupId: group.id,
      diversity
    };
  });

  return {
    totalGroups: result.groups.length,
    teamsPerGroup: result.settings.teamsPerGroup,
    confederationPolicy: result.settings.confederationPolicy,
    confederationCounts,
    uefaDoubleGroupCount: result.groups.filter((group) => {
      const uefaCount = group.teams.filter((team) => team.confederation === 'UEFA').length;

      return uefaCount === 2;
    }).length,
    mostDiverseGroupIds: diversityMap
      .filter((item) => item.diversity === highestDiversity)
      .map((item) => item.groupId)
  };
}
