import styled from 'styled-components';

import type { SavedDrawComparison } from '../history/compareSavedDraws';

interface SavedDrawComparisonPanelProps {
  comparison: SavedDrawComparison;
  onRestoreLeft: () => void;
  onRestoreRight: () => void;
}

function formatSavedAt(savedAt: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(savedAt);
}

function formatGroupName(index: number) {
  return `Grupo ${String.fromCharCode(65 + index)}`;
}

export function SavedDrawComparisonPanel({
  comparison,
  onRestoreLeft,
  onRestoreRight
}: SavedDrawComparisonPanelProps) {
  return (
    <Container aria-label="Comparação de sorteios salvos">
      <ColumnsHeader>
        <HeaderCard>
          <HeaderEyebrow>Sorteio A</HeaderEyebrow>
          <HeaderMeta>
            <strong>{comparison.left.label}</strong>
            <span>{formatSavedAt(comparison.left.savedAt)}</span>
            <span>{comparison.left.summary}</span>
          </HeaderMeta>
          <RestoreButton type="button" onClick={onRestoreLeft}>
            Restaurar este sorteio
          </RestoreButton>
        </HeaderCard>

        <HeaderCard>
          <HeaderEyebrow>Sorteio B</HeaderEyebrow>
          <HeaderMeta>
            <strong>{comparison.right.label}</strong>
            <span>{formatSavedAt(comparison.right.savedAt)}</span>
            <span>{comparison.right.summary}</span>
          </HeaderMeta>
          <RestoreButton type="button" onClick={onRestoreRight}>
            Restaurar este sorteio
          </RestoreButton>
        </HeaderCard>
      </ColumnsHeader>

      <GroupRows>
        {comparison.groups.map((group, index) => (
          <GroupRow key={group.groupId} $changed={group.changed}>
            <GroupColumn>
              <GroupName>{formatGroupName(index)}</GroupName>
              <TeamList>
                {group.leftGroup?.teams.map((team) => (
                  <TeamItem key={`${group.groupId}-${team.id}-left`}>{team.name}</TeamItem>
                )) ?? <EmptyState>Sem grupo correspondente</EmptyState>}
              </TeamList>
            </GroupColumn>

            <StatePill $changed={group.changed}>{group.changed ? 'Alterado' : 'Igual'}</StatePill>

            <GroupColumn>
              <GroupName>{formatGroupName(index)}</GroupName>
              <TeamList>
                {group.rightGroup?.teams.map((team) => (
                  <TeamItem key={`${group.groupId}-${team.id}-right`}>{team.name}</TeamItem>
                )) ?? <EmptyState>Sem grupo correspondente</EmptyState>}
              </TeamList>
            </GroupColumn>
          </GroupRow>
        ))}
      </GroupRows>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
`;

const ColumnsHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const HeaderCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
`;

const HeaderEyebrow = styled.span`
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.support};
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 12px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const RestoreButton = styled.button`
  height: 36px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentDark};
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
`;

const GroupRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupRow = styled.div<{ $changed: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ $changed, theme }) =>
    $changed ? theme.colors.warningBg : theme.colors.surface};
  border: 1px solid
    ${({ $changed, theme }) => ($changed ? theme.colors.warningBorder : theme.colors.line)};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const GroupColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupName = styled.span`
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TeamItem = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyState = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const StatePill = styled.span<{ $changed: boolean }>`
  align-self: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  background-color: ${({ $changed, theme }) =>
    $changed ? theme.colors.warningBg : theme.colors.accentSoft};
  color: ${({ $changed, theme }) =>
    $changed ? theme.colors.warningText : theme.colors.accentDark};
`;
