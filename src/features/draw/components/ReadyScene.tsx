import { memo } from 'react';
import styled from 'styled-components';

import type { DrawSettings, Team } from '../../../types';
import type { SessionActivityEntry } from '../hooks/useSessionActivity';
import { TeamFlag } from './teamVisuals';

interface ReadySceneProps {
  selectedTeams: Team[];
  requiredTeamCount: number;
  settings: DrawSettings;
  validationMessage: string | null;
  errorMessage: string | null;
  actionDisabled: boolean;
  onRunDraw: () => void;
  onEditSelection: () => void;
  activityEntries: SessionActivityEntry[];
}

export const ReadyScene = memo(function ReadyScene({
  selectedTeams,
  requiredTeamCount,
  settings,
  validationMessage,
  errorMessage,
  actionDisabled,
  onRunDraw,
  onEditSelection,
  activityEntries
}: ReadySceneProps) {
  const featuredTeams = selectedTeams.slice(0, 12);
  const remainingCount = selectedTeams.length - featuredTeams.length;
  const isReady =
    selectedTeams.length === requiredTeamCount && validationMessage === null && !actionDisabled;
  const statusMessage = isReady
    ? `${requiredTeamCount} seleções prontas para o sorteio.`
    : (validationMessage ?? `Selecione ${requiredTeamCount} seleções para sortear.`);

  return (
    <Container>
      <HeroSection>
        <HeroLeft>
          <HeroEyebrow>FIFA WORLD CUP 2026</HeroEyebrow>
          <HeroTitle>Simulador do Sorteio</HeroTitle>
          <HeroDescription>
            Monte a fase de grupos com 32 seleções, ajuste as regras do sorteio e gere combinações
            automáticas para revisar os grupos.
          </HeroDescription>
        </HeroLeft>

        <StatusBadge>
          <StatusLabel>STATUS</StatusLabel>
          <StatusValue>
            <span className="current">{selectedTeams.length}</span>
            <span className="divider">/ {requiredTeamCount}</span>
          </StatusValue>
          <StatusTag $ready={isReady}>
            <span className="material-symbols-rounded" aria-hidden="true">
              {isReady ? 'check_circle' : 'hourglass_empty'}
            </span>
            {isReady ? 'PRONTO' : 'PENDENTE'}
          </StatusTag>
        </StatusBadge>
      </HeroSection>

      <MainGrid>
        <ConfigColumn>
          <ConfigCard>
            <CardHeader>
              <span className="material-symbols-rounded" aria-hidden="true">
                settings
              </span>
              Configurações do Torneio
            </CardHeader>
            <ConfigRow>
              <span className="label">Grupos</span>
              <span className="value">{settings.numberOfGroups}</span>
            </ConfigRow>
            <ConfigRow>
              <span className="label">Times por grupo</span>
              <span className="value">{settings.teamsPerGroup}</span>
            </ConfigRow>

            <ValidationBox $ready={isReady} role="status" aria-live="polite">
              <span className="material-symbols-rounded" aria-hidden="true">
                verified
              </span>
              {statusMessage}
            </ValidationBox>

            {errorMessage ? <Alert role="alert">{errorMessage}</Alert> : null}

            <DrawButton onClick={onRunDraw} disabled={actionDisabled}>
              SORTEAR GRUPOS
              <span className="material-symbols-rounded" aria-hidden="true">
                auto_awesome
              </span>
            </DrawButton>
          </ConfigCard>

          <LogBox role="log" aria-live="polite" aria-atomic="false">
            <LogHeader>Log de Atividade</LogHeader>
            <LogList>
              {activityEntries.map((entry) => (
                <LogItem key={entry.id}>{entry.message}</LogItem>
              ))}
            </LogList>
          </LogBox>
        </ConfigColumn>

        <TeamsColumn>
          <TeamsCard>
            <TeamsHeader>
              <TeamsHeaderLeft>
                <TeamsEyebrow>LISTA DE SELEÇÕES</TeamsEyebrow>
                <TeamsTitle>Times Prontos para o Sorteio</TeamsTitle>
              </TeamsHeaderLeft>
              <EditButton onClick={onEditSelection} aria-label="Editar lista de seleções">
                <span className="material-symbols-rounded" aria-hidden="true">
                  edit
                </span>
                Editar Lista
              </EditButton>
            </TeamsHeader>

            <TeamsGrid>
              {featuredTeams.map((team) => (
                <TeamMiniCard key={team.id}>
                  <TeamFlag code={team.code} teamName={team.name} size="md" />
                  <TeamConfedText>{team.confederation}</TeamConfedText>
                  <TeamNameText>{team.name}</TeamNameText>
                </TeamMiniCard>
              ))}

              {remainingCount > 0 && (
                <TeamOverflowCard>
                  <div className="avatar-stack">+{remainingCount}</div>
                  <span>Outras {remainingCount} seleções confirmadas</span>
                </TeamOverflowCard>
              )}
            </TeamsGrid>
          </TeamsCard>
        </TeamsColumn>
      </MainGrid>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeroSection = styled.header`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 48px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 109, 49, 0.05), transparent);
    pointer-events: none;
  }

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
  }
`;

const HeroLeft = styled.div`
  max-width: 600px;
  position: relative;
  z-index: 1;
`;

const HeroEyebrow = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.support};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 8px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 950;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 32px;
  }
`;

const HeroDescription = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 15px;
  }
`;

const StatusBadge = styled.div`
  background-color: white;
  padding: 24px 32px;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatusLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const StatusValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;

  .current {
    font-size: 32px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.accent};
  }

  .divider {
    font-size: 18px;
    font-weight: 700;
    color: #bccaba;
  }
`;

const StatusTag = styled.div<{ $ready: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 900;
  color: ${({ $ready, theme }) => ($ready ? theme.colors.accent : theme.colors.secondary)};

  .material-symbols-rounded {
    font-size: 18px;
  }
`;

const MainGrid = styled.div`
  display: grid;
  gap: 32px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 360px 1fr;
  }
`;

const ConfigColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ConfigCard = styled.section`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 32px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: ${({ theme }) => theme.shadows.soft};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CardHeader = styled.h2`
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;

  .material-symbols-rounded {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const ConfigRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radii.md};

  .label {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.secondary};
  }

  .value {
    font-size: 18px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ValidationBox = styled.div<{ $ready: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ $ready }) =>
    $ready ? 'rgba(0, 169, 80, 0.1)' : 'rgba(255, 143, 58, 0.14)'};
  color: ${({ $ready, theme }) => ($ready ? theme.colors.accentDark : '#8a4b00')};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 14px;
  font-weight: 800;

  .material-symbols-rounded {
    color: ${({ $ready, theme }) => ($ready ? theme.colors.accent : '#ff8f3a')};
  }
`;

const Alert = styled.div`
  padding: 16px 18px;
  background-color: #fef2f2;
  border-left: 4px solid #b91c1c;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: #b91c1c;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
`;

const DrawButton = styled.button`
  height: 64px;
  width: 100%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accentDark},
    ${({ theme }) => theme.colors.accent}
  );
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 18px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px rgba(0, 109, 49, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LogBox = styled.div`
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const LogHeader = styled.h3`
  font-size: 11px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogItem = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background-color: ${({ theme }) => theme.colors.accent};
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }
`;

const TeamsColumn = styled.div`
  height: 100%;
`;

const TeamsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 40px;
  height: 100%;
`;

const TeamsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const TeamsHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TeamsEyebrow = styled.span`
  font-size: 11px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.support};
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const TeamsTitle = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 22px;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.support};
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const TeamMiniCard = styled.div`
  background-color: white;
  padding: 24px 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
`;

const TeamConfedText = styled.span`
  font-size: 10px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.accent};
  text-transform: uppercase;
`;

const TeamNameText = styled.span`
  font-size: 14px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
`;

const TeamOverflowCard = styled.div`
  grid-column: 1 / -1;
  margin-top: 16px;
  padding: 24px;
  background-color: #eeeeee;
  border: 2px dashed #bccaba;
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .avatar-stack {
    width: 40px;
    height: 40px;
    background-color: #dadada;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
    border: 2px solid white;
  }

  span {
    font-size: 11px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.secondary};
    text-transform: uppercase;
  }
`;
