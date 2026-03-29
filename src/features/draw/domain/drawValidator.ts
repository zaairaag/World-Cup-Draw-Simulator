import { DRAW_LIMITS } from '../../../constants';
import type { DrawSettings, Team } from '../../../types';
import type { Result } from '../../../types';

import { validateConfederationDistribution } from './confederationValidation';

interface ValidDrawPayload {
  participants: Team[];
  settings: DrawSettings;
}

export function drawValidator(
  participants: Team[],
  settings: DrawSettings
): Result<ValidDrawPayload> {
  if (settings.numberOfGroups < DRAW_LIMITS.minimumGroups) {
    return {
      ok: false,
      error: 'Use pelo menos 2 grupos.'
    };
  }

  if (settings.teamsPerGroup < DRAW_LIMITS.minimumTeamsPerGroup) {
    return {
      ok: false,
      error: 'Use pelo menos 2 equipes por grupo.'
    };
  }

  const expectedTeamCount = settings.numberOfGroups * settings.teamsPerGroup;

  if (participants.length !== expectedTeamCount) {
    return {
      ok: false,
      error: `As equipes selecionadas (${participants.length}) devem corresponder ao total exigido (${expectedTeamCount}).`
    };
  }

  const uniqueIds = new Set(participants.map((team) => team.id));

  if (uniqueIds.size !== participants.length) {
    return {
      ok: false,
      error: 'Equipes duplicadas não são permitidas no sorteio.'
    };
  }

  const confederationResult = validateConfederationDistribution(participants, settings);

  if (!confederationResult.ok) {
    return confederationResult;
  }

  return {
    ok: true,
    data: {
      participants,
      settings
    }
  };
}
