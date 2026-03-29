import type { Result } from '../types';

import type { IStorageRepository } from './IStorageRepository';

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export class LocalStorageRepository implements IStorageRepository {
  save<T>(key: string, data: T): Result<true> {
    if (typeof window === 'undefined') {
      return { ok: false, error: 'Storage is unavailable.' };
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(data));

      return { ok: true, data: true };
    } catch (error) {
      return {
        ok: false,
        error: toErrorMessage(error, 'Unable to save data.')
      };
    }
  }

  load<T>(key: string): Result<T | null> {
    if (typeof window === 'undefined') {
      return { ok: true, data: null };
    }

    try {
      const rawValue = window.localStorage.getItem(key);

      if (rawValue === null) {
        return { ok: true, data: null };
      }

      return { ok: true, data: JSON.parse(rawValue) as T };
    } catch (error) {
      return {
        ok: false,
        error: toErrorMessage(error, 'Unable to load data.')
      };
    }
  }

  clear(key: string): Result<true> {
    if (typeof window === 'undefined') {
      return { ok: false, error: 'Storage is unavailable.' };
    }

    try {
      window.localStorage.removeItem(key);

      return { ok: true, data: true };
    } catch (error) {
      return {
        ok: false,
        error: toErrorMessage(error, 'Unable to clear data.')
      };
    }
  }
}

export const localStorageRepository = new LocalStorageRepository();
