import type { DrawResult, DrawSettings, DrawState, Team, TeamState } from '../types';
import { initialDrawState } from '../features/draw/context/drawReducer';
import { initialTeamsState } from '../features/teams/context/teamsReducer';

export interface HydratedAppState {
  teamsState: TeamState;
  drawState: DrawState;
}

function createGroupId(index: number) {
  return `group-${String.fromCharCode(97 + index)}`;
}

function sanitizeSelectedIds(value: unknown, catalog: Team[]) {
  if (!Array.isArray(value)) {
    return [];
  }

  const catalogIds = new Set(catalog.map((team) => team.id));

  return value.filter(
    (teamId, index): teamId is string =>
      typeof teamId === 'string' && catalogIds.has(teamId) && value.indexOf(teamId) === index
  );
}

function sanitizeSettings(value: unknown): DrawSettings {
  const settings = typeof value === 'object' && value !== null ? value : {};
  const numberOfGroups =
    typeof (settings as DrawSettings).numberOfGroups === 'number' &&
    (settings as DrawSettings).numberOfGroups >= 2
      ? Math.trunc((settings as DrawSettings).numberOfGroups)
      : initialDrawState.settings.numberOfGroups;
  const teamsPerGroup =
    typeof (settings as DrawSettings).teamsPerGroup === 'number' &&
    (settings as DrawSettings).teamsPerGroup >= 2
      ? Math.trunc((settings as DrawSettings).teamsPerGroup)
      : initialDrawState.settings.teamsPerGroup;
  const confederationPolicy =
    (settings as DrawSettings).confederationPolicy === 'fifa-like' ? 'fifa-like' : 'none';

  return {
    numberOfGroups,
    teamsPerGroup,
    confederationPolicy
  };
}

function sanitizeResult(
  value: unknown,
  settings: DrawSettings,
  selectedIds: string[],
  catalog: Team[]
): DrawResult | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const rawResult = value as DrawResult;

  if (!Array.isArray(rawResult.groups) || rawResult.groups.length !== settings.numberOfGroups) {
    return null;
  }

  const catalogMap = new Map(catalog.map((team) => [team.id, team]));
  const restoredIds: string[] = [];
  const groups = rawResult.groups.map((group, index) => {
    if (
      typeof group !== 'object' ||
      group === null ||
      !Array.isArray(group.teams) ||
      group.teams.length !== settings.teamsPerGroup
    ) {
      return null;
    }

    const teams = group.teams.map((team) => {
      const rawTeam = typeof team === 'object' && team !== null ? team : null;
      const teamId =
        rawTeam !== null && 'id' in rawTeam && typeof rawTeam.id === 'string' ? rawTeam.id : null;

      if (teamId === null || !selectedIds.includes(teamId)) {
        return null;
      }

      const catalogTeam = catalogMap.get(teamId);

      if (!catalogTeam) {
        return null;
      }

      restoredIds.push(catalogTeam.id);

      return catalogTeam;
    });

    if (teams.some((team) => team === null)) {
      return null;
    }

    return {
      id: typeof group.id === 'string' ? group.id : createGroupId(index),
      teams: teams as Team[]
    };
  });

  if (
    groups.some((group) => group === null) ||
    restoredIds.length !== selectedIds.length ||
    new Set(restoredIds).size !== selectedIds.length ||
    selectedIds.some((teamId) => !restoredIds.includes(teamId))
  ) {
    return null;
  }

  const timestamp = typeof rawResult.timestamp === 'number' ? rawResult.timestamp : Date.now();
  const seed =
    typeof rawResult.seed === 'number' && Number.isInteger(rawResult.seed) && rawResult.seed > 0
      ? rawResult.seed
      : Math.max(1, Math.trunc(timestamp));

  return {
    groups: groups as DrawResult['groups'],
    settings,
    seed,
    timestamp
  };
}

function sanitizeDrawState(value: unknown, selectedIds: string[], catalog: Team[]): DrawState {
  if (typeof value !== 'object' || value === null) {
    return initialDrawState;
  }

  const settings = sanitizeSettings((value as DrawState).settings);
  const result = sanitizeResult((value as DrawState).result, settings, selectedIds, catalog);

  if (result === null) {
    return {
      ...initialDrawState,
      settings
    };
  }

  return {
    settings,
    result,
    status: 'drawn',
    lastError: null,
    undoResult: null
  };
}

export function createHydratedAppState(
  catalog: Team[],
  rawSelectedIds: unknown,
  rawDrawState: unknown
): HydratedAppState {
  const safeCatalog = Array.isArray(catalog) ? catalog : initialTeamsState.catalog;
  const selectedIds = sanitizeSelectedIds(rawSelectedIds, safeCatalog);

  return {
    teamsState: {
      catalog: safeCatalog,
      selectedIds
    },
    drawState: sanitizeDrawState(rawDrawState, selectedIds, safeCatalog)
  };
}
