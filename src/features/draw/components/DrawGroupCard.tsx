import { memo } from 'react';
import styled from 'styled-components';

import type { Group } from '../../../types';
import { groupLabel } from '../utils/groupLabel';
import { TeamFlag } from './teamVisuals';

interface DrawGroupCardProps {
  group: Group;
  index: number;
}

export const DrawGroupCard = memo(function DrawGroupCard({ group, index }: DrawGroupCardProps) {
  const label = groupLabel(index);

  return (
    <Card role="region" aria-label={label}>
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
            </TeamInfo>
            <ConfedPill data-confed={team.confederation}>{team.confederation}</ConfedPill>
          </TeamRow>
        ))}
      </TeamList>
    </Card>
  );
});

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 169, 80, 0.2);
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
  color: white;
  margin: 0;
  letter-spacing: -0.01em;

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  opacity: 0.8;
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
  border-bottom: ${({ $isLast }) => ($isLast ? 'none' : '1px solid #f8f8f8')};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fdfa;
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
