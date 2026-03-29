import type { SavedDrawHistoryEntry } from './savedDrawHistory';

type SavedDrawGroup = NonNullable<SavedDrawHistoryEntry['drawState']['result']>['groups'][number];

function createCompositionKey(teamIds: string[]) {
  return [...teamIds].sort().join('|');
}

export interface ComparedSavedDrawGroup {
  groupId: string;
  changed: boolean;
  leftGroup: SavedDrawGroup | null;
  rightGroup: SavedDrawGroup | null;
}

export interface SavedDrawComparison {
  left: SavedDrawHistoryEntry;
  right: SavedDrawHistoryEntry;
  groups: ComparedSavedDrawGroup[];
}

export function compareSavedDraws(
  left: SavedDrawHistoryEntry,
  right: SavedDrawHistoryEntry
): SavedDrawComparison {
  const leftGroups = left.drawState.result?.groups ?? [];
  const rightGroups = right.drawState.result?.groups ?? [];
  const maxLength = Math.max(leftGroups.length, rightGroups.length);

  return {
    left,
    right,
    groups: Array.from({ length: maxLength }, (_, index) => {
      const leftGroup = leftGroups[index] ?? null;
      const rightGroup = rightGroups[index] ?? null;
      const leftKey = leftGroup ? createCompositionKey(leftGroup.teams.map((team) => team.id)) : '';
      const rightKey = rightGroup
        ? createCompositionKey(rightGroup.teams.map((team) => team.id))
        : '';

      return {
        groupId: leftGroup?.id ?? rightGroup?.id ?? `group-${index + 1}`,
        changed: leftKey !== rightKey,
        leftGroup,
        rightGroup
      };
    })
  };
}
