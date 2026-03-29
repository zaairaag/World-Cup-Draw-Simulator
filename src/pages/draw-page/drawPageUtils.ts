import type { DrawResult, DrawSettings } from '../../types';
import type { TeamQuickFilter } from '../../features/teams/utils/filterTeams';

interface AvailableTeamsEmptyMessageInput {
  hasSearchQuery: boolean;
  filteredTeamCount: number;
  selectedTeamCount: number;
  catalogTeamCount: number;
  quickFilter: TeamQuickFilter;
}

interface HasUnsavedSessionInput {
  selectedTeamCount: number;
  result: DrawResult | null;
  settings: DrawSettings;
  defaults: DrawSettings;
}

export function getAvailableTeamsEmptyMessage({
  hasSearchQuery,
  filteredTeamCount,
  selectedTeamCount,
  catalogTeamCount,
  quickFilter
}: AvailableTeamsEmptyMessageInput) {
  if (hasSearchQuery && filteredTeamCount === 0) {
    return 'Nenhuma seleção encontrada.';
  }

  if (quickFilter === 'selected' && selectedTeamCount === 0) {
    return 'Nenhuma seleção selecionada ainda.';
  }

  if (quickFilter !== 'all' && filteredTeamCount === 0) {
    return 'Nenhuma seleção encontrada.';
  }

  if (selectedTeamCount === catalogTeamCount) {
    return 'Todas as seleções disponíveis já foram adicionadas.';
  }

  return 'Busque seleções para adicionar à lista.';
}

export function getSettingsChangeSummary(
  currentSettings: DrawSettings,
  nextSettingsPatch: Partial<DrawSettings>
) {
  const nextSettings = {
    ...currentSettings,
    ...nextSettingsPatch
  };
  const changes: string[] = [];

  if (nextSettings.numberOfGroups !== currentSettings.numberOfGroups) {
    changes.push(`${nextSettings.numberOfGroups} grupos`);
  }

  if (nextSettings.teamsPerGroup !== currentSettings.teamsPerGroup) {
    changes.push(`${nextSettings.teamsPerGroup} equipes por grupo`);
  }

  if (nextSettings.confederationPolicy !== currentSettings.confederationPolicy) {
    changes.push(`regra de confederação ${nextSettings.confederationPolicy}`);
  }

  if (changes.length === 0) {
    return null;
  }

  if (changes.length === 1) {
    return changes[0];
  }

  return `${changes.slice(0, -1).join(', ')} e ${changes[changes.length - 1]}`;
}

export function hasUnsavedSession({
  selectedTeamCount,
  result,
  settings,
  defaults
}: HasUnsavedSessionInput) {
  return (
    selectedTeamCount > 0 ||
    result !== null ||
    settings.numberOfGroups !== defaults.numberOfGroups ||
    settings.teamsPerGroup !== defaults.teamsPerGroup ||
    settings.confederationPolicy !== defaults.confederationPolicy
  );
}
