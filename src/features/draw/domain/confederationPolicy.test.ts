import { describe, expect, it } from 'vitest';

import type { Confederation, Group, Team } from '../../../types';
import {
  getConfederationLimit,
  isGroupValidForPolicy,
  isTeamAllowedInGroup
} from './confederationPolicy';

function createTeam(id: string, confederation: Confederation): Team {
  return {
    id,
    code: id,
    name: id,
    confederation
  };
}

describe('confederationPolicy', () => {
  it('returns no limit when the policy is none', () => {
    expect(getConfederationLimit('none', 'UEFA')).toBeNull();
  });

  it('returns a double limit for UEFA under fifa-like policy', () => {
    expect(getConfederationLimit('fifa-like', 'UEFA')).toBe(2);
  });

  it('returns a single limit for CONMEBOL under fifa-like policy', () => {
    expect(getConfederationLimit('fifa-like', 'CONMEBOL')).toBe(1);
  });

  it('allows a second UEFA team in a group under fifa-like policy', () => {
    const group: Group = {
      id: 'group-a',
      teams: [createTeam('GER', 'UEFA')]
    };

    expect(isTeamAllowedInGroup(createTeam('FRA', 'UEFA'), group, 'fifa-like')).toBe(true);
  });

  it('rejects a third UEFA team in a group under fifa-like policy', () => {
    const group: Group = {
      id: 'group-a',
      teams: [createTeam('GER', 'UEFA'), createTeam('FRA', 'UEFA')]
    };

    expect(isTeamAllowedInGroup(createTeam('ESP', 'UEFA'), group, 'fifa-like')).toBe(false);
  });

  it('rejects a group that exceeds the UEFA limit under fifa-like policy', () => {
    const group: Group = {
      id: 'group-a',
      teams: [createTeam('GER', 'UEFA'), createTeam('FRA', 'UEFA'), createTeam('ESP', 'UEFA')]
    };

    expect(isGroupValidForPolicy(group, 'fifa-like')).toBe(false);
  });
});
