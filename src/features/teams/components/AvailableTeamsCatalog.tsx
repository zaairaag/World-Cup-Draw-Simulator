import styled from 'styled-components';

import type { Team } from '../../../types';
import { TeamFlag } from '../../draw/components/teamVisuals';
import type { TeamQuickFilter } from '../utils/filterTeams';

const QUICK_FILTER_OPTIONS: { value: TeamQuickFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'selected', label: 'Selecionadas' },
  { value: 'UEFA', label: 'UEFA' },
  { value: 'CONMEBOL', label: 'CONMEBOL' },
  { value: 'CONCACAF', label: 'CONCACAF' },
  { value: 'CAF', label: 'CAF' },
  { value: 'AFC', label: 'AFC' },
  { value: 'OFC', label: 'OFC' }
];

interface AvailableTeamsCatalogProps {
  teams: Team[];
  selectedIds: string[];
  quickFilter: TeamQuickFilter;
  onQuickFilterChange: (filter: TeamQuickFilter) => void;
  onSelectTeam: (teamId: string) => void;
  emptyMessage: string;
}

interface TeamCatalogItemProps {
  team: Team;
  isSelected: boolean;
  onSelectTeam: (teamId: string) => void;
}

function TeamCatalogItem({ team, isSelected, onSelectTeam }: TeamCatalogItemProps) {
  return (
    <CatalogButton type="button" onClick={() => onSelectTeam(team.id)} disabled={isSelected}>
      <TeamInfo>
        <TeamFlag code={team.code} teamName={team.name} size="sm" />
        <TeamName>{team.name}</TeamName>
      </TeamInfo>
      <TeamMeta>
        <span>{team.confederation}</span>
        {isSelected ? <strong>Selecionada</strong> : null}
      </TeamMeta>
    </CatalogButton>
  );
}

export function AvailableTeamsCatalog({
  teams,
  selectedIds,
  quickFilter,
  onQuickFilterChange,
  onSelectTeam,
  emptyMessage
}: AvailableTeamsCatalogProps) {
  return (
    <CatalogSection>
      <QuickFilterBar aria-label="Filtros rápidos do catálogo">
        {QUICK_FILTER_OPTIONS.map((option) => (
          <QuickFilterButton
            key={option.value}
            type="button"
            $active={quickFilter === option.value}
            aria-pressed={quickFilter === option.value}
            onClick={() => onQuickFilterChange(option.value)}
          >
            {option.label}
          </QuickFilterButton>
        ))}
      </QuickFilterBar>

      {teams.length === 0 ? (
        <EmptyState>{emptyMessage}</EmptyState>
      ) : (
        <CatalogList>
          {teams.map((team) => (
            <li key={team.id}>
              <TeamCatalogItem
                team={team}
                isSelected={selectedIds.includes(team.id)}
                onSelectTeam={onSelectTeam}
              />
            </li>
          ))}
        </CatalogList>
      )}
    </CatalogSection>
  );
}

const CatalogSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuickFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickFilterButton = styled.button<{ $active: boolean }>`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(0, 169, 80, 0.35)' : 'rgba(0, 0, 0, 0.08)')};
  background-color: ${({ $active }) => ($active ? 'rgba(0, 169, 80, 0.12)' : 'white')};
  color: ${({ $active, theme }) => ($active ? theme.colors.accentDark : theme.colors.textMuted)};
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
`;

const CatalogList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
`;

const CatalogButton = styled.button`
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
    border-color: rgba(0, 169, 80, 0.14);
    background-color: rgba(0, 169, 80, 0.06);
  }
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamName = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const TeamMeta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  span {
    font-size: 10px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.secondary};
    text-transform: uppercase;
  }

  strong {
    font-size: 10px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.accentDark};
    text-transform: uppercase;
  }
`;

const EmptyState = styled.div`
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
`;
