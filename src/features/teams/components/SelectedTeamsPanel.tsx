import styled from 'styled-components';

import type { Team } from '../../../types';
import { TeamFlag } from '../../draw/components/teamVisuals';

interface SelectedTeamsPanelProps {
  teams: Team[];
  requiredTeamCount: number;
  onRemoveTeam: (teamId: string) => void;
  onClearSelection: () => void;
}

interface SelectedTeamItemProps {
  team: Team;
  onRemoveTeam: (teamId: string) => void;
}

function SelectedTeamItem({ team, onRemoveTeam }: SelectedTeamItemProps) {
  return (
    <SelectedItem>
      <TeamInfo>
        <TeamFlag code={team.code} teamName={team.name} size="sm" />
        <TeamSummary>
          <strong>{team.name}</strong>
          <span>{team.confederation}</span>
        </TeamSummary>
      </TeamInfo>
      <RemoveButton
        type="button"
        onClick={() => onRemoveTeam(team.id)}
        aria-label={`Remover ${team.name}`}
      />
    </SelectedItem>
  );
}

export function SelectedTeamsPanel({
  teams,
  requiredTeamCount,
  onRemoveTeam,
  onClearSelection
}: SelectedTeamsPanelProps) {
  return (
    <Panel aria-label="Participantes selecionados">
      <PanelHeader>
        <PanelTitle>
          VAGAS PREENCHIDAS ({teams.length}/{requiredTeamCount})
        </PanelTitle>
        <ClearButton type="button" onClick={onClearSelection} disabled={teams.length === 0}>
          Limpar tudo
        </ClearButton>
      </PanelHeader>

      {teams.length === 0 ? (
        <EmptyState>Nenhum participante selecionado ainda.</EmptyState>
      ) : (
        <SelectedList>
          {teams.map((team) => (
            <li key={team.id}>
              <SelectedTeamItem team={team} onRemoveTeam={onRemoveTeam} />
            </li>
          ))}
        </SelectedList>
      )}
    </Panel>
  );
}

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h3`
  font-size: 11px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.secondary};
  letter-spacing: 0.1em;
  margin: 0;
`;

const ClearButton = styled.button`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dangerText};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedList = styled.ul`
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

const SelectedItem = styled.div`
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.soft};
  }
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamSummary = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 14px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 10px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.secondary};
    text-transform: uppercase;
  }
`;

const RemoveButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerBg};
    color: ${({ theme }) => theme.colors.dangerText};
    border-color: ${({ theme }) => theme.colors.dangerBorder};
  }

  &::after {
    content: 'close';
    font-family: 'Material Symbols Rounded';
    font-size: 18px;
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
