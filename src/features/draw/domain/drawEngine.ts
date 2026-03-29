import type { DrawResult, DrawSettings, Team, Result } from '../../../types';

import { isTeamAllowedInGroup } from './confederationPolicy';
import { drawValidator } from './drawValidator';
import { shuffleList, type RandomNumberGenerator } from './random';
import { toGroupId } from '../utils/groupLabel';

function createEmptyGroups(settings: DrawSettings): DrawResult['groups'] {
  return Array.from({ length: settings.numberOfGroups }, (_, index) => ({
    id: toGroupId(index),
    teams: []
  }));
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
        isTeamAllowedInGroup(team, group, settings.confederationPolicy)
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
      timestamp: Date.now()
    }
  };
}

export function drawEngine(
  participants: Team[],
  settings: DrawSettings,
  randomNumberGenerator: RandomNumberGenerator = Math.random
): Result<DrawResult> {
  const validationResult = drawValidator(participants, settings);

  if (!validationResult.ok) {
    return validationResult;
  }

  if (settings.confederationPolicy === 'none') {
    const shuffledParticipants = shuffleList(
      validationResult.data.participants,
      randomNumberGenerator
    );

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
        timestamp: Date.now()
      }
    };
  }

  return drawRestrictedGroups(
    validationResult.data.participants,
    validationResult.data.settings,
    randomNumberGenerator
  );
}
