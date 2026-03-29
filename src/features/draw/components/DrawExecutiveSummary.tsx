import { memo } from 'react';
import styled from 'styled-components';

import { groupLabel } from '../utils/groupLabel';
import type { ExecutiveDrawSummary } from '../utils/summarizeDrawResult';

interface DrawExecutiveSummaryProps {
  summary: ExecutiveDrawSummary;
}

function formatPolicyLabel(policy: ExecutiveDrawSummary['confederationPolicy']) {
  return policy === 'fifa-like' ? 'Regra FIFA-like' : 'Sem restrição';
}

function formatGroupId(groupId: string) {
  const match = /^group-([a-z]+)$/i.exec(groupId);

  if (!match) {
    return groupId;
  }

  const encodedIndex = match[1];

  if (!encodedIndex) {
    return groupId;
  }

  const index = encodedIndex.charCodeAt(0) - 97;

  if (index < 0) {
    return groupId;
  }

  return groupLabel(index);
}

export const DrawExecutiveSummary = memo(function DrawExecutiveSummary({
  summary
}: DrawExecutiveSummaryProps) {
  return (
    <SummarySection aria-label="Resumo executivo do sorteio">
      <SummaryHeader>
        <SummaryEyebrow>Leitura rápida</SummaryEyebrow>
        <SummaryTitle>Resumo executivo do sorteio</SummaryTitle>
      </SummaryHeader>

      <MetricsGrid>
        <MetricCard>
          <strong>{summary.totalGroups}</strong>
          <span>grupos gerados</span>
        </MetricCard>
        <MetricCard>
          <strong>{summary.teamsPerGroup}</strong>
          <span>equipes por grupo</span>
        </MetricCard>
        <MetricCard>
          <strong>{formatPolicyLabel(summary.confederationPolicy)}</strong>
          <span>política ativa</span>
        </MetricCard>
        <MetricCard>
          <strong>{summary.uefaDoubleGroupCount}</strong>
          <span>grupos com 2 UEFA</span>
        </MetricCard>
      </MetricsGrid>

      <DetailsGrid>
        <DetailCard>
          <DetailTitle>Distribuição por confederação</DetailTitle>
          <DistributionList>
            {Object.entries(summary.confederationCounts).map(([confederation, count]) => (
              <li key={confederation}>
                <span>{confederation}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </DistributionList>
        </DetailCard>

        <DetailCard>
          <DetailTitle>Maior diversidade por grupo</DetailTitle>
          <DetailText>{summary.mostDiverseGroupIds.map(formatGroupId).join(', ')}</DetailText>
        </DetailCard>
      </DetailsGrid>
    </SummarySection>
  );
});

const SummarySection = styled.section`
  display: grid;
  gap: 20px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentSoft},
    ${({ theme }) => theme.colors.supportSoft}
  );
  border: 1px solid ${({ theme }) => theme.colors.line};

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 16px;
    gap: 16px;
  }
`;

const SummaryHeader = styled.div`
  display: grid;
  gap: 4px;
`;

const SummaryEyebrow = styled.span`
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.support};
`;

const SummaryTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
`;

const MetricsGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const MetricCard = styled.div`
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surfaceGlass};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  strong {
    font-size: 1.25rem;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.06em;

    @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
      font-size: 0.7rem;
    }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  }
`;

const DetailCard = styled.div`
  display: grid;
  gap: 12px;
  padding: 18px 20px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surfaceGlass};

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    padding: 16px;
  }
`;

const DetailTitle = styled.h3`
  margin: 0;
  font-size: 0.88rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const DistributionList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    font-size: 0.92rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  strong {
    font-size: 1rem;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const DetailText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;
