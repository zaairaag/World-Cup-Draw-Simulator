import { describe, expect, it, vi } from 'vitest';

import type { DrawResult, DrawSettings } from '../../types';
import {
  getAvailableTeamsEmptyMessage,
  getSettingsChangeSummary,
  hasUnsavedSession
} from './drawPageUtils';
import {
  downloadDrawResultJson,
  createResultDownloadFileName,
  scrollToPageTopIfSupported,
  shouldUseSmoothScroll
} from './drawPageBrowser';

const defaultSettings: DrawSettings = {
  numberOfGroups: 8,
  teamsPerGroup: 4,
  confederationPolicy: 'none'
};

function createResult(): DrawResult {
  return {
    groups: [],
    settings: defaultSettings,
    seed: 12345,
    timestamp: 1
  };
}

describe('drawPageUtils', () => {
  it('returns the challenge empty-state wording when the search has no matches', () => {
    expect(
      getAvailableTeamsEmptyMessage({
        hasSearchQuery: true,
        filteredTeamCount: 0,
        selectedTeamCount: 3,
        catalogTeamCount: 32,
        quickFilter: 'all'
      })
    ).toBe('Nenhuma seleção encontrada.');
  });

  it('returns the combined settings change summary in Portuguese', () => {
    expect(
      getSettingsChangeSummary(defaultSettings, {
        numberOfGroups: 6,
        teamsPerGroup: 3,
        confederationPolicy: 'fifa-like'
      })
    ).toBe('6 grupos, 3 equipes por grupo e regra de confederação fifa-like');
  });

  it('returns null when the settings patch does not change the current values', () => {
    expect(
      getSettingsChangeSummary(defaultSettings, {
        numberOfGroups: 8
      })
    ).toBeNull();
  });

  it('detects an unsaved session from selected teams, result, or settings drift', () => {
    expect(
      hasUnsavedSession({
        selectedTeamCount: 0,
        result: null,
        settings: defaultSettings,
        defaults: defaultSettings
      })
    ).toBe(false);

    expect(
      hasUnsavedSession({
        selectedTeamCount: 1,
        result: null,
        settings: defaultSettings,
        defaults: defaultSettings
      })
    ).toBe(true);

    expect(
      hasUnsavedSession({
        selectedTeamCount: 0,
        result: createResult(),
        settings: defaultSettings,
        defaults: defaultSettings
      })
    ).toBe(true);

    expect(
      hasUnsavedSession({
        selectedTeamCount: 0,
        result: null,
        settings: {
          ...defaultSettings,
          numberOfGroups: 6
        },
        defaults: defaultSettings
      })
    ).toBe(true);
  });

  it('creates the expected draw result file name', () => {
    expect(createResultDownloadFileName(1743190200000)).toBe(
      'resultado-sorteio-1743190200000.json'
    );
  });

  it('uses smooth scroll outside jsdom', () => {
    expect(shouldUseSmoothScroll('Mozilla/5.0 Chrome/135.0')).toBe(true);
    expect(shouldUseSmoothScroll('jsdom/27.0.0')).toBe(false);
  });

  it('downloads the current draw result as json', () => {
    const click = vi.fn();
    const revokeObjectURL = vi.fn();
    const createObjectURL = vi.fn(() => 'blob:draw');
    const createElement = vi.fn(() => ({ click, href: '', download: '' }));

    downloadDrawResultJson(
      createResult(),
      {
        URL: {
          createObjectURL,
          revokeObjectURL
        }
      },
      {
        createElement
      }
    );

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(createElement).toHaveBeenCalledWith('a');
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:draw');
  });

  it('scrolls to the top only when smooth scrolling is supported', () => {
    const scrollTo = vi.fn();

    scrollToPageTopIfSupported({
      navigator: {
        userAgent: 'Mozilla/5.0 Chrome/135.0'
      },
      scrollTo
    });
    scrollToPageTopIfSupported({
      navigator: {
        userAgent: 'jsdom/27.0.0'
      },
      scrollTo
    });

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
