import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LocalStorageRepository, localStorageRepository } from './localStorageRepository';

describe('localStorageRepository', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('saves and loads structured data', () => {
    const saveResult = localStorageRepository.save('wc-draw:test', {
      selectedIds: ['BRA', 'ARG']
    });

    expect(saveResult).toEqual({ ok: true, data: true });

    const loadResult = localStorageRepository.load<{ selectedIds: string[] }>('wc-draw:test');

    expect(loadResult).toEqual({
      ok: true,
      data: { selectedIds: ['BRA', 'ARG'] }
    });
  });

  it('returns null for missing keys', () => {
    expect(localStorageRepository.load('wc-draw:missing')).toEqual({
      ok: true,
      data: null
    });
  });

  it('returns an error for invalid json', () => {
    window.localStorage.setItem('wc-draw:broken', '{');

    const result = localStorageRepository.load('wc-draw:broken');

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });

  it('clears persisted data', () => {
    window.localStorage.setItem('wc-draw:test', JSON.stringify({ value: 1 }));

    const clearResult = localStorageRepository.clear('wc-draw:test');

    expect(clearResult).toEqual({ ok: true, data: true });
    expect(window.localStorage.getItem('wc-draw:test')).toBeNull();
  });

  it('returns unavailable results when window storage does not exist', () => {
    const repository = new LocalStorageRepository();

    vi.stubGlobal('window', undefined);

    expect(repository.save('wc-draw:test', { value: 1 })).toEqual({
      ok: false,
      error: 'Storage is unavailable.'
    });
    expect(repository.load('wc-draw:test')).toEqual({
      ok: true,
      data: null
    });
    expect(repository.clear('wc-draw:test')).toEqual({
      ok: false,
      error: 'Storage is unavailable.'
    });
  });

  it('falls back to generic save and clear errors for non-Error exceptions', () => {
    const nonErrorException = { reason: 'boom' } as unknown as Error;

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw nonErrorException;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw nonErrorException;
    });

    expect(localStorageRepository.save('wc-draw:test', { value: 1 })).toEqual({
      ok: false,
      error: 'Unable to save data.'
    });
    expect(localStorageRepository.clear('wc-draw:test')).toEqual({
      ok: false,
      error: 'Unable to clear data.'
    });
  });

  it('returns a load error when reading from storage throws', () => {
    const nonErrorException = { reason: 'boom' } as unknown as Error;

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw nonErrorException;
    });

    expect(localStorageRepository.load('wc-draw:test')).toEqual({
      ok: false,
      error: 'Unable to load data.'
    });
  });
});
