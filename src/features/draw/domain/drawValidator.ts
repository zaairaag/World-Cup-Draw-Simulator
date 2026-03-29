import { DRAW_LIMITS } from '../../../constants';
import type { DrawSettings, Team } from '../../../types';
import type { Result } from '../../../types';

import { validateConfederationDistribution } from './confederationValidation';

interface ValidDrawPayload {
  participants: Team[];
  settings: DrawSettings;
}

function validatePotDistribution(
  participants: Team[],
  settings: DrawSettings
): Result<ValidDrawPayload> | null {
  const countsByPot = new Map<number, number>();

  for (const team of participants) {
    if (team.pot === undefined) {
      continue;
    }

    countsByPot.set(team.pot, (countsByPot.get(team.pot) ?? 0) + 1);
  }

  for (const [pot, count] of countsByPot) {
    if (count > settings.numberOfGroups) {
      return {
        ok: false,
        error: `Não é possível distribuir ${count} equipes do pote ${pot} em ${settings.numberOfGroups} grupos com limite de 1 por grupo.`
      };
    }
  }

  return null;
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

  const potValidationResult = validatePotDistribution(participants, settings);

  if (potValidationResult) {
    return potValidationResult;
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
