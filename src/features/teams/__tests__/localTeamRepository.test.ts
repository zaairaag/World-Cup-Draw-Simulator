import { describe, expect, it } from 'vitest';

import { localTeamRepository } from '../repositories/localTeamRepository';

describe('localTeamRepository', () => {
  it('loads a sanitized sample catalog with stable ids', () => {
    const result = localTeamRepository.loadCatalog();

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.data).toHaveLength(32);
    expect(result.data.every((team) => team.id === team.code)).toBe(true);
    expect(new Set(result.data.map((team) => team.code)).size).toBe(result.data.length);

    expect(result.data).toContainEqual(
      expect.objectContaining({
        id: 'CAN',
        code: 'CAN',
        name: 'Canada',
        confederation: 'CONCACAF',
        qualificationType: 'host'
      })
    );
  });
});
