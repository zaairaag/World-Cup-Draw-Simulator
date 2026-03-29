import styled from 'styled-components';

import type { SavedDrawHistoryEntry } from '../../features/draw/history/savedDrawHistory';

interface SavedDrawsHistoryTabProps {
  savedHistory: SavedDrawHistoryEntry[];
  onRestoreSavedDraw: (entryId: string) => void;
}

function formatSavedAt(savedAt: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(savedAt);
}

export function SavedDrawsHistoryTab({
  savedHistory,
  onRestoreSavedDraw
}: SavedDrawsHistoryTabProps) {
  const hasHistory = savedHistory.length > 0;

  return (
    <View>
      <ViewHeader>
        <ViewTitle>Sorteios salvos</ViewTitle>
        <ViewDescription>
          {hasHistory
            ? `${savedHistory.length} ${savedHistory.length === 1 ? 'sorteio guardado' : 'sorteios guardados'} no dispositivo.`
            : 'Nenhum sorteio guardado ainda.'}
        </ViewDescription>
      </ViewHeader>

      {!hasHistory ? (
        <EmptyCard>
          <EmptyIcon className="material-symbols-rounded">history</EmptyIcon>
          <EmptyTitle>Nenhum sorteio salvo ainda</EmptyTitle>
          <EmptyText>
            Depois de sortear, use &quot;Salvar resultado&quot; no simulador para guardar um cenário
            aqui.
          </EmptyText>
        </EmptyCard>
      ) : (
        <HistoryList>
          {savedHistory.map((entry, index) => (
            <HistoryCard key={entry.id}>
              <CardIndex>{index + 1}</CardIndex>
              <CardContent>
                <CardLabel>{entry.label}</CardLabel>
                <CardDetails>
                  <DetailChip>
                    <span className="material-symbols-rounded">calendar_today</span>
                    {formatSavedAt(entry.savedAt)}
                  </DetailChip>
                  <DetailChip>
                    <span className="material-symbols-rounded">grid_view</span>
                    {entry.summary}
                  </DetailChip>
                </CardDetails>
              </CardContent>
              <CardAction>
                <RestoreButton type="button" onClick={() => onRestoreSavedDraw(entry.id)}>
                  Abrir sorteio salvo
                </RestoreButton>
              </CardAction>
            </HistoryCard>
          ))}
        </HistoryList>
      )}
    </View>
  );
}

const View = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 48px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px solid ${({ theme }) => theme.colors.line};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px 16px;
    border-radius: 0;
    gap: 24px;
  }
`;

const ViewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ViewTitle = styled.h2`
  margin: 0;
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const ViewDescription = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }
`;

const EmptyCard = styled.div`
  padding: 48px 32px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px dashed ${({ theme }) => theme.colors.line};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const EmptyIcon = styled.span`
  font-size: 48px;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 360px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.line};
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px;
  }
`;

const CardIndex = styled.span`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.headerText};
  font-size: 14px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardLabel = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const DetailChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};

  .material-symbols-rounded {
    font-size: 14px;
    opacity: 0.6;
  }
`;

const CardAction = styled.div`
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
  }
`;

const RestoreButton = styled.button`
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentDark};
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentSoft};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;
