import teams from '../../../constants/teams.json';
import type { Confederation, QualificationType, Result, Team } from '../../../types';

import type { ITeamRepository } from './ITeamRepository';

interface TeamRecord {
  name: string;
  code: string;
  confederation: Confederation;
  qualificationType?: QualificationType;
}

const teamRecords = teams as TeamRecord[];

function mapTeam(record: TeamRecord): Team {
  return {
    id: record.code,
    name: record.name,
    code: record.code,
    confederation: record.confederation,
    qualificationType: record.qualificationType
  };
}

export class LocalTeamRepository implements ITeamRepository {
  loadCatalog(): Result<Team[]> {
    return {
      ok: true,
      data: teamRecords.map(mapTeam)
    };
  }
}

export const localTeamRepository = new LocalTeamRepository();
