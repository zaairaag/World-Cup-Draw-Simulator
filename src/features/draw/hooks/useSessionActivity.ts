import { useCallback, useState } from 'react';

export interface SessionActivityEntry {
  id: string;
  message: string;
  timestamp: number;
}

export function useSessionActivity(limit = 6, initialEntries: SessionActivityEntry[] = []) {
  const [entries, setEntries] = useState<SessionActivityEntry[]>(initialEntries);

  const addEntry = useCallback(
    (message: string) => {
      setEntries((current) =>
        [
          {
            id: `${Date.now()}-${current.length}`,
            message,
            timestamp: Date.now()
          },
          ...current
        ].slice(0, limit)
      );
    },
    [limit]
  );

  const resetEntries = useCallback(
    (nextEntries: SessionActivityEntry[] = []) => {
      setEntries(nextEntries.slice(0, limit));
    },
    [limit]
  );

  return {
    entries,
    addEntry,
    resetEntries
  };
}
