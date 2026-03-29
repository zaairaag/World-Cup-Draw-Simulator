import type { Dispatch } from 'react';
import { createContext } from 'react';

import type { DrawAction, DrawState } from '../../../types';

export interface DrawContextValue {
  state: DrawState;
  dispatch: Dispatch<DrawAction>;
}

export const DrawContext = createContext<DrawContextValue | null>(null);
