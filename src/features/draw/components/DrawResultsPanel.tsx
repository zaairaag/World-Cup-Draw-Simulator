import { memo } from 'react';
import styled from 'styled-components';

import type { DrawResult, DrawStatus, SwapPayload } from '../../../types';

import { DrawGroupCard } from './DrawGroupCard';
import { DrawExecutiveSummary } from './DrawExecutiveSummary';
import { DrawSwapControls } from './DrawSwapControls';
import { summarizeDrawResult } from '../utils/summarizeDrawResult';

interface DrawResultsPanelProps {
  status: DrawStatus;
  result: DrawResult | null;
  error: string | null;
  canUndoSwap: boolean;
  onUndoLastSwap: () => void;
  onSwapTeams: (payload: SwapPayload) => void;
  onClearError: () => void;
}

function formatTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(timestamp);
}

export const DrawResultsPanel = memo(function DrawResultsPanel({
  status,
  result,
  error,
  canUndoSwap,
  onUndoLastSwap,
  onSwapTeams,
  onClearError
}: DrawResultsPanelProps) {
  const summary = result ? summarizeDrawResult(result) : null;

  if (status === 'loading') {
    return (
      <LoadingState role="status" aria-live="assertive" aria-label="Sorteio em andamento">
        <LoadingSpinner />
        <LoadingTitle>PROCESSO DE SORTEIO</LoadingTitle>
        <LoadingText>Distribuindo as seleções conforme as regras configuradas...</LoadingText>
      </LoadingState>
    );
  }

  if (result === null) {
    return (
      <EmptyState>
        <span className="material-symbols-rounded" aria-hidden="true">
          info
        </span>
        Selecione 32 seleções para sortear.
      </EmptyState>
    );
  }

  return (
    <Panel>
      <ResultHeader>
        <Breadcrumb aria-label="Navegação de contexto">
          <span>ge</span>
          <span className="material-symbols-rounded" aria-hidden="true">
            chevron_right
          </span>
          <span>Copa do Mundo</span>
          <span className="material-symbols-rounded" aria-hidden="true">
            chevron_right
          </span>
          <span className="active">Resultado</span>
        </Breadcrumb>

        <TitleRow>
          <PageTitle>
            Grupos do Sorteio
            <span>· {result.groups.length} grupos</span>
          </PageTitle>
          <StatusTag>
            <span className="dot" aria-hidden="true" />
            SORTEADO
          </StatusTag>
        </TitleRow>

        <Description>
          Confira o resultado da simulação com {result.groups.length} grupos gerados e{' '}
          {result.settings.teamsPerGroup} equipes por grupo.
          {` `}
          Gerado em {formatTimestamp(result.timestamp)}.
        </Description>
      </ResultHeader>

      {error ? <Alert role="alert">{error}</Alert> : null}

      {summary ? <DrawExecutiveSummary summary={summary} /> : null}

      <GroupsGrid>
        {result.groups.map((group, index) => (
          <DrawGroupCard key={group.id} group={group} index={index} />
        ))}
      </GroupsGrid>

      <DrawSwapControls
        groups={result.groups}
        canUndoSwap={canUndoSwap}
        onUndoLastSwap={onUndoLastSwap}
        onSwapTeams={onSwapTeams}
        onClearError={onClearError}
      />
    </Panel>
  );
});

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeIn 0.4s ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 24px;
  }
`;

const ResultHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
  letter-spacing: 0.05em;

  .material-symbols-rounded {
    font-size: 14px;
    opacity: 0.5;
  }

  span:not(.active):hover {
    color: #444;
    cursor: pointer;
  }

  .active {
    color: ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: 600px) {
    font-size: 9px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 16px;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 48px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.05em;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;

  span {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 32px;

    span {
      font-size: 14px;
    }
  }
`;

const StatusTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 12px rgba(0, 169, 80, 0.2);

  .dot {
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px #fff;
    animation: pulse 2s infinite;

    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;

const Description = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  max-width: 800px;
  font-weight: 500;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
  }
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  text-align: center;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.xl};
`;

const LoadingSpinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid rgba(0, 169, 80, 0.1);
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingTitle = styled.h2`
  font-size: 14px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.1em;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 320px;
`;

const EmptyState = styled.div`
  padding: 64px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.xl};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-size: 18px;

  .material-symbols-rounded {
    font-size: 48px;
    opacity: 0.2;
  }
`;

const Alert = styled.div`
  padding: 20px 24px;
  background-color: #fef2f2;
  border-left: 4px solid #b91c1c;
  color: #b91c1c;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 24px;
`;
