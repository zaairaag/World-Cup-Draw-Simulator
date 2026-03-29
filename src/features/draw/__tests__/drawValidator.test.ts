import { describe, expect, it } from 'vitest';

import { localTeamRepository } from '../../teams/repositories/localTeamRepository';
import { drawValidator } from '../domain/drawValidator';
import type { Confederation, Team } from '../../../types';

function getTeams(count: number) {
  const result = localTeamRepository.loadCatalog();

  if (!result.ok) {
    throw new Error('Expected a valid local team catalog.');
  }

  return result.data.slice(0, count);
}

function getTeam(index: number) {
  const result = localTeamRepository.loadCatalog();

  if (!result.ok) {
    throw new Error('Expected a valid local team catalog.');
  }

  const team = result.data[index];

  if (!team) {
    throw new Error(`Expected a team at index ${index}.`);
  }

  return team;
}

function createTeam(code: string, name: string, confederation: Confederation): Team {
  return {
    id: code,
    code,
    name,
    confederation
  };
}

describe('drawValidator', () => {
  it('rejects a group count lower than the minimum', () => {
    const result = drawValidator(getTeams(4), {
      numberOfGroups: 1,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });

    expect(result).toEqual({
      ok: false,
      error: 'Use pelo menos 2 grupos.'
    });
  });

  it('rejects a participant total that does not match the configuration', () => {
    const result = drawValidator(getTeams(3), {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });

    expect(result).toEqual({
      ok: false,
      error: 'As equipes selecionadas (3) devem corresponder ao total exigido (4).'
    });
  });

  it('rejects duplicate team ids', () => {
    const teams = [...getTeams(3), getTeam(0)];
    const result = drawValidator(teams, {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });

    expect(result).toEqual({
      ok: false,
      error: 'Equipes duplicadas não são permitidas no sorteio.'
    });
  });

  it('accepts a valid participant set and settings pair', () => {
    const result = drawValidator(getTeams(4), {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.data.participants).toHaveLength(4);
    expect(result.data.settings).toEqual({
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });
  });

  it('rejects an impossible fifa-like confederation distribution', () => {
    const teams = [
      createTeam('BRA', 'Brazil', 'CONMEBOL'),
      createTeam('ARG', 'Argentina', 'CONMEBOL'),
      createTeam('URU', 'Uruguay', 'CONMEBOL'),
      createTeam('COL', 'Colombia', 'CONMEBOL'),
      createTeam('ECU', 'Ecuador', 'CONMEBOL'),
      createTeam('GER', 'Germany', 'UEFA'),
      createTeam('FRA', 'France', 'UEFA'),
      createTeam('ESP', 'Spain', 'UEFA')
    ];

    const result = drawValidator(teams, {
      numberOfGroups: 4,
      teamsPerGroup: 2,
      confederationPolicy: 'fifa-like'
    });

    expect(result).toEqual({
      ok: false,
      error:
        'Não é possível distribuir 5 equipes da CONMEBOL em 4 grupos com limite de 1 por grupo.'
    });
  });

  it('accepts a feasible fifa-like confederation distribution', () => {
    const teams = [
      createTeam('BRA', 'Brazil', 'CONMEBOL'),
      createTeam('ARG', 'Argentina', 'CONMEBOL'),
      createTeam('GER', 'Germany', 'UEFA'),
      createTeam('FRA', 'France', 'UEFA')
    ];

    const result = drawValidator(teams, {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'fifa-like'
    });

    expect(result.ok).toBe(true);
  });

  it('accepts a fifa-like distribution that depends on the UEFA double limit', () => {
    const teams = [
      createTeam('GER', 'Germany', 'UEFA'),
      createTeam('FRA', 'France', 'UEFA'),
      createTeam('ESP', 'Spain', 'UEFA'),
      createTeam('POR', 'Portugal', 'UEFA')
    ];

    const result = drawValidator(teams, {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'fifa-like'
    });

    expect(result.ok).toBe(true);
  });
});
