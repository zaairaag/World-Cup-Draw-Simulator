import { useEffect, useMemo, useState } from 'react';

import { useDebounce } from '../../../hooks';
import type { Team } from '../../../types';
import { filterTeams, type TeamQuickFilter } from '../utils/filterTeams';

interface UseTeamSearchOptions {
  teams: Team[];
  selectedIds: string[];
  onSelectTeam: (teamId: string) => void;
}

export function useTeamSearch({ teams, selectedIds, onSelectTeam }: UseTeamSearchOptions) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [quickFilter, setQuickFilter] = useState<TeamQuickFilter>('all');
  const debouncedQuery = useDebounce(query, 200);
  const isQueryPending = query !== debouncedQuery;

  const filteredTeams = useMemo(
    () => filterTeams(teams, query, selectedIds, { mode: quickFilter }),
    [query, quickFilter, selectedIds, teams]
  );
  const debouncedTeams = useMemo(
    () => filterTeams(teams, debouncedQuery, selectedIds, { mode: quickFilter }),
    [debouncedQuery, quickFilter, selectedIds, teams]
  );
  const suggestionTeams = useMemo(() => {
    if (isQueryPending) {
      return [];
    }

    return debouncedTeams;
  }, [debouncedTeams, isQueryPending]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery, quickFilter]);

  function closeSuggestions() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setIsOpen(true);
  }

  function selectTeam(teamId: string) {
    onSelectTeam(teamId);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(key: string) {
    if (key === 'ArrowDown') {
      if (suggestionTeams.length === 0) {
        return;
      }

      setIsOpen(true);
      setActiveIndex((currentIndex) => Math.min(currentIndex + 1, suggestionTeams.length - 1));
    }

    if (key === 'ArrowUp') {
      if (suggestionTeams.length === 0) {
        return;
      }

      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
    }

    if (key === 'Escape') {
      closeSuggestions();
    }

    if (key === 'Enter' && suggestionTeams.length > 0) {
      const nextTeam = suggestionTeams[activeIndex >= 0 ? activeIndex : 0] ?? suggestionTeams[0];

      if (nextTeam) {
        selectTeam(nextTeam.id);
      }
    }

    if (key === 'Home' && suggestionTeams.length > 0) {
      setActiveIndex(0);
    }

    if (key === 'End' && suggestionTeams.length > 0) {
      setActiveIndex(suggestionTeams.length - 1);
    }
  }

  return {
    query,
    quickFilter,
    isQueryPending,
    isOpen,
    activeIndex,
    filteredTeams,
    suggestionTeams,
    setQuickFilter,
    handleQueryChange,
    handleKeyDown,
    openSuggestions: () => setIsOpen(true),
    closeSuggestions,
    selectTeam
  };
}
