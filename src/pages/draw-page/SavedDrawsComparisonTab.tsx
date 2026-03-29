import styled from 'styled-components';

import type { SavedDrawComparison } from '../../features/draw/history/compareSavedDraws';
import type { SavedDrawHistoryEntry } from '../../features/draw/history/savedDrawHistory';
import { SavedDrawComparisonPanel } from '../../features/draw/components/SavedDrawComparisonPanel';

interface SavedDrawsComparisonTabProps {
  savedHistory: SavedDrawHistoryEntry[];
  comparisonSelection: {
    leftId: string | null;
    rightId: string | null;
  };
  comparison: SavedDrawComparison | null;
  onComparisonSelectionChange: (side: 'left' | 'right', entryId: string) => void;
  onRestoreSavedDraw: (entryId: string) => void;
}

export function SavedDrawsComparisonTab({
  savedHistory,
  comparisonSelection,
  comparison,
  onComparisonSelectionChange,
  onRestoreSavedDraw
}: SavedDrawsComparisonTabProps) {
  const canCompare = savedHistory.length >= 2;

  return (
    <View>
      <ViewHeader>
        <ViewTitle>Comparar sorteios</ViewTitle>
        <ViewDescription>
          Selecione dois sorteios salvos para comparar as diferenças grupo a grupo.
        </ViewDescription>
      </ViewHeader>

      {!canCompare ? (
        <EmptyCard>
          <EmptyIcon className="material-symbols-rounded">compare_arrows</EmptyIcon>
          <EmptyTitle>Comparação indisponível</EmptyTitle>
          <EmptyText>Salve pelo menos dois sorteios para utilizar a comparação.</EmptyText>
        </EmptyCard>
      ) : (
        <>
          <SelectorsCard>
            <SelectorsGrid>
              <SelectorField>
                <SelectorLabel htmlFor="comparison-left">Sorteio A</SelectorLabel>
                <SelectorSelect
                  id="comparison-left"
                  aria-label="Sorteio A"
                  value={comparisonSelection.leftId ?? ''}
                  onChange={(event) => onComparisonSelectionChange('left', event.target.value)}
                >
                  <option value="">Selecione o sorteio A</option>
                  {savedHistory.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label} · {entry.summary}
                    </option>
                  ))}
                </SelectorSelect>
              </SelectorField>

              <SelectorField>
                <SelectorLabel htmlFor="comparison-right">Sorteio B</SelectorLabel>
                <SelectorSelect
                  id="comparison-right"
                  aria-label="Sorteio B"
                  value={comparisonSelection.rightId ?? ''}
                  onChange={(event) => onComparisonSelectionChange('right', event.target.value)}
                >
                  <option value="">Selecione o sorteio B</option>
                  {savedHistory.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label} · {entry.summary}
                    </option>
                  ))}
                </SelectorSelect>
              </SelectorField>
            </SelectorsGrid>
          </SelectorsCard>

          {comparison ? (
            <SavedDrawComparisonPanel
              comparison={comparison}
              onRestoreLeft={() => onRestoreSavedDraw(comparison.left.id)}
              onRestoreRight={() => onRestoreSavedDraw(comparison.right.id)}
            />
          ) : (
            <HintCard>
              <span className="material-symbols-rounded">info</span>
              Selecione dois sorteios acima para ver a comparação lado a lado.
            </HintCard>
          )}
        </>
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

const SelectorsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const SelectorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const SelectorField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectorLabel = styled.label`
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SelectorSelect = styled.select`
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`;

const HintCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};

  .material-symbols-rounded {
    font-size: 20px;
    opacity: 0.6;
  }
`;
