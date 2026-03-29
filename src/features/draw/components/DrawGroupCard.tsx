import { memo, type CSSProperties } from 'react';
import styled, { keyframes } from 'styled-components';

import type { Group } from '../../../types';
import { groupLabel } from '../utils/groupLabel';
import { TeamFlag } from './teamVisuals';

interface DrawGroupCardProps {
  group: Group;
  index: number;
}

export const DrawGroupCard = memo(function DrawGroupCard({ group, index }: DrawGroupCardProps) {
  const label = groupLabel(index);
  const animationStyle = {
    '--enter-delay': `${index * 90}ms`
  } as CSSProperties;

  return (
    <Card role="region" aria-label={label} style={animationStyle}>
      <CardHeader>
        <GroupLabelText>{label}</GroupLabelText>
        <StatusDot aria-hidden="true" />
      </CardHeader>

      <TeamList>
        {group.teams.map((team, idx) => (
          <TeamRow key={team.id} $isLast={idx === group.teams.length - 1}>
            <TeamInfo>
              <TeamFlag code={team.code} teamName={team.name} size="md" />
              <TeamNameText>{team.name}</TeamNameText>
              {team.pot ? <PotBadge>P{team.pot}</PotBadge> : null}
            </TeamInfo>
            <ConfedPill data-confed={team.confederation}>{team.confederation}</ConfedPill>
          </TeamRow>
        ))}
      </TeamList>
    </Card>
  );
});

const cardEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  animation: ${cardEnter} ${({ theme }) => theme.motion.slow} ${({ theme }) => theme.motion.easing}
    both;
  animation-delay: var(--enter-delay, 0ms);
  transition:
    transform ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing},
    box-shadow ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.easing},
    border-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.panel};
    border-color: ${({ theme }) => theme.colors.accentSoft};
  }

  @media (max-width: 600px) {
    border-radius: 8px;
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.accentStrong} 100%
  );
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    padding: 10px 16px;
  }
`;

const GroupLabelText = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading};
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.headerText};
  margin: 0;
  letter-spacing: -0.01em;

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.headerText};
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  opacity: 0.85;
`;

const TeamList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeamRow = styled.div<{ $isLast: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: ${({ $isLast, theme }) => ($isLast ? 'none' : `1px solid ${theme.colors.line}`)};
  transition:
    background-color ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing},
    padding-left ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.easing};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceAlt};
    padding-left: 24px;
  }

  @media (max-width: 600px) {
    padding: 12px 16px;

    &:hover {
      padding-left: 16px;
    }
  }
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const PotBadge = styled.span`
  font-size: 10px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.support};
  background-color: ${({ theme }) => theme.colors.supportSoft};
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
`;

const TeamNameText = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;

  @media (max-width: 600px) {
    font-size: 14px;
    font-weight: 700;
  }
`;

const ConfedPill = styled.span`
  font-size: 9px;
  font-weight: 900;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &[data-confed='UEFA'] {
    background-color: #e8f0fe;
    color: #003d8a;
  }

  &[data-confed='CONMEBOL'] {
    background-color: #e6f9ed;
    color: #14532d;
  }

  &[data-confed='CAF'] {
    background-color: #fee2e2;
    color: #7f1d1d;
  }

  &[data-confed='AFC'] {
    background-color: #ede9fe;
    color: #4c1d95;
  }

  &[data-confed='CONCACAF'] {
    background-color: #fef3c7;
    color: #78350f;
  }

  &[data-confed='OFC'] {
    background-color: #e6f7f4;
    color: #0f4f4a;
  }
`;
