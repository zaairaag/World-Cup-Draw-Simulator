export const DRAW_DEFAULTS = {
  numberOfGroups: 8,
  teamsPerGroup: 4,
  confederationPolicy: 'none'
} as const;

export const DRAW_LIMITS = {
  minimumGroups: 2,
  minimumTeamsPerGroup: 2
} as const;
