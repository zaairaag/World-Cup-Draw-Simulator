import type { DrawResult, DrawSettings, Group, Team, Result } from '../../../types';

import { isTeamAllowedInGroup } from './confederationPolicy';
import { drawValidator } from './drawValidator';
import { createSeededRng, generateSeed, shuffleList, type RandomNumberGenerator } from './random';
import { toGroupId } from '../utils/groupLabel';

function createEmptyGroups(settings: DrawSettings): DrawResult['groups'] {
  return Array.from({ length: settings.numberOfGroups }, (_, index) => ({
    id: toGroupId(index),
    teams: []
  }));
}

function isPotAllowedInGroup(team: Team, group: Group): boolean {
  if (team.pot === undefined) {
    return true;
  }

  return !group.teams.some((member) => member.pot === team.pot);
}

function assignTeamsWithBacktracking(
  participants: Team[],
  groups: DrawResult['groups'],
  settings: DrawSettings,
  index: number,
  randomNumberGenerator: RandomNumberGenerator
): boolean {
  if (index >= participants.length) {
    return true;
  }

  const team = participants[index];

  if (!team) {
    return false;
  }

  const eligibleGroups = shuffleList(
    groups.filter(
      (group) =>
        group.teams.length < settings.teamsPerGroup &&
        isTeamAllowedInGroup(team, group, settings.confederationPolicy) &&
        isPotAllowedInGroup(team, group)
    ),
    randomNumberGenerator
  );

  for (const group of eligibleGroups) {
    group.teams.push(team);

    if (
      assignTeamsWithBacktracking(participants, groups, settings, index + 1, randomNumberGenerator)
    ) {
      return true;
    }

    group.teams.pop();
  }

  return false;
}

function drawRestrictedGroups(
  participants: Team[],
  settings: DrawSettings,
  seed: number,
  randomNumberGenerator: RandomNumberGenerator
): Result<DrawResult> {
  const groups = createEmptyGroups(settings);
  const shuffledParticipants = shuffleList(participants, randomNumberGenerator);

  const canDraw = assignTeamsWithBacktracking(
    shuffledParticipants,
    groups,
    settings,
    0,
    randomNumberGenerator
  );

  if (!canDraw) {
    return {
      ok: false,
      error:
        'Não foi possível alocar uma combinação válida sem violar a regra de confederação ativa.'
    };
  }

  return {
    ok: true,
    data: {
      groups,
      settings,
      seed,
      timestamp: Date.now()
    }
  };
}

export interface DrawEngineOptions {
  seed?: number;
  randomNumberGenerator?: RandomNumberGenerator;
}

export function drawEngine(
  participants: Team[],
  settings: DrawSettings,
  options: DrawEngineOptions = {}
): Result<DrawResult> {
  const validationResult = drawValidator(participants, settings);

  if (!validationResult.ok) {
    return validationResult;
  }

  const seed = options.seed ?? generateSeed();
  const rng = options.randomNumberGenerator ?? createSeededRng(seed);
  const hasPots = validationResult.data.participants.some((team) => team.pot !== undefined);
  const needsBacktracking = settings.confederationPolicy !== 'none' || hasPots;

  if (!needsBacktracking) {
    const shuffledParticipants = shuffleList(validationResult.data.participants, rng);

    return {
      ok: true,
      data: {
        groups: Array.from({ length: settings.numberOfGroups }, (_, index) => ({
          id: toGroupId(index),
          teams: shuffledParticipants.slice(
            index * settings.teamsPerGroup,
            (index + 1) * settings.teamsPerGroup
          )
        })),
        settings: validationResult.data.settings,
        seed,
        timestamp: Date.now()
      }
    };
  }

  return drawRestrictedGroups(
    validationResult.data.participants,
    validationResult.data.settings,
    seed,
    rng
  );
}
