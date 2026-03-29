import { describe, expect, it } from 'vitest';

import type { DrawSettings } from '../../../types';
import { applyDrawPreset, DRAW_PRESETS } from './drawPresets';

describe('drawPresets', () => {
  const baseSettings: DrawSettings = {
    numberOfGroups: 6,
    teamsPerGroup: 4,
    confederationPolicy: 'none'
  };

  it('applies the challenge preset with the default settings', () => {
    expect(applyDrawPreset('challenge-default', baseSettings)).toEqual({
      numberOfGroups: 8,
      teamsPerGroup: 4,
      confederationPolicy: 'none'
    });
  });

  it('applies the compact preset without creating extra state', () => {
    expect(applyDrawPreset('compact', baseSettings)).toEqual({
      numberOfGroups: 4,
      teamsPerGroup: 4,
      confederationPolicy: 'none'
    });
  });

  it('keeps sizing and only switches the policy for fifa-like', () => {
    expect(applyDrawPreset('fifa-like', baseSettings)).toEqual({
      numberOfGroups: 6,
      teamsPerGroup: 4,
      confederationPolicy: 'fifa-like'
    });
  });

  it('declares the visible preset ids expected by the panel', () => {
    expect(DRAW_PRESETS.map((preset) => preset.id)).toEqual([
      'challenge-default',
      'compact',
      'fifa-like'
    ]);
  });
});
