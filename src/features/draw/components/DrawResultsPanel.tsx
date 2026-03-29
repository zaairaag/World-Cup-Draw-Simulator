import { memo } from 'react';
import styled, { keyframes } from 'styled-components';

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
          Gerado em {formatTimestamp(result.timestamp)}. Seed: {result.seed}.
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

const panelEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 48px;
  animation: ${panelEnter} ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.easing};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 24px;
    padding-top: 32px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding-top: 24px;
    gap: 16px;
  }
`;

const ResultHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 12px;
  }
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.05em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  span {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;

    span {
      font-size: 14px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 22px;
    gap: 8px;

    span {
      font-size: 13px;
    }
  }
`;

const StatusTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.headerText};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
  box-shadow: ${({ theme }) => theme.shadows.soft};

  .dot {
    width: 6px;
    height: 6px;
    background-color: ${({ theme }) => theme.colors.headerText};
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
    animation: ${pulse} 2s infinite;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  max-width: 800px;
  font-weight: 500;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 14px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 13px;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    gap: 16px;
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
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

const LoadingSpinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid ${({ theme }) => theme.colors.accentSoft};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
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
  background-color: ${({ theme }) => theme.colors.surface};
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
  background-color: ${({ theme }) => theme.colors.dangerBg};
  border-left: 4px solid ${({ theme }) => theme.colors.dangerBorder};
  color: ${({ theme }) => theme.colors.dangerText};
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 24px;
  border-radius: ${({ theme }) => theme.radii.md};
`;
