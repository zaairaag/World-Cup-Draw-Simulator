import { memo, type RefObject } from 'react';
import styled from 'styled-components';

import type { Team } from '../../types';
import { AvailableTeamsCatalog } from '../../features/teams/components/AvailableTeamsCatalog';
import { SelectedTeamsPanel } from '../../features/teams/components/SelectedTeamsPanel';
import { TeamSearchCombobox } from '../../features/teams/components/TeamSearchCombobox';
import type { TeamQuickFilter } from '../../features/teams/utils/filterTeams';

interface SelectionOverlayProps {
  query: string;
  isOpen: boolean;
  activeIndex: number;
  suggestionTeams: Team[];
  filteredTeams: Team[];
  quickFilter: TeamQuickFilter;
  selectedTeams: Team[];
  selectedIds: string[];
  requiredTeamCount: number;
  availableTeamsEmptyMessage: string;
  inputRef?: RefObject<HTMLInputElement>;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onKeyDown: (key: string) => void;
  onSelectTeam: (teamId: string) => void;
  onQuickFilterChange: (filter: TeamQuickFilter) => void;
  onOpenSuggestions: () => void;
  onCloseSuggestions: () => void;
  onRemoveTeam: (teamId: string) => void;
  onClearSelection: () => void;
  onFillSelection: () => void;
}

export const SelectionOverlay = memo(function SelectionOverlay({
  query,
  isOpen,
  activeIndex,
  suggestionTeams,
  filteredTeams,
  quickFilter,
  selectedTeams,
  selectedIds,
  requiredTeamCount,
  availableTeamsEmptyMessage,
  inputRef,
  onClose,
  onQueryChange,
  onKeyDown,
  onSelectTeam,
  onQuickFilterChange,
  onOpenSuggestions,
  onCloseSuggestions,
  onRemoveTeam,
  onClearSelection,
  onFillSelection
}: SelectionOverlayProps) {
  return (
    <SelectionOverLayer>
      <OverlayHeader>
        <OverlayTitle>Gestão de Participantes</OverlayTitle>
        <CloseOverlay onClick={onClose} aria-label="Concluir seleção de participantes">
          PRONTO
          <span className="material-symbols-rounded" aria-hidden="true">
            check
          </span>
        </CloseOverlay>
      </OverlayHeader>

      <OverlayGrid>
        <SearchSection>
          <SearchHeader>Buscar seleções no catálogo</SearchHeader>
          <TeamSearchCombobox
            query={query}
            isOpen={isOpen}
            activeIndex={activeIndex}
            teams={suggestionTeams}
            inputRef={inputRef}
            onQueryChange={onQueryChange}
            onKeyDown={onKeyDown}
            onSelectTeam={onSelectTeam}
            onOpen={onOpenSuggestions}
            onClose={onCloseSuggestions}
          />
          <AvailableTeamsCatalog
            teams={filteredTeams}
            selectedIds={selectedIds}
            quickFilter={quickFilter}
            onQuickFilterChange={onQuickFilterChange}
            onSelectTeam={onSelectTeam}
            emptyMessage={availableTeamsEmptyMessage}
          />
        </SearchSection>

        <SelectedSection>
          <SelectedHeader>
            Seleções Confirmadas ({selectedTeams.length}/{requiredTeamCount})
          </SelectedHeader>
          <AssistButton onClick={onFillSelection}>Preencher Automaticamente</AssistButton>
          <SelectedTeamsPanel
            teams={selectedTeams}
            requiredTeamCount={requiredTeamCount}
            onRemoveTeam={onRemoveTeam}
            onClearSelection={onClearSelection}
          />
        </SelectedSection>
      </OverlayGrid>
    </SelectionOverLayer>
  );
});

const SelectionOverLayer = styled.section`
  margin-top: 0px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: ${({ theme }) => theme.shadows.panel};
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0;
    padding: 24px 16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const OverlayTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 20px;
  }
`;

const CloseOverlay = styled.button`
  height: 48px;
  padding: 0 32px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.headerText};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`;

const OverlayGrid = styled.div`
  display: grid;
  gap: 48px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 32px;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SearchHeader = styled.h3`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
`;

const SelectedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SelectedHeader = styled.h3`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
`;

const AssistButton = styled.button`
  height: 48px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border: 2px dashed ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
