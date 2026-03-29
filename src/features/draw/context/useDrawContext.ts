import { useContext } from 'react';

import type { DrawContextValue } from './DrawContextValue';
import { DrawContext } from './DrawContextValue';

export function useDrawContext(): DrawContextValue {
  const context = useContext(DrawContext);

  if (context === null) {
    throw new Error('useDrawContext must be used within DrawProvider.');
  }

  return context;
}
