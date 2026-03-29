import type { DrawSettings } from '../../../types';

export type DrawPresetId = 'challenge-default' | 'compact' | 'fifa-like';

export interface DrawPresetDefinition {
  id: DrawPresetId;
  label: string;
  resolve: (settings: DrawSettings) => DrawSettings;
}

export const DRAW_PRESETS: DrawPresetDefinition[] = [
  {
    id: 'challenge-default',
    label: 'Padrão do desafio',
    resolve: () => ({
      numberOfGroups: 8,
      teamsPerGroup: 4,
      confederationPolicy: 'none'
    })
  },
  {
    id: 'compact',
    label: 'Compacto',
    resolve: () => ({
      numberOfGroups: 4,
      teamsPerGroup: 4,
      confederationPolicy: 'none'
    })
  },
  {
    id: 'fifa-like',
    label: 'Regra FIFA-like',
    resolve: (settings) => ({
      ...settings,
      confederationPolicy: 'fifa-like'
    })
  }
];

export function applyDrawPreset(presetId: DrawPresetId, settings: DrawSettings): DrawSettings {
  const preset = DRAW_PRESETS.find((item) => item.id === presetId);

  return preset ? preset.resolve(settings) : settings;
}

export function matchesDrawPreset(presetId: DrawPresetId, settings: DrawSettings): boolean {
  const nextSettings = applyDrawPreset(presetId, settings);

  return (
    nextSettings.numberOfGroups === settings.numberOfGroups &&
    nextSettings.teamsPerGroup === settings.teamsPerGroup &&
    nextSettings.confederationPolicy === settings.confederationPolicy
  );
}
