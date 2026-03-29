import { STORAGE_KEYS } from '../../../constants';
import { localStorageRepository } from '../../../repositories';
import type { DrawState } from '../../../types';

export interface SavedDrawHistoryEntry {
  id: string;
  savedAt: number;
  selectedTeamIds: string[];
  drawState: DrawState;
  label: string;
  summary: string;
}

interface CreateSavedDrawEntryInput {
  label: string;
  selectedTeamIds: string[];
  drawState: DrawState;
}

function createHistoryId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `saved-draw-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createSuggestedSavedDrawLabel(savedAt: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
    .format(savedAt)
    .replace(',', '');
}

export function createSavedDrawEntry({
  label,
  selectedTeamIds,
  drawState
}: CreateSavedDrawEntryInput): SavedDrawHistoryEntry {
  const savedAt = Date.now();

  return {
    id: createHistoryId(),
    savedAt,
    selectedTeamIds,
    drawState,
    label: label.trim() || `Sorteio ${createSuggestedSavedDrawLabel(savedAt)}`,
    summary: `${drawState.settings.numberOfGroups} grupos · ${drawState.settings.teamsPerGroup} por grupo`
  };
}

export function sanitizeSavedDrawHistory(value: unknown): SavedDrawHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return [];
    }

    const candidate = entry as Partial<SavedDrawHistoryEntry>;

    if (
      typeof candidate.id !== 'string' ||
      typeof candidate.savedAt !== 'number' ||
      !Array.isArray(candidate.selectedTeamIds) ||
      !candidate.selectedTeamIds.every((teamId) => typeof teamId === 'string') ||
      typeof candidate.summary !== 'string' ||
      typeof candidate.drawState !== 'object' ||
      candidate.drawState === null
    ) {
      return [];
    }

    const fallbackLabel = `Sorteio ${createSuggestedSavedDrawLabel(candidate.savedAt)}`;

    return [
      {
        id: candidate.id,
        savedAt: candidate.savedAt,
        selectedTeamIds: candidate.selectedTeamIds,
        drawState: candidate.drawState,
        label:
          typeof candidate.label === 'string' && candidate.label.trim()
            ? candidate.label
            : fallbackLabel,
        summary: candidate.summary
      }
    ];
  });
}

export function loadSavedDrawHistory(): SavedDrawHistoryEntry[] {
  const result = localStorageRepository.load<unknown>(STORAGE_KEYS.savedDrawHistory);

  return result.ok ? sanitizeSavedDrawHistory(result.data) : [];
}

export function saveSavedDrawHistory(entries: SavedDrawHistoryEntry[]) {
  return localStorageRepository.save(STORAGE_KEYS.savedDrawHistory, entries);
}
