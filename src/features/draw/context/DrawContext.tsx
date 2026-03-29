import type { ReactNode } from 'react';
import { useEffect, useMemo, useReducer } from 'react';

import { STORAGE_KEYS } from '../../../constants';
import type { DrawState } from '../../../types';
import { localStorageRepository } from '../../../repositories';
import { DrawContext } from './DrawContextValue';
import { drawReducer, initialDrawState } from './drawReducer';

interface DrawProviderProps {
  children: ReactNode;
  initialState?: DrawState;
}

export function DrawProvider({ children, initialState }: DrawProviderProps) {
  const [state, dispatch] = useReducer(drawReducer, initialState ?? initialDrawState);

  useEffect(() => {
    localStorageRepository.save(STORAGE_KEYS.drawState, state);
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return <DrawContext.Provider value={value}>{children}</DrawContext.Provider>;
}
