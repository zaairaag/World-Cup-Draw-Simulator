import { describe, expect, it } from 'vitest';

import { localTeamRepository } from '../../teams/repositories/localTeamRepository';
import { drawEngine } from '../domain/drawEngine';

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

function createTeam(id: string, name: string, confederation: 'CONMEBOL' | 'UEFA') {
  return {
    id,
    name,
    code: id,
    confederation
  };
}

describe('drawEngine', () => {
  it('creates evenly sized groups with no duplicated teams', () => {
    const result = drawEngine(
      getTeams(4),
      {
        numberOfGroups: 2,
        teamsPerGroup: 2,
        confederationPolicy: 'none'
      },
      { randomNumberGenerator: () => 0 }
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.data.groups).toHaveLength(2);
    expect(result.data.groups[0]?.teams).toHaveLength(2);
    expect(result.data.groups[1]?.teams).toHaveLength(2);
    expect(result.data.settings).toEqual({
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });
    expect(result.data.groups.map((group) => group.id)).toEqual(['group-a', 'group-b']);

    const generatedIds = result.data.groups.flatMap((group) => group.teams.map((team) => team.id));

    expect(new Set(generatedIds).size).toBe(4);
    expect(result.data.timestamp).toBeTypeOf('number');
  });

  it('returns a validation error instead of generating an invalid draw', () => {
    const teams = [...getTeams(3), getTeam(0)];
    const result = drawEngine(teams, {
      numberOfGroups: 2,
      teamsPerGroup: 2,
      confederationPolicy: 'none'
    });

    expect(result).toEqual({
      ok: false,
      error: 'Equipes duplicadas não são permitidas no sorteio.'
    });
  });

  it('creates fifa-like groups without violating confederation limits', () => {
    const teams = [
      createTeam('GER', 'Germany', 'UEFA'),
      createTeam('FRA', 'France', 'UEFA'),
      createTeam('BRA', 'Brazil', 'CONMEBOL'),
      createTeam('ARG', 'Argentina', 'CONMEBOL')
    ];

    const result = drawEngine(
      teams,
      {
        numberOfGroups: 2,
        teamsPerGroup: 2,
        confederationPolicy: 'fifa-like'
      },
      { randomNumberGenerator: () => 0.9 }
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    for (const group of result.data.groups) {
      const conmebolCount = group.teams.filter((team) => team.confederation === 'CONMEBOL').length;

      expect(conmebolCount).toBeLessThanOrEqual(1);
    }
  });
});
