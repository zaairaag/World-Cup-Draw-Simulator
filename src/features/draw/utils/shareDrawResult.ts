import type { DrawResult } from '../../../types';
import { groupLabel } from './groupLabel';

function formatTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(timestamp);
}

export type ShareDrawResultOutcome =
  | 'shared'
  | 'clipboard'
  | 'clipboard_failed'
  | 'unavailable'
  | 'aborted';

export function buildShareText(result: DrawResult) {
  const sections = result.groups.map((group, index) => {
    const teamLines = group.teams.map((team) => `- ${team.name}`).join('\n');

    return `${groupLabel(index)}\n${teamLines}`;
  });

  return [
    'Resultado do sorteio',
    `${result.groups.length} grupos gerados · ${result.settings.teamsPerGroup} equipes por grupo`,
    `Gerado em ${formatTimestamp(result.timestamp)}`,
    ...sections
  ].join('\n\n');
}

export async function shareDrawResult(
  result: DrawResult,
  shareApi?: (payload: { title: string; text: string }) => Promise<void>,
  clipboardApi?: { writeText: (text: string) => Promise<void> }
): Promise<ShareDrawResultOutcome> {
  const shareText = buildShareText(result);

  if (typeof shareApi === 'function') {
    try {
      await shareApi({
        title: 'Resultado do sorteio',
        text: shareText
      });
      return 'shared';
    } catch (error) {
      if ((error as { name?: string }).name === 'AbortError') {
        return 'aborted';
      }
    }
  }

  if (clipboardApi?.writeText) {
    try {
      await clipboardApi.writeText(shareText);
      return 'clipboard';
    } catch {
      return 'clipboard_failed';
    }
  }

  return 'unavailable';
}
