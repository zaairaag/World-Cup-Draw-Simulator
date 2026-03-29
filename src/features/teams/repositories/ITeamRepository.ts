import type { Team, Result } from '../../../types';

export interface ITeamRepository {
  loadCatalog(): Result<Team[]>;
}
