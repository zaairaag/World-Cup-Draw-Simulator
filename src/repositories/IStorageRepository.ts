import type { Result } from '../types';

export interface IStorageRepository {
  save<T>(key: string, data: T): Result<true>;
  load<T>(key: string): Result<T | null>;
  clear(key: string): Result<true>;
}
