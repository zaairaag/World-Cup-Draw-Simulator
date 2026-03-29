import { STORAGE_KEYS } from '../../constants';
import type { DrawState } from '../../types';
import { localStorageRepository } from '../../repositories';
import { localTeamRepository } from '../../features/teams/repositories/localTeamRepository';

import { createHydratedAppState, type HydratedAppState } from '../createHydratedAppState';

export function restoreAppState(): HydratedAppState {
  const catalogResult = localTeamRepository.loadCatalog();
  const catalog = catalogResult.ok ? catalogResult.data : [];
  const selectedIdsResult = localStorageRepository.load<string[]>(STORAGE_KEYS.selectedTeams);
  const drawStateResult = localStorageRepository.load<DrawState>(STORAGE_KEYS.drawState);

  return createHydratedAppState(
    catalog,
    selectedIdsResult.ok ? selectedIdsResult.data : [],
    drawStateResult.ok ? drawStateResult.data : null
  );
}
